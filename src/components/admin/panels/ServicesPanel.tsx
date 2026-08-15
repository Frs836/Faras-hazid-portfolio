import React from 'react';
import { useApp } from '../../../context/AppContext';
import { ServiceOffering } from '../../../types';
import { Plus, Trash2, X, Layers } from 'lucide-react';

export const ServicesPanel: React.FC = () => {
  const { services, setServices, addToast } = useApp();

  const addService = () => {
    const newSvc: ServiceOffering = {
      id: 'srv-' + Date.now(),
      icon: 'Sparkles',
      title: 'Layanan Baru',
      description: 'Deskripsi singkat layanan.',
      deliverables: ['Deliverable 1'],
    };
    setServices((prev) => [...prev, newSvc]);
    addToast('Layanan Ditambahkan', 'Layanan baru berhasil ditambahkan.', 'success');
  };

  const setField = (id: string, patch: Partial<ServiceOffering>) =>
    setServices((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
            <Layers className="w-5 h-5 text-violet-600" />
            <span>What I Do — Layanan (CMS)</span>
          </h2>
          <p className="text-xs text-slate-500">Kelola grid layanan di halaman Services. Tersinkron otomatis ke database & situs.</p>
        </div>
        <button onClick={addService} className="clay-button-primary bg-violet-600 hover:bg-violet-500 text-white text-xs px-4 py-2.5 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          <span>Tambah Layanan</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {services.map((srv) => (
          <div key={srv.id} className="clay-card p-5 bg-white space-y-4 border border-slate-200/80">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-violet-600 font-mono">ID: {srv.id}</span>
              <button
                onClick={() => {
                  setServices((prev) => prev.filter((s) => s.id !== srv.id));
                  addToast('Layanan Dihapus', 'Layanan telah dihapus.', 'warning');
                }}
                className="p-1 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-bold">
              <div>
                <label className="text-[11px] text-slate-500 block mb-1">Judul Layanan</label>
                <input type="text" value={srv.title} onChange={(e) => setField(srv.id, { title: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-slate-800" />
              </div>
              <div>
                <label className="text-[11px] text-slate-500 block mb-1">Icon (nama lucide)</label>
                <input type="text" value={srv.icon} onChange={(e) => setField(srv.id, { icon: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-slate-800 font-mono" />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-500 block mb-1">Deskripsi</label>
              <textarea rows={2} value={srv.description} onChange={(e) => setField(srv.id, { description: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 resize-none font-medium" />
            </div>

            <div className="space-y-2 p-3 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-extrabold text-slate-700">Deliverables ({srv.deliverables.length})</label>
                <button
                  onClick={() => setField(srv.id, { deliverables: [...srv.deliverables, 'Deliverable baru'] })}
                  className="text-[10px] font-extrabold text-violet-600 hover:text-violet-800 flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Tambah
                </button>
              </div>
              {srv.deliverables.map((del, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={del}
                    onChange={(e) => {
                      const next = [...srv.deliverables];
                      next[idx] = e.target.value;
                      setField(srv.id, { deliverables: next });
                    }}
                    className="flex-1 px-2.5 py-1.5 rounded-lg border border-slate-200 text-[11px] font-medium bg-white"
                  />
                  <button
                    onClick={() => setField(srv.id, { deliverables: srv.deliverables.filter((_, i) => i !== idx) })}
                    className="p-1 text-slate-400 hover:text-rose-500 rounded"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {services.length === 0 && (
        <div className="border hairline bg-paper2 p-8 text-center mono-label text-ink-muted">
          Tidak ada layanan. Klik "Tambah Layanan".
        </div>
      )}
    </div>
  );
};