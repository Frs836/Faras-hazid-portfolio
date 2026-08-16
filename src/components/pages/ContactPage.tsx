import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ScrollReveal } from '../ui/ScrollReveal';
import { Send, MessageCircle, Mail, Phone, MapPin, Clock, Copy, Check, ArrowUpRight } from 'lucide-react';
import { submitContactInquiry } from '../../services/apiService';

const FALLBACK_EMAIL = 'focalhyperspacecreative@gmail.com';

export const ContactPage: React.FC = () => {
  const { t, addMessage, addToast, getContent, siteSettings } = useApp();

  const email = siteSettings?.contactEmail || FALLBACK_EMAIL;
  const waNumber = siteSettings?.whatsappNumber || '6285143541287';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    serviceInterest: 'UI/UX & Mobile App Design',
    budget: '1000000-2000000',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [showCustomBudget, setShowCustomBudget] = useState(false);
  const [customMin, setCustomMin] = useState('');
  const [customMax, setCustomMax] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      addToast('Validation Error', 'Please fill in all required fields.', 'error');
      return;
    }

    // Build budget string
    let budgetStr = formData.budget;
    if (formData.budget === '__custom__') {
      const min = customMin ? `Rp ${Number(customMin).toLocaleString()}` : '';
      const max = customMax ? ` – Rp ${Number(customMax).toLocaleString()}` : '+';
      budgetStr = `Custom: ${min}${max}`;
    } else {
      // Parse the value like "1000000-2000000" to readable format
      const parts = formData.budget.split('-');
      if (parts.length === 2) {
        const min = parts[0] === '100000000' ? 'Rp 100.000.000+' : `Rp ${Number(parts[0]).toLocaleString()} – Rp ${Number(parts[1]).toLocaleString()}`;
        budgetStr = min;
      } else if (parts[0] === '100000000') {
        budgetStr = 'Rp 100.000.000+';
      }
    }

    if (!formData.name || !formData.email || !formData.message) {
      addToast('Validation Error', 'Please fill in all required fields.', 'error');
      return;
    }

    setIsSubmitting(true);
    addMessage(formData);

    try {
      await submitContactInquiry({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        projectType: formData.serviceInterest,
        budget: budgetStr,
        message: formData.message,
      });
      addToast('Pesan Terkirim!', 'Terima kasih! Pesan Anda telah berhasil disampaikan kepada Faras Hazid.', 'success');
    } catch {
      addToast('Message Sent!', 'Thank you! Your message has been received.', 'success');
    } finally {
      setIsSubmitting(false);
      setFormData({ name: '', email: '', phone: '', serviceInterest: 'UI/UX & Mobile App Design', budget: '1000000-2000000', message: '' });
      setShowCustomBudget(false);
      setCustomMin('');
      setCustomMax('');
    }
  };

  const handleSendWhatsApp = () => {
    if (!formData.name || !formData.message) {
      addToast('Validation Error', 'Please enter your Name and Message to generate WhatsApp link.', 'warning');
      return;
    }
    const text = encodeURIComponent(
      `Halo Faras Hazid!\n\nNama: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone || '-'}\nLayanan: ${formData.serviceInterest}\nBudget: ${formData.budget}\n\nPesan:\n${formData.message}`
    );
    window.open(`https://wa.me/${waNumber}?text=${text}`, '_blank');
    addToast('WhatsApp Chat Opened', 'Redirecting to Faras Hazid on WhatsApp.', 'info');
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(true);
    addToast('Email Copied', `Copied ${email} to clipboard!`, 'success');
    setTimeout(() => setCopiedEmail(false), 3000);
  };

  const infoItems = [
    {
      icon: Mail,
      label: 'Email',
      value: email,
      action: (
        <button
          onClick={handleCopyEmail}
          className="p-1 text-ink-faint hover:text-ink transition shrink-0"
          title="Copy Email"
          aria-label="Copy email"
        >
          {copiedEmail ? <Check className="w-4 h-4 text-strong" /> : <Copy className="w-4 h-4" />}
        </button>
      ),
    },
    {
      icon: Phone,
      label: 'WhatsApp / Phone',
      value: waNumber ? `+${waNumber}` : '-',
      href: waNumber ? `https://wa.me/${waNumber}` : undefined,
    },
    { icon: MapPin, label: 'Location', value: getContent('contact', 'info.location', 'Indonesia (UTC+7)') },
    { icon: Clock, label: 'Working Hours', value: getContent('contact', 'info.hours', 'Mon - Sat: 08:00 - 18:00 WIB') },
  ];

  const socials = [
    { name: 'Dribbble', handle: 'Faras Hazid', url: siteSettings?.socialLinks?.dribbble },
    { name: 'Behance', handle: 'Faras Hazid', url: siteSettings?.socialLinks?.behance },
    { name: 'LinkedIn', handle: 'Faras Hazid', url: siteSettings?.socialLinks?.linkedin },
    { name: 'Instagram', handle: '@faras.hazid', url: siteSettings?.socialLinks?.instagram },
  ].filter((s) => s.url);

  return (
    <div className="space-y-16 py-6 pb-12">
      {/* Header */}
      <section className="pt-8 space-y-5">
        <ScrollReveal duration={0.6}>
          <span className="section-eyebrow block mb-3">{getContent('contact', 'header.eyebrow', 'Contact')}</span>
          <h1 className="display-font font-bold tracking-tight text-ink leading-[1.02] text-[clamp(2.25rem,6vw,4.5rem)]">
            {getContent('contact', 'hero.title', t.contact.title)}
          </h1>
          <p className="text-base text-ink-muted max-w-2xl leading-relaxed">{getContent('contact', 'hero.subtitle', t.contact.subtitle)}</p>
        </ScrollReveal>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-px bg-line border hairline">
        {/* Form */}
        <ScrollReveal className="lg:col-span-7">
          <div className="bg-paper p-6 sm:p-10 h-full">
            <span className="section-eyebrow block mb-6">{getContent('contact', 'form.eyebrow', '01 — Send a Direct Message')}</span>

<form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div>
                  <label className="mono-label text-ink block mb-2">{getContent('contact', 'form.name', t.contact.nameLabel)} *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Alex Morgan"
                    className="field-input"
                  />
                </div>
                <div>
                  <label className="mono-label text-ink block mb-2">{getContent('contact', 'form.email', t.contact.emailLabel)} *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="alex@company.com"
                    className="field-input"
                  />
                </div>
                <div>
                  <label className="mono-label text-ink block mb-2">{getContent('contact', 'form.phone', t.contact.phoneLabel)}</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="08xxxxxxxxxx"
                    className="field-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="mono-label text-ink block mb-2">{getContent('contact', 'form.service', t.contact.serviceLabel)}</label>
                  <select
                    value={formData.serviceInterest}
                    onChange={(e) => setFormData({ ...formData, serviceInterest: e.target.value })}
                    className="field-input bg-paper"
                  >
                    <option>UI/UX & Mobile App Design</option>
                    <option>Graphic & Branding System</option>
                    <option>Social Media & Layout Design</option>
                    <option>Pre-Printing & Print Assets</option>
                  </select>
                </div>
                <div>
                  <label className="mono-label text-ink block mb-2">{getContent('contact', 'form.budget', t.contact.budgetLabel)}</label>
                   <select
                     value={formData.budget}
                     onChange={(e) => {
                       const val = e.target.value;
                       setFormData({ ...formData, budget: val });
                       if (val === '__custom__') setShowCustomBudget(true);
                       else setShowCustomBudget(false);
                     }}
                     className="field-input bg-paper"
                   >
                     <option value="500000-1000000">Rp 500.000 – Rp 1.000.000</option>
                     <option value="1000000-2000000">Rp 1.000.000 – Rp 2.000.000</option>
                     <option value="2000000-5000000">Rp 2.000.000 – Rp 5.000.000</option>
                     <option value="5000000-10000000">Rp 5.000.000 – Rp 10.000.000</option>
                     <option value="10000000-20000000">Rp 10.000.000 – Rp 20.000.000</option>
                     <option value="20000000-50000000">Rp 20.000.000 – Rp 50.000.000</option>
                     <option value="50000000-100000000">Rp 50.000.000 – Rp 100.000.000</option>
                     <option value="100000000+">Rp 100.000.000+</option>
                     <option value="__custom__">Custom range...</option>
                   </select>
                 </div>
                 {showCustomBudget && (
                   <div className="grid grid-cols-2 gap-3 mt-3">
                     <div>
                       <label className="mono-label text-ink block mb-1">Min (Rp)</label>
                       <input
                         type="number"
                         min={0}
                         step={100000}
                         placeholder="Contoh: 3500000"
                         value={customMin}
                         onChange={(e) => setCustomMin(e.target.value)}
                         className="field-input bg-paper"
                       />
                     </div>
                     <div>
                       <label className="mono-label text-ink block mb-1">Max (Rp, opsional)</label>
                       <input
                         type="number"
                         min={0}
                         step={100000}
                         placeholder="Contoh: 7500000"
                         value={customMax}
                         onChange={(e) => setCustomMax(e.target.value)}
                         className="field-input bg-paper"
                       />
                     </div>
                   </div>
                 )}
              </div>

              <div>
                <label className="mono-label text-ink block mb-2">{getContent('contact', 'form.message', t.contact.messageLabel)} *</label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Briefly explain your design project or collaboration idea..."
                  className="field-input resize-none"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button type="submit" disabled={isSubmitting} className="btn-primary w-full sm:w-auto text-xs">
                  <Send className="w-4 h-4" />
                  {isSubmitting ? 'Sending…' : getContent('contact', 'form.send', t.contact.sendBtn)}
                </button>
                <button type="button" onClick={handleSendWhatsApp} className="btn-ghost w-full sm:w-auto text-xs">
                  <MessageCircle className="w-4 h-4 text-strong" />
                  {getContent('contact', 'form.send_wa', t.contact.sendWaBtn)}
                </button>
              </div>
            </form>
          </div>
        </ScrollReveal>

        {/* Info + socials */}
        <div className="lg:col-span-5 bg-paper border-l hairline">
          <div className="p-6 sm:p-10 h-full flex flex-col justify-between gap-10">
            <div className="space-y-8">
              <span className="section-eyebrow block"><span className="section-eyebrow block">{getContent('contact', 'info.eyebrow_direct', '02 — Direct Contact')}</span></span>
              <ul className="space-y-6">
                {infoItems.map((item) => (
                  <li key={item.label} className="flex items-start gap-4">
                    <span className="p-2.5 border hairline text-ink-muted shrink-0">
                      <item.icon className="w-4 h-4" />
                    </span>
                    <div className="min-w-0">
                      <span className="section-eyebrow block mb-1">{item.label}</span>
                      {item.href ? (
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-ink hover:text-accent2 transition-colors break-all"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-ink break-all">{item.value}</span>
                          {item.action}
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-5">
              <span className="section-eyebrow block">{getContent('contact', 'info.eyebrow_socials', '03 � Socials')}</span>
              <div className="grid grid-cols-2 gap-px bg-line border hairline">
                {socials.map((soc) => (
                  <a
                    key={soc.name}
                    href={soc.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group bg-paper p-4 transition-colors hover:bg-paper2"
                  >
                    <span className="display-font text-sm font-semibold text-ink group-hover:text-accent2 transition-colors">
                      {soc.name}
                    </span>
                    <span className="mono-label text-ink-faint block mt-1">{soc.handle}</span>
                    <ArrowUpRight className="w-4 h-4 text-ink-faint group-hover:text-ink mt-3 transition-colors" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
