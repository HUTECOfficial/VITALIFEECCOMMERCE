import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Activity, Star, ChevronRight, Phone,
  Stethoscope, Package, ClipboardList,
  BookOpen, BarChart3, UserCheck, Dumbbell,
  FlaskConical, Scan, Bandage,
} from "lucide-react";
import FadeInWhenVisible from "@/components/animations/FadeInWhenVisible";
import { nursingServices } from "@/data/nursingServices";
import { getSiteContent } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Enfermería y Fisioterapia",
  description:
    "Servicios de enfermería domiciliaria y fisioterapia en León, Guanajuato. Atención personalizada a domicilio.",
};

const serviceVisuals = [
  {
    icon: Stethoscope,
    color: "from-[#1a3a6b] to-[#2251a3]",
  },
  {
    icon: Dumbbell,
    color: "from-[#2eb8d4] to-[#1a8fa8]",
  },
  {
    icon: Package,
    color: "from-[#1a6b5a] to-[#2eb89a]",
  },
  {
    icon: FlaskConical,
    color: "from-[#1a3a6b] to-[#2eb8d4]",
  },
  {
    icon: Scan,
    color: "from-[#2eb8d4] to-[#1a8fa8]",
  },
  {
    icon: Bandage,
    color: "from-[#1a6b5a] to-[#2eb89a]",
  },
];

const pillars = [
  { icon: ClipboardList, label: "Evaluación inicial" },
  { icon: BookOpen, label: "Terapias especializadas" },
  { icon: BarChart3, label: "Seguimiento continuo" },
  { icon: UserCheck, label: "Asistencia profesional" },
  { icon: Activity, label: "Recuperación funcional" },
];

const process = [
  { step: "01", title: "Valoración", desc: "Evaluamos el estado de salud y necesidades del paciente." },
  { step: "02", title: "Plan de cuidado", desc: "Diseñamos un plan personalizado de atención y rehabilitación." },
  { step: "03", title: "Seguimiento", desc: "Monitoreamos el progreso y ajustamos el tratamiento." },
  { step: "04", title: "Resultados", desc: "Logramos la recuperación y mejora de la calidad de vida." },
];

const testimonials = [
  {
    name: "María G.",
    content: "El servicio de fisioterapia a domicilio me permitió recuperarme de mi cirugía de rodilla sin salir de casa. ¡Excelente atención!",
    tag: "Más movilidad",
  },
  {
    name: "Roberto H.",
    content: "Las enfermeras de Vital Life son muy profesionales y amables. Me ayudaron en mi recuperación postoperatoria con mucha dedicación.",
    tag: "Más comodidad",
  },
  {
    name: "Lucía M.",
    content: "Gracias al equipo de Vital Life, mi mamá recibe atención domiciliaria de calidad. Nos da mucha tranquilidad y confianza.",
    tag: "Más confianza",
  },
];

