<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Verificación del proyecto

- Tipos: `npx tsc --noEmit --incremental false`.
- Lint de cambios: `npx eslint <archivos modificados .ts/.tsx>`.
- Compilación de producción: `npm run build`.
- Desarrollo local: `npm run dev`.
- No hay un comando de pruebas automatizadas definido en `package.json`.
