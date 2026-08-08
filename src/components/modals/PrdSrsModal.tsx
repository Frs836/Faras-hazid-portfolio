import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PRD_SRS_DOCUMENTATION } from '../../data/initialData';
import { X, FileText, CheckCircle, Database, Server, Cpu, ShieldCheck } from 'lucide-react';

export const PrdSrsModal: React.FC = () => {
  const { isPrdModalOpen, setIsPrdModalOpen, addToast } = useApp();
  const [activeTab, setActiveTab] = useState<'prd' | 'architecture' | 'wireframe'>('prd');

  if (!isPrdModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="clay-card w-full max-w-4xl max-h-[90vh] bg-white flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-blue-100 text-blue-600">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-800 text-lg">
                PRD & SRS Technical Architecture
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {PRD_SRS_DOCUMENTATION.version} • Updated {PRD_SRS_DOCUMENTATION.updatedAt}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsPrdModalOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Tabs */}
        <div className="px-6 pt-4 border-b border-slate-200 bg-white flex items-center gap-2">
          <button
            onClick={() => setActiveTab('prd')}
            className={`px-4 py-2 text-xs font-bold rounded-t-xl transition border-b-2 ${
              activeTab === 'prd'
                ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            PRD & SRS Specifications
          </button>
          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-4 py-2 text-xs font-bold rounded-t-xl transition border-b-2 ${
              activeTab === 'architecture'
                ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            $0 Cost Architecture & Stack
          </button>
          <button
            onClick={() => setActiveTab('wireframe')}
            className={`px-4 py-2 text-xs font-bold rounded-t-xl transition border-b-2 ${
              activeTab === 'wireframe'
                ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Wireframe Layout Schema
          </button>
        </div>

        {/* Modal Content Scroll Area */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-slate-700 text-sm">
          {activeTab === 'prd' && (
            <div className="space-y-6">
              {PRD_SRS_DOCUMENTATION.sections.map((sec) => (
                <div key={sec.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                  <h4 className="font-bold text-slate-800 text-base mb-3 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>{sec.title}</span>
                  </h4>
                  <pre className="whitespace-pre-wrap font-sans text-xs text-slate-600 leading-relaxed">
                    {sec.content}
                  </pre>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'architecture' && (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200">
                <h4 className="font-extrabold text-blue-900 text-base mb-2 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-blue-600" />
                  <span>Zero-Cost Infrastructure Guarantee ($0/month)</span>
                </h4>
                <p className="text-xs text-blue-800 leading-relaxed">
                  This web application and Headless CMS are engineered to run completely free using premier cloud generous free tiers without incurring monthly database or hosting fees.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="clay-card p-5 bg-white">
                  <div className="flex items-center gap-2 mb-2 text-blue-600 font-bold text-sm">
                    <Server className="w-4 h-4" />
                    <span>1. Frontend Host (Vercel / Cloud Run)</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Edge CDN deployment, fast build pipelines, automatic SSL certificates, unlimited preview branches.
                  </p>
                </div>

                <div className="clay-card p-5 bg-white">
                  <div className="flex items-center gap-2 mb-2 text-indigo-600 font-bold text-sm">
                    <Database className="w-4 h-4" />
                    <span>2. Database (Supabase PostgreSQL)</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    500MB free PostgreSQL database storage, real-time subscriptions, client row-level security.
                  </p>
                </div>

                <div className="clay-card p-5 bg-white">
                  <div className="flex items-center gap-2 mb-2 text-sky-600 font-bold text-sm">
                    <Cpu className="w-4 h-4" />
                    <span>3. Headless CMS (Strapi / Contentful)</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Free Community space for 25,000 records, rich REST/GraphQL endpoints, multi-language field schemas.
                  </p>
                </div>

                <div className="clay-card p-5 bg-white">
                  <div className="flex items-center gap-2 mb-2 text-emerald-600 font-bold text-sm">
                    <ShieldCheck className="w-4 h-4" />
                    <span>4. Protected Admin Gate</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Hidden route protected by passkey, closed off from search engines and public web crawlers.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'wireframe' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-100 text-xs text-slate-600 font-mono">
                [NAVBAR]: Logo | Home | About | Projects | Services | Contact | [i18n Selector] | [PRD Button]
              </div>
              <div className="p-4 rounded-xl bg-blue-50/80 border border-blue-200 text-xs font-mono text-blue-900">
                [HERO SECTION 3D]: [Interactive 3D Clay Scene] | [Name + Title] | [Bio] | [CTA Work + Contact]
              </div>
              <div className="p-4 rounded-xl bg-slate-100 text-xs text-slate-600 font-mono">
                [PORTFOLIO GRID]: [Category Pills] | [Search Bar] | [3D Tilt Project Cards (4)]
              </div>
              <div className="p-4 rounded-xl bg-slate-100 text-xs text-slate-600 font-mono">
                [SERVICES & PRICING]: [3 Core Services] | [4 Transparent Packages (USD/IDR + WA Link)] | [FAQ Accordion]
              </div>
              <div className="p-4 rounded-xl bg-slate-100 text-xs text-slate-600 font-mono">
                [SECRET CMS GATE]: [Hidden Route] -&gt; [PIN Authentication] -&gt; [Full CRUD Dashboard]
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium">
            ClayFolio Software Architecture Standard
          </span>
          <button
            onClick={() => {
              addToast('Copied Architecture', 'PRD & SRS summary copied to clipboard', 'success');
              setIsPrdModalOpen(false);
            }}
            className="clay-button text-xs px-4 py-2"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
};
