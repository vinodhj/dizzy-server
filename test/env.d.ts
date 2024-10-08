declare module 'cloudflare:test' {
    // ...or if you have an existing `Env` type...
    interface ProvidedEnv extends Env {
        ENQUIRY_JEEVA_RUBBER: KVNamespace;
        ENQUIRY_JEEVA_RUBBER_STAGING: KVNamespace;
        SUBSCRIBE_JEEVA_RUBBER: KVNamespace;
        ENVIRONMENT: string;
    }
  }