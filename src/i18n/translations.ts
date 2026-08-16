import { Language } from '../types';

export interface Translations {
  nav: {
    home: string;
    about: string;
    portfolio: string;
    services: string;
    contact: string;
    prdDocs: string;
    available: string;
  };
  home: {
    heroTitle: string;
    heroSubtitle: string;
    heroTagline: string;
    heroBio: string;
    availableBadge: string;
    ctaWork: string;
    ctaContact: string;
    quickStats: {
      projects: string;
      experience: string;
      satisfaction: string;
      awards: string;
    };
    featuredHeader: string;
    featuredSub: string;
    viewAllWork: string;
    expertiseHeader: string;
    skillsTitle: string;
    skillsSub: string;
    skillsBadge: string;
    trustHeader: string;
    trustTitle: string;
    trustSub: string;
    trustPoints: string[];
  };
  about: {
    title: string;
    subtitle: string;
    bioBadge: string;
    bioGreeting: string;
    bioRole: string;
    bioFull: string;
    bioTitle: string;
    downloadCvEn: string;
    downloadCvId: string;
    story: string;
    education: string;
    educationSub: string;
    leadership: string;
    workHistory: string;
    workHistorySub: string;
    skillsTools: string;
    skillsToolsSub: string;
    designSkillsTitle: string;
    personalSkillsTitle: string;
    designSkillsList: string[];
    personalSkillsList: string[];
  };
  portfolio: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    allCategories: string;
    viewCaseStudy: string;
    problem: string;
    workflow: string;
    solution: string;
    results: string;
    toolsUsed: string;
    client: string;
    year: string;
    role: string;
    close: string;
  };
  services: {
    title: string;
    subtitle: string;
    coreOfferings: string;
    pricingTitle: string;
    pricingSub: string;
    whyChooseTitle: string;
    faqTitle: string;
    faqSub: string;
    orderPackage: string;
    deliverables: string;
    popularBadge: string;
    includedFeaturesLabel: string;
    deliveryTimeLabel: string;
    whyChooseItems: {
      title: string;
      desc: string;
    }[];
    packagesData: Record<string, {
      name: string;
      badge: string;
      period: string;
      description: string;
      deliveryTime: string;
      features: string[];
    }>;
    coreServicesData: Record<string, {
      title: string;
      description: string;
      deliverables: string[];
    }>;
  };
  contact: {
    title: string;
    subtitle: string;
    formTitle: string;
    nameLabel: string;
    emailLabel: string;
    phoneLabel: string;
    serviceLabel: string;
    budgetLabel: string;
    messageLabel: string;
    sendBtn: string;
    sendWaBtn: string;
    directContact: string;
    socials: string;
  };
  admin: {
    secretGateTitle: string;
    secretGateDesc: string;
    enterPin: string;
    unlockBtn: string;
    dashboardTitle: string;
    manageProjects: string;
    manageServices: string;
    manageExperiences: string;
    manageSkills: string;
    manageFaqs: string;
    manageMessages: string;
    analytics: string;
    zeroCostGuide: string;
  };
  common: {
    close: string;
    save: string;
    delete: string;
    edit: string;
    add: string;
    loading: string;
    copied: string;
  };
  boot: {
    loading: string;
  };
  dualBrand: {
    badge: string;
    title: string;
    description: string;
    corporateTag: string;
    corporateBtn: string;
    freelanceTag: string;
    freelanceBtn: string;
  };
  workflow: {
    badge: string;
    title: string;
    subtitle: string;
    steps: {
      step: string;
      title: string;
      subtitle: string;
      desc: string;
      deliverable: string;
    }[];
  };
  calculator: {
    badge: string;
    title: string;
    subtitle: string;
    trustTitle: string;
    trustSub: string;
    step1: string;
    step2: string;
    step3: string;
    summaryBadge: string;
    deliverablesHeader: string;
    sendWaBtn: string;
    startingFrom: string;
    step4: string;
    contactNameLabel: string;
    contactPhoneLabel: string;
    contactHint: string;
    rangeLabel: string;
    quoteNote: string;
    servicesData: Record<string, {
      name: string;
      deliverables: string[];
    }>;
    scopesData: Record<string, {
      label: string;
      desc: string;
    }>;
    timelinesData: Record<string, {
      label: string;
    }>;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
  boot: { loading: 'Preparing the best experience…' },
    nav: {
      home: 'Home',
      about: 'About',
      portfolio: 'Portfolio',
      services: 'Services',
      contact: 'Contact',
      prdDocs: 'PRD & SRS',
      available: 'Available for Freelance',
    },
    home: {
      heroTitle: 'Crafting Intentional Digital Interfaces & Brand Systems',
      heroSubtitle: 'Graphic & UI Designer • Founder of Focal Hyperspace Creative',
      heroTagline: 'Translating business goals and user needs into thoughtful UI/UX, memorable brand identities, and precise print media.',
      heroBio: 'I am a graphic & UI designer with over 4 years of experience crafting functional, human-centered visual solutions. My work bridges raw business objectives with intuitive digital experiences and physical touchpoints. Backed by a background in AI & Robotics, I combine structured logic with fine visual craftsmanship to deliver design that resonates and drives tangible impact.',
      availableBadge: 'Open for UI/UX & Graphic Projects',
      ctaWork: 'View Work',
      ctaContact: 'Start a Conversation',
      quickStats: {
        projects: 'Projects Delivered',
        experience: 'Years Experience',
        satisfaction: 'Client Satisfaction',
        awards: 'Design Honors',
      },
      featuredHeader: 'Selected Works',
      featuredSub: 'A curated selection of UI/UX case studies and visual identity systems.',
      viewAllWork: 'Explore All Projects',
      expertiseHeader: 'Design Tooling & Capabilities',
      skillsTitle: 'Tools & Creative Mastery',
      skillsSub: 'Practical proficiency and day-to-day fluency in design software and visual craftsmanship.',
      skillsBadge: 'Tools & Capabilities',
      trustHeader: 'Design Approach',
      trustTitle: 'Structured Logic Meets Fine Visual Craftsmanship',
      trustSub: 'Blending engineering discipline from AI & Robotics with 4+ years of hands-on UI/UX, branding, and print production experience.',
      trustPoints: [
        'Connecting business strategy to human-friendly UI/UX flows',
        'CMYK pre-press precision ensuring zero printing discrepancies',
        'Figma wireframes evolved into interactive clickable prototypes',
        'Adaptive workflow — effective both solo and in team environments',
      ],
    },
    about: {
      title: 'About Me',
      subtitle: 'Graphic & UI Designer passionate about claymorphism and modern UI aesthetics.',
      bioBadge: 'Bio Profile • Faras Hazid',
      bioGreeting: "Hello, I'm",
      bioRole: 'GRAPHIC & UI DESIGNER',
      bioFull: 'I am a designer with over four years of experience in the creative industry, specializing in functional visual solutions. I specialize in bridging business and non-business needs into digital interface design (UI/UX) as well as physical media. With a background in AI and Robotics, I apply structured logic and technological efficiency to create work that is aesthetically pleasing and has a tangible impact on brands.',
      bioTitle: 'Personal Story & Philosophy',
      downloadCvEn: 'Download CV (English)',
      downloadCvId: 'Download CV (Indonesia)',
      story: 'Story',
      education: 'Education History',
      educationSub: 'Academic foundation and Islamic boarding education timeline.',
      leadership: 'Leadership & Community',
      workHistory: 'Work Experience History',
      workHistorySub: 'Professional journey across media centers, UI/UX tech, and digital printing.',
      skillsTools: 'Software & Tools Expertise',
      skillsToolsSub: 'Tools, software proficiency, and design capability breakdown.',
      designSkillsTitle: 'Design Skills',
      personalSkillsTitle: 'Personal Skills',
      designSkillsList: [
        'Branding',
        'Layouting',
        'Mobile App & Web Design',
        'Social Media Post',
        'Logo Design',
        'Thumbnail Design',
      ],
      personalSkillsList: [
        'Time Management',
        'Creative Thinking',
        'Team Work',
        'Problem Solving',
        'Creativity',
        'Responsibility',
      ],
    },
    portfolio: {
      title: 'Portfolio & Case Studies',
      subtitle: 'Detailed breakdown of design thinking, user research, workflow, and problem solving.',
      searchPlaceholder: 'Search projects by name, tool, or keyword...',
      allCategories: 'All Projects',
      viewCaseStudy: 'View Case Study',
      problem: 'The Challenge & Problem',
      workflow: 'Workflow Process',
      solution: 'Design Solution',
      results: 'Key Outcomes & Impact',
      toolsUsed: 'Tools Used',
      client: 'Client / Company',
      year: 'Year',
      role: 'My Role',
      close: 'Close Case Study',
    },
    services: {
      title: 'Services & Transparent Packages',
      subtitle: 'Clear deliverables, transparent investment tiers, and tailored design solutions.',
      coreOfferings: 'What I Do - Core Offerings',
      pricingTitle: 'Transparent Pricing Packages',
      pricingSub: 'Choose a fixed-scope package or request a custom enterprise quote.',
      whyChooseTitle: 'Why Choose Focal Hyperspace Creative',
      faqTitle: 'Frequently Asked Questions',
      faqSub: 'Everything you need to know about working together.',
      orderPackage: 'Order via WhatsApp',
      deliverables: 'Deliverables Included',
      popularBadge: 'Most Popular Choice',
      includedFeaturesLabel: 'Included Features:',
      deliveryTimeLabel: 'Delivery:',
      whyChooseItems: [
        {
          title: 'AI & Robotics Logic Synergy',
          desc: 'Applying structured logic and technical efficiency to create designs that are visually appealing and impactful.',
        },
        {
          title: 'Developer-Handout Ready',
          desc: 'Clean Figma wireframes, clickable prototypes, and exact CSS/Tailwind specifications ready for engineering teams.',
        },
        {
          title: 'Pre-Printing Pre-Press Precision',
          desc: 'Guaranteed DPI resolution, CMYK color separation, and zero print defect track record for banners, merch, and team uniforms.',
        },
      ],
      packagesData: {
        'pkg-1': {
          name: 'Branding & Visual Starter',
          badge: 'Essential Brand Identity',
          period: 'per project',
          description: 'Ideal for small businesses and organizations needing a professional logo, brand guidelines, and key social media templates.',
          deliveryTime: '4 Business Days',
          features: [
            'Logo Design (2 Concept Variations)',
            'Brand Color Palette & Typography Rules',
            'Social Media Post & Banner Templates (5 Posts)',
            'Vector Source Files (AI, EPS, SVG, PNG, PDF)',
            '2 Rounds of Revisions',
            '4 Days Fast Delivery',
          ],
        },
        'pkg-2': {
          name: 'UI/UX App & Web Prototype Pro',
          badge: 'Most Popular Choice',
          period: 'per project',
          description: 'Complete UI/UX design for mobile apps or web platforms with interactive Figma prototypes and wireframes.',
          deliveryTime: '10 Business Days',
          features: [
            'End-to-End User Experience & Flow Wireframing',
            'Up to 10 Custom Application Screens',
            'Interactive Clickable Figma Prototype',
            'Design System Components & Typography Tokens',
            'Developer Handout (Tailwind / CSS Specifications)',
            '3 Rounds of Revisions',
            'Direct WhatsApp Consultation',
          ],
        },
        'pkg-3': {
          name: 'Full Media & Print Package',
          badge: 'Physical & Digital Complete',
          period: 'per project',
          description: 'Comprehensive branding, social media suite, printing sets (calendars, banners), and T-Shirt / PDH uniform mockups.',
          deliveryTime: '14 Business Days',
          features: [
            'Full Logo & Brand System Guidelines',
            'Complete Social Media Feed & Story Suite (15 Assets)',
            'Printing Set (Calendars, Banners, ID Cards)',
            'Official T-Shirt & PDH Uniform Embroidery Mockups',
            'Pre-Printing CMYK Production-Ready Files',
            'Unlimited Revisions during active project',
            'Priority Delivery',
          ],
        },
        'pkg-4': {
          name: 'Monthly Design Retainer',
          badge: 'Monthly Support',
          period: 'per month',
          description: 'Ongoing dedicated design support for monthly social media feeds, banner layouts, and UI/UX updates.',
          deliveryTime: 'Ongoing Monthly',
          features: [
            '20 Custom Social Media & Story Banners per month',
            'UI/UX Screen Iterations & Web Banner Tweaks',
            'Print Asset Layouts (Flyers, Stickers, Merch)',
            'Fast 24-48 Hour Request Turnaround',
            'Direct WhatsApp Priority Communication',
          ],
        },
      },
      coreServicesData: {
        'srv-1': {
          title: 'UI/UX & Mobile App Design',
          description: 'Bridging business and non-business needs into intuitive digital interface design for mobile apps and web platforms using Figma and Adobe Xd.',
          deliverables: ['Wireframing & Information Architecture', 'Figma Interactive Prototypes', 'Responsive Layouting', 'Developer-Ready Tokens'],
        },
        'srv-2': {
          title: 'Branding & Logo Systems',
          description: 'Crafting memorable visual identities, logo marks, typography standards, and brand books that leave a tangible impact.',
          deliverables: ['Primary & Secondary Logomarks', 'Brand Identity Guidelines', 'Vector Assets (AI, SVG, PDF)', 'Color & Type Tokens'],
        },
        'srv-3': {
          title: 'Social Media & Graphic Media',
          description: 'Producing daily digital content, Instagram story campaigns, book cover illustrations, and thumbnail designs that drive engagement.',
          deliverables: ['Social Media Feeds & Stories', 'Book & Ebook Cover Art', 'Thumbnail Design', 'Digital Event Banners'],
        },
        'srv-4': {
          title: 'Physical Printing & Merch Sets',
          description: 'Expertise in pre-printing file optimization, color correction, banners, billboards, calendars, T-shirt prints, and official PDH team uniforms.',
          deliverables: ['CMYK Print-Ready Files', 'Calendar & ID Card Sets', 'T-Shirt & Event Merchandise', 'PDH Uniform Mockups'],
        },
      },
    },
contact: {
      title: 'Let\'s Create Something Iconic',
      subtitle: 'Have a project in mind, a job opportunity, or need custom UI & graphic designs? Get in touch today.',
      formTitle: 'Send a Direct Message',
      nameLabel: 'Your Full Name',
      emailLabel: 'Your Email Address',
      phoneLabel: 'WhatsApp Number (optional)',
      serviceLabel: 'Service You Need',
      budgetLabel: 'Estimated Budget',
      messageLabel: 'Project Details & Goals',
      sendBtn: 'Send Message',
      sendWaBtn: 'Quick Order via WhatsApp',
      directContact: 'Direct Contact Info',
      socials: 'Find Me Online',
    },
    admin: {
      secretGateTitle: 'Hidden Headless CMS Admin Gate',
      secretGateDesc: 'Protected area for content management and live backend status.',
      enterPin: 'Enter Secret Admin Passcode',
      unlockBtn: 'Unlock Dashboard',
      dashboardTitle: 'ClayFolio Headless CMS Dashboard',
      manageProjects: 'Projects (CRUD)',
      manageServices: 'Services & Packages',
      manageExperiences: 'Experiences & Story',
      manageSkills: 'Skills & Tools',
      manageFaqs: 'FAQ Management',
      manageMessages: 'Inquiries & Messages',
      analytics: 'Visitor Analytics',
      zeroCostGuide: 'Zero-Cost Stack Guide',
    },
    common: {
      close: 'Close',
      save: 'Save Changes',
      delete: 'Delete',
      edit: 'Edit',
      add: 'Add New Item',
      loading: 'Loading...',
      copied: 'Copied to Clipboard!',
    },
    dualBrand: {
      badge: 'Dual Purpose Personal & Studio Hub',
      title: 'Welcome! Are you looking for a Corporate Recruiter or Freelance Services?',
      description: 'This website serves as Faras Hazid’s Professional Portfolio & CV (for Graphic & UI Designer corporate roles) as well as the Focal Hyperspace Creative Studio Hub (for freelance services & custom design packages).',
      corporateTag: 'Corporate Hire',
      corporateBtn: 'View CV & Job Application',
      freelanceTag: 'Focal Hyperspace',
      freelanceBtn: 'Order Services & Packages',
    },
    workflow: {
      badge: 'Focal Hyperspace Creative Workflow',
      title: 'Structured & Transparent Process',
      subtitle: 'Every design project is executed systematically to ensure high visual precision, timely delivery, and real business impact.',
      steps: [
        {
          step: '01',
          title: 'Discovery & Briefing',
          subtitle: 'Research & Requirement Analysis',
          desc: 'Brief collection, target audience research, business objective mapping, and aesthetic direction definition.',
          deliverable: 'Design Brief & Direction',
        },
        {
          step: '02',
          title: 'Wireframing & Concepting',
          subtitle: 'Structure & Visual Exploration',
          desc: 'Creating Figma wireframe information hierarchy or initial vector geometry sketches before high-fidelity visual design.',
          deliverable: 'Figma Wireframe & Vector Sketch',
        },
        {
          step: '03',
          title: 'Visual Design & Refinement',
          subtitle: 'Polishing & Rapid Iteration',
          desc: 'Applying color systems, typography, UI interactions, and polishing details based on your feedback.',
          deliverable: 'High-Fidelity UI & Brand Assets',
        },
        {
          step: '04',
          title: 'Handoff & Vector Files',
          subtitle: 'Master File Delivery',
          desc: 'Delivering production-ready files (Figma tokens, AI/EPS/SVG master vector files, and CMYK pre-press PDFs).',
          deliverable: 'Master Files AI/EPS/SVG/Figma',
        },
      ],
    },
    calculator: {
      badge: 'Focal Hyperspace Creative • Project Cost Calculator',
      title: 'Design Project Cost & Timeline Estimator',
      subtitle: 'Calculate estimated budget and turnaround duration for graphic design or UI/UX projects instantly.',
      trustTitle: 'Transparent & Budget Friendly',
      trustSub: 'Includes Revision Guarantee & Vector Master Files',
      step1: '1. Select Design Service Type',
      step2: '2. Project Scope & Completeness',
      step3: '3. Turnaround Speed',
      summaryBadge: 'ESTIMATE WITH FOCAL HYPERSPACE CREATIVE',
      deliverablesHeader: 'Included Deliverables:',
      sendWaBtn: 'Send Estimate to WhatsApp',
      startingFrom: 'Starting from',
      step4: 'Your contact (optional)',
      contactNameLabel: 'Your name',
      contactPhoneLabel: 'WhatsApp number',
      contactHint: 'Recommended — so we can send your quote back',
      rangeLabel: 'Estimated range',
      quoteNote: 'Starting estimate — final quote after a free brief',
      servicesData: {
        'brand-identity': {
          name: 'Logo & Brand Identity System',
          deliverables: ['Vector Logo Marks (AI, EPS, SVG)', 'Brand Color Palette & Typography Rules', 'Brand Guideline Sheet (PDF)', 'Social Media Avatar & Header Sets'],
        },
        'uiux-mobile-web': {
          name: 'UI/UX Mobile App & Web Design',
          deliverables: ['End-to-End User Experience Flow', 'Interactive Clickable Figma Prototype', 'Component Design System Tokens', 'Developer Handoff Specifications'],
        },
        'social-media': {
          name: 'Social Media & Graphic Banners',
          deliverables: ['10 High-Converting Post/Story Layouts', 'Editable Figma Source Templates', 'Exported High-Res PNG/JPGs', 'Custom Typography & Ad Layouts'],
        },
        'print-prepess': {
          name: 'Print Layouting & Pre-Press Set',
          deliverables: ['Pre-Press CMYK Ready Files', 'Bleed & Crop Mark Alignments', 'PDH Team Uniform & Merchandise Vector', 'PDF Book Cover & Layout Sets'],
        },
      },
      scopesData: {
        starter: { label: 'Starter / Essential', desc: 'Core deliverables for small businesses & startups.' },
        pro: { label: 'Professional / Growth', desc: 'Includes source files, expanded variations & priority support.' },
        enterprise: { label: 'Complete / Studio Level', desc: 'Full design system, expedited handoff & unlimited revisions.' },
      },
      timelinesData: {
        standard: { label: 'Standard Delivery (5-10 Days)' },
        express: { label: 'Express Rush Delivery (2-4 Days)' },
      },
    },
  },
  id: {
  boot: { loading: 'Menyiapkan pengalaman terbaik…' },
    nav: {
      home: 'Beranda',
      about: 'Tentang',
      portfolio: 'Portofolio',
      services: 'Layanan',
      contact: 'Kontak',
      prdDocs: 'Dokumen PRD & SRS',
      available: 'Tersedia untuk Freelance',
    },
    home: {
      heroTitle: 'Mendesain Antarmuka Digital & Sistem Brand yang Berjiwa',
      heroSubtitle: 'Desainer Grafis & UI Designer • Founder Focal Hyperspace Creative',
      heroTagline: 'Menerjemahkan tujuan bisnis dan kebutuhan pengguna menjadi desain UI/UX yang intuitif, identitas visual yang berkarakter, dan karya cetak berpresisi tinggi.',
      heroBio: 'Saya adalah seorang desainer grafis & UI dengan pengalaman lebih dari 4 tahun dalam menghadirkan solusi visual yang fungsional dan berpusat pada manusia. Karya saya berfokus menjembatani kebutuhan bisnis dengan pengalaman digital yang menyenangkan. Berbekal latar belakang AI & Robotika, saya memadukan logika terstruktur dengan ketelitian visual untuk menghasilkan karya yang bermakna dan memberi dampak nyata.',
      availableBadge: 'Tersedia untuk Proyek UI/UX & Desain Grafis',
      ctaWork: 'Lihat Karya',
      ctaContact: 'Mulai Diskusi',
      quickStats: {
        projects: 'Proyek Selesai',
        experience: 'Tahun Pengalaman',
        satisfaction: 'Kepuasan Klien',
        awards: 'Penghargaan Desain',
      },
      featuredHeader: 'Karya Pilihan',
      featuredSub: 'Studi kasus UI/UX dan sistem identitas visual pilihan.',
      viewAllWork: 'Jelajahi Semua Proyek',
      expertiseHeader: 'Alat Desain & Kapabilitas',
      skillsTitle: 'Perangkat Lunak & Penguasaan Kreatif',
      skillsSub: 'Tingkat kemahiran praktis dalam penggunaan perangkat lunak desain dan eksekusi visual sehari-hari.',
      skillsBadge: 'Alat & Kemahiran',
      trustHeader: 'Pendekatan Desain',
      trustTitle: 'Logika Terstruktur Berpadu Ketelitian Visual Desainer',
      trustSub: 'Menyelaraskan disiplin logika dari latar belakang AI & Robotika dengan pengalaman 4+ tahun dalam merancang UI/UX, branding, serta produksi media cetak.',
      trustPoints: [
        'Menghubungkan strategi bisnis dengan alur UI/UX yang ramah pengguna',
        'Presisi pra-cetak CMYK untuk memastikan hasil cetak sesuai ekspektasi',
        'Pengembangan wireframe Figma menjadi prototipe interaktif yang dapat diuji',
        'Alur kerja fleksibel — efektif bekerja mandiri maupun berkolaborasi dalam tim',
      ],
    },
    about: {
      title: 'Tentang Saya',
      subtitle: 'Desainer Grafis & UI yang berdedikasi menciptakan gaya Claymorphism & pengalaman pengguna interaktif.',
      bioBadge: 'Profil Biodata • Faras Hazid',
      bioGreeting: 'Halo, Saya',
      bioRole: 'GRAPHIC & UI DESIGNER',
      bioFull: 'Saya adalah desainer dengan pengalaman lebih dari empat tahun di industri kreatif, berpesialisasi dalam solusi visual fungsional. Saya berpengalaman menjembatani kebutuhan bisnis dan non-bisnis ke dalam desain antarmuka digital (UI/UX) maupun media fisik. Berbekal latar belakang AI dan Robotika, saya menerapkan logika terstruktur dan efisiensi teknologi untuk menghasilkan karya yang estetis serta berdampak nyata bagi brand.',
      bioTitle: 'Cerita & Filosofi Pribadi',
      downloadCvEn: 'Unduh CV (Bahasa Inggris)',
      downloadCvId: 'Unduh CV (Bahasa Indonesia)',
      story: 'Kisah Singkat',
      education: 'Riwayat Pendidikan',
      educationSub: 'Fondasi akademis dan riwayat pendidikan pesantren.',
      leadership: 'Pengalaman Kepemimpinan',
      workHistory: 'Riwayat Pengalaman Kerja',
      workHistorySub: 'Perjalanan profesional di pusat media, perusahaan teknologi UI/UX, dan percetakan digital.',
      skillsTools: 'Keahlian Software & Perangkat',
      skillsToolsSub: 'Alat, tingkat kemahiran perangkat lunak, dan matriks kemampuan desain.',
      designSkillsTitle: 'Keahlian Desain',
      personalSkillsTitle: 'Keahlian Personal',
      designSkillsList: [
        'Branding / Pengenalan Brand',
        'Layouting / Tata Letak',
        'Desain Aplikasi Mobile & Web',
        'Konten Media Sosial',
        'Desain Logo',
        'Desain Sampul & Thumbnail',
      ],
      personalSkillsList: [
        'Manajemen Waktu',
        'Berpikir Kreatif',
        'Kerja Sama Tim',
        'Pemecahan Masalah',
        'Kreativitas',
        'Tanggung Jawab',
      ],
    },
    portfolio: {
      title: 'Portofolio & Studi Kasus',
      subtitle: 'Penjelasan rinci tentang alur berpikir desain, riset pengguna, proses kerja, dan solusi masalah.',
      searchPlaceholder: 'Cari proyek berdasarkan nama, alat, atau kata kunci...',
      allCategories: 'Semua Proyek',
      viewCaseStudy: 'Lihat Studi Kasus',
      problem: 'Tantangan & Permasalahan',
      workflow: 'Alur Proses Kerja',
      solution: 'Solusi Desain',
      results: 'Hasil & Dampak Utama',
      toolsUsed: 'Perangkat yang Digunakan',
      client: 'Klien / Perusahaan',
      year: 'Tahun',
      role: 'Peran Saya',
      close: 'Tutup Studi Kasus',
    },
    services: {
      title: 'Layanan & Paket Harga Transparan',
      subtitle: 'Deliverable yang jelas, pilihan paket investasi transparan, dan solusi desain yang dapat disesuaikan.',
      coreOfferings: 'Layanan Utama - What I Do',
      pricingTitle: 'Paket Harga Transparan',
      pricingSub: 'Pilih paket dengan cakupan tetap atau minta penawaran khusus perusahaan.',
      whyChooseTitle: 'Alasan Memilih Focal Hyperspace Creative',
      faqTitle: 'Pertanyaan yang Sering Diajukan (FAQ)',
      faqSub: 'Semua hal yang perlu Anda ketahui sebelum memulai alur kerjasama.',
      orderPackage: 'Pesan via WhatsApp',
      deliverables: 'Deliverable Tercover',
      popularBadge: 'Pilihan Paling Populer',
      includedFeaturesLabel: 'Fitur & Aset Termasuk:',
      deliveryTimeLabel: 'Waktu Pengerjaan:',
      whyChooseItems: [
        {
          title: 'Sinergi Logika AI & Robotika',
          desc: 'Menerapkan logika terstruktur dan efisiensi teknis untuk menciptakan desain yang estetis dan berdampak nyata.',
        },
        {
          title: 'Siap Handoff Developer',
          desc: 'Wireframe Figma rapi, prototipe interaktif, dan spesifikasi CSS/Tailwind presisi yang siap untuk tim engineering.',
        },
        {
          title: 'Presisi Pre-Press Siap Cetak',
          desc: 'Garansi resolusi DPI, separasi warna CMYK, dan rekam jejak tanpa cacat cetak untuk spanduk, merch, dan seragam tim.',
        },
      ],
      packagesData: {
        'pkg-1': {
          name: 'Branding & Visual Starter',
          badge: 'Brand Identity Mendasar',
          period: 'per proyek',
          description: 'Sangat cocok untuk bisnis kecil dan organisasi yang membutuhkan logo profesional, pedoman brand, dan template media sosial.',
          deliveryTime: '4 Hari Kerja',
          features: [
            'Desain Logo (2 Variasi Konsep)',
            'Palet Warna Brand & Aturan Tipografi',
            'Template Post & Banner Media Sosial (5 Post)',
            'File Master Vektor (AI, EPS, SVG, PNG, PDF)',
            '2 Kali Kesempatan Revisi',
            'Pengiriman Cepat 4 Hari',
          ],
        },
        'pkg-2': {
          name: 'UI/UX App & Web Prototype Pro',
          badge: 'Pilihan Paling Populer',
          period: 'per proyek',
          description: 'Desain UI/UX lengkap untuk aplikasi mobile atau platform web dengan prototipe interaktif Figma dan wireframe.',
          deliveryTime: '10 Hari Kerja',
          features: [
            'Wireframing Alur Pengalaman Pengguna Lengkap',
            'Hingga 10 Tampilan Layar Aplikasi Kustom',
            'Prototipe Interaktif Klik Figma',
            'Komponen Sistem Desain & Token Tipografi',
            'Penyerahan Developer (Spesifikasi Tailwind / CSS)',
            '3 Kali Kesempatan Revisi',
            'Konsultasi Langsung via WhatsApp',
          ],
        },
        'pkg-3': {
          name: 'Paket Komplit Media & Cetak Fisik',
          badge: 'Lengkap Fisik & Digital',
          period: 'per proyek',
          description: 'Branding menyeluruh, media sosial suite, set cetak fisik (kalender, spanduk), dan mockup seragam PDH / Kaos.',
          deliveryTime: '14 Hari Kerja',
          features: [
            'Pedoman Sistem Brand & Logo Lengkap',
            'Suite Feed & Story Media Sosial Lengkap (15 Aset)',
            'Set Cetak Fisik (Kalender, Spanduk, Kartu ID)',
            'Mockup Bordir Seragam PDH & Kaos Resmi',
            'File Siap Cetak Produksi CMYK Pre-Press',
            'Revisi Tanpa Batas Selama Proyek Aktif',
            'Pengiriman Prioritas Utama',
          ],
        },
        'pkg-4': {
          name: 'Retainer Desain Bulanan',
          badge: 'Dukungan Bulanan',
          period: 'per bulan',
          description: 'Dukungan desain khusus secara berkala untuk feed media sosial bulanan, tata letak banner, dan pembaruan UI/UX.',
          deliveryTime: 'Berkala Setiap Bulan',
          features: [
            '20 Banner Media Sosial & Story Kustom per bulan',
            'Iterasi Layar UI/UX & Penyesuaian Banner Web',
            'Layout Aset Cetak (Brosur, Stiker, Merch)',
            'Waktu Pengerjaan Cepat 24-48 Jam',
            'Komunikasi Prioritas Langsung via WhatsApp',
          ],
        },
      },
      coreServicesData: {
        'srv-1': {
          title: 'Desain UI/UX & Aplikasi Mobile',
          description: 'Menghubungkan kebutuhan bisnis ke dalam desain antarmuka digital yang intuitif untuk aplikasi mobile dan web menggunakan Figma & Adobe Xd.',
          deliverables: ['Wireframing & Arsitektur Informasi', 'Prototipe Interaktif Figma', 'Tata Letak Responsif', 'Token Siap Developer'],
        },
        'srv-2': {
          title: 'Sistem Branding & Logo',
          description: 'Menciptakan identitas visual yang berkesan, logo mark, standar tipografi, dan buku panduan brand yang berdampak nyata.',
          deliverables: ['Logomark Utama & Sekunder', 'Pedoman Identitas Brand', 'Aset Vektor (AI, SVG, PDF)', 'Token Warna & Tipe'],
        },
        'srv-3': {
          title: 'Media Sosial & Media Grafis',
          description: 'Memproduksi konten digital harian, kampanye story Instagram, ilustrasi sampul buku, dan desain thumbnail yang meningkatkan interaksi.',
          deliverables: ['Feed & Story Media Sosial', 'Sampul Buku & Ebook', 'Desain Thumbnail', 'Banner Acara Digital'],
        },
        'srv-4': {
          title: 'Set Cetak Fisik & Merchandise',
          description: 'Keahlian dalam optimasi file pre-press, koreksi warna CMYK, spanduk, baliho, kalender, sablon kaos, dan seragam PDH resmi.',
          deliverables: ['File Siap Cetak CMYK', 'Set Kalender & Kartu ID', 'Merchandise & Kaos Acara', 'Mockup Seragam PDH'],
        },
      },
    },
    contact: {
      title: 'Mari Wujudkan Karya Ikonik Bersama',
      subtitle: 'Punya ide proyek, tawaran pekerjaan, atau butuh jasa desain UI & grafis khusus? Hubungi saya hari ini.',
      formTitle: 'Kirim Pesan Langsung',
      nameLabel: 'Nama Lengkap Anda',
      emailLabel: 'Alamat Email',
      phoneLabel: 'Nomor WhatsApp (opsional)',
      serviceLabel: 'Layanan yang Dibutuhkan',
      budgetLabel: 'Estimasi Anggaran',
      messageLabel: 'Rincian & Tujuan Proyek',
      sendBtn: 'Kirim Pesan',
      sendWaBtn: 'Pesan Cepat via WhatsApp',
      directContact: 'Informasi Kontak Langsung',
      socials: 'Temukan Saya di Media Sosial',
    },
    admin: {
      secretGateTitle: 'Gerbang Rahasia CMS Headless Admin',
      secretGateDesc: 'Area terproteksi untuk pengelolaan konten dan status backend live.',
      enterPin: 'Masukkan Kode Akses Admin Rahasia',
      unlockBtn: 'Buka Dashboard',
      dashboardTitle: 'Dashboard CMS Headless ClayFolio',
      manageProjects: 'Proyek (CRUD)',
      manageServices: 'Layanan & Paket',
      manageExperiences: 'Pengalaman & Cerita',
      manageSkills: 'Keahlian & Tools',
      manageFaqs: 'Manajemen FAQ',
      manageMessages: 'Pesan & Inquiries',
      analytics: 'Analitik Pengunjung',
      zeroCostGuide: 'Panduan Deployment $0 Cost',
    },
    common: {
      close: 'Tutup',
      save: 'Simpan Perubahan',
      delete: 'Hapus',
      edit: 'Edit',
      add: 'Tambah Item Baru',
      loading: 'Memuat...',
      copied: 'Tersalin ke Clipboard!',
    },
    dualBrand: {
      badge: 'Dual Purpose Personal & Studio Hub',
      title: 'Selamat Datang! Apakah Anda Rekruiter Perusahaan atau Klien Freelance?',
      description: 'Situs ini berfungsi sebagai Portofolio & CV Profesional Faras Hazid (untuk posisi Graphic & UI Designer di perusahaan) sekaligus sebagai Studio Focal Hyperspace Creative (untuk layanan freelance & jasa desain).',
      corporateTag: 'Corporate Hire',
      corporateBtn: 'Lihat CV & Lamaran Kerja',
      freelanceTag: 'Focal Hyperspace',
      freelanceBtn: 'Pesan Jasa & Paket Desain',
    },
    workflow: {
      badge: 'Workflow Focal Hyperspace Creative',
      title: 'Proses Kerja Terstruktur & Transparan',
      subtitle: 'Setiap proyek desain dikerjakan dengan tahapan yang sistematis untuk memastikan hasil visual yang presisi, tepat waktu, dan berdampak nyata.',
      steps: [
        {
          step: '01',
          title: 'Discovery & Briefing',
          subtitle: 'Riset & Diskusi Kebutuhan',
          desc: 'Pengumpulan brief, analisis audiens sasaran, pemetaan tujuan bisnis, serta penentuan arah estetika dan spesifikasi teknis.',
          deliverable: 'Design Brief & Creative Direction',
        },
        {
          step: '02',
          title: 'Wireframing & Concepting',
          subtitle: 'Struktur & Eksplorasi Visual',
          desc: 'Pembuatan wireframe hirarki informasi di Figma atau sketsa vektor awal sebelum masuk ke visual tingkat tinggi.',
          deliverable: 'Figma Wireframe & Vector Sketsa',
        },
        {
          step: '03',
          title: 'Visual Design & Refinement',
          subtitle: 'Polesan Desain & Iterasi',
          desc: 'Penerapan sistem warna, tipografi, interaksi UI, serta penyempurnaan detail berdasarkan umpan balik Anda secara cepat.',
          deliverable: 'High-Fidelity UI / Brand Assets',
        },
        {
          step: '04',
          title: 'Handoff & File Handoff',
          subtitle: 'Penyerahan File Master Vektor',
          desc: 'Penyerahan file siap pakai (Figma tokens, AI/EPS/SVG master vector, dan PDF CMYK siap cetak tanpa cacat warna).',
          deliverable: 'Master Files AI/EPS/SVG/Figma',
        },
      ],
    },
    calculator: {
      badge: 'Focal Hyperspace Creative • Kalkulator Biaya Proyek',
      title: 'Kalkulator Estimasi Proyek Desain',
      subtitle: 'Hitung perkiraan biaya dan durasi pengerjaan untuk proyek desain grafis atau UI/UX Anda secara langsung.',
      trustTitle: 'Transparan & Sesuai Budget',
      trustSub: 'Garansi Revisi & File Master Vector',
      step1: '1. Pilih Jenis Layanan Desain',
      step2: '2. Skala & Kelengkapan Proyek',
      step3: '3. Kecepatan Pengerjaan',
      summaryBadge: 'ESTIMASI DENGAN FOCAL HYPERSPACE CREATIVE',
      deliverablesHeader: 'Deliverables Yang Didapatkan:',
      sendWaBtn: 'Kirim Estimasi Ke WhatsApp',
      startingFrom: 'Mulai',
      step4: 'Kontak kamu (opsional)',
      contactNameLabel: 'Nama kamu',
      contactPhoneLabel: 'Nomor WhatsApp',
      contactHint: 'Disarankan — biar estimasi & follow-up bisa dikirim balik',
      rangeLabel: 'Kisaran estimasi',
      quoteNote: 'Estimasi awal — harga final setelah brief gratis',
      servicesData: {
        'brand-identity': {
          name: 'Sistem Logo & Identitas Brand',
          deliverables: ['Logo Vektor (AI, EPS, SVG)', 'Palet Warna Brand & Tipografi', 'Lembar Pedoman Brand (PDF)', 'Set Avatar & Header Medsos'],
        },
        'uiux-mobile-web': {
          name: 'Desain UI/UX Mobile App & Web',
          deliverables: ['Alur Pengalaman Pengguna Lengkap', 'Prototipe Klik Interaktif Figma', 'Token Sistem Desain Komponen', 'Spesifikasi Handoff Developer'],
        },
        'social-media': {
          name: 'Banner Grafis & Media Sosial',
          deliverables: ['10 Desain Post/Story Konversi Tinggi', 'Template Sumber Figma Editable', 'Ekspor PNG/JPG Resolusi Tinggi', 'Tipografi & Layout Iklan Kustom'],
        },
        'print-prepess': {
          name: 'Layout Cetak & Set Pre-Press',
          deliverables: ['File CMYK Ready Pre-Press', 'Presisi Bleed & Crop Mark', 'Vektor Seragam PDH & Merchandise', 'Set Layout & Sampul Buku PDF'],
        },
      },
      scopesData: {
        starter: { label: 'Starter / Mendasar', desc: 'Hasil utama untuk bisnis kecil & startup.' },
        pro: { label: 'Profesional / Perkembangan', desc: 'Termasuk file master, variasi lebih banyak & dukungan prioritas.' },
        enterprise: { label: 'Komplit / Tingkat Studio', desc: 'Sistem desain lengkap, penyerahan cepat & revisi tanpa batas.' },
      },
      timelinesData: {
        standard: { label: 'Pengiriman Standar (5-10 Hari)' },
        express: { label: 'Pengiriman Kilat Express (2-4 Hari)' },
      },
    },
  },
  ja: {
  boot: { loading: '最高の体験を準備しています…' },
    nav: {
      home: 'ホーム',
      about: '概要',
      portfolio: '実績',
      services: 'サービス',
      contact: 'お問い合わせ',
      prdDocs: 'PRD & SRS',
      available: 'フリーランス受付中',
    },
    home: {
      heroTitle: '高品質なビジュアル＆デジタルプロダクトの創出',
      heroSubtitle: 'グラフィック＆UIデザイナー • Founder Focal Hyperspace Creative',
      heroTagline: '直感的なデジタルUI/UX、印象的なブランドアイデンティティ、高品質な印刷メディアの制作。',
      heroBio: 'クリエイティブ業界で4年以上の経験を持つ desainer として、機能的なビジュアルソリューションに特化しています。AIとロボティクスのバックグラウンドを活かし、構造化された論理と効率的なテクノロジーを適用して、美しく実用的なデジタルUI/UXおよび印刷メディアを制作します。',
      availableBadge: 'UI/UX＆グラフィック案件を受付中',
      ctaWork: 'プロジェクトを見る',
      ctaContact: 'お問い合わせ',
      quickStats: {
        projects: '完了プロジェクト',
        experience: '実務経験年数',
        satisfaction: '顧客満足度',
        awards: 'デザイン受賞歴',
      },
      featuredHeader: '注目デザイン実績',
      featuredSub: '厳選されたUI/UXケーススタディとブランドアイデンティティ。',
      viewAllWork: '全実績を見る',
      expertiseHeader: 'コアスキルとソフトウェア',
      skillsTitle: 'ソフトウェアツール＆制作スキル',
      skillsSub: 'デザインツールおよびビジュアル制作能力の熟練度内訳。',
      skillsBadge: '熟練度＆ソフトウェア',
      trustHeader: 'Faras Hazidが選ばれる理由',
      trustTitle: '構造化された論理と圧倒的なクリエイティブデザインの融合',
      trustSub: 'AI・ロボティクスのバックグラウンドと4年以上のUI/UX、ブランディング、印刷ノウハウを融合。',
      trustPoints: [
        'ビジネス目標を直感的なUI/UXに昇華',
        '印刷工程でのエラーを防ぐCMYK高精度プリプレス',
        'Figmaによるワイヤーフレームからプロトタイプ構築',
        '単独作業およびチームでのコラボレーションに対応',
      ],
    },
    about: {
      title: '私について',
      subtitle: 'クレイモルフィズムと現代的なUIデザインに情熱を注ぐグラフィック＆UIデザイナー。',
      bioBadge: 'プロフィール・Faras Hazid',
      bioGreeting: 'こんにちは、',
      bioRole: 'GRAPHIC & UI DESIGNER',
      bioFull: 'クリエイティブ業界で4年以上の経験を持つ desainer として、機能的なビジュアルソリューションに特化しています。AIとロボティクスのバックグラウンドを活かし、構造化された論理と効率的なテクノロジーを適用して、美しく実用的なデジタルUI/UXおよび印刷メディアを制作します。',
      bioTitle: 'ストーリーとデザイン哲学',
      downloadCvEn: 'CVダウンロード（英語）',
      downloadCvId: 'CVダウンロード（インドネシア語）',
      story: 'ストーリー',
      education: '学歴',
      educationSub: '学術的基盤および寄宿学校での教育の歩み。',
      leadership: 'リーダーシップと活動',
      workHistory: '職務経歴',
      workHistorySub: 'メディアセンター、UI/UXテック企業、デジタル印刷でのプロフェッショナルな経歴。',
      skillsTools: 'スキルとソフトウェア',
      skillsToolsSub: 'ツール、ソフトウェアの熟練度、デザインマトリックス。',
      designSkillsTitle: 'デザインスキル',
      personalSkillsTitle: 'パーソナルスキル',
      designSkillsList: [
        'ブランディング',
        'レイアウト設計',
        'モバイルアプリ＆Webデザイン',
        'SNS投稿デザイン',
        'ロゴデザイン',
        'サムネイルデザイン',
      ],
      personalSkillsList: [
        '時間管理',
        'クリエイティブ思考',
        'チームワーク',
        '問題解決力',
        '創造性',
        '責任感',
      ],
    },
    portfolio: {
      title: 'ポートフォリオ＆ケーススタディ',
      subtitle: 'デザイン思考、ユーザーリサーチ、ワークフローの詳細な解説。',
      searchPlaceholder: 'プロジェクト名、ツール、キーワードで検索...',
      allCategories: '全プロジェクト',
      viewCaseStudy: 'ケーススタディを見る',
      problem: '課題と問題点',
      workflow: '制作ワークフロー',
      solution: 'デザインソリューション',
      results: '成果と影響',
      toolsUsed: '使用ツール',
      client: 'クライアント',
      year: '制作年',
      role: '担当役割',
      close: '閉じる',
    },
    services: {
      title: 'サービスと透明性の高い料金プラン',
      subtitle: '明確な納品物、透明な投資パッケージ、柔軟なデザインソリューション。',
      coreOfferings: '提供サービス概要',
      pricingTitle: '透明性の高い見積もりパッケージ',
      pricingSub: '固定スコープパッケージを選択するか、カスタム見積もりをご依頼ください。',
      whyChooseTitle: '選ばれる理由 (Focal Hyperspace Creative)',
      faqTitle: 'よくある質問 (FAQ)',
      faqSub: 'プロジェクト開始前に必要な情報をまとめています。',
      orderPackage: 'WhatsAppで見積もりを送信',
      deliverables: '納品物一覧',
      popularBadge: '一番人気の選択肢',
      includedFeaturesLabel: '含まれる機能・納品物:',
      deliveryTimeLabel: '納期:',
      whyChooseItems: [
        {
          title: 'AI＆ロボティクス論理シナジー',
          desc: '構造化された論理と技術的効率を適用し、視覚的に魅力的でインパクトのあるデザインを創出します。',
        },
        {
          title: '開発者ハンドアウト対応',
          desc: '整然としたFigmaワイヤーフレーム、クリック可能なプロトタイプ、開発チーム向けの正確なCSS/Tailwind仕様書。',
        },
        {
          title: '印刷用プレプレス高精度',
          desc: '保証されたDPI解像度、CMYK色分離、バナー・グッズ・ユニフォームの印刷不具合ゼロの実績。',
        },
      ],
      packagesData: {
        'pkg-1': {
          name: 'ブランディング＆ビジュアル・スターター',
          badge: '基本ブランドアイデンティティ',
          period: '1プロジェクトあたり',
          description: 'プロフェッショナルなロゴ、ブランドガイドライン、主要なSNSテンプレートを必要とする小規模事業者向け。',
          deliveryTime: '4営業日',
          features: [
            'ロゴデザイン（2案のコンセプト）',
            'ブランドカラーパレット＆タイポグラフィ規定',
            'SNS投稿＆バナーテンプレート（5投稿分）',
            'ベクターマスターファイル（AI, EPS, SVG, PNG, PDF）',
            '2回の修正対応',
            '4日間のスピード納品',
          ],
        },
        'pkg-2': {
          name: 'UI/UXアプリ＆Webプロトタイプ・プロ',
          badge: '一番人気の選択肢',
          period: '1プロジェクトあたり',
          description: 'インタラクティブなFigmaプロトタイプとワイヤーフレームを備えた、モバイルアプリまたはWebプラットフォームの完全なUI/UXデザイン。',
          deliveryTime: '10営業日',
          features: [
            'エンドツーエンドのユーザー体験＆フローワイヤーフレーム',
            '最大10画面のカスタムUIデザイン',
            'インタラクティブなFigmaクリック可能プロトタイプ',
            'デザインシステムコンポーネント＆トークン',
            '開発者向けハンドアウト（Tailwind / CSS仕様）',
            '3回の修正対応',
            'WhatsAppによる直接相談',
          ],
        },
        'pkg-3': {
          name: 'フルメディア＆印刷メディアパッケージ',
          badge: 'デジタル＆物理メディア完備',
          period: '1プロジェクトあたり',
          description: '包括的なブランディング、SNSスィート、印刷セット（カレンダー、バナー）、およびTシャツ/PDHユニフォームモックアップ。',
          deliveryTime: '14営業日',
          features: [
            '完全なロゴ＆ブランドシステムガイドライン',
            '完全なSNSフィード＆ストーリーセット（15アセット）',
            '印刷セット（カレンダー、バナー、IDカード）',
            '公式Tシャツ＆PDHユニフォーム刺繍モックアップ',
            '印刷用CMYKプロダクション準備完了ファイル',
            'アクティブプロジェクト期間中の無制限修正',
            '優先納品サポート',
          ],
        },
        'pkg-4': {
          name: '月額デザインリテーナー',
          badge: '月額サポート',
          period: '月額',
          description: '毎月のSNSフィード、バナーレイアウト、UI/UX更新のための継続的な専用デザインサポート。',
          deliveryTime: '毎月継続',
          features: [
            '月間20点のカスタムSNS＆ストーリーバナー',
            'UI/UX画面のイテレーション＆Webバナー調整',
            '印刷アセットレイアウト（チラシ、ステッカー、グッズ）',
            '24〜48時間の迅速なリクエスト対応',
            'WhatsAppによる優先ダイレクトコミュニケーション',
          ],
        },
      },
      coreServicesData: {
        'srv-1': {
          title: 'UI/UX＆モバイルアプリデザイン',
          description: 'FigmaやAdobe Xdを使用して、ビジネスニーズを直感的なデジタルインターフェースデザインに昇華させます。',
          deliverables: ['ワイヤーフレーム＆情報アーキテクチャ', 'Figmaインタラクティブプロトタイプ', 'レスポンシブレイアウト', '開発用トークン'],
        },
        'srv-2': {
          title: 'ブランディング＆ロゴシステム',
          description: '記憶に残るビジュアルアイデンティティ、ロゴマーク、タイポグラフィ規格、ブランドガイドブックを制作します。',
          deliverables: ['プライマリ＆セカンダリロゴマーク', 'ブランドアイデンティティガイドライン', 'ベクターアセット（AI, SVG, PDF）', 'カラー＆タイポトークン'],
        },
        'srv-3': {
          title: 'ソーシャルメディア＆グラフィックメディア',
          description: '毎日のデジタルコンテンツ、Instagramストーリーキャンペーン、書籍カバーイラスト、サムネイルデザインを制作。',
          deliverables: ['SNSフィード＆ストーリー', '書籍・電子書籍カバーアート', 'サムネイルデザイン', 'デジタルイベントバナー'],
        },
        'srv-4': {
          title: '印刷メディア＆オリジナルグッズセット',
          description: '印刷前のファイル最適化、CMYK色補正、バナー、カレンダー、Tシャツプリント、公式PDHユニフォームの制作。',
          deliverables: ['CMYK印刷用データ', 'カレンダー＆IDカードセット', 'Tシャツ＆イベントグッズ', 'PDHユニフォームモックアップ'],
        },
      },
    },
    contact: {
      title: '理想のプロジェクトを共に制作しましょう',
      subtitle: 'プロジェクトのご相談、採用のご案内、3D UIデザインの依頼はお気軽にどうぞ。',
      formTitle: 'メッセージを送る',
      nameLabel: 'お名前',
      emailLabel: 'メールアドレス',
      phoneLabel: 'WhatsApp番号（任意）',
      serviceLabel: 'ご希望のサービス',
      budgetLabel: '想定ご予算',
      messageLabel: 'プロジェクト詳細・目的',
      sendBtn: '送信する',
      sendWaBtn: 'WhatsAppでクイック注文',
      directContact: '直接連絡先',
      socials: 'SNSアカウント',
    },
    admin: {
      secretGateTitle: 'シークレット Headless CMS 管理ゲート',
      secretGateDesc: 'コンテンツ管理とライブバックエンド用の保護エリア。',
      enterPin: '管理者パスコードを入力',
      unlockBtn: 'ダッシュボードを解除',
      dashboardTitle: 'ClayFolio Headless CMS ダッシュボード',
      manageProjects: 'プロジェクト管理 (CRUD)',
      manageServices: 'サービス・プラン',
      manageExperiences: '経歴・ストーリー',
      manageSkills: 'スキル・ツール',
      manageFaqs: 'FAQ管理',
      manageMessages: 'お問い合わせ一覧',
      analytics: 'アクセス解析',
      zeroCostGuide: '完全無料ホスティングガイド',
    },
    common: {
      close: '閉じる',
      save: '保存',
      delete: '削除',
      edit: '編集',
      add: '新規追加',
      loading: '読み込み中...',
      copied: 'クリップボードにコピーしました！',
    },
    dualBrand: {
      badge: 'デュアルパーパス・ハブ',
      title: 'ようこそ！企業採用担当者様、またはフリーランスのクライアント様ですか？',
      description: 'このWebサイトは、ファラス・ハジド（Faras Hazid）の職務経歴書・ポートフォリオ（企業のグラフィック＆UIデザイナー採用向け）と、Focal Hyperspace Creative（フリーランス受託・デザインサービス向け）の両方の窓口として機能します。',
      corporateTag: '企業採用',
      corporateBtn: '履歴書・職務経歴書を見る',
      freelanceTag: 'Focal Hyperspace',
      freelanceBtn: 'デザインサービスを注文する',
    },
    workflow: {
      badge: 'Focal Hyperspace クリエイティブワークフロー',
      title: '透明性の高い構造化された制作プロセス',
      subtitle: 'すべてのデザインプロジェクトは体系的に進行され、高精度なビジュアルと確実な納期、そして実質的なビジネスインパクトを保証します。',
      steps: [
        {
          step: '01',
          title: 'ヒアリング＆要件定義',
          subtitle: 'リサーチ＆方向性の確認',
          desc: 'ヒアリングシート回収、ターゲット分析、ビジネス目標の設定、デザインの方向性と技術仕様の確定。',
          deliverable: 'デザインブリーフ＆方向性',
        },
        {
          step: '02',
          title: 'ワイヤーフレーム＆コンセプト構想',
          subtitle: '情報設計＆ビジュアル探索',
          desc: 'ハイフィデリティデザインに進む前のFigmaワイヤーフレーム制作および初期ベクター案の構築。',
          deliverable: 'Figmaワイヤーフレーム＆ベクター案',
        },
        {
          step: '03',
          title: 'ビジュアルデザイン＆フィードバック',
          subtitle: 'ブラッシュアップ＆迅速な改善',
          desc: 'カラーシステム、タイポグラフィ、UIインタラクションの適用と、フィードバックに基づく調整。',
          deliverable: '完成UI・ブランドアセット',
        },
        {
          step: '04',
          title: '納品＆マスターデータ引き渡し',
          subtitle: '完成データとベクターファイルの納品',
          desc: 'そのまま利用できる納品データ（Figmaトークン、AI/EPS/SVGベクターマスター、CMYK印刷用PDF）の納品。',
          deliverable: 'マスターデータ AI/EPS/SVG/Figma',
        },
      ],
    },
    calculator: {
      badge: 'Focal Hyperspace Creative • プロジェクト見積もり電卓',
      title: 'デザインプロジェクト見積もり計算ツール',
      subtitle: 'グラフィックデザインやUI/UXプロジェクトの概算費用と納期をその場でリアルタイムに計算できます。',
      trustTitle: '透明性の高い見積もり',
      trustSub: '修正保証＆ベクターマスターデータ付き',
      step1: '1. デザインサービスの種類を選択',
      step2: '2. プロジェクトの規模と範囲',
      step3: '3. 制作スピード（納期）',
      summaryBadge: 'Focal Hyperspace Creative 概算見積もり',
      deliverablesHeader: '含まれる納品成果物:',
      sendWaBtn: 'WhatsAppで見積もりを送信',
      startingFrom: 'から',
      step4: '連絡先（任意）',
      contactNameLabel: 'お名前',
      contactPhoneLabel: 'WhatsApp番号',
      contactHint: '推奨 — 見積りを返信できるよう連絡先をご入力ください',
      rangeLabel: '見積もり範囲',
      quoteNote: '概算見積 — 無料ヒアリング後に正式見積もり',
      servicesData: {
        'brand-identity': {
          name: 'ロゴ＆ブランドアイデンティティシステム',
          deliverables: ['ベクターロゴマーク（AI, EPS, SVG）', 'ブランドカラー＆タイポグラフィ規定', 'ブランドガイドラインシート（PDF）', 'SNSアバター＆ヘッダーセット'],
        },
        'uiux-mobile-web': {
          name: 'UI/UXモバイルアプリ＆Webデザイン',
          deliverables: ['エンドツーエンドユーザー体験フロー', 'Figmaクリック可能プロトタイプ', 'コンポーネントデザインシステムトークン', '開発者向け仕様書'],
        },
        'social-media': {
          name: 'ソーシャルメディア＆グラフィックバナー',
          deliverables: ['10点の高コンバージョン投稿/ストーリー', '編集可能Figmaソーステンプレート', '高解像度PNG/JPG書き出し', 'カスタムタイポグラフィレイアウト'],
        },
        'print-prepess': {
          name: '印刷レイアウト＆プレプレスセット',
          deliverables: ['CMYKプレプレス準備完了データ', '裁ち落とし＆トンボ位置調整', 'PDHユニフォーム＆グッズ用ベクター', 'PDF書籍カバー＆レイアウトデータ'],
        },
      },
      scopesData: {
        starter: { label: 'スターター / 基本', desc: '小規模事業者およびスタートアップ向けの基本成果物。' },
        pro: { label: 'プロフェッショナル / 成長', desc: 'マスターファイル、拡張バリエーション、優先サポートが含まれます。' },
        enterprise: { label: 'コンプリート / スタジオレベル', desc: 'フルデザインシステム、迅速な引き渡し、無制限の修正。' },
      },
      timelinesData: {
        standard: { label: '標準納期 (5〜10日)' },
        express: { label: '特急納期 (2〜4日)' },
      },
    },
  },
  ar: {
  boot: { loading: 'نحضّر أفضل تجربة…' },
    nav: {
      home: 'الرئيسية',
      about: 'عني',
      portfolio: 'الأعمال',
      services: 'الخدمات',
      contact: 'التواصل',
      prdDocs: 'مستندات PRD & SRS',
      available: 'متاح للعمل الحر',
    },
    home: {
      heroTitle: 'ابتكار تصاميم بصرية عالية التحويل ومنتجات رقمية',
      heroSubtitle: 'مصمم جرافيك وواجهات مستخدم • مؤسس Focal Hyperspace Creative',
      heroTagline: 'تحويل الأفكار والاحتياجات إلى واجهات رقمية سهلة الاستخدام، هويات بصرية مميزة، ومطبوعات عالية الجودة.',
      heroBio: 'أنا مصمم لدي أكثر من أربع سنوات من الخبرة في الصناعة الإبداعية، متخصص في الحلول البصرية الوظيفية. أربط بين احتياجات الأعمال والتصميم الرقمي (UI/UX) والوسائط المطبوعة. مع خلفية في الذكاء الاصطناعي والروبوتات، أطبق المنطق الهيكلي والفاعلية التكنولوجية لإنشاء تصاميم جمالية وذات أثر ملموس.',
      availableBadge: 'متاح لمشاريع UI/UX والتصميم الجرافيكي',
      ctaWork: 'استكشف المشاريع',
      ctaContact: 'تواصل معي',
      quickStats: {
        projects: 'مشروع مكتمل',
        experience: 'سنوات خبرة',
        satisfaction: 'رضا العملاء',
        awards: 'جوائز تصميم',
      },
      featuredHeader: 'أبرز أعمال التصميم',
      featuredSub: 'دراسات حالة مختارة لواجهات المستخدم والهويات البصرية.',
      viewAllWork: 'عرض جميع المشاريع',
      expertiseHeader: 'المهارات والبرامج الإبداعية',
      skillsTitle: 'أدوات البرامج وإتقان التصميم',
      skillsSub: 'توزيع كمي لمستوى الإتقان التقني في برامج التصميم معايير الصناعة.',
      skillsBadge: 'الإتقان وأدوات البرامج',
      trustHeader: 'لماذا الشراكة مع فاراس حزيد',
      trustTitle: 'المنطق الهيكلي يتلاقى مع التميز الإبداعي',
      trustSub: 'دمج خلفية الذكاء الاصطناعي والروبوتات مع أكثر من 4 سنوات من الخبرة في UI/UX والهوية والطباعة.',
      trustPoints: [
        'ربط أهداف العمل بواجهات UI/UX سلسة',
        'دقة ألوان CMYK للطباعة لتجنب عيوب الإنتاج',
        'مخططات Figma الهيكلية إلى نماذج تفاعلية',
        'القدرة على العمل بشكل مستقل أو التعاون ضمن فريق',
      ],
    },
    about: {
      title: 'نبذة عني',
      subtitle: 'مصمم جرافيك وواجهات شغوف بأسلوب Claymorphic والتصميم الحديث.',
      bioBadge: 'السيرة الذاتية • فاراس حزيد',
      bioGreeting: 'أهلاً، أنا',
      bioRole: 'GRAPHIC & UI DESIGNER',
      bioFull: 'أنا مصمم لدي أكثر من أربع سنوات من الخبرة في الصناعة الإبداعية، متخصص في الحلول البصرية الوظيفية. أربط بين احتياجات الأعمال والتصميم الرقمي (UI/UX) والوسائط المطبوعة. مع خلفية في الذكاء الاصطناعي والروبوتات، أطبق المنطق الهيكلي والفاعلية التكنولوجية لإنشاء تصاميم جمالية وذات أثر ملموس.',
      bioTitle: 'القصة الشخصية والسيطرة',
      downloadCvEn: 'تحميل السيرة الذاتية (الإنجليزية)',
      downloadCvId: 'تحميل السيرة الذاتية (الإندونيسية)',
      story: 'القصة',
      education: 'التاريخ الأكاديمي',
      educationSub: 'الأساس الأكاديمي والتسلسل الزمني للتعليم الإسلامي.',
      leadership: 'القيادة والمجتمع',
      workHistory: 'سجل الخبرة العملية',
      workHistorySub: 'رحلة مهنية عبر المراكز الإعلامية وشركات تقنية UI/UX والطباعة الرقمية.',
      skillsTools: 'خبرة البرامج والأدوات',
      skillsToolsSub: 'الأدوات، إتقان البرامج، ومصفوفة قدرات التصميم.',
      designSkillsTitle: 'مهارات التصميم',
      personalSkillsTitle: 'المهارات الشخصية',
      designSkillsList: [
        'الهوية البصرية',
        'تنسيق الصفحات',
        'تصميم التطبيقات والويب',
        'منشورات التواصل الاجتماعي',
        'تصميم الشعارات',
        'تصميم المصغرات',
      ],
      personalSkillsList: [
        'إدارة الوقت',
        'التفكير الإبداعي',
        'العمل الجماعي',
        'حل المشكلات',
        'الابتكار',
        'المسؤولية',
      ],
    },
    portfolio: {
      title: 'معرض الأعمال ودراسات الحالة',
      subtitle: 'تفصيل كامل للتفكير التصميمي، أبحاث المستخدم، سير العمل وحل المشكلات.',
      searchPlaceholder: 'ابحث عن مشروع بالاسم، الأداة أو الكلمات المفتاحية...',
      allCategories: 'جميع المشاريع',
      viewCaseStudy: 'عرض دراسة الحالة',
      problem: 'التحدي والمشكلة',
      workflow: 'خطوات سير العمل',
      solution: 'الحل التصميمي',
      results: 'النتائج والأثر الرئيسي',
      toolsUsed: 'الأدوات المستخدمة',
      client: 'العميل / الشركة',
      year: 'السنة',
      role: 'دوري في المشروع',
      close: 'إغلاق دراسة الحالة',
    },
    services: {
      title: 'الخدمات والباقات الشفافة',
      subtitle: 'مخرجات واضحة، مستويات إستثمار شفافة، وحلول تصميم مخصصة.',
      coreOfferings: 'الخدمات الأساسية',
      pricingTitle: 'باقات الأسعار الشفافة',
      pricingSub: 'اختر باقة ذات نطاق محدد أو اطلب عرض سعر مخصص لشركتك.',
      whyChooseTitle: 'لماذا تختار Focal Hyperspace Creative',
      faqTitle: 'الأسئلة الشائعة (FAQ)',
      faqSub: 'كل ما تحتاج لمعرفته حول العمل معنا.',
      orderPackage: 'اطلب عبر WhatsApp',
      deliverables: 'المخرجات المضمنة',
      popularBadge: 'الخيار الأكثر شعبية',
      includedFeaturesLabel: 'الميزات والمخرجات المضمنة:',
      deliveryTimeLabel: 'مدة التسليم:',
      whyChooseItems: [
        {
          title: 'تآزر منطق الذكاء الاصطناعي والروبوتات',
          desc: 'تطبيق المنطق الهيكلي والكفاءة التقنية لإنشاء تصميمات جذابة بصرية وذات أثر ملموس.',
        },
        {
          title: 'جاهز للتسليم للمطورين',
          desc: 'هياكل Figma سلكية منظمة، نماذج تفاعلية، ومواصفات CSS/Tailwind دقيقة جاهزة للفرق الهندسية.',
        },
        {
          title: 'دقة تجهيز الطباعة',
          desc: 'دقة تفكيك ألوان CMYK معتمدة، وضمان عدم وجود عيوب طباعة في البانرات والزي الرسمي.',
        },
      ],
      packagesData: {
        'pkg-1': {
          name: 'باقة الهوية البصرية المبتدئة',
          badge: 'هوية بصرية أساسية',
          period: 'لكل مشروع',
          description: 'مثالية للأعمال الصغيرة والمؤسسات التي تحتاج لرمز احترافي، دليل هوية، وقوالب وسائل تواصل.',
          deliveryTime: '4 أيام عمل',
          features: [
            'تصميم شعار (مفهومان مختلفان)',
            'لوحة ألوان الهوية وقواعد الخطوط',
            'قوالب منشورات وبانرات وسائل التواصل (5 منشورات)',
            'ملفات المصدر الموجهة (AI, EPS, SVG, PNG, PDF)',
            'جولتان من التعديلات',
            'تسليم سريع خلال 4 أيام',
          ],
        },
        'pkg-2': {
          name: 'احترافي واجهات UI/UX والتطبيقات',
          badge: 'الخيار الأكثر شعبية',
          period: 'لكل مشروع',
          description: 'تصميم UI/UX كامل للتطبيقات أو المواقع مع نماذج Figma تفاعلية وهياكل سلكية.',
          deliveryTime: '10 أيام عمل',
          features: [
            'تخطيط تجربة المستخدم وهيكلة التدفق',
            'حتى 10 شاشات تطبيق مخصصة',
            'نموذج تفاعلي قابل للنقر على Figma',
            'مكونات نظام التصميم ورموز الخطوط',
            'ملف تسليم المطورين (مواصفات Tailwind / CSS)',
            '3 جولات من التعديلات',
            'استشارة مباشرة عبر WhatsApp',
          ],
        },
        'pkg-3': {
          name: 'باقة الوسائط الكاملة والطباعة',
          badge: 'شاملة رقمية وفعلية',
          period: 'لكل مشروع',
          description: 'هوية بصرية كاملة، حزمة وسائل تواصل، مجموعات طباعة (تقويم، بانرات)، ونماذج أزياء رسمية.',
          deliveryTime: '14 يوم عمل',
          features: [
            'دليل كامل لنظام الهوية والشعار',
            'حزمة منشورات وقصص التواصل الاجتماعي (15 أصل)',
            'مجموعة طباعة (تقويمات، بانرات، بطاقات)',
            'نماذج مطرزة للزي الرسمي والقمصان',
            'ملفات جاهزة للطباعة بنظام CMYK',
            'تعديلات غير محدودة أثناء المشروع النشط',
            'أولوية التسليم',
          ],
        },
        'pkg-4': {
          name: 'الاشتراك الشهري للتصميم',
          badge: 'دعم شهري',
          period: 'شهرياً',
          description: 'دعم تصميم مخصص مستمر لمنشورات وسائل التواصل الشهرية، تخطيطات البانرات، وتحديثات UI/UX.',
          deliveryTime: 'مستمر شهرياً',
          features: [
            '20 بانر مخصص للتواصل والقصص شهرياً',
            'تعديلات شاشات UI/UX وتكيفات بانرات Web',
            'تخطيطات أصول الطباعة (منشورات، ملصقات، هدايا)',
            'تسليم سريع للطلبات خلال 24-48 ساعة',
            'تواصل أولوية مباشر عبر WhatsApp',
          ],
        },
      },
      coreServicesData: {
        'srv-1': {
          title: 'تصميم واجهات UI/UX والتطبيقات',
          description: 'ربط احتياجات الأعمال بواجهات رقمية سهلة الاستخدام للتطبيقات والمواقع باستخدام Figma و Adobe Xd.',
          deliverables: ['الهياكل السلكية وبنية المعلومات', 'نماذج Figma التفاعلية', 'التخطيط المتجاوب', 'رموز جاهزة للمطورين'],
        },
        'srv-2': {
          title: 'أنظمة الهوية البصرية والشعارات',
          description: 'ابتكار هوية بصرية مميزة، رموز شعارات، معايير خطوط، وكتب الهوية التي تترك أثراً حقيقياً.',
          deliverables: ['الشعار الرئيسي والفرعي', 'إرشادات الهوية البصرية', 'ملفات موجهة (AI, SVG, PDF)', 'رموز الألوان والخطوط'],
        },
        'srv-3': {
          title: 'وسائل التواصل والوسائط Grafis',
          description: 'إنتاج محتوى رقمي يومي، حملات قصص إنستغرام، رسوم أغلفة الكتب، وتصاميم الصور المصغرة.',
          deliverables: ['منشورات وقصص التواصل الاجتماعي', 'تصميم أغلفة الكتب الإلكترونية', 'تصميم الصور المصغرة', 'بانرات الفعاليات الرقمية'],
        },
        'srv-4': {
          title: 'الطباعة الفعلية وتجهيز المنتجات',
          description: 'خبرة في تحسين ملفات الطباعة، تصحيح الألوان CMYK، البانرات، التقويمات، والزي الرسمي.',
          deliverables: ['ملفات جاهزة للطباعة CMYK', 'مجموعات التقويم وبطاقات الهوية', 'قمصان وهدايا الفعاليات', 'نماذج الزي الرسمي PDH'],
        },
      },
    },
    contact: {
      title: 'لنصنع شيئاً أيقونياً معاً',
      subtitle: 'هل لديك فكرة مشروع أو فرصة عمل أو تحتاج لتصاميم UI 3D خاصة؟ تواصل معي اليوم.',
      formTitle: 'إرسال رسالة مباشرة',
      nameLabel: 'الاسم الكامل',
      emailLabel: 'البريد الإلكتروني',
      phoneLabel: 'رقم WhatsApp (اختياري)',
      serviceLabel: 'الخدمة المطلوبة',
      budgetLabel: 'الميزانية التقديرية',
      messageLabel: 'تفاصيل وأهداف المشروع',
      sendBtn: 'إرسال الرسالة',
      sendWaBtn: 'طلب سريع عبر WhatsApp',
      directContact: 'معلومات الاتصال المباشرة',
      socials: 'تجدني أونلاين',
    },
    admin: {
      secretGateTitle: 'بوابة الإدارة السريّة CMS Headless',
      secretGateDesc: 'منطقة محمية لإدارة المحتوى وحالة الخادم.',
      enterPin: 'أدخل رمز المرور السري للإدارة',
      unlockBtn: 'فتح لوحة التحكم',
      dashboardTitle: 'لوحة تحكم ClayFolio Headless CMS',
      manageProjects: 'إدارة المشاريع (CRUD)',
      manageServices: 'الخدمات والباقات',
      manageExperiences: 'الخبرات والقصة',
      manageSkills: 'المهارات والأدوات',
      manageFaqs: 'إدارة الأسئلة الشائعة',
      manageMessages: 'الرسائل والاستفسارات',
      analytics: 'تحليلات الزوار',
      zeroCostGuide: 'دليل الاستضافة المجانية $0',
    },
    common: {
      close: 'إغلاق',
      save: 'حفظ التغيرات',
      delete: 'حذف',
      edit: 'تعديل',
      add: 'إضافة عنصر جديد',
      loading: 'جاري التحميل...',
      copied: 'تم النسخ للحافظة!',
    },
    dualBrand: {
      badge: 'مركز شخصي واستوديو مزدوج الغرض',
      title: 'أهلاً بك! هل أنت مسؤول توظيف في شركة أم عميل للعمل الحر؟',
      description: 'يعمل هذا الموقع كمعرض أعمال وسيرة ذاتية احترافية لـ Faras Hazid (لوظائف مصمم الجرافيك و UI) وكاستوديو Focal Hyperspace Creative (لخدمات العمل الحر وباقات التصميم).',
      corporateTag: 'توظيف للشركات',
      corporateBtn: 'عرض السيرة الذاتية وطلب العمل',
      freelanceTag: 'Focal Hyperspace',
      freelanceBtn: 'طلب الخدمات وباقات التصميم',
    },
    workflow: {
      badge: 'سير العمل في Focal Hyperspace Creative',
      title: 'عملية منظمة وشفافة',
      subtitle: 'يتم تنفيذ كل مشروع تصميم بشكل منهجي لضمان الدقة البصرية العالية والتسليم في الوقت المحدد وتأثير تجاري حقيقي.',
      steps: [
        {
          step: '01',
          title: 'الاكتشاف وتحليل المتطلبات',
          subtitle: 'البحث ومناقشة الاحتياجات',
          desc: 'جمع المتطلبات، تحليل الجمهور المستهدف، تحديد أهداف العمل، وتحديد الاتجاه الجمالي والمواصفات.',
          deliverable: 'ملخص التصميم والاتجاه الإبداعي',
        },
        {
          step: '02',
          title: 'الهيكل والإنشاء الأولي',
          subtitle: 'تخطيط المعلومات والتصميم',
          desc: 'إنشاء التخطيط الهيكلي في Figma أو الرسومات الموجهة الأولية قبل البدء في التصميم البصري عالي الدقة.',
          deliverable: 'تخطيط Figma والرسومات الموجهة',
        },
        {
          step: '03',
          title: 'التصميم البصري والتحسين',
          subtitle: 'التلميع والتطوير المستمر',
          desc: 'تطبيق أنظمة الألوان، الخطوط، تفاعلات واجهة المستخدم، وتحسين التفاصيل بناءً على ملاحظاتك.',
          deliverable: 'تصميم واجهة المستخدم والأصول',
        },
        {
          step: '04',
          title: 'تسليم الملفات النهائية',
          subtitle: 'تسليم الملفات الموجهة الأساسية',
          desc: 'تسليم الملفات الجاهزة للاستخدام (Figma tokens، AI/EPS/SVG الموجهة، وملفات PDF للطباعة).',
          deliverable: 'الملفات الأساسية AI/EPS/SVG/Figma',
        },
      ],
    },
    calculator: {
      badge: 'Focal Hyperspace Creative • حاسبة تكلفة المشروع',
      title: 'أداة تقدير تكلفة ومدة مشروع التصميم',
      subtitle: 'احسب الميزانية التقديرية ومدة الإنجاز لمشاريع التصميم الجرافيكي أو UI/UX فورياً.',
      trustTitle: 'شفافة ومناسبة للميزانية',
      trustSub: 'تتضمن ضمان التعديلات وملفات المصدر الموجهة',
      step1: '1. اختر نوع خدمة التصميم',
      step2: '2. نطاق واكتمال المشروع',
      step3: '3. سرعة الإنجاز (مدة التسليم)',
      summaryBadge: 'تقدير مع FOCAL HYPERSPACE CREATIVE',
      deliverablesHeader: 'المخرجات المضمنة:',
      sendWaBtn: 'إرسال التقدير عبر WhatsApp',
      startingFrom: 'تبدأ من',
      step4: 'معلومات الاتصال (اختياري)',
      contactNameLabel: 'اسمك',
      contactPhoneLabel: 'رقم واتساب',
      contactHint: 'موصى به — حتى نرسل لك عرض السعر',
      rangeLabel: 'نطاق التقدير',
      quoteNote: 'تقدير مبدئي — السعر النهائي بعد مناقشة مجانية',
      servicesData: {
        'brand-identity': {
          name: 'نظام الشعار والهوية البصرية',
          deliverables: ['رموز شعار موجهة (AI, EPS, SVG)', 'لوحة ألوان وقواعد الخطوط', 'دليل الهوية البصرية (PDF)', 'مجموعات صور وملفات التواصل'],
        },
        'uiux-mobile-web': {
          name: 'تصميم واجهات UI/UX للموبايل والويب',
          deliverables: ['تدفق تجربة المستخدم الكاملة', 'نموذج Figma تفاعلي قابل للنقر', 'رموز مكونات نظام التصميم', 'مواصفات التسليم للمطورين'],
        },
        'social-media': {
          name: 'بانرات الوسائط والتواصل الاجتماعي',
          deliverables: ['10 تصميمات منشورات/قصص عالية التحويل', 'قوالب Figma مصدري قابلة للتعديل', 'تصدير صور عالية الدقة PNG/JPG', 'خطوط وتخطيطات إعلانية مخصصة'],
        },
        'print-prepess': {
          name: 'تخطيط الطباعة ومجموعة Pre-Press',
          deliverables: ['ملفات CMYK جاهزة للطباعة', 'محاذاة علامات القص والنزيف', 'تصاميم الزي الرسمي والهدايا الموجهة', 'تصاميم أغلفة الكتب والصفحات PDF'],
        },
      },
      scopesData: {
        starter: { label: 'مبتدئ / أساسي', desc: 'المخرجات الأساسية للشركات الناشئة والأعمال الصغيرة.' },
        pro: { label: 'احترافي / نمو', desc: 'يتضمن ملفات المصدر، تنوعات إضافية، ودعم أولوية.' },
        enterprise: { label: 'شامل / مستوى الاستوديو', desc: 'نظام تصميم كامل، تسليم سريع، وتعديلات غير محدودة.' },
      },
      timelinesData: {
        standard: { label: 'تسليم قياسي (5-10 أيام)' },
        express: { label: 'تسليم سريع عاجل (2-4 أيام)' },
      },
    },
  },
};
