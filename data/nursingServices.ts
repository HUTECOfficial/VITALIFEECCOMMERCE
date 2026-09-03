export const nursingServices = [
  {
    section: "service1",
    slug: "atencion-domiciliaria",
    eyebrow: "Cuidado profesional en casa",
    summary: "Atención de enfermería confiable, humana y coordinada con las necesidades de cada paciente.",
    benefits: ["Valoración inicial personalizada", "Aplicación segura de medicamentos", "Seguimiento y orientación familiar"],
    steps: ["Escuchamos tus necesidades", "Asignamos al profesional adecuado", "Damos seguimiento a la evolución"],
    idealFor: "Personas en recuperación, adultos mayores y pacientes que requieren cuidados continuos sin trasladarse.",
  },
  {
    section: "service2",
    slug: "rehabilitacion-fisica",
    eyebrow: "Movimiento con propósito",
    summary: "Terapias progresivas para recuperar movilidad, fuerza y confianza con acompañamiento especializado.",
    benefits: ["Plan basado en objetivos", "Ejercicios adaptados al entorno", "Medición continua del progreso"],
    steps: ["Evaluación funcional", "Programa personalizado", "Ajustes según resultados"],
    idealFor: "Recuperación postoperatoria, lesiones musculoesqueléticas y condiciones neurológicas.",
  },
  {
    section: "service3",
    slug: "renta-equipo-medico",
    eyebrow: "Equipo adecuado, cuidado seguro",
    summary: "Soluciones de renta para acondicionar el hogar y facilitar la atención y recuperación del paciente.",
    benefits: ["Orientación para elegir el equipo", "Opciones según el periodo de uso", "Acompañamiento durante la renta"],
    steps: ["Revisamos la necesidad", "Recomendamos una solución", "Coordinamos entrega y seguimiento"],
    idealFor: "Cuidados temporales, recuperaciones postoperatorias y atención de pacientes con movilidad limitada.",
  },
  {
    section: "service4",
    slug: "laboratorios-a-domicilio",
    eyebrow: "Estudios sin salir de casa",
    summary: "Toma de muestras con atención cuidadosa y coordinación eficiente para tus análisis clínicos.",
    benefits: ["Comodidad en tu domicilio", "Protocolos seguros de toma", "Atención puntual y profesional"],
    steps: ["Indícanos los estudios", "Agendamos la visita", "Procesamos y entregamos resultados"],
    idealFor: "Adultos mayores, pacientes con movilidad limitada, familias y personas con agendas ocupadas.",
  },
  {
    section: "service5",
    slug: "radiografias-a-domicilio",
    eyebrow: "Diagnóstico donde lo necesitas",
    summary: "Estudios de imagen coordinados en casa para evitar traslados innecesarios y cuidar al paciente.",
    benefits: ["Menor esfuerzo para el paciente", "Atención coordinada", "Apoyo para estudios de seguimiento"],
    steps: ["Validamos el estudio solicitado", "Coordinamos fecha y domicilio", "Realizamos el estudio y seguimiento"],
    idealFor: "Pacientes postoperatorios, personas con movilidad reducida y estudios de control médico.",
  },
  {
    section: "service6",
    slug: "curacion-de-heridas",
    eyebrow: "Cicatrización con atención experta",
    summary: "Manejo profesional de heridas con evaluación, técnica adecuada y seguimiento de su evolución.",
    benefits: ["Evaluación del tipo de herida", "Materiales y técnica apropiados", "Seguimiento de cicatrización"],
    steps: ["Valoramos la herida", "Definimos el plan de curación", "Monitoreamos la respuesta"],
    idealFor: "Heridas postoperatorias, lesiones crónicas, úlceras y pacientes que necesitan curaciones recurrentes.",
  },
] as const;

export type NursingService = (typeof nursingServices)[number];

export function getNursingService(slug: string) {
  return nursingServices.find((service) => service.slug === slug);
}
