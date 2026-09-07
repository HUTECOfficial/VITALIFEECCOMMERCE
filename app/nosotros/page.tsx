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
      <section className="relative flex min-h-[650px] items-center overflow-hidden">
        <Image
          src={String(content.hero.image)}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[68%_center] sm:object-center"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,22,48,0.98)_0%,rgba(5,35,68,0.92)_38%,rgba(7,48,83,0.58)_62%,rgba(7,48,83,0.12)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#f5fbfd] to-transparent" />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="max-w-3xl">
            <FadeInWhenVisible>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[#7be3ee] shadow-lg backdrop-blur-md">
                <Heart className="h-4 w-4" />
                {String(content.hero.eyebrow)}
              </span>
              <h1 className="mt-6 max-w-2xl text-4xl font-black leading-[1.05] text-white sm:text-5xl lg:text-7xl">
                {String(content.hero.title)}
              </h1>
              <p className="mt-7 max-w-2xl text-base leading-relaxed text-white/75 sm:text-xl">
                {String(content.hero.description)}
              </p>
              <div className="mt-9 grid max-w-2xl gap-3 sm:grid-cols-3">
                {[
                  { icon: Shield, label: "Insumos certificados" },
                  { icon: Heart, label: "Cuidado humano" },
                  { icon: Users, label: "Equipo profesional" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-semibold text-white backdrop-blur-md">
                    <item.icon className="h-5 w-5 shrink-0 text-[#69deeb]" />
                    {item.label}
                  </div>
                ))}
              </div>
            </FadeInWhenVisible>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="relative bg-[#f5fbfd] pb-24 pt-8 sm:pb-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeInWhenVisible>
            <div className="mb-10 grid items-end gap-6 lg:grid-cols-[0.8fr_1.2fr]">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#20a9c2]">Nuestro propósito</span>
                <h2 className="mt-3 text-3xl font-black leading-tight text-[#123664] sm:text-4xl">
                  Salud, confianza y acompañamiento en un mismo lugar.
                </h2>
              </div>
              <p className="max-w-2xl text-base leading-relaxed text-slate-600 lg:justify-self-end lg:text-lg">
                Integramos productos médicos confiables con atención profesional para acompañar a pacientes, familias y especialistas en cada etapa del cuidado.
              </p>
            </div>
          </FadeInWhenVisible>
          <div className="grid gap-6 lg:grid-cols-2">
            <FadeInWhenVisible direction="left">
              <div className="group relative h-full min-h-[330px] overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#102f5b] via-[#174878] to-[#177f9d] p-8 shadow-2xl shadow-[#123664]/15 sm:p-10">
                <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#35c5d7]/20 blur-2xl transition-transform duration-700 group-hover:scale-125" />
                <div className="absolute bottom-0 right-5 text-[9rem] font-black leading-none text-white/[0.05]">01</div>
                <div className="relative z-10 flex h-full flex-col">
                  <div className="flex items-center justify-between">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 shadow-lg backdrop-blur-sm">
                      <Target className="h-8 w-8 text-[#71e0ea]" />
                    </div>
                    <span className="rounded-full border border-white/15 px-4 py-2 text-xs font-bold uppercase tracking-widest text-white/65">Lo que hacemos</span>
                  </div>
                  <div className="mt-auto pt-12">
                    <h3 className="text-3xl font-black text-white">{String(content.mission.title)}</h3>
                    <p className="mt-4 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">
                      {String(content.mission.description)}
                    </p>
                  </div>
                </div>
              </div>
            </FadeInWhenVisible>
            <FadeInWhenVisible direction="right">
              <div className="group relative h-full min-h-[330px] overflow-hidden rounded-[2rem] border border-[#2eb8d4]/20 bg-white p-8 shadow-2xl shadow-[#2eb8d4]/10 sm:p-10">
                <div className="absolute -bottom-20 -right-16 h-72 w-72 rounded-full bg-[#72e5ef]/20 blur-2xl transition-transform duration-700 group-hover:scale-125" />
                <div className="absolute bottom-0 right-5 text-[9rem] font-black leading-none text-[#123664]/[0.04]">02</div>
                <div className="relative z-10 flex h-full flex-col">
                  <div className="flex items-center justify-between">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2eb8d4] to-[#1687a5] shadow-lg shadow-[#2eb8d4]/25">
                      <Lightbulb className="h-8 w-8 text-white" />
                    </div>
                    <span className="rounded-full bg-[#e8f8fb] px-4 py-2 text-xs font-bold uppercase tracking-widest text-[#1687a5]">Hacia dónde vamos</span>
                  </div>
                  <div className="mt-auto pt-12">
                    <h3 className="text-3xl font-black text-[#123664]">{String(content.vision.title)}</h3>
                    <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
                      {String(content.vision.description)}
                    </p>
                  </div>
                </div>
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
