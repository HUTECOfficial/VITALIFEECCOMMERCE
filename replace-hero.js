const fs = require('fs');

let content = fs.readFileSync('app/page.tsx', 'utf8');

// The marker function we want to replace
const START = 'function HeroSection() {';
const split1 = content.split(START);
if (split1.length < 2) {
  console.log('START not found');
  process.exit(1);
}

// And it ends before function StatsBar()
const END = '// ─────────────────────────────────────────────\n// STATS BAR';
const split2 = split1[1].split(END);
if (split2.length < 2) {
  console.log('END not found');
  process.exit(1);
}

const newHero = `function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Hero background image — full bleed to top */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/fondohp.png"
          alt="Insumos médicos Vital Life"
          fill
          priority
          className="object-cover object-[80%_center]"
          quality={95}
        />
        {/* Gradient overlay to ensure text readability *EVERYWHERE* */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-transparent sm:via-white/70 sm:to-white/10" />
        {/* Extra layer of blur behind the text container only */}
      </div>

      <FloatingBubbles count={3} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-[130px] pb-20 lg:pb-28 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* LEFT — Copy */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative"
          >
            {/* Pill badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="inline-flex items-center gap-2 px-4 py-2 mb-8 bg-white/70 backdrop-blur-md rounded-2xl shadow-[0_8px_30px_rgb(26,58,107,0.1)] border border-white"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff4757] animate-pulse" />
              <span className="text-[11px] font-black text-[#1a3a6b] tracking-widest uppercase">
                VENTA MUNDIAL · MAYOREO Y MENUDEO
              </span>
            </motion.div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-[#1a3a6b] leading-[1.06] mb-6 drop-shadow-sm">
              Cotiza y compra <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2eb8d4] to-[#1a3a6b]">al mejor precio</span>
            </h1>

            <p className="text-[#1a3a6b]/80 font-bold text-lg leading-relaxed mb-10 max-w-lg drop-shadow-sm">
              Cotiza al instante más de 20 marcas líderes. Envíos veloces a todo México, precios por volumen y atención certificada 24/7.
            </p>

            <div className="flex flex-wrap gap-4 relative z-20">
              <Link
                href="/contacto"
                className="bg-gradient-to-r from-[#ff4757] to-[#e84118] text-white px-8 py-4 rounded-2xl font-black hover:shadow-2xl hover:shadow-[#ff4757]/40 hover:-translate-y-1 transition-all duration-300 uppercase text-sm tracking-wide flex items-center gap-2"
              >
                Cotizar Rápido <ChevronRight className="w-5 h-5" />
              </Link>
              <Link
                href="/insumos"
                className="bg-white/80 backdrop-blur-md px-8 py-4 rounded-2xl text-[#1a3a6b] font-black border border-white hover:bg-white hover:shadow-xl hover:shadow-[#1a3a6b]/10 transition-all duration-300 flex items-center gap-2 uppercase tracking-wide text-sm"
              >
                <ShoppingBag className="w-5 h-5" /> Ver Catálogo
              </Link>
            </div>

            {/* Trust row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap items-center gap-6 mt-10 pt-8 border-t border-[#1a3a6b]/20"
            >
              {[
                { label: "+20 Marcas", sub: "distribuidas" },
                { label: "Mayoreo", sub: "disponible" },
                { label: "Envíos", sub: "a todo México" },
              ].map((item) => (
                <div key={item.label}>
                  <div className="font-black text-[#1a3a6b] text-lg leading-none">{item.label}</div>
                  <div className="text-[#1a3a6b]/70 text-xs font-bold mt-1">{item.sub}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* RIGHT — Just the clean logo orb */}
          <motion.div
            className="flex justify-center lg:justify-end relative"
            initial={{ opacity: 0, scale: 0.75 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.25, ease: "easeOut" }}
          >
            {/* Outer glow */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-80 h-80 rounded-full bg-white/40 blur-3xl animate-pulse-glow" />
            </div>

            <motion.div
              className="relative w-72 h-72 sm:w-[380px] sm:h-[380px]"
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              {/* Main liquid glass sphere - making it frostier for better contrast of the logo */}
              <div className="glass-card shadow-2xl shadow-[#1a3a6b]/20 w-full h-full rounded-full flex items-center justify-center relative overflow-hidden backdrop-blur-2xl bg-white/30 border border-white/60">
                <div className="relative z-20 flex items-center justify-center">
                  <Image
                    src="/vitalife-logo.png"
                    alt="Vital Life Servicios Integrales"
                    width={260}
                    height={260}
                    className="w-[200px] h-[200px] sm:w-[260px] sm:h-[260px] object-contain drop-shadow-2xl"
                    priority
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

`;

const finalContent = split1[0] + newHero + END + split2[1];

fs.writeFileSync('app/page.tsx', finalContent);
console.log('DONE');
