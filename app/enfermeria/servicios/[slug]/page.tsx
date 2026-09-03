import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CalendarCheck, CheckCircle2, Phone, ShieldCheck } from "lucide-react";
import { getNursingService, nursingServices } from "@/data/nursingServices";
import { getSiteContent } from "@/lib/site-content";
import { notFound } from "next/navigation";

type ServicePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return nursingServices.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getNursingService(slug);
  if (!service) return {};
  const content = await getSiteContent("enfermeria");
  const section = content[service.section];
  return {
    title: `${String(section.title)} | Vital Life`,
    description: String(section.description),
  };
}

export default async function NursingServicePage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = getNursingService(slug);
  if (!service) notFound();

  const content = await getSiteContent("enfermeria");
  const section = content[service.section];
  const title = String(section.title);
  const description = String(section.description);
  const image = String(section.image);

  return (
    <main className="overflow-hidden bg-white">
      <section className="relative hero-gradient pb-20 pt-10 sm:pt-16">
        <div className="absolute -right-28 top-12 h-80 w-80 rounded-full bg-[#2eb8d4]/10 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/enfermeria#servicios"
            className="mb-10 inline-flex items-center gap-2 text-sm font-bold text-[#1a3a6b] transition-colors hover:text-[#2eb8d4]"
          >
            <ArrowLeft className="h-4 w-4" />
            Todos los servicios
          </Link>
          <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[#2eb8d4]">
                {service.eyebrow}
              </span>
              <h1 className="mt-3 text-4xl font-black leading-tight text-[#1a3a6b] sm:text-6xl">
                {title}
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-gray-600">{description}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="https://wa.me/5214777031953"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[#1a3a6b] px-6 py-3 font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-[#2eb8d4]"
                >
                  <CalendarCheck className="h-5 w-5" />
                  Solicitar este servicio
                </a>
                <Link
                  href="/contacto"
                  className="inline-flex items-center gap-2 rounded-full border-2 border-[#1a3a6b] px-6 py-3 font-bold text-[#1a3a6b] transition-colors hover:bg-[#1a3a6b] hover:text-white"
                >
                  Hablar con un asesor
                </Link>
              </div>
            </div>
            <div className="overflow-hidden rounded-[2rem] shadow-2xl shadow-[#1a3a6b]/15">
              <div className="relative aspect-[8/3] w-full">
                <Image
                  src={image}
                  alt={title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
          <div className="lg:col-span-2">
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[#2eb8d4]">Atención pensada para ti</span>
            <h2 className="mt-2 text-3xl font-black text-[#1a3a6b]">Cuidado cercano, claro y profesional</h2>
            <p className="mt-5 text-lg leading-relaxed text-gray-600">{service.summary}</p>
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {service.benefits.map((benefit) => (
                <div key={benefit} className="rounded-3xl bg-[#f2f9fd] p-5">
                  <CheckCircle2 className="h-6 w-6 text-[#2eb8d4]" />
                  <p className="mt-4 font-bold leading-snug text-[#1a3a6b]">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
          <aside className="rounded-[2rem] bg-[#1a3a6b] p-8 text-white">
            <ShieldCheck className="h-10 w-10 text-[#63d5e8]" />
            <h2 className="mt-5 text-2xl font-black">¿Para quién es ideal?</h2>
            <p className="mt-4 leading-relaxed text-white/75">{service.idealFor}</p>
            <a
              href="tel:+5214777031953"
              className="mt-8 inline-flex items-center gap-2 font-bold text-[#63d5e8] transition-colors hover:text-white"
            >
              <Phone className="h-4 w-4" />
              Resolver una duda
            </a>
          </aside>
        </div>
      </section>

      <section className="bg-[#f7fbfe] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[#2eb8d4]">Así te acompañamos</span>
            <h2 className="mt-2 text-3xl font-black text-[#1a3a6b]">Un proceso simple y personalizado</h2>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {service.steps.map((step, index) => (
              <div key={step} className="relative rounded-[2rem] bg-white p-7 shadow-sm">
                <span className="text-5xl font-black text-[#2eb8d4]/20">0{index + 1}</span>
                <h3 className="mt-3 text-xl font-black text-[#1a3a6b]">{step}</h3>
              </div>
            ))}
          </div>
          <div className="mt-12 flex flex-col items-center justify-between gap-6 rounded-[2rem] bg-gradient-to-r from-[#1a3a6b] to-[#2251a3] p-8 text-center text-white sm:flex-row sm:text-left">
            <div>
              <h2 className="text-2xl font-black">Tu bienestar puede empezar hoy</h2>
              <p className="mt-2 text-white/75">Cuéntanos qué necesitas y te orientaremos sin compromiso.</p>
            </div>
            <Link
              href="/contacto"
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-6 py-3 font-bold text-[#1a3a6b] transition-transform hover:scale-105"
            >
              Contactar ahora
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
