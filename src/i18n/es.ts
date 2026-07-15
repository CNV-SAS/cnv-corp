export const es = {

  // 1. RUTAS INTERNAS (Para navegación e i18n)
  routes: {
    home: '/',
    paradigm: '/paradigma',
    care: '/operacion',
    learning: '/formacion',
    research: '/investigacion',
    about: '/nosotros',
    contact: '/contacto',
    integrantes: '/integrantes',
    noticias: '/noticias',
    privacy: '/politica-privacidad',
    terms: '/aviso-legal',
    cookies: '/politica-cookies',
    sitemap: '/mapa-del-sitio',
  },

  // 2. ENLACES EXTERNOS (Subdominios estáticos)
  external_links: {
    atlas: 'https://atlas.cnvsystem.com',
    academy: 'https://lms.cnvsystem.com',
    obbia: 'https://obbia.cnvsystem.com',
  },

  // 3. PÁGINA 404 (No encontrada)
  not_found: {
    title: '404',
    subtitle: 'Página no encontrada',
    body: 'El modelo ANI-BIS-E es preciso, pero parece que esta ruta no existe dentro de nuestro ecosistema.',
    back_home: 'Volver al inicio',
  },

  // SEO
  seo: {
  title: 'Connected Nutrition Ventures — Nuevo Paradigma en Salud',
  description: 'CNV es un ecosistema empresarial que opera un modelo de salud basado en la medición funcional del sistema biológico.'
  },

  // NAV
  nav: {
    paradigma: 'Paradigma',
    operacion: 'CNV Care',
    formacion: 'CNV Learning',
    investigacion: 'CNV Research',
    noticias: 'Noticias',
    nosotros: 'Nosotros',
    cta: 'Contáctanos',
    integrantes: 'Integrantes',
    contacto: 'Contáctanos',
    switch_lang: 'View in English',
  },

  // HERO
  hero: {
    tag: 'Nuevo Paradigma en Salud',
    title: 'Revolucionamos la forma en que se mide la salud en el mundo',
    subtitle: '¿Y si pudiéramos prevenir enfermedades antes de que se hagan visibles?',
    cta_primary: 'Contáctanos',
    cta_secondary: 'Ver cómo funciona',
  },

  // PARADIGM TEASER
  paradigm: {
    tag: 'El problema',
    title: 'La medicina tradicional actúa cuando el daño ya es visible',
    body: 'Las alteraciones funcionales preceden al daño estructural. CNV opera en el intervalo entre función y enfermedad — donde la intervención aún es posible y reversible.',
    metric1_val: '10–15',
    metric1_label: 'años de ventana funcional antes del diagnóstico',
    metric2_val: '100%',
    metric2_label: 'de los daños estructurales fueron primero funcionales',
    link: 'Conocer el paradigma →',
  },

  // ANI-BIS-E
  anibise: {
    tag: 'Modelo de atención',
    title: 'ANI-BIS-E: Alimentación y Nutrición Informada basada en Bioimpedancia Espectroscópica y Epigenética',
    subtitle: 'El modelo convierte datos bioeléctricos en decisiones clínicas estructuradas.',
    steps: [
      { num: '01', title: 'Medición', body: 'Bioimpedancia Espectroscópica (BIS) a 1 kHz–1 MHz. Captura el estado biofísico celular en tiempo real.' },
      { num: '02', title: 'Análisis', body: 'Modelo Cole–Cole. Parámetros: Re, Ri, R∞, Capacitancia. Índices IFC, IRC, IEHH, ISCM-BIS, EB-BIS.' },
      { num: '03', title: 'Interpretación', body: 'Mapas bioeléctricos. 81 fenotipos. Trayectoria temporal del sistema biológico.' },
      { num: '04', title: 'Decisión', body: 'Intervención nutricional y de estilo de vida. Seguimiento longitudinal. Siempre bajo criterio profesional.' },
    ],
  },

  // ECOSYSTEM
  ecosystem: {
    tag: 'Ecosistema',
    title: 'Un sistema que produce salud a partir de datos',
    subtitle: 'CNV no es una empresa, es un sistema. Tres funciones conectadas por un núcleo.',
    lines: [
      {
        id: 'care',
        name: 'CNV Care',
        color: '#2563eb',
        role: 'Operación',
        description: 'Línea operativa responsable de la implementación, soporte y control del modelo ANI-BIS-E en contextos reales de atención.',
        link: '/operacion',
        cta: 'Conocer CNV Care',
      },
      {
        id: 'learning',
        name: 'CNV Learning',
        color: '#0a76a4',
        role: 'Formación',
        description: 'Línea académica encargada de la formación, certificación y estandarización del talento humano que opera el nuevo paradigma.',
        link: '/formacion',
        cta: 'Conocer CNV Learning',
      },
      {
        id: 'research',
        name: 'CNV Research',
        color: '#00a388',
        role: 'Investigación',
        description: 'Línea científica y autoridad técnica del ecosistema. Diseño, validación y evolución del modelo ANI-BIS-E.',
        link: '/investigacion',
        cta: 'Conocer CNV Research',
      },
    ],
  },

  // AUDIENCES
  audiences: {
    tag: 'Únete al ecosistema',
    title: '¿Cuál es tu perfil?',
    subtitle: 'El acceso al ecosistema CNV está condicionado al perfil. Cada ruta es diferente.',
    profiles: [
      {
        id: 'professional',
        icon: '⚕',
        title: 'Soy profesional de salud',
        description: 'Nutricionista, médico funcional u otro profesional con práctica activa. Quiero implementar el modelo ANI-BIS-E.',
        cta: 'Postular al modelo',
        highlight: true,
      },
      {
        id: 'institution',
        icon: '🏛',
        title: 'Represento una institución',
        description: 'Clínica, hospital, empresa u organización interesada en adoptar el modelo dentro de sus estructuras.',
        cta: 'Hablar con el equipo',
        highlight: false,
      },
      {
        id: 'patient',
        icon: '🧬',
        title: 'Busco atención bajo el modelo',
        description: 'Soy paciente y quiero acceder a un profesional certificado que opere el modelo ANI-BIS-E.',
        cta: 'Encontrar un operador',
        highlight: false,
      },
    ],
  },

  // EXCLUSIVITY (professional filter)
  exclusivity: {
    tag: 'Acceso exclusivo',
    title: 'Este modelo no es para todo el mundo',
    subtitle: 'Para mantener la integridad científica y el prestigio del ecosistema CNV, requerimos rigurosidad de nuestra red de profesionales.',
    requirements: [
      'Ser un profesional de salud validado',
      'Tener práctica activa con pacientes actuales',
      'Capacidad probada de hacer seguimientos longitudinales rigurosos',
      'Compromiso total ético con un modelo guiado por protocolos probados',
    ],
  },

  // PROCESS
  process: {
    tag: 'Proceso de incorporación',
    title: 'Cuatro pasos estructurados',
    subtitle: 'El proceso está diseñado para validar la idoneidad del profesional y garantizar una implementación rigurosa del modelo.',
    steps: [
      { num: '01', title: 'Aplicación', body: 'Postula tu consultorio o institución enviando información sobre tu práctica actual y alcance de pacientes.' },
      { num: '02', title: 'Evaluación del perfil', body: 'Nuestro equipo verifica si cumples con los requerimientos base para operar el modelo exitosamente.' },
      { num: '03', title: 'Formación técnica', body: 'Aprobación del diplomado y certificación necesaria para operar el modelo bajo el nuevo paradigma.' },
      { num: '04', title: 'Implementación clínica', body: 'Empieza a operar el modelo con el acompañamiento del equipo CNV y acceso completo a la plataforma Atlas.' },
    ],
  },

  // BENEFITS
  benefits: {
    tag: 'Lo que recibes',
    title: 'Un modelo diseñado para mejorar cómo evalúas y decides',
    items: [
      { title: 'Modelo Clínico', body: 'Estructura sistematizada para evaluar e interpretar el estado funcional del paciente.' },
      { title: 'Tecnología BIS', body: 'Equipo de Bioimpedancia Espectroscópica (Biody) en comodato. Sin inversión de capital.' },
      { title: 'Certificación', body: 'Formación estructurada y certificación CNV con aval de una institución universitaria nacional o internacional.' },
      { title: 'Plataforma Atlas', body: 'Software de seguimiento, visualización de resultados y gestión de pacientes integrado.' },
    ],
  },

  final_cta: {
    title: 'El sistema está listo.',
    highlight: '¿Lo estás tú?',
    subtitle: 'La red de operadores CNV crece bajo criterios estrictos de rigor científico y compromiso profesional.',
    button: 'Postular al modelo',
    secondary_button: 'Conocer el paradigma'
  },

  // CONTACT FORM
  contact: {
    tag: 'Contacto',
    title: 'Hablemos',
    subtitle: 'Escríbenos sobre cualquier tema. Cuéntanos quién eres para orientar tu mensaje a la persona indicada. Respondemos en menos de 48 horas.',
    quick_links: [
      { id: 'care', title: 'CNV Care', desc: 'Implementación del modelo ANI-BIS-E con profesionales e instituciones', color: '#2563eb', color_class: 'cnv-execute' },
      { id: 'learning', title: 'CNV Learning', desc: 'Formación, diplomado y certificación para operadores del modelo', color: '#0a76a4', color_class: 'cnv-transfer' },
      { id: 'research', title: 'CNV Research', desc: 'Ciencia, investigación y evolución del modelo', color: '#00a388', color_class: 'cnv-generate' }
    ],
    info: {
      heading: 'Información de contacto',
      email_label: 'Correo',
      email: 'contacto@cnvsystem.com',
      whatsapp_label: 'WhatsApp',
      whatsapp: '+57 300 000 0000',
      whatsapp_link: 'https://wa.me/573000000000',
      address_label: 'Dirección',
      address: 'Medellín, Colombia',
      hours_label: 'Horario de atención',
      hours: 'Lunes a viernes, 8:00 a. m. – 6:00 p. m. (COT)',
      social_label: 'Síguenos',
      linkedin_label: 'LinkedIn',
      linkedin: 'https://www.linkedin.com/',
    },
    form: {
      profile_label: '¿Quién eres?',
      profile_options: ['Profesional de la salud', 'Institución / Universidad', 'Paciente', 'Otro tema'],
      name: 'Nombre completo',
      email: 'Correo electrónico',
      profession: 'Profesión / especialidad',
      institution: 'Nombre de la institución',
      country: 'País',
      message: 'Cuéntanos más sobre tu práctica actual',
      message_institution: 'Cuéntanos sobre tu organización',
      message_patient: '¿Qué estás buscando?',
      legal_consent: 'Autorizo de manera previa, expresa e informada a CONNECTED NUTRITION VENTURES S.A.S. para el tratamiento de mis datos personales con la finalidad de atender mi solicitud y enviarme información relacionada con sus servicios, conforme a su [Política de Tratamiento de Datos Personales]. Declaro que conozco mis derechos como titular de la información.',
      legal_error: 'Debe autorizar el tratamiento de datos personales para continuar.',
      submit: 'Enviar solicitud',
      sending: 'Enviando...',
      response_time: '< 48h respuesta',
      success: 'Solicitud recibida. Nos comunicamos pronto.',
      success_subtitle: 'Responderemos en menos de 48 horas.',
      error: 'Algo salió mal. Intenta de nuevo.',
    },
  },

  // FOOTER
  footer: {
    tagline: 'Un sistema que produce salud a partir de datos.',
    links_system: 'Sistema',
    links_legal: 'Legal',
    ecosystem_title: 'Ecosistema',
    subdomain_atlas: 'Atlas — Plataforma operativa',
    subdomain_academy: 'Academia CNV Learning',
    subdomain_obbia: 'ObBIA-Latam',
    access_title: 'Acceso',
    privacy: 'Política de privacidad',
    terms: 'Aviso legal y Términos de uso',
    cookies: 'Política de cookies',
    sitemap: 'Mapa del sitio',
    copyright: '© 2026 Connected Nutrition Ventures. Todos los derechos reservados.',
    coming_soon: 'Próximamente',
    contact_title: 'Contacto',
    address_label: 'Dirección',
    address: 'Cra 79 No. 46-36, La Floresta, Medellín, Antioquia, Colombia',
    email_label: 'E-mail',
    email: 'gerencia@cnvsystem.com',
    phone_label: 'Teléfono',
    phone: '+57 321 642 8280',
    phone_link: '+573216428280',
    nit_label: 'NIT',
    nit: '902.045.562-3',
  },

  cookies_banner: {
    text: 'Este sitio web utiliza cookies técnicas necesarias para su funcionamiento y cookies analíticas para mejorar la experiencia de navegación. Puede aceptar o rechazar las cookies analíticas.',
    accept: 'Aceptar todas',
    reject: 'Rechazar analíticas',
    manage: 'Gestionar cookies'
  },

  // INTERFAZ LEGAL
  legal_ui: {
    last_updated: 'Última actualización:',
    expand_all: 'Expandir todo',
    collapse_all: 'Contraer todo',
    download_pdf: 'Descargar PDF'
  },

  // PAGES
  pages: {
    paradigma: {
      tag: 'Fundamento científico',
      title: 'Un nuevo paradigma en salud',
      hero_body: 'La medicina convencional interviene cuando el daño ya es observable. CNV opera en un nivel diferente: mide función antes de que exista enfermedad.',
      health_def: {
        title: 'La salud no es la ausencia de enfermedad',
        p1: 'En el modelo CNV, la salud se define como un <strong>estado de organización funcional del sistema biológico</strong>, donde las células, tejidos y sistemas mantienen su capacidad de adaptación, regulación y coherencia.',
        p2: 'Un individuo puede no presentar enfermedad clínica visible, pero sí encontrarse en un estado de disfunción funcional. Esta es la distinción fundamental:',
        quote: 'ausencia de enfermedad ≠ estado óptimo de salud',
      },
      // ... (busca el bloque the_gap y reemplázalo por este)
      the_gap: {
        tag: 'El intervalo crítico',
        title: 'Las alteraciones funcionales preceden al daño estructural',
        phases: [
          { phase: '01. Carga Alostática', title: 'El origen del desequilibrio', body: 'Estilos de vida, alimentación, hábitos de sueño y consumo de sustancias inician procesos fisiopatológicos silenciosos en el organismo.', color: '#00a388' },
          { phase: '02. Impacto Celular', title: 'Alteración Bioeléctrica', body: 'Se compromete la función celular, alterando drásticamente su capacidad natural de conducir electricidad y condensar energía.', color: '#78be34' },
          { phase: '03. La Ventana CNV', title: 'Detección antes del daño', body: 'Detectamos estas deficiencias funcionales de forma temprana, mucho antes de que afecten la estructura corporal, que es donde opera la medicina tradicional.', color: '#0a76a4' },
        ]
      },
      bioelectric: {
        tag: 'Medicina bioeléctrica',
        title: 'El cuerpo humano es un sistema biofísico expresado eléctricamente',
        p1: 'La función biológica se expresa mediante flujos eléctricos, comportamiento de membranas celulares y distribución de cargas y fluidos. Estas variables cambian <em>antes</em> que las estructuras.',
        p2: 'La Bioimpedancia Espectroscópica (BIS) captura estas señales a través de un amplio espectro de frecuencias (1 kHz – 1 MHz), permitiendo inferir el estado funcional del sistema con precisión clínica.',
        params: [
          { label: 'Re', desc: 'Resistencia extracelular' },
          { label: 'Ri', desc: 'Resistencia intracelular' },
          { label: 'R∞', desc: 'Resistencia a frecuencia infinita' },
          { label: 'C', desc: 'Capacitancia de membrana' },
        ]
      },
      cta: {
        title: '¿Listo para operar bajo el nuevo paradigma?',
        subtitle: 'Conoce cómo CNV implementa este modelo a través de sus tres líneas de acción.',
        btn_primary: 'Conocer CNV Care'
      }
    },
    operacion: {
      tag: 'CNV Care',
      title: 'Operación del modelo ANI-BIS-E',
      hero_body: 'CNV Care implementa, soporta y controla el modelo de atención ANI-BIS-E en contextos reales de atención en salud y nutrición.',
      role: {
        title: 'Habilitador, no prestador',
        body: 'CNV Care no actúa como prestador asistencial directo. Opera como <strong>habilitador, supervisor y garante</strong> de la correcta aplicación del modelo por parte de profesionales e instituciones aliadas.',
        items: [
          { label: 'Implementación', desc: 'Diseño y ejecución de estrategias de entrada y operación: comodato, contratos, licenciamiento operativo.' },
          { label: 'Soporte', desc: 'Acompañamiento técnico y operativo continuo a los operadores certificados del modelo.' },
          { label: 'Control', desc: 'Auditoría, seguimiento y verificación del cumplimiento de los estándares del modelo de atención.' },
          { label: 'Retroalimentación', desc: 'Flujo continuo de información operativa hacia CNV Research para evolución del modelo.' },
        ]
      },
      clinical_phases: {
        tag: 'Modelo de atención',
        title: 'Cuatro fases clínicas estructuradas',
        steps: [
          { num: '01', title: 'Evaluación', body: 'Recolección de información del paciente. Encuesta clínica y contextual. Medición mediante Bioimpedancia Espectroscópica.' },
          { num: '02', title: 'Diagnóstico funcional', body: 'Análisis de información mediante ANI-BIS-E. Generación de índices y mapas bioeléctricos. Identificación del estado funcional.' },
          { num: '03', title: 'Intervención', body: 'Definición de estrategias personalizadas de alimentación, nutrición y estilo de vida. Recomendación de nutracéuticos cuando se requiera.' },
          { num: '04', title: 'Seguimiento', body: 'Reevaluación periódica. Nuevas mediciones BIS. Análisis de evolución y trayectoria funcional longitudinal.' },
        ]
      },
      atlas: {
        tag: 'Infraestructura tecnológica',
        title: 'Atlas — La plataforma operativa del modelo',
        body: 'Atlas es el sistema central de operación del modelo ANI-BIS-E. Permite al profesional certificado guiar la aplicación paso a paso, capturar información clínica, gestionar pacientes y generar reportes estructurados.',
        features: [
          'Gestión integral de pacientes',
          'Generación de índices y mapas bioeléctricos',
          'Reportes clínicos y operativos',
          'Seguimiento longitudinal',
          'Apoyo a la toma de decisiones clínicas'
        ],
        link_text: 'Acceder a Atlas (solo operadores certificados)'
      }
    },
    formacion: {
      tag: 'CNV Learning',
      title: 'Formación en el nuevo paradigma',
      hero_body: 'CNV Learning traduce la evidencia científica y la experiencia operativa en conocimiento aplicado, garantizando consistencia y calidad en la ejecución del modelo.',
      mission: {
        tag: 'Más allá de la educación tradicional',
        title: 'No solo enseñamos. Alineamos y certificamos.',
        p1: 'CNV Learning prepara y alinea a las personas que operan el ecosistema CNV bajo un mismo marco conceptual, técnico y ético. El objetivo no es solo transferir conocimiento, sino garantizar que cada operador del modelo reproduzca los estándares científicos con precisión.',
        p2: 'La certificación tiene aval oficial de una <strong>institución universitaria nacional o internacional</strong>.',
        pillars: [
          { label: 'Formación técnica', desc: 'Medicina bioeléctrica y modelo ANI-BIS-E', color: '#0a76a4' },
          { label: 'Certificación', desc: 'Con aval universitario oficial', color: '#0a76a4' },
          { label: 'Recertificación', desc: 'Actualización continua del modelo', color: '#0a76a4' },
          { label: 'Acompañamiento', desc: 'Soporte durante la implementación', color: '#0a76a4' },
        ]
      },
      curriculum: {
        tag: 'Contenidos formativos',
        title: 'Lo que aprende un operador certificado CNV',
        modules: [
          { num: '01', title: 'Fundamentos del paradigma', body: 'Definición funcional de salud. Medicina bioeléctrica. Limitaciones de la medicina convencional. Marco científico BIS.' },
          { num: '02', title: 'Bioimpedancia Espectroscópica', body: 'Principios técnicos de BIS. Modelo Cole–Cole. Parámetros bioeléctricos. Protocolos de medición estandarizados.' },
          { num: '03', title: 'Modelo ANI-BIS-E', body: 'Interpretación de índices funcionales. Mapas bioeléctricos. 81 fenotipos. Edad biológica celular.' },
          { num: '04', title: 'Intervención clínica', body: 'Toma de decisiones basada en datos bioeléctricos. Protocolos nutricionales. Seguimiento longitudinal.' },
          { num: '05', title: 'Plataforma Atlas', body: 'Operación completa del sistema. Gestión de pacientes. Generación e interpretación de reportes.' },
          { num: '06', title: 'Ética y protocolo', body: 'Marco ético del operador CNV. Estándares de calidad. Responsabilidades y criterios de la red.' },
        ]
      },
      academy_cta: {
        title: 'La academia completa está en un subdominio dedicado',
        body: 'El LMS de CNV Learning, los programas completos, horarios, inscripciones y recursos formativos se encuentran en la plataforma de academia.',
        primary_btn: 'Ir a la Academia CNV',
        secondary_btn: 'Consultar disponibilidad'
      }
    },
    investigacion: {
      tag: 'CNV Research',
      title: 'La autoridad científica del ecosistema',
      hero_body: 'CNV Research asegura que todo el ecosistema opere bajo evidencia científica sólida, coherente y actualizada. Diseño, validación y evolución del modelo ANI-BIS-E.',
      mandate: {
        title: 'CNV Research define qué es el modelo, cómo evoluciona y bajo qué reglas opera',
        body: 'La dirección científica del ecosistema está a cargo de un equipo especializado, que opera a través del <strong>Observatorio Latinoamericano de Bioimpedancia (ObBIA-Latam)</strong> como plataforma de análisis, validación y producción de conocimiento.',
        items: [
          { label: 'Diseño y validación', desc: 'Diseño, validación y evolución continua del modelo científico ANI-BIS-E con base en evidencia real.' },
          { label: 'Investigación clínica', desc: 'Investigación clínica y aplicada basada en data real del ecosistema CNV a nivel latinoamericano.' },
          { label: 'Estandarización', desc: 'Estandarización técnica, metodológica y de interpretación para toda la red de operadores.' },
          { label: 'Consultoría científica', desc: 'Consultoría científica especializada en medicina bioeléctrica y nutrición funcional.' },
          { label: 'Producción editorial', desc: 'Divulgación científica, publicaciones y posicionamiento del modelo bajo el nuevo paradigma de salud.' },
        ]
      },
      obbia: {
        tag: 'Iniciativa científica internacional',
        title: 'Observatorio Latinoamericano de Bioimpedancia',
        p1: 'ObBIA-Latam es la capa operativa de análisis y producción de conocimiento de CNV Research. Concentra la data clínica del ecosistema, la valida científicamente y produce el conocimiento que mantiene al modelo en la frontera de la evidencia.',
        p2: 'Publicaciones, libros, bases de datos, reportes técnicos y divulgación científica viven en el subdominio del observatorio.',
        btn_text: 'Ir al Observatorio ObBIA-Latam',
        stats: [
          { val: 'BIS', label: 'Bioimpedancia Espectroscópica como eje metodológico' },
          { val: 'LATAM', label: 'Alcance latinoamericano en expansión' },
          { val: '81', label: 'Fenotipos clasificados en el modelo ANI-BIS-E' },
          { val: 'Cole–Cole', label: 'Modelo biofísico de referencia internacional' },
        ]
      },
      framework: {
        tag: 'Marco científico',
        title: 'Las capas del modelo bajo evidencia',
        layers: [
          { ref: 'Fundamento', title: 'Medicina bioeléctrica', body: 'Estudio de la función biológica a través de la organización biofísica y la expresión eléctrica del sistema vivo. Base de todo el modelo.' },
          { ref: 'Metodología', title: 'Bioimpedancia Espectroscópica (BIS)', body: 'Metodología biofísica que analiza la respuesta eléctrica de tejidos vivos a un espectro de 1 kHz a 1 MHz. Motor de captura de información.' },
          { ref: 'Modelo', title: 'Modelo Cole–Cole', body: 'Modelo matemático subyacente del que se derivan Re, Ri, R∞ y Capacitancia de membrana. Permite la inferencia del estado funcional celular.' },
          { ref: 'Contexto', title: 'Epigenética aplicada', body: 'Estudio de cómo comportamiento y entorno (dieta, estrés, ejercicio) causan cambios que afectan la función génica sin alterar el ADN.' },
          { ref: 'Modelo', title: 'Composición corporal funcional', body: 'Jerarquía de 5 niveles (atómico, molecular, celular, tisular, corporal). Las alteraciones emergen desde niveles inferiores hacia los superiores.' },
          { ref: 'Salida', title: 'Índices funcionales', body: 'IFC, IRC, IEHH, ISCM-BIS, PABU, EB-BIS, IAE. Capas de interpretación organizadas en integridad celular, equilibrio sistémico y trayectoria temporal.' },
        ]
      },
      cta: {
        title: 'La ciencia que sustenta el modelo está disponible',
        subtitle: 'Publicaciones, reportes técnicos y recursos de investigación en el Observatorio Latinoamericano de Bioimpedancia.',
        btn_primary: 'Visitar ObBIA-Latam'
      }
    },
    nosotros: {
      tag: 'Quiénes somos',
      title: 'No somos una empresa.',
      title_highlight: 'Somos un sistema.',
      hero_body: 'CNV nació de una pregunta simple: ¿por qué esperamos a que alguien enferme para intervenir? La respuesta derivó en un ecosistema empresarial construido para operar en el intervalo entre función y enfermedad.',
      problem: {
        tag: 'El punto de partida',
        title: 'El problema que nadie estaba resolviendo',
        p1: 'La medicina convencional es reactiva por diseño. Actúa cuando el daño ya es estructural, cuando la reversibilidad es limitada y cuando la ventana de intervención óptima ya pasó. No es un defecto del sistema — es su lógica fundacional.',
        p2: 'Lo que CNV identificó es que existe una ventana de entre 10 y 15 años antes de que una disfunción funcional se convierta en enfermedad clínica observable. Esa ventana es silenciosa, no genera síntomas, y la medicina tradicional no tiene las herramientas para verla.',
        p3: 'Nosotros construimos las herramientas para verla.',
        quote: '"CNV no es una empresa, es un sistema que produce salud a partir de datos."'
      },
      system: {
        tag: 'Cómo está construido',
        title: 'Un sistema con tres funciones y un núcleo',
        functions: [
          { color: '#00a388', name: 'CNV Research', role: 'Generación', body: 'La autoridad científica del ecosistema. Diseña, valida y hace evolucionar el modelo ANI-BIS-E. Nada entra al sistema sin evidencia.' },
          { color: '#0a76a4', name: 'CNV Learning', role: 'Transferencia', body: 'La línea académica. Traduce la evidencia en conocimiento aplicable. Forma y certifica a los operadores del modelo con rigor y aval institucional.' },
          { color: '#2563eb', name: 'CNV Care', role: 'Ejecución', body: 'La línea operativa. Implementa el modelo en la realidad clínica. Supervisa, audita y garantiza que cada operador mantenga los estándares del sistema.' },
          { color: '#78be34', name: 'CNV Data', role: 'Núcleo', body: 'La infraestructura central. Integra, organiza y activa todo el sistema. Aquí reside la lógica, la trazabilidad y la capacidad de escalar.' },
        ],
        flow_tag: 'Flujo del sistema',
        flow: ['Investigación genera conocimiento', 'Formación lo distribuye', 'Operación lo aplica']
      },
      principles: {
        tag: 'Principios de operación',
        title: 'Lo que guía cada decisión dentro del sistema',
        items: [
          { num: '01', title: 'Función antes que daño', body: 'Medimos lo que el cuerpo hace, no lo que ya falló. La intervención temprana es el único punto donde la reversibilidad es alta.' },
          { num: '02', title: 'Sin superficialidad', body: 'CNV no comunica bienestar genérico. Comunica estructura científica aplicada. Cada elemento del sistema responde a evidencia, no a tendencia.' },
          { num: '03', title: 'El color es semántico', body: 'Hasta nuestra identidad visual es funcional. Cada color representa una función dentro del sistema. No hay decoración sin significado.' },
          { num: '04', title: 'Red de rigor', body: 'La red de operadores CNV no es abierta. Cada profesional es evaluado, formado y certificado antes de implementar el modelo.' },
          { num: '05', title: 'Escalabilidad sin pérdida de coherencia', body: 'El sistema está diseñado para crecer a través de terceros sin sacrificar los estándares científicos que le dan sentido.' },
          { num: '06', title: 'Impacto medible', body: 'El propósito de CNV no es el bienestar abstracto. Es el impacto real y medible en el estado funcional de las personas y sus comunidades.' },
        ]
      },
      direction: {
        tag: 'Dirección científica',
        title: 'La ciencia detrás del sistema',
        p1: 'La dirección científica del ecosistema está a cargo de un equipo especializado, que opera a través del <strong>Observatorio Latinoamericano de Bioimpedancia (ObBIA-Latam)</strong> como plataforma de análisis, validación y producción de conocimiento.',
        p2: 'ObBIA-Latam garantiza que el modelo ANI-BIS-E se mantenga en la frontera de la evidencia científica en medicina bioeléctrica a nivel latinoamericano.',
        btn_research: 'Conocer CNV Research',
        btn_obbia: 'ObBIA-Latam'
      },
      cta: {
        title: '¿Quieres ser parte del sistema?',
        body: 'El ecosistema CNV crece a través de profesionales, instituciones y aliados que comparten el mismo rigor científico.',
        btn_paradigm: 'Conocer el paradigma'
      }
    },
    sitemap: {
      tag: 'Mapa del sitio',
      title: 'Todo el ecosistema CNV, en un solo lugar',
      hero_body: 'Encuentra rápidamente cualquier sección del sitio y resuelve las dudas más frecuentes sobre CNV, el modelo ANI BIS-E y la bioimpedancia espectroscópica.',
      map_title: 'Páginas del sitio',
      sec_ecosystem: 'El ecosistema',
      sec_company: 'La empresa',
      sec_observatory: 'Observatorio',
      sec_legal: 'Legal',
      faq_tag: 'Dudas comunes',
      faq_title: 'Preguntas frecuentes',
      faq_body: 'Las respuestas a lo que más nos preguntan pacientes, profesionales e instituciones.',
      faq: [
        { q: '¿Qué es CNV (Connected Nutrition Ventures)?', a: 'CNV es un ecosistema empresarial que opera un nuevo paradigma en salud: mide la función del sistema biológico antes de que aparezca la enfermedad. Se organiza en tres líneas —CNV Care (operación), CNV Learning (formación) y CNV Research (investigación)— conectadas por el modelo de atención ANI BIS-E.' },
        { q: '¿Qué es el modelo ANI BIS-E?', a: 'ANI BIS-E significa Alimentación y Nutrición Informada basada en Bioimpedancia Espectroscópica y Epigenética. Es un modelo de atención que convierte los datos bioeléctricos del cuerpo en decisiones clínicas estructuradas para prevenir e intervenir de forma temprana, siempre bajo criterio profesional.' },
        { q: '¿Qué es la bioimpedancia espectroscópica (BIS) y en qué se diferencia de una báscula de bioimpedancia común?', a: 'La BIS analiza la respuesta eléctrica de los tejidos en un amplio espectro de frecuencias (1 kHz a 1 MHz) y, mediante el modelo Cole-Cole, estima parámetros celulares como la resistencia y la capacitancia de membrana. A diferencia de una báscula doméstica (que usa una o pocas frecuencias), la BIS permite inferir el estado funcional de la célula con precisión clínica.' },
        { q: '¿Cómo puedo atenderme bajo el modelo ANI BIS-E?', a: 'La atención la brindan profesionales de la salud certificados por CNV. Escríbenos por los canales de contacto y te orientamos hacia un operador certificado del modelo cercano a ti.' },
        { q: 'Soy profesional de la salud, ¿cómo me uno a la red y me certifico?', a: 'A través de CNV Learning: se postula el consultorio o institución, se evalúa el perfil, se realiza el diplomado en Medicina Bioeléctrica y modelo ANI BIS-E con aval universitario, y se inicia la operación con acompañamiento y acceso a la plataforma Atlas. La red es selectiva y exige práctica clínica activa.' },
        { q: '¿Qué es el Observatorio OB-BIA LATAM?', a: 'El Observatorio Latinoamericano de Bioimpedancia (OB-BIA LATAM) es la capa científica de CNV Research: concentra y valida la data clínica del ecosistema, genera valores de referencia propios para población latinoamericana y produce publicaciones y reportes que mantienen el modelo en la frontera de la evidencia.' },
        { q: '¿La bioimpedancia reemplaza un diagnóstico médico?', a: 'No. ANI BIS-E estima el riesgo y orienta la intervención nutricional y de estilo de vida, pero no sustituye el juicio clínico ni constituye un diagnóstico definitivo. Siempre opera bajo la supervisión de un profesional de la salud.' },
        { q: '¿Qué es VITACELLEBIS?', a: 'Es la línea de nutracéuticos dirigidos del ecosistema CNV, formulada para apoyar las propiedades bioeléctricas de la célula dentro de la ruta de atención del modelo ANI BIS-E, cuando el profesional lo considera pertinente.' },
        { q: '¿Dónde están ubicados y cómo los contacto?', a: 'CNV está en la Cra 79 No. 46-36, La Floresta, Medellín, Antioquia, Colombia. Puedes escribir a gerencia@cnvsystem.com o llamar al +57 321 642 8280. Los datos completos aparecen al final de cada página.' },
      ],
    },
  },
} as const;

type DeepString<T> = {
  readonly [P in keyof T]: T[P] extends object 
    ? DeepString<T[P]> 
    : T[P] extends string 
      ? string 
      : T[P];
};

export type Translations = DeepString<typeof es>;