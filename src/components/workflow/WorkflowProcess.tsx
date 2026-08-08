import React from 'react';
import { useApp } from '../../context/AppContext';

export const WorkflowProcess: React.FC = () => {
  const { t } = useApp();

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b hairline pb-6">
        <div className="space-y-2">
          <span className="section-eyebrow block">Process</span>
          <h2 className="display-font text-2xl sm:text-3xl font-bold tracking-tight text-ink">
            {t.workflow.title}
          </h2>
          <p className="text-sm text-ink-muted max-w-md">{t.workflow.subtitle}</p>
        </div>
        <span className="section-eyebrow text-ink-faint hidden sm:block">{t.workflow.badge}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-line border hairline">
        {t.workflow.steps.map((st, idx) => (
          <div key={st.step} className="bg-paper p-6 flex flex-col justify-between gap-6">
            <div className="flex items-center justify-between">
              <span className="mono-label text-ink-faint">0{idx + 1}</span>
              <span className="mono-label text-ink">{st.step}</span>
            </div>
            <div className="space-y-3">
              <h3 className="display-font text-lg font-semibold text-ink">{st.title}</h3>
              <p className="text-xs text-ink-muted leading-relaxed">{st.desc}</p>
              <p className="text-xs text-ink-faint border-t hairline pt-3">{st.deliverable}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};