import { Project, PricingPackage, ServiceOffering, ExperienceItem, SkillItem, FaqItem, AnalyticsData, EstimatorServiceOption, EstimatorScopeOption, EstimatorTimelineOption, SiteSettings } from '../types';


export const initialProjects: Project[] = [
  {
    id: 'proj-1',
    title: 'EluckyGame App Mobile & Web Platform',
    subtitle: 'Game E-Commerce & Interactive Rewards UI/UX',
    category: 'UI/UX Design',
    thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    ],
    client: 'PT. Elucky Game Technology Asia',
    year: '2024 - 2025',
    role: 'UI/UX Designer',
    summary: 'End-to-end mobile app and web portal design for Indonesia’s first Game E-commerce application featuring interactive rewards, wireframes, and Figma prototypes.',
    problemStatement: 'E-commerce users experienced friction during multi-step game token transactions and reward redemption flows.',
    workflowSteps: [
      {
        title: '1. Wireframing & Information Architecture',
        description: 'Constructed low-fidelity and high-fidelity wireframes in Figma to structure gaming rewards, daily tasks, and checkout steps.',
      },
      {
        title: '2. UX Optimization & Convenience',
        description: 'Simplified navigation hierarchy to reduce transaction clicks by 35% and enhanced mobile responsiveness across web/app viewports.',
      },
      {
        title: '3. Developer Technical Synergy',
        description: 'Collaborated closely with engineering teams to ensure pixel-perfect design implementation and smooth micro-interactions.',
      },
    ],
    solution: 'Created an engaging, vibrant game-centric e-commerce experience with interactive reward redemption cards and high-conversion UI flows.',
    results: [
      '+45% User Retention Rate',
      'Improved transaction flow convenience',
      'Seamless mobile & desktop web synchronization',
    ],
    tools: ['Figma', 'Adobe Xd', 'Adobe Photoshop', 'Tailwind CSS'],
    liveUrl: 'https://wa.me/6285143541287',
    featured: true,
  },
  {
    id: 'proj-2',
    title: 'Website Masjid Nurul Musthofa Center',
    subtitle: 'Mosque Digital Portal & Community Information Web System',
    category: 'UI/UX Design',
    thumbnail: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=1200&q=80',
    ],
    client: 'Nurul Musthofa Media Center',
    year: '2025 - 2026',
    role: 'Media & Branding Lead / UI Designer',
    summary: 'Comprehensive web design portal for Masjid Nurul Musthofa Center featuring video hero section, event schedules, donation channels, and congregation updates.',
    problemStatement: 'The congregation lacked a centralized digital platform to check upcoming Islamic events, prayer schedules, and official donation records.',
    workflowSteps: [
      {
        title: '1. Brand Modernization & Visual Standards',
        description: 'Modernized the mosque’s visual identity with clean Islamic geometric motifs and soft blue-green color harmony.',
      },
      {
        title: '2. Responsive Portal & Video Showcase',
        description: 'Designed a desktop and mobile web portal with video hero integrations and organized event calendars.',
      },
    ],
    solution: 'Built a serene, modern digital portal bridging traditional congregational values with accessible digital web interfaces.',
    results: [
      '+200% Increase in Congregational Engagement',
      'Streamlined digital donation and event information distribution',
    ],
    tools: ['Figma', 'Adobe Illustrator', 'WordPress', 'Tailwind CSS'],
    liveUrl: 'https://wa.me/6285143541287',
    featured: true,
  },
  {
    id: 'proj-3',
    title: 'Brand Identity & Logo Design Collection',
    subtitle: 'Comprehensive Logo Systems for Organizations & Businesses',
    category: 'Graphic & Brand',
    thumbnail: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=1200&q=80',
    ],
    client: 'Various Clients (Nurul Musthofa, HIMAIRO, Kemas Digital, etc.)',
    year: '2022 - 2026',
    role: 'Graphic Designer',
    summary: 'Collection of brand logos created for Haul Akbar Tuan Guru, Pusat Informasi NM, Kemas Digital Printing, SegalaBaca.ID, and HIMAIRO Robotics Student Association.',
    problemStatement: 'Brands required distinctive, scalable vector logomarks that maintain legibility across physical print banners and small mobile screen icons.',
    workflowSteps: [
      {
        title: '1. Concept Sketching & Vector Geometry',
        description: 'Explored arabic calligraphy grid structures, geometric typography, and iconic symbols in Adobe Illustrator.',
      },
      {
        title: '2. Brand Guidelines & Color Palettes',
        description: 'Defined primary and secondary brand palettes, clear space rules, and application mockups.',
      },
    ],
    solution: 'Delivered timeless, versatile logomarks with vector precision for diverse industries ranging from Islamic media to AI robotics.',
    results: [
      '15+ Logomarks deployed in physical & digital media',
      '100% Client satisfaction across print & web assets',
    ],
    tools: ['Adobe Illustrator', 'Adobe Photoshop', 'Figma'],
    featured: true,
  },
  {
    id: 'proj-4',
    title: 'Book Cover Series & Ebook Design',
    subtitle: 'Creative Graphic Design for Books & Digital Publications',
    category: 'Graphic & Brand',
    thumbnail: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80',
    ],
    client: 'Majelis Nurul Musthofa & Independent Authors',
    year: '2023 - 2026',
    role: 'Graphic Designer & Illustrator',
    summary: 'Custom book cover designs including "Kumpulan Qosidah", "Red Flag & Green Flag", "Seni Mengatur Uang Dengan Hati", and "5 Cara Biar Ga Mager Seharian".',
    problemStatement: 'Authors needed eye-catching cover graphics that immediately communicate book themes and appeal to modern readers.',
    workflowSteps: [
      {
        title: '1. Visual Metaphor & Character Illustration',
        description: 'Created custom vector character art and typographic hierarchy matching the emotional tone of each book.',
      },
    ],
    solution: 'Designed memorable book covers optimized for physical bookstore displays and Amazon/Ebook thumbnail previews.',
    results: ['Published in physical bookstores & digital ebook platforms'],
    tools: ['Adobe Photoshop', 'Adobe Illustrator'],
    featured: false,
  },
  {
    id: 'proj-5',
    title: 'Social Media & Insta Story Suite',
    subtitle: 'Digital Content Creation & Campaign Feeds',
    category: 'Graphic & Brand',
    thumbnail: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=1200&q=80',
    ],
    client: 'Nurul Musthofa Media Center & Event Promoters',
    year: '2024 - 2026',
    role: 'Media Lead',
    summary: 'High-impact social media campaign graphics, Instagram stories, and event posters for Nuzulul Qur’an, Gema Ramadhan, and Haul Habib Musthofa.',
    problemStatement: 'Promotional event flyers needed to stand out in fast-scrolling mobile feeds and convey key dates clearly.',
    workflowSteps: [
      {
        title: '1. Daily Content Production',
        description: 'Produced daily digital content, event countdown stories, and live activity documentations.',
      },
    ],
    solution: 'Vibrant, structured social templates with strong contrast and readable event schedules.',
    results: ['Over 100,000+ total social media impressions'],
    tools: ['Adobe Photoshop', 'Adobe Illustrator', 'Figma'],
    featured: false,
  },
  {
    id: 'proj-6',
    title: 'Printing Set, T-Shirt & PDH Uniform Design',
    subtitle: 'Physical Merchandising & Official Team Uniforms',
    category: 'Graphic & Brand',
    thumbnail: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80',
    ],
    client: 'Kemaslayatama Digital Printing & Muhibbin Nurul Musthofa',
    year: '2022 - 2026',
    role: 'Graphic Design Operator',
    summary: 'Production-ready print sets, calendar cards, Eid greeting banners, Haul Akbar event t-shirts, and official green PDH long-sleeve uniform mockups.',
    problemStatement: 'Required exact pre-printing file resolution, color separation (CMYK), and plotter machine alignment for flawless physical production.',
    workflowSteps: [
      {
        title: '1. Pre-Printing & Color Optimization',
        description: 'Optimized file DPI resolution and color profiles to guarantee vibrant print quality on fabrics and vinyl banners.',
      },
    ],
    solution: 'Designed professional merchandise and uniforms with durable embroidery and screen-print layouts.',
    results: ['Zero pre-press manufacturing defects across 1,000+ printed units'],
    tools: ['Adobe Illustrator', 'Adobe Photoshop', 'CorelDRAW'],
    featured: false,
  },
];

