const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const imageMap = JSON.parse(fs.readFileSync('image-upload-map.json', 'utf8'));
const productNameOverrides = require('../data/product-name-overrides.json');
const productImageOverrides = require('../data/product-image-overrides.json');

const sizeLabels = {
  CHICA: 'Chico', CHICO: 'Chico',
  MED: 'Mediano', MEDIANA: 'Mediano', MEDIANO: 'Mediano',
  GRANDE: 'Grande',
  XL: 'Extra grande', XXL: 'Extra grande',
  '#6.0': '6', '#6.5': '6.5', '#7.0': '7', '#7.5': '7.5', '#8.0': '8',
  'TALLA 6 1/2': '6.5', 'TALLA 7 1/2': '7.5', 'TALLA 6': '6', 'TALLA 7': '7', 'TALLA 8': '8',
};

const colorLabels = {
  'AZUL ROYAL': 'Azul royal', 'AZUL COBALTO': 'Azul cobalto',
  BLANCO: 'Blanco', BLANCA: 'Blanco', NEGRO: 'Negro', NEGRA: 'Negro',
  AZUL: 'Azul', ROJO: 'Rojo', ROJA: 'Rojo', VERDE: 'Verde',
  AMARILLO: 'Amarillo', AMARILLA: 'Amarillo', ROSA: 'Rosa', VIOLETA: 'Violeta',
};

function getVariant(name) {
  let baseName = name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
  const sizes = [];
  const colors = [];
  for (const [term, label] of Object.entries(sizeLabels)) {
    const pattern = term.startsWith('#') ? new RegExp(`\\${term.replace('.', '\\.')}(?![0-9])`, 'g') : new RegExp(`\\b${term}\\b`, 'g');
    if (pattern.test(baseName)) { sizes.push(label); baseName = baseName.replace(pattern, ' '); }
  }
  for (const [term, label] of Object.entries(colorLabels)) {
    const pattern = new RegExp(`\\b${term}\\b`, 'g');
    if (pattern.test(baseName)) { colors.push(label); baseName = baseName.replace(pattern, ' '); }
  }
  baseName = baseName.replace(/\s+/g, ' ').trim();
  if (sizes.length === 0 && colors.length === 0) return null;
  return { baseName, sizes, colors };
}

function getDisplayName(record) {
  const articleCode = String(record['Clave de artículo ']).trim();
  return productNameOverrides[articleCode] || record['Descripción del producto  '];
}

