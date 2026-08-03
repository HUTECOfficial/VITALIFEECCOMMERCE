"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { MapPin, Phone, Mail } from "lucide-react";

const nursingWhatsApp = {
  href: "https://wa.me/5214777031953",
  label: "+52 1 477 703 1953",
};

const footerLinks = {
  enlaces: [
    { label: "Inicio", href: "/" },
    { label: "Nosotros", href: "/nosotros" },
    { label: "Servicios", href: "/insumos" },
    { label: "Contacto", href: "/contacto" },
  ],
  servicios: [
    { label: "Insumos", href: "/insumos" },
    { label: "Enfermería - Fisioterapia", href: "/enfermeria" },
  ],
};

export default function Footer() {
  const isNursingPage = usePathname() === "/enfermeria";
  const whatsappHref = isNursingPage
    ? nursingWhatsApp.href
    : "https://wa.me/524771736105";

  return (
    <footer className="bg-white border-t border-gray-100">
      {/* Contact strip */}
      <div className="bg-[#f5fafd] border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 group"
            >
              <div className="w-11 h-11 rounded-2xl bg-[#e8f4fd] flex items-center justify-center shrink-0 group-hover:bg-[#d6eaf8] transition-colors">
                <Phone className="w-5 h-5 text-[#1a3a6b]" />
              </div>
              <div>
                <div className="text-xs text-gray-500 font-medium">WhatsApp</div>
                {isNursingPage ? (
                  <div className="text-[#1a3a6b] font-bold text-sm group-hover:text-[#2eb8d4] transition-colors">
                    {nursingWhatsApp.label}
                  </div>
                ) : (
                  <>
                    <div className="text-[#1a3a6b] font-bold text-sm group-hover:text-[#2eb8d4] transition-colors">
                      477 173 6105
                    </div>
                    <div className="text-[#1a3a6b] font-bold text-sm group-hover:text-[#2eb8d4] transition-colors">
                      479 228 4057
                    </div>
                  </>
                )}
                <div className="text-xs text-gray-400">Respuesta inmediata</div>
              </div>
            </a>

            <a
              href="mailto:serviciovitalife@outlook.com"
              className="flex items-center gap-3 group"
            >
              <div className="w-11 h-11 rounded-2xl bg-[#e8f4fd] flex items-center justify-center shrink-0 group-hover:bg-[#d6eaf8] transition-colors">
                <Mail className="w-5 h-5 text-[#1a3a6b]" />
              </div>
              <div>
                <div className="text-xs text-gray-500 font-medium">Email</div>
                <div className="text-[#1a3a6b] font-bold text-sm group-hover:text-[#2eb8d4] transition-colors">
                  serviciovitalife@outlook.com
                </div>
                <div className="text-xs text-gray-400">Te respondemos pronto</div>
              </div>
            </a>

            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#e8f4fd] flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-[#1a3a6b]" />
              </div>
              <div>
                <div className="text-xs text-gray-500 font-medium">Ubicación</div>
                <div className="text-[#1a3a6b] font-bold text-sm">León, Guanajuato</div>
                <div className="text-xs text-gray-400">Atención personalizada</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="mb-4">
              <Image
                src="/vitalife-logo.png"
                alt="Vital Life Servicios Integrales"
                width={140}
                height={70}
                className="h-[60px] w-auto object-contain"
              />
            </div>
            <p className="text-gray-500 text-sm leading-relaxed mb-5">
              Comprometidos en ofrecer un servicio humano, digno y eficaz para el cuidado integral de tu salud y bienestar.
            </p>
            {/* Social icons */}
            <div className="flex gap-2.5">
              <a
                href="https://www.facebook.com/vitallifeenfermeria/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full bg-[#e8f4fd] border border-[#d6eaf8] flex items-center justify-center hover:bg-[#1a3a6b] group transition-colors"
              >
                <svg className="w-4 h-4 text-[#1a3a6b] group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a
                href="https://www.instagram.com/vital_life_insumosmedicos/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full bg-[#e8f4fd] border border-[#d6eaf8] flex items-center justify-center hover:bg-[#1a3a6b] group transition-colors"
              >
                <svg className="w-4 h-4 text-[#1a3a6b] group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                </svg>
              </a>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="w-9 h-9 rounded-full bg-[#e8f4fd] border border-[#d6eaf8] flex items-center justify-center hover:bg-[#25d366] group transition-colors"
              >
                <Phone className="w-4 h-4 text-[#1a3a6b] group-hover:text-white transition-colors" />
              </a>
            </div>
          </div>

          {/* Enlaces */}
          <div>
            <h3 className="font-semibold text-[#1a3a6b] mb-4 text-sm">
              Enlaces
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.enlaces.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-500 hover:text-[#2eb8d4] text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Servicios */}
          <div>
            <h3 className="font-semibold text-[#1a3a6b] mb-4 text-sm">
              Servicios
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.servicios.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-500 hover:text-[#2eb8d4] text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Certificaciones */}
          <div>
            <h3 className="font-semibold text-[#2eb8d4] mb-4 text-sm">
              Certificaciones
            </h3>
            <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#f5fafd] border border-[#e8f4fd]">
              <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-white flex items-center justify-center">
                <Image
                  src="/Logo-MarcaGTO-oct22.png"
                  alt="Marca GTO"
                  width={56}
                  height={56}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <div className="font-semibold text-[#1a3a6b] text-sm">Marca GTO</div>
                <div className="text-[#2eb8d4] text-xs font-medium">Guanajuato</div>
                <div className="text-gray-500 text-xs mt-1 leading-relaxed">
                  Comprometidos con la calidad y el bienestar de nuestra comunidad.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-gray-400 text-xs">
            © 2024 Vital Life Insumos Médicos. Todos los derechos reservados.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-gray-400 hover:text-[#2eb8d4] text-xs transition-colors">
              Aviso de Privacidad
            </a>
            <a href="#" className="text-gray-400 hover:text-[#2eb8d4] text-xs transition-colors">
              Términos y Condiciones
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
