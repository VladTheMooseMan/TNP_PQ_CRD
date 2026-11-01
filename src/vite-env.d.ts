// ============================================================
// FILE: src/vite-env.d.ts
// PURPOSE: Type the Vite env variables used by the app.
// ============================================================
/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
}
interface ImportMeta { readonly env: ImportMetaEnv; }
