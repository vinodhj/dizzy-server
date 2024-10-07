declare module 'cloudflare:test' {
    // ...or if you have an existing `Env` type...
    interface ProvidedEnv extends Env {
        ENQUIRY_JEEVA_RUBBER: KVNamespace;
    }
  }