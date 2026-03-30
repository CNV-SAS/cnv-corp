// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://cnvcorp.com', // CRÍTICO: Nunca lo quites, o rompes el SEO y el sitemap
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