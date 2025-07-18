import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuración optimizada para producción
  output: "standalone",

  // Configuración de headers de seguridad mejorada
  async headers() {
    return [
      {
        source: "/(.*)", // Aplica a todas las rutas
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://us.i.posthog.com https://us-assets.i.posthog.com https://js.sentry-cdn.com",
              "worker-src 'self' blob:",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: https:",
              "connect-src 'self' https://api.totalapp.com.co https://us.i.posthog.com https://us-assets.i.posthog.com https://o4508693166555136.ingest.us.sentry.io",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "upgrade-insecure-requests",
            ].join("; "),
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "X-DNS-Prefetch-Control",
            value: "off",
          },
          {
            key: "X-Download-Options",
            value: "noopen",
          },
          {
            key: "X-Permitted-Cross-Domain-Policies",
            value: "none",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=()",
          },
        ],
      },
    ];
  },

  // Aquí puedes agregar otras configuraciones si lo necesitas
};

export default withSentryConfig(nextConfig, {
  // Para todas las opciones disponibles, consulta:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: "fintrace",
  project: "totalapp",

  // Solo imprimir logs para subir sourcemaps en CI
  silent: !process.env.CI,

  // Subir más sourcemaps para stack traces más claros (puede aumentar tiempo de build)
  widenClientFileUpload: true,

  // Reescritura de ruta para evitar bloqueadores de anuncios
  tunnelRoute: "/monitoring",

  // Quitar logs de Sentry para reducir el tamaño del bundle
  disableLogger: true,

  // Habilitar monitoreo de crons en Vercel (no aplica en App Router aún)
  automaticVercelMonitors: true,
});