export const initialPricingPackages: PricingPackage[] = [
  {
    id: 'pkg-1',
    name: 'Branding & Visual Starter',
    badge: 'Essential Brand Identity',
    priceUSD: 250,
    priceIDR: 'Rp 3.500.000',
    period: 'per project',
    description: 'Ideal for small businesses and organizations needing a professional logo, brand guidelines, and key social media templates.',
    features: [
      'Logo Design (2 Concept Variations)',
      'Brand Color Palette & Typography Rules',
      'Social Media Post & Banner Templates (5 Posts)',
      'Vector Source Files (AI, EPS, SVG, PNG, PDF)',
      '2 Rounds of Revisions',
      '4 Days Fast Delivery',
    ],
    recommendedFor: 'Startups, Small Businesses, Event Promoters',
    deliveryTime: '4 Business Days',
    popular: false,
  },
  {
    id: 'pkg-2',
    name: 'UI/UX App & Web Prototype Pro',
    badge: 'Most Popular',
    priceUSD: 550,
    priceIDR: 'Rp 8.000.000',
    period: 'per project',
    description: 'Complete UI/UX design for mobile apps or web platforms with interactive Figma prototypes and wireframes.',
    features: [
      'End-to-End User Experience & Flow Wireframing',
      'Up to 10 Custom Application Screens',
      'Interactive Clickable Figma Prototype',
      'Design System Components & Typography Tokens',
      'Developer Handout (Tailwind / CSS Specifications)',
      '3 Rounds of Revisions',
      'Direct WhatsApp Consultation',
    ],
    recommendedFor: 'Mobile Apps, E-Commerce, Web Portals',
    deliveryTime: '10 Business Days',
    popular: true,
  },
  {
    id: 'pkg-3',
    name: 'Full Media & Print Package',
    badge: 'Physical & Digital Complete',
    priceUSD: 850,
    priceIDR: 'Rp 12.500.000',
    period: 'per project',
    description: 'Comprehensive branding, social media suite, printing sets (calendars, banners), and T-Shirt / PDH uniform mockups.',
    features: [
      'Full Logo & Brand System Guidelines',
      'Complete Social Media Feed & Story Suite (15 Assets)',
      'Printing Set (Calendars, Banners, Id Cards)',
      'Official T-Shirt & PDH Uniform Embroidery Mockups',
      'Pre-Printing CMYK Production-Ready Files',
      'Unlimited Revisions during active project',
      'Priority Delivery',
    ],
    recommendedFor: 'Media Centers, Community Orgs, Event Merch',
    deliveryTime: '14 Business Days',
    popular: false,
  },
  {
    id: 'pkg-4',
    name: 'Monthly Design Retainer',
    badge: 'Monthly Support',
    priceUSD: 400,
    priceIDR: 'Rp 6.000.000',
    period: 'per month',
    description: 'Ongoing dedicated design support for monthly social media feeds, banner layouts, and UI/UX updates.',
    features: [
      '20 Custom Social Media & Story Banners per month',
      'UI/UX Screen Iterations & Web Banner Tweaks',
      'Print Asset Layouts (Flyers, Stickers, Merch)',
      'Fast 24-48 Hour Request Turnaround',
      'Direct WhatsApp Priority Communication',
    ],
    recommendedFor: 'Businesses, Media Centers, Content Teams',
    deliveryTime: 'Ongoing Monthly',
    popular: false,
  },
];

