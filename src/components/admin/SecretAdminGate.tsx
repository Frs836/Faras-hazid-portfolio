import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AdminDashboard } from './AdminDashboard';
import { Lock, KeyRound, ShieldAlert, Sparkles, ArrowLeft } from 'lucide-react';

export const SecretAdminGate: React.FC = () => {
  const { t, isAdminUnlocked, verifyAdminPasscode, setCurrentPage, addToast } = useApp();
  const [pinInput, setPinInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    const success = verifyAdminPasscode(pinInput);
    if (success) {
      addToast('CMS Unlocked', 'Welcome to the protected Headless CMS Dashboard!', 'success');
      setErrorMsg('');
    } else {
      setErrorMsg('Invalid Passcode. Access Denied.');
      addToast('Security Failure', 'Incorrect PIN entered.', 'error');
    }
  };

  if (isAdminUnlocked) {
    return <AdminDashboard />;
  }

  return (
    <div className="py-12 max-w-lg mx-auto px-4">
      <div className="clay-card p-8 bg-white border border-slate-200 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-slate-900 text-white flex items-center justify-center mx-auto shadow-xl shadow-slate-900/20">
          <Lock className="w-8 h-8 text-sky-400" />
        </div>

        <div>
          <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 uppercase tracking-wider mb-2 inline-block">
            Protected Admin Gate
          </span>
          <h2 className="text-2xl font-black text-slate-900">
            {t.admin.secretGateTitle}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {t.admin.secretGateDesc}
          </p>
        </div>

        <form onSubmit={handleUnlock} className="space-y-4">
          <div className="relative">
            <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              required
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              placeholder="Enter Admin PIN (Default: clay2026)"
              className="clay-input text-xs w-full pl-10 pr-4 py-3"
            />
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 text-rose-600 text-xs font-bold flex items-center justify-center gap-2 border border-rose-200">
              <ShieldAlert className="w-4 h-4" />
              <span>{errorMsg}</span>
            </div>
          )}

          <button type="submit" className="clay-button w-full py-3 text-xs flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span>{t.admin.unlockBtn}</span>
          </button>
        </form>

        <div className="pt-4 border-t border-slate-100">
          <button
            onClick={() => setCurrentPage('home')}
            className="text-xs font-semibold text-slate-500 hover:text-blue-600 flex items-center justify-center gap-1.5 mx-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Public Website</span>
          </button>
        </div>
      </div>
    </div>
  );
};
