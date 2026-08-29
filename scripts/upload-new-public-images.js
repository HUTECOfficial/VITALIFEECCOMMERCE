const fs = require("fs/promises");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

const bucket = "VITALIFE";
const folder = "nuevas imagenes";
const dryRun = process.argv.includes("--dry-run");
const verifyStorage = process.argv.includes("--verify-storage");
const fileNames = [
  "3m.png",
  "Agujas Jeringas.png",
  "Ambiderm.png",
  "Amsa.png",
  "Aticepticos Control de Infecciones.png",
  "Atramat.png",
  "BD.png",
  "Braund.png",
  "Curacion Apositos Vendajes.png",
  "Curacion de heridas.png",
  "Edigar.png",
  "Enfermeria Domicilio.png",
  "Fisioterapia.png",
  "Guantes principal.png",
  "Nipro.png",
  "Principal.png",
  "Protec.png",
  "Radiografias.png",
  "Renta de equipo medico.png",
  "Sondas, cateter, drenajes.png",
  "Teraparia Respiratoria.png",
  "Terapia Intravenosas soluciones.png",
  "Toma de muestra.png",
  "Vizcarra.png",
];

function objectPath(fileName) {
  return `${folder}/${fileName}`;
}

function createSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SECRET_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

async function main() {
  if (verifyStorage) {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase.storage.from(bucket).list(folder, { limit: 100 });
    if (error) throw new Error(`No se pudo leer ${folder}: ${error.message}`);

    const storedNames = new Set(data.map((item) => item.name));
    const missing = fileNames.filter((fileName) => !storedNames.has(fileName));
    if (missing.length) throw new Error(`Faltan en Storage: ${missing.join(", ")}`);

    console.log(`Verificadas ${fileNames.length} imágenes en ${bucket}/${folder}.`);
    return;
  }

  const assets = await Promise.all(fileNames.map(async (fileName) => {
    const localPath = path.resolve("public", fileName);
    const content = await fs.readFile(localPath);
    return { fileName, localPath, content };
  }));

  if (dryRun) {
    for (const asset of assets) console.log(`Preparada: ${objectPath(asset.fileName)} (${asset.content.length} bytes)`);
    console.log(`Verificadas ${assets.length} imágenes. No se subió ni eliminó ningún archivo.`);
    return;
  }

  const supabase = createSupabaseClient();

  for (const asset of assets) {
    const { error } = await supabase.storage
      .from(bucket)
      .upload(objectPath(asset.fileName), asset.content, {
        contentType: "image/png",
        cacheControl: "31536000",
        upsert: true,
      });
    if (error) throw new Error(`No se pudo subir ${asset.fileName}: ${error.message}`);
  }

  for (const asset of assets) {
    const { data, error } = await supabase.storage.from(bucket).download(objectPath(asset.fileName));
    if (error) throw new Error(`No se pudo verificar ${asset.fileName}: ${error.message}`);
    if (!data || data.size !== asset.content.length) {
      throw new Error(`La verificación de ${asset.fileName} no coincide con el archivo local.`);
    }
  }

  await Promise.all(assets.map((asset) => fs.unlink(asset.localPath)));
  console.log(`Subidas, verificadas y eliminadas localmente ${assets.length} imágenes.`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
