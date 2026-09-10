import { describe, it, expect } from 'vitest';
import { NodeSafeOutboundHttpClient } from '../SafeOutboundHttpClient';
import { URL } from 'url';

describe('NodeSafeOutboundHttpClient (SSRF Protection)', () => {
  const client = new NodeSafeOutboundHttpClient();

  const createReq = (urlString: string) => ({
    url: new URL(urlString),
    method: "POST" as const,
    headers: {},
    body: "{}",
    timeoutMs: 1000
  });

  it('rejects HTTP URLs', async () => {
    await expect(client.execute(createReq('http://example.com')))
      .rejects.toThrow('SSRF Protection: Only HTTPS is allowed');
  });

  // Note: These tests try to actually resolve the domains.
  // We can use a public domain that resolves to 127.0.0.1 for testing,
  // like 'localtest.me' or '127.0.0.1.nip.io', but using direct IPs is safer for unit tests.
  
  it('rejects loopback IPv4', async () => {
    await expect(client.execute(createReq('https://127.0.0.1')))
      .rejects.toThrow('SSRF Protection: Resolved IP 127.0.0.1 is in a private/blocked IPv4 range');
  });

  it('rejects private IPv4 (10.x.x.x)', async () => {
    await expect(client.execute(createReq('https://10.0.0.1')))
      .rejects.toThrow('SSRF Protection: Resolved IP 10.0.0.1 is in a private/blocked IPv4 range');
  });

  it('rejects private IPv4 (192.168.x.x)', async () => {
    await expect(client.execute(createReq('https://192.168.1.1')))
      .rejects.toThrow('SSRF Protection: Resolved IP 192.168.1.1 is in a private/blocked IPv4 range');
  });

  it('rejects local IPv6', async () => {
    await expect(client.execute(createReq('https://[::1]')))
      .rejects.toThrow('SSRF Protection: Resolved IP ::1 is in a private/blocked IPv6 range');
  });

  it('rejects payload exceeding maximum size', async () => {
    // Generate a payload > 100KB
    const largeBody = "a".repeat(101 * 1024);
    await expect(client.execute({
      url: new URL('https://example.com'),
      method: 'POST',
      headers: {},
      body: largeBody,
      timeoutMs: 1000
    })).rejects.toThrow('exceeded maximum size');
  });
});
