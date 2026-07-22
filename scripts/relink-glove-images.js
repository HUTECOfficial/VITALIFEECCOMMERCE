const fs = require("fs");
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const imageMap = JSON.parse(fs.readFileSync("image-upload-map.json", "utf8"));
const images = new Map(imageMap.map(({ newName, publicUrl }) => [newName, publicUrl]));

function imageUrl(name) {
  const url = images.get(name);
  if (!url) throw new Error(`Imagen no encontrada en image-upload-map.json: ${name}`);
  return url;
}

function getGloveImage(name) {
  const product = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase();

  if (product.includes("PROTEXIS") || (product.includes("CIRUJANO") && product.includes("PROTEC"))) {
    return imageUrl("guante-para-cirugia_protec.png");
  }
  if (product.includes("AMBIDERM ELITE") || (product.includes("ESTERIL") && product.includes("AMBIDERM"))) {
    return imageUrl("guante-esteril_ambiderm.png");
  }
  if (product.includes("PLUS")) return imageUrl("guante-no-esteril-plus_ambiderm.png");
  if (product.includes("NEGRO")) return imageUrl("guante-no-esteril-negro_ambiderm.png");
  if (product.includes("KIDGLOVES") || product.includes("CONFORT") || product.includes("LATEX")) {
    return imageUrl("guante-no-esteril-kidgloves_ambiderm.png");
  }
  if (product.includes("VINIL")) return imageUrl("guante-vinil_ambiderm.png");
  if (product.includes("CIRUJIA")) return imageUrl("guante-para-cirujia_ambiderm.png");
  if (product.includes("NITRILO") || product.includes("COLORFULL") || product.includes("UNISEAL")) {
    return imageUrl("guante-de-nitrilo_ambiderm.png");
  }
  return null;
}

async function main() {
  const { data: products, error } = await supabase
    .from("products")
    .select("id,name,image")
    .eq("category", "guantes")
    .order("name");

  if (error) throw error;

  let updated = 0;
  let unmatched = 0;

  for (const product of products) {
    const image = getGloveImage(product.name);
    if (!image) {
      unmatched++;
      console.log(`SIN REGLA\t${product.name}`);
      continue;
    }
    if (product.image === image) {
      console.log(`SIN CAMBIO\t${product.name}`);
      continue;
    }
    const { error: updateError } = await supabase.from("products").update({ image }).eq("id", product.id);
    if (updateError) throw updateError;
    updated++;
    console.log(`ACTUALIZADO\t${product.name}`);
  }

  const foleyImage = imageUrl("sonda-foley_covidien.png");
  const { error: foleyError } = await supabase
    .from("products")
    .update({ category: "jeringas", image: foleyImage })
    .eq("name", "SONDA FOLEY 8FR 2V DE LATEX");
  if (foleyError) throw foleyError;

  console.log(`Productos de guantes: ${products.length}`);
  console.log(`Actualizados: ${updated}`);
  console.log(`Sin regla: ${unmatched}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
