export type Lang = 'es' | 'en';

export type RouteKey =
  | 'home'
  | 'paradigm'
  | 'operations'
  | 'training'
  | 'research'
  | 'about'
  | 'contact';

export const routes: Record<RouteKey, Record<Lang, string>> = {
  home: {
    es: '/',
    en: '/en',
  },
  paradigm: {
    es: '/paradigma',
    en: '/en/paradigm',
  },
  operations: {
    es: '/operacion',
    en: '/en/operations',
  },
  training: {
    es: '/formacion',
    en: '/en/training',
  },
  research: {
    es: '/investigacion',
    en: '/en/research',
  },
  about: {
    es: '/nosotros',
    en: '/en/about',
  },
  contact: {
    es: '/contacto',
    en: '/en/contact',
  },
};

export function getPath(route: RouteKey, lang: Lang) {
  return routes[route][lang];
}

export function getAlternatePath(route: RouteKey, lang: Lang) {
  const otherLang: Lang = lang === 'es' ? 'en' : 'es';
  return routes[route][otherLang];
}