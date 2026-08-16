import React from 'react';
import { useApp } from '../../context/AppContext';

const STEPS = 4;

export const WorkflowProcess: React.FC = () => {
  const { t, getContent } = useApp();

  const steps = Array.from({ length: STEPS }, (_, i) => {
    const idx = i + 1;
    const fallback = t.workflow.steps[i];
    return {
      step: String(idx),
      title: getContent('workflow', `step.${idx}_title`, fallback?.title || ''),
      desc: getContent('workflow', `step.${idx}_desc`, fallback?.desc || ''),
      deliverable: getContent('workflow', `step.${idx}_deliverable`, fallback?.deliverable || ''),
    };
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b hairline pb-6">
        <div className="space-y-2">
          <span className="section-eyebrow block">{getContent('workflow', 'header.eyebrow', 'Process')}</span>
          <h2 className="display-font text-2xl sm:text-3xl font-bold tracking-tight text-ink">
            {getContent('workflow', 'header.title', t.workflow.title)}
          </h2>
          <p className="text-sm text-ink-muted max-w-md">{getContent('workflow', 'header.sub', t.workflow.subtitle)}</p>
        </div>
        <span className="section-eyebrow text-ink-faint hidden sm:block">{getContent('workflow', 'header.badge', t.workflow.badge)}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-line border hairline">
        {steps.map((st, idx) => (
          <div key={idx} className="bg-paper p-6 flex flex-col justify-between gap-6">
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