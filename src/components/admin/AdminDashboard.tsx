import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  LogOut,
  RefreshCw,
  LayoutDashboard,
  Home,
  UserRound,
  FileText,
  Layers,
  Mail,
  HelpCircle,
  FolderOpen,
  Package,
  Briefcase,
  Wrench,
  Calculator,
  MessageSquare,
  BarChart2,
  Settings,
  Database,
  Boxes,
  Info,
} from 'lucide-react';
import { PageContentEditor } from './PageContentEditor';
import { FaqEditor } from './FaqEditor';
import { OverviewPanel } from './panels/OverviewPanel';
import { ProjectsPanel } from './panels/ProjectsPanel';
import { PackagesPanel } from './panels/PackagesPanel';
import { EstimatorPanel } from './panels/EstimatorPanel';
import { ExperiencePanel } from './panels/ExperiencePanel';
import { SkillsPanel } from './panels/SkillsPanel';
import { ServicesPanel } from './panels/ServicesPanel';
import { MessagesPanel } from './panels/MessagesPanel';
import { AnalyticsPanel } from './panels/AnalyticsPanel';
import { SettingsPanel } from './panels/SettingsPanel';
import { SupabasePanel } from './panels/SupabasePanel';

type GroupId = 'overview' | 'content' | 'portfolio' | 'estimator' | 'leads' | 'analytics' | 'settings';
type ContentSub = 'home' | 'about' | 'portfolio' | 'services' | 'contact' | 'footer' | 'faq';
type PortfolioSub = 'projects' | 'packages' | 'experiences' | 'skills' | 'services';
type SettingsSub = 'profile' | 'database';

interface NavItem {
  id: GroupId;
  label: string;
  icon: typeof Home;
  badge?: number;
  defaultSub?: string;
}

const CONTENT_SUBS: { id: ContentSub; label: string; icon: typeof Home }[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'about', label: 'About', icon: UserRound },
  { id: 'portfolio', label: 'Portfolio', icon: FileText },
  { id: 'services', label: 'Services', icon: Layers },
  { id: 'contact', label: 'Contact', icon: Mail },
  { id: 'footer', label: 'Footer', icon: Info },
  { id: 'faq', label: 'FAQ', icon: HelpCircle },
];

const PORTFOLIO_SUBS: { id: PortfolioSub; label: string; icon: typeof FolderOpen }[] = [
  { id: 'projects', label: 'Proyek', icon: FolderOpen },
  { id: 'packages', label: 'Paket', icon: Package },
  { id: 'experiences', label: 'Pengalaman', icon: Briefcase },
  { id: 'skills', label: 'Keahlian', icon: Wrench },
  { id: 'services', label: 'Layanan', icon: Layers },
];

const SETTINGS_SUBS: { id: SettingsSub; label: string; icon: typeof Settings }[] = [
  { id: 'profile', label: 'Profile & Web', icon: Settings },
  { id: 'database', label: 'Database', icon: Database },
];

