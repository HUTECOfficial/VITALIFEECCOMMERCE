const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

async function main() {
  const { data, error } = await supabase
    .from('products')
    .update({ price: 1, quote_only: false })
    .neq('id', '00000000-0000-0000-0000-000000000000');

  if (error) {
    console.error('Error actualizando productos:', error);
    process.exit(1);
  }

  console.log('Todos los productos actualizados a $1 MXN y quote_only=false');

  const { data: products, error: countError } = await supabase
    .from('products')
    .select('id,name,price,quote_only');

  if (countError) {
    console.error('Error contando productos:', countError);
    process.exit(1);
  }

  console.log(`Total productos: ${products.length}`);
  console.log(`Productos con price=1: ${products.filter(p => p.price === 1).length}`);
  console.log(`Productos con quote_only=false: ${products.filter(p => p.quote_only === false).length}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
