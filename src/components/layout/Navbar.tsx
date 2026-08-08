import React, { useState, useEffect, useRef } from 'react';
import { useApp, PageView } from '../../context/AppContext';
import { Language } from '../../types';
import { Sun, Moon, Menu, X, ShieldCheck } from 'lucide-react';
import logoImg from '../../assets/images/focal_fh_logo.png';

const LANG_ORDER: Language[] = ['en', 'id', 'ja', 'ar'];

export const Navbar: React.FC = () => {
  const { language, setLanguage, theme, toggleTheme, t, currentPage, setCurrentPage, isAdminUnlocked } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    return () => {
      if (clickTimer.current) clearTimeout(clickTimer.current);
    };
  }, []);

  const pages: { id: PageView; label: string }[] = [
    { id: 'home', label: t.nav.home },
    { id: 'about', label: t.nav.about },
    { id: 'portfolio', label: t.nav.portfolio },
    { id: 'services', label: t.nav.services },
    { id: 'contact', label: t.nav.contact },
  ];

  const handleLogoClick = () => {
    const next = clickCount + 1;
    setClickCount(next);
    if (clickTimer.current) clearTimeout(clickTimer.current);
    clickTimer.current = setTimeout(() => setClickCount(0), 500);
    if (next >= 3) {
      setClickCount(0);
      handlePageSelect('secret-admin');
    }
  };

  const handlePageSelect = (pageId: PageView) => {
    setCurrentPage(pageId);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isRTL = language === 'ar';

  return (
    <header className="sticky top-3 sm:top-4 z-50 px-4">
      <div className="mx-auto max-w-6xl">
        {/* Floating glass capsule — sticky, follows scroll */}
        <div className={`glass-nav rounded-full ${scrolled ? 'glass-nav-scrolled' : ''}`}>
          <nav className="flex items-center justify-between gap-3 px-3 sm:px-4 py-2.5">
            {/* Logo */}
            <button
              onClick={handleLogoClick}
              className="shrink-0 group"
              aria-label="Faras Hazid — home"
            >
              <img src={logoImg} alt="Focal Hyperspace Creative logo" className="h-9 sm:h-10 w-auto" />
            </button>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-5">
              {pages.map((page) => (
                <button
                  key={page.id}
                  onClick={() => handlePageSelect(page.id)}
                  className={`mono-label link-underline transition-colors ${
                    currentPage === page.id ? 'text-ink active' : 'text-ink-muted hover:text-ink'
                  }`}
                >
                  {page.label}
                </button>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {isAdminUnlocked && (
                <button
                  onClick={() => handlePageSelect('secret-admin')}
                  className="hidden sm:flex items-center gap-1.5 mono-label px-2.5 py-1.5 rounded-lg bg-accent text-accent-ink hover:brightness-105 transition"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  CMS
                </button>
              )}

              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-ink-muted hover:text-ink hover:bg-paper2 transition-all active:scale-90"
                aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
              >
                {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </button>

              <div className={`hidden sm:flex items-center gap-0.5 ${isRTL ? 'flex-row-reverse' : ''}`}>
                {LANG_ORDER.map((code) => (
                  <button
                    key={code}
                    onClick={() => setLanguage(code)}
                    className={`mono-label px-1.5 py-1.5 rounded-md transition-colors ${
                      language === code ? 'bg-ink text-paper' : 'text-ink-muted hover:text-ink'
                    }`}
                    aria-pressed={language === code}
                  >
                    {code.toUpperCase()}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setIsMobileMenuOpen((v) => !v)}
                className="md:hidden p-2 rounded-md text-ink-muted hover:text-ink hover:bg-paper2 transition-all active:scale-90"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </nav>
        </div>

        {/* Mobile sheet (attaches below glass pill) */}
        {isMobileMenuOpen && (
          <div className="glass-nav mt-2 rounded-[1.5rem] overflow-hidden">
            <div className="px-4 py-5 space-y-5">
              <div className="flex flex-col">
                {pages.map((page) => (
                  <button
                    key={page.id}
                    onClick={() => handlePageSelect(page.id)}
                    className={`text-left py-3 text-sm font-medium border-b hairline transition-colors ${
                      currentPage === page.id ? 'text-ink' : 'text-ink-muted'
                    }`}
                  >
                    {page.label}
                  </button>
                ))}
              </div>

              <div>
                <span className="section-eyebrow block mb-3">Language</span>
                <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  {LANG_ORDER.map((code) => (
                    <button
                      key={code}
                      onClick={() => setLanguage(code)}
                      className={`flex-1 mono-label py-2.5 rounded-md transition-colors ${
                        language === code ? 'bg-ink text-paper' : 'text-ink-muted border hairline hover:text-ink'
                      }`}
                    >
                      {code.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {isAdminUnlocked && (
                <button
                  onClick={() => handlePageSelect('secret-admin')}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-md bg-accent text-accent-ink mono-label"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Open CMS Dashboard
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};