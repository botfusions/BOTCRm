/// <reference types="vite/client" />

// Yalnızca herkese açık (tarayıcıya gömülmesi sakıncasız) değerler.
// VITE_ ile başlayan her değişken istemci paketine girer; gizli anahtar tanımlamayın.
interface ImportMetaEnv {
    readonly VITE_SUPABASE_URL: string;
    readonly VITE_SUPABASE_ANON_KEY: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
