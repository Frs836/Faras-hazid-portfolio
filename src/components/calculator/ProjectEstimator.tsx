import React, { useState } from 'react';
import { CheckCircle2, ArrowRight, MessageSquare, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { submitEstimateInquiry } from '../../services/apiService';

const idr = (n: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

export const ProjectEstimator: React.FC = () => {
  const { t, estimatorServices, estimatorScopes, estimatorTimelines, addToast, siteSettings } = useApp();
  const [selectedServiceId, setSelectedServiceId] = useState<string>(() => estimatorServices[0]?.id || 'brand-identity');
  const [selectedScopeId, setSelectedScopeId] = useState<string>(() => estimatorScopes[0]?.id || 'starter');
  const [selectedTimelineId, setSelectedTimelineId] = useState<string>(() => estimatorTimelines[0]?.id || 'standard');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [saving, setSaving] = useState(false);

  const localizedServices = estimatorServices.map((srv) => {
    const tr = t.calculator.servicesData?.[srv.id];
    return tr ? { ...srv, name: tr.name, deliverables: tr.deliverables || srv.deliverables } : srv;
  });
  const localizedScopes = estimatorScopes.map((sc) => {
    const tr = t.calculator.scopesData?.[sc.id];
    return tr ? { ...sc, label: tr.label, desc: tr.desc } : sc;
  });
  const localizedTimelines = estimatorTimelines.map((tm) => {
    const tr = t.calculator.timelinesData?.[tm.id];
    return tr ? { ...tm, label: tr.label } : tm;
  });

  const selectedService = localizedServices.find((s) => s.id === selectedServiceId) || localizedServices[0] || estimatorServices[0];
  const selectedScope = localizedScopes.find((s) => s.id === selectedScopeId) || localizedScopes[0] || estimatorScopes[0];
  const selectedTimeline = localizedTimelines.find((tm) => tm.id === selectedTimelineId) || localizedTimelines[0] || estimatorTimelines[0];

  const scopeMult = estimatorScopes.find((s) => s.id === selectedScopeId)?.mult || 1.0;
  const timelineMult = estimatorTimelines.find((tm) => tm.id === selectedTimelineId)?.mult || 1.0;

  // Estimate + honest range buffer (~ +35% as the "final after brief" ceiling)
  const estimateUsd = Math.round(selectedService.baseUsd * scopeMult * timelineMult);
  const estimateIdr = Math.round(selectedService.baseIdrNum * scopeMult * timelineMult);
  const highUsd = Math.round(estimateUsd * 1.35);

  const hasContact = contactName.trim().length > 0 && contactPhone.trim().length > 0;

  const handleSend = async () => {
    // Only log leads with real contact — no anonymous filler rows.
    if (hasContact) {
      setSaving(true);
      try {
        const result = await submitEstimateInquiry({
          clientName: contactName.trim(),
          clientPhone: contactPhone.trim(),
          serviceType: selectedService.name,
          deliverables: selectedService.deliverables,
          urgency: selectedTimeline.label,
          estimatedPrice: estimateUsd,
          estimatedPriceIdr: estimateIdr,
          notes: `Scope: ${selectedScope.label}`,
        });
        addToast(
          'Estimate logged',
          result.savedToSupabase
            ? `Estimasi "${selectedService.name}" tersimpan ke database.`
            : 'Estimasi dibuat. (Kontak belum terhubung ke database)',
          result.savedToSupabase ? 'success' : 'info'
        );
      } finally {
        setSaving(false);
      }
    } else {
      addToast('Optional contact', 'Isi nama + nomor WhatsApp supaya estimasi & follow-up bisa dikirim balik.', 'info');
    }

    const namePart = contactName.trim() ? `%0ANama: ${contactName.trim()}%0A` : '';
    const waPart = contactPhone.trim() ? `WhatsApp: ${contactPhone.trim()}%0A` : '';
    const text = `Halo Faras (Focal Hyperspace Creative) ini gambaran singkat estimasi proyek saya:${namePart}${waPart}%0A*Layanan:* ${selectedService.name}%0A*Skala Proyek:* ${selectedScope.label}%0A*Waktu Pengerjaan:* ${selectedTimeline.label}%0A*Estimasi Investigasi:* $${estimateUsd} USD (${idr(estimateIdr)})%0A%0AMohon info lebih lanjut ya. Terima kasih!`;
    const wa = siteSettings?.whatsappNumber || '6285143541287';
    window.open(`https://wa.me/${wa}?text=${text}`, '_blank');
  };

  const StepTag: React.FC<{ n: number }> = ({ n }) => (
    <span className="w-4 h-4 rounded-full border hairline inline-flex items-center justify-center text-[10px] text-strong">
      {n}
    </span>
  );

  return (
    <div className="border hairline bg-paper">
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* LEFT — inputs */}
        <div className="lg:col-span-7 p-6 sm:p-8 space-y-7 border-b lg:border-b-0 lg:border-r hairline">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div className="space-y-2">
              <span className="section-eyebrow inline-flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-strong" />
                {t.calculator.badge}
              </span>
              <h3 className="display-font text-2xl sm:text-3xl font-bold tracking-tight text-ink">
                {t.calculator.title}
              </h3>
              <p className="text-sm text-ink-muted">{t.calculator.subtitle}</p>
            </div>
            <div className="mono-label text-ink-faint shrink-0 flex items-center gap-2 border hairline px-3 py-2">
              <span className="w-2 h-2 rounded-full bg-strong" aria-hidden="true" />
              {t.calculator.trustTitle}
            </div>
          </div>

          {/* Step 1 — service */}
          <div className="space-y-3">
            <span className="section-eyebrow flex items-center gap-2"><StepTag n={1} />{t.calculator.step1}</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {localizedServices.map((srv) => {
                const active = selectedServiceId === srv.id;
                return (
                  <button
                    key={srv.id}
                    type="button"
                    onClick={() => setSelectedServiceId(srv.id)}
                    className={`p-3.5 text-left border transition-colors active:scale-[0.98] ${active ? 'bg-ink text-paper border-ink' : 'bg-paper2 border-line text-ink hover:bg-surface'}`}
                  >
                    <div className="display-font font-semibold text-sm">{srv.name}</div>
                    <div className={`mono-label mt-1 ${active ? 'text-paper/60' : 'text-ink-faint'}`}>
                      {t.calculator.startingFrom} ${srv.baseUsd} USD
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2 — scope */}
          <div className="space-y-3">
            <span className="mono-label text-ink-muted flex items-center gap-2"><StepTag n={2} />{t.calculator.step2}</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {localizedScopes.map((scope) => {
                const active = selectedScopeId === scope.id;
                return (
                  <button
                    key={scope.id}
                    type="button"
                    onClick={() => setSelectedScopeId(scope.id)}
                    className={`p-3 text-left border text-sm transition-colors active:scale-[0.98] ${active ? 'bg-surface border-ink text-ink' : 'bg-paper2 border-line text-ink-muted hover:bg-surface'}`}
                  >
                    <div className="font-semibold text-ink">{scope.label}</div>
                    <p className="mono-label text-ink-faint mt-1 leading-tight">{scope.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3 — timeline */}
          <div className="space-y-3">
            <span className="mono-label text-ink-muted flex items-center gap-2"><StepTag n={3} />{t.calculator.step3}</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {localizedTimelines.map((tm) => {
                const active = selectedTimelineId === tm.id;
                return (
                  <button
                    key={tm.id}
                    type="button"
                    onClick={() => setSelectedTimelineId(tm.id)}
                    className={`p-3 text-left border text-sm transition-colors active:scale-[0.98] ${active ? 'bg-ink text-paper border-ink' : 'bg-paper2 border-line text-ink hover:bg-surface'}`}
                  >
                    {tm.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 4 — contact (optional but recommended) */}
          <div className="space-y-3">
            <span className="mono-label text-ink-muted flex items-center gap-2"><StepTag n={4} />{t.calculator.step4}</span>
            <p className="mono-label text-ink-faint">{t.calculator.contactHint}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <input
                type="text"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder={t.calculator.contactNameLabel}
                className="field-input"
              />
              <input
                type="tel"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder={t.calculator.contactPhoneLabel}
                className="field-input"
              />
            </div>
          </div>
        </div>

        {/* RIGHT — output */}
        <div className="lg:col-span-5 p-6 sm:p-8 bg-ink text-paper flex flex-col justify-between gap-6">
          <div className="space-y-5">
            <div className="flex items-center justify-between gap-3">
              <span className="mono-label text-paper/50">{t.calculator.summaryBadge}</span>
              <span className="mono-label text-paper/50">{selectedScope.label}</span>
            </div>
            <h4 className="display-font text-xl font-semibold text-paper">{selectedService.name}</h4>

            <div className="border-t border-paper/15 pt-5">
              <div className="flex items-baseline gap-1.5">
                <span className="display-font text-4xl font-bold text-paper">${estimateUsd}</span>
                <span className="mono-label text-paper/50">USD</span>
              </div>
              <div className="mono-label text-strong mt-1">{idr(estimateIdr)}</div>
              <div className="mono-label text-paper/50 mt-2">
                {t.calculator.rangeLabel} ${estimateUsd} – ${highUsd}
              </div>
              <p className="mono-label text-paper/40 mt-3 border-t border-paper/15 pt-3">{t.calculator.quoteNote}</p>
            </div>

            <div className="space-y-2">
              <span className="mono-label text-paper/50 block">{t.calculator.deliverablesHeader}</span>
              <ul className="space-y-1.5 text-sm text-paper/85">
                {selectedService.deliverables.map((d, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-strong shrink-0 mt-0.5" />
                    <span className="leading-tight">{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSend}
            disabled={saving}
            className="w-full py-4 bg-accent text-accent-ink font-bold text-sm inline-flex items-center justify-center gap-2 hover:brightness-105 transition disabled:opacity-50"
          >
            <MessageSquare className="w-4 h-4" />
            <span>{saving ? 'Saving…' : t.calculator.sendWaBtn}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};