export const initialServices: ServiceOffering[] = [
  {
    id: 'srv-1',
    icon: 'Layers',
    title: 'UI/UX & Mobile App Design',
    description: 'Bridging business and non-business needs into intuitive digital interface design for mobile apps and web platforms using Figma and Adobe Xd.',
    deliverables: ['Wireframing & Information Architecture', 'Figma Interactive Prototypes', 'Responsive Layouting', 'Developer-Ready Tokens'],
  },
  {
    id: 'srv-2',
    icon: 'Palette',
    title: 'Branding & Logo Systems',
    description: 'Crafting memorable visual identities, logo marks, typography standards, and brand books that leave a tangible impact.',
    deliverables: ['Primary & Secondary Logomarks', 'Brand Identity Guidelines', 'Vector Assets (AI, SVG, PDF)', 'Color & Type Tokens'],
  },
  {
    id: 'srv-3',
    icon: 'Sparkles',
    title: 'Social Media & Graphic Media',
    description: 'Producing daily digital content, Instagram story campaigns, book cover illustrations, and thumbnail designs that drive engagement.',
    deliverables: ['Social Media Feeds & Stories', 'Book & Ebook Cover Art', 'Thumbnail Design', 'Digital Event Banners'],
  },
  {
    id: 'srv-4',
    icon: 'Code',
    title: 'Physical Printing & Merch Sets',
    description: 'Expertise in pre-printing file optimization, color correction, banners, billboards, calendars, T-shirt prints, and official PDH team uniforms.',
    deliverables: ['CMYK Print-Ready Files', 'Calendar & ID Card Sets', 'T-Shirt & Event Merchandise', 'PDH Uniform Mockups'],
  },
];

