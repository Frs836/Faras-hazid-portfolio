import React, { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PageContentRow, Language } from '../../types';
import { translateText } from '../../services/apiService';
import { Save, Plus, Trash2, Sparkles, X } from 'lucide-react';

const LANGS: Language[] = ['en', 'id', 'ja', 'ar'];
const LANG_NAME: Record<Language, string> = { en: 'English', id: 'Indonesia', ja: '日本語', ar: 'العربية' };

interface Props {
  page: string;
  label: string;
}

export const PageContentEditor: React.FC<Props> = ({ page, label }) => {
  const { pageContent, saveContentRows, addToast, refreshContent } = useApp();
  const [editLang, setEditLang] = useState<Language>('en');
  const [saving, setSaving] = useState(false);
  const [translating, setTranslating] = useState(false);

  const rows = useMemo(() => pageContent.filter((r) => r.page === page), [pageContent, page]);
  const [drafts, setDrafts] = useState<Record<string, PageContentRow>>({});

  // Rehydrate drafts whenever DB rows change (page switch / refresh)
  const draftId = rows.map((r) => r.id).join('|');
  const [seenDraftId, setSeenDraftId] = useState('');
  if (draftId !== seenDraftId) {
    setSeenDraftId(draftId);
    setDrafts(Object.fromEntries(rows.map((r) => [r.id, { ...r }])));
  }

  const sections = useMemo(() => {
    const order: string[] = [];
    const map: Record<string, PageContentRow[]> = {};
    (Object.values(drafts) as PageContentRow[]).forEach((r) => {
      if (!map[r.section]) {
        map[r.section] = [];
        order.push(r.section);
      }
      map[r.section].push(r);
    });
    return order.map((s) => [s, map[s].sort((a, b) => a.sort - b.sort)] as const);
  }, [drafts]);

  const setValue = (id: string, lang: Language, value: string) => {
    setDrafts((prev) => ({
      ...prev,
      [id]: { ...prev[id], values: { ...prev[id].values, [lang]: value } },
    }));
  };

  const removeRow = (id: string) => {
    setDrafts((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const addListItem = (r: PageContentRow) => {
    const newSort = ((Object.values(drafts) as PageContentRow[]).filter((x) => x.section === r.section && x.field === r.field).length);
    const id = `${r.page}__${r.section}__${r.field}__${r.sort}_${Date.now()}`;
    setDrafts((prev) => ({
      ...prev,
      [id]: { ...r, id, sort: newSort, values: {} },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    const rowsToSave = Object.values(drafts) as PageContentRow[];
    const ok = await saveContentRows(rowsToSave);
    await refreshContent();
    setSaving(false);
    addToast(
      ok ? 'Content saved' : 'Save failed',
      ok ? `"${label}" page updated in Supabase.` : 'Could not reach backend — check server & .env.',
      ok ? 'success' : 'error'
    );
  };

  const handleAutoTranslate = async () => {
    setTranslating(true);
    const missing = (Object.values(drafts) as PageContentRow[]).filter((r) =>
      LANGS.some((l) => !r.values[l])
    );
    if (missing.length === 0) {
      addToast('Nothing to translate', 'All languages already filled.', 'info');
      setTranslating(false);
      return;
    }
    for (const r of missing) {
      const src = r.values.en || r.values.id || r.values.ja || r.values.ar || '';
      if (!src) continue;
      const next: LangValueLike = { ...r.values };
      for (const l of LANGS) {
        if (!next[l]) {
          const t = await translateText(src, l);
          if (t !== src) next[l] = t;
        }
      }
      setDrafts((prev) => ({ ...prev, [r.id]: { ...r, values: next as any } }));
    }
    setTranslating(false);
    addToast('Auto-translate done', 'Filled missing languages (Gemini).', 'success');
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div>
          <span className="section-eyebrow block mb-1">Content Editor</span>
          <h2 className="display-font text-xl font-bold text-ink">{label} page</h2>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Language switcher */}
          <div className="flex items-center gap-0.5 border hairline rounded-md overflow-hidden">
            {LANGS.map((l) => (
              <button
                key={l}
                onClick={() => setEditLang(l)}
                className={`px-2.5 py-1.5 mono-label transition-colors ${editLang === l ? 'bg-ink text-paper' : 'text-ink-muted hover:text-ink'}`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
          <button onClick={handleAutoTranslate} disabled={translating} className="btn-ghost text-xs">
            <Sparkles className="w-4 h-4 text-strong" />
            {translating ? 'Translating…' : 'Auto-translate'}
          </button>
          <button onClick={handleSave} disabled={saving} className="btn-primary text-xs">
            <Save className="w-4 h-4" />
            {saving ? 'Saving…' : 'Save page'}
          </button>
        </div>
      </div>

      {/* Section panels */}
      <div className="space-y-4">
        {sections.length === 0 && (
          <div className="border hairline bg-paper2 p-8 text-center mono-label text-ink-muted">
            No editable fields yet — seed content first.
          </div>
        )}
        {sections.map(([section, sectionRows]) => (
          <div key={section} className="border hairline bg-paper">
            <div className="px-4 py-3 border-b hairline">
              <span className="mono-label text-strong uppercase">{section}</span>
            </div>
            <div className="p-4 space-y-4">
              {sectionRows.map((r) => (
                <FieldRow
                  key={r.id}
                  row={r}
                  lang={editLang}
                  onValue={setValue}
                  onRemove={r.type === 'list' ? removeRow : undefined}
                  onAdd={r.type === 'list' ? () => addListItem(r) : undefined}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

type LangValueLike = Partial<Record<Language, string>>;

const FieldRow: React.FC<{
  row: PageContentRow;
  lang: Language;
  onValue: (id: string, lang: Language, v: string) => void;
  onRemove?: (id: string) => void;
  onAdd?: () => void;
}> = ({ row, lang, onValue, onRemove, onAdd }) => {
  const value = row.values[lang] || '';
  const isList = row.type === 'list';
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-3">
        <label className="mono-label text-ink-muted">{row.field}</label>
        <div className="flex items-center gap-1.5">
          {isList && onAdd && (
            <button onClick={onAdd} className="p-1 text-ink-faint hover:text-strong" title="Add item">
              <Plus className="w-3.5 h-3.5" />
            </button>
          )}
          {isList && onRemove && (
            <button onClick={() => onRemove(row.id)} className="p-1 text-ink-faint hover:text-rose-500" title="Remove item">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
          {!isList && row.values && (
            <span className="mono-label text-ink-faint text-[10px]">
              {LANGS.filter((l) => row.values[l]).length}/{LANGS.length}
            </span>
          )}
        </div>
      </div>
      {row.type === 'textarea' ? (
        <textarea
          rows={3}
          value={value}
          onChange={(e) => onValue(row.id, lang, e.target.value)}
          className="field-input resize-y"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onValue(row.id, lang, e.target.value)}
          className="field-input"
        />
      )}
    </div>
  );
};
