import fs from "node:fs";
import path from "node:path";

const inputPath = process.argv[2];
const outputPath = process.argv[3] || "productos_extraidos.json";

if (!inputPath) {
  console.error("Uso: node scripts/import-product-workbook-export.mjs <workbook-export.json> [salida.json]");
  process.exit(1);
}

const workbook = JSON.parse(fs.readFileSync(inputPath, "utf8"));
const products = new Map();

for (const rows of Object.values(workbook)) {
  if (!Array.isArray(rows) || rows.length < 2) continue;

  const headers = rows[0].map((header) => String(header ?? "").trim().toLocaleLowerCase("es-MX"));
  const warehouseIndex = headers.findIndex((header) => header.includes("descripción del almacén"));
  const stockIndex = headers.findIndex((header) => header.includes("existencia real"));
  const statusIndex = headers.findIndex((header) => header.includes("estatus"));
  const nameIndex = headers.findIndex((header) => header.includes("descripción del producto"));

  if (nameIndex < 0) continue;

  for (const row of rows.slice(1)) {
    const name = String(row[nameIndex] ?? "").replace(/\s+/g, " ").trim();
    if (!name) continue;

    const key = name.toLocaleUpperCase("es-MX");
    const current = products.get(key) ?? {
      name,
      stockQuantity: 0,
      warehouse: String(row[warehouseIndex] ?? "").trim(),
      active: false,
    };

    current.stockQuantity += Math.max(0, Number(row[stockIndex]) || 0);
    current.active ||= /^activo$/i.test(String(row[statusIndex] ?? "").trim());
    products.set(key, current);
  }
}

const records = [...products.values()]
  .sort((a, b) => a.name.localeCompare(b.name, "es-MX"))
  .map((product, index) => ({
    "Descripción del almacén  ": product.warehouse || "Almacén Medicamentos",
    "Clave de artículo ": `CAT${String(index + 1).padStart(4, "0")}`,
    "existencia real": product.stockQuantity,
    "Existencias ": product.stockQuantity,
    "Estatus ": product.active ? "Activo" : "Inactivo",
    "Descripción del producto  ": product.name,
    LINEA: null,
    LOTE: null,
    CADUCIDAD: null,
  }));

fs.writeFileSync(outputPath, `${JSON.stringify(records, null, 2)}\n`);
console.log(`Importados ${records.length} productos únicos en ${path.resolve(outputPath)}.`);
