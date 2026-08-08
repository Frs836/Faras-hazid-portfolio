import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ScrollReveal } from '../ui/ScrollReveal';
import { Send, MessageCircle, Mail, Phone, MapPin, Clock, Copy, Check, ArrowUpRight } from 'lucide-react';
import { submitContactInquiry } from '../../services/apiService';

const EMAIL = 'farashazid836@gmail.com';
const WA_NUMBER = '6285143541287';

export const ContactPage: React.FC = () => {
  const { t, addMessage, addToast, getContent } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    serviceInterest: 'UI/UX & Mobile App Design',
    budget: '$500 - $1,500',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
        projectType: formData.serviceInterest,
        budget: formData.budget,
        message: formData.message,
      });
      addToast('Pesan Terkirim!', 'Terima kasih! Pesan Anda telah berhasil disampaikan kepada Faras Hazid.', 'success');
    } catch {
      addToast('Message Sent!', 'Thank you! Your message has been received.', 'success');
    } finally {
      setIsSubmitting(false);
      setFormData({ name: '', email: '', serviceInterest: 'UI/UX & Mobile App Design', budget: '$500 - $1,500', message: '' });
    }
  };

  const handleSendWhatsApp = () => {
    if (!formData.name || !formData.message) {
      addToast('Validation Error', 'Please enter your Name and Message to generate WhatsApp link.', 'warning');
      return;
    }
    const text = encodeURIComponent(
      `Halo Faras Hazid!\n\nNama: ${formData.name}\nEmail: ${formData.email}\nLayanan: ${formData.serviceInterest}\nBudget: ${formData.budget}\n\nPesan:\n${formData.message}`
    );
    window.open(`https://wa.me/${WA_NUMBER}?text=${text}`, '_blank');
    addToast('WhatsApp Chat Opened', 'Redirecting to Faras Hazid on WhatsApp.', 'info');
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(EMAIL);
    setCopiedEmail(true);
    addToast('Email Copied', `Copied ${EMAIL} to clipboard!`, 'success');
    setTimeout(() => setCopiedEmail(false), 3000);
  };

  const infoItems = [
    {
      icon: Mail,
      label: 'Email',
      value: EMAIL,
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
    { icon: Phone, label: 'WhatsApp / Phone', value: '+62 851 4354 1287', href: `https://wa.me/${WA_NUMBER}` },
    { icon: MapPin, label: 'Location', value: 'Indonesia (UTC+7)' },
    { icon: Clock, label: 'Working Hours', value: 'Mon - Sat: 08:00 - 18:00 WIB' },
  ];

  const socials = [
    { name: 'Dribbble', handle: 'Faras Hazid', url: 'https://dribbble.com' },
    { name: 'Behance', handle: 'Faras Hazid', url: 'https://behance.net' },
    { name: 'LinkedIn', handle: 'Faras Hazid', url: 'https://linkedin.com' },
    { name: 'Instagram', handle: '@faras.hazid', url: 'https://instagram.com' },
  ];

  return (
    <div className="space-y-16 py-6 pb-12">
      {/* Header */}
      <section className="pt-8 space-y-5">
        <ScrollReveal duration={0.6}>
          <span className="section-eyebrow block mb-3">Contact</span>
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
            <span className="section-eyebrow block mb-6">01 — {t.contact.formTitle}</span>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="mono-label text-ink block mb-2">{t.contact.nameLabel} *</label>
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
                  <label className="mono-label text-ink block mb-2">{t.contact.emailLabel} *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="alex@company.com"
                    className="field-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="mono-label text-ink block mb-2">{t.contact.serviceLabel}</label>
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
                  <label className="mono-label text-ink block mb-2">{t.contact.budgetLabel}</label>
                  <select
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="field-input bg-paper"
                  >
                    <option>Rp 1.000.000 - Rp 3.000.000</option>
                    <option>Rp 3.000.000 - Rp 7.000.000</option>
                    <option>Rp 7.000.000 - Rp 15.000.000</option>
                    <option>Rp 15.000.000+</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mono-label text-ink block mb-2">{t.contact.messageLabel} *</label>
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
                  {isSubmitting ? 'Sending…' : t.contact.sendBtn}
                </button>
                <button type="button" onClick={handleSendWhatsApp} className="btn-ghost w-full sm:w-auto text-xs">
                  <MessageCircle className="w-4 h-4 text-strong" />
                  {t.contact.sendWaBtn}
                </button>
              </div>
            </form>
          </div>
        </ScrollReveal>

        {/* Info + socials */}
        <div className="lg:col-span-5 bg-paper border-l hairline">
          <div className="p-6 sm:p-10 h-full flex flex-col justify-between gap-10">
            <div className="space-y-8">
              <span className="section-eyebrow block">02 — {t.contact.directContact}</span>
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
              <span className="section-eyebrow block">{t.contact.socials}</span>
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
