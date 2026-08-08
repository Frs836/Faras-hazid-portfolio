import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { 
  Language, 
  Project, 
  PricingPackage, 
  ServiceOffering, 
  ExperienceItem, 
  SkillItem, 
  FaqItem, 
  ContactMessage, 
  AnalyticsData, 
  ToastMessage,
  EstimatorServiceOption,
  EstimatorScopeOption,
  EstimatorTimelineOption,
  SiteSettings,
  PageContentRow,
  DbFaq
} from '../types';
import { 
  initialProjects, 
  initialPricingPackages, 
  initialServices, 
  initialExperiences, 
  initialSkills, 
  initialFaqs, 
  initialAnalytics,
  initialEstimatorServices,
  initialEstimatorScopes,
  initialEstimatorTimelines,
  initialSiteSettings
} from '../data/initialData';
import { SITE_CONTENT_SEED, FAQ_SEED } from '../data/contentSeed';

import { translations, Translations } from '../i18n/translations';
import { 
  getLocalizedProject, 
  getLocalizedService, 
  getLocalizedPackage,
  getLocalizedExperience
} from '../i18n/dataTranslations';
import {
  fetchProjectsFromSupabase,
  fetchSiteSettingsFromSupabase,
  fetchEstimatorConfigFromSupabase,
  fetchPageContent,
  seedPageContent,
  savePageContent,
  fetchDbFaqs,
  saveFaq,
  deleteFaq,
  fetchExperiencesFromSupabase,
  fetchSkillsFromSupabase,
  saveExperiencesToSupabase,
  saveSkillsToSupabase,
  savePackagesToSupabase,
  fetchPackagesFromSupabase,
} from '../services/apiService';

