# CMS interno

El panel está disponible en `/admin` y permite crear, editar y eliminar productos, administrar existencias y consultar las ventas pagadas por producto.

## Configuración inicial

1. En el SQL Editor de Supabase, ejecuta `supabase/migrations/003_product_stock_quantity.sql`.
2. Ejecuta `supabase/migrations/008_product_variant_stock.sql` para activar el inventario por color y talla/medida.
3. Agrega estas variables de entorno en `.env.local` y en el proveedor de despliegue:

   ```env
   CMS_ADMIN_PASSWORD=una-contrasena-larga-y-unica
   CMS_SESSION_SECRET=un-secreto-largo-y-aleatorio
   ```

4. Sincroniza el catálogo para guardar las existencias reales en Supabase:

   ```bash
   npm run supabase:seed
   ```

5. Entra a `/admin` e inicia sesión con `CMS_ADMIN_PASSWORD`.

Las métricas consideran únicamente pedidos con estado `paid`, por lo que los intentos de pago o pedidos pendientes no inflan los resultados.

## Inventario por color y talla

Antes de usar el nuevo editor de inventario, ejecuta `supabase/migrations/008_product_variant_stock.sql` en el SQL Editor de Supabase. La migración conserva el inventario actual como una variante sin opciones y, después, cada producto podrá tener una cantidad distinta por combinación de color y talla/medida.