function getBrandKey(record) {
  const articleCode = String(record['Clave de artículo ']).trim();
  return articleCode.match(/^[A-Z]+/)?.[0] || articleCode;
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
  const product = name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
  if (/^GUANTE|GUANTE /.test(product)) return 'guantes';
  if (/RECOLECTOR.*(RPBI|PUNZOCORT|PUZOCORT)|BOLSA RESID|BOLSA P\/ESTERILIZAR|CINTA TESTIGO.*VAPOR/.test(product)) return 'residuos';
  if (/CUBREBOCA|KN95|GORRO|CUBREZAPATO|BATA QUIRURGICA|UNIFORME QUIRURGICO|CAMPO QUIRURGICO|SABANA PARA EXPLORACION|BOTA SIN PLANTILLA/.test(product)) return 'proteccion-desechables';
  if (/ALCOHOL|CLORHEX|CLORHEXI|YODO|DERMODINE|DERMOCLEEN|DERMO-QRIT|ANTIBENZIL|ANTISEPT|GEL ANTIBACTERIAL|AGUA OXIGENADA|CHLORAPREP|TOALLAS ALCOHOLADAS|CEPILLO P\/USO QUIRURGICO/.test(product)) return 'antisepticos';
  if (/FERULA|ZAPATO POST|COLLARIN|CABESTRILLO|CINTA KINESIOLOGICA|INMOVILIZADOR|GYPSONA|MEDIAS ANTIEMBOLICAS|CORREA PARA CLAVICULA/.test(product)) return 'rehabilitacion';
  if (/OXIMETRO|BAUMANOMETRO|TENSIOMETRO|ESTETOSCOPIO|GLUCOMETRO|TIRAS (REACTIVAS|CONTOUR|ACCU)|LANCETA|TERMOMETRO|ELECTRODO|GEL ULTRASON|ALCOHOLIMETRO|ROLLO DE PAPEL PARA ELECTRO/.test(product)) return 'diagnostico';
  if (/MASCARILLA (RCP|P\/OXIGENO|LARINGEA|YUWELL)|TUBO (DE )?SUCCION|CATETER P\/SUCCION|SISTEMA DE SUCCION|TUBO ENDOTRAQUEAL|SONDA ENDOT|CANULA (GUEDEL|CPAP)|CIRCUITO BAIN|SONDA NASAL P\/OXIGENO|PUNTA NASAL|CATETER PARA OXIGENO|CANULA YANKAWER/.test(product)) return 'respiratorio';
  if (/SONDA|DRENAJE|PENROSE|BOLSA RECOLECTORA DE ORINA|BOLSA P\/COLOSTOMIA|FIJADOR P\/SONDA|BOLSA KENGUARD|JALEA LUBRICANTE|LUBRI-6/.test(product)) return 'sondas-cateteres';
  if (/FLEBOTEK|VENOCLISIS|BOMBA DE INFUSION|GIRATEK|TEGO|PUNZOCAT|INSYTE|SURFLASH|CATETER 7FR|CONECTOR|LLAVE 3 VIAS|SOLUCION (CS|HT|DX|FP|HESTAR|KRIT)|SOL HESTAR|AGUA (P\/IRRIGA|INY|DESTILADA)|CLORURO\/POTASIO|SULFATO MAGNESIO|GLUCONATO DE CALCIO|BICARNAT|BICARBONATO SOD|MANITOL|MARIPOSA/.test(product)) return 'terapia-iv';
  if (/BISTURI|HOJA P\/BISTURI|MANGO DE BISTURI|SUTURA|VICRYL|NYLON|SEDA|MONOCRYL|MALLA PROLENE|ELECTROCAUTERIO|CAMPANA P\/CIRCUNCISION|PINZA UMBILICAL|TIJERA UMBILICAL|PORTA AGUJA|EQUIPO (DE|PARA) CIRUGIA|MALLA.*MESH|COMPRESA LAPAROTOMIA|TUBO P\/LIGADURA/.test(product)) return 'quirurgico';
  if (/JERINGA|AGUJA|PERISAFE|ESPICAT/.test(product)) return 'jeringas';
  if (/GASA|VENDA|APOSITO|TEGADERM|MICROPORE|LEUKOPLAST|TRANSPORE|CURITAS|ALGODON|GUATA|COMPRESA|JELONET|COBAN|MALLA TUBULAR|CUTIMED|DUODERM|ESPARADRAPO|TORUNDA|APLICADOR ESTERIL/.test(product)) return 'curacion';
  if (/PASTILLERO|VASO RECOLECTOR|BATA P\/ PACIENTE|BATA PARA PACIENTE|PAÑAL|ORINAL|COMODO|RIÑON DE PLASTICO|BOLSA PARA ENEMA|PERA HULE|GOTERO|ABATELENGUAS|RASTRILLO|ROLLO P\/MESA|BOTIQUIN|KIT POP WASH|ARTICULOS: VARIOS/.test(product)) return 'atencion-paciente';
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
  if (category === 'guantes') {
    const gloveImages = {
      'guante-para-cirugia_protec.png': ['protexis', 'cirujano-protec'],
      'guante-esteril_ambiderm.png': ['ambiderm-elite', 'esteril-ambiderm'],
      'guante-no-esteril-plus_ambiderm.png': ['guante-plus'],
      'guante-no-esteril-negro_ambiderm.png': ['nitrilo-negro'],
      'guante-no-esteril-kidgloves_ambiderm.png': ['kidgloves', 'guante-confort', 'guantes-latex'],
      'guante-vinil_ambiderm.png': ['vinil'],
      'guante-para-cirujia_ambiderm.png': ['cirujia'],
      'guante-de-nitrilo_ambiderm.png': ['nitrilo', 'colorfull', 'uniseal'],
    };
    for (const [imageName, terms] of Object.entries(gloveImages)) {
      if (terms.some((term) => normName.includes(term))) {
        const image = imageMap.find(({ newName }) => newName === imageName);
        if (image) return image.publicUrl;
      }
    }
  }
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
    guantes: '/guantes.png',
    curacion: '/material-curacion.png',
    antisepticos: '/material-curacion.png',
    jeringas: '/vias-iv.png',
    'terapia-iv': '/vias-iv.png',
    'sondas-cateteres': '/sondas-cateteres.png',
    respiratorio: '/ventilacion.png',
    diagnostico: '/diagnostico.png',
    quirurgico: '/equipo-quirurgico.png',
    rehabilitacion: '/rehabilitacion.png',
    medicamentos: '/diagnostico.png',
    'proteccion-desechables': '/miscelaneos.png',
    residuos: '/miscelaneos.png',
    'atencion-paciente': '/miscelaneos.png',
  };
  return placeholders[category] || '/diagnostico.png';
}