export type PageView = 'home' | 'about' | 'portfolio' | 'services' | 'contact' | 'secret-admin';
export type ThemeMode = 'light' | 'dark';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: ThemeMode;
  toggleTheme: () => void;
  t: Translations;
  currentPage: PageView;
  setCurrentPage: (page: PageView) => void;
  
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  selectedProject: Project | null;
  setSelectedProject: (project: Project | null) => void;

  packages: PricingPackage[];
  setPackages: React.Dispatch<React.SetStateAction<PricingPackage[]>>;

  services: ServiceOffering[];
  setServices: React.Dispatch<React.SetStateAction<ServiceOffering[]>>;

  experiences: ExperienceItem[];
  setExperiences: React.Dispatch<React.SetStateAction<ExperienceItem[]>>;

  skills: SkillItem[];
  setSkills: React.Dispatch<React.SetStateAction<SkillItem[]>>;

  faqs: FaqItem[];
  setFaqs: React.Dispatch<React.SetStateAction<FaqItem[]>>;

  estimatorServices: EstimatorServiceOption[];
  setEstimatorServices: React.Dispatch<React.SetStateAction<EstimatorServiceOption[]>>;

  estimatorScopes: EstimatorScopeOption[];
  setEstimatorScopes: React.Dispatch<React.SetStateAction<EstimatorScopeOption[]>>;

  estimatorTimelines: EstimatorTimelineOption[];
  setEstimatorTimelines: React.Dispatch<React.SetStateAction<EstimatorTimelineOption[]>>;

  siteSettings: SiteSettings;
  setSiteSettings: React.Dispatch<React.SetStateAction<SiteSettings>>;

  messages: ContactMessage[];

  pageContent: PageContentRow[];
  getContent: (page: string, field: string, fallback?: string) => string;
  getContentList: (page: string, field: string) => string[];
  saveContentRows: (rows: PageContentRow[]) => Promise<boolean>;
  refreshContent: () => Promise<void>;

  addMessage: (msg: Omit<ContactMessage, 'id' | 'createdAt' | 'read'>) => void;
  markMessageRead: (id: string) => void;
  deleteMessage: (id: string) => void;

  analytics: AnalyticsData;

  toasts: ToastMessage[];
  addToast: (title: string, message: string, type?: ToastMessage['type']) => void;
  removeToast: (id: string) => void;

  isPrdModalOpen: boolean;
  setIsPrdModalOpen: (open: boolean) => void;

  isCvModalOpen: boolean;
  setIsCvModalOpen: (open: boolean) => void;
  cvLanguage: 'en' | 'id';
  openCvModal: (lang: 'en' | 'id') => void;

  isAdminUnlocked: boolean;
  setIsAdminUnlocked: (unlocked: boolean) => void;
  adminPasscode: string;
  verifyAdminPasscode: (pass: string) => boolean;

  resetToDefaults: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const ADMIN_PIN = 'clay2026';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('clayfolio_lang');
    return (saved as Language) || 'en';
  });

  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('clayfolio_theme');
    return saved === 'dark' ? 'dark' : 'light';
  });

  const toggleTheme = () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));

  const [currentPage, setCurrentPage] = useState<PageView>(() => {
    const hash = window.location.hash.replace('#', '') as PageView;
    const validPages: PageView[] = ['home', 'about', 'portfolio', 'services', 'contact', 'secret-admin'];
    if (validPages.includes(hash)) {
      return hash;
    }
    const saved = localStorage.getItem('clayfolio_page') as PageView;
    if (saved && validPages.includes(saved)) {
      return saved;
    }
    return 'home';
  });

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const [isPrdModalOpen, setIsPrdModalOpen] = useState(false);
  const [isCvModalOpen, setIsCvModalOpen] = useState(false);
  const [cvLanguage, setCvLanguage] = useState<'en' | 'id'>('en');

  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // LocalStorage JSON State
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('clayfolio_projects');
    return saved ? JSON.parse(saved) : initialProjects;
  });

  const [packages, setPackages] = useState<PricingPackage[]>(() => {
    const saved = localStorage.getItem('clayfolio_packages');
    return saved ? JSON.parse(saved) : initialPricingPackages;
  });

  const [services, setServices] = useState<ServiceOffering[]>(() => {
    const saved = localStorage.getItem('clayfolio_services');
    return saved ? JSON.parse(saved) : initialServices;
  });

  const [experiences, setExperiences] = useState<ExperienceItem[]>(() => {
    const saved = localStorage.getItem('clayfolio_experiences');
    return saved ? JSON.parse(saved) : initialExperiences;
  });

  const [skills, setSkills] = useState<SkillItem[]>(() => {
    const saved = localStorage.getItem('clayfolio_skills');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const filtered = parsed.filter(
          (s: SkillItem) =>
            !s.name.toLowerCase().includes('3d') &&
            !s.name.toLowerCase().includes('blender') &&
            !s.name.toLowerCase().includes('spline') &&
            !s.name.toLowerCase().includes('webgl') &&
            !s.name.toLowerCase().includes('three') &&
            !s.name.toLowerCase().includes('effects') &&
            !(s.category as string).includes('3D')
        );
        if (filtered.length > 0) return filtered;
      } catch (e) {
        // fallback
      }
    }
    return initialSkills;
  });

  const [faqs, setFaqs] = useState<FaqItem[]>(() => {
    const saved = localStorage.getItem('clayfolio_faqs');
    return saved ? JSON.parse(saved) : initialFaqs;
  });

  const [estimatorServices, setEstimatorServices] = useState<EstimatorServiceOption[]>(() => {
    const saved = localStorage.getItem('clayfolio_estimator_services');
    return saved ? JSON.parse(saved) : initialEstimatorServices;
  });

  const [estimatorScopes, setEstimatorScopes] = useState<EstimatorScopeOption[]>(() => {
    const saved = localStorage.getItem('clayfolio_estimator_scopes');
    return saved ? JSON.parse(saved) : initialEstimatorScopes;
  });

  const [estimatorTimelines, setEstimatorTimelines] = useState<EstimatorTimelineOption[]>(() => {
    const saved = localStorage.getItem('clayfolio_estimator_timelines');
    return saved ? JSON.parse(saved) : initialEstimatorTimelines;
  });

  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => {
    const saved = localStorage.getItem('clayfolio_site_settings');
    return saved ? JSON.parse(saved) : initialSiteSettings;
  });


  const [messages, setMessages] = useState<ContactMessage[]>(() => {
    const saved = localStorage.getItem('clayfolio_messages');
    return saved ? JSON.parse(saved) : [];
  });

  const [pageContent, setPageContent] = useState<PageContentRow[]>([]);

  // Guards: skip auto-persist until the DB snapshot has hydrated once,
  // so a stale localStorage value never overwrites fresher DB data.
  const loadedExpRef = useRef(false);
  const loadedSkillsRef = useRef(false);
  const loadedPackagesRef = useRef(false);

  const [analytics, setAnalytics] = useState<AnalyticsData>(() => {
    const saved = localStorage.getItem('clayfolio_analytics');
    return saved ? JSON.parse(saved) : initialAnalytics;
  });

  // Save changes to LocalStorage
  useEffect(() => {
    localStorage.setItem('clayfolio_lang', language);
  }, [language]);

  // Apply & persist theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('clayfolio_theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('clayfolio_page', currentPage);
    if (window.location.hash !== `#${currentPage}`) {
      window.location.hash = `#${currentPage}`;
    }
  }, [currentPage]);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') as PageView;
      const validPages: PageView[] = ['home', 'about', 'portfolio', 'services', 'contact', 'secret-admin'];
      if (validPages.includes(hash)) {
        setCurrentPage(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    localStorage.setItem('clayfolio_projects', JSON.stringify(projects));
  }, [projects]);

  // Initial fetch from Supabase if connected & configured
  useEffect(() => {
    fetchProjectsFromSupabase().then((dbProjects) => {
      if (dbProjects && dbProjects.length > 0) {
        setProjects(dbProjects);
      }
    });
    fetchSiteSettingsFromSupabase().then((dbSettings) => {
      if (dbSettings) {
        setSiteSettings((prev) => ({ ...prev, ...dbSettings }));
      }
    });
    // Load estimator config from Supabase so admin edits reach fresh visitors
    fetchEstimatorConfigFromSupabase().then((cfg) => {
      if (cfg) {
        setEstimatorServices(cfg.services);
        setEstimatorScopes(cfg.scopes);
        setEstimatorTimelines(cfg.timelines);
      }
    });
    // Experiences & skills propagation (admin edits reach visitors)
    fetchExperiencesFromSupabase().then((list) => {
      if (list && list.length > 0) {
        setExperiences(list);
        loadedExpRef.current = true;
      }
    });
    fetchSkillsFromSupabase().then((list) => {
      if (list && list.length > 0) {
        setSkills(list);
        loadedSkillsRef.current = true;
      }
    });
    // Packages propagation (admin edits reach visitors)
    fetchPackagesFromSupabase().then((list) => {
      if (list && list.length > 0) {
        setPackages(list);
        loadedPackagesRef.current = true;
      }
    });
    // Load editable page content; auto-seed once if DB empty
    fetchPageContent().then((rows) => {
      if (rows.length > 0) {
        setPageContent(rows);
      } else {
        seedPageContent(SITE_CONTENT_SEED).then(() => fetchPageContent().then(setPageContent));
      }
    });
    // Load FAQs; auto-seed once if DB empty
    fetchDbFaqs().then((dbFaqs) => {
      if (dbFaqs.length > 0) {
        setFaqs(dbFaqs.map((q) => ({
          id: q.id,
          category: 'general',
          question: q.question as any,
          answer: q.answer as any,
        })));
      } else {
        persistFaqs(FAQ_SEED).then(() => fetchDbFaqs().then((list) =>
          setFaqs(list.map((q) => ({ id: q.id, category: 'general', question: q.question as any, answer: q.answer as any })))
        ));
      }
    });
  }, []);

  // Auto-persist experiences & skills to Supabase (debounced) so admin
  // edits reach the public site without a manual "sync" button.
  useEffect(() => {
    if (!loadedExpRef.current) return;
    const t = setTimeout(() => {
      saveExperiencesToSupabase(experiences).catch(() => {});
    }, 800);
    return () => clearTimeout(t);
  }, [experiences]);

  useEffect(() => {
    if (!loadedSkillsRef.current) return;
    const t = setTimeout(() => {
      saveSkillsToSupabase(skills).catch(() => {});
    }, 800);
    return () => clearTimeout(t);
  }, [skills]);

  useEffect(() => {
    if (!loadedPackagesRef.current) return;
    const t = setTimeout(() => {
      savePackagesToSupabase(packages).catch(() => {});
    }, 800);
    return () => clearTimeout(t);
  }, [packages]);

  useEffect(() => {
    localStorage.setItem('clayfolio_packages', JSON.stringify(packages));
  }, [packages]);

  useEffect(() => {
    localStorage.setItem('clayfolio_services', JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem('clayfolio_experiences', JSON.stringify(experiences));
  }, [experiences]);

  useEffect(() => {
    localStorage.setItem('clayfolio_skills', JSON.stringify(skills));
  }, [skills]);

  useEffect(() => {
    localStorage.setItem('clayfolio_faqs', JSON.stringify(faqs));
  }, [faqs]);

  useEffect(() => {
    localStorage.setItem('clayfolio_estimator_services', JSON.stringify(estimatorServices));
  }, [estimatorServices]);

  useEffect(() => {
    localStorage.setItem('clayfolio_estimator_scopes', JSON.stringify(estimatorScopes));
  }, [estimatorScopes]);

  useEffect(() => {
    localStorage.setItem('clayfolio_estimator_timelines', JSON.stringify(estimatorTimelines));
  }, [estimatorTimelines]);

  useEffect(() => {
    localStorage.setItem('clayfolio_site_settings', JSON.stringify(siteSettings));
  }, [siteSettings]);


  useEffect(() => {
    localStorage.setItem('clayfolio_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('clayfolio_analytics', JSON.stringify(analytics));
  }, [analytics]);

  // Handle document direction for Arabic RTL
  useEffect(() => {
    if (language === 'ar') {
      document.documentElement.setAttribute('dir', 'rtl');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
    }
  }, [language]);

  const t = translations[language];

  const localizedProjects = React.useMemo(() => {
    return projects.map((p) => getLocalizedProject(p, language));
  }, [projects, language]);

  const localizedServices = React.useMemo(() => {
    return services.map((s) => getLocalizedService(s, language));
  }, [services, language]);

  const localizedPackages = React.useMemo(() => {
    return packages.map((pkg) => getLocalizedPackage(pkg, language));
  }, [packages, language]);

  const localizedExperiences = React.useMemo(() => {
    return experiences.map((exp) => getLocalizedExperience(exp, language));
  }, [experiences, language]);

  const localizedSelectedProject = React.useMemo(() => {
    return selectedProject ? getLocalizedProject(selectedProject, language) : null;
  }, [selectedProject, language]);

  const addToast = (title: string, message: string, type: ToastMessage['type'] = 'info') => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 4);
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  };

  const addMessage = (msg: Omit<ContactMessage, 'id' | 'createdAt' | 'read'>) => {
    const newMsg: ContactMessage = {
      ...msg,
      id: 'msg-' + Date.now(),
      createdAt: new Date().toISOString(),
      read: false,
    };
    setMessages((prev) => [newMsg, ...prev]);
    setAnalytics((prev) => ({
      ...prev,
      inquiriesSent: prev.inquiriesSent + 1,
    }));
  };

  const markMessageRead = (id: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, read: true } : m))
    );
  };

  const deleteMessage = (id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
  };

  const openCvModal = (lang: 'en' | 'id') => {
    setCvLanguage(lang);
    setIsCvModalOpen(true);
    setAnalytics((prev) => ({
      ...prev,
      cvDownloads: prev.cvDownloads + 1,
    }));
  };

  const verifyAdminPasscode = (pass: string) => {
    if (pass === ADMIN_PIN || pass === 'clay-admin-2026') {
      setIsAdminUnlocked(true);
      return true;
    }
    return false;
  };

  const resetToDefaults = () => {
    setProjects(initialProjects);
    setPackages(initialPricingPackages);
    setServices(initialServices);
    setExperiences(initialExperiences);
    setSkills(initialSkills);
    setFaqs(initialFaqs);
    setEstimatorServices(initialEstimatorServices);
    setEstimatorScopes(initialEstimatorScopes);
    setEstimatorTimelines(initialEstimatorTimelines);
    setSiteSettings(initialSiteSettings);
    setMessages([]);
    setAnalytics(initialAnalytics);
    localStorage.clear();
    addToast('Database Reset', 'Reset all portfolio data to default state.', 'warning');
  };

  // ---- Headless content helpers (DB-first, fallback to code strings) ----
  const localize = (values?: Partial<Record<Language, string>>) =>
    (values && values[language]) || (values && values.en) || '';

  const getContent = (page: string, key: string, fallback = ''): string => {
    const sep = key.indexOf('.');
    const section = sep >= 0 ? key.slice(0, sep) : 'general';
    const field = sep >= 0 ? key.slice(sep + 1) : key;
    const hit = pageContent.find(
      (r) => r.page === page && r.section === section && r.field === field && r.type !== 'list'
    );
    return localize(hit?.values) || fallback;
  };

  const getContentList = (page: string, key: string): string[] => {
    const sep = key.indexOf('.');
    const section = sep >= 0 ? key.slice(0, sep) : 'general';
    const field = sep >= 0 ? key.slice(sep + 1) : key;
    return pageContent
      .filter((r) => r.page === page && r.section === section && r.field === field && r.type === 'list')
      .sort((a, b) => a.sort - b.sort)
      .map((r) => localize(r.values))
      .filter(Boolean);
  };

  const saveContentRows = async (rows: PageContentRow[]): Promise<boolean> => {
    const ok = await savePageContent(rows);
    if (ok) {
      setPageContent((prev) => {
        const map = new Map(prev.map((r) => [r.id, r]));
        rows.forEach((r) => map.set(r.id, r));
        return Array.from(map.values());
      });
    }
    return ok;
  };

  const refreshContent = async () => {
    const rows = await fetchPageContent();
    setPageContent(rows);
  };

  const persistFaqs = async (list: DbFaq[]): Promise<boolean> => {
    let allOk = true;
    for (const f of list) {
      const ok = await saveFaq(f);
      if (!ok) allOk = false;
    }
    return allOk;
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        theme,
        toggleTheme,
        t,
        currentPage,
        setCurrentPage,
        projects: localizedProjects,
        setProjects,
        selectedProject: localizedSelectedProject,
        setSelectedProject,
        packages: localizedPackages,
        setPackages,
        services: localizedServices,
        setServices,
        experiences: localizedExperiences,
        setExperiences,
        skills,
        setSkills,
        faqs,
        setFaqs,
        estimatorServices,
        setEstimatorServices,
        estimatorScopes,
        setEstimatorScopes,
        estimatorTimelines,
        setEstimatorTimelines,
        siteSettings,
        setSiteSettings,
        messages,
        pageContent,
        getContent,
        getContentList,
        saveContentRows,
        refreshContent,

        addMessage,
        markMessageRead,
        deleteMessage,
        analytics,
        toasts,
        addToast,
        removeToast,
        isPrdModalOpen,
        setIsPrdModalOpen,
        isCvModalOpen,
        setIsCvModalOpen,
        cvLanguage,
        openCvModal,
        isAdminUnlocked,
        setIsAdminUnlocked,
        adminPasscode: ADMIN_PIN,
        verifyAdminPasscode,
        resetToDefaults,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
