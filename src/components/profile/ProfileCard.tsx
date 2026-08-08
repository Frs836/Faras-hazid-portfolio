import React from 'react';
import { Phone, Mail } from 'lucide-react';
import farasProfileImg from '../../assets/images/faras_hazid_profile_1785339029195.jpg';
import { useApp } from '../../context/AppContext';

interface ProfileCardProps {
  className?: string;
  showBioText?: boolean;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ className = '', showBioText = false }) => {
  const { t, siteSettings } = useApp();
  const avatarSrc = siteSettings?.avatarUrl || farasProfileImg;
  const phoneDisplay = siteSettings?.contactPhone || '+62 851-4354-1287';
  const emailDisplay = siteSettings?.contactEmail || 'focalhyperspacecreative@gmail.com';
  const waNumber = siteSettings?.whatsappNumber || '6285143541287';

  return (
    <div className={`bg-paper border hairline p-6 sm:p-8 flex flex-col items-center text-center space-y-6 ${className}`}>
      {/* Portrait */}
      <div className="relative">
        <div className="w-44 h-56 sm:w-52 sm:h-64 overflow-hidden border hairline bg-paper2">
          <img
            src={avatarSrc}
            alt="FARAS HAZID - GRAPHIC & UI DESIGNER"
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap mono-label bg-ink text-paper px-3 py-1.5">
          FARAS HAZID
        </span>
      </div>

      <div className="space-y-1.5">
        <h3 className="display-font text-xl font-bold tracking-tight text-ink">FARAS HAZID</h3>
        <p className="mono-label text-ink-muted">GRAPHIC &amp; UI DESIGNER</p>
      </div>

      {showBioText && (
        <p className="text-sm text-ink-muted leading-relaxed max-w-md">
          {siteSettings?.aboutBio || t.about.bioFull}
        </p>
      )}

      <div className="w-full flex flex-col gap-2 pt-1">
        <a
          href={`https://wa.me/${waNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-ghost w-full py-2.5 text-xs"
        >
          <Phone className="w-3.5 h-3.5 text-strong" />
          {phoneDisplay}
        </a>
        <a href={`mailto:${emailDisplay}`} className="btn-ghost w-full py-2.5 text-xs">
          <Mail className="w-3.5 h-3.5 text-strong" />
          <span className="truncate">{emailDisplay}</span>
        </a>
      </div>
    </div>
  );
};
