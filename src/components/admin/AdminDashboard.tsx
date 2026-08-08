import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Project, PricingPackage, ExperienceItem, SkillItem, FaqItem } from '../../types';
import { 
  FolderPlus, 
  Trash2, 
  Edit, 
  Plus, 
  Save, 
  RefreshCw, 
  LogOut, 
  MessageSquare, 
  BarChart2, 
  Server, 
  Database, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  Star,
  Eye,
  Lock,
  Copy,
  Check,
  Terminal,
  Calculator,
  Layers,
  X,
  Sparkles,
  Clock,
  User,
  Briefcase,
  Wrench,
  Settings,
  Globe,
  Phone,
  Mail,
  Share2,
  UploadCloud,
  Send,
  GraduationCap,
  Home,
  UserRound,
  HelpCircle
} from 'lucide-react';
import { SUPABASE_SQL_SCHEMA, isSupabaseConnected } from '../../lib/supabase';
import { 
  checkBackendStatus, 
  saveProjectToSupabase, 
  deleteProjectFromSupabase, 
  savePackageToSupabase,
  deletePackageFromSupabase,
  saveSiteSettingsToSupabase,
  syncAllDataToSupabase 
} from '../../services/apiService';
import { PageContentEditor } from './PageContentEditor';
import { FaqEditor } from './FaqEditor';

