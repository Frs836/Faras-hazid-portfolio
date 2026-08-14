import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Trash2, Check, MessageSquare, Mail } from 'lucide-react';

type Filter = 'all' | 'unread' | 'read';

export const MessagesPanel: React.FC = () => {
  const { messages, markMessageRead, deleteMessage } = useApp();
  const [filter, setFilter] = useState<Filter>('all');

  const unreadCount = messages.filter((m) => !m.read).length;
  const readCount = messages.length - unreadCount;

  const list = messages
    .filter((m) => (filter === 'all' ? true : filter === 'unread' ? !m.read : m.read))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            <span>Direct Contact Messages & Leads</span>
          </h2>
          <p className="text-xs text-slate-500">Lead dari form kontak — tandai dibaca setelah ditindaklanjuti.</p>
        </div>

        <div className="flex items-center gap-1 border hairline rounded-md overflow-hidden self-start">
          {([
            ['all', `Semua (${messages.length})`],
            ['unread', `Baru (${unreadCount})`],
            ['read', `Dibaca (${readCount})`],
          ] as [Filter, string][]).map(([f, label]) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 mono-label transition-colors ${filter === f ? 'bg-ink text-paper' : 'text-ink-muted hover:text-ink'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {messages.length === 0 ? (
        <div className="border hairline bg-paper2 p-10 text-center mono-label text-ink-muted">
          Belum ada inquiry dari kontak. Lead baru akan muncul di sini.
        </div>
      ) : (
        <div className="border hairline bg-paper overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b hairline mono-label text-ink-muted text-[11px] uppercase">
                <th className="px-4 py-3 font-semibold">Pengirim</th>
                <th className="px-4 py-3 font-semibold">Layanan</th>
                <th className="px-4 py-3 font-semibold">Budget</th>
                <th className="px-4 py-3 font-semibold">Tanggal</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y hairline">
              {list.map((m) => (
                <tr key={m.id} className={`align-top ${m.read ? '' : 'bg-accent/5'}`}>
                  <td className="px-4 py-3">
                    <div className="font-bold text-ink text-xs">{m.name}</div>
                    <div className="text-[11px] text-ink-muted flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      {m.email}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-ink-muted">{m.serviceInterest}</td>
                  <td className="px-4 py-3 text-xs text-ink-muted">{m.budget}</td>
                  <td className="px-4 py-3 text-[11px] text-ink-muted whitespace-nowrap">
                    {new Date(m.createdAt).toLocaleDateString()}
                    <div>{new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                  </td>
                  <td className="px-4 py-3">
                    {m.read ? (
                      <span className="px-2 py-0.5 rounded-full bg-paper2 text-ink-muted text-[10px] font-bold uppercase">Dibaca</span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-bold uppercase">Baru</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1.5">
                      {!m.read && (
                        <button
                          onClick={() => markMessageRead(m.id)}
                          className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100"
                          title="Tandai sebagai dibaca"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteMessage(m.id)}
                        className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100"
                        title="Hapus pesan"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {list.length === 0 && (
            <div className="p-8 text-center mono-label text-ink-muted">
              Tidak ada pesan pada filter "{filter === 'all' ? 'Semua' : filter === 'unread' ? 'Baru' : 'Dibaca'}".
            </div>
          )}
        </div>
      )}

      {list.some((m) => m.message) && (
        <div className="flex flex-col gap-2">
          {list.filter((m) => m.message).map((m) => (
            <details key={'detail-' + m.id} className="border hairline bg-paper p-3">
              <summary className="mono-label text-ink-muted cursor-pointer">Detail pesan: {m.name}</summary>
              <p className="text-xs text-ink mt-2 bg-paper2 p-3 rounded-md whitespace-pre-wrap">{m.message}</p>
            </details>
          ))}
        </div>
      )}
    </div>
  );
};