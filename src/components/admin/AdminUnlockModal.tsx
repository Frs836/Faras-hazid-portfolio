import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Lock, KeyRound, ShieldAlert, Sparkles, X } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export const AdminUnlockModal: React.FC<Props> = ({ onClose }) => {
  const { verifyAdminPasscode, addToast } = useApp();
  const [pinInput, setPinInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [busy, setBusy] = useState(false);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinInput.trim()) return;
    setBusy(true);
    const ok = await verifyAdminPasscode(pinInput.trim());
    setBusy(false);
    if (ok) {
      addToast('Dashboard Dibuka', 'Selamat datang kembali, admin.', 'success');
      onClose();
    } else {
      setErrorMsg('PIN salah. Akses ditolak.');
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
      <div className="clay-card w-full max-w-sm p-8 bg-white border border-slate-200 text-center space-y-5 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute right-3 top-3 p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          aria-label="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center mx-auto shadow-lg">
          <Lock className="w-6 h-6 text-sky-400" />
        </div>

        <div>
          <h2 className="text-lg font-black text-slate-900">Autentikasi Admin</h2>
          <p className="text-xs text-slate-500 mt-1">Masukkan PIN pribadi untuk membuka kontrol panel.</p>
        </div>

        <form onSubmit={handleUnlock} className="space-y-3">
          <div className="relative">
            <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              required
              autoFocus
              value={pinInput}
              onChange={(e) => {
                setPinInput(e.target.value);
                setErrorMsg('');
              }}
              placeholder="PIN Admin"
              className="clay-input text-xs w-full py-3 pl-10 pr-4 tracking-[0.35em]"
            />
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 text-rose-600 text-xs font-bold flex items-center justify-center gap-2 border border-rose-200">
              <ShieldAlert className="w-4 h-4" />
              <span>{errorMsg}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={busy}
            className="clay-button w-full py-3 text-xs flex items-center justify-center gap-2 disabled:opacity-60"
          >
            <Sparkles className="w-4 h-4" />
            {busy ? 'Memverifikasi…' : 'Buka Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
};