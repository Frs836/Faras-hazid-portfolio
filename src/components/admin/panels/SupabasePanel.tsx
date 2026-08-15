import React, { useEffect, useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { SUPABASE_SQL_SCHEMA, isSupabaseConnected } from '../../../lib/supabase';
import { checkBackendStatus, syncAllDataToSupabase } from '../../../services/apiService';
import { Database, RefreshCw, Copy, Check, Terminal, CheckCircle2 } from 'lucide-react';

export const SupabasePanel: React.FC = () => {
  const {
    projects,
    packages,
    estimatorServices,
    estimatorScopes,
    estimatorTimelines,
    experiences,
    skills,
    siteSettings,
    addToast,
  } = useApp();

  const [copiedSql, setCopiedSql] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [dbStatus, setDbStatus] = useState<{ configured: boolean }>({
    configured: isSupabaseConnected(),
  });

  useEffect(() => {
    checkBackendStatus().then((status) => {
      setDbStatus({ configured: status.supabaseConnected || isSupabaseConnected() });
    });
  }, []);

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSql(true);
    addToast('SQL Schema Copied!', 'Copied PostgreSQL DDL script for Supabase SQL Editor.', 'success');
    setTimeout(() => setCopiedSql(false), 3000);
  };

  const handleSyncAllDataToSupabase = async () => {
    setIsSyncing(true);
    addToast('Memulai Sync Supabase...', 'Mengunggah seluruh data portfolio ke database Supabase...', 'info');
    const result = await syncAllDataToSupabase({
      projects,
      packages,
      estimatorServices,
      estimatorScopes,
      estimatorTimelines,
      experiences,
      skills,
      siteSettings,
    });
    setIsSyncing(false);
    if (result.success) {
      addToast(
        'Supabase Bulk Seed Berhasil!',
        `Berhasil mengunggah ${result.syncedTables.length} tabel (${result.syncedTables.join(', ')}) ke database Supabase PostgreSQL.`,
        'success'
      );
    } else {
      addToast(
        'Sync Warning',
        `Sync selesai dengan beberapa pesan: ${result.errors.join('; ')}`,
        result.syncedTables.length > 0 ? 'warning' : 'error'
      );
    }
  };

  const tables = ['projects', 'packages', 'estimator_services', 'estimator_scopes', 'estimator_timelines', 'experiences', 'skills', 'messages', 'estimates', 'analytics_events', 'page_content & faqs'];

  return (
    <div className="space-y-6">
      <div className="clay-card p-6 sm:p-8 bg-white space-y-6 border border-slate-200/90 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <span>Supabase PostgreSQL Integration</span>
                {dbStatus.configured ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">Active & Connected</span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">Keys Pending in .env</span>
                )}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Perubahan situs kini otomatis tersimpan ke Supabase (auto-sync) — tanpa klik manual.
                Tombol push di bawah hanya untuk menyinkronkan seluruh tabel dari data default.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSyncAllDataToSupabase}
              disabled={isSyncing}
              className="clay-button-secondary bg-emerald-700 hover:bg-emerald-600 text-white text-xs px-4 py-2.5 flex items-center gap-2 shrink-0 disabled:opacity-50 font-bold"
            >
              <RefreshCw className={`w-4 h-4 text-emerald-200 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing Tables...' : 'Push All Default Data to Supabase'}</span>
            </button>
            <button onClick={handleCopySql} className="clay-button-primary bg-slate-900 hover:bg-slate-800 text-white text-xs px-4 py-2.5 flex items-center gap-2 shrink-0">
              {copiedSql ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copiedSql ? 'SQL Schema Copied!' : 'Copy SQL Schema'}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-slate-400 text-[10px] uppercase font-black block tracking-wider">Environment Variables (.env.example)</span>
            <ul className="space-y-1 text-slate-700 font-mono text-[11px]">
              <li><span className="text-blue-600 font-bold">SUPABASE_URL</span> = https://your-project.supabase.co</li>
              <li><span className="text-blue-600 font-bold">SUPABASE_ANON_KEY</span> = eyJhbGciOi...</li>
              <li><span className="text-blue-600 font-bold">SUPABASE_SERVICE_ROLE_KEY</span> = server-only</li>
              <li><span className="text-blue-600 font-bold">VITE_SUPABASE_URL</span> = https://your-project.supabase.co</li>
              <li><span className="text-blue-600 font-bold">VITE_SUPABASE_ANON_KEY</span> = eyJhbGciOi...</li>
              <li><span className="text-blue-600 font-bold">GEMINI_API_KEY</span> = auto-translate</li>
              <li><span className="text-emerald-600 font-bold">ADMIN_PIN</span> = server-only (fallback first-run; ganti via Pengaturan → Keamanan Akun)</li>
              <li><span className="text-emerald-600 font-bold">ADMIN_SECRET</span> = server-only (HMAC token signing)</li>
              <li><span className="text-violet-600 font-bold">TELEGRAM_BOT_TOKEN</span> = server-only (notif lead)</li>
              <li><span className="text-violet-600 font-bold">TELEGRAM_ADMIN_CHAT_ID</span> = server-only (notif lead)</li>
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 text-slate-700 space-y-2">
            <span className="text-emerald-800 text-[10px] uppercase font-black block tracking-wider">Database Tables Configured & Ready</span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {tables.map((t) => (
                <div key={t} className="bg-white p-2 rounded-xl border border-emerald-200/60 font-medium flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-800 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-slate-700" />
              <span>PostgreSQL DDL Migration Script (Paste into Supabase SQL Editor)</span>
            </span>
            <span className="text-[10px] font-bold text-slate-500">RLS aktif · messages/estimates/events = insert-only (anon)</span>
          </div>
          <div className="relative rounded-2xl bg-slate-900 text-emerald-400 p-4 font-mono text-[11px] overflow-x-auto max-h-72 border border-slate-800 leading-relaxed">
            <pre>{SUPABASE_SQL_SCHEMA}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};