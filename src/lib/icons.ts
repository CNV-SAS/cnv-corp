// ============================================================================
// Set de íconos monolínea del sitio — 24×24, trazo 1.75, `currentColor`.
// ----------------------------------------------------------------------------
// Sustituye a los emoji que se venían usando como íconos. Un emoji no sirve
// para esto: lo dibuja el sistema operativo, así que cambia entre Windows,
// macOS y Android; no hereda el color de marca; no se le puede ajustar el
// grosor de trazo ni la alineación; y los lectores de pantalla lo leen en voz
// alta con su nombre Unicode.
//
// Todos los íconos comparten viewBox, grosor y terminaciones, que es lo que
// hace que un set se lea como un sistema y no como una colección. Geometría
// basada en Lucide (licencia ISC).
//
// Uso desde una página con <script is:inline> (no admite imports):
//   ---
//   import { iconScript } from '../lib/icons';
//   ---
//   <script is:inline set:html={iconScript()}></script>
//   <script is:inline> ... `<div class="of-ico">${CNVICO.stethoscope}</div>` ... </script>
//
// Al añadir un ícono, mantener el mismo viewBox y no meter `fill`: el color lo
// pone el contenedor con `color:`.
// ============================================================================

/** Geometría de cada ícono (contenido interno del <svg>). */
const PATHS: Record<string, string> = {
  // — Formación —
  stethoscope:
    '<path d="M11 2v2"/><path d="M5 2v2"/><path d="M5 3H4a2 2 0 0 0-2 2v4a6 6 0 0 0 12 0V5a2 2 0 0 0-2-2h-1"/><path d="M8 15a6 6 0 0 0 12 0v-3"/><circle cx="20" cy="10" r="2"/>',
  users:
    '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  presentation:
    '<path d="M2 3h20"/><path d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3"/><path d="m7 21 5-5 5 5"/>',
  landmark:
    '<path d="M3 22h18"/><path d="M6 18v-7"/><path d="M10 18v-7"/><path d="M14 18v-7"/><path d="M18 18v-7"/><path d="M12 2 20 7H4Z"/>',

  // — Cursos —
  scale:
    '<path d="M12 3v18"/><path d="M7 21h10"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/><path d="m16 16 3-8 3 8a5 5 0 0 1-6 0Z"/><path d="m2 16 3-8 3 8a5 5 0 0 1-6 0Z"/>',
  hourglass:
    '<path d="M5 2h14"/><path d="M5 22h14"/><path d="M7 2v4.2a2 2 0 0 0 .6 1.4L12 12l4.4-4.4a2 2 0 0 0 .6-1.4V2"/><path d="M17 22v-4.2a2 2 0 0 0-.6-1.4L12 12l-4.4 4.4a2 2 0 0 0-.6 1.4V22"/>',
  ruler:
    '<path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.4 2.4 0 0 1 0-3.4l2.6-2.6a2.4 2.4 0 0 1 3.4 0Z"/><path d="m8.5 6.5 2-2"/><path d="m11.5 9.5 2-2"/><path d="m14.5 12.5 2-2"/><path d="m17.5 15.5 2-2"/>',
  apple:
    '<path d="M12 20.9c1.5 0 2.7 1.1 4 1.1 3 0 6-8 6-12.2A4.9 4.9 0 0 0 17 5c-2.2 0-4 1.4-5 2-1-.6-2.8-2-5-2a4.9 4.9 0 0 0-5 4.8C2 14 5 22 8 22c1.3 0 2.5-1.1 4-1.1Z"/><path d="M10 2c1 .5 2 2 2 5"/>',
  // Lazo de concienciación: el bucle y las dos colas.
  ribbon:
    '<path d="M12 15.5c2.5-2.2 4-4.8 4-7.3A4 4 0 0 0 12 4a4 4 0 0 0-4 4.2c0 2.5 1.5 5.1 4 7.3Z"/><path d="m10.3 14.2-3.6 6.6 5.3-2.6 5.3 2.6-3.6-6.6"/>',
  droplet:
    '<path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5S12.5 5.5 12 3c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7Z"/>',
  heartPulse:
    '<path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7Z"/><path d="M3.2 13h6.3l.5-1 2 4.5 2-7 1.5 3.5h5.3"/>',

  // — Investigación —
  flask:
    '<path d="M10 2v7.3"/><path d="M14 2v7.3"/><path d="M8.5 2h7"/><path d="M14 9.3a6.5 6.5 0 1 1-4 0"/><path d="M5.5 16h13"/>',
  microscope:
    '<path d="M6 18h8"/><path d="M3 22h18"/><path d="M14 22a7 7 0 1 0 0-14h-1"/><path d="M9 14h2"/><path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z"/><path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3"/>',
  lightbulb:
    '<path d="M15 14c.2-1 .7-1.7 1.5-2.5A4.8 4.8 0 0 0 18 8a6 6 0 0 0-12 0c0 1.4.5 2.6 1.5 3.5.8.8 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/>',
  book:
    '<path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3Z"/>',

  // — Operación —
  // Onda de bioimpedancia: tres barridos de 2 a 22.
  waves:
    '<path d="M2 6q2.5 2 5 0t5 0t5 0t5 0"/><path d="M2 12q2.5 2 5 0t5 0t5 0t5 0"/><path d="M2 18q2.5 2 5 0t5 0t5 0t5 0"/>',
  monitor:
    '<rect width="20" height="14" x="2" y="3" rx="2"/><path d="M8 21h8"/><path d="M12 17v4"/>',
  smartphone:
    '<rect width="14" height="20" x="5" y="2" rx="2"/><path d="M11 18h2"/>',
  pill:
    '<path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/>',
  graduationCap:
    '<path d="M12 4 2 9l10 5 10-5Z"/><path d="M22 9v6"/><path d="M6 11.5V16c0 1.7 2.7 3 6 3s6-1.3 6-3v-4.5"/>',
  network:
    '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 13.5 6.8 4"/><path d="m15.4 6.5-6.8 4"/>',

  // — Acceso / contacto —
  userCheck:
    '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="m16 11 2 2 4-4"/>',
  building:
    '<path d="M3 22V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v18"/><path d="M15 10h5a1 1 0 0 1 1 1v11"/><path d="M2 22h20"/><path d="M7 7h4"/><path d="M7 11h4"/><path d="M7 15h4"/><path d="M18 14h.01"/><path d="M18 18h.01"/>',
  mail:
    '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m2 7 8.6 5.7a2 2 0 0 0 2.2 0L22 7"/>',
  message:
    '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z"/>',
  mapPin:
    '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
  clock:
    '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  link:
    '<path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/>',
  image:
    '<rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-4.6-4.6a2 2 0 0 0-2.8 0L3 21"/>',
  check:
    '<path d="M20 6 9 17l-5-5"/>',
  lock:
    '<rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  card:
    '<rect width="20" height="14" x="2" y="5" rx="2"/><path d="M2 10h20"/>',

  // — Los ocho determinantes (octágono ANI BIS-E) —
  user:
    '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  activity:
    '<path d="M22 12h-5l-3 8-4-16-3 8H2"/>',
  dna:
    '<path d="M4 3c0 6 16 12 16 18"/><path d="M20 3c0 6-16 12-16 18"/><path d="M7 5h10"/><path d="M6 9h12"/><path d="M6 15h12"/><path d="M7 19h10"/>',
  globe:
    '<circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20"/>',

  // — Módulos de la plataforma —
  layers:
    '<path d="m12 2 9 5-9 5-9-5Z"/><path d="m3 12 9 5 9-5"/><path d="m3 17 9 5 9-5"/>',
  video:
    '<rect width="14" height="14" x="2" y="5" rx="2"/><path d="m22 8-6 4 6 4Z"/>',
  edit:
    '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
  trending:
    '<path d="m3 17 6-6 4 4 8-8"/><path d="M15 7h6v6"/>',
  certificate:
    '<circle cx="12" cy="9" r="6"/><path d="m8.2 13.8-1.2 7.2 5-2.5 5 2.5-1.2-7.2"/>',
  chat:
    '<path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2Z"/><path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1"/>',
};

