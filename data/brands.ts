export type BrandCategory =
  | "Apósitos y Cintas"
  | "Guantes"
  | "Agujas y Jeringas"
  | "Vías IV"
  | "Ventilación"
  | "Soluciones IV"
  | "Antisépticos"
  | "Material de Curación"
  | "Sondas y Catéteres"
  | "Equipo Quirúrgico"
  | "Diagnóstico"
  | "Rehabilitación"
  | "Misceláneos";

export interface BrandFamily {
  name: string;
  description: string;
  items: string[];
}

export interface Brand {
  id: string;
  name: string;
  description: string;
  category: BrandCategory;
  gradient: string;
  families: BrandFamily[];
}

export const brandCategories: BrandCategory[] = [
  "Apósitos y Cintas",
  "Guantes",
  "Agujas y Jeringas",
  "Vías IV",
  "Ventilación",
  "Soluciones IV",
  "Antisépticos",
  "Material de Curación",
  "Sondas y Catéteres",
  "Equipo Quirúrgico",
  "Diagnóstico",
  "Rehabilitación",
  "Misceláneos",
];

export const brands: Brand[] = [
  {
    id: "3m",
    name: "3M",
    description: "Apósitos, cintas quirúrgicas y soluciones antisépticas de alta tecnología para el cuidado de la piel.",
    category: "Apósitos y Cintas",
    gradient: "from-[#1a3a6b] to-[#2251a3]",
    families: [
      {
        name: "Avagard",
        description: "Antiséptico para manos con humectante. Solución de gluconato de clorhexidina y alcohol.",
        items: [
          "Avagard con CHG 1%, bote de 500 ml",
          "Base de pie para Avagard",
        ],
      },
      {
        name: "Cinta Transpore",
        description: "Cinta quirúrgica transparente de plástico microperforado.",
        items: [
          "Cinta Transpore 1 pulgada, caja 12 piezas",
          "Cinta Transpore 1/2 pulgada, caja 24 piezas",
          "Cinta Transpore 2 pulgadas, caja 6 piezas",
          "Cinta Transpore 3 pulgadas, caja 4 piezas",
        ],
      },
      {
        name: "Durapore",
        description: "Cinta de tela transpirable, ajustable, versátil y resistente.",
        items: [
          "Durapore 1 pulgada, caja con 12 piezas",
          "Durapore 2 pulgadas, caja con 6 piezas",
        ],
      },
      {
        name: "Tegaderm I.V.",
        description: "Apósito transparente para fijación de vías intravenosas.",
        items: [
          "Tegaderm I.V. 10.7 cm, caja con 100 piezas",
          "Tegaderm I.V. Pediátrico 7 cm, caja con 100 piezas",
        ],
      },
      {
        name: "Steri Strip",
        description: "Sutura adhesiva para cierre de heridas y cortes semiprofundos.",
        items: [
          "Steri Strip 6 x 75 mm, caja con tiras",
          "Steri Strip 6 x 100 mm, caja con tiras",
          "Steri Strip 12 x 100 mm, caja con tiras",
        ],
      },
      {
        name: "Tegaderm",
        description: "Apósito transparente para cuidado de la piel y fijación IV.",
        items: ["Tegaderm 8 x 10 cm, caja con 50 piezas"],
      },
      {
        name: "Tegaderm + Pad",
        description: "Apósito transparente con almohadilla absorbente.",
        items: [
          "Tegaderm + Pad 6 x 7 cm, caja 50 piezas",
          "Tegaderm + Pad 9 x 10 cm, caja 25 piezas",
          "Tegaderm + Pad 9 x 15 cm, caja 25 piezas",
          "Tegaderm + Pad 10 x 12 cm, caja 25 piezas",
          "Tegaderm + Pad 10 x 25 cm, caja 25 piezas",
          "Tegaderm + Pad 10 x 30 cm, caja 25 piezas",
          "Tegaderm + Pad 8 x 7 cm, caja 50 piezas",
        ],
      },
      {
        name: "Tegaderm Film",
        description: "Apósito transparente Film para cuidado de la piel.",
        items: [
          "Tegaderm Film 10 x 12 cm, caja 50 piezas",
          "Tegaderm Film 6 x 7 cm, caja 100 piezas",
        ],
      },
      {
        name: "Duraprep",
        description: "Solución antiséptica prequirúrgica con yodo y alcohol isopropílico.",
        items: ["Duraprep 26 ml adulto", "Duraprep 6 ml pediátrico"],
      },
      {
        name: "Micropore",
        description: "Cinta adhesiva microporosa para piel quirúrgica.",
        items: [
          "Micropore 2 pulgadas, caja 6 piezas",
          "Micropore 1 pulgada, caja 12 piezas",
          "Micropore 1/2 pulgada, caja 24 piezas",
          "Micropore 3 pulgadas, caja 4 piezas",
        ],
      },
      {
        name: "Loción Removedora",
        description: "Elimina solución DuraPrep sin irritar la piel del paciente.",
        items: ["Loción removedora / 20 sobres"],
      },
    ],
  },
  {
    id: "ambiderm",
    name: "AMBIDERM",
    description: "Insumos desechables de uso médico: guantes, jeringas, electrodos y material de curación.",
    category: "Guantes",
    gradient: "from-[#2eb8d4] to-[#1a8fa8]",
    families: [
      {
        name: "Guante de Nitrilo",
        description: "Guante de nitrilo color azul y negro para uso médico.",
        items: [
          "Guante de nitrilo chico, color azul",
          "Guante de nitrilo grande, color azul",
          "Guante de nitrilo mediano, color azul",
          "Guante de nitrilo chico, color negro",
        ],
      },
      {
        name: "Guante Estéril",
        description: "Guante estéril para procedimientos clínicos.",
        items: [
          "Guante estéril chico",
          "Guante estéril grande",
          "Guante estéril mediano",
        ],
      },
      {
        name: "Guante para Cirugía",
        description: "Guante quirúrgico estéril en distintas tallas.",
        items: [
          "Guante para cirugía #6, caja 50 pares",
          "Guante para cirugía #6.5, caja 50 pares",
          "Guante para cirugía #7, caja 50 pares",
          "Guante para cirugía #7.5, caja 50 pares",
          "Guante para cirugía #8, caja 50 pares",
          "Guante para cirugía #8.5, caja 50 pares",
        ],
      },
      {
        name: "Guante Vinyl / No Estéril",
        description: "Guantes no estériles en diversas presentaciones.",
        items: [
          "Guante vinyl, talla chica",
          "Guante no estéril Kid Gloves, talla chica",
          "Guante no estéril negro chica / grande / mediana",
          "Guante no estéril plus chica / grande / mediana",
        ],
      },
      {
        name: "Jeringas",
        description: "Jeringas desechables con aguja en diferentes capacidades.",
        items: [
          "Jeringa 1 ml, 27g x 13 mm, caja 100 piezas",
          "Jeringa 3 ml, 22g x 32 mm, caja 100 piezas",
          "Jeringa 5 ml, 22g x 32 mm, caja 100 piezas",
          "Jeringa 10 ml, 22g x 32 mm, caja 100 piezas",
        ],
      },
      {
        name: "Electrodo",
        description: "Electrodos pediátrico y adulto de espuma.",
        items: ["Electrodo pediátrico redondo de espuma", "Electrodo adulto redondo de espuma"],
      },
      {
        name: "Material General",
        description: "Bolsas RPBI, equipo de parto, hojas de bisturí, abatelenguas y más.",
        items: [
          "Bolsa para RPBI amarilla 60 x 80 cm",
          "Bolsa para RPBI roja 60 x 90 cm",
          "Equipo para parto",
          "Hoja para bisturí, carbono (todos los números)",
          "Hoja para bisturí, acero inoxidable (todos los números)",
          "Rastrillo 1 filo con bordes romos",
          "Rastrillo 2 filos con bordes romos",
          "Sábana de cajón 120 x 240",
          "Sábana de cajón 80 x 210",
          "Equipo de cirugía mayor estéril",
          "Rollo para mesa de examen estándar crepé, 53 cm x 48 m",
          "Abatelenguas de madera, caja 100 piezas",
        ],
      },
    ],
  },
  {
    id: "bd",
    name: "BD",
    description: "Líderes globales en agujas hipodérmicas, jeringas Plastipak, tubos Vacutainer y cepillos quirúrgicos.",
    category: "Agujas y Jeringas",
    gradient: "from-[#1a5a8b] to-[#2284c0]",
    families: [
      {
        name: "Aguja Hipodérmica",
        description: "Agujas en calibres del 18g al 30g con código de color.",
        items: [
          "18g x 40 mm, morada, 100 piezas",
          "18g x 38 mm, rosa, 100 piezas",
          "20g x 38 mm, amarilla, 100 piezas",
          "21g x 32 mm, verde, 100 piezas",
          "22g x 32 mm, negra, 100 piezas",
          "23g x 25 mm, azul, 100 piezas",
          "25g x 16 mm, naranja, 100 piezas",
          "27g x 13 mm, gris, 100 piezas",
          "30g x 13 mm, café, 100 piezas",
        ],
      },
      {
        name: "Jeringa Plastipak",
        description: "Jeringas Luer Lok con y sin aguja en diversas capacidades.",
        items: [
          "Plastipak 1 ml Luer Lok con aguja 27g, 100 piezas",
          "Plastipak 3 ml Luer Lok 22g, 100 piezas",
          "Plastipak 3 ml Luer Lok 23g azul, 100 piezas",
          "Plastipak 5 ml Luer Lok 22g, 100 piezas",
          "Plastipak 5 ml sin aguja, 100 piezas",
          "Plastipak 10 ml 21g aguja verde, 100 piezas",
          "Plastipak 10 ml 22g aguja negra, 100 piezas",
          "Plastipak 20 ml sin aguja, 50 piezas",
          "Para insulina 0.5 ml ultrafina 31g x 6 mm, 100 piezas",
        ],
      },
      {
        name: "Vacutainer y Agujas Especiales",
        description: "Tubos Vacutainer, agujas Whitacre y accesorios de punción.",
        items: [
          "Tubo Vacutainer color lila",
          "Tubo Vacutainer color rojo",
          "Aguja Vacutainer 21g x 1.5, verde",
          "Aguja Vacutainer 22g x 1.5, negra",
          "Aguja Whitacre 22g x 3.50 in corta",
          "Aguja Whitacre 25g x 3.50 in corta",
          "Aguja Whitacre 27g x 3.50 in",
          "Aguja Whitacre 27g x 4.68 in larga",
          "Recolector de punzocortantes 7.5 L",
        ],
      },
      {
        name: "Cepillos y Accesorios",
        description: "Cepillos EZ-Scrub y tapones adaptadores.",
        items: [
          "Cepillo EZ-Scrub 15 con jabón",
          "Cepillo EZ-Scrub 20 con solución",
          "Tapón adaptador PRN Luer-Lok, 50 piezas",
        ],
      },
    ],
  },
  {
    id: "b-braun",
    name: "B. BRAUN",
    description: "Catéteres Introcan Certo, bioconectores Caresite, agujas Spinocan y soluciones para vías IV.",
    category: "Vías IV",
    gradient: "from-[#0d5c3a] to-[#1a8f5a]",
    families: [
      {
        name: "Introcan Certo",
        description: "Catéter periférico intravenoso en calibres del 16g al 24g.",
        items: [
          "Introcan Certo 16g, gris",
          "Introcan Certo 18g",
          "Introcan Certo 20g / 20g rosa",
          "Introcan Certo 22g / 22g azul",
          "Introcan Certo 24g / 24g amarillo",
        ],
      },
      {
        name: "Caresite Bioconector",
        description: "Bioconectores con extensión para acceso seguro IV.",
        items: [
          "Caresite 1 vía con extensión 7 cm, conector Solo-teck",
          "Caresite 1 vía con extensión 20 cm, Small Bore",
        ],
      },
      {
        name: "Spinocan & Perifix",
        description: "Agujas espinales y set para anestesia epidural.",
        items: [
          "Spinocan 18g, rosa",
          "Spinocan 20g, amarillo",
          "Spinocan 22g, negro",
          "Spinocan 25g, naranja",
          "Spinocan 26g, café",
          "Spinocan 27g, blanco",
          "Perifix Mini Set 18g",
        ],
      },
      {
        name: "Venofix & Accesorios",
        description: "Mariposas IV y accesorios para punción venosa.",
        items: [
          "Venofix 21g x 20 mm, caja 50 piezas",
          "Venofix 23g x 20 mm, caja 50 piezas",
          "Venofix 21g x 19 mm, caja 50 piezas",
          "Histoacryl azul 0.5 ml",
          "Tapón in stopper",
        ],
      },
    ],
  },
  {
    id: "covidien",
    name: "COVIDIEN",
    description: "Amplia gama de catéteres torácicos, sondas, electrodos y kits quirúrgicos Kendall.",
    category: "Sondas y Catéteres",
    gradient: "from-[#2a1a6b] to-[#4a22b3]",
    families: [
      {
        name: "Catéter Torácico",
        description: "Catéteres torácicos en calibres 12FR a 36FR.",
        items: [
          "Catéter torácico 12 FR",
          "Catéter torácico 16 FR",
          "Catéter torácico 20 FR",
          "Catéter torácico 24 FR",
          "Catéter torácico 28 FR",
          "Catéter torácico 32 FR",
          "Catéter torácico 36 FR",
        ],
      },
      {
        name: "Sonda Foley",
        description: "Sondas Foley látex y silicón en distintos calibres y globos.",
        items: [
          "Sonda Foley 2 vías 12 FR, globo 5 cc / 30 cc",
          "Sonda Foley 2 vías 14 FR, globo 5 cc / 30 cc",
          "Sonda Foley 2 vías 16 FR, globo 5 cc / 30 cc",
          "Sonda Foley 2 vías 18 FR, globo 5 cc / 30 cc",
          "Sonda Foley 2 vías 20 FR, globo 5 cc / 30 cc",
          "Sonda Foley 2 vías 22 FR, globo 5 cc / 30 cc",
          "Sonda Foley 2 vías 24 FR, globo 5 cc / 30 cc",
          "Sonda Foley de silicón 2 vías, 8 FR, globo 5 cc",
        ],
      },
      {
        name: "Sonda Nelaton y Succión",
        description: "Sondas de drenaje y aspiración en color rojo.",
        items: [
          "Sonda Nelaton 10 FR", "Sonda Nelaton 12 FR", "Sonda Nelaton 14 FR",
          "Sonda Nelaton 16 FR", "Sonda Nelaton 18 FR", "Sonda Nelaton 20 FR",
          "Tubo de succión 3.1 m estéril",
          "Cánula de Yankauer con control estéril",
          "Cánula de Yankauer con tubo 1.83 m",
        ],
      },
      {
        name: "Electrodos y Accesorios",
        description: "Electrodos Medi-Trace y kits de trócar endoscópico.",
        items: [
          "Electrodo Medi-Trace 100 Pedi, 100 piezas",
          "Electrodo Medi-Trace 200 Adulto, 100 piezas",
          "Electrodo C-Trace Gold, 100 piezas",
          "Kit de trocar 5 mm y 10/12 mm",
          "Bolsa recolectora de orina 2 L Kendall",
          "Clipadora endoscópica 5 mm desechable",
          "Mahurkar 11.5 x 19.5 curva",
        ],
      },
    ],
  },
  {
    id: "respifix",
    name: "RESPIFIX",
    description: "Tubos endotraqueales, mascarillas laríngeas y cánulas de Guedel para vía aérea.",
    category: "Ventilación",
    gradient: "from-[#1a4a6b] to-[#2272a8]",
    families: [
      {
        name: "Cánula de Guedel",
        description: "Cánulas orofaríngeas con código de color por tamaño.",
        items: [
          "Cánula de Guedel 40 mm, rosa",
          "Cánula de Guedel 50 mm, azul",
          "Cánula de Guedel 60 mm, negro",
          "Cánula de Guedel 70 mm, blanco",
          "Cánula de Guedel 80 mm, verde",
          "Cánula de Guedel 90 mm, amarillo",
          "Cánula de Guedel 100 mm, café",
          "Cánula de Guedel 110 mm, naranja",
        ],
      },
      {
        name: "Tubo Endotraqueal con Globo",
        description: "Tubos endotraqueales con globo del #3.0 al #10.0.",
        items: [
          "#3.0", "#3.5", "#4.0", "#4.5", "#5.0", "#5.5",
          "#6.0", "#6.5", "#7.0", "#7.5", "#8.0", "#8.5", "#9.0", "#9.5", "#10.0",
        ],
      },
      {
        name: "Tubo Endotraqueal sin Globo",
        description: "Tubos sin globo para pacientes pediátricos.",
        items: ["#2.0", "#2.5", "#3.0", "#3.5", "#4.0", "#4.5", "#5.0", "#5.5", "#6.0"],
      },
      {
        name: "Mascarilla Laríngea",
        description: "Mascarilla laríngea desechable tipo Unique en tallas del #1 al #5.",
        items: ["#1", "#1.5", "#2", "#2.5", "#3", "#4", "#5"],
      },
    ],
  },
  {
    id: "hudson-rci",
    name: "HUDSON RCI",
    description: "Circuitos de anestesia, mascarillas Sure Seal, micronebulizadores y equipo respiratorio.",
    category: "Ventilación",
    gradient: "from-[#1a3a6b] to-[#0d6b8a]",
    families: [
      {
        name: "Circuitos de Anestesia",
        description: "Circuitos Bain, en Y y expandibles para adulto y pediátrico.",
        items: [
          "Circuito Bain pediátrico 60 in / bolsa 1 L",
          "Circuito Bain adulto 60 in / bolsa 3 L",
          "Circuito en Y giratorio pediátrico con bolsa 1 L",
          "Circuito expandible adulto 0.60–1.83 m / bolsa 3 L",
          "Circuito fijo en Y adulto 1.83 m / bolsa 3 L",
          "Circuito CPAP neonatal tallas 0–4",
        ],
      },
      {
        name: "Mascarillas Sure Seal",
        description: "Mascarillas faciales con cojín de aire para anestesia.",
        items: [
          "Sure Seal adulto grande / mediana / pequeña",
          "Sure Seal infantil / pediátrica / neonato",
        ],
      },
      {
        name: "Mascarillas de Oxígeno",
        description: "Mascarillas de alta y media concentración con reservorio.",
        items: [
          "Alta concentración con reservorio pediátrica",
          "Concentración media adulto",
          "Concentración media pediátrica",
        ],
      },
      {
        name: "Micronebulizador Micro-Mist",
        description: "Micronebulizadores con boquilla, mascarilla adulto y pediátrica.",
        items: [
          "Con boquilla y tubo, conector universal",
          "Con mascarilla adulto alargada",
          "Con mascarilla pediátrica alargada",
        ],
      },
      {
        name: "Accesorios Respiratorios",
        description: "Estilete, filtros, sujetadores y resucitadores.",
        items: [
          "Estilete para intubar adulto 10-11 pulgadas",
          "Filtro bacteriano-viral de flujo principal",
          "Sujetador para tubo endotraqueal adulto",
          "Sujetador para tubo endotraqueal rígido",
          "Resucitador adulto MCA con desviador de flujo",
          "Niple cola de ratón para oxígeno",
          "Circuito para ventilador 72 pulgadas estándar",
        ],
      },
    ],
  },
  {
    id: "pisa",
    name: "PISA",
    description: "Soluciones intravenosas, Flebotek, soluciones de irrigación y medicamentos inyectables.",
    category: "Soluciones IV",
    gradient: "from-[#1a6b3a] to-[#2eb87a]",
    families: [
      {
        name: "Flebotek — Equipos IV",
        description: "Equipos para venoclisis y bombas de infusión.",
        items: [
          "Flebotek quirúrgico NB",
          "Flebotek O-100 EF / con llave / O-100A",
          "Flebotek O-150 para bomba",
          "Flebotek infusomat normal y opaco",
          "Flebotek microgoteros / opaco Venoclysis",
          "Flebotek quirúrgico equipo Venoclysis",
          "Flebotek 5 y equipos venoclis normogotero",
        ],
      },
      {
        name: "Soluciones DX",
        description: "Dextrosa en diversas concentraciones y presentaciones.",
        items: [
          "Solución DX-5 1000 ml flexible",
          "Solución DX-5 500 ml flexible",
          "Solución DX-5 250 ml",
          "Solución DX-10 1000 ml flexible",
          "Solución DX-50 500 ml / 50 ml",
          "DX-10 500 ml bote",
        ],
      },
      {
        name: "Soluciones CS / HT / SSB",
        description: "Soluciones inyectables y para irrigación.",
        items: [
          "Solución CS 1000 ml / 500 ml / 250 ml flexible",
          "Solución CS 17% 10 ml ámpula",
          "Solución CS para irrigación 1000 ml",
          "Solución HT 1000 ml / 500 ml / 250 ml",
          "Solución SSB 500 ml / 250 ml",
          "Solución 1x1 inyectable 500 ml",
        ],
      },
      {
        name: "Agua Estéril y Otros",
        description: "Agua para irrigación, cloruro de sodio y accesorios.",
        items: [
          "Agua estéril para irrigar 1000 ml / 500 ml / 3 L",
          "Agua inyectable 10 ml plástico, 100 piezas",
          "Cloruro de sodio 3000 ml bolsa 0.9%",
          "Cloruro de sodio 1000 ml",
          "Pisacaína 2% inyectable 50 ml frasco",
          "Pisacaína con epinefrina 50 ml",
          "Llave de tres vías Girex 50/80 cm con extensión",
          "Llave de tres vías sin extensión Girex",
          "Irrigatek 1 vía / 2 vías",
          "Glisuret 1.5% 3000 ml",
          "Ureosac bolsa para orina 2 L",
          "Home Pump 100 ml / 2 ml/hr",
          "Enterobag 500 ml para bomba",
        ],
      },
    ],
  },
  {
    id: "bsn-medical",
    name: "BSN MEDICAL",
    description: "Vendas enyesadas Gypsona, Coban, Leukoplast y fibra de vidrio Delta-Lite.",
    category: "Rehabilitación",
    gradient: "from-[#6b3a1a] to-[#a85a2e]",
    families: [
      {
        name: "Delta-Lite Fibra de Vidrio",
        description: "Inmovilización ortopédica en presentaciones 2\" a 5\".",
        items: [
          "Delta-Lite fibra de vidrio 2\"",
          "Delta-Lite fibra de vidrio 3\"",
          "Delta-Lite fibra de vidrio 4\"",
          "Delta-Lite fibra de vidrio 5\"",
        ],
      },
      {
        name: "Venda Enyesada Gypsona",
        description: "Yeso de fraguado rápido en diversas anchuras.",
        items: [
          "Venda enyesada 5 cm", "Venda enyesada 7.5 cm",
          "Venda enyesada 10 cm", "Venda enyesada 15 cm", "Venda enyesada 20 cm",
        ],
      },
      {
        name: "Leukoplast y Telas",
        description: "Esparadrapos de tela adhesiva en distintas medidas.",
        items: [
          "Leukoplast 1/2\"", "Leukoplast 1\"",
          "Leukoplast 2\"", "Leukoplast 3\"", "Leukoplast 4\"",
        ],
      },
      {
        name: "Venda Coban y Hypafix",
        description: "Cohesivos y apósitos de fijación.",
        items: [
          "Venda Coban 5 cm", "Venda Coban 10 cm",
          "Venda Tensoplast 10 m",
          "Hypafix 10 cm x 10 cm",
        ],
      },
    ],
  },
  {
    id: "rusch",
    name: "RÜSCH",
    description: "Cánulas nasofaríngeas de alta calidad en calibres del 20 FR al 36 FR.",
    category: "Ventilación",
    gradient: "from-[#3a1a6b] to-[#5a22a3]",
    families: [
      {
        name: "Cánula Nasofaríngea",
        description: "Disponible en 9 calibres (20 FR a 36 FR).",
        items: [
          "20 FR", "22 FR", "24 FR", "26 FR", "28 FR",
          "30 FR", "32 FR", "34 FR", "36 FR",
        ],
      },
    ],
  },
  {
    id: "sensi-medical",
    name: "SENSI MEDICAL",
    description: "Agujas hipodérmicas, jeringas, sondas, cánulas y termómetros digitales.",
    category: "Agujas y Jeringas",
    gradient: "from-[#1a6b5a] to-[#2eb89a]",
    families: [
      {
        name: "Aguja Hipodérmica",
        description: "Agujas con código de color del 18g al 27g.",
        items: [
          "18g x 32 mm, rosa", "20g x 32 mm, amarillo", "22g x 32 mm, negro",
          "23g x 25 mm, azul", "25g x 16 mm, naranja", "27g x 13 mm, gris",
        ],
      },
      {
        name: "Jeringas y Soluciones",
        description: "Jeringas de 20 ml y 60 ml, soluciones cloruro y Hartman.",
        items: [
          "Jeringa 20 ml sin aguja, 50 piezas",
          "Jeringa 60 ml sin aguja",
          "Cloruro de sodio 100 ml 9% (12 tubos / 24 bolsas)",
          "Hartman 100 ml / 500 ml",
          "Equipo para venoclisis sin aguja normogotero",
        ],
      },
      {
        name: "Sondas y Catéteres",
        description: "Foley, Nelaton, succión, umbilicales y embolectomía.",
        items: [
          "Sonda Foley látex 2v / 3v / 4v, 8–26 FR",
          "Sonda Foley silicón 2v globo 5 FR",
          "Sonda Nelaton 12 / 14 / 16 FR",
          "Sonda succión 8 FR",
          "Catéter umbilical 3.5 FR / 5 FR",
          "Catéter embolectomía Fogarty 2 FR / 5 FR",
        ],
      },
      {
        name: "Vía Aérea y Diagnóstico",
        description: "Cánulas de Guedel, tubos endotraqueales y termómetros.",
        items: [
          "Cánula de Guedel 30–110 mm",
          "Tubo endotraqueal con alma de acero 8.0–9.5 FR",
          "Tubo endotraqueal sin globo #3.0–#4.0 FR",
          "Termómetro digital punta flexible",
          "Termómetro digital punta rígida",
        ],
      },
      {
        name: "Misceláneos",
        description: "Banditas adhesivas y bolsas para colostomía.",
        items: [
          "Banditas adhesivas redondas Skinprot, 100 piezas",
          "Bolsa para colostomía / ileostomía adulto, 10 piezas",
        ],
      },
    ],
  },
  {
    id: "esteripharma",
    name: "ESTERIPHARMA",
    description: "Desinfectantes de alto nivel Estericide y jabones Estericlean para áreas médicas.",
    category: "Antisépticos",
    gradient: "from-[#1a3a6b] to-[#2eb8d4]",
    families: [
      {
        name: "Estericide",
        description: "Desinfectantes de alto nivel en diversas presentaciones.",
        items: [
          "Estericide QX desinfectante alto nivel, solución 5 L",
          "Estericide QX solución desinfectante, 2 L",
          "Estericide Duo Desinfectante 500 ml",
          "Estericide antiséptico QX atomizador 500 g",
          "Estericide antiséptico solución 1 L",
          "Estericide en gel 90 g",
          "Estericide bucofaríngeo adulto 240 ml",
          "Estericide solución antiséptica mutu 240 ml",
          "Estericide para irrigación quirúrgica en bolsa 1 L",
          "Estericide atomizador 500 ml",
          "Estericlean jabón detergente farmacéutico 5 L",
        ],
      },
    ],
  },
  {
    id: "altamirano",
    name: "ALTAMIRANO",
    description: "Antisépticos y lubricantes quirúrgicos: Antibenzil, Krit, Lubricain y más.",
    category: "Antisépticos",
    gradient: "from-[#3a5a1a] to-[#5a8a2e]",
    families: [
      {
        name: "Antisépticos",
        description: "Soluciones para higiene y desinfección quirúrgica.",
        items: [
          "Antibenzil concentrado rojo",
          "Antibenzil jabón quirúrgico verde",
          "Gafidex",
          "Krit RT 500 ml",
          "Krit RT galón",
          "Nina Scrub",
          "Triclofen",
        ],
      },
      {
        name: "Lubricantes",
        description: "Lubricantes especializados para uso médico.",
        items: ["Lubri-6", "Lubricain"],
      },
    ],
  },
  {
    id: "le-roy",
    name: "LE ROY",
    description: "Compresas estériles, cubrebocas, gasas y esponjas para material de curación.",
    category: "Material de Curación",
    gradient: "from-[#6b1a3a] to-[#a82260]",
    families: [
      {
        name: "Compresas",
        description: "Compresas estériles y no estériles en diversas medidas.",
        items: [
          "Compresa estéril 45 x 70",
          "Compresa no estéril, 6 piezas",
        ],
      },
      {
        name: "Gasas y Esponjas",
        description: "Gasas y esponjas 10 x 10 sin/con trama.",
        items: [
          "Esponja de gasa 10 x 10, sin trama, 200 piezas",
          "Esponja de gasa no estéril 10 x 10, con trama, 200 piezas",
          "Gasa seca no estéril 7.5 x 5 cm, 200 piezas",
        ],
      },
      {
        name: "Cubrebocas",
        description: "Cubrebocas plisado con 5 piezas.",
        items: ["Cubrebocas plisado, 5 piezas"],
      },
    ],
  },
  {
    id: "quirmex",
    name: "QUIRMEX",
    description: "Algodón, gasas, rollos y vendas elásticas para curación y vendaje.",
    category: "Material de Curación",
    gradient: "from-[#1a3a6b] to-[#5a22a3]",
    families: [
      {
        name: "Algodón y Torundas",
        description: "Algodón plisado, rollos y torundas.",
        items: [
          "Algodón plisado 300 g",
          "Rollo de algodón tipo lámina 500 g",
          "Torunda de algodón 50 g / 70 g",
        ],
      },
      {
        name: "Gasas",
        description: "Gasas no estériles y estériles en distintas presentaciones.",
        items: [
          "Gasa 10x10 no estéril sin trama, 200 piezas",
          "Gasa 10x10 no estéril con trama",
          "Gasa simple estéril 10x10 azul, 100 / 10 piezas",
          "Gasa simple estéril 7.5x5 cm, 10 piezas",
          "Rollo de gasa simple 20 x 12",
        ],
      },
      {
        name: "Vendas Elásticas",
        description: "Vendas elásticas en anchuras de 7.5 a 30 cm.",
        items: [
          "Venda elástica 7.5 cm",
          "Venda elástica 10 cm",
          "Venda elástica 15 cm",
          "Venda elástica 30 cm",
        ],
      },
    ],
  },
  {
    id: "conmed",
    name: "CONMED",
    description: "Grapadoras de piel, cauterios, trompetas de succión y manipuladores quirúrgicos.",
    category: "Equipo Quirúrgico",
    gradient: "from-[#1a4a6b] to-[#1a8fa8]",
    families: [
      {
        name: "Grapadora y Extractor",
        description: "Grapadora W35 y extractor de grapas.",
        items: ["Grapadora de piel W35", "Extractor de grapas"],
      },
      {
        name: "Cauterio y Accesorios",
        description: "Puntas largas de cauterio y placa desechable.",
        items: [
          "Punta larga fina de cauterio",
          "Punta larga plana de cauterio",
          "Placa con cable adulto pediátrico desechable",
        ],
      },
      {
        name: "Cirugía Laparoscópica",
        description: "Manguera de insuflación, trompeta de succión y manipulador uterino.",
        items: [
          "Manguera de insuflación con filtro",
          "Trompeta para succión e irrigación F0RA",
          "Manipulador uterino desechable",
        ],
      },
    ],
  },
  {
    id: "ideal",
    name: "IDEAL",
    description: "Vendas Elastomedic y elásticas de baja compresión en diversas anchuras.",
    category: "Rehabilitación",
    gradient: "from-[#6b5a1a] to-[#a88a2e]",
    families: [
      {
        name: "Venda Elastomedic",
        description: "Venda elástica de alta calidad 10 cm y 15 cm x 5 m.",
        items: ["Venda Elastomedic 10 cm x 5 m", "Venda Elastomedic 15 cm x 5 m"],
      },
      {
        name: "Venda Elástica Baja Compresión",
        description: "Vendas del 5 cm al 30 cm en presentación de 5 m.",
        items: [
          "5 cm x 5 m", "7.5 cm x 5 m", "10 cm x 5 m",
          "15 cm x 5 m", "20 cm x 5 m", "30 cm x 5 m",
        ],
      },
    ],
  },
  {
    id: "dipasa",
    name: "DIPASA / LABORATORIOS VISA",
    description: "Sondas de Levin, Nelaton transparente, succión y bolsas para nutrición enteral.",
    category: "Sondas y Catéteres",
    gradient: "from-[#1a5a3a] to-[#2284a8]",
    families: [
      {
        name: "Sonda de Levin",
        description: "Sondas nasogástricas del 8 FR al 20 FR.",
        items: ["8 FR", "10 FR", "12 FR", "14 FR", "16 FR", "18 FR", "20 FR"],
      },
      {
        name: "Sonda Nelaton Transparente",
        description: "Sondas estériles del 8 FR al 18 FR.",
        items: ["8 FR", "10 FR", "12 FR", "14 FR", "16 FR", "18 FR"],
      },
      {
        name: "Sonda de Succión",
        description: "Sondas con control del 6 FR al 18 FR.",
        items: ["6 FR", "8 FR", "10 FR", "12 FR", "14 FR", "16 FR", "18 FR"],
      },
      {
        name: "Bolsas y Accesorios",
        description: "Bolsas enterales, urocultivo, colostomía y conectores.",
        items: [
          "Bolsa enteral adulto / pediátrica",
          "Bolsa para enema",
          "Bolsa urocultivo 50 ml / 100 ml",
          "Bolsa recolectora de orina 2 L estéril",
          "Conector en Y",
          "Conector tipo Sims delgado / grueso",
          "Catéter para suministro de oxígeno adulto / pediátrico",
          "Pinza umbilical",
          "Sonda para alimentación infantil 8 FR corta / larga",
          "Sonda para alimentación prematuro 5 FR",
        ],
      },
    ],
  },
  {
    id: "accu-chek",
    name: "ACCU-CHEK",
    description: "Glucómetros, lancetas Softclix y tiras reactivas para monitoreo de glucosa.",
    category: "Diagnóstico",
    gradient: "from-[#6b1a1a] to-[#b82222]",
    families: [
      {
        name: "Monitoreo de Glucosa",
        description: "Sistema completo de automonitoreo Accu-Chek Active.",
        items: [
          "Glucómetro Accu-Chek Active",
          "Tiras reactivas Accu-Chek Active, 10 piezas",
          "Lanceta Softclix, 100 piezas",
          "Lanceta Softclix, 200 piezas",
        ],
      },
    ],
  },
  {
    id: "edigar",
    name: "EDIGAR",
    description: "Cabestrillos, collarines ortopédicos, riñones adulto y cepillos quirúrgicos.",
    category: "Rehabilitación",
    gradient: "from-[#3a3a1a] to-[#6b6b2e]",
    families: [
      {
        name: "Inmovilización y Soporte",
        description: "Cabestrillos y collarines cervicales en distintas tallas.",
        items: [
          "Cabestrillo chico / mediano / grande",
          "Collarín blanco talla chica / mediana",
        ],
      },
      {
        name: "Utensilios Clínicos",
        description: "Riñón adulto y cepillos de limpieza.",
        items: [
          "Riñón adulto",
          "Cepillo de lechuguilla",
          "Cepillo de nylon para lavado",
        ],
      },
    ],
  },
  {
    id: "applied-medical",
    name: "APPLIED MEDICAL",
    description: "Kits de trócar, agujas de Veress y trompetas de succión laparoscópica.",
    category: "Equipo Quirúrgico",
    gradient: "from-[#1a3a6b] to-[#2251a3]",
    families: [
      {
        name: "Laparoscopia",
        description: "Equipamiento para acceso laparoscópico.",
        items: [
          "Aguja de Veress / cubierta chica",
          "Kit de trocar: 2 camisas y punzón 5 mm; 2 camisas y punzón 10–12 mm",
          "Trompeta de succión e irrigación",
        ],
      },
    ],
  },
  {
    id: "punzocat",
    name: "PUNZOCAT / ADVANTIVE",
    description: "Catéteres periféricos Radiopaque estériles del 14g al 24g.",
    category: "Vías IV",
    gradient: "from-[#1a5a8b] to-[#2284c0]",
    families: [
      {
        name: "Catéter Periférico Punzocat",
        description: "Catéteres periféricos estériles Radiopaque.",
        items: [
          "14g, 16g, 17g, 18g, 19g, 20g, 21g, 22g, 24g",
        ],
      },
      {
        name: "Catéter Periférico Advantive",
        description: "Catéteres periféricos Radiopaque con longitudes específicas.",
        items: [
          "14g x 11 mm", "16g x 51 mm", "18g x 32 mm",
          "20g x 32 mm", "22g x 25 mm", "24g x 20 mm",
        ],
      },
    ],
  },
  {
    id: "varios",
    name: "OTRAS MARCAS",
    description: "Arrow (CVC), Drenovac, Glucoderm, DuoDERM, Baby Sleeper, Aspi-Tract, MTG y más.",
    category: "Misceláneos",
    gradient: "from-[#2a2a2a] to-[#4a4a6b]",
    families: [
      {
        name: "Arrow — Catéter Venoso Central",
        description: "CVC 5 FR 3 vías y 7 FR 3 vías.",
        items: ["Catéter venoso central 5 FR, 3 vías", "Catéter venoso central 7 FR, 3 vías"],
      },
      {
        name: "MTG — Guantes de Nitrilo Cirugía",
        description: "Guantes de nitrilo para cirugía #6 a #8.5.",
        items: ["#6", "#6.5", "#7", "#7.5", "#8", "#8.5"],
      },
      {
        name: "Drenovac — Drenaje",
        description: "Equipos de drenaje esterilizados.",
        items: ["Equipo de drenaje con aguja 1/4", "Equipo de drenaje con aguja 1/8"],
      },
      {
        name: "Glucoderm / Aspi-Tract",
        description: "Antisépticos y sistemas de succión cerrada.",
        items: [
          "Gluconato clorhexidina 26 ml / 3 ml",
          "Succión cerrada neonatal 6 FR / 8 FR",
          "Succión cerrada adulto 10 FR a 16 FR",
        ],
      },
      {
        name: "Protec / DuoDERM / Baby Sleeper",
        description: "Apósitos especializados, pediátricos y varios.",
        items: [
          "Venda Huata 5 / 10 / 15 cm x 5 m",
          "DuoDERM CGF 10x10 / 20x20 cm",
          "DuoDERM Extra Thin 10x10 cm",
          "Antifaz fototerapia pretérmino / prematuro",
        ],
      },
      {
        name: "Varios — Consumibles Generales",
        description: "Artículos misceláneos de diversas marcas.",
        items: [
          "Dignity — Pañal sin elástico 10 piezas",
          "Accu-Chek — Ver sección Diagnóstico",
          "Farmeya — Agua oxigenada 480/960 ml",
          "Alcohol 70% azul / 96% rojo / galón 20 L",
          "Cotton's — Cottonoides 13 cm x 13/73 m",
          "Pleurovac adulto / pediátrico",
          "TUK — Tela adhesiva micropore 12 piezas",
        ],
      },
    ],
  },
];

export function getBrandById(id: string): Brand | undefined {
  return brands.find((b) => b.id === id);
}

export function getBrandsByCategory(category: BrandCategory): Brand[] {
  return brands.filter((b) => b.category === category);
}

export function getTotalProducts(brand: Brand): number {
  return brand.families.reduce((sum, f) => sum + f.items.length, 0);
}
