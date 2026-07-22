const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const imageMap = JSON.parse(fs.readFileSync('image-upload-map.json', 'utf8'));

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

const variantPattern = new RegExp(`\\b(${Object.keys(variantLabels).join('|')})$`);

function getVariant(name) {
  const match = name.match(variantPattern);
  if (!match) return null;
  return {
    baseName: name.slice(0, match.index).trim().replace(/[\s-]+$/, ''),
    label: variantLabels[match[1]],
  };
}

function slugify(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function getCategory(name) {
  if (/GUANTE|NITRILO|LATEX/.test(name)) return 'guantes';
  if (/JERINGA|AGUJA|CATETER|CANULA|IV|INFUSION|VENOCLISIS/.test(name)) return 'jeringas';
  if (/GASA|VENDA|APOSITO|CINTA|ESPARADRAPO|CURACION|COMPRESA/.test(name)) return 'vendas';
  if (/OXIMETRO|ESTETOSCOPIO|TENSIOMETRO|FERULA|COLLARIN|CABESTRILLO|MASCARILLA|ZAPATO|ELECTROCAUTERIO/.test(name)) return 'equipo';
  if (/GEL|JABON|ANTISEPT|CLORHEX|ALCOHOL|LUBRICANTE/.test(name)) return 'curacion';
  return 'medicamentos';
}

function normalize(text) {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function getImage(name, category) {
  const normName = normalize(name);
  let best = null;
  let bestScore = 0;
  for (const { newName, publicUrl } of imageMap) {
    const base = normalize(newName.replace(/\.png$/, '').split('_')[0]);
    if (!base) continue;
    const nameIncludesBase = normName.includes(base);
    const baseIncludesName = base.includes(normName);
    if (!nameIncludesBase && !baseIncludesName) continue;
    const score = Math.min(normName.length, base.length);
    if (score > bestScore) {
      bestScore = score;
      best = publicUrl;
    }
  }
  if (best) return best;
  const placeholders = {
    vendas: '/material-curacion.png',
    guantes: '/guantes.png',
    jeringas: '/vias-iv.png',
    medicamentos: '/diagnostico.png',
    curacion: '/material-curacion.png',
    equipo: '/diagnostico.png',
  };
  return placeholders[category] || '/diagnostico.png';
}

function buildProducts() {
  const products = [];

  const featured = [
    { id: '1', name: 'Guantes de Nitrilo 100pcs', slug: 'guantes-nitrilo-100pcs', category: 'guantes', price: 189, description: 'Guantes desechables de nitrilo sin látex. Alta resistencia a químicos. Caja de 100 piezas.', inStock: true, featured: true, sizes: ['Chico', 'Mediano', 'Grande'] },
    { id: '2', name: 'Gel Antibacterial', slug: 'gel-antibacterial', category: 'curacion', price: 85, description: 'Gel antibacterial con 70% de alcohol isopropílico. Fórmula con aloe vera para cuidado de manos.', inStock: true, featured: true, sizes: ['100ml', '250ml', '500ml'] },
    { id: '3', name: 'Vendas de Gasa 10cm x 5m', slug: 'vendas-gasa-10cm-5m', category: 'vendas', price: 45, description: 'Venda de gasa esterilizada 100% algodón. Ideal para apósitos y curaciones. Paquete con 12 rollos.', inStock: true, featured: false },
    { id: '4', name: 'Jeringas 5ml x 10pcs', slug: 'jeringas-5ml-10pcs', category: 'jeringas', price: 65, description: 'Jeringas desechables de 5ml con aguja 21G. Estériles y empacadas individualmente. Paquete de 10.', inStock: true, featured: false },
    { id: '5', name: 'Gasa de Tela 2.5cm', slug: 'gasa-tela-2-5cm', category: 'vendas', price: 38, description: 'Gasa de tela de algodón transpirable. Alta adherencia. Rollo de 9m x 2.5cm.', inStock: true, featured: false },
    { id: '6', name: 'Oxímetro de Pulso Digital', slug: 'oximetro-pulso-digital', category: 'equipo', price: 220, description: 'Oxímetro de pulso digital con pantalla LED. Mide la saturación de oxígeno (SpO2) y frecuencia cardíaca. Compacto y fácil de usar.', inStock: true, featured: true },
    { id: '7', name: 'Tensiómetro Manual', slug: 'tensiometro-manual', category: 'equipo', price: 650, description: 'Esfigmomanómetro manual aneroide con estetoscopio. Rango 0-300mmHg. Brazalete adulto incluido.', inStock: true, featured: true },
    { id: '8', name: 'Estetoscopio Clínico', slug: 'estetoscopio-clinico', category: 'equipo', price: 480, description: 'Estetoscopio de doble campana para uso clínico. Acústica superior. Tubos de 22 pulgadas.', inStock: true, featured: false },
    { id: '9', name: 'Apósitos Estériles 10x10cm', slug: 'apositos-esteriles-10x10cm', category: 'curacion', price: 55, description: 'Apósitos no tejidos estériles para cobertura de heridas. Paquete de 25 piezas de 10x10cm.', inStock: true, featured: false },
    { id: '10', name: 'Solución Inyectable', slug: 'solucion-inyectable', category: 'medicamentos', price: 95, description: 'Solución salina isotónica 0.9% para irrigación. Uso médico profesional.', inStock: true, featured: false, sizes: ['100ml', '250ml', '500ml', '1000ml'] },
    { id: '11', name: 'Gasas Estériles 7.5x7.5cm', slug: 'gasas-esteriles-7-5x7-5cm', category: 'vendas', price: 42, description: 'Gasas de tejido abierto 100% algodón estéril. Paquete de 50 unidades de 7.5x7.5cm.', inStock: true, featured: false },
    { id: '12', name: 'Guantes de Látex 50pcs', slug: 'guantes-latex-50pcs', category: 'guantes', price: 155, description: 'Guantes de látex natural desechables con polvo. Alta elasticidad y sensibilidad táctil. Caja de 50.', inStock: true, featured: false, sizes: ['Chico', 'Mediano', 'Grande'] },
  ];

  for (const p of featured) {
    products.push({
      ...p,
      image: getImage(p.name, p.category),
      quote_only: false,
    });
  }

  const inventory = JSON.parse(fs.readFileSync('productos_extraidos.json', 'utf8'));
  const variantsByBase = new Map();
  const individual = [];

  for (const record of inventory) {
    const name = record['Descripción del producto  '];
    const variant = getVariant(name);
    if (variant) {
      const group = variantsByBase.get(variant.baseName) || [];
      group.push({ ...record, variantLabel: variant.label });
      variantsByBase.set(variant.baseName, group);
    } else {
      individual.push(record);
    }
  }

  for (const [baseName, group] of variantsByBase.entries()) {
    if (group.length > 1) {
      const first = group[0];
      const category = getCategory(baseName);
      const clave = String(first['Clave de artículo ']).trim();
      products.push({
        id: `inventory-${clave}`,
        name: baseName,
        slug: `${slugify(baseName)}-${slugify(clave)}`,
        category,
        price: 0,
        description: `Disponible bajo cotización. Variantes: ${[...new Set(group.map((r) => r.variantLabel))].join(', ')}.`,
        image: getImage(baseName, category),
        inStock: group.some((r) => Number(r['existencia real']) > 0),
        featured: false,
        sizes: [...new Set(group.map((r) => r.variantLabel))],
        quote_only: true,
      });
    } else {
      individual.push(group[0]);
    }
  }

  for (const record of individual) {
    const name = record['Descripción del producto  '];
    const category = getCategory(name);
    const clave = String(record['Clave de artículo ']).trim();
    products.push({
      id: `inventory-${clave}`,
      name,
      slug: `${slugify(name)}-${slugify(clave)}`,
      category,
      price: 0,
      description: `Clave de artículo: ${clave}. Disponible bajo cotización.`,
      image: getImage(name, category),
      inStock: Number(record['existencia real']) > 0,
      featured: false,
      quote_only: true,
    });
  }

  return products;
}

async function main() {
  const products = buildProducts();
  console.log(`Preparados ${products.length} productos para insertar.`);

  const { error: catErr } = await supabase.from('categories').upsert([
    { name: 'Guantes', slug: 'guantes', description: 'Guantes estériles y no estériles.', image: '/guantes.png', sort_order: 10 },
    { name: 'Material de Curación', slug: 'curacion', description: 'Todo lo necesario para el cuidado y curación de heridas.', image: '/material-curacion.png', sort_order: 20 },
    { name: 'Vendas y Gasas', slug: 'vendas', description: 'Vendas, gasas y apósitos.', image: '/material-curacion.png', sort_order: 30 },
    { name: 'Jeringas', slug: 'jeringas', description: 'Jeringas, agujas y sistemas de punción.', image: '/vias-iv.png', sort_order: 40 },
    { name: 'Medicamentos', slug: 'medicamentos', description: 'Soluciones y medicamentos.', image: '/diagnostico.png', sort_order: 50 },
    { name: 'Equipo Médico', slug: 'equipo', description: 'Equipo de diagnóstico y soporte.', image: '/diagnostico.png', sort_order: 60 },
  ], { onConflict: 'slug' });

  if (catErr) {
    console.error('Error insertando categorías:', catErr);
    process.exit(1);
  }

  const batchSize = 100;
  for (let i = 0; i < products.length; i += batchSize) {
    const batch = products.slice(i, i + batchSize).map((p) => ({
      name: p.name,
      slug: p.slug,
      category: p.category,
      price: p.price,
      description: p.description,
      image: p.image,
      in_stock: p.inStock,
      featured: p.featured,
      sizes: p.sizes || null,
      quote_only: p.quote_only,
    }));

    const { error } = await supabase.from('products').upsert(batch, { onConflict: 'slug' });
    if (error) {
      console.error(`Error insertando lote ${i / batchSize + 1}:`, error);
      process.exit(1);
    }
    console.log(`Insertado lote ${i / batchSize + 1} (${batch.length} productos)`);
  }

  console.log('Seed completado.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
