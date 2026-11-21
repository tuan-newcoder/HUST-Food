/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_SOCKET_URL: string;
  readonly VITE_DEFAULT_LAT: string;
  readonly VITE_DEFAULT_LNG: string;
  readonly VITE_DEFAULT_ZOOM: string;
  readonly VITE_MAPBOX_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
