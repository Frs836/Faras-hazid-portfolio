import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, Printer, Download, Sparkles, Briefcase, GraduationCap, Award, CheckCircle } from 'lucide-react';

export const CvDownloadModal: React.FC = () => {
  const { isCvModalOpen, setIsCvModalOpen, cvLanguage, addToast } = useApp();

  if (!isCvModalOpen) return null;

  const isEn = cvLanguage === 'en';

  const handlePrint = () => {
    window.print();
    addToast('CV Downloaded', `Triggered printing for CV (${isEn ? 'English' : 'Indonesia'})`, 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in print:bg-white print:p-0">
      <div className="clay-card w-full max-w-3xl max-h-[90vh] bg-white flex flex-col shadow-2xl overflow-hidden border border-slate-200 print:shadow-none print:border-none print:max-h-none print:w-full">
        {/* Modal Header (Hidden on print) */}
        <div className="p-4 sm:p-6 border-b border-slate-200 bg-slate-50 flex items-center justify-between gap-4 print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
              CV
            </div>
            <div>
              <h3 className="font-extrabold text-slate-800 text-base">
                {isEn ? 'Curriculum Vitae (English Version)' : 'Curriculum Vitae (Versi Bahasa Indonesia)'}
              </h3>
              <p className="text-xs text-slate-500">
                Official Graphic & UI/UX Designer Profile
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="clay-button text-xs px-3.5 py-2 flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>{isEn ? 'Print / Save PDF' : 'Cetak / Simpan PDF'}</span>
            </button>
            <button
              onClick={() => setIsCvModalOpen(false)}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* CV Document Sheet Body */}
        <div className="p-8 overflow-y-auto flex-1 space-y-8 text-slate-800 font-sans print:p-0">
          {/* Header Bio */}
          <div className="border-b border-slate-200 pb-6 flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Faras Hazid
              </h1>
              <p className="text-sm font-semibold text-blue-600 mt-1">
                {isEn ? 'Graphic Designer & UI Designer • Founder Focal Hyperspace Creative' : 'Desainer Grafis & UI Designer • Founder Focal Hyperspace Creative'}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                focalhyperspacecreative@gmail.com • +62 851-4354-1287 • Depok, Indonesia / Remote
              </p>
            </div>
            <div className="text-xs text-slate-500 text-right">
              <p>Portfolio: clayfolio.design</p>
              <p>Behance / Dribbble: @clayfolio</p>
            </div>
          </div>

          {/* Professional Summary */}
          <div>
            <h2 className="text-xs font-bold text-blue-600 tracking-wider uppercase mb-2">
              {isEn ? 'Professional Summary' : 'Ringkasan Profesional'}
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              {isEn
                ? 'Passionate Graphic & UI/UX Designer with over 5 years of experience crafting interactive Claymorphism interfaces, brand identities, and mobile application design systems. Proven track record of boosting user engagement by 40%+ across global fintech and AI SaaS platforms.'
                : 'Desainer Grafis & UI/UX berpengalaman lebih dari 5 tahun dalam menciptakan antarmuka Claymorphism interaktif, identitas brand, dan sistem desain aplikasi mobile. Terbukti meningkatkan keterikatan pengguna hingga 40%+ pada platform fintech dan SaaS global.'}
            </p>
          </div>

          {/* Work Experience */}
          <div>
            <h2 className="text-xs font-bold text-blue-600 tracking-wider uppercase mb-3 flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-blue-600" />
              <span>{isEn ? 'Work Experience' : 'Pengalaman Kerja'}</span>
            </h2>
            <div className="space-y-4">
              <div className="border-l-2 border-blue-500 pl-3">
                <div className="flex justify-between items-start text-xs font-bold text-slate-800">
                  <span>Media Lead & UI Designer • Nurul Musthofa Center</span>
                  <span className="text-slate-500">2024 - Present</span>
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  {isEn
                    ? 'Lead media design and web UI for congregational digital portal. Managed multi-channel visual identity, event publications, and mobile UI assets.'
                    : 'Memimpin desain media dan UI web untuk portal digital jemaah. Mengelola identitas visual multi-saluran, publikasi acara, dan aset UI mobile.'}
                </p>
              </div>

              <div className="border-l-2 border-blue-300 pl-3">
                <div className="flex justify-between items-start text-xs font-bold text-slate-800">
                  <span>Senior Graphic Designer • Creative Mindsets Agency</span>
                  <span className="text-slate-500">2022 - 2024</span>
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  {isEn
                    ? 'Executed 35+ brand identity and marketing campaigns for tech and e-commerce brands.'
                    : 'Mengeksekusi 35+ kampanye identitas brand dan pemasaran untuk brand teknologi dan e-commerce.'}
                </p>
              </div>
            </div>
          </div>

          {/* Education */}
          <div>
            <h2 className="text-xs font-bold text-blue-600 tracking-wider uppercase mb-3 flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-blue-600" />
              <span>{isEn ? 'Education' : 'Pendidikan'}</span>
            </h2>
            <div className="border-l-2 border-slate-300 pl-3">
              <div className="flex justify-between items-start text-xs font-bold text-slate-800">
                <span>Institut Teknologi Bandung (ITB) • S.Ds Visual Communication Design</span>
                <span className="text-slate-500">2018 - 2022</span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                GPA 3.85 / 4.00 (Cum Laude). {isEn ? 'Best Final Project Award' : 'Penghargaan Karya Akhir Terbaik'}.
              </p>
            </div>
          </div>

          {/* Skills & Software */}
          <div>
            <h2 className="text-xs font-bold text-blue-600 tracking-wider uppercase mb-3 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-blue-600" />
              <span>{isEn ? 'Software & Technical Skills' : 'Software & Keahlian Teknis'}</span>
            </h2>
            <div className="flex flex-wrap gap-2 text-xs">
              {['Figma', 'Adobe Illustrator', 'Adobe Photoshop', 'Adobe Xd', 'Brand Identity', 'Layouting', 'Pre-Press CMYK', 'Mobile UI Design'].map((s) => (
                <span key={s} className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-medium">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