export const initialExperiences: ExperienceItem[] = [
  {
    id: 'exp-1',
    type: 'work',
    role: 'Media & Branding Lead',
    companyOrOrg: 'Nurul Musthofa Media Center',
    period: '2025 - 2026',
    location: 'Depok / Jakarta, Indonesia',
    description: 'Modernizing the mosque’s visual identity and media design standards across all physical and digital platforms.',
    highlights: [
      'Branding & Visual: Modernizing the mosque’s visual identity and media design standards.',
      'Creative Production: Producing daily content and documenting activities for digital platforms.',
      'Engagement: Systematic distribution of information to increase congregational engagement.',
    ],
  },
  {
    id: 'exp-2',
    type: 'work',
    role: 'UI/UX Designer',
    companyOrOrg: 'PT. Elucky Game Technology Asia',
    period: '2024 - 2025',
    location: 'Indonesia',
    description: 'Designing end-to-end wireframes, web portals, and mobile app interfaces for Indonesia’s first Game E-commerce platform.',
    highlights: [
      'End-to-End Design: Design wireframes to interactive web/app prototypes using Figma.',
      'UX Optimization: Improve navigation flow to enhance transaction convenience.',
      'Technical Synergy: Collaborate with developers to ensure accurate design implementation.',
    ],
  },
  {
    id: 'exp-3',
    type: 'work',
    role: 'Graphic Design Operator',
    companyOrOrg: 'Kemaslayatama Digital Printing',
    period: '2022 - 2024',
    location: 'Indonesia',
    description: 'Handling promotional design, pre-printing optimization, and digital print production control.',
    highlights: [
      'Promotional Design: Design banners, billboards, and brochures according to client requirements.',
      'Pre-Printing: Optimize file resolution and color correction for print quality.',
      'Production & QC: Operate digital printing machines and plotters with strict quality control.',
    ],
  },
  {
    id: 'exp-4',
    type: 'education',
    role: 'Universitas Pakuan',
    companyOrOrg: 'Higher Education Student',
    period: '2025',
    location: 'Indonesia',
    description: 'Continuing higher education specializing in creative technology and interface design.',
    highlights: ['Focus on AI & Robotics background synergy with creative design logic.'],
  },
  {
    id: 'exp-5',
    type: 'education',
    role: 'SMA Negeri 5 Depok',
    companyOrOrg: 'Senior High School Graduate',
    period: '2024',
    location: 'Depok, Indonesia',
    description: 'Graduated with high honors in technology and science fundamentals.',
    highlights: ['Active leadership in robotics and visual media clubs.'],
  },
  {
    id: 'exp-6',
    type: 'education',
    role: 'PP Tahfidz Az-Zikra',
    companyOrOrg: 'Islamic Boarding Education',
    period: '2023',
    location: 'Bogor, Indonesia',
    description: 'Completed Islamic boarding education and character building.',
    highlights: ['Discipline, ethics, and community service.'],
  },
];

