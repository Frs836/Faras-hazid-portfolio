import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Project } from '../../../types';
import { saveProjectToSupabase, deleteProjectFromSupabase, uploadAsset } from '../../../services/apiService';
import { FolderPlus, Trash2, Edit, Plus, Save, UploadCloud, X } from 'lucide-react';

interface Props {
  onNavigate: (group: 'overview' | 'content' | 'portfolio' | 'estimator' | 'leads' | 'analytics' | 'settings', sub?: string) => void;
}

export const ProjectsPanel: React.FC<Props> = ({ onNavigate }) => {
  const { projects, setProjects, addToast } = useApp();
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deletingProject, setDeletingProject] = useState<Project | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const cloudUrl = await uploadAsset(file);
    if (cloudUrl) {
      callback(cloudUrl);
      addToast('File Diunggah!', `${file.name} diunggah ke cloud (Supabase Storage).`, 'success');
      return;
    }
    // Fallback: embed locally when the storage endpoint is unavailable
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        callback(event.target.result as string);
        addToast('File Diunggah!', `${file.name} dimuat (lokal).`, 'info');
      }
    };
    reader.readAsDataURL(file);
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
    const saved = await saveProjectToSupabase(projectToSave);
    if (saved) {
      addToast('Supabase Sync Success', `Project "${projectToSave.title}" saved directly to Supabase DB!`, 'success');
    } else {
      addToast('Supabase Notice', 'Project saved locally. (Check .env keys for live Supabase sync)', 'info');
    }
  };

  const confirmDeleteProject = async () => {
    if (!deletingProject) return;
    const id = deletingProject.id;
    const title = deletingProject.title;
    setDeletingProject(null);
    setProjects((prev) => prev.filter((p) => p.id !== id));
    addToast('Proyek Dihapus', `Proyek "${title}" telah dihapus dari portfolio.`, 'warning');
    const success = await deleteProjectFromSupabase(id);
    if (success) {
      addToast('Supabase Cleaned', `Proyek "${title}" dihapus dari database Supabase.`, 'success');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-slate-800">Public Portfolio Projects</h2>
          <p className="text-xs text-slate-500">{projects.length} proyek aktif · klik Edit untuk detail case study.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => onNavigate('analytics')} className="clay-button-secondary text-xs px-3 py-2">
            Statistik
          </button>
          <button onClick={handleCreateNewProject} className="clay-button text-xs px-4 py-2 flex items-center gap-1.5">
            <Plus className="w-4 h-4" />
            <span>Add New Project</span>
          </button>
        </div>
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
                {proj.featured ? '★ Featured' : 'Standard'}
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

      {projects.length === 0 && (
        <div className="border hairline bg-paper2 p-8 text-center mono-label text-ink-muted">
          Tidak ada proyek. Klik "Add New Project" untuk membuat.
        </div>
      )}

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
    </div>
  );
};