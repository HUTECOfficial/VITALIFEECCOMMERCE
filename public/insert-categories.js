const fs = require('fs');
let content = fs.readFileSync('app/page.tsx', 'utf8');

// Insert the component call
const hookMatch = `      <HeroSection />
      <StatsBar />
      <TopDestacadosSection />`;
      
const hookReplace = `      <HeroSection />
      <StatsBar />
      <CategoriasSection />
      <TopDestacadosSection />`;

content = content.replace(hookMatch, hookReplace);

// Append the component definition
const appendedCode = `
// ─────────────────────────────────────────────
// CATEGORIAS PRINCIPALES
// ─────────────────────────────────────────────
function CategoriasSection() {
  const categorias = [
    { name: "Equipo Quirúrgico", img: "/equipo-quirurgico.png", href: "/insumos" },
    { name: "Diagnóstico", img: "/diagnostico.png", href: "/insumos" },
    { name: "Guantes", img: "/guantes.png", href: "/insumos" },
    { name: "Material de Curación", img: "/material-curacion.png", href: "/insumos" },
    { name: "Misceláneos", img: "/miscelaneos.png", href: "/insumos" },
    { name: "Rehabilitación", img: "/rehabilitacion.png", href: "/insumos" },
    { name: "Sondas y Catéteres", img: "/sondas-cateteres.png", href: "/insumos" },
    { name: "Ventilación", img: "/ventilacion.png", href: "/insumos" },
    { name: "Vías IV", img: "/vias-iv.png", href: "/insumos" },
  ];

  return (
    <section className="py-20 relative bg-[#f8fafc] overflow-hidden border-t-2 border-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#1a3a6b]/5 text-[#1a3a6b] rounded-full text-xs font-black uppercase tracking-widest mb-3">
            <span className="w-1.5 h-1.5 bg-[#2eb8d4] rounded-full" />
            Explora por línea
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-[#1a3a6b]">
            Categorías <span className="text-[#2eb8d4]">Principales</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categorias.map((cat, i) => {
            // Make the first item take up more space in the grid (e.g. span 2 cols/rows) optionally, 
            // but for 9 items, a flexible masonry or standard grid is nice.
            const isLarge = i === 0 || i === 3;
            return (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className={cn(
                  "relative group rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-[#2eb8d4]/20 transition-all duration-500",
                  isLarge ? "col-span-2 row-span-2 lg:col-span-2 lg:row-span-2 min-h-[200px]" : "col-span-1 min-h-[160px]"
                )}
              >
                <Link href={cat.href} className="absolute inset-0 z-20" aria-label={\`Navegar a \${cat.name}\`} />
                <Image
                  src={cat.img}
                  alt={cat.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a3a6b]/90 via-[#1a3a6b]/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 left-0 right-0 p-5 flex items-end justify-between z-10 translate-y-2 group-hover:translate-y-0 transition-transform">
                  <h3 className="text-white font-black leading-tight text-lg shadow-sm">{cat.name}</h3>
                  <div className="w-8 h-8 rounded-full bg-[#2eb8d4] text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform scale-50 group-hover:scale-100">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
`;

content += appendedCode;

// Add 'cn' import if missing, but wait, it might be easier to just avoid 'cn' or ensure it's imported.
// Actually, let's just make cn available or avoid it in case it's not imported.
// We can just use standard template literals. Let's fix that.
let correctedAppendedCode = appendedCode.replace(/cn\([\s\S]*?\)/, \`\`\${isLarge ? "col-span-2 lg:col-span-2 row-span-2 min-h-[220px]" : "col-span-1 min-h-[180px]"} relative group rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-[#2eb8d4]/20 transition-all duration-500\`\`);

fs.writeFileSync('app/page.tsx', content.replace(appendedCode, correctedAppendedCode));
