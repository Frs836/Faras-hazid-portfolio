export type Language = 'en' | 'id' | 'ja' | 'ar';

export type LangValue = Partial<Record<Language, string>>;

export interface PageContentRow {
  id: string;
  page: string;
  section: string;
  field: string;
  type: string; // 'text' | 'textarea' | 'list' | 'image'
  values: LangValue;
  sort: number;
  updated_at?: string;
}

export interface DbFaq {
  id: string;
  sort: number;
  question: LangValue;
  answer: LangValue;
}

export type Category = 'All' | 'UI/UX Design' | 'Graphic & Brand' | 'Social Media & Print' | 'Mobile App';

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  category: Category;
  thumbnail: string;
  images: string[];
  client: string;
  year: string;
  role: string;
  summary: string;
  problemStatement: string;
  workflowSteps: {
    title: string;
    description: string;
  }[];
  solution: string;
  results: string[];
  tools: string[];
  liveUrl?: string;
  featured: boolean;
}

export interface PricingPackage {
  id: string;
  name: string;
  badge?: string;
  priceUSD: number;
  priceIDR: string;
  period: string;
  description: string;
  features: string[];
  recommendedFor: string;
  deliveryTime: string;
  popular?: boolean;
}

export interface ServiceOffering {
  id: string;
  icon: string;
  title: string;
  description: string;
  deliverables: string[];
}

export interface ExperienceItem {
  id: string;
  type: 'work' | 'education' | 'leadership';
  role: string;
  companyOrOrg: string;
  period: string;
  location: string;
  description: string;
  highlights: string[];
}

export interface SkillItem {
  id: string;
  name: string;
  category: 'Design Tools' | 'UI/UX & Prototyping' | 'Design Skills' | 'Frontend Knowledge';
  icon: string;
  proficiency: number; // 1-100
  color: string; // Tailwind hex or class color
}

export interface CertificateItem {
  id: string;
  title: string;
  issuer: string;
  year: string;
  image: string;
  description: string;
}

export interface FaqItem {
  id: string;
  category: string;
  question: {
    en: string;
    id: string;
    ja: string;
    ar: string;
  };
  answer: {
    en: string;
    id: string;
    ja: string;
    ar: string;
  };
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  serviceInterest: string;
  budget: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface EstimateLead {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  serviceType: string;
  deliverables: string[];
  urgency: string;
  estimatedPrice: number;
  notes?: string;
  status: string;
  createdAt: string;
}

export interface AnalyticsData {
  totalVisitors: number;
  projectViews: number;
  inquiriesSent: number;
  cvDownloads: number;
  topProjects: { name: string; views: number }[];
  visitorByCountry: { country: string; count: number }[];
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
}

export interface EstimatorServiceOption {
  id: string;
  name: string;
  baseUsd: number;
  baseIdrNum: number;
  icon: string;
  deliverables: string[];
}

export interface EstimatorScopeOption {
  id: string;
  label: string;
  mult: number;
  desc: string;
}

export interface EstimatorTimelineOption {
  id: string;
  label: string;
  mult: number;
}

export interface SiteSettings {
  heroTitle: string;
  heroSubtitle: string;
  aboutBio: string;
  contactEmail: string;
  contactPhone: string;
  whatsappNumber: string;
  avatarUrl: string;
  cvDownloadUrlIndo: string;
  cvDownloadUrlEng: string;
  socialLinks: {
    github: string;
    linkedin: string;
    behance: string;
    dribbble: string;
    instagram: string;
  };
}