export const initialSkills: SkillItem[] = [
  { id: 'sk-1', name: 'Figma', category: 'UI/UX & Prototyping', icon: 'Figma', proficiency: 98, color: '#F24E1E' },
  { id: 'sk-2', name: 'Adobe Illustrator (Ai)', category: 'Design Tools', icon: 'PenTool', proficiency: 96, color: '#FF9A00' },
  { id: 'sk-3', name: 'Adobe Photoshop (Ps)', category: 'Design Tools', icon: 'Image', proficiency: 94, color: '#31A8FF' },
  { id: 'sk-4', name: 'Adobe Xd', category: 'UI/UX & Prototyping', icon: 'Layers', proficiency: 90, color: '#FF61F6' },
  { id: 'sk-5', name: 'Design Systems & Tokens', category: 'UI/UX & Prototyping', icon: 'Box', proficiency: 92, color: '#EA7600' },
  { id: 'sk-6', name: 'Branding & Logo Design', category: 'Design Skills', icon: 'Palette', proficiency: 98, color: '#3B82F6' },
  { id: 'sk-7', name: 'Layouting & Pre-Print', category: 'Design Skills', icon: 'FileText', proficiency: 95, color: '#10B981' },
  { id: 'sk-8', name: 'Mobile App & Web UI', category: 'Design Skills', icon: 'Code', proficiency: 95, color: '#6366F1' },
  { id: 'sk-9', name: 'Social Media & Thumbnails', category: 'Design Skills', icon: 'Sparkles', proficiency: 96, color: '#EC4899' },
];

export const initialFaqs: FaqItem[] = [
  {
    id: 'faq-1',
    category: 'General Workflow',
    question: {
      en: 'What makes Faras Hazid’s design approach unique?',
      id: 'Apa yang membuat pendekatan desain Faras Hazid unik?',
      ja: 'Faras Hazidのデザインアプローチの特別な点は何ですか？',
      ar: 'ما الذي يجعل نهج تصميم Faras Hazid فريدًا؟',
    },
    answer: {
      en: 'With over 4+ years of experience and a background in AI and Robotics, I combine structured logic and technical efficiency with creative UI/UX and physical print solutions. Every design is built to be both aesthetically pleasing and impactful for brand growth.',
      id: 'Dengan pengalaman 4+ tahun dan latar belakang AI & Robotika, saya menggabungkan logika terstruktur dan efisiensi teknologi dengan desain UI/UX kreatif serta media cetak fisik. Setiap karya dibuat agar estetis sekaligus berdampak bagi perkembangan brand.',
      ja: '4年以上の経験とAI・ロボティクスのバックグラウンドを活かし、論理的な構造とクリエイティブなUI/UXデザインを融合させています。',
      ar: 'مع أكثر من 4 سنوات من الخبرة وخلفية في الذكاء الاصطناعي والروبوتات، أجمع بين المنطق الهيكلي والكفاءة التقنية مع تصميمات UI/UX الجذابة.',
    },
  },
  {
    id: 'faq-2',
    category: 'Project Scope',
    question: {
      en: 'What services are included in UI/UX and Graphic projects?',
      id: 'Layanan apa saja yang termasuk dalam proyek UI/UX dan Grafis?',
      ja: 'UI/UXおよびグラフィックプロジェクトにはどのようなサービスが含まれますか？',
      ar: 'ما هي الخدمات المشمولة في مشاريع UI/UX والغرافيك؟',
    },
    answer: {
      en: 'Services include UI/UX app/web wireframes, clickable Figma prototypes, branding & logo systems, book cover graphics, social media story templates, pre-printing sets, and official PDH team uniforms.',
      id: 'Layanan mencakup wireframe UI/UX aplikasi/web, prototipe Figma interaktif, sistem branding & logo, desain cover buku, template story media sosial, set cetak fisik, dan seragam PDH tim.',
      ja: 'ワイヤーフレーム、Figmaプロトタイプ、ブランディング、ロゴデザイン、書籍カバー、ソーシャルメディアコンテンツ、印刷用データ作成などが含まれます。',
      ar: 'تشمل الخدمات الهياكل السلكية UI/UX، نماذج Figma التفاعلية، الهوية البصرية، تصميم الأغلفة، وقوالب وسائل التواصل الاجتماعي.',
    },
  },
];

export const initialAnalytics: AnalyticsData = {
  totalVisitors: 5420,
  projectViews: 14850,
  inquiriesSent: 210,
  cvDownloads: 530,
  topProjects: [
    { name: 'EluckyGame App Mobile & Web Platform', views: 5890 },
    { name: 'Website Masjid Nurul Musthofa Center', views: 4120 },
    { name: 'Brand Identity & Logo Design Collection', views: 3840 },
    { name: 'Printing Set, T-Shirt & PDH Design', views: 2600 },
  ],
  visitorByCountry: [
    { country: 'Indonesia', count: 3150 },
    { country: 'United States', count: 1140 },
    { country: 'Japan', count: 580 },
    { country: 'Saudi Arabia', count: 320 },
    { country: 'Others', count: 230 },
  ],
};