const svg = (d: string) =>
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" ' +
  'stroke="currentColor" stroke-width="1.75" stroke-linecap="round" ' +
  'stroke-linejoin="round" aria-hidden="true" focusable="false">' + d + '</svg>';

/**
 * name → solo la geometría, sin el <svg>. Para incrustar un ícono DENTRO de
 * otro SVG (el octágono de determinantes): ahí no se anida un <svg>, se mete
 * la geometría en un <g> con su propio transform y su propio stroke.
 * El sistema de coordenadas sigue siendo 24×24: escalar en el <g>.
 */
export const ICON_PATHS: Record<string, string> = PATHS;

/** name → markup <svg> completo. */
export const ICONS: Record<string, string> = Object.fromEntries(
  Object.entries(PATHS).map(([k, d]) => [k, svg(d)]),
);

/**
 * Un solo ícono, para plantillas Astro con set:html. `size` fija width/height
 * en el propio <svg>: sin eso, un SVG sin dimensiones cae al tamaño por
 * defecto del navegador (300×150) hasta que el CSS lo alcance.
 */
export const icon = (name: keyof typeof PATHS | string, size = 24): string =>
  ICONS[name] ? ICONS[name].replace('<svg ', `<svg width="${size}" height="${size}" `) : '';

/**
 * Publica el set en `window.CNVICO` para los <script is:inline>, que no pueden
 * importar módulos. Se inyecta con  <script is:inline set:html={iconScript()} />
 */
export const iconScript = (): string => `window.CNVICO=${JSON.stringify(ICONS)};`;
