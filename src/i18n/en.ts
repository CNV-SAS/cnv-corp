import type { Translations } from './es';

export const en: Translations = {

  // 1. RUTAS INTERNAS (Para navegación e i18n)
  routes: {
    home: '/en/',
    paradigm: '/en/paradigm',
    operations: '/en/care',
    training: '/en/learning',
    research: '/en/research',
    about: '/en/about',
    contact: '/en/contact',
    privacy: '/en/privacy-policy',
    terms: '/en/terms',
  },

  // 2. ENLACES EXTERNOS (Subdominios estáticos)
  external_links: {
    atlas: 'https://atlas.cnvcorp.com',
    academy: 'https://lms.cnvcorp.com',
    obbia: 'https://obbia.cnvcorp.com',
  },

  // 3. PÁGINA 404 (No encontrada)
  not_found: {
    title: '404',
    subtitle: 'Page not found',
    body: 'The ANI-BIS-E model is accurate, but it appears this route does not exist within our ecosystem.',
    back_home: 'Back to homepage',
  },

  // SEO
  seo: {
    title: 'Connected Nutrition Ventures — New Health Paradigm',
    description: 'CNV is a business ecosystem operating a health model based on the functional measurement of the biological system.'
  },

  nav: {
    paradigma: 'Paradigm',
    operacion: 'Operations',
    formacion: 'Training',
    investigacion: 'Research',
    nosotros: 'About',
    cta: 'Join CNV Network',
  },

  hero: {
    tag: 'New Health Paradigm',
    title: 'Revolutionizing how health is measured worldwide',
    subtitle: 'What if we could prevent disease before it becomes visible?',
    cta_primary: 'Join CNV Network',
    cta_secondary: 'See how it works',
  },

  paradigm: {
    tag: 'The problem',
    title: 'Traditional medicine acts when damage is already visible',
    body: 'Functional alterations precede structural damage. CNV operates in the interval between function and disease — where intervention is still possible and reversible.',
    metric1_val: '10–15',
    metric1_label: 'years of functional window before diagnosis',
    metric2_val: '100%',
    metric2_label: 'of structural damage was first functional',
    link: 'Learn about the paradigm →',
  },

  anibise: {
    tag: 'Care model',
    title: 'ANI-BIS-E: Informed Nutrition based on Bioelectrical Impedance Spectroscopy and Epigenetics',
    subtitle: 'The model transforms bioelectrical data into structured clinical decisions.',
    steps: [
      { num: '01', title: 'Measurement', body: 'Bioelectrical Impedance Spectroscopy (BIS) at 1 kHz–1 MHz. Captures cellular biophysical state in real time.' },
      { num: '02', title: 'Analysis', body: 'Cole–Cole model. Parameters: Re, Ri, R∞, Capacitance. Indices IFC, IRC, IEHH, ISCM-BIS, EB-BIS.' },
      { num: '03', title: 'Interpretation', body: 'Bioelectrical maps. 81 phenotypes. Temporal trajectory of the biological system.' },
      { num: '04', title: 'Decision', body: 'Nutritional and lifestyle intervention. Longitudinal monitoring. Always under professional criteria.' },
    ],
  },

  ecosystem: {
    tag: 'Ecosystem',
    title: 'A system that produces health from data',
    subtitle: 'CNV is not a company, it is a system. Three functions connected by a core.',
    lines: [
      {
        id: 'care',
        name: 'CNV Care',
        color: '#2563eb',
        role: 'Operations',
        description: 'Operational line responsible for implementing, supporting, and controlling the ANI-BIS-E model in real care contexts.',
        link: '/en/operations',
        cta: 'Learn about CNV Care',
      },
      {
        id: 'learning',
        name: 'CNV Learning',
        color: '#0a76a4',
        role: 'Training',
        description: 'Academic line responsible for training, certification, and standardizing the talent that operates the new paradigm.',
        link: '/en/training',
        cta: 'Learn about CNV Learning',
      },
      {
        id: 'research',
        name: 'CNV Research',
        color: '#00a388',
        role: 'Research',
        description: 'Scientific line and technical authority of the ecosystem. Design, validation and evolution of the ANI-BIS-E model.',
        link: '/en/research',
        cta: 'Learn about CNV Research',
      },
    ],
  },

  audiences: {
    tag: 'Join the ecosystem',
    title: 'What is your profile?',
    subtitle: 'Access to the CNV ecosystem is conditioned by profile. Each path is different.',
    profiles: [
      {
        id: 'professional',
        icon: '⚕',
        title: 'I am a health professional',
        description: 'Nutritionist, functional physician or other professional with active practice. I want to implement the ANI-BIS-E model.',
        cta: 'Apply to the model',
        highlight: true,
      },
      {
        id: 'institution',
        icon: '🏛',
        title: 'I represent an institution',
        description: 'Clinic, hospital, company or organization interested in adopting the model within its structure.',
        cta: 'Talk to the team',
        highlight: false,
      },
      {
        id: 'patient',
        icon: '🧬',
        title: 'I seek care under the model',
        description: 'I am a patient and want to access a certified professional who operates the ANI-BIS-E model.',
        cta: 'Find an operator',
        highlight: false,
      },
    ],
  },

  exclusivity: {
    tag: 'Exclusive access',
    title: 'This model is not for everyone',
    subtitle: 'To maintain scientific integrity and the prestige of the CNV ecosystem, we require rigor from our network of professionals.',
    requirements: [
      'Be a validated health professional',
      'Have active practice with current patients',
      'Proven ability to conduct rigorous longitudinal follow-ups',
      'Full ethical commitment to a model guided by proven protocols',
    ],
  },

  process: {
    tag: 'Onboarding process',
    title: 'Four structured steps',
    subtitle: 'The process is designed to validate the professionals suitability and ensure rigorous implementation of the model.',
    steps: [
      { num: '01', title: 'Application', body: 'Submit your practice information and current patient reach for evaluation.' },
      { num: '02', title: 'Profile evaluation', body: 'Our team verifies whether you meet the baseline requirements to successfully operate the model.' },
      { num: '03', title: 'Technical training', body: 'Complete the diploma program and certification required to operate the model under the new paradigm.' },
      { num: '04', title: 'Clinical implementation', body: 'Start operating the model with CNV team support and full access to the Atlas platform.' },
    ],
  },

  benefits: {
    tag: 'What you receive',
    title: 'A model designed to improve how you evaluate and decide',
    items: [
      { title: 'Clinical Model', body: 'Systematized structure to evaluate and interpret patient functional status.' },
      { title: 'BIS Technology', body: 'Bioelectrical Impedance Spectroscopy equipment (Biody) on loan. No capital investment required.' },
      { title: 'Certification', body: 'Structured training and CNV certification endorsed by Universidad Autónoma de Coahuila (Mexico).' },
      { title: 'Atlas Platform', body: 'Monitoring software, body result visualization and integrated patient management.' },
    ],
  },

// INSTITUTIONAL PARTNERS AND FINAL CTA (Traducido)
  partners: {
    tag: 'Institutional Partners'
  },
  final_cta: {
    title: 'The system is ready.',
    highlight: 'Are you?',
    subtitle: 'The CNV operator network grows under strict criteria of scientific rigor and professional commitment.',
    button: 'Apply to the model',
    secondary_button: 'Learn the paradigm'
  },

  contact: {
    tag: 'Contact',
    title: 'Join CNV Network',
    subtitle: 'Tell us about your profile. We respond in less than 48 hours.',
    form: {
      profile_label: 'You are',
      profile_options: ['Health professional', 'Institution', 'Patient / Seeking care'],
      name: 'Full name',
      email: 'Email address',
      profession: 'Profession / specialty',
      institution: 'Institution name',
      country: 'Country',
      message: 'Tell us about your current practice',
      message_institution: 'Tell us about your organization',
      message_patient: 'What are you looking for?',
      submit: 'Send request',
      sending: 'Sending...',
      response_time: '< 48h response',
      success: 'Request received. We will be in touch shortly.',
      success_subtitle: 'We will respond within 48 hours.',
      error: 'Something went wrong. Please try again.',
    },
  },

  footer: {
    tagline: 'A system that produces health from data.',
    links_system: 'System',
    links_legal: 'Legal',
    ecosystem_title: 'Ecosystem',
    subdomain_atlas: 'Atlas — Operational platform',
    subdomain_academy: 'CNV Learning Academy',
    subdomain_obbia: 'ObBIA-Latam',
    access_title: 'Access',
    privacy: 'Privacy Policies',
    terms: 'Use Terms',
    copyright: '© 2026 Connected Nutrition Ventures. All rights reserved.',
  },

  pages: {
    paradigma: {
      tag: 'Scientific foundation',
      title: 'A new health paradigm',
      hero_body: 'Conventional medicine intervenes when damage is already observable. CNV operates at a different level: it measures function before disease exists.',
    },
    operacion: {
      tag: 'CNV Care',
      title: 'ANI-BIS-E model operations',
      hero_body: 'CNV Care is the operational line responsible for implementing, supporting, and controlling the ANI-BIS-E healthcare model in real contexts.',
    },
    formacion: {
      tag: 'CNV Learning',
      title: 'Training in the new paradigm',
      hero_body: 'CNV Learning translates scientific evidence and operational experience into applied knowledge, ensuring consistency and quality in model execution.',
    },
    investigacion: {
      tag: 'CNV Research',
      title: 'The scientific authority of the ecosystem',
      hero_body: 'CNV Research ensures the entire ecosystem operates under solid, coherent and updated scientific evidence. Design, validation and evolution of the ANI-BIS-E model.',
    },
  },
};
