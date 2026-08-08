import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DbFaq, Language } from '../../types';
import { saveFaq, deleteFaq } from '../../services/apiService';
import { Save, Plus, Trash2, Sparkles } from 'lucide-react';
import { translateText } from '../../services/apiService';

const LANGS: Language[] = ['en', 'id', 'ja', 'ar'];

export const FaqEditor: React.FC = () => {
  const { faqs, setFaqs, addToast } = useApp();
  const [editLang, setEditLang] = useState<Language>('en');
  const [drafts, setDrafts] = useState<DbFaq[]>(faqs.map((f) => ({
    id: f.id,
    sort: 0,
    question: { ...(f.question as any) },
    answer: { ...(f.answer as any) },
  })));
  const [saving, setSaving] = useState(false);

  const setQ = (id: string, v: string) => setDrafts((prev) => prev.map((f) => f.id === id ? { ...f, question: { ...f.question, [editLang]: v } } : f));
  const setA = (id: string, v: string) => setDrafts((prev) => prev.map((f) => f.id === id ? { ...f, answer: { ...f.answer, [editLang]: v } } : f));

  const add = () => setDrafts((prev) => [
    ...prev,
    { id: 'faq-' + Date.now(), sort: prev.length, question: {}, answer: {} },
  ]);
  const remove = async (id: string) => {
    setDrafts((prev) => prev.filter((f) => f.id !== id));
    await deleteFaq(id);
  };

  const saveAll = async () => {
    setSaving(true);
    let ok = true;
    for (const f of drafts) {
      const r = await saveFaq(f);
      if (!r) ok = false;
    }
    setFaqs(drafts.map((f) => ({ id: f.id, category: 'general', question: f.question as any, answer: f.answer as any })));
    setSaving(false);
    addToast(ok ? 'FAQs saved' : 'Save failed', ok ? 'FAQ list updated in Supabase.' : 'Could not reach backend.', ok ? 'success' : 'error');
  };

  const autoTranslate = async () => {
    for (const f of drafts) {
      const qSrc = f.question.en || '';
      const aSrc = f.answer.en || '';
      const qNext: any = { ...f.question };
      const aNext: any = { ...f.answer };
      for (const l of LANGS) {
        if (!qNext[l] && qSrc) qNext[l] = await translateText(qSrc, l);
        if (!aNext[l] && aSrc) aNext[l] = await translateText(aSrc, l);
      }
      setDrafts((prev) => prev.map((x) => x.id === f.id ? { ...x, question: qNext, answer: aNext } : x));
    }
    addToast('Auto-translate done', 'FAQs filled with Gemini.', 'success');
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div>
          <span className="section-eyebrow block mb-1">Content Editor</span>
          <h2 className="display-font text-xl font-bold text-ink">FAQ (Services page)</h2>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex overflow-hidden border hairline rounded-md">
            {LANGS.map((l) => (
              <button key={l} onClick={() => setEditLang(l)}
                className={`px-2.5 py-1.5 mono-label ${editLang === l ? 'bg-ink text-paper' : 'text-ink-muted hover:text-ink'}`}>
                {l.toUpperCase()}
              </button>
            ))}
          </div>
          <button onClick={autoTranslate} className="btn-ghost text-xs"><Sparkles className="w-4 h-4 text-strong" />Auto-translate</button>
          <button onClick={saveAll} disabled={saving} className="btn-primary text-xs"><Save className="w-4 h-4" />{saving ? 'Saving…' : 'Save FAQs'}</button>
          <button onClick={add} className="btn-ghost text-xs"><Plus className="w-4 h-4" />Add</button>
        </div>
      </div>

      <div className="space-y-3">
        {drafts.map((f) => (
          <div key={f.id} className="border hairline bg-paper p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="mono-label text-strong">Q&A</span>
              <button onClick={() => remove(f.id)} className="p-1 text-ink-faint hover:text-rose-500"><Plus className="w-3.5 h-3.5 rotate-45" /></button>
            </div>
            <input type="text" value={f.question[editLang] || ''} onChange={(e) => setQ(f.id, e.target.value)}
              placeholder={`Question (${editLang})`} className="field-input" />
            <textarea rows={2} value={f.answer[editLang] || ''} onChange={(e) => setA(f.id, e.target.value)}
              placeholder={`Answer (${editLang})`} className="field-input resize-y" />
          </div>
        ))}
      </div>
    </div>
  );
};