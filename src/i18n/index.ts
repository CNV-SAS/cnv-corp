import { es } from './es';
import { en } from './en';

export const languages = { es, en };
export type Lang = keyof typeof languages;

export function getLangFromUrl(url: URL): Lang {
  const [, lang] = url.pathname.split('/');
  if (lang in languages) return lang as Lang;
  return 'es';
}

export function useTranslations(lang: Lang) {
  return languages[lang];
}

export function getRouteInOtherLang(url: URL): string {
  const lang = getLangFromUrl(url);
  const path = url.pathname;
  if (lang === 'es') {
    return '/en' + path;
  } else {
    return path.replace(/^\/en/, '') || '/';
  }
}
