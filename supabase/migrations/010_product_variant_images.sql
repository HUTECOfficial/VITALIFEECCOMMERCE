-- Imagen opcional por combinación de color y talla/medida.
-- Las imágenes se guardan en Supabase Storage; la base conserva sólo su URL.
alter table product_variants
  add column if not exists image text;
