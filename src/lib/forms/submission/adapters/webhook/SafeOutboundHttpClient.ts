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
  // 169.254.0.0/16 (Link-local)
  if (((longIp & 0xffff0000) >>> 0) === 0xa9fe0000) return true;
  // 0.0.0.0/8 (Current network)
  if (((longIp & 0xff000000) >>> 0) === 0x00000000) return true;
  
  return false;
}

function isPrivateIPv6(ip: string): boolean {
  // Simplistic check for standard IPv6 loopback and private blocks
  if (ip === '::1') return true;
  const lower = ip.toLowerCase();
  if (lower.startsWith('fc') || lower.startsWith('fd')) return true; // Unique local address
  if (lower.startsWith('fe8') || lower.startsWith('fe9') || lower.startsWith('fea') || lower.startsWith('feb')) return true; // Link-local
  // Checking for IPv4 mapped IPv6 (::ffff:127.0.0.1) is complex without a full parser, 
  // but Node's dns module generally resolves IPv4 mapped addresses as IPv4.
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
