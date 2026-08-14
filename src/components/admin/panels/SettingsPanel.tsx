import React from 'react';
import { useApp } from '../../../context/AppContext';
import { saveSiteSettingsToSupabase } from '../../../services/apiService';
import { Save, Settings, User, Phone, UploadCloud } from 'lucide-react';

export const SettingsPanel: React.FC = () => {
  const { siteSettings, setSiteSettings, addToast } = useApp();

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

  const saveAll = async () => {
    const saved = await saveSiteSettingsToSupabase(siteSettings);
    if (saved) {
      addToast('Pengaturan Disimpan', 'Data global web & profile telah disimpan ke database Supabase.', 'success');
    } else {
      addToast('Pengaturan Disimpan (Lokal)', 'Data global web & profile diperbarui di browser local state.', 'info');
    }
  };

  const setSocial = (key: keyof typeof siteSettings.socialLinks, value: string) =>
    setSiteSettings((prev) => ({ ...prev, socialLinks: { ...prev.socialLinks, [key]: value } }));

  return (
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
        <button onClick={saveAll} className="clay-button-primary bg-slate-900 hover:bg-slate-800 text-white text-xs px-5 py-2.5 flex items-center gap-2 font-bold cursor-pointer">
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
            <input type="text" value={siteSettings.heroTitle}
              onChange={(e) => setSiteSettings((prev) => ({ ...prev, heroTitle: e.target.value }))}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-slate-900" />
          </div>

          <div>
            <label className="text-[11px] text-slate-600 block mb-1">Sub-Judul / Profesi Tagline</label>
            <input type="text" value={siteSettings.heroSubtitle}
              onChange={(e) => setSiteSettings((prev) => ({ ...prev, heroSubtitle: e.target.value }))}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-slate-900" />
          </div>

          <div>
            <label className="text-[11px] text-slate-600 block mb-1">Biografi Ringkas (About Bio)</label>
            <textarea rows={3} value={siteSettings.aboutBio}
              onChange={(e) => setSiteSettings((prev) => ({ ...prev, aboutBio: e.target.value }))}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-slate-900 font-medium resize-none" />
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <label className="text-[11px] text-slate-700 font-black block">Foto Profile / Avatar</label>
            <div className="flex items-center gap-4">
              <img src={siteSettings.avatarUrl} alt="Profile Preview"
                className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-500 shadow-md shrink-0" />
              <div className="flex-1 space-y-2">
                <input type="text" value={siteSettings.avatarUrl}
                  onChange={(e) => setSiteSettings((prev) => ({ ...prev, avatarUrl: e.target.value }))}
                  placeholder="Image URL / Data URL"
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-slate-900 font-mono text-[10px]" />
                <label className="clay-button-primary bg-blue-600 hover:bg-blue-500 text-white text-[11px] px-3.5 py-1.5 rounded-xl cursor-pointer inline-flex items-center gap-1.5">
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>Upload Foto Profile Baru</span>
                  <input type="file" accept="image/*"
                    onChange={(e) => handleFileUpload(e, (url) => setSiteSettings((prev) => ({ ...prev, avatarUrl: url })))}
                    className="hidden" />
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
            <input type="email" value={siteSettings.contactEmail}
              onChange={(e) => setSiteSettings((prev) => ({ ...prev, contactEmail: e.target.value }))}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-slate-900" />
          </div>

          <div>
            <label className="text-[11px] text-slate-600 block mb-1">Nomor WhatsApp (tanpa +)</label>
            <input type="text" value={siteSettings.whatsappNumber}
              onChange={(e) => setSiteSettings((prev) => ({ ...prev, whatsappNumber: e.target.value }))}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-slate-900 font-mono" />
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] text-slate-800 font-bold flex items-center gap-1.5">
                <span>CV Bahasa Indonesia</span>
              </label>
              <label className="clay-button text-[10px] px-2.5 py-1 cursor-pointer flex items-center gap-1 font-bold">
                <UploadCloud className="w-3 h-3 text-blue-600" />
                <span>Upload File CV Indo</span>
                <input type="file" accept="application/pdf,image/*"
                  onChange={(e) => handleFileUpload(e, (url) => setSiteSettings((prev) => ({ ...prev, cvDownloadUrlIndo: url })))}
                  className="hidden" />
              </label>
            </div>
            <input type="text" value={siteSettings.cvDownloadUrlIndo || ''}
              onChange={(e) => setSiteSettings((prev) => ({ ...prev, cvDownloadUrlIndo: e.target.value }))}
              placeholder="URL / Data URL file CV Indonesia"
              className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-slate-900 font-mono text-[10px]" />
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] text-slate-800 font-bold flex items-center gap-1.5">
                <span>CV Bahasa Inggris (English)</span>
              </label>
              <label className="clay-button text-[10px] px-2.5 py-1 cursor-pointer flex items-center gap-1 font-bold">
                <UploadCloud className="w-3.5 h-3.5" />
                <span>Upload File CV Eng</span>
                <input type="file" accept="application/pdf,image/*"
                  onChange={(e) => handleFileUpload(e, (url) => setSiteSettings((prev) => ({ ...prev, cvDownloadUrlEng: url })))}
                  className="hidden" />
              </label>
            </div>
            <input type="text" value={siteSettings.cvDownloadUrlEng || ''}
              onChange={(e) => setSiteSettings((prev) => ({ ...prev, cvDownloadUrlEng: e.target.value }))}
              placeholder="URL / Data URL file CV English"
              className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-slate-900 font-mono text-[10px]" />
          </div>

          <div className="pt-2 space-y-3 border-t border-slate-100">
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Media Sosial Links</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-slate-500 block mb-1">Instagram URL</label>
                <input type="text" value={siteSettings.socialLinks.instagram || ''}
                  onChange={(e) => setSocial('instagram', e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-slate-900 font-mono text-[10px]" />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 block mb-1">Dribbble URL</label>
                <input type="text" value={siteSettings.socialLinks.dribbble || ''}
                  onChange={(e) => setSocial('dribbble', e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-slate-900 font-mono text-[10px]" />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 block mb-1">Behance URL</label>
                <input type="text" value={siteSettings.socialLinks.behance || ''}
                  onChange={(e) => setSocial('behance', e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-slate-900 font-mono text-[10px]" />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 block mb-1">LinkedIn URL</label>
                <input type="text" value={siteSettings.socialLinks.linkedin || ''}
                  onChange={(e) => setSocial('linkedin', e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-slate-900 font-mono text-[10px]" />
              </div>
              <div className="sm:col-span-2">
                <label className="text-[10px] text-slate-500 block mb-1">GitHub URL</label>
                <input type="text" value={siteSettings.socialLinks.github || ''}
                  onChange={(e) => setSocial('github', e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-slate-900 font-mono text-[10px]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};