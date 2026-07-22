const fs = require('fs');
const path = require('path');

const IMAGE_DIR = path.join(__dirname, 'image');
const BUCKET = 'VITALIFE';
const SUPABASE_URL = 'https://qczoqkhgphlhomcscnsk.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

function slugify(name) {
  const base = path.basename(name, path.extname(name));
  const ext = path.extname(name).toLowerCase();
  return (
    base
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9._-]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .replace(/-+/g, '-')
      .toLowerCase() + ext
  );
}

async function uploadFile(filePath, storagePath) {
  const buffer = fs.readFileSync(filePath);
  const formData = new FormData();
  const blob = new Blob([buffer], { type: 'image/png' });
  formData.append('file', blob, storagePath);

  const uploadUrl = `${SUPABASE_URL}/storage/v1/object/${BUCKET}/${encodeURIComponent(storagePath)}`;
  const res = await fetch(uploadUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${SUPABASE_KEY}`,
      apikey: ANON_KEY,
    },
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Upload failed for ${storagePath}: ${res.status} ${text}`);
  }
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${storagePath}`;
}

async function main() {
  if (!SUPABASE_KEY) {
    throw new Error('Missing SUPABASE_SECRET_KEY or SUPABASE_SERVICE_ROLE_KEY env var');
  }
  if (!ANON_KEY) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY env var');
  }

  const files = fs
    .readdirSync(IMAGE_DIR)
    .filter((f) => f.toLowerCase().endsWith('.png'))
    .sort();

  const results = [];
  const usedNames = new Set();

  for (const original of files) {
    let safeName = slugify(original);
    let counter = 1;
    const ext = path.extname(safeName);
    const baseNoExt = safeName.slice(0, -ext.length);
    while (usedNames.has(safeName)) {
      safeName = `${baseNoExt}-${counter}${ext}`;
      counter++;
    }
    usedNames.add(safeName);

    const oldPath = path.join(IMAGE_DIR, original);
    const newPath = path.join(IMAGE_DIR, safeName);

    if (oldPath !== newPath) {
      fs.renameSync(oldPath, newPath);
    }

    const publicUrl = await uploadFile(newPath, safeName);
    results.push({ originalName: original, newName: safeName, publicUrl });
    console.log(`✓ ${original} -> ${safeName}`);
  }

  fs.writeFileSync('image-upload-map.json', JSON.stringify(results, null, 2));
  console.log(`\nUploaded ${results.length} images to Supabase bucket "${BUCKET}".`);
  console.log('Mapping saved to image-upload-map.json');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