function getProductImage(slug, name, category) {
  return productImageOverrides[slug] || getImage(name, category);
}

function buildProducts() {
  const products = [];

  const featured = [
    { id: '1', name: 'Guantes de Nitrilo 100pcs', slug: 'guantes-nitrilo-100pcs', category: 'guantes', price: 189, description: 'Guantes desechables de nitrilo sin látex. Alta resistencia a químicos. Caja de 100 piezas.', inStock: true, featured: true, sizes: ['Chico', 'Mediano', 'Grande'] },
    { id: '2', name: 'Gel Antibacterial', slug: 'gel-antibacterial', category: 'antisepticos', price: 85, description: 'Gel antibacterial con 70% de alcohol isopropílico. Fórmula con aloe vera para cuidado de manos.', inStock: true, featured: true, sizes: ['100ml', '250ml', '500ml'] },
    { id: '3', name: 'Vendas de Gasa 10cm x 5m', slug: 'vendas-gasa-10cm-5m', category: 'curacion', price: 45, description: 'Venda de gasa esterilizada 100% algodón. Ideal para apósitos y curaciones. Paquete con 12 rollos.', inStock: true, featured: false },
    { id: '4', name: 'Jeringas 5ml x 10pcs', slug: 'jeringas-5ml-10pcs', category: 'jeringas', price: 65, description: 'Jeringas desechables de 5ml con aguja 21G. Estériles y empacadas individualmente. Paquete de 10.', inStock: true, featured: false },
    { id: '5', name: 'Gasa de Tela 2.5cm', slug: 'gasa-tela-2-5cm', category: 'curacion', price: 38, description: 'Gasa de tela de algodón transpirable. Alta adherencia. Rollo de 9m x 2.5cm.', inStock: true, featured: false },
    { id: '6', name: 'Oxímetro de Pulso Digital', slug: 'oximetro-pulso-digital', category: 'diagnostico', price: 220, description: 'Oxímetro de pulso digital con pantalla LED. Mide la saturación de oxígeno (SpO2) y frecuencia cardíaca. Compacto y fácil de usar.', inStock: true, featured: true },
    { id: '7', name: 'Tensiómetro Manual', slug: 'tensiometro-manual', category: 'diagnostico', price: 650, description: 'Esfigmomanómetro manual aneroide con estetoscopio. Rango 0-300mmHg. Brazalete adulto incluido.', inStock: true, featured: true },
    { id: '8', name: 'Estetoscopio Clínico', slug: 'estetoscopio-clinico', category: 'diagnostico', price: 480, description: 'Estetoscopio de doble campana para uso clínico. Acústica superior. Tubos de 22 pulgadas.', inStock: true, featured: false },
    { id: '9', name: 'Apósitos Estériles 10x10cm', slug: 'apositos-esteriles-10x10cm', category: 'curacion', price: 55, description: 'Apósitos no tejidos estériles para cobertura de heridas. Paquete de 25 piezas de 10x10cm.', inStock: true, featured: false },
    { id: '10', name: 'Solución Inyectable', slug: 'solucion-inyectable', category: 'terapia-iv', price: 95, description: 'Solución salina isotónica 0.9% para irrigación. Uso médico profesional.', inStock: true, featured: false, sizes: ['100ml', '250ml', '500ml', '1000ml'] },
    { id: '11', name: 'Gasas Estériles 7.5x7.5cm', slug: 'gasas-esteriles-7-5x7-5cm', category: 'curacion', price: 42, description: 'Gasas de tejido abierto 100% algodón estéril. Paquete de 50 unidades de 7.5x7.5cm.', inStock: true, featured: false },
    { id: '12', name: 'Guantes de Látex 50pcs', slug: 'guantes-latex-50pcs', category: 'guantes', price: 155, description: 'Guantes de látex natural desechables con polvo. Alta elasticidad y sensibilidad táctil. Caja de 50.', inStock: true, featured: false, sizes: ['Chico', 'Mediano', 'Grande'] },
  ];

  for (const p of featured) {
    products.push({
      ...p,
        image: getProductImage(p.slug, p.name, p.category),
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
      const groupKey = `${getBrandKey(record)}::${variant.baseName}`;
      const group = variantsByBase.get(groupKey) || [];
      group.push(record);
      variantsByBase.set(groupKey, group);
    } else {
      individual.push(record);
    }
  }

  for (const [, group] of variantsByBase.entries()) {
    if (group.length > 1) {
      const first = group[0];
      const baseName = getVariant(first['Descripción del producto  '])?.baseName || first['Descripción del producto  '];
      const category = getCategory(baseName);
      const clave = String(first['Clave de artículo ']).trim();
      products.push({
        id: `inventory-${clave}`,
        name: baseName,
        slug: `${slugify(baseName)}-${slugify(clave)}`,
        category,
        price: 0,
        description: 'Disponible bajo cotización. Elige las opciones disponibles.',
        image: getProductImage(`${slugify(baseName)}-${slugify(clave)}`, baseName, category),
        inStock: group.some((r) => Number(r['existencia real']) > 0),
        stockQuantity: group.reduce((total, record) => total + Math.max(0, Number(record['existencia real']) || 0), 0),
        featured: false,
        sizes: [...new Set(group.flatMap((r) => getVariant(r['Descripción del producto  '])?.sizes || []))],
        colors: [...new Set(group.flatMap((r) => getVariant(r['Descripción del producto  '])?.colors || []))],
        quote_only: true,
      });
    } else {
      individual.push(group[0]);
    }
  }

  for (const record of individual) {
    const sourceName = record['Descripción del producto  '];
    const category = getCategory(sourceName);
    const clave = String(record['Clave de artículo ']).trim();
    products.push({
      id: `inventory-${clave}`,
      name: getDisplayName(record),
      slug: `${slugify(sourceName)}-${slugify(clave)}`,
      category,
      price: 0,
      description: `Clave de artículo: ${clave}. Disponible bajo cotización.`,
      image: getProductImage(`${slugify(sourceName)}-${slugify(clave)}`, sourceName, category),
      inStock: Number(record['existencia real']) > 0,
      stockQuantity: Math.max(0, Number(record['existencia real']) || 0),
      featured: false,
      quote_only: true,
    });
  }

  return products;
}

async function removeStaleInventoryProducts(products) {
  const inventory = JSON.parse(fs.readFileSync('productos_extraidos.json', 'utf8'));
  const activeSlugs = new Set(products.map((product) => product.slug));
  const inventoryCodeSuffixes = inventory.map((record) => `-${slugify(String(record['Clave de artículo ']).trim())}`);
  const { data, error } = await supabase.from('products').select('slug');
  if (error || !data) {
    console.warn('No se pudieron revisar productos obsoletos; se conservaron sin cambios.');
    return;
  }

  const staleSlugs = data
    .map((product) => product.slug)
    .filter((slug) => !activeSlugs.has(slug) && inventoryCodeSuffixes.some((suffix) => slug.endsWith(suffix)));

  for (let index = 0; index < staleSlugs.length; index += 100) {
    const batch = staleSlugs.slice(index, index + 100);
    const { error: deleteError } = await supabase.from('products').delete().in('slug', batch);
    if (deleteError) throw deleteError;
  }

  if (staleSlugs.length) console.log(`Eliminados ${staleSlugs.length} registros de inventario sustituidos por variantes agrupadas.`);
}

async function main() {
  const products = buildProducts();
  console.log(`Preparados ${products.length} productos para insertar.`);

  const { error: catErr } = await supabase.from('categories').upsert([
    { name: 'Guantes', slug: 'guantes', description: 'Guantes estériles y no estériles.', image: '/guantes.png', sort_order: 10 },
    { name: 'Curación, apósitos y vendajes', slug: 'curacion', description: 'Gasas, vendas, apósitos y material para el cuidado de heridas.', image: '/material-curacion.png', sort_order: 20 },
    { name: 'Antisépticos y control de infecciones', slug: 'antisepticos', description: 'Antisépticos, desinfectantes y preparación de piel.', image: '/material-curacion.png', sort_order: 30 },
    { name: 'Agujas, jeringas y punción', slug: 'jeringas', description: 'Agujas hipodérmicas, jeringas y dispositivos de punción.', image: '/vias-iv.png', sort_order: 40 },
    { name: 'Terapia intravenosa y soluciones', slug: 'terapia-iv', description: 'Venoclisis, accesos, soluciones y terapia de infusión.', image: '/vias-iv.png', sort_order: 50 },
    { name: 'Sondas, catéteres y drenajes', slug: 'sondas-cateteres', description: 'Sondas de alimentación y urinarias, drenajes y ostomía.', image: '/sondas-cateteres.png', sort_order: 60 },
    { name: 'Terapia respiratoria y ventilación', slug: 'respiratorio', description: 'Oxigenoterapia, vía aérea, succión y ventilación.', image: '/ventilacion.png', sort_order: 70 },
    { name: 'Diagnóstico y monitoreo', slug: 'diagnostico', description: 'Medición, monitoreo y consumibles de diagnóstico.', image: '/diagnostico.png', sort_order: 80 },
    { name: 'Equipo e instrumental quirúrgico', slug: 'quirurgico', description: 'Instrumental, suturas y consumibles para procedimientos.', image: '/equipo-quirurgico.png', sort_order: 90 },
    { name: 'Rehabilitación y ortopedia', slug: 'rehabilitacion', description: 'Soportes, inmovilización y recuperación funcional.', image: '/rehabilitacion.png', sort_order: 100 },
    { name: 'Medicamentos', slug: 'medicamentos', description: 'Medicamentos y fármacos de uso profesional.', image: '/diagnostico.png', sort_order: 110 },
    { name: 'Protección y desechables', slug: 'proteccion-desechables', description: 'Equipo de protección personal y consumibles desechables.', image: '/miscelaneos.png', sort_order: 120 },
    { name: 'Gestión de residuos', slug: 'residuos', description: 'Contenedores, bolsas y material para RPBI.', image: '/miscelaneos.png', sort_order: 130 },
    { name: 'Atención al paciente y generales', slug: 'atencion-paciente', description: 'Higiene, comodidad y accesorios generales de atención.', image: '/miscelaneos.png', sort_order: 140 },
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
      stock_quantity: p.stockQuantity ?? (p.inStock ? 1 : 0),
      featured: p.featured,
      sizes: p.colors?.length ? { sizes: p.sizes || [], colors: p.colors } : p.sizes || null,
      quote_only: p.quote_only,
    }));

    let { error } = await supabase.from('products').upsert(batch, { onConflict: 'slug' });
    // Some existing deployments predate the stock migration. Categories and
    // products can still be synchronized safely while that migration is pending.
    if (error?.code === 'PGRST204' && error.message.includes('stock_quantity')) {
      const legacyBatch = batch.map(({ stock_quantity, ...product }) => product);
      ({ error } = await supabase.from('products').upsert(legacyBatch, { onConflict: 'slug' }));
      if (!error) console.warn('La base de datos no tiene stock_quantity; se sincronizó sin esa columna.');
    }
    if (error) {
      console.error(`Error insertando lote ${i / batchSize + 1}:`, error);
      process.exit(1);
    }
    console.log(`Insertado lote ${i / batchSize + 1} (${batch.length} productos)`);
  }

  await removeStaleInventoryProducts(products);

  console.log('Seed completado.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