export const AdminDashboard: React.FC = () => {
  const { 
    t, 
    projects, 
    setProjects, 
    packages, 
    setPackages, 
    experiences, 
    setExperiences, 
    skills, 
    setSkills, 
    faqs, 
    setFaqs, 
    messages, 
    markMessageRead, 
    deleteMessage, 
    analytics, 
    setIsAdminUnlocked, 
    setCurrentPage, 
    addToast, 
    resetToDefaults,
    estimatorServices,
    setEstimatorServices,
    estimatorScopes,
    setEstimatorScopes,
    estimatorTimelines,
    setEstimatorTimelines,
    siteSettings,
    setSiteSettings
  } = useApp();

  const [activeTab, setActiveTab] = useState<'projects' | 'packages' | 'experiences' | 'skills' | 'messages' | 'analytics' | 'supabase' | 'estimator' | 'settings' | 'content-home' | 'content-about' | 'content-portfolio' | 'content-services' | 'content-contact' | 'content-footer' | 'faq'>('projects');

  // Helper for uploading files (converting images/PDFs to Data URLs)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        callback(event.target.result as string);
        addToast('File Diunggah!', `File ${file.name} berhasil dimuat.`, 'success');
      }
    };
    reader.readAsDataURL(file);
  };

  // Edit / Add / Delete modal states
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingPackage, setEditingPackage] = useState<PricingPackage | null>(null);
  const [deletingProject, setDeletingProject] = useState<Project | null>(null);
  const [deletingPackage, setDeletingPackage] = useState<PricingPackage | null>(null);

  const [copiedSql, setCopiedSql] = useState(false);
  const [dbStatus, setDbStatus] = useState<{ configured: boolean; url?: string; hasServiceRoleKey?: boolean }>({
    configured: isSupabaseConnected(),
  });

  useEffect(() => {
    checkBackendStatus().then((status) => {
      setDbStatus({ configured: status.supabaseConnected || isSupabaseConnected() });
    });
  }, []);

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSql(true);
    addToast('SQL Schema Copied!', 'Copied PostgreSQL DDL script for Supabase SQL Editor.', 'success');
    setTimeout(() => setCopiedSql(false), 3000);
  };

  const [isSyncingSupabase, setIsSyncingSupabase] = useState(false);

  // Project CRUD Handlers
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    const projectToSave = { ...editingProject };

    if (projects.some((p) => p.id === projectToSave.id)) {
      setProjects((prev) => prev.map((p) => (p.id === projectToSave.id ? projectToSave : p)));
      addToast('Project Updated', `Saved changes for "${projectToSave.title}"`, 'success');
    } else {
      setProjects((prev) => [projectToSave, ...prev]);
      addToast('Project Created', `Added new project "${projectToSave.title}"`, 'success');
    }
    setEditingProject(null);

    // Save to Supabase DB
    const saved = await saveProjectToSupabase(projectToSave);
    if (saved) {
      addToast('Supabase Sync Success', `Project "${projectToSave.title}" saved directly to Supabase DB!`, 'success');
    } else {
      addToast('Supabase Notice', 'Project saved locally. (Check .env keys for live Supabase sync)', 'info');
    }
  };

  const confirmDeleteProject = async () => {
    if (!deletingProject) return;
    const targetProj = deletingProject;
    const id = targetProj.id;
    const title = targetProj.title;
    
    setDeletingProject(null);
    setProjects((prev) => prev.filter((p) => p.id !== id));
    addToast('Proyek Dihapus', `Proyek "${title}" telah dihapus dari portfolio.`, 'warning');
    
    const success = await deleteProjectFromSupabase(id);
    if (success) {
      addToast('Supabase Cleaned', `Proyek "${title}" dihapus dari database Supabase.`, 'success');
    }
  };

  const handleSyncAllDataToSupabase = async () => {
    setIsSyncingSupabase(true);
    addToast('Memulai Sync Supabase...', 'Mengunggah seluruh data portfolio ke database Supabase...', 'info');
    
    const result = await syncAllDataToSupabase({
      projects,
      packages,
      estimatorServices,
      estimatorScopes,
      estimatorTimelines,
      experiences,
      skills,
      siteSettings
    });
    
    setIsSyncingSupabase(false);
    if (result.success) {
      addToast(
        'Supabase Bulk Seed Berhasil! ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€¦Ã‚Â½ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â°', 
        `Berhasil mengunggah ${result.syncedTables.length} tabel (${result.syncedTables.join(', ')}) ke database Supabase PostgreSQL.`, 
        'success'
      );
    } else {
      addToast(
        'Sync Warning', 
        `Sync selesai dengan beberapa pesan: ${result.errors.join('; ')}`, 
        result.syncedTables.length > 0 ? 'warning' : 'error'
      );
    }
  };


  const handleCreateNewProject = () => {
    setEditingProject({
      id: 'proj-' + Date.now(),
      title: 'New Claymorphic Case Study',
      subtitle: 'Short project tagline',
      category: 'UI/UX Design',
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80',
      images: ['https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80'],
      client: 'Acme Global',
      year: '2026',
      role: 'Lead UI/UX Specialist',
      summary: 'Summary of problem and creative solution.',
      problemStatement: 'Problem description.',
      workflowSteps: [{ title: '1. Research', description: 'User interviews and competitive analysis.' }],
      solution: 'Design rationale.',
      results: ['+40% Conversion Rate'],
      tools: ['Figma', 'Adobe Illustrator'],
      featured: true,
    });
  };

  // Package CRUD Handlers
  const handleCreateNewPackage = () => {
    setEditingPackage({
      id: 'pkg-' + Date.now(),
      name: 'Paket Desain Baru',
      badge: 'Standard',
      priceUSD: 300,
      priceIDR: 'Rp 4.500.000',
      period: 'per project',
      description: 'Layanan desain profesional siap pakai untuk kebutuhan digital Anda.',
      features: ['Laporan Desain & High-Res Deliverables', 'Revisi hingga 3x', 'Lisensi Komersial Lengkap'],
      recommendedFor: 'UMKM & Business Growth',
      deliveryTime: '3-5 Hari Kerja',
      popular: false,
    });
  };

  const handleSavePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPackage) return;

    const pkgToSave = { ...editingPackage };

    if (packages.some((p) => p.id === pkgToSave.id)) {
      setPackages((prev) => prev.map((p) => (p.id === pkgToSave.id ? pkgToSave : p)));
      addToast('Paket Diperbarui', `Perubahan untuk "${pkgToSave.name}" berhasil disimpan.`, 'success');
    } else {
      setPackages((prev) => [...prev, pkgToSave]);
      addToast('Paket Dibuat', `Paket layanan baru "${pkgToSave.name}" berhasil dibuat.`, 'success');
    }
    setEditingPackage(null);

    // Save package to Supabase DB
    await savePackageToSupabase(pkgToSave);
  };

  const confirmDeletePackage = async () => {
    if (!deletingPackage) return;
    const targetPkg = deletingPackage;
    const id = targetPkg.id;
    const name = targetPkg.name;

    setDeletingPackage(null);
    setPackages((prev) => prev.filter((p) => p.id !== id));
    addToast('Paket Dihapus', `Paket "${name}" telah dihapus.`, 'warning');

    const success = await deletePackageFromSupabase(id);
    if (success) {
      addToast('Supabase Cleaned', `Paket "${name}" dihapus dari database Supabase.`, 'success');
    }
  };

  return (
    <div className="admin-wrap space-y-8 py-6">
      {/* CMS Top Header */}
      <div className="bg-paper2 border hairline p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-accent" aria-hidden="true" />
            <h1 className="display-font font-bold text-xl text-ink tracking-tight">
              {t.admin.dashboardTitle}
            </h1>
            <span className="mono-label text-strong px-2 py-1 border hairline rounded-sm hidden sm:inline">hidden CMS</span>
          </div>
          <p className="mono-label text-ink-muted">
            Zero-Public Exposure ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â· Headless CMS ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â· Live
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={resetToDefaults}
            className="btn-ghost text-xs"
            title="Reset to default initial data"
          >
            <RefreshCw className="w-4 h-4 text-strong" />
            <span>Reset Data</span>
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
            <span>Lock &amp; Exit</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-nowrap items-center gap-1 p-1.5 rounded-lg bg-paper2 border hairline overflow-x-auto">
        <button
          onClick={() => setActiveTab('projects')}
          className={`px-2 sm:px-3.5 py-2 rounded-md transition flex items-center gap-1.5 shrink-0 whitespace-nowrap ${
            activeTab === 'projects' ? 'bg-ink text-paper' : 'text-ink-muted hover:text-ink hover:bg-surface'
          }`}
        >
          <FolderPlus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Proyek Portfolio ({projects.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('packages')}
          className={`px-2 sm:px-3.5 py-2 rounded-md transition flex items-center gap-1.5 shrink-0 whitespace-nowrap ${
            activeTab === 'packages' ? 'bg-ink text-paper' : 'text-ink-muted hover:text-ink hover:bg-surface'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Paket & Layanan ({packages.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('estimator')}
          className={`px-2 sm:px-3.5 py-2 rounded-md transition flex items-center gap-1.5 shrink-0 whitespace-nowrap ${
            activeTab === 'estimator' ? 'bg-ink text-paper' : 'text-ink-muted hover:text-ink hover:bg-surface'
          }`}
        >
          <Calculator className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Calculator Estimator ({estimatorServices.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('experiences')}
          className={`px-2 sm:px-3.5 py-2 rounded-md transition flex items-center gap-1.5 shrink-0 whitespace-nowrap ${
            activeTab === 'experiences' ? 'bg-ink text-paper' : 'text-ink-muted hover:text-ink hover:bg-surface'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Karir & Pendidikan ({experiences.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('skills')}
          className={`px-2 sm:px-3.5 py-2 rounded-md transition flex items-center gap-1.5 shrink-0 whitespace-nowrap ${
            activeTab === 'skills' ? 'bg-ink text-paper' : 'text-ink-muted hover:text-ink hover:bg-surface'
          }`}
        >
          <Wrench className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Keahlian & Tools ({skills.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('messages')}
          className={`px-2 sm:px-3.5 py-2 rounded-md transition flex items-center gap-1.5 shrink-0 whitespace-nowrap ${
            activeTab === 'messages' ? 'bg-ink text-paper' : 'text-ink-muted hover:text-ink hover:bg-surface'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Pesan Client</span>
          {messages.filter((m) => !m.read).length > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px]">
              {messages.filter((m) => !m.read).length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-2 sm:px-3.5 py-2 rounded-md transition flex items-center gap-1.5 shrink-0 whitespace-nowrap ${
            activeTab === 'settings' ? 'bg-ink text-paper' : 'text-ink-muted hover:text-ink hover:bg-surface'
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Profile & Web</span>
        </button>

        <button
          onClick={() => setActiveTab('supabase')}
          className={`px-2 sm:px-3.5 py-2 rounded-md transition flex items-center gap-1.5 shrink-0 whitespace-nowrap ${
            activeTab === 'supabase' ? 'bg-ink text-paper' : 'text-ink-muted hover:text-ink hover:bg-surface'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Supabase DB</span>
          {dbStatus.configured ? (
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          ) : (
            <span className="w-2 h-2 rounded-full bg-amber-400" />
          )}
        </button>

        <div className="w-px h-6 bg-line mx-1 shrink-0" aria-hidden="true" />
        <button onClick={() => setActiveTab('content-home')} className={`px-2 sm:px-3.5 py-2 rounded-md transition flex items-center gap-1.5 shrink-0 whitespace-nowrap ${activeTab === 'content-home' ? 'bg-ink text-paper' : 'text-ink-muted hover:text-ink hover:bg-surface'}`}><Home className="w-3.5 h-3.5" /><span className="hidden sm:inline">Home</span></button>
        <button onClick={() => setActiveTab('content-about')} className={`px-2 sm:px-3.5 py-2 rounded-md transition flex items-center gap-1.5 shrink-0 whitespace-nowrap ${activeTab === 'content-about' ? 'bg-ink text-paper' : 'text-ink-muted hover:text-ink hover:bg-surface'}`}><UserRound className="w-3.5 h-3.5" /><span className="hidden sm:inline">About</span></button>
        <button onClick={() => setActiveTab('content-portfolio')} className={`px-2 sm:px-3.5 py-2 rounded-md transition flex items-center gap-1.5 shrink-0 whitespace-nowrap ${activeTab === 'content-portfolio' ? 'bg-ink text-paper' : 'text-ink-muted hover:text-ink hover:bg-surface'}`}><FileText className="w-3.5 h-3.5" /><span className="hidden sm:inline">Portfolio</span></button>
        <button onClick={() => setActiveTab('content-services')} className={`px-2 sm:px-3.5 py-2 rounded-md transition flex items-center gap-1.5 shrink-0 whitespace-nowrap ${activeTab === 'content-services' ? 'bg-ink text-paper' : 'text-ink-muted hover:text-ink hover:bg-surface'}`}><Layers className="w-3.5 h-3.5" /><span className="hidden sm:inline">Services</span></button>
        <button onClick={() => setActiveTab('content-contact')} className={`px-2 sm:px-3.5 py-2 rounded-md transition flex items-center gap-1.5 shrink-0 whitespace-nowrap ${activeTab === 'content-contact' ? 'bg-ink text-paper' : 'text-ink-muted hover:text-ink hover:bg-surface'}`}><Mail className="w-3.5 h-3.5" /><span className="hidden sm:inline">Contact</span></button>
        <button onClick={() => setActiveTab('content-footer')} className={`px-2 sm:px-3.5 py-2 rounded-md transition flex items-center gap-1.5 shrink-0 whitespace-nowrap ${activeTab === 'content-footer' ? 'bg-ink text-paper' : 'text-ink-muted hover:text-ink hover:bg-surface'}`}><Home className="w-3.5 h-3.5 rotate-180" /><span className="hidden sm:inline">Footer</span></button>
        <button onClick={() => setActiveTab('faq')} className={`px-2 sm:px-3.5 py-2 rounded-md transition flex items-center gap-1.5 shrink-0 whitespace-nowrap ${activeTab === 'faq' ? 'bg-ink text-paper' : 'text-ink-muted hover:text-ink hover:bg-surface'}`}><HelpCircle className="w-3.5 h-3.5" /><span className="hidden sm:inline">FAQ</span></button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-2 sm:px-3.5 py-2 rounded-md transition flex items-center gap-1.5 shrink-0 whitespace-nowrap ${
            activeTab === 'analytics' ? 'bg-ink text-paper' : 'text-ink-muted hover:text-ink hover:bg-surface'
          }`}
        >
          <BarChart2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Analytics</span>
        </button>
      </div>


      {/* Content editor (per-page) */}
      {(activeTab.startsWith('content-')) && (
        <PageContentEditor page={activeTab.replace('content-', '')} label={activeTab.replace('content-', '')} />
      )}
      {activeTab === 'faq' && <FaqEditor />}

      {/* Tab 1: Projects Management (CRUD) */}
      {activeTab === 'projects' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-800">Public Portfolio Projects</h2>
            <button onClick={handleCreateNewProject} className="clay-button text-xs px-4 py-2 flex items-center gap-1.5">
              <Plus className="w-4 h-4" />
              <span>Add New Project</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((proj) => (
              <div key={proj.id} className="clay-card p-5 bg-white flex flex-col justify-between space-y-4">
                <div className="flex items-start gap-3">
                  <img src={proj.thumbnail} alt={proj.title} className="w-16 h-16 rounded-xl object-cover shrink-0" />
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-bold text-blue-600 uppercase">{proj.category}</span>
                    <h3 className="font-extrabold text-sm text-slate-900 truncate">{proj.title}</h3>
                    <p className="text-xs text-slate-500 line-clamp-1">{proj.subtitle}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${proj.featured ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-500'}`}>
                    {proj.featured ? 'ÃƒÆ’Ã‚Â¢Ãƒâ€¹Ã…â€œÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ Featured' : 'Standard'}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingProject(proj)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 hover:text-blue-600 hover:bg-blue-50 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                      title="Edit Detail Proyek"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeletingProject(proj)}
                      className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white font-bold text-xs flex items-center gap-1.5 border border-rose-200 transition cursor-pointer active:scale-95 shadow-sm"
                      title="Hapus Proyek"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Hapus</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Project Edit/Add Modal */}
      {editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="clay-card w-full max-w-4xl max-h-[92vh] bg-white flex flex-col shadow-2xl overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="font-black text-lg text-slate-900 flex items-center gap-2">
                <Edit className="w-5 h-5 text-blue-600" />
                <span>Edit Case Study Detail ({editingProject.title})</span>
              </h2>
              <button
                onClick={() => setEditingProject(null)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="overflow-y-auto flex-1 space-y-5 text-xs pr-2">
              {/* Section 1: Basic Info */}
              <div className="space-y-3 p-4 bg-slate-50/70 rounded-2xl border border-slate-200">
                <h3 className="font-black text-slate-800 uppercase tracking-wider text-[11px]">1. Informasi Dasar Proyek</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Judul Proyek / Title</label>
                    <input
                      type="text"
                      required
                      value={editingProject.title}
                      onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                      className="clay-input w-full text-xs"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Sub-judul / Tagline</label>
                    <input
                      type="text"
                      value={editingProject.subtitle || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, subtitle: e.target.value })}
                      className="clay-input w-full text-xs"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Kategori Proyek</label>
                    <select
                      value={editingProject.category}
                      onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value as any })}
                      className="clay-input w-full text-xs bg-white font-bold"
                    >
                      <option>UI/UX Design</option>
                      <option>Graphic & Brand</option>
                      <option>Social Media & Print</option>
                      <option>Mobile App</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Nama Client</label>
                    <input
                      type="text"
                      value={editingProject.client || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, client: e.target.value })}
                      className="clay-input w-full text-xs"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Tahun (Year)</label>
                    <input
                      type="text"
                      value={editingProject.year || '2026'}
                      onChange={(e) => setEditingProject({ ...editingProject, year: e.target.value })}
                      className="clay-input w-full text-xs"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Role / Peran Utama</label>
                    <input
                      type="text"
                      value={editingProject.role || 'Lead UI/UX Specialist'}
                      onChange={(e) => setEditingProject({ ...editingProject, role: e.target.value })}
                      className="clay-input w-full text-xs"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="font-bold text-slate-700 block mb-1">Live Demo / Prototype URL</label>
                    <input
                      type="text"
                      value={editingProject.liveUrl || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, liveUrl: e.target.value })}
                      placeholder="https://dribbble.com/..."
                      className="clay-input w-full text-xs font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Thumbnail Image & Upload Button */}
              <div className="p-4 bg-slate-50/70 rounded-2xl border border-slate-200 space-y-3">
                <h3 className="font-black text-slate-800 uppercase tracking-wider text-[11px]">2. Gambar Cover / Thumbnail</h3>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {editingProject.thumbnail ? (
                    <img
                      src={editingProject.thumbnail}
                      alt="Thumbnail Preview"
                      className="w-28 h-20 rounded-xl object-cover border border-slate-200 shadow-sm shrink-0"
                    />
                  ) : (
                    <div className="w-28 h-20 rounded-xl bg-slate-200 flex items-center justify-center text-slate-400 font-bold shrink-0">
                      No Image
                    </div>
                  )}
                  <div className="flex-1 w-full space-y-2">
                    <input
                      type="text"
                      value={editingProject.thumbnail}
                      onChange={(e) => setEditingProject({ ...editingProject, thumbnail: e.target.value })}
                      placeholder="Paste Image URL / Data URL"
                      className="clay-input w-full text-xs font-mono"
                    />
                    <label className="clay-button-primary bg-blue-600 hover:bg-blue-500 text-white text-xs px-4 py-2 rounded-xl cursor-pointer inline-flex items-center gap-2 font-bold">
                      <UploadCloud className="w-4 h-4" />
                      <span>Upload / Pilih File Gambar Cover</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, (url) => setEditingProject({ ...editingProject, thumbnail: url }))}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Section 3: Summary, Problem & Solution Case Study */}
              <div className="p-4 bg-slate-50/70 rounded-2xl border border-slate-200 space-y-3">
                <h3 className="font-black text-slate-800 uppercase tracking-wider text-[11px]">3. Ringkasan & Problem Solving</h3>
                
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Ringkasan Utama / Summary</label>
                  <textarea
                    rows={2}
                    value={editingProject.summary}
                    onChange={(e) => setEditingProject({ ...editingProject, summary: e.target.value })}
                    className="clay-input w-full text-xs resize-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tantangan & Rumusan Masalah (Problem Statement)</label>
                  <textarea
                    rows={3}
                    value={editingProject.problemStatement || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, problemStatement: e.target.value })}
                    placeholder="Jelaskan masalah client yang perlu diselesaikan..."
                    className="clay-input w-full text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Solusi & Pendekatan Desain (Design Solution)</label>
                  <textarea
                    rows={3}
                    value={editingProject.solution || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, solution: e.target.value })}
                    placeholder="Jelaskan bagaimana pendekatan visual & UX menyelesaikan masalah..."
                    className="clay-input w-full text-xs"
                  />
                </div>
              </div>

              {/* Section 4: Screenshots Gallery & Upload Buttons */}
              <div className="p-4 bg-slate-50/70 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-slate-800 uppercase tracking-wider text-[11px]">
                    4. Galeri Tangkapan Layar / Screenshots ({(editingProject.images || []).length})
                  </h3>
                  <label className="clay-button text-xs px-3 py-1.5 cursor-pointer flex items-center gap-1.5 font-bold">
                    <Plus className="w-3.5 h-3.5" />
                    <span>Upload Screenshot</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleFileUpload(e, (url) =>
                          setEditingProject({
                            ...editingProject,
                            images: [...(editingProject.images || []), url],
                          })
                        )
                      }
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="space-y-2">
                  {(editingProject.images || []).map((imgUrl, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-slate-200">
                      <img src={imgUrl} alt={`Screenshot ${idx + 1}`} className="w-14 h-10 rounded-lg object-cover border shrink-0" />
                      <input
                        type="text"
                        value={imgUrl}
                        onChange={(e) => {
                          const newImgs = [...(editingProject.images || [])];
                          newImgs[idx] = e.target.value;
                          setEditingProject({ ...editingProject, images: newImgs });
                        }}
                        className="clay-input flex-1 text-xs font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newImgs = (editingProject.images || []).filter((_, i) => i !== idx);
                          setEditingProject({ ...editingProject, images: newImgs });
                        }}
                        className="p-1.5 rounded-lg text-rose-600 bg-rose-50 hover:bg-rose-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 5: Tools & Highlights */}
              <div className="p-4 bg-slate-50/70 rounded-2xl border border-slate-200 space-y-3">
                <h3 className="font-black text-slate-800 uppercase tracking-wider text-[11px]">5. Tools & Hasil (Results)</h3>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tools Digunakan (pisahkan dengan koma)</label>
                  <input
                    type="text"
                    value={Array.isArray(editingProject.tools) ? editingProject.tools.join(', ') : editingProject.tools || ''}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        tools: e.target.value.split(',').map((s) => s.trim()),
                      })
                    }
                    placeholder="Figma, Adobe Illustrator, React, Tailwind CSS"
                    className="clay-input w-full text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Highlight Hasil / Results (pisahkan dengan koma)</label>
                  <input
                    type="text"
                    value={Array.isArray(editingProject.results) ? editingProject.results.join(', ') : ''}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        results: e.target.value.split(',').map((s) => s.trim()),
                      })
                    }
                    placeholder="+40% Conversion, 2.5x Growth, Award Winning"
                    className="clay-input w-full text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featChk"
                  checked={editingProject.featured}
                  onChange={(e) => setEditingProject({ ...editingProject, featured: e.target.checked })}
                />
                <label htmlFor="featChk" className="font-bold text-slate-800 cursor-pointer text-xs">
                  Tampilkan sebagai Highlight Utama di Beranda (Featured Project)
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100">
                <button type="button" onClick={() => setEditingProject(null)} className="clay-button-secondary px-4 py-2 text-xs">
                  Batal
                </button>
                <button type="submit" className="clay-button-primary bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 flex items-center gap-1.5 text-xs font-bold">
                  <Save className="w-4 h-4" />
                  <span>Simpan Perubahan Proyek</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Package Edit/Add Modal */}
      {editingPackage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="clay-card w-full max-w-2xl max-h-[90vh] bg-white flex flex-col shadow-2xl overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="font-black text-lg text-slate-900 flex items-center gap-2">
                <Layers className="w-5 h-5 text-blue-600" />
                <span>Edit / Tambah Paket Layanan ({editingPackage.name})</span>
              </h2>
              <button
                onClick={() => setEditingPackage(null)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePackage} className="overflow-y-auto flex-1 space-y-4 text-xs pr-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nama Paket</label>
                  <input
                    type="text"
                    required
                    value={editingPackage.name}
                    onChange={(e) => setEditingPackage({ ...editingPackage, name: e.target.value })}
                    className="clay-input w-full text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Badge Label (cth: Best Value, Standard)</label>
                  <input
                    type="text"
                    value={editingPackage.badge || ''}
                    onChange={(e) => setEditingPackage({ ...editingPackage, badge: e.target.value })}
                    className="clay-input w-full text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Harga USD ($)</label>
                  <input
                    type="number"
                    value={editingPackage.priceUSD}
                    onChange={(e) => setEditingPackage({ ...editingPackage, priceUSD: Number(e.target.value) })}
                    className="clay-input w-full text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Harga IDR (Rupiah Teks)</label>
                  <input
                    type="text"
                    value={editingPackage.priceIDR}
                    onChange={(e) => setEditingPackage({ ...editingPackage, priceIDR: e.target.value })}
                    className="clay-input w-full text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Estimasi Waktu Pengerjaan (Delivery Time)</label>
                  <input
                    type="text"
                    value={editingPackage.deliveryTime || ''}
                    onChange={(e) => setEditingPackage({ ...editingPackage, deliveryTime: e.target.value })}
                    placeholder="3-5 Hari Kerja"
                    className="clay-input w-full text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Rekomendasi Untuk (Target Client)</label>
                  <input
                    type="text"
                    value={editingPackage.recommendedFor || ''}
                    onChange={(e) => setEditingPackage({ ...editingPackage, recommendedFor: e.target.value })}
                    placeholder="UMKM & Business Growth"
                    className="clay-input w-full text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Deskripsi Singkat Paket</label>
                <textarea
                  rows={2}
                  value={editingPackage.description}
                  onChange={(e) => setEditingPackage({ ...editingPackage, description: e.target.value })}
                  className="clay-input w-full text-xs resize-none"
                />
              </div>

              {/* Package Features List */}
              <div className="space-y-2 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800">Cakupan Fitur & Deliverables ({editingPackage.features.length})</label>
                  <button
                    type="button"
                    onClick={() =>
                      setEditingPackage({
                        ...editingPackage,
                        features: [...editingPackage.features, 'Fitur Baru / Deliverable Output'],
                      })
                    }
                    className="clay-button text-[11px] px-2.5 py-1 font-bold flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3 text-blue-600" />
                    <span>Tambah Fitur</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {editingPackage.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={feat}
                        onChange={(e) => {
                          const newFeats = [...editingPackage.features];
                          newFeats[idx] = e.target.value;
                          setEditingPackage({ ...editingPackage, features: newFeats });
                        }}
                        className="clay-input flex-1 text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newFeats = editingPackage.features.filter((_, i) => i !== idx);
                          setEditingPackage({ ...editingPackage, features: newFeats });
                        }}
                        className="p-1.5 rounded-lg text-rose-600 bg-rose-50 hover:bg-rose-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="popChk"
                  checked={editingPackage.popular || false}
                  onChange={(e) => setEditingPackage({ ...editingPackage, popular: e.target.checked })}
                />
                <label htmlFor="popChk" className="font-bold text-slate-800 cursor-pointer text-xs">
                  Tandai sebagai Paket Paling Populer (Popular Badge)
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100">
                <button type="button" onClick={() => setEditingPackage(null)} className="clay-button-secondary px-4 py-2 text-xs">
                  Batal
                </button>
                <button type="submit" className="clay-button-primary bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 flex items-center gap-1.5 text-xs font-bold">
                  <Save className="w-4 h-4" />
                  <span>Simpan Perubahan Paket</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tab 2: Packages Management */}
      {activeTab === 'packages' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-slate-800">Paket Layanan & Harga CMS</h2>
              <p className="text-xs text-slate-500">Kelola daftar paket harga, deliverables, durasi pengerjaan, dan harga dalam USD & IDR.</p>
            </div>
            <button
              onClick={handleCreateNewPackage}
              className="clay-button-primary bg-blue-600 hover:bg-blue-500 text-white text-xs px-4 py-2.5 flex items-center gap-2 font-bold"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Paket Baru</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {packages.map((pkg) => (
              <div key={pkg.id} className="clay-card p-5 bg-white space-y-3 border border-slate-200">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-black text-sm text-slate-900">{pkg.name}</h3>
                    <span className="text-xs font-bold text-blue-600">${pkg.priceUSD} USD / {pkg.priceIDR}</span>
                  </div>
                  {pkg.popular && <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">Popular</span>}
                </div>
                <p className="text-xs text-slate-600 line-clamp-2 font-medium">{pkg.description}</p>

                <div className="text-[11px] text-slate-500 space-y-1">
                  <div>ÃƒÆ’Ã‚Â¢Ãƒâ€šÃ‚ÂÃƒâ€šÃ‚Â±ÃƒÆ’Ã‚Â¯Ãƒâ€šÃ‚Â¸Ãƒâ€šÃ‚Â Delivery: <span className="font-bold text-slate-700">{pkg.deliveryTime || '3-5 Hari'}</span></div>
                  <div>ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€¦Ã‚Â½Ãƒâ€šÃ‚Â¯ Targeted For: <span className="font-bold text-slate-700">{pkg.recommendedFor || 'All Clients'}</span></div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                  <button
                    onClick={() => setEditingPackage(pkg)}
                    className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 font-bold text-xs flex items-center gap-1.5"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit Paket</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeletingPackage(pkg)}
                    className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white font-bold text-xs flex items-center gap-1.5 border border-rose-200 transition cursor-pointer active:scale-95 shadow-sm"
                    title="Hapus Paket"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Messages & Inquiries */}
      {activeTab === 'messages' && (
        <div className="space-y-6">
          <h2 className="text-lg font-black text-slate-800">Direct Contact Messages & Leads</h2>

          {messages.length > 0 ? (
            <div className="space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`clay-card p-5 space-y-2 border ${msg.read ? 'bg-white border-slate-200' : 'bg-blue-50/60 border-blue-200'}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-extrabold text-sm text-slate-900">{msg.name}</h3>
                      <p className="text-xs text-slate-500">{msg.email} ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¢ {msg.serviceInterest} ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¢ Budget: {msg.budget}</p>
                    </div>
                    <span className="text-[10px] text-slate-400">{new Date(msg.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl">{msg.message}</p>

                  <div className="pt-2 flex justify-end gap-2">
                    {!msg.read && (
                      <button onClick={() => markMessageRead(msg.id)} className="clay-button-secondary text-xs px-3 py-1">
                        Mark as Read
                      </button>
                    )}
                    <button onClick={() => deleteMessage(msg.id)} className="p-1.5 rounded-xl bg-rose-50 text-rose-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="clay-card p-8 text-center text-xs text-slate-500">No contact inquiries recorded yet.</div>
          )}
        </div>
      )}

      {/* Tab 4: Visitor Analytics */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <h2 className="text-lg font-black text-slate-800">Live Traffic & Conversion Metrics</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="clay-card p-5 bg-white text-center">
              <span className="text-2xl font-black text-slate-900 block">{analytics.totalVisitors}</span>
              <span className="text-xs font-semibold text-slate-500">Total Unique Visitors</span>
            </div>
            <div className="clay-card p-5 bg-white text-center">
              <span className="text-2xl font-black text-blue-600 block">{analytics.projectViews}</span>
              <span className="text-xs font-semibold text-slate-500">Project Case Views</span>
            </div>
            <div className="clay-card p-5 bg-white text-center">
              <span className="text-2xl font-black text-emerald-600 block">{analytics.inquiriesSent}</span>
              <span className="text-xs font-semibold text-slate-500">Inquiries Received</span>
            </div>
            <div className="clay-card p-5 bg-white text-center">
              <span className="text-2xl font-black text-purple-600 block">{analytics.cvDownloads}</span>
              <span className="text-xs font-semibold text-slate-500">CV Downloads</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Supabase Database Manager */}
      {activeTab === 'supabase' && (
        <div className="space-y-6">
          <div className="clay-card p-6 sm:p-8 bg-white space-y-6 border border-slate-200/90 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <span>Supabase PostgreSQL Integration</span>
                    {dbStatus.configured ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        Active & Connected
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                        Keys Pending in .env
                      </span>
                    )}
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    Perubahan situs kini otomatis tersimpan ke Supabase (auto-sync) — tanpa klik manual.
                    Tombol push di bawah hanya untuk menyinkronkan seluruh tabel dari data default.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleSyncAllDataToSupabase}
                  disabled={isSyncingSupabase}
                  className="clay-button-secondary bg-emerald-700 hover:bg-emerald-600 text-white text-xs px-4 py-2.5 flex items-center gap-2 shrink-0 disabled:opacity-50 font-bold"
                >
                  <RefreshCw className={`w-4 h-4 text-emerald-200 ${isSyncingSupabase ? 'animate-spin' : ''}`} />
                  <span>{isSyncingSupabase ? 'Syncing Tables...' : 'Push All Default Data to Supabase'}</span>
                </button>
                
                <button
                  onClick={handleCopySql}
                  className="clay-button-primary bg-slate-900 hover:bg-slate-800 text-white text-xs px-4 py-2.5 flex items-center gap-2 shrink-0"
                >
                  {copiedSql ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedSql ? 'SQL Schema Copied!' : 'Copy SQL Schema'}</span>
                </button>
              </div>
            </div>

            {/* Status Summary & Environment Variables guide */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-slate-400 text-[10px] uppercase font-black block tracking-wider">Environment Variables (.env.example)</span>
                <ul className="space-y-1 text-slate-700 font-mono text-[11px]">
                  <li><span className="text-blue-600 font-bold">SUPABASE_URL</span> = https://your-project.supabase.co</li>
                  <li><span className="text-blue-600 font-bold">SUPABASE_ANON_KEY</span> = eyJhbGciOi...</li>
                  <li><span className="text-blue-600 font-bold">VITE_SUPABASE_URL</span> = https://your-project.supabase.co</li>
                  <li><span className="text-blue-600 font-bold">VITE_SUPABASE_ANON_KEY</span> = eyJhbGciOi...</li>
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 text-slate-700 space-y-2">
                <span className="text-emerald-800 text-[10px] uppercase font-black block tracking-wider">Database Tables Configured & Ready</span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-white p-2 rounded-xl border border-emerald-200/60 font-medium flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>projects</span>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-emerald-200/60 font-medium flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>packages</span>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-emerald-200/60 font-medium flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>estimator_services</span>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-emerald-200/60 font-medium flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>estimator_scopes</span>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-emerald-200/60 font-medium flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>estimator_timelines</span>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-emerald-200/60 font-medium flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>experiences</span>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-emerald-200/60 font-medium flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>skills</span>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-emerald-200/60 font-medium flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>messages & estimates</span>
                  </div>
                </div>
              </div>
            </div>


            {/* SQL DDL Schema Terminal Box */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-800 flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-slate-700" />
                  <span>PostgreSQL DDL Migration Script (Paste into Supabase SQL Editor)</span>
                </span>
                <span className="text-[10px] font-bold text-slate-500">Row Level Security (RLS) Enabled</span>
              </div>

              <div className="relative rounded-2xl bg-slate-900 text-emerald-400 p-4 font-mono text-[11px] overflow-x-auto max-h-72 border border-slate-800 leading-relaxed">
                <pre>{SUPABASE_SQL_SCHEMA}</pre>
              </div>
            </div>
          </div>
        </div>
      )}
      {activeTab === 'estimator' && (
        <div className="space-y-8">
          <div className="clay-card p-6 sm:p-8 bg-white space-y-6 border border-slate-200/90 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-200">
                  <Calculator className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <span>Pengatur Harga & Isi Paket Calculator</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-bold">
                      Editable CMS & Dynamic Sync
                    </span>
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    Atur daftar paket layanan, harga dasar (USD & IDR), rincian isi paket (deliverables), serta multiplier skop & durasi yang muncul pada Project Estimator Client.
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  const newId = 'service-' + Date.now();
                  setEstimatorServices((prev) => [
                    ...prev,
                    {
                      id: newId,
                      name: 'Layanan Baru / Custom Package',
                      baseUsd: 200,
                      baseIdrNum: 3000000,
                      icon: 'Sparkles',
                      deliverables: ['Deliverable / File Output 1', 'Deliverable / File Output 2'],
                    },
                  ]);
                  addToast('Paket Dibuat', 'Berhasil menambah opsi paket calculator baru.', 'success');
                }}
                className="clay-button-primary bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-4 py-2.5 flex items-center gap-2 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Opsi Paket Baru</span>
              </button>
            </div>

            {/* Section 1: Daftar Opsi Paket & Deliverables */}
            <div className="space-y-6">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-600" />
                <span>1. Opsi Paket Layanan & Deliverables (Isi Paket)</span>
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {estimatorServices.map((srv, index) => (
                  <div key={srv.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                    <div className="flex items-center justify-between gap-2 border-b border-slate-200 pb-3">
                      <span className="text-xs font-black text-slate-400 uppercase font-mono">
                        Paket #{index + 1} (ID: {srv.id})
                      </span>
                      <button
                        onClick={() => {
                          setEstimatorServices((prev) => prev.filter((item) => item.id !== srv.id));
                          addToast('Paket Dihapus', `Opsi paket "${srv.name}" telah dihapus dari Estimator.`, 'warning');
                        }}
                        className="p-1.5 text-rose-500 hover:bg-rose-100 rounded-lg transition"
                        title="Hapus Opsi Paket"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="text-[11px] font-bold text-slate-600 block mb-1">Nama Layanan / Paket</label>
                        <input
                          type="text"
                          value={srv.name}
                          onChange={(e) => {
                            const val = e.target.value;
                            setEstimatorServices((prev) =>
                              prev.map((item) => (item.id === srv.id ? { ...item, name: val } : item))
                            );
                          }}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] font-bold text-slate-600 block mb-1">Harga Dasar USD ($)</label>
                          <input
                            type="number"
                            value={srv.baseUsd}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              setEstimatorServices((prev) =>
                                prev.map((item) => (item.id === srv.id ? { ...item, baseUsd: val } : item))
                              );
                            }}
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-slate-600 block mb-1">Harga Dasar IDR (Rp)</label>
                          <input
                            type="number"
                            value={srv.baseIdrNum}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              setEstimatorServices((prev) =>
                                prev.map((item) => (item.id === srv.id ? { ...item, baseIdrNum: val } : item))
                              );
                            }}
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>
                      </div>

                      {/* Deliverables (Isi Paket List) */}
                      <div className="space-y-2 pt-2 border-t border-slate-200/80">
                        <div className="flex items-center justify-between">
                          <label className="text-[11px] font-extrabold text-slate-700 flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Isi Paket / Deliverables ({srv.deliverables.length})</span>
                          </label>
                          <button
                            onClick={() => {
                              setEstimatorServices((prev) =>
                                prev.map((item) =>
                                  item.id === srv.id
                                    ? { ...item, deliverables: [...item.deliverables, 'Deliverable Baru / Item Hasil'] }
                                    : item
                                )
                              );
                            }}
                            className="text-[10px] font-extrabold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Tambah Deliverable</span>
                          </button>
                        </div>

                        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                          {srv.deliverables.map((del, dIdx) => (
                            <div key={dIdx} className="flex items-center gap-1.5">
                              <span className="text-[10px] font-mono font-bold text-slate-400">{dIdx + 1}.</span>
                              <input
                                type="text"
                                value={del}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setEstimatorServices((prev) =>
                                    prev.map((item) => {
                                      if (item.id !== srv.id) return item;
                                      const updatedDels = [...item.deliverables];
                                      updatedDels[dIdx] = val;
                                      return { ...item, deliverables: updatedDels };
                                    })
                                  );
                                }}
                                className="flex-1 px-2.5 py-1.5 rounded-lg border border-slate-200 text-[11px] font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                              />
                              <button
                                onClick={() => {
                                  setEstimatorServices((prev) =>
                                    prev.map((item) => {
                                      if (item.id !== srv.id) return item;
                                      const updatedDels = item.deliverables.filter((_, idx) => idx !== dIdx);
                                      return { ...item, deliverables: updatedDels };
                                    })
                                  );
                                }}
                                className="p-1 text-slate-400 hover:text-rose-500 rounded"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 2: Multiplier Skop Kebutuhan (Starter / Pro / Enterprise) */}
            <div className="space-y-4 pt-6 border-t border-slate-200">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>2. Multiplier Skala Skop (Tingkat Kompleksitas)</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {estimatorScopes.map((scope) => (
                  <div key={scope.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <span className="text-[10px] font-bold font-mono text-indigo-600 uppercase">
                      ID: {scope.id}
                    </span>
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">Label Skop</label>
                      <input
                        type="text"
                        value={scope.label}
                        onChange={(e) => {
                          const val = e.target.value;
                          setEstimatorScopes((prev) =>
                            prev.map((s) => (s.id === scope.id ? { ...s, label: val } : s))
                          );
                        }}
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">Multiplier Perkalian Harga (cth: 1.4)</label>
                      <input
                        type="number"
                        step="0.05"
                        value={scope.mult}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setEstimatorScopes((prev) =>
                            prev.map((s) => (s.id === scope.id ? { ...s, mult: val } : s))
                          );
                        }}
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-extrabold text-indigo-600 font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">Deskripsi Ringkas</label>
                      <input
                        type="text"
                        value={scope.desc}
                        onChange={(e) => {
                          const val = e.target.value;
                          setEstimatorScopes((prev) =>
                            prev.map((s) => (s.id === scope.id ? { ...s, desc: val } : s))
                          );
                        }}
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-[11px] font-medium text-slate-600"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 3: Multiplier Timeline / Rush Order */}
            <div className="space-y-4 pt-6 border-t border-slate-200">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-600" />
                <span>3. Multiplier Urgensi Waktu Delivery</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {estimatorTimelines.map((tm) => (
                  <div key={tm.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <span className="text-[10px] font-bold font-mono text-indigo-600 uppercase">
                      ID: {tm.id}
                    </span>
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">Label Durasi Waktu</label>
                      <input
                        type="text"
                        value={tm.label}
                        onChange={(e) => {
                          const val = e.target.value;
                          setEstimatorTimelines((prev) =>
                            prev.map((t) => (t.id === tm.id ? { ...t, label: val } : t))
                          );
                        }}
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">Multiplier Perkalian Urgensi (cth: 1.25)</label>
                      <input
                        type="number"
                        step="0.05"
                        value={tm.mult}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setEstimatorTimelines((prev) =>
                            prev.map((t) => (t.id === tm.id ? { ...t, mult: val } : t))
                          );
                        }}
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-extrabold text-indigo-600 font-mono"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Experiences & Career / Education History CMS */}
      {activeTab === 'experiences' && (
        <div className="space-y-8">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-purple-600" />
                <span>Pengaturan Karir & Riwayat Pendidikan</span>
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Kelola riwayat karir profesional, pengalaman kerja, serta pendidikan formal secara terpisah.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const newWork: ExperienceItem = {
                    id: 'exp-' + Date.now(),
                    type: 'work',
                    role: 'Senior UI/UX Designer',
                    companyOrOrg: 'Perusahaan / Client Baru',
                    period: '2024 - Present',
                    location: 'Jakarta / Remote',
                    description: 'Memimpin perancangan sistem UI/UX web & mobile.',
                    highlights: ['Desain Design System', 'Peningkatan Retensi User']
                  };
                  setExperiences((prev) => [newWork, ...prev]);
                  addToast('Karir Ditambahkan', 'Item pengalaman kerja baru berhasil dibuat.', 'success');
                }}
                className="clay-button-primary bg-purple-600 hover:bg-purple-500 text-white text-xs px-4 py-2.5 flex items-center gap-2 font-bold"
              >
                <Plus className="w-4 h-4" />
                <span>+ Tambah Pekerjaan Baru</span>
              </button>

              <button
                onClick={() => {
                  const newEdu: ExperienceItem = {
                    id: 'edu-' + Date.now(),
                    type: 'education',
                    role: 'S1 Desain Komunikasi Visual',
                    companyOrOrg: 'Universitas / Institut Pendidikan',
                    period: '2020 - 2024',
                    location: 'Indonesia',
                    description: 'Fokus pada Branding, UI/UX, Typography, dan Layouting.',
                    highlights: ['Lulus Cumlaude', 'Juara Desain Aplikasi']
                  };
                  setExperiences((prev) => [...prev, newEdu]);
                  addToast('Pendidikan Ditambahkan', 'Item riwayat pendidikan baru berhasil dibuat.', 'success');
                }}
                className="clay-button-secondary text-purple-700 bg-purple-50 hover:bg-purple-100 text-xs px-4 py-2.5 flex items-center gap-2 font-bold"
              >
                <Plus className="w-4 h-4" />
                <span>+ Tambah Pendidikan Baru</span>
              </button>
            </div>
          </div>

          {/* Section 1: Pengalaman Kerja & Karir */}
          <div className="space-y-4">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-purple-600" />
              <span>1. Pengalaman Kerja & Karir Professional ({experiences.filter((e) => e.type !== 'education').length})</span>
            </h3>

            <div className="grid grid-cols-1 gap-4">
              {experiences
                .filter((e) => e.type !== 'education')
                .map((exp, idx) => (
                  <div key={exp.id} className="clay-card p-6 bg-white space-y-4 border border-slate-200/90 shadow-sm">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-purple-600 uppercase tracking-wider font-mono">
                          Karir #{idx + 1}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-bold uppercase">
                          {exp.type}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          setExperiences((prev) => prev.filter((e) => e.id !== exp.id));
                          addToast('Karir Dihapus', 'Data karir telah dihapus.', 'warning');
                        }}
                        className="p-1.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100"
                        title="Hapus Karir"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs font-bold">
                      <div>
                        <label className="text-[11px] text-slate-500 block mb-1">Kategori / Tipe</label>
                        <select
                          value={exp.type}
                          onChange={(e) => {
                            const val = e.target.value as any;
                            setExperiences((prev) => prev.map((item) => (item.id === exp.id ? { ...item, type: val } : item)));
                          }}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 bg-white"
                        >
                          <option value="work">Pengalaman Kerja (Work)</option>
                          <option value="leadership">Organisasi / Leadership</option>
                          <option value="education">Pendidikan (Education)</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[11px] text-slate-500 block mb-1">Posisi / Job Title</label>
                        <input
                          type="text"
                          value={exp.role}
                          onChange={(e) => {
                            const val = e.target.value;
                            setExperiences((prev) => prev.map((item) => (item.id === exp.id ? { ...item, role: val } : item)));
                          }}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] text-slate-500 block mb-1">Perusahaan / Client</label>
                        <input
                          type="text"
                          value={exp.companyOrOrg}
                          onChange={(e) => {
                            const val = e.target.value;
                            setExperiences((prev) => prev.map((item) => (item.id === exp.id ? { ...item, companyOrOrg: val } : item)));
                          }}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] text-slate-500 block mb-1">Periode (2024 - Present)</label>
                        <input
                          type="text"
                          value={exp.period}
                          onChange={(e) => {
                            const val = e.target.value;
                            setExperiences((prev) => prev.map((item) => (item.id === exp.id ? { ...item, period: val } : item)));
                          }}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-500 block mb-1">Deskripsi Pekerjaan</label>
                      <textarea
                        rows={2}
                        value={exp.description}
                        onChange={(e) => {
                          const val = e.target.value;
                          setExperiences((prev) => prev.map((item) => (item.id === exp.id ? { ...item, description: val } : item)));
                        }}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 resize-none font-medium"
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Section 2: Riwayat Pendidikan */}
          <div className="space-y-4 pt-6 border-t border-slate-200">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-blue-600" />
              <span>2. Riwayat Pendidikan Formal & Akademik ({experiences.filter((e) => e.type === 'education').length})</span>
            </h3>

            <div className="grid grid-cols-1 gap-4">
              {experiences
                .filter((e) => e.type === 'education')
                .map((exp, idx) => (
                  <div key={exp.id} className="clay-card p-6 bg-white space-y-4 border border-slate-200/90 shadow-sm">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-blue-600 uppercase tracking-wider font-mono">
                          Pendidikan #{idx + 1}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold uppercase">
                          Education
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          setExperiences((prev) => prev.filter((e) => e.id !== exp.id));
                          addToast('Pendidikan Dihapus', 'Data pendidikan telah dihapus.', 'warning');
                        }}
                        className="p-1.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100"
                        title="Hapus Pendidikan"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs font-bold">
                      <div>
                        <label className="text-[11px] text-slate-500 block mb-1">Kategori / Tipe</label>
                        <select
                          value={exp.type}
                          onChange={(e) => {
                            const val = e.target.value as any;
                            setExperiences((prev) => prev.map((item) => (item.id === exp.id ? { ...item, type: val } : item)));
                          }}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 bg-white"
                        >
                          <option value="education">Pendidikan (Education)</option>
                          <option value="work">Pengalaman Kerja (Work)</option>
                          <option value="leadership">Organisasi / Leadership</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[11px] text-slate-500 block mb-1">Gelar / Jurusan</label>
                        <input
                          type="text"
                          value={exp.role}
                          onChange={(e) => {
                            const val = e.target.value;
                            setExperiences((prev) => prev.map((item) => (item.id === exp.id ? { ...item, role: val } : item)));
                          }}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] text-slate-500 block mb-1">Universitas / Sekolah</label>
                        <input
                          type="text"
                          value={exp.companyOrOrg}
                          onChange={(e) => {
                            const val = e.target.value;
                            setExperiences((prev) => prev.map((item) => (item.id === exp.id ? { ...item, companyOrOrg: val } : item)));
                          }}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] text-slate-500 block mb-1">Tahun / Periode</label>
                        <input
                          type="text"
                          value={exp.period}
                          onChange={(e) => {
                            const val = e.target.value;
                            setExperiences((prev) => prev.map((item) => (item.id === exp.id ? { ...item, period: val } : item)));
                          }}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-500 block mb-1">Keterangan Studi / Highlight</label>
                      <textarea
                        rows={2}
                        value={exp.description}
                        onChange={(e) => {
                          const val = e.target.value;
                          setExperiences((prev) => prev.map((item) => (item.id === exp.id ? { ...item, description: val } : item)));
                        }}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 resize-none font-medium"
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Skills & Tools CMS */}
      {activeTab === 'skills' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
                <Wrench className="w-5 h-5 text-amber-600" />
                <span>Pengaturan Keahlian & Tools (Skills CMS)</span>
              </h2>
              <p className="text-xs text-slate-500">Kelola daftar software design, framework, dan persentase keahlian Anda.</p>
            </div>
            <button
              onClick={() => {
                const newSkill: SkillItem = {
                  id: 'sk-' + Date.now(),
                  name: 'Figma Prototyping',
                  category: 'UI/UX & Prototyping',
                  proficiency: 95,
                  icon: 'Figma',
                  color: 'indigo'
                };
                setSkills((prev) => [newSkill, ...prev]);
                addToast('Keahlian Ditambahkan', 'Keahlian baru berhasil ditambahkan.', 'success');
              }}

              className="clay-button-primary bg-amber-600 hover:bg-amber-500 text-white text-xs px-4 py-2.5 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Keahlian Baru</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {skills.map((sk) => (
              <div key={sk.id} className="clay-card p-5 bg-white space-y-3 border border-slate-200/80">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-600 font-mono">ID: {sk.id}</span>
                  <button
                    onClick={() => {
                      setSkills((prev) => prev.filter((s) => s.id !== sk.id));
                      addToast('Keahlian Dihapus', 'Keahlian telah dihapus.', 'warning');
                    }}
                    className="p-1 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs font-bold">
                  <div>
                    <label className="text-[11px] text-slate-500 block mb-1">Nama Skill / Tool</label>
                    <input
                      type="text"
                      value={sk.name}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSkills((prev) => prev.map((s) => (s.id === sk.id ? { ...s, name: val } : s)));
                      }}
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 block mb-1">Kategori</label>
                    <input
                      type="text"
                      value={sk.category}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSkills((prev) => prev.map((s) => (s.id === sk.id ? { ...s, category: val } : s)));
                      }}
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center text-[11px] font-bold text-slate-600 mb-1">
                    <span>Kemampuan (%)</span>
                    <span className="text-amber-600 font-mono">{sk.proficiency}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={sk.proficiency}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setSkills((prev) => prev.map((s) => (s.id === sk.id ? { ...s, proficiency: val } : s)));
                    }}
                    className="w-full accent-amber-600"
                  />
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Profile & Global Web Settings */}
      {activeTab === 'settings' && (
        <div className="clay-card p-6 sm:p-8 bg-white space-y-6 border border-slate-200/90 shadow-md">
          <div className="flex items-center justify-between border-b border-slate-100 pb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center">
                <Settings className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900">Pengaturan Profile & Global Web</h2>
                <p className="text-xs text-slate-500">Kelola Hero text, bio, kontak, link WhatsApp, foto profil, link CV (Indo & Eng), dan media sosial.</p>
              </div>
            </div>
            <button
              onClick={async () => {
                const saved = await saveSiteSettingsToSupabase(siteSettings);
                if (saved) {
                  addToast('Pengaturan Disimpan', 'Data global web & profile telah disimpan ke database Supabase.', 'success');
                } else {
                  addToast('Pengaturan Disimpan (Lokal)', 'Data global web & profile diperbarui di browser local state.', 'info');
                }
              }}
              className="clay-button-primary bg-slate-900 hover:bg-slate-800 text-white text-xs px-5 py-2.5 flex items-center gap-2 font-bold cursor-pointer"
            >
              <Save className="w-4 h-4 text-emerald-400" />
              <span>Simpan Pengaturan</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-bold">
            <div className="space-y-4">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b pb-2">
                <User className="w-4 h-4 text-blue-600" />
                <span>Header, Hero & Foto Profile</span>
              </h3>

              <div>
                <label className="text-[11px] text-slate-600 block mb-1">Judul Utama / Hero Title</label>
                <input
                  type="text"
                  value={siteSettings.heroTitle}
                  onChange={(e) => setSiteSettings((prev) => ({ ...prev, heroTitle: e.target.value }))}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-slate-900"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-600 block mb-1">Sub-Judul / Profesi Tagline</label>
                <input
                  type="text"
                  value={siteSettings.heroSubtitle}
                  onChange={(e) => setSiteSettings((prev) => ({ ...prev, heroSubtitle: e.target.value }))}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-slate-900"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-600 block mb-1">Biografi Ringkas (About Bio)</label>
                <textarea
                  rows={3}
                  value={siteSettings.aboutBio}
                  onChange={(e) => setSiteSettings((prev) => ({ ...prev, aboutBio: e.target.value }))}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-slate-900 font-medium resize-none"
                />
              </div>

              {/* Profile Photo / Avatar with Upload Button */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <label className="text-[11px] text-slate-700 font-black block">Foto Profile / Avatar</label>
                <div className="flex items-center gap-4">
                  <img
                    src={siteSettings.avatarUrl}
                    alt="Profile Preview"
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-500 shadow-md shrink-0"
                  />
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      value={siteSettings.avatarUrl}
                      onChange={(e) => setSiteSettings((prev) => ({ ...prev, avatarUrl: e.target.value }))}
                      placeholder="Image URL / Data URL"
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-slate-900 font-mono text-[10px]"
                    />
                    <label className="clay-button-primary bg-blue-600 hover:bg-blue-500 text-white text-[11px] px-3.5 py-1.5 rounded-xl cursor-pointer inline-flex items-center gap-1.5">
                      <UploadCloud className="w-3.5 h-3.5" />
                      <span>Upload Foto Profile Baru</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, (url) => setSiteSettings((prev) => ({ ...prev, avatarUrl: url })))}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b pb-2">
                <Phone className="w-4 h-4 text-emerald-600" />
                <span>Kontak & File CV</span>
              </h3>

              <div>
                <label className="text-[11px] text-slate-600 block mb-1">Email Resmi</label>
                <input
                  type="email"
                  value={siteSettings.contactEmail}
                  onChange={(e) => setSiteSettings((prev) => ({ ...prev, contactEmail: e.target.value }))}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-slate-900"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-600 block mb-1">Nomor WhatsApp (tanpa +)</label>
                <input
                  type="text"
                  value={siteSettings.whatsappNumber}
                  onChange={(e) => setSiteSettings((prev) => ({ ...prev, whatsappNumber: e.target.value }))}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-slate-900 font-mono"
                />
              </div>

              {/* CV Bahasa Indonesia */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] text-slate-800 font-bold flex items-center gap-1.5">
                    <span>ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¡Ãƒâ€šÃ‚Â®ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¡Ãƒâ€šÃ‚Â© CV Bahasa Indonesia</span>
                  </label>
                  <label className="clay-button text-[10px] px-2.5 py-1 cursor-pointer flex items-center gap-1 font-bold">
                    <UploadCloud className="w-3 h-3 text-blue-600" />
                    <span>Upload File CV Indo</span>
                    <input
                      type="file"
                      accept="application/pdf,image/*"
                      onChange={(e) => handleFileUpload(e, (url) => setSiteSettings((prev) => ({ ...prev, cvDownloadUrlIndo: url })))}
                      className="hidden"
                    />
                  </label>
                </div>
                <input
                  type="text"
                  value={siteSettings.cvDownloadUrlIndo || ''}
                  onChange={(e) => setSiteSettings((prev) => ({ ...prev, cvDownloadUrlIndo: e.target.value }))}
                  placeholder="URL / Data URL file CV Indonesia"
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-slate-900 font-mono text-[10px]"
                />
              </div>

              {/* CV Bahasa Inggris */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] text-slate-800 font-bold flex items-center gap-1.5">
                    <span>ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¡Ãƒâ€šÃ‚Â§ CV Bahasa Inggris (English)</span>
                  </label>
                  <label className="clay-button text-[10px] px-2.5 py-1 cursor-pointer flex items-center gap-1 font-bold">
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>Upload File CV Eng</span>
                    <input
                      type="file"
                      accept="application/pdf,image/*"
                      onChange={(e) => handleFileUpload(e, (url) => setSiteSettings((prev) => ({ ...prev, cvDownloadUrlEng: url })))}
                      className="hidden"
                    />
                  </label>
                </div>
                <input
                  type="text"
                  value={siteSettings.cvDownloadUrlEng || ''}
                  onChange={(e) => setSiteSettings((prev) => ({ ...prev, cvDownloadUrlEng: e.target.value }))}
                  placeholder="URL / Data URL file CV English"
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-slate-900 font-mono text-[10px]"
                />
              </div>

              {/* Social Media Links Section */}
              <div className="pt-2 space-y-3 border-t border-slate-100">
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Media Sosial Links</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-slate-500 block mb-1">Instagram URL</label>
                    <input
                      type="text"
                      value={siteSettings.socialLinks.instagram || ''}
                      onChange={(e) => setSiteSettings((prev) => ({ ...prev, socialLinks: { ...prev.socialLinks, instagram: e.target.value } }))}
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-slate-900 font-mono text-[10px]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-500 block mb-1">Dribbble URL</label>
                    <input
                      type="text"
                      value={siteSettings.socialLinks.dribbble || ''}
                      onChange={(e) => setSiteSettings((prev) => ({ ...prev, socialLinks: { ...prev.socialLinks, dribbble: e.target.value } }))}
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-slate-900 font-mono text-[10px]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-500 block mb-1">Behance URL</label>
                    <input
                      type="text"
                      value={siteSettings.socialLinks.behance || ''}
                      onChange={(e) => setSiteSettings((prev) => ({ ...prev, socialLinks: { ...prev.socialLinks, behance: e.target.value } }))}
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-slate-900 font-mono text-[10px]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-500 block mb-1">LinkedIn URL</label>
                    <input
                      type="text"
                      value={siteSettings.socialLinks.linkedin || ''}
                      onChange={(e) => setSiteSettings((prev) => ({ ...prev, socialLinks: { ...prev.socialLinks, linkedin: e.target.value } }))}
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-slate-900 font-mono text-[10px]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-[10px] text-slate-500 block mb-1">GitHub URL</label>
                    <input
                      type="text"
                      value={siteSettings.socialLinks.github || ''}
                      onChange={(e) => setSiteSettings((prev) => ({ ...prev, socialLinks: { ...prev.socialLinks, github: e.target.value } }))}
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-slate-900 font-mono text-[10px]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Project Confirmation Modal */}
      {deletingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="clay-card w-full max-w-md bg-white p-6 rounded-3xl shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center gap-3.5 text-rose-600">
              <div className="p-3 bg-rose-100 rounded-2xl shrink-0">
                <Trash2 className="w-6 h-6 text-rose-600" />
              </div>
              <div>
                <h3 className="font-black text-slate-900 text-base">Konfirmasi Hapus Proyek</h3>
                <p className="text-xs text-slate-500 font-medium">Tindakan ini tidak dapat dibatalkan</p>
              </div>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-200 font-medium">
              Apakah Anda yakin ingin menghapus proyek <strong className="text-slate-900 font-extrabold">{deletingProject.title}</strong>? Proyek akan dihapus dari daftar portfolio publik dan database Supabase.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeletingProject(null)}
                className="clay-button-secondary px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-xl"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmDeleteProject}
                className="clay-button-primary bg-rose-600 hover:bg-rose-700 text-white px-5 py-2.5 text-xs font-bold rounded-xl flex items-center gap-2 shadow-md shadow-rose-200 cursor-pointer active:scale-95"
              >
                <Trash2 className="w-4 h-4" />
                <span>Ya, Hapus Proyek</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Package Confirmation Modal */}
      {deletingPackage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="clay-card w-full max-w-md bg-white p-6 rounded-3xl shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center gap-3.5 text-rose-600">
              <div className="p-3 bg-rose-100 rounded-2xl shrink-0">
                <Trash2 className="w-6 h-6 text-rose-600" />
              </div>
              <div>
                <h3 className="font-black text-slate-900 text-base">Konfirmasi Hapus Paket</h3>
                <p className="text-xs text-slate-500 font-medium">Tindakan ini tidak dapat dibatalkan</p>
              </div>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-200 font-medium">
              Apakah Anda yakin ingin menghapus paket layanan <strong className="text-slate-900 font-extrabold">{deletingPackage.name}</strong>?
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeletingPackage(null)}
                className="clay-button-secondary px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-xl"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmDeletePackage}
                className="clay-button-primary bg-rose-600 hover:bg-rose-700 text-white px-5 py-2.5 text-xs font-bold rounded-xl flex items-center gap-2 shadow-md shadow-rose-200 cursor-pointer active:scale-95"
              >
                <Trash2 className="w-4 h-4" />
                <span>Ya, Hapus Paket</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
