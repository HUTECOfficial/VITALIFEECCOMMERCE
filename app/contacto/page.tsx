"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Phone, Mail, MapPin, Clock, Send, CheckCircle2,
} from "lucide-react";
import FadeInWhenVisible from "@/components/animations/FadeInWhenVisible";
import Image from "next/image";
import { useSiteContent } from "@/hooks/useSiteContent";

const schema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  phone: z.string().min(10, "Ingresa un teléfono válido"),
  email: z.string().email("Ingresa un email válido"),
  subject: z.enum(
    ["cotizacion", "enfermeria", "otro"] as const,
    { error: "Selecciona un asunto" }
  ),
  message: z.string().min(10, "El mensaje debe tener al menos 10 caracteres"),
});

type FormData = z.infer<typeof schema>;

const contactCards = [
  {
    icon: Phone,
    title: "WhatsApp",
    value: "477 850 0011",
    href: "https://wa.me/524778500011",
    color: "from-[#25d366] to-[#128c7e]",
  },
  {
    icon: Phone,
    title: "WhatsApp",
    value: "479 228 4057",
    href: "https://wa.me/524792284057",
    color: "from-[#25d366] to-[#128c7e]",
  },
  {
    icon: Mail,
    title: "Correo electrónico",
    value: "serviciovitalife@outlook.com",
    href: "mailto:serviciovitalife@outlook.com",
    color: "from-[#1a3a6b] to-[#2251a3]",
  },
  {
    icon: MapPin,
    title: "Ubicación",
    value: "León, Guanajuato, México",
    href: "https://maps.google.com/?q=León,Guanajuato,México",
    color: "from-[#2eb8d4] to-[#1a8fa8]",
  },
  {
    icon: Clock,
    title: "Horario de atención",
    value: "Lun–Vie 8–20h / Sáb 9–18h",
    href: null,
    color: "from-[#f59e0b] to-[#d97706]",
  },
];

