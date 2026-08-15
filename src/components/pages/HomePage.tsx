import React, { lazy, Suspense } from 'react';
import { useApp } from '../../context/AppContext';
import { ScrollReveal } from '../ui/ScrollReveal';
import { SkillProgressBar, AnimatedSkillBadge } from '../ui/SkillProgressBar';
import { DualBrandBanner } from '../brand/DualBrandBanner';
import { WorkflowProcess } from '../workflow/WorkflowProcess';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

const Hero3D = lazy(() => import('../3d/Hero3D').then((m) => ({ default: m.Hero3D })));

const DEFAULT_MARQUEE = ['UI/UX Design', 'Brand Identity', 'Graphic Design', 'Web Development', 'Print Layout', 'Social Media'];

export const HomePage: React.FC = () => {
  const { t, setCurrentPage, projects, setSelectedProject, skills, theme, siteSettings, getContent, getContentList } = useApp();

  const featuredProjects = projects.filter((p) => p.featured).slice(0, 3);
  const marqueeWords = getContentList('home', 'marquee.words').length
    ? getContentList('home', 'marquee.words')
    : DEFAULT_MARQUEE;

  const heroName = siteSettings?.heroTitle || 'FARAS HAZID';
  const heroRole = siteSettings?.heroSubtitle || getContent('home', 'hero.role', t.about.bioRole);

  const heroTitleLines = heroName.split('\n').filter(Boolean);

  const stats = [
    { label: getContent('home', 'stats.label_project', t.home.quickStats.projects), val: getContent('home', 'stats.val_project', '45+') },
    { label: getContent('home', 'stats.label_exp', t.home.quickStats.experience), val: getContent('home', 'stats.val_exp', '4+') },
    { label: getContent('home', 'stats.label_sat', t.home.quickStats.satisfaction), val: getContent('home', 'stats.val_sat', '100%') },
    { label: getContent('home', 'stats.label_awards', t.home.quickStats.awards), val: getContent('home', 'stats.val_awards', '12+') },
  ];

  const goTo = (page: Parameters<typeof setCurrentPage>[0]) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-24 pb-12">
      {/* ================= HERO ================= */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center pt-8 sm:pt-14">
        <ScrollReveal duration={0.7}>
          <div className="space-y-6">
            <span className="mono-label text-ink inline-flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-accent animate-float-y" aria-hidden="true" />
              {getContent('home', 'hero.badge', t.home.availableBadge)}
            </span>

            <p className="text-sm sm:text-base text-ink-muted font-medium">{getContent('home', 'hero.greeting', t.about.bioGreeting)}</p>

            <h1 className="display-font font-bold tracking-tight text-ink leading-[0.92] text-[clamp(3rem,13vw,6.5rem)]">
              {heroTitleLines.map((line, i) => (
                <span key={i} className="block">
                  {line}
                  {i === 0 && <span className="text-strong">.</span>}
                </span>
              ))}
            </h1>

            <p className="mono-label text-ink-muted">{heroRole}</p>
            <p className="text-base text-ink-muted leading-relaxed max-w-lg">{getContent('home', 'hero.bio', t.home.heroBio)}</p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button onClick={() => goTo('portfolio')} className="btn-accent">
                {getContent('home', 'hero.cta_work', t.home.ctaWork)}
                <ArrowRight className="w-4 h-4" />
              </button>
              <button onClick={() => goTo('contact')} className="btn-ghost">
                {getContent('home', 'hero.cta_contact', t.home.ctaContact)}
              </button>
            </div>

            <div className="pt-4 flex items-center gap-6 mono-label text-ink-faint">
              <span>{getContent('home', 'hero.loc_a', 'Based in Indonesia')}</span>
              <span className="text-line" aria-hidden="true">|</span>
              <span>{getContent('home', 'hero.loc_b', 'Working worldwide')}</span>
            </div>
          </div>
        </ScrollReveal>

        {/* 3D Hero */}
        <ScrollReveal duration={0.9} delay={0.15}>
          <div className="relative aspect-square max-w-[540px] mx-auto w-full">
            <div
              className="absolute inset-0 rounded-full bg-accent2/10 blur-3xl"
              aria-hidden="true"
            />
            <Suspense
              fallback={
                <div className="w-full h-full flex items-center justify-center">
                  <span className="mono-label text-ink-faint">rendering…</span>
                </div>
              }
            >
              <Hero3D theme={theme} />
            </Suspense>
          </div>
        </ScrollReveal>
      </section>

      {/* ================= MARQUEE ================= */}
      <div className="marquee-pause overflow-hidden border-y hairline py-4" aria-hidden="true">
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

      {/* ================= STATS ================= */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-line border hairline">
        {stats.map((stat, idx) => (
          <ScrollReveal key={stat.label} delay={idx * 0.06} className="bg-paper p-6 sm:p-8">
            <span className="display-font text-4xl sm:text-5xl font-bold text-ink tabular-nums block">
              {stat.val}
            </span>
            <span className="mono-label text-ink-muted block mt-2">{stat.label}</span>
          </ScrollReveal>
        ))}
      </section>

      {/* ================= DUAL BRAND ================= */}
      <ScrollReveal>
        <DualBrandBanner />
      </ScrollReveal>

      {/* ================= FEATURED PROJECTS ================= */}
      <section className="space-y-10">
        <ScrollReveal>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b hairline pb-6">
            <div className="space-y-2">
              <span className="section-eyebrow block">01 — {getContent('home', 'featured.header', t.home.featuredHeader)}</span>
              <h2 className="display-font text-2xl sm:text-4xl font-bold tracking-tight text-ink">
                {getContent('home', 'featured.header', t.home.featuredHeader)}
              </h2>
            </div>
            <button
              onClick={() => goTo('portfolio')}
              className="group inline-flex items-center gap-2 mono-label text-ink-muted hover:text-ink transition-colors self-start sm:self-auto"
            >
              {getContent('home', 'featured.view_all', t.home.viewAllWork)}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredProjects.map((project, index) => (
            <ScrollReveal key={project.id} delay={index * 0.1}>
              <button
                onClick={() => {
                  setSelectedProject(project);
                  goTo('portfolio');
                }}
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
                  <span className="mono-label text-ink-faint inline-flex items-center gap-1.5">
                    {t.portfolio.viewCaseStudy}
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </button>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ================= WORKFLOW ================= */}
      <section>
        <ScrollReveal>
          <WorkflowProcess />
        </ScrollReveal>
      </section>

      {/* ================= SKILLS ================= */}
      <section className="space-y-8">
        <ScrollReveal>
          <div className="border-b hairline pb-6 space-y-2">
            <span className="section-eyebrow block">02 — Capabilities</span>
            <h2 className="display-font text-2xl sm:text-3xl font-bold tracking-tight text-ink">
              {t.home.skillsTitle}
            </h2>
            <p className="text-sm text-ink-muted">{t.home.skillsSub}</p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
          {skills.map((skill, idx) => (
            <ScrollReveal key={skill.id} delay={idx * 0.04}>
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="display-font font-semibold text-ink truncate">{skill.name}</span>
                    <span className="mono-label text-ink-faint hidden sm:inline">{skill.category}</span>
                  </div>
                  <AnimatedSkillBadge proficiency={skill.proficiency} delay={idx * 0.05} />
                </div>
                <SkillProgressBar proficiency={skill.proficiency} delay={idx * 0.05} />
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ================= TRUST ================= */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-px bg-line border hairline">
        <div className="lg:col-span-5 bg-paper p-8 sm:p-10 space-y-4">
          <span className="section-eyebrow block">{getContent('home', 'trust.header', t.home.trustHeader)}</span>
          <h2 className="display-font text-2xl sm:text-3xl font-bold tracking-tight text-ink leading-tight">
            {getContent('home', 'trust.title', t.home.trustTitle)}
          </h2>
          <p className="text-sm text-ink-muted leading-relaxed">{getContent('home', 'trust.sub', t.home.trustSub)}</p>
        </div>
        <div className="lg:col-span-7 bg-paper p-8 sm:p-10">
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
            {(getContentList('home', 'trust.points').length ? getContentList('home', 'trust.points') : t.home.trustPoints).map((point, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm text-ink-muted leading-snug">
                <span className="text-strong mt-0.5" aria-hidden="true">◆</span>
                {point}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ================= ESTIMATOR TEASER ================= */}
      <section>
        <ScrollReveal>
          <div className="relative overflow-hidden bg-ink text-paper p-8 sm:p-12 space-y-6">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-accent2/20 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-3 max-w-xl">
                <span className="mono-label text-paper/60">03 — Pricing</span>
                <h2 className="display-font text-3xl sm:text-4xl font-bold tracking-tight text-paper leading-tight">
                  {getContent('home', 'teaser.title', 'Get a transparent estimate in 30 seconds')}
                </h2>
                <p className="text-sm text-paper/70 leading-relaxed">
                  {getContent('home', 'teaser.desc', 'Pick a service, a scope, and a timeline — see the price in USD & IDR before you even reach out.')}
                </p>
              </div>
              <button onClick={() => goTo('services')} className="btn-accent shrink-0">
                {getContent('home', 'teaser.btn', 'Open estimator')}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
};
