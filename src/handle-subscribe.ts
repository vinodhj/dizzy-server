import { nanoid } from 'nanoid';
import { addCORSHeaders } from './cors-headers';
const nano_id = () => nanoid(10);
/**
 * Handle a Subscribe form submission.
 *
 * This function is expected to be called from a Cloudflare Worker.
 * It handles both CORS preflight requests and actual form submissions.
 * The form data is expected to be JSON-encoded in the request body.
 * The form data is stored in a KV store.
 *
 * @param {Request} request The incoming request.
 * @param {Env} env The environment variables.
 * @returns {Promise<Response>} The response to the request.
 */
export const handleSubscribe = async (request: Request, env: Env): Promise<Response> => {
  // Handle CORS preflight requests
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }
  const body = (await request.json()) as { subscribe_email: string; };

  if (!body.subscribe_email) {
    return new Response('Missing data', { status: 400 });
  }

  const kv = env.SUBSCRIBE_JEEVA_RUBBER;

  const data = {
    env : env.ENVIRONMENT,
    id: nano_id(),
    email: body.subscribe_email,
  };
  
  const cf_key = new Date().toISOString();
  await kv.put(cf_key, JSON.stringify(data));
  const value = await kv.get(cf_key);

  if (value === null) {
    return new Response('Value not found', { status: 404 });
  }
  const res = JSON.parse(value);
  return new Response(JSON.stringify(res), {
    headers: addCORSHeaders(),
  });
};
