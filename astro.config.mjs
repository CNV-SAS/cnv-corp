// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  site: 'https://cnvsystem.com', // CRÍTICO: Nunca lo quites, o rompes el SEO y el sitemap
  adapter: vercel(),
  // Redirecciones reales (301 del servidor). Astro.redirect() dentro de una
  // página prerenderizada sólo genera un HTML con meta-refresh, que no traslada
  // la autoridad SEO; declararlas aquí sí produce un 301 de verdad en Vercel.
  redirects: {
    // El contenido de Nosotros pasó a ser la portada.
    '/nosotros': { status: 301, destination: '/' },
    '/en/about': { status: 301, destination: '/en/' },
  },
  integrations: [react(), sitemap()],
  vite: {
    plugins: [tailwindcss()]
  },
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: {
      prefixDefaultLocale: false, // Excelente decisión: web.com (es) y web.com/en/ (en)
    },
  },
});