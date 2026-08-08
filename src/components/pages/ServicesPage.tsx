import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PricingPackage } from '../../types';
import { ScrollReveal } from '../ui/ScrollReveal';
import { ProjectEstimator } from '../calculator/ProjectEstimator';
import { ChevronDown, ChevronUp, MessageCircle, Clock, Star, ArrowUpRight } from 'lucide-react';

export const ServicesPage: React.FC = () => {
  const { t, services, packages, faqs, language, addToast, getContent } = useApp();
  const [openFaqId, setOpenFaqId] = useState<string | null>(faqs[0]?.id || null);

  const localizedPackages = packages.map((pkg) => {
    const pkgTrans = t.services.packagesData?.[pkg.id];
    if (!pkgTrans) return pkg;
    return {
      ...pkg,
      name: pkgTrans.name,
      badge: pkgTrans.badge,
      period: pkgTrans.period,
      description: pkgTrans.description,
      deliveryTime: pkgTrans.deliveryTime,
      features: pkgTrans.features,
    };
  });

  const localizedServices = services.map((srv) => {
    const srvTrans = t.services.coreServicesData?.[srv.id];
    if (!srvTrans) return srv;
    return {
      ...srv,
      title: srvTrans.title,
      description: srvTrans.description,
      deliverables: srvTrans.deliverables,
    };
  });

  const handleOrderWhatsApp = (pkg: PricingPackage) => {
    const text = encodeURIComponent(
      `Halo Faras Hazid! Saya tertarik memesan paket "${pkg.name}" (${pkg.priceUSD} USD / ${pkg.priceIDR}). Mohon info selengkapnya.`
    );
    window.open(`https://wa.me/6285143541287?text=${text}`, '_blank');
    addToast('Mengarahkan ke WhatsApp', `Membuka chat order untuk ${pkg.name}`, 'info');
  };

  return (
    <div className="space-y-24 py-6 pb-12">
      {/* Header */}
      <section className="pt-8 space-y-5">
        <ScrollReveal duration={0.6}>
          <span className="section-eyebrow block mb-3">Services</span>
          <h1 className="display-font font-bold tracking-tight text-ink leading-[1.02] text-[clamp(2.25rem,6vw,4.5rem)]">
            {getContent('services', 'hero.title', t.services.title)}
          </h1>
          <p className="text-base text-ink-muted max-w-2xl leading-relaxed">{getContent('services', 'hero.subtitle', t.services.subtitle)}</p>
        </ScrollReveal>
      </section>

      {/* Core offerings */}
      <section className="space-y-8">
        <ScrollReveal>
          <div className="border-b hairline pb-6">
            <span className="section-eyebrow block mb-2">01 — What I do</span>
            <h2 className="display-font text-2xl sm:text-3xl font-bold tracking-tight text-ink">
              {getContent('services', 'offer.title', t.services.coreOfferings)}
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {localizedServices.map((srv, idx) => (
            <ScrollReveal key={srv.id} delay={idx * 0.08}>
              <div className="lift-card group bg-paper2 border hairline p-6 sm:p-8 h-full flex flex-col justify-between gap-6 hover:bg-surface">
                <div className="space-y-4">
                  <span className="mono-label text-ink-faint">0{idx + 1}</span>
                  <h3 className="display-font text-xl font-semibold text-ink group-hover:text-accent2 transition-colors">
                    {srv.title}
                  </h3>
                  <p className="text-sm text-ink-muted leading-relaxed">{srv.description}</p>
                </div>
                <div className="pt-5 border-t hairline">
                  <span className="section-eyebrow block mb-3">{t.services.deliverables}</span>
                  <div className="flex flex-wrap gap-2">
                    {srv.deliverables.map((d) => (
                      <span key={d} className="mono-label text-ink border hairline px-2.5 py-1">
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="space-y-8">
        <ScrollReveal>
          <div className="border-b hairline pb-6 space-y-2">
            <span className="section-eyebrow block mb-2">02 — Pricing</span>
            <h2 className="display-font text-2xl sm:text-3xl font-bold tracking-tight text-ink">
              {t.services.pricingTitle}
            </h2>
            <p className="text-sm text-ink-muted">{t.services.pricingSub}</p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {localizedPackages.map((pkg, idx) => (
            <ScrollReveal key={pkg.id} delay={idx * 0.08}>
              <div
                className={`lift-card relative flex flex-col justify-between h-full p-6 sm:p-7 border transition-colors ${
                  pkg.popular
                    ? 'bg-ink text-paper border-ink'
                    : 'bg-paper2 border-line hover:bg-surface'
                }`}
              >
                {pkg.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap mono-label bg-accent text-accent-ink px-3 py-1.5 flex items-center gap-1.5">
                    <Star className="w-3 h-3 fill-accent-ink" />
                    {t.services.popularBadge}
                  </span>
                )}

                <div className="space-y-5">
                  <div className="space-y-1">
                    {pkg.badge && (
                      <span className={`mono-label block ${pkg.popular ? 'text-accent' : 'text-ink-faint'}`}>
                        {pkg.badge}
                      </span>
                    )}
                    <h3 className={`display-font text-lg font-semibold ${pkg.popular ? 'text-paper' : 'text-ink'}`}>
                      {pkg.name}
                    </h3>
                  </div>

                  <div className={`py-4 border-y ${pkg.popular ? 'border-paper/20' : 'border-line'}`}>
                    <div className="flex items-baseline gap-1.5">
                      <span className={`display-font text-3xl font-bold ${pkg.popular ? 'text-paper' : 'text-ink'}`}>
                        ${pkg.priceUSD}
                      </span>
                      <span className={`mono-label ${pkg.popular ? 'text-paper/60' : 'text-ink-muted'}`}>
                        USD / {pkg.period}
                      </span>
                    </div>
                    <span className={`mono-label block mt-1.5 ${pkg.popular ? 'text-accent' : 'text-ink-muted'}`}>
                      {pkg.priceIDR}
                    </span>
                  </div>

                  <p className={`text-sm leading-relaxed ${pkg.popular ? 'text-paper/70' : 'text-ink-muted'}`}>
                    {pkg.description}
                  </p>
                </div>

                <div className="space-y-4 pt-2">
                  <span className={`section-eyebrow block ${pkg.popular ? 'text-paper/50' : ''}`}>
                    {t.services.includedFeaturesLabel}
                  </span>
                  <ul className="space-y-2.5">
                    {pkg.features.map((feat, fIdx) => (
                      <li key={fIdx} className={`flex items-start gap-2 text-sm ${pkg.popular ? 'text-paper/85' : 'text-ink'}`}>
                        <span className={`${pkg.popular ? 'text-accent' : 'text-strong'} shrink-0`} aria-hidden="true">◆</span>
                        {feat}
                      </li>
                    ))}
                  </ul>

                  <div className={`pt-4 border-t ${pkg.popular ? 'border-paper/20' : 'border-line'} space-y-3`}>
                    <div className={`mono-label flex items-center gap-1.5 ${pkg.popular ? 'text-paper/60' : 'text-ink-muted'}`}>
                      <Clock className="w-3.5 h-3.5" />
                      {t.services.deliveryTimeLabel} {pkg.deliveryTime}
                    </div>
                    <button
                      onClick={() => handleOrderWhatsApp(pkg)}
                      className={`w-full py-3 text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors ${
                        pkg.popular
                          ? 'bg-accent text-accent-ink hover:brightness-105'
                          : 'btn-primary'
                      }`}
                    >
                      <MessageCircle className="w-4 h-4" />
                      {t.services.orderPackage}
                    </button>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Estimator (legacy clay — wrapped; restyle next pass) */}
      <section className="space-y-6">
        <ScrollReveal>
          <div className="border-b hairline pb-6">
            <span className="section-eyebrow block mb-2">03 — Estimator</span>
            <h2 className="display-font text-2xl sm:text-3xl font-bold tracking-tight text-ink">
              Transparent cost estimator
            </h2>
            <p className="text-sm text-ink-muted mt-1">
              Pick a service, scope, and timeline — see USD & IDR before reaching out.
            </p>
          </div>
        </ScrollReveal>
        <ScrollReveal>
          <ProjectEstimator />
        </ScrollReveal>
      </section>

      {/* Why choose */}
      <section className="space-y-8">
        <ScrollReveal>
          <div className="border-b hairline pb-6">
            <span className="section-eyebrow block mb-2">04 — Why me</span>
            <h2 className="display-font text-2xl sm:text-3xl font-bold tracking-tight text-ink">
              {getContent('services', 'why.title', t.services.whyChooseTitle)}
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-line border hairline">
          {t.services.whyChooseItems.map((item, i) => (
            <div key={i} className="bg-paper p-6 sm:p-8 space-y-3">
              <span className="mono-label text-ink-faint">0{i + 1}</span>
              <h3 className="display-font text-lg font-semibold text-ink">{item.title}</h3>
              <p className="text-sm text-ink-muted leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="space-y-8">
        <ScrollReveal>
          <div className="border-b hairline pb-6 space-y-2">
            <span className="section-eyebrow block mb-2">05 — FAQ</span>
            <h2 className="display-font text-2xl sm:text-3xl font-bold tracking-tight text-ink">
              {getContent('services', 'faq.title', t.services.faqTitle)}
            </h2>
            <p className="text-sm text-ink-muted">{getContent('services', 'faq.sub', t.services.faqSub)}</p>
          </div>
        </ScrollReveal>

        <div className="space-y-px bg-line border hairline">
          {faqs.map((faq) => {
            const isOpen = openFaqId === faq.id;
            const qText = faq.question[language] || faq.question.en;
            const aText = faq.answer[language] || faq.answer.en;
            return (
              <ScrollReveal key={faq.id}>
                <button
                  onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                  className="lift-card w-full bg-paper2 p-5 sm:p-6 text-left hover:bg-surface"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="display-font text-base sm:text-lg font-semibold text-ink">{qText}</h3>
                    <span className="text-ink-muted shrink-0">
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </span>
                  </div>
                  {isOpen && (
                    <p className="mt-3 pt-4 border-t hairline text-sm text-ink-muted leading-relaxed">
                      {aText}
                    </p>
                  )}
                </button>
              </ScrollReveal>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section>
        <ScrollReveal>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 bg-ink text-paper p-8 sm:p-12">
            <div className="space-y-2">
              <span className="mono-label text-paper/60 block">Have a project in mind?</span>
              <h2 className="display-font text-2xl sm:text-3xl font-bold tracking-tight text-paper">
                Let's make something unforgettable.
              </h2>
            </div>
            <button
              onClick={() => {
                window.location.hash = '#contact';
              }}
              className="btn-accent shrink-0"
            >
              Start a project
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
};
