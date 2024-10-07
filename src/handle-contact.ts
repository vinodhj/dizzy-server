import { nanoid } from 'nanoid';
import { addCORSHeaders } from './cors-headers';

/**
 * Handle a contact form submission.
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
export const handleContact = async (request: Request, env: Env): Promise<Response> => {
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
  const body = (await request.json()) as { email: string; message: string; name: string };

  if (!body.email || !body.message || !body.name) {
    return new Response('Missing data', { status: 400 });
  }

  const data = {
    email: body.email,
    message: body.message,
    name: body.name,
    timestamp: new Date().toISOString(),
  };

  const id = nanoid();
  await env.ENQUIRY_JEEVA_RUBBER.put(id, JSON.stringify(data));
  const value = await env.ENQUIRY_JEEVA_RUBBER.get(id);

  if (value === null) {
    return new Response('Value not found', { status: 404 });
  }
  const res = JSON.parse(value);
  return new Response(JSON.stringify(res), {
    headers: addCORSHeaders(),
  });
};
