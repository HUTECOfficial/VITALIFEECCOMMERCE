import { nursingServices } from "@/data/nursingServices";
import { homeHeroImage, nursingServiceImageById } from "@/data/visualAssets";

export const siteContentPages = ["homepage", "insumos", "nosotros", "enfermeria", "contacto"] as const;

export type SiteContentPage = (typeof siteContentPages)[number];
export type SiteContentFieldType = "text" | "textarea" | "url" | "image" | "boolean" | "number";
export type SiteContentValue = string | boolean | number;
export type SiteContentSection = Record<string, SiteContentValue>;
export type SitePageContent = Record<string, SiteContentSection>;
export type AllSiteContent = Record<SiteContentPage, SitePageContent>;

export type SiteContentFieldDefinition = {
  label: string;
  type: SiteContentFieldType;
  defaultValue: SiteContentValue;
  maxLength?: number;
  min?: number;
  max?: number;
};

export type SiteContentSectionDefinition = {
  label: string;
  fields: Record<string, SiteContentFieldDefinition>;
};

export type SiteContentPageDefinition = {
  label: string;
  sections: Record<string, SiteContentSectionDefinition>;
};

const text = (label: string, defaultValue: string, maxLength = 180): SiteContentFieldDefinition => ({ label, type: "text", defaultValue, maxLength });
const textarea = (label: string, defaultValue: string, maxLength = 2000): SiteContentFieldDefinition => ({ label, type: "textarea", defaultValue, maxLength });
const url = (label: string, defaultValue: string): SiteContentFieldDefinition => ({ label, type: "url", defaultValue, maxLength: 2048 });
const image = (label: string, defaultValue: string): SiteContentFieldDefinition => ({ label, type: "image", defaultValue, maxLength: 2048 });
const boolean = (label: string, defaultValue = true): SiteContentFieldDefinition => ({ label, type: "boolean", defaultValue });
const number = (label: string, defaultValue: number, min = 0, max = 1_000_000): SiteContentFieldDefinition => ({ label, type: "number", defaultValue, min, max });

const promotion = (label: string, values: { title: string; subtitle: string; oldPrice: number; newPrice: number; badge: string; link: string; image: string }): SiteContentSectionDefinition => ({
  label,
  fields: {
    enabled: boolean("Mostrar promoción"),
    title: text("Título", values.title),
    subtitle: text("Subtítulo", values.subtitle),
    oldPrice: number("Precio anterior", values.oldPrice),
    newPrice: number("Precio promocional", values.newPrice),
    badge: text("Insignia", values.badge, 40),
    link: url("Enlace", values.link),
    image: image("Imagen", values.image),
  },
});

const service = (label: string, values: { title: string; description: string; image: string; link: string }): SiteContentSectionDefinition => ({
  label,
  fields: {
    enabled: boolean("Mostrar servicio"),
    title: text("Título", values.title),
    description: textarea("Descripción", values.description),
    image: image("Imagen", values.image),
    link: url("Enlace", values.link),
  },
});

