import React from 'react';
import { useApp } from '../../context/AppContext';
import { ProfileCard } from '../profile/ProfileCard';
import { ScrollReveal } from '../ui/ScrollReveal';
import { SkillProgressBar, AnimatedSkillBadge } from '../ui/SkillProgressBar';
import { Download } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { t, experiences, skills, openCvModal, siteSettings, getContent, getContentList } = useApp();

  const workExps = experiences.filter((e) => e.type === 'work');
  const eduExps = experiences.filter((e) => e.type === 'education');

  const designList = getContentList('about', 'skills.design_list').length
    ? getContentList('about', 'skills.design_list')
    : t.about.designSkillsList;
  const personalList = getContentList('about', 'skills.personal_list').length
    ? getContentList('about', 'skills.personal_list')
    : t.about.personalSkillsList;

  return (
    <div className="space-y-24 py-6 pb-12">
      {/* Header + profile */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center pt-8">
        <ScrollReveal duration={0.7} className="lg:col-span-5">
          <ProfileCard className="max-w-sm mx-auto lg:mx-0" showBioText={false} />
        </ScrollReveal>

        <ScrollReveal duration={0.7} delay={0.1} className="lg:col-span-7">
          <div className="space-y-6">
            <span className="section-eyebrow block">About</span>
            <h1 className="display-font font-bold tracking-tight text-ink leading-[1.02] text-[clamp(2rem,5vw,3.75rem)]">
              {getContent('about', 'hero.greeting', t.about.bioGreeting)}
            </h1>
            <p className="mono-label text-ink-muted">{getContent('about', 'hero.role', t.about.bioRole)}</p>
            <p className="text-base text-ink-muted leading-relaxed max-w-xl">{getContent('about', 'hero.bio_full', t.about.bioFull)}</p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => {
                  if (siteSettings?.cvDownloadUrlEng) window.open(siteSettings.cvDownloadUrlEng, '_blank');
                  else openCvModal('en');
                }}
                className="btn-primary text-xs"
              >
                <Download className="w-4 h-4" />
                {getContent('about', 'hero.cv_en', t.about.downloadCvEn)}
              </button>
              <button
                onClick={() => {
                  if (siteSettings?.cvDownloadUrlIndo) window.open(siteSettings.cvDownloadUrlIndo, '_blank');
                  else openCvModal('id');
                }}
                className="btn-ghost text-xs"
              >
                <Download className="w-4 h-4 text-strong" />
                {getContent('about', 'hero.cv_id', t.about.downloadCvId)}
              </button>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Design vs Personal skills */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-px bg-line border hairline">
        <ScrollReveal>
          <div className="bg-paper p-8 sm:p-10 space-y-6">
            <span className="section-eyebrow block">01 — Design</span>
            <h2 className="display-font text-2xl font-bold tracking-tight text-ink">{getContent('about', 'skills.design_title', t.about.designSkillsTitle)}</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
              {designList.map((skill, idx) => (
                <li key={idx} className="flex items-center gap-2.5 text-sm text-ink">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" aria-hidden="true" />
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="bg-paper p-8 sm:p-10 space-y-6">
            <span className="section-eyebrow block">02 — Personal</span>
            <h2 className="display-font text-2xl font-bold tracking-tight text-ink">{getContent('about', 'skills.personal_title', t.about.personalSkillsTitle)}</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
              {personalList.map((skill, idx) => (
                <li key={idx} className="flex items-center gap-2.5 text-sm text-ink">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" aria-hidden="true" />
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        </ScrollReveal>
      </section>

      {/* Work experience */}
      <section className="space-y-8">
        <ScrollReveal>
          <div className="border-b hairline pb-6 space-y-2">
            <span className="section-eyebrow block">Experience</span>
            <h2 className="display-font text-2xl sm:text-3xl font-bold tracking-tight text-ink">
              {getContent('about', 'work.title', t.about.workHistory)}
            </h2>
            <p className="text-sm text-ink-muted">{getContent('about', 'work.sub', t.about.workHistorySub)}</p>
          </div>
        </ScrollReveal>

        <div className="space-y-px bg-line border hairline">
          {workExps.map((exp, idx) => (
            <ScrollReveal key={exp.id} delay={idx * 0.06}>
              <div className="bg-paper p-6 sm:p-8 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                  <div className="space-y-1">
                    <h3 className="display-font text-lg font-semibold text-ink">{exp.role}</h3>
                    <p className="mono-label text-ink-muted">
                      {exp.companyOrOrg}
                      {exp.location ? ` — ${exp.location}` : ''}
                    </p>
                  </div>
                  <span className="mono-label text-ink-faint shrink-0">{exp.period}</span>
                </div>
                {exp.description && (
                  <p className="text-sm text-ink-muted leading-relaxed max-w-2xl">{exp.description}</p>
                )}
                {exp.highlights.length > 0 && (
                  <ul className="space-y-1.5">
                    {exp.highlights.map((h, hIdx) => (
                      <li key={hIdx} className="text-sm text-ink-muted flex items-start gap-2">
                        <span className="text-strong" aria-hidden="true">—</span>
                        {h}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Education */}
      <section className="space-y-8">
        <ScrollReveal>
          <div className="border-b hairline pb-6 space-y-2">
            <span className="section-eyebrow block">Education</span>
            <h2 className="display-font text-2xl sm:text-3xl font-bold tracking-tight text-ink">
              {getContent('about', 'edu.title', t.about.education)}
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-line border hairline">
          {eduExps.map((exp, idx) => (
            <ScrollReveal key={exp.id} delay={idx * 0.08}>
              <div className="bg-paper p-6 h-full flex flex-col justify-between gap-6">
                <div className="space-y-2">
                  <span className="mono-label text-ink-faint block">{exp.period}</span>
                  <h3 className="display-font text-base font-semibold text-ink">{exp.role}</h3>
                  <p className="mono-label text-ink-muted">{exp.companyOrOrg}</p>
                </div>
                <p className="text-sm text-ink-muted border-t hairline pt-4">{exp.description}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Skills matrix */}
      <section className="space-y-8">
        <ScrollReveal>
          <div className="border-b hairline pb-6 space-y-2">
            <span className="section-eyebrow block">Capabilities</span>
            <h2 className="display-font text-2xl sm:text-3xl font-bold tracking-tight text-ink">
              {getContent('about', 'tools.title', t.about.skillsTools)}
            </h2>
            <p className="text-sm text-ink-muted">{t.about.skillsToolsSub}</p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-6">
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
    </div>
  );
};