export default async function EnfermeriaPage() {
  const content = await getSiteContent("enfermeria");
  const serviceContent = [
    content.service1,
    content.service2,
    content.service3,
    content.service4,
    content.service5,
    content.service6,
  ];
  const services = serviceVisuals
    .map((visual, index) => ({
      ...visual,
      enabled: Boolean(serviceContent[index].enabled),
      title: String(serviceContent[index].title),
      description: String(serviceContent[index].description),
      image: String(serviceContent[index].image),
      link: `/enfermeria/servicios/${nursingServices[index].slug}`,
    }))
    .filter((service) => service.enabled);

  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative pt-10 pb-20 hero-gradient">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <FadeInWhenVisible>
                <span className="text-[#2eb8d4] text-sm font-semibold uppercase tracking-widest">
                  {String(content.hero.eyebrow)}
                </span>
                <h1 className="text-4xl sm:text-5xl font-bold text-[#1a3a6b] mt-2 mb-4">
                  {String(content.hero.title)}
                </h1>
                <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                  {String(content.hero.description)}
                </p>
                <div className="flex flex-wrap gap-4">
                  <a
                    href={String(content.hero.primaryButtonLink)}
                    className="inline-flex items-center gap-2 bg-[#1a3a6b] text-white px-6 py-3 rounded-full font-medium hover:bg-[#2eb8d4] transition-all hover:scale-105"
                  >
                    <Activity className="w-4 h-4" />
                    {String(content.hero.primaryButtonLabel)}
                  </a>
                  <a
                    href={String(content.hero.secondaryButtonLink)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 border-2 border-[#1a3a6b] text-[#1a3a6b] px-6 py-3 rounded-full font-medium hover:bg-[#1a3a6b] hover:text-white transition-all"
                  >
                    <Phone className="w-4 h-4" />
                    {String(content.hero.secondaryButtonLabel)}
                  </a>
                </div>
              </FadeInWhenVisible>
            </div>

            <div className="hidden lg:flex justify-center">
              <Image
                src={String(content.hero.image)}
                alt="Vital Life Servicios Integrales"
                width={307}
                height={313}
                sizes="307px"
                className="h-auto w-[307px] animate-float object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3 Main Services */}
      <section id="servicios" className="py-20 bg-white/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInWhenVisible>
            <div className="text-center mb-14">
              <span className="text-[#2eb8d4] text-sm font-semibold uppercase tracking-widest">
                {String(content.servicesHeader.eyebrow)}
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#1a3a6b] mt-2">
                {String(content.servicesHeader.title)}
              </h2>
            </div>
          </FadeInWhenVisible>
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((svc, i) => (
              <FadeInWhenVisible key={svc.title} delay={i * 0.15}>
                <div className="group flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-[0_12px_38px_rgba(26,58,107,0.12)] transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                  <div className="relative aspect-[8/3] w-full overflow-hidden">
                    <Image
                      src={svc.image}
                      alt={`Servicio de ${svc.title}`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${svc.color} opacity-35`} />
                    <div className={`absolute bottom-4 left-5 w-14 h-14 rounded-2xl bg-gradient-to-br ${svc.color} flex items-center justify-center border border-white/30 shadow-lg`}>
                      <svc.icon className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  <div className="p-8 flex flex-col flex-1">
                    <h3 className="font-bold text-[#1a3a6b] text-xl mb-3">{svc.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed flex-1">{svc.description}</p>
                    <Link
                      href={svc.link}
                      className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-[#2eb8d4] hover:text-[#1a3a6b] transition-colors group"
                    >
                      Conocer más
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              </FadeInWhenVisible>
            ))}
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInWhenVisible>
            <h2 className="text-2xl font-bold text-[#1a3a6b] text-center mb-10">
              Nuestro enfoque en 5 pilares
            </h2>
          </FadeInWhenVisible>
          <div className="flex flex-wrap justify-center gap-4">
            {pillars.map((p, i) => (
              <FadeInWhenVisible key={p.label} delay={i * 0.1}>
                <div className="flex items-center gap-3 glass-card px-5 py-3 rounded-full">
                  <div className="w-8 h-8 rounded-full bg-[#e8f4fd] flex items-center justify-center">
                    <p.icon className="w-4 h-4 text-[#1a3a6b]" />
                  </div>
                  <span className="font-medium text-[#1a3a6b] text-sm">{p.label}</span>
                </div>
              </FadeInWhenVisible>
            ))}
          </div>
        </div>
      </section>

      {/* Process Timeline */}
      <section id="proceso" className="py-20 bg-white/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInWhenVisible>
            <div className="text-center mb-14">
              <span className="text-[#2eb8d4] text-sm font-semibold uppercase tracking-widest">
                Proceso
              </span>
              <h2 className="text-3xl font-bold text-[#1a3a6b] mt-2">
                ¿Cómo funciona nuestra atención?
              </h2>
            </div>
          </FadeInWhenVisible>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {/* Connector line (desktop) */}
            <div className="absolute top-10 left-[12.5%] right-[12.5%] h-0.5 bg-[#2eb8d4]/30 hidden lg:block" />
            {process.map((step, i) => (
              <FadeInWhenVisible key={step.step} delay={i * 0.15}>
                <div className="text-center relative">
                  <div className="w-20 h-20 rounded-full bg-[#1a3a6b] text-white text-xl font-bold flex items-center justify-center mx-auto mb-4 shadow-lg relative z-10">
                    {step.step}
                  </div>
                  <h3 className="font-bold text-[#1a3a6b] text-lg mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-sm">{step.desc}</p>
                </div>
              </FadeInWhenVisible>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 hero-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInWhenVisible>
            <div className="text-center mb-14">
              <span className="text-[#2eb8d4] text-sm font-semibold uppercase tracking-widest">
                Testimonios
              </span>
              <h2 className="text-3xl font-bold text-[#1a3a6b] mt-2">
                Lo que dicen nuestros pacientes
              </h2>
            </div>
          </FadeInWhenVisible>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <FadeInWhenVisible key={t.name} delay={i * 0.15}>
                <div className="glass-card p-6 h-full flex flex-col">
                  <div className="flex gap-0.5 mb-3">
                    {Array.from({ length: 5 }).map((_, si) => (
                      <Star key={si} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed flex-1 mb-4">
                    &ldquo;{t.content}&rdquo;
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#1a3a6b] text-sm">{t.name}</span>
                    <span className="text-xs bg-[#e8f4fd] text-[#2eb8d4] font-semibold px-2.5 py-1 rounded-full">
                      {t.tag}
                    </span>
                  </div>
                </div>
              </FadeInWhenVisible>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-br from-[#1a3a6b] to-[#1e4d8c] mx-4 sm:mx-8 my-4 rounded-3xl">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <FadeInWhenVisible>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              {String(content.finalCta.title)}
            </h2>
            <p className="text-white/70 mb-8">
              {String(content.finalCta.description)}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href={String(content.finalCta.primaryButtonLink)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#2eb8d4] text-white px-6 py-3 rounded-full font-medium hover:bg-white hover:text-[#1a3a6b] transition-all"
              >
                <Phone className="w-4 h-4" />
                {String(content.finalCta.primaryButtonLabel)}
              </a>
              <Link
                href={String(content.finalCta.secondaryButtonLink)}
                className="inline-flex items-center gap-2 border-2 border-white text-white px-6 py-3 rounded-full font-medium hover:bg-white hover:text-[#1a3a6b] transition-all"
              >
                {String(content.finalCta.secondaryButtonLabel)} <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </FadeInWhenVisible>
        </div>
      </section>
    </div>
  );
}
