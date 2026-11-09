-- Permitir centavos en el precio de los productos (antes era int y rechazaba precios como 187.50).
alter table products alter column price type numeric(10,2) using price::numeric(10,2);
