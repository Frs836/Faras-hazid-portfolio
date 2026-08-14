import React from 'react';
import { useApp } from '../../../context/AppContext';
import { SkillItem } from '../../../types';
import { Plus, Trash2, Wrench } from 'lucide-react';

export const SkillsPanel: React.FC = () => {
  const { skills, setSkills, addToast } = useApp();

  const addSkill = () => {
    const newSkill: SkillItem = {
      id: 'sk-' + Date.now(),
      name: 'Figma Prototyping',
      category: 'UI/UX & Prototyping',
      proficiency: 95,
      icon: 'Figma',
      color: 'indigo',
    };
    setSkills((prev) => [newSkill, ...prev]);
    addToast('Keahlian Ditambahkan', 'Keahlian baru berhasil ditambahkan.', 'success');
  };

  const setField = (id: string, patch: Partial<SkillItem>) =>
    setSkills((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
            <Wrench className="w-5 h-5 text-amber-600" />
            <span>Pengaturan Keahlian & Tools (Skills CMS)</span>
          </h2>
          <p className="text-xs text-slate-500">Kelola daftar software design, framework, dan persentase keahlian Anda.</p>
        </div>
        <button onClick={addSkill} className="clay-button-primary bg-amber-600 hover:bg-amber-500 text-white text-xs px-4 py-2.5 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          <span>Tambah Keahlian Baru</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {skills.map((sk) => (
          <div key={sk.id} className="clay-card p-5 bg-white space-y-3 border border-slate-200/80">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-600 font-mono">ID: {sk.id}</span>
              <button onClick={() => {
                setSkills((prev) => prev.filter((s) => s.id !== sk.id));
                addToast('Keahlian Dihapus', 'Keahlian telah dihapus.', 'warning');
              }} className="p-1 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-bold">
              <div>
                <label className="text-[11px] text-slate-500 block mb-1">Nama Skill / Tool</label>
                <input type="text" value={sk.name} onChange={(e) => setField(sk.id, { name: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-slate-800" />
              </div>
              <div>
                <label className="text-[11px] text-slate-500 block mb-1">Kategori</label>
                <input type="text" value={sk.category} onChange={(e) => setField(sk.id, { category: e.target.value as any })}
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-slate-800" />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center text-[11px] font-bold text-slate-600 mb-1">
                <span>Kemampuan (%)</span>
                <span className="text-amber-600 font-mono">{sk.proficiency}%</span>
              </div>
              <input type="range" min="10" max="100" value={sk.proficiency}
                onChange={(e) => setField(sk.id, { proficiency: Number(e.target.value) })}
                className="w-full accent-amber-600" />
            </div>
          </div>
        ))}
      </div>

      {skills.length === 0 && (
        <div className="border hairline bg-paper2 p-8 text-center mono-label text-ink-muted">
          Tidak ada skill. Klik "Tambah Keahlian Baru" untuk membuat.
        </div>
      )}
    </div>
  );
};