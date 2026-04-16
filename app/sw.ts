/// <reference lib="webworker" />
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import {
  Serwist,
  CacheFirst,
  StaleWhileRevalidate,
  NetworkFirst,
} from "serwist";

// __SW_MANIFEST is injected at build time by @serwist/next
declare global {
  interface ServiceWorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [
    {
      // Cache Google Fonts with long TTL
      matcher: /^https:\/\/fonts\.(?:gstatic|googleapis)\.com\/.*/i,
      handler: new CacheFirst({
        cacheName: "google-fonts",
        plugins: [],
      }),
    },
    {
      // Cache static images
      matcher: /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
      handler: new StaleWhileRevalidate({
        cacheName: "static-image-assets",
      }),
    },
    {
      // Cache JS/CSS
      matcher: /\.(?:js|css)$/i,
      handler: new StaleWhileRevalidate({
        cacheName: "static-js-css-assets",
      }),
    },
    {
      // App page navigations — network-first, fall back to cache for offline
      matcher: ({ request }: { request: Request }) =>
        request.destination === "document",
      handler: new NetworkFirst({
        cacheName: "page-cache",
        networkTimeoutSeconds: 3,
      }),
    },
  ],
});

serwist.addEventListeners();
