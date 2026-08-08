import React from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowUp } from 'lucide-react';

const MARQUEE_WORDS = [
  'UI/UX Design',
  'Brand Identity',
  'Graphic Design',
  'Web Development',
  'Print Layout',
  'Social Media',
  'Motion',
];

export const Footer: React.FC = () => {
  const { setCurrentPage, t, siteSettings, getContent, getContentList } = useApp();

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const marqueeWords = getContentList('footer', 'brand.marquee').length
    ? getContentList('footer', 'brand.marquee')
    : MARQUEE_WORDS;

  const socials = [
    { label: 'Instagram', url: siteSettings?.socialLinks?.instagram || 'https://instagram.com' },
    { label: 'Dribbble', url: siteSettings?.socialLinks?.dribbble || 'https://dribbble.com' },
    { label: 'Behance', url: siteSettings?.socialLinks?.behance || 'https://behance.net' },
    { label: 'LinkedIn', url: siteSettings?.socialLinks?.linkedin || 'https://linkedin.com' },
    { label: 'GitHub', url: siteSettings?.socialLinks?.github || 'https://github.com' },
  ];

  const nav = [
    { id: 'home' as const, label: t.nav.home },
    { id: 'about' as const, label: t.nav.about },
    { id: 'portfolio' as const, label: t.nav.portfolio },
    { id: 'services' as const, label: t.nav.services },
    { id: 'contact' as const, label: t.nav.contact },
  ];

  return (
    <footer className="relative z-10 border-t hairline bg-paper">
      {/* Marquee strip */}
      <div className="marquee-pause overflow-hidden border-b hairline py-4" aria-hidden="true">
        <div className="animate-marquee flex items-center gap-8 whitespace-nowrap w-max">
          {[...Array(2)].map((_, rep) => (
            <div key={rep} className="flex items-center gap-8">
              {marqueeWords.map((w) => (
                <span key={`${rep}-${w}`} className="mono-label text-ink-faint">
                  {w}
                  <span className="text-strong ml-4">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
        <div className="flex flex-col lg:flex-row justify-between gap-12">
          {/* CTA / wordmark */}
          <div className="max-w-xl">
            <span className="section-eyebrow block mb-4">
              {siteSettings?.contactEmail || 'hello@farashazid.com'}
            </span>
            <h2 className="display-font text-4xl sm:text-6xl font-bold leading-[1.02] tracking-tight text-ink">
              {getContent('footer', 'cta.title', 'Have an idea worth building?')}
            </h2>
            <button
              onClick={() => {
                setCurrentPage('contact');
                scrollToTop();
              }}
              className="mt-8 btn-primary"
            >
              Let's talk
              <span aria-hidden="true">→</span>
            </button>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-10">
            <div>
              <span className="section-eyebrow block mb-4">Menu</span>
              <ul className="space-y-2.5">
                {nav.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => {
                        setCurrentPage(item.id);
                        scrollToTop();
                      }}
                      className="text-sm text-ink-muted hover:text-ink transition-colors"
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <span className="section-eyebrow block mb-4">Connect</span>
              <ul className="space-y-2.5">
                {socials.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-ink-muted hover:text-ink transition-colors"
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <span className="section-eyebrow block mb-4">Status</span>
              <div className="inline-flex items-center gap-2 text-sm text-ink">
                <span className="w-2 h-2 rounded-full bg-accent" aria-hidden="true" />
                {getContent('footer', 'brand.status', 'Open for freelance & remote contracts')}
              </div>
              <p className="mt-3 text-sm text-ink-muted leading-relaxed max-w-xs">
                {getContent('footer', 'brand.description', '')}
              </p>
              <p className="mt-2 text-xs text-ink-faint leading-relaxed max-w-xs">
                {siteSettings?.whatsappNumber ? `WhatsApp: +${siteSettings.whatsappNumber}` : ''}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-6 border-t hairline flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="mono-label text-ink-faint">{getContent('footer', 'brand.copyright', '© 2026 FARAS HAZID — Focal Hyperspace Creative')}</p>
          <button
            onClick={scrollToTop}
            className="p-2 rounded-md border hairline text-ink-muted hover:text-ink hover:bg-paper2 transition"
            aria-label="Back to top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
};
