import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { PricingPackage } from '../../../types';
import { savePackageToSupabase, deletePackageFromSupabase } from '../../../services/apiService';
import { Plus, Edit, Trash2, Save, Layers, X } from 'lucide-react';

export const PackagesPanel: React.FC = () => {
  const { packages, setPackages, addToast } = useApp();
  const [editingPackage, setEditingPackage] = useState<PricingPackage | null>(null);
  const [deletingPackage, setDeletingPackage] = useState<PricingPackage | null>(null);

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
    await savePackageToSupabase(pkgToSave);
  };

  const confirmDeletePackage = async () => {
    if (!deletingPackage) return;
    const id = deletingPackage.id;
    const name = deletingPackage.name;
    setDeletingPackage(null);
    setPackages((prev) => prev.filter((p) => p.id !== id));
    addToast('Paket Dihapus', `Paket "${name}" telah dihapus.`, 'warning');
    const success = await deletePackageFromSupabase(id);
    if (success) {
      addToast('Supabase Cleaned', `Paket "${name}" dihapus dari database Supabase.`, 'success');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-slate-800">Paket Layanan & Harga CMS</h2>
          <p className="text-xs text-slate-500">Kelola daftar paket harga, deliverables, durasi pengerjaan, dan harga dalam USD & IDR.</p>
        </div>
        <button onClick={handleCreateNewPackage} className="clay-button-primary bg-blue-600 hover:bg-blue-500 text-white text-xs px-4 py-2.5 flex items-center gap-2 font-bold">
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
              <div>Delivery: <span className="font-bold text-slate-700">{pkg.deliveryTime || '3-5 Hari'}</span></div>
              <div>Targeted For: <span className="font-bold text-slate-700">{pkg.recommendedFor || 'All Clients'}</span></div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
              <button onClick={() => setEditingPackage(pkg)} className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 font-bold text-xs flex items-center gap-1.5">
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

      {packages.length === 0 && (
        <div className="border hairline bg-paper2 p-8 text-center mono-label text-ink-muted">
          Tidak ada paket. Klik "Tambah Paket Baru" untuk membuat.
        </div>
      )}

      {editingPackage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="clay-card w-full max-w-2xl max-h-[90vh] bg-white flex flex-col shadow-2xl overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="font-black text-lg text-slate-900 flex items-center gap-2">
                <Layers className="w-5 h-5 text-blue-600" />
                <span>Edit / Tambah Paket Layanan ({editingPackage.name})</span>
              </h2>
              <button onClick={() => setEditingPackage(null)} className="p-1 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePackage} className="overflow-y-auto flex-1 space-y-4 text-xs pr-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nama Paket</label>
                  <input type="text" required value={editingPackage.name}
                    onChange={(e) => setEditingPackage({ ...editingPackage, name: e.target.value })}
                    className="clay-input w-full text-xs" />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Badge Label (cth: Best Value, Standard)</label>
                  <input type="text" value={editingPackage.badge || ''}
                    onChange={(e) => setEditingPackage({ ...editingPackage, badge: e.target.value })}
                    className="clay-input w-full text-xs" />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Harga USD ($)</label>
                  <input type="number" value={editingPackage.priceUSD}
                    onChange={(e) => setEditingPackage({ ...editingPackage, priceUSD: Number(e.target.value) })}
                    className="clay-input w-full text-xs" />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Harga IDR (Rupiah Teks)</label>
                  <input type="text" value={editingPackage.priceIDR}
                    onChange={(e) => setEditingPackage({ ...editingPackage, priceIDR: e.target.value })}
                    className="clay-input w-full text-xs" />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Estimasi Waktu Pengerjaan (Delivery Time)</label>
                  <input type="text" value={editingPackage.deliveryTime || ''}
                    onChange={(e) => setEditingPackage({ ...editingPackage, deliveryTime: e.target.value })}
                    placeholder="3-5 Hari Kerja" className="clay-input w-full text-xs" />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Rekomendasi Untuk (Target Client)</label>
                  <input type="text" value={editingPackage.recommendedFor || ''}
                    onChange={(e) => setEditingPackage({ ...editingPackage, recommendedFor: e.target.value })}
                    placeholder="UMKM & Business Growth" className="clay-input w-full text-xs" />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Deskripsi Singkat Paket</label>
                <textarea rows={2} value={editingPackage.description}
                  onChange={(e) => setEditingPackage({ ...editingPackage, description: e.target.value })}
                  className="clay-input w-full text-xs resize-none" />
              </div>

              <div className="space-y-2 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800">Cakupan Fitur & Deliverables ({editingPackage.features.length})</label>
                  <button
                    type="button"
                    onClick={() => setEditingPackage({ ...editingPackage, features: [...editingPackage.features, 'Fitur Baru / Deliverable Output'] })}
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
                <input type="checkbox" id="popChk" checked={editingPackage.popular || false}
                  onChange={(e) => setEditingPackage({ ...editingPackage, popular: e.target.checked })} />
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
              <button type="button" onClick={() => setDeletingPackage(null)} className="clay-button-secondary px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-xl">
                Batal
              </button>
              <button type="button" onClick={confirmDeletePackage} className="clay-button-primary bg-rose-600 hover:bg-rose-700 text-white px-5 py-2.5 text-xs font-bold rounded-xl flex items-center gap-2 shadow-md shadow-rose-200 cursor-pointer active:scale-95">
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