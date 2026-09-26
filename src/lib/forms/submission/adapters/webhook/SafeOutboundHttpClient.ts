import * as http from 'http';
import * as https from 'https';
import * as dns from 'dns';
import * as net from 'net';
import { URL } from 'url';
import { 
  SafeOutboundHttpClient, 
  SafeOutboundHttpRequest, 
  SafeOutboundHttpResponse, 
  WEBHOOK_LIMITS 
} from './types';

// Converts an IPv4 string to a 32-bit integer for range checking
function ipToLong(ip: string): number {
  return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0) >>> 0;
}

// Checks if an IPv4 is in a private/reserved range
function isPrivateIPv4(ip: string): boolean {
  if (ip === '255.255.255.255') return true;
  const longIp = ipToLong(ip);

  // 127.0.0.0/8 (Loopback)
  if (((longIp & 0xff000000) >>> 0) === 0x7f000000) return true;
  // 10.0.0.0/8 (Private)
  if (((longIp & 0xff000000) >>> 0) === 0x0a000000) return true;
  // 172.16.0.0/12 (Private)
  if (((longIp & 0xfff00000) >>> 0) === 0xac100000) return true;
  // 192.168.0.0/16 (Private)
  if (((longIp & 0xffff0000) >>> 0) === 0xc0a80000) return true;
  // 169.254.0.0/16 (Link-local, incl. cloud metadata endpoints)
  if (((longIp & 0xffff0000) >>> 0) === 0xa9fe0000) return true;
  // 100.64.0.0/10 (Carrier-grade NAT / shared address space)
  if (((longIp & 0xffc00000) >>> 0) === 0x64400000) return true;
  // 0.0.0.0/8 (Current network)
  if (((longIp & 0xff000000) >>> 0) === 0x00000000) return true;

  return false;
}

// Turns two up-to-4-digit hex groups (the low 32 bits of an IPv6 address)
// into a dotted-decimal IPv4 string, e.g. ("7f00","1") -> "127.0.0.1".
function hexGroupsToIPv4(hi: string, lo: string): string {
  const hiNum = parseInt(hi || '0', 16);
  const loNum = parseInt(lo || '0', 16);
  return [(hiNum >> 8) & 0xff, hiNum & 0xff, (loNum >> 8) & 0xff, loNum & 0xff].join('.');
}

function isPrivateIPv6(ip: string): boolean {
  const lower = ip.toLowerCase();

  if (lower === '::1' || lower === '::') return true; // Loopback / unspecified

  // IPv4-mapped (::ffff:a.b.c.d or ::ffff:7f00:1) and the NAT64 well-known
  // prefix (64:ff9b::/96) both embed a real IPv4 address in the low 32
  // bits — resolve it and defer to the IPv4 check so a private/loopback
  // address can't sneak past the IPv6 branch in either notation.
  const dottedMatch = lower.match(/^(?:::ffff:|64:ff9b::)(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})$/);
  if (dottedMatch) return isPrivateIPv4(dottedMatch[1]);

  const hexMatch = lower.match(/^(?:::ffff:|64:ff9b::)([0-9a-f]{1,4}):([0-9a-f]{1,4})$/);
  if (hexMatch) return isPrivateIPv4(hexGroupsToIPv4(hexMatch[1], hexMatch[2]));

  if (lower.startsWith('fc') || lower.startsWith('fd')) return true; // fc00::/7 Unique local address
  if (lower.startsWith('fe8') || lower.startsWith('fe9') || lower.startsWith('fea') || lower.startsWith('feb')) return true; // fe80::/10 Link-local
  if (lower.startsWith('ff')) return true; // ff00::/8 Multicast
  if (lower.startsWith('2001:db8:')) return true; // Documentation range, never publicly routable

  return false;
}

export class NodeSafeOutboundHttpClient implements SafeOutboundHttpClient {
  
  public async execute(req: SafeOutboundHttpRequest): Promise<SafeOutboundHttpResponse> {
    return new Promise((resolve, reject) => {
      try {
        if (req.url.protocol !== 'https:') {
          return reject(new Error("SSRF Protection: Only HTTPS is allowed"));
        }

        const rawHostname = req.url.hostname;
        const hostname = rawHostname.startsWith('[') && rawHostname.endsWith(']') 
          ? rawHostname.slice(1, -1) 
          : rawHostname;

        if (net.isIPv4(hostname) && isPrivateIPv4(hostname)) {
          return reject(new Error(`SSRF Protection: Resolved IP ${hostname} is in a private/blocked IPv4 range`));
        }
        if (net.isIPv6(hostname) && isPrivateIPv6(hostname)) {
          return reject(new Error(`SSRF Protection: Resolved IP ${hostname} is in a private/blocked IPv6 range`));
        }

        const options: https.RequestOptions = {
          method: req.method,
          headers: req.headers,
          timeout: req.timeoutMs || WEBHOOK_LIMITS.defaultTimeoutMs,
          // Custom DNS Lookup to prevent SSRF and DNS Rebinding
          lookup: (hostname, dnsOptions, callback) => {
            dns.lookup(hostname, dnsOptions, (err, address, family) => {
              if (err) return callback(err, address, family);
              
              if (family === 4 && isPrivateIPv4(address as string)) {
                return callback(new Error(`SSRF Protection: Resolved IP ${address} is in a private/blocked IPv4 range`), '', 0);
              }
              if (family === 6 && isPrivateIPv6(address as string)) {
                return callback(new Error(`SSRF Protection: Resolved IP ${address} is in a private/blocked IPv6 range`), '', 0);
              }
              
              callback(null, address, family);
            });
          }
        };

        const request = https.request(req.url, options, (response) => {
          let body = '';
          let bodyBytes = 0;

          response.on('data', (chunk) => {
            bodyBytes += chunk.length;
            if (bodyBytes > WEBHOOK_LIMITS.maximumResponseBytes) {
              request.destroy(new Error(`Response exceeded maximum size of ${WEBHOOK_LIMITS.maximumResponseBytes} bytes`));
              return;
            }
            body += chunk;
          });

          response.on('end', () => {
            resolve({
              statusCode: response.statusCode || 500,
              headers: response.headers as Record<string, string>,
              bodySnippet: body.substring(0, 500) // Keep only a snippet for logging if needed
            });
          });
        });

        request.on('error', (e) => {
          reject(e);
        });

        request.on('timeout', () => {
          request.destroy(new Error("Request Timeout"));
        });

        // Ensure body doesn't exceed limit before sending
        const bodyBuffer = Buffer.from(req.body, 'utf-8');
        if (bodyBuffer.length > WEBHOOK_LIMITS.maximumBodyBytes) {
          throw new Error(`Request body exceeded maximum size of ${WEBHOOK_LIMITS.maximumBodyBytes} bytes`);
        }

        request.write(bodyBuffer);
        request.end();

      } catch (err) {
        reject(err);
      }
    });
  }
}
