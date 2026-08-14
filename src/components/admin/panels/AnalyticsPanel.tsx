import React from 'react';
import { useApp } from '../../../context/AppContext';
import { BarChart2, Eye, MessageSquare, FileDown, Globe } from 'lucide-react';

export const AnalyticsPanel: React.FC = () => {
  const { analytics, analyticsLoading } = useApp();

  const stats = [
    { icon: Eye, label: 'Total Unique Visitors', value: analytics.totalVisitors, color: 'text-slate-900' },
    { icon: BarChart2, label: 'Project Case Views', value: analytics.projectViews, color: 'text-blue-600' },
    { icon: MessageSquare, label: 'Inquiries Received', value: analytics.inquiriesSent, color: 'text-emerald-600' },
    { icon: FileDown, label: 'CV Downloads', value: analytics.cvDownloads, color: 'text-purple-600' },
  ];

  const topProjects = analytics.topProjects || [];
  const maxViews = Math.max(1, ...topProjects.map((p) => p.views));
  const countries = analytics.visitorByCountry || [];
  const maxCountry = Math.max(1, ...countries.map((c) => c.count));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-slate-800">Live Traffic & Conversion Metrics</h2>
          <p className="text-xs text-slate-500">
            {analyticsLoading ? 'Memuat data live dari database…' : 'Data event aktual dari Supabase (analytics_events).'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="clay-card p-5 bg-white text-center">
            <s.icon className={`w-5 h-5 mx-auto ${s.color}`} />
            {analyticsLoading ? (
              <span className="inline-block w-12 h-7 bg-slate-100 animate-pulse rounded mt-3" />
            ) : (
              <span className="text-2xl font-black text-slate-900 block mt-2">{s.value.toLocaleString()}</span>
            )}
            <span className="text-xs font-semibold text-slate-500">{s.label}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="border hairline bg-paper">
          <div className="flex items-center gap-2 px-4 py-3 border-b hairline">
            <BarChart2 className="w-4 h-4 text-accent2" />
            <span className="mono-label text-strong uppercase">Top Proyek Dilihat</span>
          </div>
          <div className="p-4 space-y-3">
            {analyticsLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="space-y-1">
                  <div className="h-2 w-2/3 bg-paper2 animate-pulse rounded" />
                  <div className="h-1.5 bg-paper2 animate-pulse rounded-full" />
                </div>
              ))
            ) : topProjects.length === 0 ? (
              <div className="mono-label text-ink-faint">Belum ada data kunjungan per proyek.</div>
            ) : (
              topProjects.map((p) => (
                <div key={p.name}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-ink truncate mr-2">{p.name}</span>
                    <span className="mono-label text-ink-muted shrink-0">{p.views.toLocaleString()}</span>
                  </div>
                  <div className="h-1.5 bg-paper2 rounded-full">
                    <div className="h-1.5 bg-accent rounded-full" style={{ width: `${Math.round((p.views / maxViews) * 100)}%` }} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="border hairline bg-paper">
          <div className="flex items-center gap-2 px-4 py-3 border-b hairline">
            <Globe className="w-4 h-4 text-accent2" />
            <span className="mono-label text-strong uppercase">Pengunjung per Negara</span>
          </div>
          <div className="p-4 space-y-3">
            {analyticsLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="space-y-1">
                  <div className="h-2 w-1/3 bg-paper2 animate-pulse rounded" />
                  <div className="h-1.5 bg-paper2 animate-pulse rounded-full" />
                </div>
              ))
            ) : countries.length === 0 ? (
              <div className="mono-label text-ink-faint">Belum ada data geografis.</div>
            ) : (
              countries.map((c) => (
                <div key={c.country}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-ink truncate mr-2">{c.country}</span>
                    <span className="mono-label text-ink-muted shrink-0">{c.count.toLocaleString()}</span>
                  </div>
                  <div className="h-1.5 bg-paper2 rounded-full">
                    <div className="h-1.5 bg-accent2 rounded-full" style={{ width: `${Math.round((c.count / maxCountry) * 100)}%` }} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="border hairline bg-paper2 p-4 text-xs text-ink-muted">
        Angka diambil real-time dari tabel <code className="font-mono">analytics_events</code> (server-side tracking). Tidak ada angka dummy. Event tercatat sejak deploy kode tracking aktif.
      </div>
    </div>
  );
};