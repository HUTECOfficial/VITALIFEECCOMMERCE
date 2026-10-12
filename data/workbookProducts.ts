import workbookCatalog from "@/data/workbook-catalog.json";
import { categoryImageById } from "@/data/visualAssets";
import type { Product, ProductCategory, ProductVariant } from "@/types";

type WorkbookCatalogRow = {
  name: string;
  category: ProductCategory;
  brand: string;
  presentation?: string;
  options?: string[];
  colors?: string[];
};

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function createVariants(options: string[], colors: string[]): ProductVariant[] {
  const availableOptions = options.length ? options : [""];
  const availableColors = colors.length ? colors : [""];

  return availableColors.flatMap((color) => availableOptions.map((size) => ({
    color,
    size,
    stockQuantity: 0,
  })));
}

export const workbookProducts: Product[] = (workbookCatalog as WorkbookCatalogRow[]).map((row, index) => {
  const sizes = [...new Set(row.options?.filter(Boolean) ?? [])];
  const colors = [...new Set(row.colors?.filter(Boolean) ?? [])];
  const slug = `catalogo-${slugify(row.brand)}-${slugify(row.name)}`;

  return {
    id: `workbook-${index + 1}`,
    name: row.name,
    slug,
    category: row.category,
    price: 0,
    description: "Disponible bajo cotización. Elige la presentación disponible para solicitar información.",
    image: categoryImageById[row.category],
    inStock: false,
    stockQuantity: 0,
    sizes: sizes.length ? sizes : undefined,
    colors: colors.length ? colors : undefined,
    variants: createVariants(sizes, colors),
    quoteOnly: true,
    brand: row.brand,
    presentation: row.presentation ?? (sizes.length ? "Varias presentaciones" : undefined),
  };
});
