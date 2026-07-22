const inventory = require('./productos_extraidos.json');

const variantLabels = {
  CHICA: 'Chico', CHICO: 'Chico',
  MED: 'Mediano', MEDIANA: 'Mediano', MEDIANO: 'Mediano',
  GRANDE: 'Grande',
  BLANCO: 'Blanco', BLANCA: 'Blanco',
  NEGRO: 'Negro', NEGRA: 'Negro',
  AZUL: 'Azul', ROJO: 'Rojo', ROJA: 'Rojo', VERDE: 'Verde',
  AMARILLO: 'Amarillo', AMARILLA: 'Amarillo',
  XL: 'Extra grande', XXL: 'Extra grande',
};

const pattern = new RegExp(`\\b(${Object.keys(variantLabels).join('|')})$`);

function getVariant(name) {
  const match = name.match(pattern);
  if (!match) return null;
  return {
    baseName: name.slice(0, match.index).trim().replace(/[\s-]+$/, ''),
  };
}

const variantsByBase = new Map();
const groupedNames = new Set();
const individual = [];

for (const record of inventory) {
  const name = record['Descripción del producto  '];
  const variant = getVariant(name);
  if (variant) {
    const group = variantsByBase.get(variant.baseName) || [];
    group.push(record);
    variantsByBase.set(variant.baseName, group);
  } else {
    individual.push(record);
  }
}

let groupedProducts = 0;
for (const group of variantsByBase.values()) {
  if (group.length > 1) groupedProducts++;
  else individual.push(group[0]);
}

const FEATURED = 12;
const totalLocal = FEATURED + groupedProducts + individual.length;

console.log({
  rawRecords: inventory.length,
  featured: FEATURED,
  groupedProducts,
  individualProducts: individual.length,
  totalLocal,
});
