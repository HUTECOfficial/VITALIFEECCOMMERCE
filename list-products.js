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

function getCategory(name) {
  if (/GUANTE|NITRILO|LATEX/.test(name)) return 'guantes';
  if (/JERINGA|AGUJA|CATETER|CANULA|IV|INFUSION|VENOCLISIS/.test(name)) return 'jeringas';
  if (/GASA|VENDA|APOSITO|CINTA|ESPARADRAPO|CURACION|COMPRESA/.test(name)) return 'vendas';
  if (/OXIMETRO|ESTETOSCOPIO|TENSIOMETRO|FERULA|COLLARIN|CABESTRILLO|MASCARILLA|ZAPATO|ELECTROCAUTERIO/.test(name)) return 'equipo';
  if (/GEL|JABON|ANTISEPT|CLORHEX|ALCOHOL|LUBRICANTE/.test(name)) return 'curacion';
  return 'medicamentos';
}

function getVariant(name) {
  const match = name.match(pattern);
  if (!match) return null;
  return {
    baseName: name.slice(0, match.index).trim().replace(/[\s-]+$/, ''),
    variant: variantLabels[match[1]],
  };
}

const featured = [
  { name: 'Guantes de Nitrilo 100pcs', category: 'guantes', price: 189 },
  { name: 'Gel Antibacterial', category: 'curacion', price: 85 },
  { name: 'Vendas de Gasa 10cm x 5m', category: 'vendas', price: 45 },
  { name: 'Jeringas 5ml x 10pcs', category: 'jeringas', price: 65 },
  { name: 'Gasa de Tela 2.5cm', category: 'vendas', price: 38 },
  { name: 'Oxímetro de Pulso Digital', category: 'equipo', price: 220 },
  { name: 'Tensiómetro Manual', category: 'equipo', price: 650 },
  { name: 'Estetoscopio Clínico', category: 'equipo', price: 480 },
  { name: 'Apósitos Estériles 10x10cm', category: 'curacion', price: 55 },
  { name: 'Solución Inyectable', category: 'medicamentos', price: 95 },
  { name: 'Gasas Estériles 7.5x7.5cm', category: 'vendas', price: 42 },
  { name: 'Guantes de Látex 50pcs', category: 'guantes', price: 155 },
];

const variantsByBase = new Map();
const individual = [];

for (const record of inventory) {
  const name = record['Descripción del producto  '];
  const variant = getVariant(name);
  if (variant) {
    const group = variantsByBase.get(variant.baseName) || [];
    group.push({ ...record, variant: variant.variant });
    variantsByBase.set(variant.baseName, group);
  } else {
    individual.push(record);
  }
}

const grouped = [];
for (const [baseName, group] of variantsByBase.entries()) {
  if (group.length > 1) {
    grouped.push({
      name: baseName,
      category: getCategory(baseName),
      variants: [...new Set(group.map((r) => r.variant))].join(', '),
      quoteOnly: true,
    });
  } else {
    individual.push(group[0]);
  }
}

const inventoryProducts = individual.map((record) => ({
  name: record['Descripción del producto  '],
  category: getCategory(record['Descripción del producto  ']),
  quoteOnly: true,
}));

const lines = [];
lines.push('VITAL LIFE - LISTA DE PRODUCTOS DEL SITIO');
lines.push('============================================');
lines.push(`Total: ${featured.length + grouped.length + inventoryProducts.length} productos`);
lines.push(`- Destacados: ${featured.length}`);
lines.push(`- Inventario agrupados (con variantes): ${grouped.length}`);
lines.push(`- Inventario individuales: ${inventoryProducts.length}`);
lines.push('');

lines.push('PRODUCTOS DESTACADOS');
lines.push('----------------------');
featured.forEach((p, i) => {
  lines.push(`${i + 1}. [${p.category}] ${p.name} - $${p.price}`);
});

lines.push('');
lines.push('PRODUCTOS DE INVENTARIO AGRUPADOS (CON VARIANTES)');
lines.push('---------------------------------------------------');
grouped.forEach((p, i) => {
  lines.push(`${i + 1}. [${p.category}] ${p.name} (variantes: ${p.variants})`);
});

lines.push('');
lines.push('PRODUCTOS DE INVENTARIO INDIVIDUALES');
lines.push('-------------------------------------');
inventoryProducts.forEach((p, i) => {
  lines.push(`${i + 1}. [${p.category}] ${p.name}`);
});

require('fs').writeFileSync('lista-productos.txt', lines.join('\n'));
console.log('lista-productos.txt generado con', lines.length, 'líneas');
