-- Permite asignar manualmente la presentación (pieza, litro, bidón, etc.) a
-- cada producto desde el CMS. Es opcional; si no se define, no se muestra.
alter table products add column if not exists presentation text;

comment on column products.presentation is 'Presentación seleccionada en el CMS (pieza, litro, bidón, etc.), mostrada públicamente cuando existe.';
