-- Permite asignar una marca (fabricante) a cada producto desde el CMS.
-- La marca es opcional; si el producto no tiene marca, no se muestra al público.
alter table products add column if not exists brand text;

comment on column products.brand is 'Marca / fabricante del producto, mostrada públicamente cuando existe.';
