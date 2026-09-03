create table if not exists site_content (
  page text not null,
  section text not null,
  content jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (page, section),
  constraint site_content_page_check check (page in ('homepage', 'insumos', 'nosotros', 'enfermeria', 'contacto')),
  constraint site_content_content_object_check check (jsonb_typeof(content) = 'object')
);

alter table site_content enable row level security;

revoke insert, update, delete on site_content from anon, authenticated;
grant select on site_content to anon, authenticated;
grant all on site_content to service_role;

create policy "Allow public read site content" on site_content
  for select to anon, authenticated using (true);

create or replace function set_site_content_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists site_content_set_updated_at on site_content;
create trigger site_content_set_updated_at
before update on site_content
for each row execute function set_site_content_updated_at();

revoke all on function set_site_content_updated_at() from public;
