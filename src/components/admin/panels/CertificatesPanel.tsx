import React from 'react';
import { useApp } from '../../../context/AppContext';
import { CertificateItem } from '../../../types';
import { uploadAsset } from '../../../services/apiService';
import { Plus, Trash2, Award, UploadCloud } from 'lucide-react';

export const CertificatesPanel: React.FC = () => {
  const { certificates, setCertificates, addToast } = useApp();

  const add = () => {
    const item: CertificateItem = {
      id: 'cert-' + Date.now(),
      title: 'Sertifikat Baru',
      issuer: 'Penerbit / Lembaga',
      year: '',
      image: '',
      description: 'Deskripsi singkat sertifikat.',
    };
    setCertificates((prev) => [...prev, item]);
    addToast('Sertifikat Ditambahkan', 'Sertifikat baru berhasil ditambahkan.', 'success');
  };

  const setField = (id: string, patch: Partial<CertificateItem>) =>
    setCertificates((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));

  const handleFileUpload = async (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadAsset(file);
    if (url) {
      setField(id, { image: url });
      addToast('Gambar Diunggah!', 'Sertifikat diunggah ke cloud.', 'success');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) {
        setField(id, { image: String(ev.target.result) });
        addToast('Gambar Dimuat', 'Sertifikat dimuat (lokal).', 'info');
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-600" />
            <span>Sertifikat Pembelajaran (About)</span>
          </h2>
          <p className="text-xs text-slate-500">Kelola gambar sertifikat + deskripsi. Tersinkron otomatis ke database & halaman About.</p>
        </div>
        <button onClick={add} className="clay-button-primary bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-4 py-2.5 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          <span>Tambah Sertifikat</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {certificates.map((cert) => (
          <div key={cert.id} className="clay-card p-5 bg-white space-y-4 border border-slate-200/80">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-600 font-mono">ID: {cert.id}</span>
              <button
                onClick={() => {
                  setCertificates((prev) => prev.filter((c) => c.id !== cert.id));
                  addToast('Sertifikat Dihapus', 'Sertifikat telah dihapus.', 'warning');
                }}
                className="p-1 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-bold">
              <div className="md:col-span-2">
                <label className="text-[11px] text-slate-500 block mb-1">Judul Sertifikat</label>
                <input type="text" value={cert.title} onChange={(e) => setField(cert.id, { title: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-slate-800" />
              </div>
              <div>
                <label className="text-[11px] text-slate-500 block mb-1">Penerbit / Lembaga</label>
                <input type="text" value={cert.issuer} onChange={(e) => setField(cert.id, { issuer: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-slate-800" />
              </div>
              <div>
                <label className="text-[11px] text-slate-500 block mb-1">Tahun</label>
                <input type="text" value={cert.year} onChange={(e) => setField(cert.id, { year: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-slate-800" />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-500 block mb-1">Deskripsi</label>
              <textarea rows={2} value={cert.description} onChange={(e) => setField(cert.id, { description: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 resize-none font-medium" />
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center gap-3">
                {cert.image ? (
                  <img src={cert.image} alt="Preview" className="w-20 h-16 rounded-lg object-cover border shrink-0" />
                ) : (
                  <div className="w-20 h-16 rounded-lg bg-slate-200 flex items-center justify-center text-slate-400 text-[10px] font-bold shrink-0">No Image</div>
                )}
                <div className="flex-1 space-y-2">
                  <input type="text" value={cert.image} onChange={(e) => setField(cert.id, { image: e.target.value })}
                    placeholder="URL / Data URL gambar sertifikat"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-slate-900 font-mono text-[10px]" />
                  <label className="clay-button text-[11px] px-3 py-1.5 cursor-pointer inline-flex items-center gap-1.5 font-bold">
                    <UploadCloud className="w-3.5 h-3.5 text-emerald-600" />
                    Upload Gambar
                    <input type="file" accept="image/*" onChange={(e) => handleFileUpload(cert.id, e)} className="hidden" />
                  </label>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {certificates.length === 0 && (
        <div className="border hairline bg-paper2 p-8 text-center mono-label text-ink-muted">
          Tidak ada sertifikat. Klik "Tambah Sertifikat".
        </div>
      )}
    </div>
  );
};