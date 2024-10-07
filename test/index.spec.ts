// test/index.spec.ts
import { env, createExecutionContext, waitOnExecutionContext, SELF } from 'cloudflare:test';
import { describe, it, expect, vi } from 'vitest';
import worker from '../src/index';

describe('Contact Worker Tests', () => {
  it('handles CORS preflight requests', async () => {
    const request = new Request('http://example.com/contact', {
      method: 'OPTIONS',
    }) as Request<unknown, IncomingRequestCfProperties<unknown>> ;
    const ctx = createExecutionContext();
    const response = await worker.fetch(request, env, ctx);
    await waitOnExecutionContext(ctx);

    expect(response.status).toBe(204);
    expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
    expect(response.headers.get('Access-Control-Allow-Methods')).toBe('POST, OPTIONS');
    expect(response.headers.get('Access-Control-Allow-Headers')).toBe('Content-Type');
  });

  it('handles valid POST requests', async () => {
    const request = new Request('http://example.com/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        message: 'Hello, this is a test message',
        name: 'Test User',
      }),
    }) as Request<unknown, IncomingRequestCfProperties<unknown>> ;;
    
    // Mocking the KVNamespace put and get methods
    const mockKVNamespace = {
      put: vi.fn(),
      get: vi.fn().mockResolvedValue(
        JSON.stringify({
          id: 'mocked_id',
          email: 'test@example.com',
          message: 'Hello, this is a test message',
          name: 'Test User',
        })
      ),
    };
    
    const ctx = createExecutionContext();
    const response = await worker.fetch(request, env, ctx);
    await waitOnExecutionContext(ctx);

    expect(response.status).toBe(200);
  });

  it('handles missing data in POST requests', async () => {
    const request = new Request('http://example.com/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: '', message: '', name: '' }),
    }) as Request<unknown, IncomingRequestCfProperties<unknown>> ;;

    const ctx = createExecutionContext();
    const response = await worker.fetch(request, env, ctx);
    await waitOnExecutionContext(ctx);

    expect(response.status).toBe(400);
    expect(await response.text()).toBe('Missing data');
  });

  it('returns 404 for unknown routes', async () => {
    const request = new Request('http://example.com/unknown', {
      method: 'GET',
    }) as Request<unknown, IncomingRequestCfProperties<unknown>> ;;
    const ctx = createExecutionContext();
    const response = await worker.fetch(request, env, ctx);
    await waitOnExecutionContext(ctx);

    expect(response.status).toBe(404);
    expect(await response.text()).toBe('Dizzy Server - Unknown route');
  });
});
