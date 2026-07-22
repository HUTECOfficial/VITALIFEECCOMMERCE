const fs = require('fs');
let content = fs.readFileSync('app/page.tsx', 'utf8');

const hookMatch = `      <HeroSection />
      <StatsBar />
      <TopDestacadosSection />`;
      
const hookReplace = `      <HeroSection />
      <StatsBar />
      <CategoriasSection />
      <TopDestacadosSection />`;

// Apply replace only if not already inserted
if (!content.includes('<CategoriasSection />')) {
  content = content.replace(hookMatch, hookReplace);
}

const appendedCode = `
// ─────────────────────────────────────────────
// CATEGORIAS PRINCIPALES
// ─────────────────────────────────────────────
function CategoriasSection() {
  const categorias = [
    { name: "Equipo Quirúrgico", img: "/equipo-quirurgico.png", href: "/insumos?cat=equipo-quirurgico" },
    { name: "Diagnóstico", img: "/diagnostico.png", href: "/insumos?cat=diagnostico" },
    { name: "Guantes", img: "/guantes.png", href: "/insumos?cat=guantes" },
    { name: "Material de Curación", img: "/material-curacion.png", href: "/insumos?cat=material-curacion" },
    { name: "Sondas y Catéteres", img: "/sondas-cateteres.png", href: "/insumos?cat=sondas" },
    { name: "Vías IV", img: "/vias-iv.png", href: "/insumos?cat=vias-iv" },
    { name: "Rehabilitación", img: "/rehabilitacion.png", href: "/insumos?cat=rehabilitacion" },
    { name: "Ventilación", img: "/ventilacion.png", href: "/insumos?cat=ventilacion" },
    { name: "Misceláneos", img: "/miscelaneos.png", href: "/insumos?cat=miscelaneos" },
  ];

  return (
    <section className="py-20 relative bg-[#f8fafc] overflow-hidden border-t-2 border-white">
      <div className="ambient-blob w-[500px] h-[500px] bottom-0 right-[-100px] bg-[rgba(46,184,212,0.06)]" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#1a3a6b]/5 text-[#1a3a6b] rounded-full text-xs font-black uppercase tracking-widest mb-3">
            <span className="w-1.5 h-1.5 bg-[#ff4757] rounded-full animate-pulse" />
            Explora por línea
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-[#1a3a6b]">
            Categorías <span className="text-[#2eb8d4]">Principales</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6 auto-rows-fr">
          {categorias.map((cat, i) => {
            const isLarge = i === 0 || i === 3; // Make some items span larger
            return (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className={\`\${isLarge ? "col-span-2 row-span-2" : "col-span-1 row-span-1"} relative group rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-[#2eb8d4]/30 transition-all duration-500 min-h-[160px] sm:min-h-[200px] flex\`}
              >
                <Link href={cat.href} className="absolute inset-0 z-20" aria-label={"Navegar a " + cat.name} />
                <Image
                  src={cat.img}
                  alt={cat.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a3a6b]/80 via-[#1a3a6b]/10 to-transparent opacity-70 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 left-0 right-0 p-5 flex items-end justify-between z-10 translate-y-2 group-hover:translate-y-0 transition-transform">
                  <h3 className={\`text-white font-black leading-tight drop-shadow-md \${isLarge ? 'text-2xl' : 'text-lg'}\`}>{cat.name}</h3>
                  <div className="w-8 h-8 rounded-full bg-[#ff4757] text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform scale-50 group-hover:scale-100 shrink-0">
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

if (!content.includes('function CategoriasSection()')) {
  fs.writeFileSync('app/page.tsx', content + appendedCode);
}
