import type { Metadata } from "next";
import {
  Heart, Users, Award, Shield, Target, Lightbulb, HandHeart,
} from "lucide-react";
import Image from "next/image";
import FadeInWhenVisible from "@/components/animations/FadeInWhenVisible";
import { getSiteContent } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Nosotros",
  description: "Conoce al equipo profesional de Vital Life Insumos Médicos en León, Guanajuato.",
};

const teamValues = [
  {
    icon: Heart,
    title: "Humanidad",
    desc: "Cada paciente merece atención digna, cálida y personalizada. Es nuestra razón de ser.",
  },
  {
    icon: Shield,
    title: "Confianza",
    desc: "Trabajamos con transparencia, ética y responsabilidad en cada servicio que ofrecemos.",
  },
  {
    icon: Award,
    title: "Excelencia",
    desc: "Buscamos la mejora continua en nuestros procesos para garantizar la mejor atención.",
  },
  {
    icon: Users,
    title: "Trabajo en Equipo",
    desc: "Un equipo multidisciplinario unido por el compromiso con la salud de nuestros pacientes.",
  },
  {
    icon: Target,
    title: "Compromiso",
    desc: "Nos comprometemos con cada persona desde el primer contacto hasta su completa recuperación.",
  },
  {
    icon: Lightbulb,
    title: "Innovación",
    desc: "Adoptamos nuevas tecnologías y métodos para ofrecer servicios médicos de vanguardia.",
  },
];

export default async function NosotrosPage() {
  const content = await getSiteContent("nosotros");

  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative pt-10 pb-20 hero-gradient">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <FadeInWhenVisible>
              <span className="text-[#2eb8d4] text-sm font-semibold uppercase tracking-widest">
                {String(content.hero.eyebrow)}
              </span>
              <h1 className="text-4xl sm:text-5xl font-bold text-[#1a3a6b] mt-3 mb-6">
                {String(content.hero.title)}
              </h1>
              <p className="text-gray-600 text-lg leading-relaxed">
                {String(content.hero.description)}
              </p>
            </FadeInWhenVisible>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-10">
            <FadeInWhenVisible direction="left">
              <div className="white-card p-8 h-full">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1a3a6b] to-[#2251a3] flex items-center justify-center mb-5 shadow-lg">
                  <Target className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-[#1a3a6b] mb-4">{String(content.mission.title)}</h2>
                <p className="text-gray-600 leading-relaxed">
                  {String(content.mission.description)}
                </p>
              </div>
            </FadeInWhenVisible>
            <FadeInWhenVisible direction="right">
              <div className="white-card p-8 h-full">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#2eb8d4] to-[#1a8fa8] flex items-center justify-center mb-5 shadow-lg">
                  <Lightbulb className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-[#1a3a6b] mb-4">{String(content.vision.title)}</h2>
                <p className="text-gray-600 leading-relaxed">
                  {String(content.vision.description)}
                </p>
              </div>
            </FadeInWhenVisible>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInWhenVisible>
            <div className="text-center mb-14">
              <span className="text-[#2eb8d4] text-sm font-semibold uppercase tracking-widest">
                Nuestros Valores
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#1a3a6b] mt-2">
                Lo que nos define
              </h2>
            </div>
          </FadeInWhenVisible>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamValues.map((val, i) => (
              <FadeInWhenVisible key={val.title} delay={i * 0.1}>
                <div className="white-card p-6 hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
                  <div className="w-12 h-12 rounded-full bg-[#1a3a6b] flex items-center justify-center mb-4">
                    <val.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-[#1a3a6b] text-lg mb-2">{val.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{val.desc}</p>
                </div>
              </FadeInWhenVisible>
            ))}
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="py-20 bg-gradient-to-br from-[#1a3a6b] to-[#1e4d8c] mx-4 sm:mx-8 my-4 rounded-3xl">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeInWhenVisible>
            <HandHeart className="w-12 h-12 text-[#2eb8d4] mx-auto mb-6" />
            <blockquote className="text-2xl sm:text-3xl font-medium text-white leading-relaxed mb-6">
              &ldquo;{String(content.quote.text)}&rdquo;
            </blockquote>
            <p className="text-white/60 text-sm">{String(content.quote.author)}</p>
          </FadeInWhenVisible>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInWhenVisible>
            <div className="text-center">
              <span className="text-[#2eb8d4] text-sm font-semibold uppercase tracking-widest">
                Certificaciones
              </span>
              <h2 className="text-2xl font-bold text-[#1a3a6b] mt-2 mb-8">
                Avalados por organismos reconocidos
              </h2>
              <div className="flex flex-wrap justify-center gap-4">
                <div className="inline-flex items-center gap-3 bg-[#e8f4fd] border border-[#2eb8d4]/30 rounded-2xl px-6 py-4">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-white flex items-center justify-center shrink-0">
                    <Image
                      src="/Logo-MarcaGTO-oct22.png"
                      alt="Marca GTO"
                      width={48}
                      height={48}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-[#1a3a6b] text-sm">Marca GTO</div>
                    <div className="text-gray-500 text-xs">Guanajuato, México</div>
                  </div>
                </div>
                <div className="inline-flex items-center gap-3 bg-[#e8f4fd] border border-[#2eb8d4]/30 rounded-2xl px-6 py-4">
                  <Shield className="w-8 h-8 text-[#1a3a6b]" />
                  <div className="text-left">
                    <div className="font-bold text-[#1a3a6b] text-sm">Calidad Certificada</div>
                    <div className="text-gray-500 text-xs">Insumos médicos</div>
                  </div>
                </div>
                <div className="inline-flex items-center gap-3 bg-[#e8f4fd] border border-[#2eb8d4]/30 rounded-2xl px-6 py-4">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-white flex items-center justify-center shrink-0">
                    <Image
                      src="/canacentralogo.png"
                      alt="Canacintra"
                      width={48}
                      height={48}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-[#1a3a6b] text-sm">CANACINTRA León</div>
                    <div className="text-gray-500 text-xs leading-tight">
                      Cámara Nacional de la Industria<br />de Transformación, Delegación León
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FadeInWhenVisible>
        </div>
      </section>
    </div>
  );
}
