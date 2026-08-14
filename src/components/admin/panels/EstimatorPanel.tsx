import React from 'react';
import { useApp } from '../../../context/AppContext';
import { Plus, Trash2, X, Calculator, Layers, Sparkles, Clock, CheckCircle2 } from 'lucide-react';

export const EstimatorPanel: React.FC = () => {
  const {
    estimatorServices,
    setEstimatorServices,
    estimatorScopes,
    setEstimatorScopes,
    estimatorTimelines,
    setEstimatorTimelines,
    addToast,
  } = useApp();

  return (
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
                      onChange={(e) => setEstimatorServices((prev) => prev.map((item) => (item.id === srv.id ? { ...item, name: e.target.value } : item)))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">Harga Dasar USD ($)</label>
                      <input
                        type="number"
                        value={srv.baseUsd}
                        onChange={(e) => setEstimatorServices((prev) => prev.map((item) => (item.id === srv.id ? { ...item, baseUsd: Number(e.target.value) } : item)))}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">Harga Dasar IDR (Rp)</label>
                      <input
                        type="number"
                        value={srv.baseIdrNum}
                        onChange={(e) => setEstimatorServices((prev) => prev.map((item) => (item.id === srv.id ? { ...item, baseIdrNum: Number(e.target.value) } : item)))}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-200/80">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-extrabold text-slate-700 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Isi Paket / Deliverables ({srv.deliverables.length})</span>
                      </label>
                      <button
                        onClick={() => setEstimatorServices((prev) => prev.map((item) => item.id === srv.id ? { ...item, deliverables: [...item.deliverables, 'Deliverable Baru / Item Hasil'] } : item))}
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
                            onChange={(e) => setEstimatorServices((prev) => prev.map((item) => {
                              if (item.id !== srv.id) return item;
                              const updatedDels = [...item.deliverables];
                              updatedDels[dIdx] = e.target.value;
                              return { ...item, deliverables: updatedDels };
                            }))}
                            className="flex-1 px-2.5 py-1.5 rounded-lg border border-slate-200 text-[11px] font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                          />
                          <button
                            onClick={() => setEstimatorServices((prev) => prev.map((item) => {
                              if (item.id !== srv.id) return item;
                              return { ...item, deliverables: item.deliverables.filter((_, idx) => idx !== dIdx) };
                            }))}
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

        <div className="space-y-4 pt-6 border-t border-slate-200">
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>2. Multiplier Skala Skop (Tingkat Kompleksitas)</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {estimatorScopes.map((scope) => (
              <div key={scope.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <span className="text-[10px] font-bold font-mono text-indigo-600 uppercase">ID: {scope.id}</span>
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Label Skop</label>
                  <input type="text" value={scope.label}
                    onChange={(e) => setEstimatorScopes((prev) => prev.map((s) => (s.id === scope.id ? { ...s, label: e.target.value } : s)))}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold" />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Multiplier Perkalian Harga (cth: 1.4)</label>
                  <input type="number" step="0.05" value={scope.mult}
                    onChange={(e) => setEstimatorScopes((prev) => prev.map((s) => (s.id === scope.id ? { ...s, mult: Number(e.target.value) } : s)))}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-extrabold text-indigo-600 font-mono" />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Deskripsi Ringkas</label>
                  <input type="text" value={scope.desc}
                    onChange={(e) => setEstimatorScopes((prev) => prev.map((s) => (s.id === scope.id ? { ...s, desc: e.target.value } : s)))}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-[11px] font-medium text-slate-600" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4 pt-6 border-t border-slate-200">
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-600" />
            <span>3. Multiplier Urgensi Waktu Delivery</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {estimatorTimelines.map((tm) => (
              <div key={tm.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <span className="text-[10px] font-bold font-mono text-indigo-600 uppercase">ID: {tm.id}</span>
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Label Durasi Waktu</label>
                  <input type="text" value={tm.label}
                    onChange={(e) => setEstimatorTimelines((prev) => prev.map((t) => (t.id === tm.id ? { ...t, label: e.target.value } : t)))}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold" />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Multiplier Perkalian Urgensi (cth: 1.25)</label>
                  <input type="number" step="0.05" value={tm.mult}
                    onChange={(e) => setEstimatorTimelines((prev) => prev.map((t) => (t.id === tm.id ? { ...t, mult: Number(e.target.value) } : t)))}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-extrabold text-indigo-600 font-mono" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};