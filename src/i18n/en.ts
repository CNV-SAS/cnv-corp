import type { Translations } from './es';

export const en: Translations = {

  // 1. RUTAS INTERNAS (Para navegación e i18n)
  routes: {
    home: '/en/',
    paradigm: '/en/paradigm',
    care: '/en/care',
    learning: '/en/learning',
    research: '/en/research',
    about: '/en/about',
    contact: '/en/contact',
    privacy: '/en/privacy-policy',
    terms: '/en/legal-notice',
    cookies: '/en/cookies-policy',
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
    operacion: 'Care',
    formacion: 'Learning',
    investigacion: 'Research',
    nosotros: 'About',
    cta: 'Join CNV Network',
    switch_lang: 'Ver en Español',
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
        role: 'Care',
        description: 'Operational line responsible for implementing, supporting, and controlling the ANI-BIS-E model in real care contexts.',
        link: '/en/care',
        cta: 'Learn about CNV Care',
      },
      {
        id: 'learning',
        name: 'CNV Learning',
        color: '#0a76a4',
        role: 'Learning',
        description: 'Academic line responsible for training, certification, and standardizing the talent that operates the new paradigm.',
        link: '/en/learning',
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
      { title: 'Certification', body: 'Structured training and CNV certification endorsed by a national or international higher education institution.' },
      { title: 'Atlas Platform', body: 'Monitoring software, body result visualization and integrated patient management.' },
    ],
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
    title: 'Be part of CNV',
    subtitle: 'Tell us about your profile. We respond in less than 48 hours.',
    quick_links: [
      { id: 'care', title: 'CNV Care', desc: 'Implementation of the ANI-BIS-E model with professionals and institutions', color: '#2563eb', color_class: 'cnv-execute' },
      { id: 'learning', title: 'CNV Learning', desc: 'Training, diploma, and certification for model operators', color: '#0a76a4', color_class: 'cnv-transfer' },
      { id: 'research', title: 'CNV Research', desc: 'Science, research, and evolution of the model', color: '#00a388', color_class: 'cnv-generate' }
    ],
    form: {
      profile_label: 'You are',
      profile_options: ['Health professional', 'Institution', 'Patient / Seeking care'],
      name: 'Full name',
      email: 'Email address',
      profession: 'Profession / Specialty',
      institution: 'Institution name',
      country: 'Country',
      message: 'Tell us more about your current practice',
      message_institution: 'Tell us about your organization',
      message_patient: 'What are you looking for?',
      legal_consent: 'I give my prior, express, and informed authorization to CONNECTED NUTRITION VENTURES S.A.S. for the processing of my personal data in order to address my request and send me information related to its services, in accordance with its [Personal Data Processing Policy]. I declare that I know my rights as a data subject.',
      legal_error: 'You must authorize the processing of personal data to continue.',
      submit: 'Submit application',
      sending: 'Sending...',
      response_time: '< 48h response',
      success: 'Application received. We will contact you soon.',
      success_subtitle: 'We will respond in less than 48 hours.',
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
    cookies: 'Cookies Policy',
    copyright: '© 2026 Connected Nutrition Ventures. All rights reserved.',
    coming_soon: 'Coming soon',
  },

  cookies_banner: {
    text: 'This website uses necessary technical cookies for its operation and analytical cookies to improve the browsing experience. You can accept or reject analytical cookies.',
    accept: 'Accept all',
    reject: 'Reject analytics',
    manage: 'Manage cookies'
  },

  // INTERFAZ LEGAL
  legal_ui: {
    last_updated: 'Last updated:',
    expand_all: 'Expand all',
    collapse_all: 'Collapse all',
    download_pdf: 'Download PDF'
  },

  pages: {
    paradigma: {
      tag: 'Scientific Foundation',
      title: 'A New Paradigm in Health',
      hero_body: 'Conventional medicine intervenes when damage is already observable. CNV operates on a different level: measuring function before disease exists.',
      health_def: {
        title: 'Health is Not the Absence of Disease',
        p1: 'In the CNV model, health is defined as a <strong>state of functional organization of the biological system</strong>, where cells, tissues, and systems maintain their capacity for adaptation, regulation, and coherence.',
        p2: 'An individual may not present visible clinical disease, yet still be in a state of functional dysfunction. This is the fundamental distinction:',
        quote: 'absence of disease ≠ optimal state of health',
      },

      the_gap: {
          tag: 'The Critical Gap',
          title: 'Functional alterations precede structural damage',
          phases: [
            { phase: '01. Allostatic Load', title: 'The origin of imbalance', body: 'Lifestyle, diet, sleep habits, and substance use initiate silent pathophysiological processes in the body.', color: '#00a388' },
            { phase: '02. Cellular Impact', title: 'Bioelectrical Alteration', body: 'Cellular function is compromised, drastically altering its natural capacity to conduct electricity and condense energy.', color: '#78be34' },
            { phase: '03. The CNV Window', title: 'Detection before damage', body: 'We detect these functional deficiencies early, long before they affect body structure, which is where traditional medicine operates.', color: '#0a76a4' },
          ]
        },
      
      bioelectric: {
        tag: 'Bioelectric Medicine',
        title: 'The Human Body is a Biophysical System Expressed Electrically',
        p1: 'Biological function is expressed through electric flows, cellular membrane behavior, and the distribution of charges and fluids. These variables change <em>before</em> the structures do.',
        p2: 'Bioimpedance Spectroscopy (BIS) captures these signals across a broad spectrum of frequencies (1 kHz – 1 MHz), allowing us to infer the functional state of the system with clinical precision.',
        params: [
          { label: 'Re', desc: 'Extracellular Resistance' },
          { label: 'Ri', desc: 'Intracellular Resistance' },
          { label: 'R∞', desc: 'Resistance at Infinite Frequency' },
          { label: 'C', desc: 'Membrane Capacitance' },
        ]
      },
      cta: {
        title: 'Ready to Operate Under the New Paradigm?',
        subtitle: 'Learn how CNV implements this model through its three lines of action.',
        btn_primary: 'Discover CNV Care'
      }
    },
    operacion: {
      tag: 'CNV Care',
      title: 'Operation of the ANI-BIS-E Model',
      hero_body: 'CNV Care implements, supports, and controls the ANI-BIS-E care model in real-world health and nutrition care contexts.',
      role: {
        title: 'Enabler, not a provider',
        body: 'CNV Care does not act as a direct healthcare provider. It operates as an <strong>enabler, supervisor, and guarantor</strong> of the correct application of the model by allied professionals and institutions.',
        items: [
          { label: 'Implementation', desc: 'Design and execution of entry and operational strategies: bailment, contracts, operational licensing.' },
          { label: 'Support', desc: 'Continuous technical and operational support to certified model operators.' },
          { label: 'Control', desc: 'Auditing, monitoring, and verification of compliance with care model standards.' },
          { label: 'Feedback', desc: 'Continuous flow of operational information to CNV Research for model evolution.' },
        ]
      },
      clinical_phases: {
        tag: 'Care Model',
        title: 'Four structured clinical phases',
        steps: [
          { num: '01', title: 'Evaluation', body: 'Patient information gathering. Clinical and contextual survey. Measurement via Bioimpedance Spectroscopy.' },
          { num: '02', title: 'Functional Diagnosis', body: 'Information analysis via ANI-BIS-E. Generation of bioelectrical indices and maps. Identification of the functional state.' },
          { num: '03', title: 'Intervention', body: 'Definition of personalized diet, nutrition, and lifestyle strategies. Recommendation of nutraceuticals when required.' },
          { num: '04', title: 'Monitoring', body: 'Periodic reevaluation. New BIS measurements. Analysis of evolution and longitudinal functional trajectory.' },
        ]
      },
      atlas: {
        tag: 'Technological Infrastructure',
        title: 'Atlas — The operational platform of the model',
        body: 'Atlas is the central operating system of the ANI-BIS-E model. It allows the certified professional to guide the step-by-step application, capture clinical information, manage patients, and generate structured reports.',
        features: [
          'Comprehensive patient management',
          'Generation of bioelectrical indices and maps',
          'Clinical and operational reports',
          'Longitudinal monitoring',
          'Support for clinical decision-making'
        ],
        link_text: 'Access Atlas (certified operators only)'
      }
    },
    formacion: {
      tag: 'CNV Learning',
      title: 'Training in the new paradigm',
      hero_body: 'CNV Learning translates scientific evidence and operational experience into applied knowledge, ensuring consistency and quality in the model\'s execution.',
      mission: {
        tag: 'Beyond traditional education',
        title: 'We do not just teach. We align and certify.',
        p1: 'CNV Learning prepares and aligns the people who operate the CNV ecosystem under the same conceptual, technical, and ethical framework. The goal is not just to transfer knowledge, but to guarantee that each model operator reproduces the scientific standards with precision.',
        p2: 'The certification is officially endorsed by a <strong>national or international higher education institution</strong>.',
        pillars: [
          { label: 'Technical training', desc: 'Bioelectric medicine and ANI-BIS-E model', color: '#0a76a4' },
          { label: 'Certification', desc: 'With official university endorsement', color: '#0a76a4' },
          { label: 'Recertification', desc: 'Continuous model update', color: '#0a76a4' },
          { label: 'Guidance', desc: 'Support during implementation', color: '#0a76a4' },
        ]
      },
      curriculum: {
        tag: 'Training Contents',
        title: 'What a certified CNV operator learns',
        modules: [
          { num: '01', title: 'Paradigm foundations', body: 'Functional definition of health. Bioelectric medicine. Limitations of conventional medicine. BIS scientific framework.' },
          { num: '02', title: 'Bioimpedance Spectroscopy', body: 'Technical principles of BIS. Cole-Cole model. Bioelectrical parameters. Standardized measurement protocols.' },
          { num: '03', title: 'ANI-BIS-E Model', body: 'Interpretation of functional indices. Bioelectrical maps. 81 phenotypes. Cellular biological age.' },
          { num: '04', title: 'Clinical intervention', body: 'Decision-making based on bioelectrical data. Nutritional protocols. Longitudinal monitoring.' },
          { num: '05', title: 'Atlas Platform', body: 'Complete system operation. Patient management. Generation and interpretation of reports.' },
          { num: '06', title: 'Ethics and protocol', body: 'Ethical framework of the CNV operator. Quality standards. Responsibilities and network criteria.' },
        ]
      },
      academy_cta: {
        title: 'The complete academy is on a dedicated subdomain',
        body: 'The CNV Learning LMS, complete programs, schedules, enrollments, and training resources are located on the academy platform.',
        primary_btn: 'Go to CNV Academy',
        secondary_btn: 'Check availability'
      }
    },
    investigacion: {
      tag: 'CNV Research',
      title: 'The scientific authority of the ecosystem',
      hero_body: 'CNV Research ensures that the entire ecosystem operates under solid, coherent, and updated scientific evidence. Design, validation, and evolution of the ANI-BIS-E model.',
      mandate: {
        title: 'CNV Research defines what the model is, how it evolves, and under what rules it operates',
        body: 'The scientific direction of the ecosystem is led by a specialized team, operating through the <strong>Latin American Bioimpedance Observatory (ObBIA-Latam)</strong> as a platform for analysis, validation, and knowledge generation.',
        items: [
          { label: 'Design and validation', desc: 'Design, validation, and continuous evolution of the ANI-BIS-E scientific model based on real evidence.' },
          { label: 'Clinical research', desc: 'Clinical and applied research based on real data from the CNV ecosystem at the Latin American level.' },
          { label: 'Standardization', desc: 'Technical, methodological, and interpretive standardization for the entire network of operators.' },
          { label: 'Scientific consulting', desc: 'Specialized scientific consulting in bioelectric medicine and functional nutrition.' },
          { label: 'Editorial production', desc: 'Scientific outreach, publications, and positioning of the model under the new health paradigm.' },
        ]
      },
      obbia: {
        tag: 'International scientific initiative',
        title: 'Latin American Observatory of Bioimpedance',
        p1: 'ObBIA-Latam is the operational layer for analysis and knowledge production of CNV Research. It concentrates the clinical data of the ecosystem, validates it scientifically, and produces the knowledge that keeps the model at the forefront of evidence.',
        p2: 'Publications, books, databases, technical reports, and scientific outreach live on the observatory\'s subdomain.',
        btn_text: 'Go to ObBIA-Latam Observatory',
        stats: [
          { val: 'BIS', label: 'Bioimpedance Spectroscopy as the methodological axis' },
          { val: 'LATAM', label: 'Expanding Latin American reach' },
          { val: '81', label: 'Phenotypes classified in the ANI-BIS-E model' },
          { val: 'Cole–Cole', label: 'Biophysical model of international reference' },
        ]
      },
      framework: {
        tag: 'Scientific Framework',
        title: 'The layers of the model under evidence',
        layers: [
          { ref: 'Foundation', title: 'Bioelectric medicine', body: 'Study of biological function through biophysical organization and the electrical expression of the living system. The basis of the entire model.' },
          { ref: 'Methodology', title: 'Bioimpedance Spectroscopy (BIS)', body: 'Biophysical methodology that analyzes the electrical response of living tissues to a spectrum from 1 kHz to 1 MHz. The information capture engine.' },
          { ref: 'Model', title: 'Cole-Cole Model', body: 'Underlying mathematical model from which Re, Ri, R∞, and membrane Capacitance are derived. It allows for the inference of cellular functional state.' },
          { ref: 'Context', title: 'Applied Epigenetics', body: 'Study of how behavior and environment (diet, stress, exercise) cause changes that affect gene function without altering DNA.' },
          { ref: 'Model', title: 'Functional body composition', body: 'Hierarchy of 5 levels (atomic, molecular, cellular, tissue, whole-body). Alterations emerge from lower levels to higher ones.' },
          { ref: 'Output', title: 'Functional indices', body: 'IFC, IRC, IEHH, ISCM-BIS, PABU, EB-BIS, IAE. Interpretation layers organized by cellular integrity, systemic balance, and temporal trajectory.' },
        ]
      },
      cta: {
        title: 'The science supporting the model is available',
        subtitle: 'Publications, technical reports, and research resources at the Latin American Observatory of Bioimpedance.',
        btn_primary: 'Visit ObBIA-Latam'
      }
    },
    nosotros: {
      tag: 'Who we are',
      title: 'We are not a company.',
      title_highlight: 'We are a system.',
      hero_body: 'CNV was born from a simple question: why do we wait for someone to get sick to intervene? The answer led to a business ecosystem built to operate in the interval between function and disease.',
      problem: {
        tag: 'The starting point',
        title: 'The problem no one was solving',
        p1: 'Conventional medicine is reactive by design. It acts when the damage is already structural, when reversibility is limited, and when the optimal intervention window has already passed. It is not a flaw of the system — it is its foundational logic.',
        p2: 'What CNV identified is that there is a window of 10 to 15 years before a functional dysfunction becomes an observable clinical disease. That window is silent, produces no symptoms, and traditional medicine lacks the tools to see it.',
        p3: 'We built the tools to see it.',
        quote: '"CNV is not a company, it is a system that produces health from data."'
      },
      system: {
        tag: 'How it is built',
        title: 'A system with three functions and a core',
        functions: [
          { color: '#00a388', name: 'CNV Research', role: 'Generation', body: 'The scientific authority of the ecosystem. Designs, validates, and evolves the ANI-BIS-E model. Nothing enters the system without evidence.' },
          { color: '#0a76a4', name: 'CNV Learning', role: 'Transfer', body: 'The academic line. Translates evidence into applicable knowledge. Trains and certifies model operators with rigor and institutional endorsement.' },
          { color: '#2563eb', name: 'CNV Care', role: 'Execution', body: 'The operational line. Implements the model in clinical reality. Supervises, audits, and ensures each operator maintains system standards.' },
          { color: '#78be34', name: 'CNV Data', role: 'Core', body: 'The central infrastructure. Integrates, organizes, and activates the entire system. Here resides the logic, traceability, and the ability to scale.' },
        ],
        flow_tag: 'System flow',
        flow: ['Research generates knowledge', 'Training distributes it', 'Operation applies it']
      },
      principles: {
        tag: 'Operating principles',
        title: 'What guides every decision within the system',
        items: [
          { num: '01', title: 'Function before damage', body: 'We measure what the body does, not what has already failed. Early intervention is the only point where reversibility is high.' },
          { num: '02', title: 'No superficiality', body: 'CNV does not communicate generic wellness. It communicates applied scientific structure. Every element of the system responds to evidence, not to trends.' },
          { num: '03', title: 'Color is semantic', body: 'Even our visual identity is functional. Each color represents a function within the system. There is no decoration without meaning.' },
          { num: '04', title: 'Network of rigor', body: 'The CNV operator network is not open. Every professional is evaluated, trained, and certified before implementing the model.' },
          { num: '05', title: 'Scalability without loss of coherence', body: 'The system is designed to grow through third parties without sacrificing the scientific standards that give it meaning.' },
          { num: '06', title: 'Measurable impact', body: 'The purpose of CNV is not abstract wellness. It is the real and measurable impact on the functional state of individuals and their communities.' },
        ]
      },
      direction: {
        tag: 'Scientific direction',
        title: 'The science behind the system',
        p1: 'The scientific direction of the ecosystem is led by a specialized team, operating through the <strong>Latin American Bioimpedance Observatory (ObBIA-Latam)</strong> as a platform for analysis, validation, and knowledge generation.',
        p2: 'ObBIA-Latam ensures that the ANI-BIS-E model remains at the forefront of scientific evidence in bioelectric medicine across Latin America.',
        btn_research: 'Discover CNV Research',
        btn_obbia: 'ObBIA-Latam'
      },
      cta: {
        title: 'Do you want to be part of the system?',
        body: 'The CNV ecosystem grows through professionals, institutions, and partners who share the same scientific rigor.',
        btn_paradigm: 'Discover the paradigm'
      }
    },
  },
};