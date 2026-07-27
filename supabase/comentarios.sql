-- ============================================================================
-- Comentarios públicos del sitio web (cnvsystem.com/comentarios)
--
-- Ejecutar UNA VEZ en el proyecto de Supabase de la WEB (no el de ATLAS):
--   Supabase → SQL Editor → New query → pegar todo → Run
--
-- Diseño:
--  · Nadie escribe directo en la tabla desde el navegador. Los envíos pasan
--    por /api/comentario, que valida Turnstile y usa la service_role key.
--  · El público sólo lee la VISTA comentarios_publicos, que no expone el
--    correo, la IP ni el user agent.
--  · visible = true por defecto: el comentario aparece en la página apenas se
--    envía. Para bajar uno, pon visible = false desde el Table Editor.
-- ============================================================================

create table if not exists public.comentarios (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),

  -- Datos que sí se publican
  name        text not null,
  role        text,
  location    text,
  comment     text not null,
  lang        text not null default 'es',

  -- Datos que NO se publican (verificación y auditoría, Ley 1581)
  email       text not null,
  consent     boolean not null default false,
  ip          text,
  user_agent  text,

  -- Control de publicación
  visible     boolean not null default true
);

comment on table public.comentarios is
  'Comentarios enviados desde /comentarios. Escritura sólo vía /api/comentario (service_role).';

create index if not exists comentarios_visible_created_idx
  on public.comentarios (visible, created_at desc);

-- RLS activado y SIN políticas: el rol anónimo no puede leer ni escribir la
-- tabla directamente. La service_role key (servidor) ignora RLS por diseño.
alter table public.comentarios enable row level security;

-- Vista pública: sólo comentarios visibles y sólo columnas publicables.
-- Al no marcarla security_invoker, se ejecuta con los permisos del owner,
-- así que puede leer la tabla aunque el anónimo no tenga acceso directo.
create or replace view public.comentarios_publicos as
  select id, created_at, name, role, location, comment, lang
  from public.comentarios
  where visible = true;

grant select on public.comentarios_publicos to anon, authenticated;

-- ============================================================================
-- Para ocultar un comentario inapropiado:
--   update public.comentarios set visible = false where id = '<uuid>';
-- Para borrarlo del todo:
--   delete from public.comentarios where id = '<uuid>';
-- ============================================================================
