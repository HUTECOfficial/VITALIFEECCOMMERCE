const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const imageMap = JSON.parse(fs.readFileSync('image-upload-map.json', 'utf8'));

function normalize(text) {
  return String(text)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

const STOP_WORDS = new Set([
  'de', 'del', 'la', 'las', 'el', 'los', 'y', 'o', 'u', 'con', 'por', 'para',
  'sin', 'al', 'en', 'un', 'una', 'p', 'c', 'x', 'sobre', 'sobres', 'bajo',
  'fco', 'frasco', 'amp', 'ampolla', 'tab', 'tableta', 'caps', 'capsula',
  'iny', 'inyeccion', 'eq', 'equipo', 'ml', 'mg', 'mm', 'cm', 'grs', 'gr',
  'lts', 'lt', 'lt', 'pz', 'pzas', 'pza', 'cj', 'cja', 'caja', 'bolsa',
]);

function cleanWords(text) {
  return normalize(text)
    .split(' ')
    .filter((w) => w && w.length > 2 && !STOP_WORDS.has(w) && !/^\d+(\.\d+)?$/.test(w));
}

function commonPrefix(a, b) {
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) i++;
  return i;
}

function wordMatch(productWord, imageWord) {
  if (productWord === imageWord) return true;
  if (productWord.length < 3 || imageWord.length < 3) return false;
  if (productWord.includes(imageWord) || imageWord.includes(productWord)) return true;
  const lenDiff = Math.abs(productWord.length - imageWord.length);
  if (productWord.startsWith(imageWord) || imageWord.startsWith(productWord)) {
    return lenDiff <= 1;
  }
  return commonPrefix(productWord, imageWord) >= 4 && lenDiff <= 2;
}

function parseImageName(imageNewName) {
  const name = imageNewName.replace(/\.png$/, '');
  const parts = name.split('_');
  const brandPart = parts.pop();
  const basePart = parts.join('_');
  return {
    baseWords: cleanWords(basePart),
    brandWords: cleanWords(brandPart),
  };
}

function scoreProductImage(productName, imageNewName) {
  const productWords = cleanWords(productName);
  const { baseWords, brandWords } = parseImageName(imageNewName);

  if (productWords.length === 0 || baseWords.length === 0) return 0;

  let matchedBase = 0;
  for (const iw of baseWords) {
    if (productWords.some((pw) => wordMatch(pw, iw))) matchedBase++;
  }

  const baseCoverage = matchedBase / baseWords.length;

  let brandMatch = false;
  if (brandWords.length > 0) {
    brandMatch = brandWords.every((bw) =>
      productWords.some((pw) => wordMatch(pw, bw))
    );
  }

  // Require at least one base word match
  if (matchedBase === 0) return 0;

  // Require solid base-word coverage
  const acceptable = baseCoverage >= 0.6 || (brandMatch && baseCoverage >= 0.4);
  if (!acceptable) return 0;

  return baseCoverage + (brandMatch ? 0.35 : 0);
}

const PLACEHOLDERS = {
  vendas: '/material-curacion.png',
  guantes: '/guantes.png',
  jeringas: '/vias-iv.png',
  medicamentos: '/diagnostico.png',
  curacion: '/material-curacion.png',
  equipo: '/diagnostico.png',
};

function getPlaceholder(category) {
  return PLACEHOLDERS[category] || '/diagnostico.png';
}

async function resetImages(products) {
  const byCategory = new Map();
  for (const p of products) {
    const placeholder = getPlaceholder(p.category);
    const ids = byCategory.get(placeholder) || [];
    ids.push(p.id);
    byCategory.set(placeholder, ids);
  }
  for (const [placeholder, ids] of byCategory.entries()) {
    const { error } = await supabase.from('products').update({ image: placeholder }).in('id', ids);
    if (error) {
      console.error('Error reiniciando imágenes:', error);
      process.exit(1);
    }
  }
  console.log('Imágenes reiniciadas a placeholders por categoría.');
}

async function main() {
  const { data: products, error } = await supabase.from('products').select('id,name,category,image');
  if (error) {
    console.error('Error leyendo productos:', error);
    process.exit(1);
  }

  await resetImages(products);

  let matched = 0;
  let unmatched = 0;
  const updates = [];

  for (const product of products) {
    let bestScore = 0;
    let bestUrl = null;
    let bestImageName = null;

    for (const { originalName, newName, publicUrl } of imageMap) {
      const score = scoreProductImage(product.name, newName);
      if (score > bestScore) {
        bestScore = score;
        bestUrl = publicUrl;
        bestImageName = newName;
      }
    }

    if (bestUrl && bestScore > 0) {
      updates.push({ id: product.id, image: bestUrl });
      matched++;
      console.log(`✓ ${product.name} -> ${bestImageName}`);
    } else {
      unmatched++;
      console.log(`✗ Sin imagen: ${product.name}`);
    }
  }

  // Group updates by image URL and update all matching product IDs at once
  const updatesByImage = new Map();
  for (const { id, image } of updates) {
    const ids = updatesByImage.get(image) || [];
    ids.push(id);
    updatesByImage.set(image, ids);
  }

  let updated = 0;
  let batchNo = 1;
  for (const [imageUrl, ids] of updatesByImage.entries()) {
    const { error: updateError } = await supabase
      .from('products')
      .update({ image: imageUrl })
      .in('id', ids);
    if (updateError) {
      console.error(`Error actualizando lote ${batchNo}:`, updateError);
      process.exit(1);
    }
    updated += ids.length;
    console.log(`Actualizado lote ${batchNo} (${ids.length} productos) -> ${imageUrl}`);
    batchNo++;
  }

  console.log('\nResumen:');
  console.log(`- Productos: ${products.length}`);
  console.log(`- Con imagen vinculada: ${matched}`);
  console.log(`- Sin imagen: ${unmatched}`);
  console.log(`- Actualizados en Supabase: ${updated}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