export const AdminDashboard: React.FC = () => {
  const {
    t,
    messages,
    setIsAdminUnlocked,
    setCurrentPage,
    addToast,
    resetToDefaults,
  } = useApp();

  const [group, setGroup] = useState<GroupId>('overview');
  const [contentSub, setContentSub] = useState<ContentSub>('home');
  const [portfolioSub, setPortfolioSub] = useState<PortfolioSub>('projects');
  const [settingsSub, setSettingsSub] = useState<SettingsSub>('profile');

  const navigate = (g: GroupId, sub?: string) => {
    setGroup(g);
    if (g === 'content' && sub) setContentSub(sub as ContentSub);
    if (g === 'portfolio' && sub) setPortfolioSub(sub as PortfolioSub);
    if (g === 'settings' && sub) setSettingsSub(sub as SettingsSub);
  };

  const unread = messages.filter((m) => !m.read).length;

  const sections: { header: string; items: NavItem[] }[] = [
    {
      header: 'Utama',
      items: [
        { id: 'overview', label: 'Ringkasan', icon: LayoutDashboard },
        { id: 'leads', label: 'Pesan / Leads', icon: MessageSquare, badge: unread },
        { id: 'analytics', label: 'Analytics', icon: BarChart2 },
      ],
    },
    {
      header: 'Konten',
      items: [
        { id: 'content', label: 'Konten Halaman', icon: FileText, defaultSub: 'home' },
        { id: 'estimator', label: 'Estimator', icon: Calculator },
      ],
    },
    {
      header: 'Data',
      items: [
        { id: 'portfolio', label: 'Portfolio & Layanan', icon: Boxes, defaultSub: 'projects' },
      ],
    },
    {
      header: 'Sistem',
      items: [
        { id: 'settings', label: 'Pengaturan', icon: Settings, defaultSub: 'profile' },
      ],
    },
  ];

  const renderPanel = () => {
    if (group === 'overview') return <OverviewPanel onNavigate={navigate} />;
    if (group === 'content') {
      if (contentSub === 'faq') return <FaqEditor />;
      return <PageContentEditor page={contentSub} label={contentSub} />;
    }
    if (group === 'portfolio') {
      if (portfolioSub === 'projects') return <ProjectsPanel onNavigate={navigate} />;
      if (portfolioSub === 'packages') return <PackagesPanel />;
      if (portfolioSub === 'experiences') return <ExperiencePanel />;
      if (portfolioSub === 'services') return <ServicesPanel />;
      return <SkillsPanel />;
    }
    if (group === 'estimator') return <EstimatorPanel />;
    if (group === 'leads') return <MessagesPanel />;
    if (group === 'analytics') return <AnalyticsPanel />;
    if (group === 'settings') {
      if (settingsSub === 'database') return <SupabasePanel />;
      return <SettingsPanel />;
    }
    return null;
  };

  const renderSubItems = () => {
    if (group === 'content') {
      return (
        <>
          {CONTENT_SUBS.map((s) => (
            <button
              key={s.id}
              onClick={() => setContentSub(s.id)}
              className={`flex items-center gap-1.5 px-2 py-1.5 rounded-md text-xs transition whitespace-nowrap ${
                contentSub === s.id ? 'bg-ink text-paper' : 'text-ink-muted hover:text-ink'
              }`}
            >
              <s.icon className="w-3 h-3" />
              {s.label}
            </button>
          ))}
        </>
      );
    }
    if (group === 'portfolio') {
      return (
        <>
          {PORTFOLIO_SUBS.map((s) => (
            <button
              key={s.id}
              onClick={() => setPortfolioSub(s.id)}
              className={`flex items-center gap-1.5 px-2 py-1.5 rounded-md text-xs transition whitespace-nowrap ${
                portfolioSub === s.id ? 'bg-ink text-paper' : 'text-ink-muted hover:text-ink'
              }`}
            >
              <s.icon className="w-3 h-3" />
              {s.label}
            </button>
          ))}
        </>
      );
    }
    if (group === 'settings') {
      return (
        <>
          {SETTINGS_SUBS.map((s) => (
            <button
              key={s.id}
              onClick={() => setSettingsSub(s.id)}
              className={`flex items-center gap-1.5 px-2 py-1.5 rounded-md text-xs transition whitespace-nowrap ${
                settingsSub === s.id ? 'bg-ink text-paper' : 'text-ink-muted hover:text-ink'
              }`}
            >
              <s.icon className="w-3 h-3" />
              {s.label}
            </button>
          ))}
        </>
      );
    }
    return null;
  };

  return (
    <div className="admin-wrap space-y-6 py-6">
      {/* Top bar */}
      <div className="bg-paper2 border hairline p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-accent" aria-hidden="true" />
            <h1 className="display-font font-bold text-xl text-ink tracking-tight">
              {t.admin.dashboardTitle}
            </h1>
            <span className="mono-label text-strong px-2 py-1 border hairline rounded-sm hidden sm:inline">hidden CMS</span>
          </div>
          <p className="mono-label text-ink-muted">Zero-Public Exposure · Headless CMS · Live</p>
        </div>

        <div className="flex items-center gap-2.5">
          <button onClick={resetToDefaults} className="btn-ghost text-xs" title="Reset to default initial data">
            <RefreshCw className="w-4 h-4 text-strong" />
            <span className="hidden sm:inline">Reset Data</span>
          </button>
          <button
            onClick={() => {
              setIsAdminUnlocked(false);
              setCurrentPage('home');
              addToast('Logged Out', 'Closed CMS admin dashboard session.', 'info');
            }}
            className="px-4 py-2.5 rounded-lg bg-rose-500 text-white hover:bg-rose-600 font-semibold text-xs flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Lock &amp; Exit</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <aside className="lg:w-52 shrink-0">
          <nav className="lg:sticky lg:top-4 flex flex-col gap-1 lg:bg-paper2 lg:border lg:hairline lg:p-2 lg:rounded-lg">
            {sections.map((sec) => (
              <div key={sec.header} className="flex">
                <div className="flex lg:flex-col lg:w-full">
                  <div className="hidden lg:block px-2 pt-3 pb-1.5 mono-label text-[10px] text-ink-faint uppercase">
                    {sec.header}
                  </div>
                  <div className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
                    {sec.items.map((item) => (
                      <div key={item.id} className="flex lg:flex-col shrink-0">
                        <button
                          onClick={() => navigate(item.id, item.defaultSub)}
                          className={`px-3 py-2 rounded-md transition flex items-center gap-2 whitespace-nowrap text-xs font-semibold ${
                            group === item.id ? 'bg-ink text-paper' : 'text-ink-muted hover:text-ink hover:bg-surface'
                          }`}
                        >
                          <item.icon className="w-4 h-4" />
                          <span className="hidden sm:inline">{item.label}</span>
                          {item.badge ? (
                            <span className="px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px]">{item.badge}</span>
                          ) : null}
                        </button>
                        {group === item.id && (
                          <div className="hidden lg:flex flex-col gap-0.5 ml-2 pl-2 border-l hairline mt-1">
                            {renderSubItems()}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </nav>

          {/* Sub-tab chips on mobile */}
          {(group === 'content' || group === 'portfolio' || group === 'settings') && (
            <div className="flex lg:hidden gap-1 p-1.5 mt-2 rounded-lg bg-paper2 border hairline overflow-x-auto">
              {renderSubItems()}
            </div>
          )}
        </aside>

        {/* Main panel */}
        <div className="flex-1 min-w-0">{renderPanel()}</div>
      </div>
    </div>
  );
};