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
import { nursingServiceImageById } from "@/data/visualAssets";

export const metadata: Metadata = {
  title: "Enfermería y Fisioterapia",
  description:
    "Servicios de enfermería domiciliaria y fisioterapia en León, Guanajuato. Atención personalizada a domicilio.",
};

const services = [
  {
    icon: Stethoscope,
    title: "Atención domiciliaria",
    desc: "Enfermería general y especializada en la comodidad de tu hogar. Cuidados postoperatorios, aplicación de medicamentos y seguimiento de tratamientos.",
    image: nursingServiceImageById["atencion-domiciliaria"],
    color: "from-[#1a3a6b] to-[#2251a3]",
    href: "#proceso",
  },
  {
    icon: Dumbbell,
    title: "Rehabilitación física",
    desc: "Recuperación de lesiones musculoesqueléticas, cirugías ortopédicas y neurológicas. Planes de rehabilitación personalizados y progresivos.",
    image: nursingServiceImageById["rehabilitacion-fisica"],
    color: "from-[#2eb8d4] to-[#1a8fa8]",
    href: "#proceso",
  },
  {
    icon: Package,
    title: "Renta de equipo médico",
    desc: "Equipo médico en renta para apoyar la atención, recuperación y cuidado del paciente en casa, con asesoría para elegir la opción adecuada.",
    image: nursingServiceImageById["renta-equipo-medico"],
    color: "from-[#1a6b5a] to-[#2eb89a]",
    href: "#proceso",
  },
  {
    icon: FlaskConical,
    title: "Laboratorios",
    desc: "Toma de muestras a domicilio para análisis clínicos: biometría hemática, química sanguínea, perfil lipídico y más.",
    image: nursingServiceImageById.laboratorios,
    color: "from-[#1a3a6b] to-[#2eb8d4]",
    href: "#proceso",
  },
  {
    icon: Scan,
    title: "Radiografías",
    desc: "Estudios de imagen a domicilio para diagnóstico de fracturas, lesiones óseas y revisiones postoperatorias.",
    image: nursingServiceImageById.radiografias,
    color: "from-[#2eb8d4] to-[#1a8fa8]",
    href: "#proceso",
  },
  {
    icon: Bandage,
    title: "Curación de heridas",
    desc: "Manejo especializado de heridas crónicas, postoperatorias y úlceras con técnicas avanzadas de cicatrización.",
    image: nursingServiceImageById["curacion-heridas"],
    color: "from-[#1a6b5a] to-[#2eb89a]",
    href: "#proceso",
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

export default function EnfermeriaPage() {
  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative pt-10 pb-20 hero-gradient">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <FadeInWhenVisible>
                <span className="text-[#2eb8d4] text-sm font-semibold uppercase tracking-widest">
                  Enfermería y Fisioterapia
                </span>
                <h1 className="text-4xl sm:text-5xl font-bold text-[#1a3a6b] mt-2 mb-4">
                  Atención personalizada a domicilio
                </h1>
                <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                  Llevamos el cuidado profesional hasta tu hogar. Nuestro equipo
                  de enfermeros y fisioterapeutas certificados está listo para
                  apoyarte en tu recuperación.
                </p>
                <div className="flex flex-wrap gap-4">
                  <a
                    href="#servicios"
                    className="inline-flex items-center gap-2 bg-[#1a3a6b] text-white px-6 py-3 rounded-full font-medium hover:bg-[#2eb8d4] transition-all hover:scale-105"
                  >
                    <Activity className="w-4 h-4" />
                    Ver Servicios
                  </a>
                  <a
                    href="https://wa.me/5214777031953?text=Hola,%20necesito%20solicitar%20atención%20de%20enfermería%20o%20fisioterapia"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 border-2 border-[#1a3a6b] text-[#1a3a6b] px-6 py-3 rounded-full font-medium hover:bg-[#1a3a6b] hover:text-white transition-all"
                  >
                    <Phone className="w-4 h-4" />
                    Solicitar Atención
                  </a>
                </div>
              </FadeInWhenVisible>
            </div>

            <div className="hidden lg:flex justify-center">
              <div className="relative w-80 h-80 animate-float">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/60 via-[#e8f4fd]/80 to-[#2eb8d4]/20 backdrop-blur-sm border border-white/60 shadow-2xl flex items-center justify-center">
                  <div className="flex flex-col items-center">
                    <div className="relative h-44 w-60 overflow-hidden">
                      <Image
                        src="/vitalife-logo.png"
                        alt="Vital Life Servicios Integrales"
                        fill
                        sizes="240px"
                        className="scale-[2.35] object-contain"
                        priority
                      />
                    </div>
                    <p className="-mt-1 font-bold text-[#1a3a6b] text-xl">Enfermería</p>
                  </div>
                </div>
              </div>
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
                Nuestros Servicios
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#1a3a6b] mt-2">
                Atención completa para tu recuperación
              </h2>
            </div>
          </FadeInWhenVisible>
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((svc, i) => (
              <FadeInWhenVisible key={svc.title} delay={i * 0.15}>
                <div className="glass-card h-full overflow-hidden hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 flex flex-col group">
                  <div className="relative h-44 overflow-hidden">
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
                    <p className="text-gray-600 text-sm leading-relaxed flex-1">{svc.desc}</p>
                    <a
                      href={svc.href}
                      className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-[#2eb8d4] hover:text-[#1a3a6b] transition-colors group"
                    >
                      Conocer más
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </a>
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
              ¿Listo para comenzar tu recuperación?
            </h2>
            <p className="text-white/70 mb-8">
              Contáctanos hoy y uno de nuestros profesionales te orientará sin compromiso.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://wa.me/5214777031953"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#2eb8d4] text-white px-6 py-3 rounded-full font-medium hover:bg-white hover:text-[#1a3a6b] transition-all"
              >
                <Phone className="w-4 h-4" />
                Solicitar servicio
              </a>
              <Link
                href="/contacto"
                className="inline-flex items-center gap-2 border-2 border-white text-white px-6 py-3 rounded-full font-medium hover:bg-white hover:text-[#1a3a6b] transition-all"
              >
                Enviar mensaje <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </FadeInWhenVisible>
        </div>
      </section>
    </div>
  );
}
