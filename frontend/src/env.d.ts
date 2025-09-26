/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_GOOGLE_MAPS_API_KEY?: string
  readonly VITE_STRIPE_PUBLISHABLE_KEY?: string
  readonly VITE_STRIPE_SECRET_KEY?: string
  readonly VITE_STRIPE_WEBHOOK_SECRET?: string
  readonly VITE_ENVIRONMENT?: string
  // add more env variables here
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Stripe TypeScript declarations
declare global {
  interface Window {
    Stripe?: any;
  }
}

declare module '*.svg' {
  import * as React from 'react';
  export const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.json' {
  const content: Record<string, unknown>;
  export default content;
} 