const fs = require('fs');
let content = fs.readFileSync('app/page.tsx', 'utf8');

const oldHero = `            {/* Pill badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-[#2eb8d4] animate-pulse-glow" />
              <span className="text-xs font-bold text-[#1a3a6b] tracking-widest uppercase">
                Vital Life · Insumos Médicos · León, Gto.
              </span>
            </motion.div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-[#1a3a6b] leading-[1.06] mb-6">
              Salud de{" "}
              <br className="hidden sm:block" />
              <span className="shimmer-text">calidad superior</span>
              <br />
              a tu alcance
            </h1>

            <p className="text-[#1a3a6b]/65 text-lg leading-relaxed mb-10 max-w-lg">
              Distribuidores autorizados de insumos médicos certificados. Residencia para adultos
              mayores y enfermería domiciliaria en León, Guanajuato.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/insumos"
                className="bg-gradient-to-r from-[#1a3a6b] to-[#2251a3] text-white px-8 py-4 rounded-2xl font-bold hover:shadow-xl hover:shadow-[#1a3a6b]/20 hover:-translate-y-1 transition-all duration-300"
              >
                Catálogo de insumos
              </Link>
              <Link
                href="/contacto"
                className="glass-card px-8 py-4 rounded-2xl text-[#1a3a6b] font-bold border-2 border-transparent hover:border-white transition-all duration-300 flex items-center gap-2"
              >
                Contactar <ChevronRight className="w-4 h-4" />
              </Link>
            </div>`;

const newHero = `            {/* Pill badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-8 bg-white/70 shadow-lg border border-white"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff4757] animate-pulse" />
              <span className="text-[11px] font-black text-[#1a3a6b] tracking-widest uppercase">
                VENTA DE MATERIAL MÉDICO MAYOREO Y MENUDEO
              </span>
            </motion.div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-[#1a3a6b] leading-[1.06] mb-6">
              Cotiza y compra{" "}
              <br className="hidden sm:block" />
              <span className="shimmer-text">al mejor precio</span>
            </h1>

            <p className="text-[#1a3a6b]/80 font-bold text-lg leading-relaxed mb-10 max-w-lg">
              Cotiza al instante más de 20 marcas líderes. Envíos veloces a todo México, precios por volumen y atención certificada las 24 horas.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/contacto"
                className="bg-gradient-to-r from-[#ff4757] to-[#e84118] text-white px-8 py-4 rounded-2xl font-black hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 shadow-[#ff4757]/30 uppercase text-sm tracking-wide flex items-center gap-2"
              >
                 Cotizar Rápido <ChevronRight className="w-5 h-5" />
              </Link>
              <Link
                href="/insumos"
                className="bg-white/80 backdrop-blur-md px-8 py-4 rounded-2xl text-[#1a3a6b] font-black border border-white hover:bg-white hover:shadow-lg transition-all duration-300 flex items-center gap-2 uppercase tracking-wide text-sm"
              >
                <ShoppingBag className="w-5 h-5" /> Ver Catálogo
              </Link>
            </div>`;

content = content.replace(oldHero, newHero);
fs.writeFileSync('app/page.tsx', content);
