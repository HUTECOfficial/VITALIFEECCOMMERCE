# CMS interno

El panel está disponible en `/admin` y permite crear, editar y eliminar productos, administrar existencias y consultar las ventas pagadas por producto.

## Configuración inicial

1. En el SQL Editor de Supabase, ejecuta `supabase/migrations/003_product_stock_quantity.sql`.
2. Agrega estas variables de entorno en `.env.local` y en el proveedor de despliegue:

   ```env
   CMS_ADMIN_PASSWORD=una-contrasena-larga-y-unica
   CMS_SESSION_SECRET=un-secreto-largo-y-aleatorio
   ```

3. Sincroniza el catálogo para guardar las existencias reales en Supabase:

   ```bash
   npm run supabase:seed
   ```

4. Entra a `/admin` e inicia sesión con `CMS_ADMIN_PASSWORD`.

Las métricas consideran únicamente pedidos con estado `paid`, por lo que los intentos de pago o pedidos pendientes no inflan los resultados.
