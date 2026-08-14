import React, { useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AdminUnlockModal } from '../admin/AdminUnlockModal';
import { Ghost, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const { setCurrentPage } = useApp();
  const [showModal, setShowModal] = useState(false);
  const clicks = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleGhostClick = () => {
    clicks.current += 1;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      clicks.current = 0;
    }, 600);
    if (clicks.current >= 3) {
      clicks.current = 0;
      setShowModal(true);
    }
  };

  return (
    <div className="py-16 sm:py-24 max-w-2xl mx-auto text-center space-y-6">
      <div className="flex items-center justify-center">
        <button
          onClick={handleGhostClick}
          className="text-ink-faint hover:text-ink transition-colors"
          aria-label="null"
        >
          <Ghost className="w-20 h-20" />
        </button>
      </div>

      <div>
        <span className="mono-label text-strong">Error 404</span>
        <h1 className="display-font text-4xl sm:text-5xl font-bold text-ink tracking-tight mt-2">
          Halaman tidak ditemukan
        </h1>
        <p className="text-sm text-ink-muted mt-3">
          Halaman yang Anda cari tidak ada atau telah dipindahkan. Periksa kembali alamatnya.
        </p>
      </div>

      <button
        onClick={() => setCurrentPage('home')}
        className="border hairline bg-paper2 px-5 py-2.5 text-xs font-semibold text-ink rounded-md inline-flex items-center gap-2 hover:bg-surface transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali ke Beranda
      </button>

      {showModal && <AdminUnlockModal onClose={() => setShowModal(false)} />}
    </div>
  );
};