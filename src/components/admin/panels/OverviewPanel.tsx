import React from 'react';
import { useApp } from '../../../context/AppContext';
import {
  FolderOpen,
  MessageSquare,
  Eye,
  FileDown,
  Users,
  Briefcase,
  GraduationCap,
  Settings,
  Globe,
  ArrowUpRight,
  LucideIcon,
} from 'lucide-react';

interface Props {
  onNavigate: (group: 'overview' | 'content' | 'portfolio' | 'estimator' | 'leads' | 'analytics' | 'settings', sub?: string) => void;
}

const LANGS = ['en', 'id', 'ja', 'ar'] as const;

export const OverviewPanel: React.FC<Props> = ({ onNavigate }) => {
  const { analytics, messages, estimates, projects, packages, estimatorServices, skills, experiences, siteSettings } = useApp();

  const unread = messages.filter((m) => !m.read);
  const unreadCount = unread.length;

  const work = experiences.filter((e) => e.type !== 'education').length;
  const edu = experiences.filter((e) => e.type === 'education').length;

  const stats: { label: string; value: number; icon: LucideIcon; prefix?: string; color: string; bg: string; onClick?: () => void }[] = [
    { label: 'Total Proyek', value: projects.length, icon: FolderOpen, color: 'text-blue-600', bg: 'bg-blue-50', onClick: () => onNavigate('portfolio', 'projects') },
    { label: 'Leads Masuk', value: messages.length + estimates.length, icon: MessageSquare, prefix: unreadCount ? `+${unreadCount}` : '', color: 'text-rose-600', bg: 'bg-rose-50', onClick: () => onNavigate('leads') },
    { label: 'Project Views', value: analytics.projectViews, icon: Eye, color: 'text-violet-600', bg: 'bg-violet-50', onClick: () => onNavigate('analytics') },
    { label: 'CV Downloads', value: analytics.cvDownloads, icon: FileDown, color: 'text-emerald-600', bg: 'bg-emerald-50', onClick: () => onNavigate('analytics') },
  ];

  const topProjects = analytics.topProjects || [];
  const maxViews = Math.max(1, ...topProjects.map((p) => p.views));
  const countries = analytics.visitorByCountry || [];
  const maxCountry = Math.max(1, ...countries.map((c) => c.count));

  const featuredCount = projects.filter((p) => p.featured).length;
  const featuredPct = projects.length === 0 ? 0 : Math.round((featuredCount / projects.length) * 100);

  const inventory: { label: string; value: number; icon: LucideIcon; onClick?: () => void }[] = [
    { label: 'Paket Layanan', value: packages.length, icon: Briefcase, onClick: () => onNavigate('portfolio', 'packages') },
    { label: 'Opsi Estimator', value: estimatorServices.length, icon: Globe, onClick: () => onNavigate('estimator') },
    { label: 'Keahlian & Tools', value: skills.length, icon: Settings, onClick: () => onNavigate('portfolio', 'skills') },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome header */}
      <div className="border hairline bg-paper2 p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="display-font text-2xl font-bold text-ink tracking-tight">
              Selamat datang kembali
            </h1>
            <span className="w-2 h-2 rounded-full bg-emerald-500" title="Sistem aktif" />
          </div>
          <p className="mono-label text-ink-muted mt-1">
            {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button onClick={() => onNavigate('portfolio', 'projects')} className="btn-primary text-xs">
            + Tambah Proyek
          </button>
          <button onClick={() => onNavigate('leads')} className="btn-ghost text-xs">
            Lihat Leads
            {unreadCount > 0 && <span className="px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px]">{unreadCount}</span>}
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <button
            key={s.label}
            onClick={s.onClick}
            className="border hairline bg-paper p-4 text-left transition hover:bg-surface hover:-translate-y-0.5"
          >
            <div className={`w-9 h-9 rounded-lg ${s.bg} ${s.color} flex items-center justify-center mb-3`}>
              <s.icon className="w-4.5 h-4.5" />
            </div>
            <div className="flex items-end justify-between">
              <span className="text-2xl font-black text-ink display-font">{s.value.toLocaleString()}</span>
              {s.prefix && <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">{s.prefix}</span>}
            </div>
            <div className="flex items-center justify-between mt-0.5">
              <span className="mono-label text-ink-muted">{s.label}</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-ink-faint" />
            </div>
          </button>
        ))}
      </div>

      {/* Project Analytics + Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Bar chart: top projects */}
        <div className="lg:col-span-2 border hairline bg-paper">
          <div className="flex items-center justify-between px-5 py-4 border-b hairline">
            <div>
              <span className="mono-label text-strong uppercase block">Project Analytics</span>
              <span className="text-[11px] text-ink-muted">Proyek paling banyak dilihat</span>
            </div>
            <button onClick={() => onNavigate('analytics')} className="mono-label text-accent2 inline-flex items-center gap-1">
              Analitik penuh <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          <div className="p-5">
            {topProjects.length === 0 ? (
              <div className="py-10 text-center mono-label text-ink-faint">Belum ada data kunjungan proyek.</div>
            ) : (
              <div className="flex items-end gap-3 h-44">
                {topProjects.map((p) => (
                  <div key={p.name} className="flex-1 flex flex-col items-center gap-2 min-w-0" title={`${p.name}: ${p.views.toLocaleString()} views`}>
                    <span className="mono-label text-ink-muted text-[10px]">{p.views.toLocaleString()}</span>
                    <div
                      className="w-full max-w-12 bg-gradient-to-t from-accent to-accent2 rounded-t-md"
                      style={{ height: `${Math.max(8, Math.round((p.views / maxViews) * 100))}%` }}
                    />
                    <span className="text-[10px] text-ink-muted truncate w-full text-center">{p.name.split(' ').slice(0, 2).join(' ')}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Donut: featured + translation */}
        <div className="space-y-4">
          <div className="border hairline bg-paper p-5">
            <span className="mono-label text-strong uppercase block">Featured Proyek</span>
            <div className="flex items-center gap-5 mt-4">
              <div
                className="w-24 h-24 rounded-full relative shrink-0"
                style={{ background: `conic-gradient(var(--accent) ${featuredPct}%, var(--bg-2) 0)` }}
              >
                <div className="absolute inset-2 rounded-full bg-paper flex flex-col items-center justify-center">
                  <span className="text-lg font-black text-ink">{featuredPct}%</span>
                </div>
              </div>
              <div className="text-xs space-y-1.5">
                <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-accent" /> Featured: {featuredCount}</div>
                <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-paper2 border hairline" /> Standard: {projects.length - featuredCount}</div>
              </div>
            </div>
          </div>

          <div className="border hairline bg-paper p-5">
            <div className="flex items-center justify-between">
              <span className="mono-label text-strong uppercase">Pengunjung</span>
              <span className="mono-label text-ink-muted text-[10px]">per negara</span>
            </div>
            <div className="mt-3 space-y-2">
              {countries.slice(0, 3).map((c) => (
                <div key={c.country}>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-ink truncate">{c.country}</span>
                    <span className="mono-label text-ink-muted">{c.count.toLocaleString()}</span>
                  </div>
                  <div className="h-1.5 bg-paper2 rounded-full">
                    <div className="h-1.5 bg-accent2 rounded-full" style={{ width: `${Math.round((c.count / maxCountry) * 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Reminders + Team/Experiences + inventory */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Reminders: unread leads */}
        <div className="border hairline bg-paper">
          <div className="flex items-center justify-between px-5 py-4 border-b hairline">
            <span className="mono-label text-strong uppercase">Reminders / Leads Baru</span>
            <button onClick={() => onNavigate('leads')} className="mono-label text-accent2">Semua</button>
          </div>
          <div className="divide-y hairline max-h-56 overflow-y-auto">
            {unread.length === 0 ? (
              <div className="p-6 text-center mono-label text-ink-faint">Tidak ada lead belum dibaca.</div>
            ) : (
              unread.slice(0, 5).map((m) => (
                <div key={m.id} className="flex items-start gap-3 px-5 py-3.5">
                  <div className="w-8 h-8 rounded-full bg-accent/15 text-strong flex items-center justify-center font-bold text-xs shrink-0">
                    {m.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-sm text-ink truncate">{m.name}</span>
                      <span className="text-[10px] text-ink-faint shrink-0">{new Date(m.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="text-[11px] text-ink-muted truncate">{m.serviceInterest} · {m.budget}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Team / experiences summary */}
        <div className="border hairline bg-paper">
          <div className="flex items-center justify-between px-5 py-4 border-b hairline">
            <span className="mono-label text-strong uppercase">Profil & Pengalaman</span>
            <button onClick={() => onNavigate('settings', 'profile')} className="mono-label text-accent2">Edit</button>
          </div>
          <div className="p-5 space-y-4">
            <div className="flex items-center gap-3">
              <img src={siteSettings.avatarUrl} alt="Avatar" className="w-12 h-12 rounded-xl object-cover border hairline" />
              <div className="min-w-0">
                <div className="font-bold text-ink text-sm truncate">{siteSettings.heroTitle}</div>
                <div className="text-[11px] text-ink-muted truncate">{siteSettings.heroSubtitle}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="border hairline bg-paper2 p-3">
                <Briefcase className="w-4 h-4 text-accent2 mb-1.5" />
                <div className="text-lg font-black text-ink">{work}</div>
                <div className="mono-label text-ink-muted text-[11px]">Pengalaman Kerja</div>
              </div>
              <div className="border hairline bg-paper2 p-3">
                <GraduationCap className="w-4 h-4 text-accent mb-1.5" />
                <div className="text-lg font-black text-ink">{edu}</div>
                <div className="mono-label text-ink-muted text-[11px]">Pendidikan</div>
              </div>
            </div>
          </div>
        </div>

        {/* Inventory quick nav */}
        <div className="border hairline bg-paper p-5">
          <span className="mono-label text-strong uppercase block mb-3">Inventori Konten</span>
          <div className="space-y-2.5">
            <button onClick={() => onNavigate('portfolio', 'projects')} className="w-full flex items-center gap-3 border hairline bg-paper2 p-3 hover:bg-surface transition text-left">
              <FolderOpen className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-semibold text-ink flex-1">Proyek Portfolio</span>
              <span className="mono-label text-ink-muted">{projects.length}</span>
            </button>
            {inventory.map((i) => (
              <button key={i.label} onClick={i.onClick} className="w-full flex items-center gap-3 border hairline bg-paper2 p-3 hover:bg-surface transition text-left">
                <i.icon className="w-4 h-4 text-violet-600" />
                <span className="text-xs font-semibold text-ink flex-1">{i.label}</span>
                <span className="mono-label text-ink-muted">{i.value}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};