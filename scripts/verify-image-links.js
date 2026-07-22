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
  'lts', 'lt', 'pz', 'pzas', 'pza', 'cj', 'cja', 'caja', 'bolsa',
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
  if (productWord.startsWith(imageWord) || imageWord.startsWith(productWord)) return true;
  if (productWord.includes(imageWord) || imageWord.includes(productWord)) return true;
  return commonPrefix(productWord, imageWord) >= 4;
}

function parseImageName(imageNewName) {
  const name = imageNewName.replace(/\.png$/, '');
  const parts = name.split('_');
  const brandPart = parts.pop();
  const basePart = parts.join('_');
  return {
    baseWords: cleanWords(basePart),
    brandWords: cleanWords(brandPart),
    brandRaw: brandPart,
    baseRaw: basePart,
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

  if (matchedBase === 0) return 0;

  const acceptable = baseCoverage >= 0.5 || (brandMatch && baseCoverage >= 0.25);
  if (!acceptable) return 0;

  return baseCoverage + (brandMatch ? 0.35 : 0);
}

async function main() {
  const { data: products, error } = await supabase.from('products').select('id,name,image').order('name');
  if (error) {
    console.error('Error leyendo productos:', error);
    process.exit(1);
  }

  const lines = [];
  lines.push('VERIFICACIÓN DE IMÁGENES LIGADAS');
  lines.push('=================================');
  lines.push(`Total productos: ${products.length}`);
  lines.push('');

  let matched = 0;
  let unmatched = 0;

  for (const product of products) {
    const isSupabaseImage = product.image && product.image.includes('supabase.co');
    if (!isSupabaseImage) {
      unmatched++;
      lines.push(`[SIN IMAGEN] ${product.name}`);
      continue;
    }

    matched++;

    // Find which image file was matched
    let bestImageName = null;
    let bestScore = -1;
    for (const { newName, publicUrl } of imageMap) {
      if (publicUrl === product.image) {
        bestImageName = newName;
        break;
      }
      const score = scoreProductImage(product.name, newName);
      if (score > bestScore) {
        bestScore = score;
        bestImageName = newName;
      }
    }

    const { brandRaw, baseRaw } = parseImageName(bestImageName || '');
    lines.push(`[OK] ${product.name}`);
    lines.push(`     Imagen: ${bestImageName || 'N/A'}  (base: ${baseRaw}, marca: ${brandRaw})`);
    lines.push(`     URL: ${product.image}`);
    lines.push('');
  }

  lines.push('');
  lines.push('Resumen:');
  lines.push(`- Con imagen: ${matched}`);
  lines.push(`- Sin imagen: ${unmatched}`);

  fs.writeFileSync('verificacion-imagenes.txt', lines.join('\n'));
  console.log('Archivo generado: verificacion-imagenes.txt');
  console.log(`- Con imagen: ${matched}`);
  console.log(`- Sin imagen: ${unmatched}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