export const PRD_SRS_DOCUMENTATION = {
  title: 'FARAS HAZID PORTFOLIO SPECIFICATION',
  version: 'v2026.1 - Official Portfolio',
  author: 'Faras Hazid - Graphic & UI Designer',
  updatedAt: '2026-07-29',
  sections: [
    {
      id: 'sec-1',
      title: '1. Profile Summary',
      content: `Faras Hazid is a Graphic & UI Designer with over 4+ years of creative industry experience. Specializes in bridging business needs into digital interface design (UI/UX) and physical print media. With a background in AI & Robotics, Faras applies structured logic and technical efficiency to create visually compelling and high-impact brand solutions.`,
    },
  ],
};

export const initialEstimatorServices: EstimatorServiceOption[] = [
  {
    id: 'brand-identity',
    name: 'Logo & Brand Identity System',
    baseUsd: 299,
    baseIdrNum: 4500000,
    icon: 'Palette',
    deliverables: [
      'Vector Logo Marks (AI, EPS, SVG)',
      'Brand Color Palette & Typography Rules',
      'Brand Guideline Sheet (PDF)',
      'Social Media Avatar & Header Sets'
    ],
  },
  {
    id: 'uiux-mobile-web',
    name: 'UI/UX Mobile App & Web Design',
    baseUsd: 650,
    baseIdrNum: 10500000,
    icon: 'Layout',
    deliverables: [
      'End-to-End User Experience Flow',
      'Interactive Clickable Figma Prototype',
      'Component Design System Tokens',
      'Developer Handoff Specifications'
    ],
  },
  {
    id: 'social-media',
    name: 'Social Media & Graphic Banners',
    baseUsd: 150,
    baseIdrNum: 2300000,
    icon: 'Sparkles',
    deliverables: [
      '10 High-Converting Post/Story Layouts',
      'Editable Figma Source Templates',
      'Exported High-Res PNG/JPGs',
      'Custom Typography & Ad Layouts'
    ],
  },
  {
    id: 'print-prepess',
    name: 'Print Layouting & Pre-Press Set',
    baseUsd: 180,
    baseIdrNum: 2800000,
    icon: 'FileText',
    deliverables: [
      'Pre-Press CMYK Ready Files',
      'Bleed & Crop Mark Alignments',
      'PDH Team Uniform & Merchandise Vector',
      'PDF Book Cover & Layout Sets'
    ],
  },
];

export const initialEstimatorScopes: EstimatorScopeOption[] = [
  { id: 'starter', label: 'Starter / Essential', mult: 1.0, desc: 'Core deliverables for small businesses & startups.' },
  { id: 'pro', label: 'Professional / Growth', mult: 1.4, desc: 'Includes source files, expanded variations & priority support.' },
  { id: 'enterprise', label: 'Complete / Studio Level', mult: 1.9, desc: 'Full design system, expedited handoff & unlimited revisions.' },
];

export const initialEstimatorTimelines: EstimatorTimelineOption[] = [
  { id: 'standard', label: 'Standard Delivery (5-10 Days)', mult: 1.0 },
  { id: 'express', label: 'Express Rush Delivery (2-4 Days)', mult: 1.25 },
];

export const initialSiteSettings: SiteSettings = {
  heroTitle: "Hi, I'm Faras Hazid 👋",
  heroSubtitle: "UI/UX Designer & Creative Tech Specialist",
  aboutBio: "Multidisciplinary designer specializing in UI/UX wireframing, interactive Figma prototyping, vector brand identities, pre-press layouting, and modern web interfaces.",
  contactEmail: "focalhyperspacecreative@gmail.com",
  contactPhone: "+62 851-4354-1287",
  whatsappNumber: "6285143541287",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
  cvDownloadUrlIndo: "https://wa.me/6285143541287?text=Halo%20Faras,%20saya%20ingin%20meminta%20file%20CV%20Bahasa%20Indonesia",
  cvDownloadUrlEng: "https://wa.me/6285143541287?text=Halo%20Faras,%20saya%20ingin%20meminta%20file%20CV%20English%20Version",
  socialLinks: {
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    behance: "https://behance.net",
    dribbble: "https://dribbble.com",
    instagram: "https://instagram.com"
  }
};