export const siteContentDefinitions: Record<SiteContentPage, SiteContentPageDefinition> = {
  homepage: {
    label: "Inicio",
    sections: {
      hero: {
        label: "Hero",
        fields: {
          eyebrow: text("Etiqueta", "VENTA MUNDIAL · MAYOREO Y MENUDEO"),
          title: text("Título", "Cotiza y compra"),
          highlightedTitle: text("Título destacado", "al mejor precio"),
          description: textarea("Descripción", "Cotiza al instante más de 20 marcas líderes. Envíos veloces a todo México, precios por volumen y atención certificada 24/7."),
          image: image("Imagen", homeHeroImage),
          primaryButtonLabel: text("Botón principal", "Comprar ahora", 80),
          primaryButtonLink: url("Enlace principal", "/insumos"),
          secondaryButtonLabel: text("Botón secundario", "Ver Catálogo", 80),
          secondaryButtonLink: url("Enlace secundario", "/insumos"),
          contactButtonLabel: text("Botón de contacto", "Escríbenos", 80),
          contactButtonLink: url("Enlace de contacto", "/contacto"),
        },
      },
      featuredPromotion: {
        label: "Promoción destacada",
        fields: {
          enabled: boolean("Mostrar promoción"),
          eyebrow: text("Etiqueta", "Oferta destacada"),
          title: text("Título", "Protección profesional,"),
          highlightedTitle: text("Título destacado", "precio especial."),
          description: textarea("Descripción", "Guantes de nitrilo Ambiderm para cuidar cada procedimiento. Aprovecha el descuento por tiempo limitado."),
          buttonLabel: text("Texto del botón", "Comprar oferta", 80),
          link: url("Enlace", "/productos/guantes-nitrilo-100pcs"),
          image: image("Imagen", "https://qczoqkhgphlhomcscnsk.supabase.co/storage/v1/object/public/VITALIFE/guante-de-nitrilo_ambiderm.png"),
          badge: text("Insignia", "-23%", 40),
        },
      },
      promotion1: promotion("Promoción 1", {
        title: "Guantes de Nitrilo",
        subtitle: "Caja 100 pzs",
        oldPrice: 245,
        newPrice: 189,
        badge: "-23%",
        link: "/productos/guantes-nitrilo-100pcs",
        image: "https://qczoqkhgphlhomcscnsk.supabase.co/storage/v1/object/public/VITALIFE/guante-de-nitrilo_ambiderm.png",
      }),
      promotion2: promotion("Promoción 2", {
        title: "Gel Antibacterial",
        subtitle: "500ml",
        oldPrice: 120,
        newPrice: 85,
        badge: "-29%",
        link: "/productos/gel-antibacterial",
        image: "https://qczoqkhgphlhomcscnsk.supabase.co/storage/v1/object/public/VITALIFE/catalog/gel-antibacterial.webp",
      }),
      promotion3: promotion("Promoción 3", {
        title: "Jeringas 5ml",
        subtitle: "Paquete 10 pzs",
        oldPrice: 89,
        newPrice: 65,
        badge: "-27%",
        link: "/productos/jeringas-5ml-10pcs",
        image: "https://qczoqkhgphlhomcscnsk.supabase.co/storage/v1/object/public/VITALIFE/jeringas_sensimedical.png",
      }),
      featuredProductsHeader: {
        label: "Encabezado de productos destacados",
        fields: {
          eyebrow: text("Etiqueta", "Más Vendidos"),
          title: text("Título", "Productos"),
          highlightedTitle: text("Título destacado", "Destacados"),
          linkLabel: text("Texto del enlace", "Ver catálogo completo", 80),
          link: url("Enlace", "/insumos"),
        },
      },
    },
  },
  insumos: {
    label: "Insumos",
    sections: {
      hero: {
        label: "Hero",
        fields: {
          eyebrow: text("Etiqueta", "catálogo de"),
          title: text("Título", "Insumos Médicos"),
          description: textarea("Descripción", "Distribuidores autorizados de las mejores marcas médicas en México. Todos los productos disponibles para compra directa con carrito."),
          searchPlaceholder: text("Texto del buscador", "Buscar marca, producto o categoría..."),
        },
      },
      quickShop: {
        label: "Compra rápida",
        fields: {
          enabled: boolean("Mostrar sección"),
          eyebrow: text("Etiqueta", "Compra rápida"),
          title: text("Título", "Agrega al carrito en un clic"),
          description: textarea("Descripción", "Experiencia optimizada para móvil y desktop."),
          cartButtonLabel: text("Texto del botón", "Ver carrito", 80),
          productLimit: number("Cantidad de productos", 12, 1, 24),
        },
      },
    },
  },
  nosotros: {
    label: "Nosotros",
    sections: {
      hero: {
        label: "Hero",
        fields: {
          eyebrow: text("Etiqueta", "Sobre Nosotros"),
          title: text("Título", "Somos un equipo profesional comprometido con tu salud"),
          description: textarea("Descripción", "En Vital Life, somos más que una empresa de insumos médicos. Somos un grupo de profesionales apasionados por el cuidado humano, con sede en León, Guanajuato."),
        },
      },
      mission: {
        label: "Misión",
        fields: {
          title: text("Título", "Nuestra Misión"),
          description: textarea("Descripción", "Ofrecer un servicio humano, digno y eficaz para el cuidado integral de la salud, mediante la comercialización de insumos médicos certificados y servicios de enfermería y fisioterapia a domicilio."),
        },
      },
      vision: {
        label: "Visión",
        fields: {
          title: text("Título", "Nuestra Visión"),
          description: textarea("Descripción", "Ser la empresa líder en servicios integrales de salud en Guanajuato, reconocida por la calidad humana de nuestro equipo, la excelencia en nuestros productos y la calidez de nuestros espacios de atención."),
        },
      },
      quote: {
        label: "Cita",
        fields: {
          text: textarea("Cita", "No solo ofrecemos servicios de salud, acompañamos cada historia de vida con dignidad, amor y profesionalismo."),
          author: text("Autor", "— Equipo Vital Life"),
        },
      },
    },
  },
  enfermeria: {
    label: "Enfermería",
    sections: {
      hero: {
        label: "Hero",
        fields: {
          eyebrow: text("Etiqueta", "Enfermería y Fisioterapia"),
          title: text("Título", "Atención personalizada a domicilio"),
          description: textarea("Descripción", "Llevamos el cuidado profesional hasta tu hogar. Nuestro equipo de enfermeros y fisioterapeutas certificados está listo para apoyarte en tu recuperación."),
          primaryButtonLabel: text("Botón principal", "Ver Servicios", 80),
          primaryButtonLink: url("Enlace principal", "#servicios"),
          secondaryButtonLabel: text("Botón secundario", "Solicitar Atención", 80),
          secondaryButtonLink: url("Enlace secundario", "https://wa.me/5214777031953?text=Hola,%20necesito%20solicitar%20atención%20de%20enfermería%20o%20fisioterapia"),
          image: image("Imagen", "/vitalife-logo-cropped.png"),
        },
      },
      servicesHeader: {
        label: "Encabezado de servicios",
        fields: {
          eyebrow: text("Etiqueta", "Nuestros Servicios"),
          title: text("Título", "Atención completa para tu recuperación"),
        },
      },
      service1: service("Servicio 1", {
        title: "Atención domiciliaria",
        description: "Enfermería general y especializada en la comodidad de tu hogar. Cuidados postoperatorios, aplicación de medicamentos y seguimiento de tratamientos.",
        image: nursingServiceImageById["atencion-domiciliaria"],
        link: `/enfermeria/servicios/${nursingServices[0].slug}`,
      }),
      service2: service("Servicio 2", {
        title: "Rehabilitación física",
        description: "Recuperación de lesiones musculoesqueléticas, cirugías ortopédicas y neurológicas. Planes de rehabilitación personalizados y progresivos.",
        image: nursingServiceImageById["rehabilitacion-fisica"],
        link: `/enfermeria/servicios/${nursingServices[1].slug}`,
      }),
      service3: service("Servicio 3", {
        title: "Renta de equipo médico",
        description: "Equipo médico en renta para apoyar la atención, recuperación y cuidado del paciente en casa, con asesoría para elegir la opción adecuada.",
        image: nursingServiceImageById["renta-equipo-medico"],
        link: `/enfermeria/servicios/${nursingServices[2].slug}`,
      }),
      service4: service("Servicio 4", {
        title: "Laboratorios",
        description: "Toma de muestras a domicilio para análisis clínicos: biometría hemática, química sanguínea, perfil lipídico y más.",
        image: nursingServiceImageById.laboratorios,
        link: `/enfermeria/servicios/${nursingServices[3].slug}`,
      }),
      service5: service("Servicio 5", {
        title: "Radiografías",
        description: "Estudios de imagen a domicilio para diagnóstico de fracturas, lesiones óseas y revisiones postoperatorias.",
        image: nursingServiceImageById.radiografias,
        link: `/enfermeria/servicios/${nursingServices[4].slug}`,
      }),
      service6: service("Servicio 6", {
        title: "Curación de heridas",
        description: "Manejo especializado de heridas crónicas, postoperatorias y úlceras con técnicas avanzadas de cicatrización.",
        image: nursingServiceImageById["curacion-heridas"],
        link: `/enfermeria/servicios/${nursingServices[5].slug}`,
      }),
      finalCta: {
        label: "Llamado final",
        fields: {
          title: text("Título", "¿Listo para comenzar tu recuperación?"),
          description: textarea("Descripción", "Contáctanos hoy y uno de nuestros profesionales te orientará sin compromiso."),
          primaryButtonLabel: text("Botón principal", "Solicitar servicio", 80),
          primaryButtonLink: url("Enlace principal", "https://wa.me/5214777031953"),
          secondaryButtonLabel: text("Botón secundario", "Enviar mensaje", 80),
          secondaryButtonLink: url("Enlace secundario", "/contacto"),
        },
      },
    },
  },
  contacto: {
    label: "Contacto",
    sections: {
      hero: {
        label: "Hero",
        fields: {
          eyebrow: text("Etiqueta", "Contáctanos"),
          title: text("Título", "¡Estamos para"),
          highlightedTitle: text("Título destacado", "cuidarte!"),
          description: textarea("Descripción", "Conecta con nosotros de manera rápida y sencilla. Tu salud y bienestar son nuestra prioridad."),
          image: image("Imagen", "/vitalife-logo.png"),
        },
      },
      form: {
        label: "Formulario",
        fields: {
          title: text("Título", "Envíanos un mensaje"),
          successMessage: text("Mensaje de éxito", "¡Mensaje enviado! Te contactaremos muy pronto."),
          namePlaceholder: text("Placeholder de nombre", "Tu nombre"),
          phonePlaceholder: text("Placeholder de teléfono", "477 000 0000"),
          emailPlaceholder: text("Placeholder de correo", "tu@email.com"),
          messagePlaceholder: text("Placeholder de mensaje", "Cuéntanos cómo podemos ayudarte..."),
          submitLabel: text("Texto del botón", "Enviar mensaje", 80),
        },
      },
    },
  },
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isSafeUrl(value: string, allowAnchor: boolean) {
  if (!value) return true;
  if ((value.startsWith("/") && !value.startsWith("//")) || (allowAnchor && value.startsWith("#"))) return true;
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function fieldError(field: SiteContentFieldDefinition, value: unknown): string | null {
  if (field.type === "boolean") return typeof value === "boolean" ? null : "debe ser verdadero o falso";
  if (field.type === "number") {
    if (typeof value !== "number" || !Number.isFinite(value)) return "debe ser un número válido";
    if (field.min !== undefined && value < field.min) return `debe ser mayor o igual a ${field.min}`;
    if (field.max !== undefined && value > field.max) return `debe ser menor o igual a ${field.max}`;
    return null;
  }
  if (typeof value !== "string") return "debe ser texto";
  if (field.maxLength !== undefined && value.length > field.maxLength) return `no debe superar ${field.maxLength} caracteres`;
  if ((field.type === "url" || field.type === "image") && !isSafeUrl(value, field.type === "url")) return field.type === "image" ? "debe ser una URL http(s) o una ruta interna válida" : "debe ser una URL http(s), una ruta interna o un ancla válida";
  return null;
}

export function isSiteContentPage(value: unknown): value is SiteContentPage {
  return typeof value === "string" && siteContentPages.includes(value as SiteContentPage);
}

export function isSiteContentSection(page: SiteContentPage, value: unknown): value is string {
  return typeof value === "string" && Object.hasOwn(siteContentDefinitions[page].sections, value);
}

export function getDefaultSiteContent(page: SiteContentPage): SitePageContent {
  return Object.fromEntries(Object.entries(siteContentDefinitions[page].sections).map(([section, definition]) => [
    section,
    Object.fromEntries(Object.entries(definition.fields).map(([field, config]) => [field, config.defaultValue])),
  ]));
}

export function mergeSiteContent(page: SiteContentPage, value: unknown): SitePageContent {
  const merged = getDefaultSiteContent(page);
  if (!isRecord(value)) return merged;
  for (const [section, definition] of Object.entries(siteContentDefinitions[page].sections)) {
    const incomingSection = value[section];
    if (!isRecord(incomingSection)) continue;
    for (const [field, config] of Object.entries(definition.fields)) {
      const incomingValue = incomingSection[field];
      if (fieldError(config, incomingValue) === null) merged[section][field] = incomingValue as SiteContentValue;
    }
  }
  return merged;
}

export function validateSiteContentSection(page: SiteContentPage, section: string, value: unknown): { content: SiteContentSection } | { error: string } {
  if (!isSiteContentSection(page, section)) return { error: "La sección no es válida para esta página." };
  if (!isRecord(value)) return { error: "El contenido de la sección debe ser un objeto." };
  const fields = siteContentDefinitions[page].sections[section].fields;
  const expected = Object.keys(fields);
  const supplied = Object.keys(value);
  const unknown = supplied.find((field) => !Object.hasOwn(fields, field));
  if (unknown) return { error: `El campo “${unknown}” no está permitido.` };
  const missing = expected.find((field) => !Object.hasOwn(value, field));
  if (missing) return { error: `Falta el campo “${fields[missing].label}”.` };
  const content: SiteContentSection = {};
  for (const [field, config] of Object.entries(fields)) {
    const error = fieldError(config, value[field]);
    if (error) return { error: `${config.label}: ${error}.` };
    content[field] = value[field] as SiteContentValue;
  }
  return { content };
}
