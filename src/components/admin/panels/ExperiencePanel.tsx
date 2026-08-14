import React from 'react';
import { useApp } from '../../../context/AppContext';
import { ExperienceItem } from '../../../types';
import { Plus, Trash2, Briefcase, GraduationCap } from 'lucide-react';

export const ExperiencePanel: React.FC = () => {
  const { experiences, setExperiences, addToast } = useApp();

  const addWork = () => {
    const newWork: ExperienceItem = {
      id: 'exp-' + Date.now(),
      type: 'work',
      role: 'Senior UI/UX Designer',
      companyOrOrg: 'Perusahaan / Client Baru',
      period: '2024 - Present',
      location: 'Jakarta / Remote',
      description: 'Memimpin perancangan sistem UI/UX web & mobile.',
      highlights: ['Desain Design System', 'Peningkatan Retensi User'],
    };
    setExperiences((prev) => [newWork, ...prev]);
    addToast('Karir Ditambahkan', 'Item pengalaman kerja baru berhasil dibuat.', 'success');
  };

  const addEdu = () => {
    const newEdu: ExperienceItem = {
      id: 'edu-' + Date.now(),
      type: 'education',
      role: 'S1 Desain Komunikasi Visual',
      companyOrOrg: 'Universitas / Institut Pendidikan',
      period: '2020 - 2024',
      location: 'Indonesia',
      description: 'Fokus pada Branding, UI/UX, Typography, dan Layouting.',
      highlights: ['Lulus Cumlaude', 'Juara Desain Aplikasi'],
    };
    setExperiences((prev) => [...prev, newEdu]);
    addToast('Pendidikan Ditambahkan', 'Item riwayat pendidikan baru berhasil dibuat.', 'success');
  };

  const setField = (id: string, patch: Partial<ExperienceItem>) =>
    setExperiences((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
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
          <button onClick={addWork} className="clay-button-primary bg-purple-600 hover:bg-purple-500 text-white text-xs px-4 py-2.5 flex items-center gap-2 font-bold">
            <Plus className="w-4 h-4" />
            <span>+ Tambah Pekerjaan Baru</span>
          </button>
          <button onClick={addEdu} className="clay-button-secondary text-purple-700 bg-purple-50 hover:bg-purple-100 text-xs px-4 py-2.5 flex items-center gap-2 font-bold">
            <Plus className="w-4 h-4" />
            <span>+ Tambah Pendidikan Baru</span>
          </button>
        </div>
      </div>

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
                    <span className="text-xs font-black text-purple-600 uppercase tracking-wider font-mono">Karir #{idx + 1}</span>
                    <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-bold uppercase">{exp.type}</span>
                  </div>
                  <button onClick={() => {
                    setExperiences((prev) => prev.filter((e) => e.id !== exp.id));
                    addToast('Karir Dihapus', 'Data karir telah dihapus.', 'warning');
                  }} className="p-1.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100" title="Hapus Karir">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs font-bold">
                  <div>
                    <label className="text-[11px] text-slate-500 block mb-1">Kategori / Tipe</label>
                    <select value={exp.type} onChange={(e) => setField(exp.id, { type: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 bg-white">
                      <option value="work">Pengalaman Kerja (Work)</option>
                      <option value="leadership">Organisasi / Leadership</option>
                      <option value="education">Pendidikan (Education)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 block mb-1">Posisi / Job Title</label>
                    <input type="text" value={exp.role} onChange={(e) => setField(exp.id, { role: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800" />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 block mb-1">Perusahaan / Client</label>
                    <input type="text" value={exp.companyOrOrg} onChange={(e) => setField(exp.id, { companyOrOrg: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800" />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 block mb-1">Periode (2024 - Present)</label>
                    <input type="text" value={exp.period} onChange={(e) => setField(exp.id, { period: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800" />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-500 block mb-1">Deskripsi Pekerjaan</label>
                  <textarea rows={2} value={exp.description} onChange={(e) => setField(exp.id, { description: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 resize-none font-medium" />
                </div>
              </div>
            ))}
        </div>
      </div>

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
                    <span className="text-xs font-black text-blue-600 uppercase tracking-wider font-mono">Pendidikan #{idx + 1}</span>
                    <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold uppercase">Education</span>
                  </div>
                  <button onClick={() => {
                    setExperiences((prev) => prev.filter((e) => e.id !== exp.id));
                    addToast('Pendidikan Dihapus', 'Data pendidikan telah dihapus.', 'warning');
                  }} className="p-1.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100" title="Hapus Pendidikan">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs font-bold">
                  <div>
                    <label className="text-[11px] text-slate-500 block mb-1">Kategori / Tipe</label>
                    <select value={exp.type} onChange={(e) => setField(exp.id, { type: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 bg-white">
                      <option value="education">Pendidikan (Education)</option>
                      <option value="work">Pengalaman Kerja (Work)</option>
                      <option value="leadership">Organisasi / Leadership</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 block mb-1">Gelar / Jurusan</label>
                    <input type="text" value={exp.role} onChange={(e) => setField(exp.id, { role: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800" />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 block mb-1">Universitas / Sekolah</label>
                    <input type="text" value={exp.companyOrOrg} onChange={(e) => setField(exp.id, { companyOrOrg: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800" />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 block mb-1">Tahun / Periode</label>
                    <input type="text" value={exp.period} onChange={(e) => setField(exp.id, { period: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800" />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-500 block mb-1">Keterangan Studi / Highlight</label>
                  <textarea rows={2} value={exp.description} onChange={(e) => setField(exp.id, { description: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 resize-none font-medium" />
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};