export default function ContactoPage() {
  const content = useSiteContent("contacto");
  const hero = content.hero;
  const form = content.form;
  const heroEyebrow = String(hero.eyebrow);
  const heroTitle = String(hero.title);
  const heroHighlightedTitle = String(hero.highlightedTitle);
  const heroDescription = String(hero.description);
  const heroImage = String(hero.image);
  const formTitle = String(form.title);
  const successMessage = String(form.successMessage);
  const namePlaceholder = String(form.namePlaceholder);
  const phonePlaceholder = String(form.phonePlaceholder);
  const emailPlaceholder = String(form.emailPlaceholder);
  const messagePlaceholder = String(form.messagePlaceholder);
  const submitLabel = String(form.submitLabel);
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    await new Promise((r) => setTimeout(r, 1200));
    console.log("Form data:", data);
    setSubmitted(true);
    reset();
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative pt-10 pb-16 hero-gradient">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[42vh]">
            {/* Left */}
            <FadeInWhenVisible>
              <span className="inline-block text-[#2eb8d4] text-xs font-bold uppercase tracking-widest border-b-2 border-[#2eb8d4] pb-0.5 mb-4">
                {heroEyebrow}
              </span>
              <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-4">
                <span className="text-[#1a1a2e]">{heroTitle}</span>
                <br />
                <span className="text-[#1a3a6b]">{heroHighlightedTitle}</span>
              </h1>
              <p className="text-gray-500 text-base leading-relaxed max-w-sm">
                {heroDescription}
              </p>
            </FadeInWhenVisible>
            {/* Right — glass orb with logo */}
            <motion.div
              className="flex justify-center lg:justify-end"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <motion.div
                className="relative w-64 h-64 sm:w-80 sm:h-80"
                animate={{ y: [0, -14, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="absolute inset-4 rounded-full bg-[#2eb8d4]/15 blur-2xl" />
                <div className="absolute inset-0 rounded-full liquid-glass flex items-center justify-center">
                  <Image
                    src={heroImage}
                    alt="Vital Life Servicios Integrales"
                    width={220}
                    height={220}
                    className="w-[180px] h-[180px] sm:w-[220px] sm:h-[220px] object-contain"
                    priority
                  />
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact cards */}
      <section className="py-16 bg-white/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-16">
            {contactCards.map((card, i) => (
              <FadeInWhenVisible key={card.title + i} delay={i * 0.1}>
                {card.href ? (
                  <a
                    href={card.href}
                    target={card.href.startsWith("http") ? "_blank" : undefined}
                    rel={card.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="white-card p-5 flex items-start gap-4 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group block"
                  >
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center shrink-0 shadow-md`}>
                      <card.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-gray-400 font-medium mb-0.5">{card.title}</p>
                      <p className="text-[#1a3a6b] font-bold text-sm group-hover:text-[#2eb8d4] transition-colors truncate">{card.value}</p>
                      <p className="text-gray-400 text-xs mt-0.5">
                        {card.title === "WhatsApp" ? "Respuesta inmediata" : card.title === "Correo electrónico" ? "Te respondemos pronto" : "León, Guanajuato · México"}
                      </p>
                    </div>
                  </a>
                ) : (
                  <div className="white-card p-5 flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center shrink-0 shadow-md`}>
                      <card.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-medium mb-0.5">{card.title}</p>
                      <p className="text-[#1a3a6b] font-bold text-sm">Lun–Vie: 8:00–20:00h</p>
                      <p className="text-[#1a3a6b] font-bold text-sm">Sáb: 9:00–18:00h</p>
                      <p className="text-[#2eb8d4] text-xs font-semibold mt-0.5">Emergencias 24/7 por WhatsApp</p>
                    </div>
                  </div>
                )}
              </FadeInWhenVisible>
            ))}
          </div>

          {/* Form + Map */}
          <div className="grid lg:grid-cols-2 gap-10">
            {/* Form */}
            <FadeInWhenVisible direction="left">
              <div className="white-card p-8">
                <h2 className="text-2xl font-bold text-[#1a3a6b] mb-6">
                  {formTitle}
                </h2>
                <AnimatePresence>
                  {submitted && (
                    <motion.div
                      className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 mb-6"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <CheckCircle2 className="w-5 h-5 shrink-0" />
                      <span className="text-sm font-medium">
                        {successMessage}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">
                      Nombre completo *
                    </label>
                    <input
                      id="name"
                      type="text"
                      {...register("name")}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 outline-none focus:ring-2 focus:ring-[#2eb8d4] focus:border-transparent transition"
                      placeholder={namePlaceholder}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                    )}
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="phone">
                        Teléfono *
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        {...register("phone")}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 outline-none focus:ring-2 focus:ring-[#2eb8d4] focus:border-transparent transition"
                        placeholder={phonePlaceholder}
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
                        Correo electrónico *
                      </label>
                      <input
                        id="email"
                        type="email"
                        {...register("email")}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 outline-none focus:ring-2 focus:ring-[#2eb8d4] focus:border-transparent transition"
                        placeholder={emailPlaceholder}
                      />
                      {errors.email && (
                        <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="subject">
                      Asunto *
                    </label>
                    <select
                      id="subject"
                      {...register("subject")}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 outline-none focus:ring-2 focus:ring-[#2eb8d4] focus:border-transparent transition"
                    >
                      <option value="">Selecciona un asunto</option>
                      <option value="cotizacion">Cotización de insumos</option>
                      <option value="enfermeria">Enfermería / Fisioterapia</option>
                      <option value="otro">Otro</option>
                    </select>
                    {errors.subject && (
                      <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="message">
                      Mensaje *
                    </label>
                    <textarea
                      id="message"
                      {...register("message")}
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 outline-none focus:ring-2 focus:ring-[#2eb8d4] focus:border-transparent transition resize-none"
                      placeholder={messagePlaceholder}
                    />
                    {errors.message && (
                      <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full inline-flex items-center justify-center gap-2 bg-[#1a3a6b] text-white py-3 rounded-full font-medium hover:bg-[#2eb8d4] transition-all hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg"
                  >
                    {isSubmitting ? (
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    {isSubmitting ? "Enviando..." : submitLabel}
                  </button>
                </form>
              </div>
            </FadeInWhenVisible>

            {/* Map */}
            <FadeInWhenVisible direction="right">
              <div className="white-card overflow-hidden h-full min-h-[400px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d119783.62890625!2d-101.74316249999999!3d21.12208!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x842bbf5b8ec0aa81%3A0x94f571aecad50f84!2sLe%C3%B3n%2C%20Guanajuato!5e0!3m2!1ses!2smx!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ minHeight: "400px", border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Ubicación Vital Life en León, Guanajuato"
                  aria-label="Mapa de León, Guanajuato"
                />
              </div>
            </FadeInWhenVisible>
          </div>
        </div>
      </section>
    </div>
  );
}
