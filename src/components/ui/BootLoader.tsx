import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';
import logoImg from '../../assets/images/focal_fh_logo.png';

type Phase = 'show' | 'fade' | 'gone';

export const BootLoader: React.FC = () => {
  const { t } = useApp();
  const [phase, setPhase] = useState<Phase>('show');
  const [videoErr, setVideoErr] = useState(false);
  const dismissedRef = useRef(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const dismiss = useCallback(() => {
    if (dismissedRef.current) return;
    dismissedRef.current = true;
    setPhase('fade');
    window.setTimeout(() => setPhase('gone'), 550);
  }, []);

  // Auto-dismiss: earliest of (min 1.6s, window load +0.3s, hard 4.2s)
  useEffect(() => {
    const min = window.setTimeout(dismiss, 1600);
    const force = window.setTimeout(dismiss, 4200);
    const onLoad = () => window.setTimeout(dismiss, 300);
    window.addEventListener('load', onLoad);
    return () => {
      window.clearTimeout(min);
      window.clearTimeout(force);
      window.removeEventListener('load', onLoad);
    };
  }, [dismiss]);

  // Respect prefers-reduced-motion: freeze the video at first frame.
  const handleCanPlay = () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      if (videoRef.current) videoRef.current.pause();
    }
  };

  if (phase === 'gone') return null;

  return (
    <div
      onClick={dismiss}
      role="status"
      aria-live="polite"
      className={`fixed inset-0 z-[80] flex flex-col items-center justify-center gap-8 bg-paper cursor-pointer transition-opacity duration-500 ${
        phase === 'fade' ? 'opacity-0 pointer-events-none' : ''
      }`}
    >
      {/* Soft brand ambient background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-accent2/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-6">
        <div className="w-40 h-40 sm:w-52 sm:h-52 rounded-3xl overflow-hidden bg-paper2 border hairline shadow-xl">
          {videoErr ? (
            <img
              src={logoImg}
              alt="Focal Hyperspace"
              className="w-full h-full object-contain p-4"
            />
          ) : (
            <video
              ref={videoRef}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              src="/3d/logo-fhc.webm"
              onError={() => setVideoErr(true)}
              onCanPlay={handleCanPlay}
              className="w-full h-full object-contain"
              aria-hidden="true"
            />
          )}
        </div>

        <div className="flex items-center gap-2 text-sm text-ink-muted">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" aria-hidden="true" />
          <span>{t.boot.loading}</span>
        </div>
      </div>

      <div className="absolute bottom-6 mono-label text-ink-faint text-[10px]">Focal Hyperspace Creative</div>
    </div>
  );
};