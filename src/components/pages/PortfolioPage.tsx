import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Category } from '../../types';
import { ScrollReveal } from '../ui/ScrollReveal';
import { Search, X, ArrowUpRight, CheckCircle2 } from 'lucide-react';

const CATEGORIES: Category[] = ['All', 'UI/UX Design', 'Graphic & Brand', 'Social Media & Print', 'Mobile App'];

export const PortfolioPage: React.FC = () => {
  const { t, projects, selectedProject, setSelectedProject, getContent } = useApp();
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Close case study with Escape
  useEffect(() => {
    if (!selectedProject) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedProject(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedProject, setSelectedProject]);

  const filteredProjects = projects.filter((p) => {
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      p.title.toLowerCase().includes(q) ||
      p.summary.toLowerCase().includes(q) ||
      p.tools.some((tool) => tool.toLowerCase().includes(q));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-16 py-6 pb-12">
      {/* Header */}
      <section className="pt-8 space-y-5">
        <ScrollReveal duration={0.6}>
          <span className="section-eyebrow block mb-3">Portfolio</span>
          <h1 className="display-font font-bold tracking-tight text-ink leading-[1.02] text-[clamp(2.25rem,6vw,4.5rem)]">
            {getContent('portfolio', 'hero.title', t.portfolio.title)}
          </h1>
          <p className="text-base text-ink-muted max-w-2xl leading-relaxed">{getContent('portfolio', 'hero.subtitle', t.portfolio.subtitle)}</p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-t hairline pt-6">
            {/* Category filter — horizontal scroll on mobile, wrap on desktop */}
            <div className="flex items-center gap-2 -mx-4 px-4 lg:mx-0 lg:px-0 lg:flex-wrap overflow-x-auto scrollbar-none">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  aria-pressed={activeCategory === cat}
                  className="filter-pill shrink-0"
                >
                  {cat === 'All' ? getContent('portfolio', 'filters.all', t.portfolio.allCategories) : cat}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full lg:w-[280px] shrink-0">
              <Search className="w-4 h-4 text-ink-faint absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-[1]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.portfolio.searchPlaceholder}
                className="field-input search-input"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink p-1 -mr-1"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project, index) => (
            <ScrollReveal key={project.id} delay={index * 0.08}>
              <button
                onClick={() => setSelectedProject(project)}
                className="lift-card group w-full text-left bg-paper2 border hairline p-4 hover:bg-surface flex flex-col h-full"
              >
                <div className="relative aspect-[4/3] overflow-hidden mb-5 bg-paper2">
                  <img
                    src={project.thumbnail}
                    alt={project.title}
                    loading="lazy"
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-[1.04] transition-all duration-500"
                  />
                  <span className="absolute top-3 right-3 mono-label text-ink bg-paper px-2 py-1 rounded-sm">
                    {project.category}
                  </span>
                </div>

                <div className="flex-1 flex flex-col justify-between gap-3">
                  <div className="space-y-1.5">
                    <h3 className="display-font text-lg font-semibold text-ink group-hover:text-accent2 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-sm text-ink-muted line-clamp-2">{project.summary}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1.5">
                      {project.tools.slice(0, 2).map((tool) => (
                        <span key={tool} className="mono-label text-ink-faint border hairline px-2 py-1">
                          {tool}
                        </span>
                      ))}
                      {project.tools.length > 2 && (
                        <span className="mono-label text-ink-faint self-center">+{project.tools.length - 2}</span>
                      )}
                    </div>
                    <span className="mono-label text-ink-faint inline-flex items-center gap-1">
                      {t.portfolio.viewCaseStudy}
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </button>
            </ScrollReveal>
          ))
        ) : (
          <div className="col-span-full border hairline bg-paper p-12 text-center space-y-4">
            <p className="text-sm text-ink-muted">No projects found matching your criteria.</p>
            <button
              onClick={() => {
                setActiveCategory('All');
                setSearchQuery('');
              }}
              className="btn-ghost text-xs"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>

      {/* ============ CASE STUDY MODAL ============ */}
      {selectedProject && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-ink/60 backdrop-blur-sm flex items-start justify-center p-4 sm:p-8"
          onClick={() => setSelectedProject(null)}
          role="dialog"
          aria-modal="true"
          aria-label={selectedProject.title}
        >
          <div
            className="relative w-full max-w-3xl bg-paper border hairline my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-paper border-b hairline px-6 py-4 flex items-center justify-between gap-4">
              <span className="section-eyebrow">{selectedProject.category}</span>
              <button
                onClick={() => setSelectedProject(null)}
                className="p-2 rounded-sm text-ink-muted hover:text-ink hover:bg-paper2 transition"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 sm:p-10 space-y-10">
              {/* Banner */}
              <div className="aspect-[16/9] overflow-hidden bg-paper2 border hairline">
                <img
                  src={selectedProject.thumbnail}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Title + meta */}
              <div className="space-y-4">
                <h2 className="display-font text-2xl sm:text-4xl font-bold tracking-tight text-ink leading-tight">
                  {selectedProject.title}
                </h2>
                <div className="grid grid-cols-3 gap-px bg-line border hairline">
                  {[
                    { label: t.portfolio.client, value: selectedProject.client },
                    { label: t.portfolio.year, value: selectedProject.year },
                    { label: t.portfolio.role, value: selectedProject.role },
                  ].map((m) => (
                    <div key={m.label} className="bg-paper p-4">
                      <span className="section-eyebrow block mb-1">{m.label}</span>
                      <span className="display-font font-semibold text-ink text-sm sm:text-base">{m.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Problem */}
              <section className="space-y-3">
                <span className="section-eyebrow block">01 — Problem</span>
                <p className="text-base text-ink leading-relaxed">{selectedProject.problemStatement}</p>
              </section>

              {/* Workflow */}
              <section className="space-y-4">
                <span className="section-eyebrow block">02 — Process</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-line border hairline">
                  {selectedProject.workflowSteps.map((step, idx) => (
                    <div key={idx} className="bg-paper p-5 space-y-2">
                      <span className="mono-label text-ink-faint">{step.title}</span>
                      <p className="text-sm text-ink-muted leading-relaxed">{step.description}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Solution */}
              <section className="space-y-3">
                <span className="section-eyebrow block">03 — Solution</span>
                <p className="text-base text-ink leading-relaxed">{selectedProject.solution}</p>
              </section>

              {/* Results */}
              {selectedProject.results.length > 0 && (
                <section className="space-y-4">
                  <span className="section-eyebrow block">04 — Results</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-line border hairline">
                    {selectedProject.results.map((res, idx) => (
                      <div key={idx} className="bg-paper p-4 flex items-center gap-3 text-sm text-ink">
                        <CheckCircle2 className="w-4 h-4 text-strong shrink-0" />
                        {res}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Tools */}
              <section className="space-y-3">
                <span className="section-eyebrow block">Tools</span>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.tools.map((tool) => (
                    <span key={tool} className="mono-label text-ink border hairline px-3 py-1.5">
                      {tool}
                    </span>
                  ))}
                </div>
              </section>

              {/* Footer actions */}
              <div className="pt-4 border-t hairline flex flex-wrap items-center justify-between gap-4">
                {selectedProject.liveUrl ? (
                  <a
                    href={selectedProject.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-primary text-xs"
                  >
                    {t.portfolio.viewCaseStudy}
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                ) : (
                  <span className="mono-label text-ink-faint">Client asset — demo on request</span>
                )}
                <button onClick={() => setSelectedProject(null)} className="btn-ghost text-xs">
                  {t.portfolio.close}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
