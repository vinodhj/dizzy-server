import { handleContact } from './handle-contact';
import { handleSubscribe } from './handle-subscribe';

export interface Env {
  ENQUIRY_JEEVA_RUBBER: KVNamespace;
  ENQUIRY_JEEVA_RUBBER_STAGING: KVNamespace;
  SUBSCRIBE_JEEVA_RUBBER: KVNamespace;
  ENVIRONMENT: string;
}

export default {
  async fetch(request, env, ctx): Promise<Response> {
    try {
      const url = new URL(request.url);
      if (url.pathname === '/contact' && (request.method === 'POST' || request.method === 'OPTIONS')) {
        return handleContact(request, env);
      } else if (url.pathname === '/subscribe' && (request.method === 'POST' || request.method === 'OPTIONS')) {
        return handleSubscribe(request, env);
      }
      return new Response('Dizzy Server - Unknown route', { status: 404 });
    } catch (error) {
      return new Response(String(error), { status: 500 });
    }
  },
} satisfies ExportedHandler<Env>;
