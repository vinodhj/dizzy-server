import { handleContact } from './handle-contact';

export interface Env {
  ENQUIRY_JEEVA_RUBBER: KVNamespace;
}

export default {
  async fetch(request, env, ctx): Promise<Response> {
    try {
      const url = new URL(request.url);
      if (url.pathname === '/contact' && (request.method === 'POST' || request.method === 'OPTIONS')) {
        return handleContact(request, env);
      }
      return new Response('Dizzy Server - Unknown route', { status: 404 });
    } catch (error) {
      return new Response(String(error), { status: 500 });
    }
  },
} satisfies ExportedHandler<Env>;
