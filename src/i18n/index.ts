import { es } from './es';
import { en } from './en';

export const languages = { es, en } as const;
export type Lang = keyof typeof languages;

export function getI18n(lang: string | undefined) {
  if (lang && lang in languages) {
    return languages[lang as Lang];
  }
  return languages['es'];
}

// Mapa bidireccional de rutas para el switcher de idiomas
const routeMap: Record<string, string> = {
  '/paradigma': '/paradigm',
  '/operacion': '/care',
  '/formacion': '/learning',
  '/investigacion': '/research',
  '/nosotros': '/about',
  '/contacto': '/contact',
  '/integrantes': '/members',
  '/noticias': '/news',
  '/politica-privacidad': '/privacy-policy',
  '/aviso-legal': '/legal-notice',
  '/politica-cookies': '/cookies-policy',
  '/mapa-del-sitio': '/site-map'
};

export function getRouteInOtherLang(url: URL): string {
  // Limpiamos la ruta actual (quitamos trailing slash si lo hay)
  let path = url.pathname.replace(/\/$/, '') || '/';
  const isEnglish = path.startsWith('/en');

  if (isEnglish) {
    // Estamos en EN, vamos a ES
    const pathWithoutEn = path.replace(/^\/en/, '') || '/';
    // Buscamos cuál era la ruta en español que corresponde a este valor en inglés
    const esPath = Object.keys(routeMap).find(key => routeMap[key] === pathWithoutEn) || pathWithoutEn;
    return esPath;
  } else {
    // Estamos en ES, vamos a EN
    const enPath = routeMap[path] || path;
    return '/en' + (enPath === '/' ? '' : enPath);
  }
}