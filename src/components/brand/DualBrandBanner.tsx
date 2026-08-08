import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const DualBrandBanner: React.FC = () => {
  const { setCurrentPage, openCvModal, t } = useApp();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-line border hairline">
      {/* Corporate / Recruiters */}
      <button
        onClick={() => openCvModal('en')}
        className="group bg-paper p-8 text-left transition-colors hover:bg-paper2"
      >
        <div className="flex items-center justify-between mb-8">
          <span className="section-eyebrow">01 — Recruiters</span>
          <ArrowUpRight className="w-5 h-5 text-ink-faint group-hover:text-ink transition-colors" />
        </div>
        <span className="mono-label text-ink-faint block mb-2">{t.dualBrand.corporateTag}</span>
        <h3 className="display-font text-xl font-semibold text-ink group-hover:text-accent2 transition-colors">
          {t.dualBrand.corporateBtn}
        </h3>
        <p className="mt-4 text-sm text-ink-muted leading-relaxed max-w-sm">{t.dualBrand.description}</p>
      </button>

      {/* Freelance / Studio */}
      <button
        onClick={() => {
          setCurrentPage('services');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className="group bg-paper p-8 text-left transition-colors hover:bg-paper2"
      >
        <div className="flex items-center justify-between mb-8">
          <span className="section-eyebrow">02 — Clients</span>
          <ArrowUpRight className="w-5 h-5 text-ink-faint group-hover:text-ink transition-colors" />
        </div>
        <span className="mono-label text-ink-faint block mb-2">{t.dualBrand.freelanceTag}</span>
        <h3 className="display-font text-xl font-semibold text-ink group-hover:text-accent2 transition-colors">
          {t.dualBrand.freelanceBtn}
        </h3>
        <p className="mt-4 text-sm text-ink-muted leading-relaxed max-w-sm">{t.dualBrand.description}</p>
      </button>
    </div>
  );
};