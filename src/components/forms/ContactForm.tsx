'use client';
import { useState } from 'react';

interface FormTranslations {
  profile_label: string;
  profile_options: readonly string[];
  name: string;
  email: string;
  profession: string;
  institution: string;
  country: string;
  message: string;
  message_institution: string;
  message_patient: string;
  submit: string;
  sending: string;
  response_time: string;
  success: string;
  success_subtitle: string;
  error: string;
}

interface ExclusivityTranslations {
  tag: string;
  title: string;
  subtitle: string;
  requirements: readonly string[];
}

interface Props {
  t: FormTranslations;
  exclusivity: ExclusivityTranslations;
  lang: string;
}

// Mapa de configuración para integrar Tailwind nativo según el perfil
const PROFILES_CONFIG = [
  { icon: '⚕', text: 'text-cnv-execute', border: 'border-cnv-execute', bg: 'bg-cnv-execute/10', focus: 'focus:border-cnv-execute focus:ring-1 focus:ring-cnv-execute' }, // Profesional
  { icon: '🏛', text: 'text-cnv-bio', border: 'border-cnv-bio', bg: 'bg-cnv-bio/10', focus: 'focus:border-cnv-bio focus:ring-1 focus:ring-cnv-bio' }, // Institución
  { icon: '🧬', text: 'text-cnv-generate', border: 'border-cnv-generate', bg: 'bg-cnv-generate/10', focus: 'focus:border-cnv-generate focus:ring-1 focus:ring-cnv-generate' }, // Paciente
];

export default function ContactForm({ t, exclusivity, lang }: Props) {
  const [profile, setProfile] = useState<0 | 1 | 2>(0);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    profession: '',
    institution: '',
    country: '',
    message: '',
  });

  const profileLabels = t.profile_options;
  const activeConf = PROFILES_CONFIG[profile];

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, profile: profileLabels[profile], lang }),
      });

      if (res.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  const messageLabel = profile === 0 ? t.message : profile === 1 ? t.message_institution : t.message_patient;

  // Clases base para todos los inputs usando Tailwind
  const inputClasses = `w-full border-2 border-cnv-core/10 px-4 py-3 text-sm font-600 text-cnv-core outline-none transition-colors bg-white ${activeConf.focus}`;

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6 bg-cnv-generate/10 border-2 border-cnv-generate">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path d="M5 14l7 7 11-13" stroke="currentColor" className="text-cnv-generate" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h3 className="text-xl font-800 text-cnv-core mb-3">
          {t.success}
        </h3>
        <p className="text-sm text-cnv-core/50 font-600">
          {t.success_subtitle}
        </p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Profile selector */}
      <div className="mb-10">
        <p className="text-xs font-700 tracking-[0.2em] uppercase text-cnv-core/40 mb-4">
          {t.profile_label}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {profileLabels.map((label, i) => {
            const conf = PROFILES_CONFIG[i];
            const isActive = profile === i;
            return (
              <button
                key={i}
                type="button"
                onClick={() => setProfile(i as 0 | 1 | 2)}
                className={`flex items-center gap-3 p-4 border-2 text-left transition-all duration-300 text-sm font-700 ${
                  isActive 
                    ? `${conf.border} ${conf.bg} ${conf.text}` 
                    : 'border-cnv-core/10 text-cnv-core hover:bg-slate-50 hover:border-cnv-core/30'
                }`}
              >
                <span className="text-xl">{conf.icon}</span>
                <span>{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Exclusivity box for professionals */}
      {profile === 0 && (
        <div className="mb-10 p-6 border-l-4 border-cnv-execute bg-cnv-execute/5 animate-fade-in">
          <p className="text-xs font-700 tracking-[0.2em] uppercase text-cnv-execute mb-3">
            {exclusivity.tag}
          </p>
          <p className="text-sm font-700 text-cnv-core mb-4">
            {exclusivity.subtitle}
          </p>
          <div className="flex flex-col gap-2">
            {exclusivity.requirements.map((req, i) => (
              <div key={i} className="flex items-start gap-3 text-sm font-500 text-cnv-core/80">
                <svg className="flex-shrink-0 mt-0.5 text-cnv-execute" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M4.5 8l2.5 2.5 4.5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>{req}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-700 tracking-[0.1em] uppercase text-cnv-core/50 mb-2">
              {t.name} *
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className={inputClasses}
            />
          </div>
          <div>
            <label className="block text-xs font-700 tracking-[0.1em] uppercase text-cnv-core/50 mb-2">
              {t.email} *
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className={inputClasses}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {profile === 0 && (
            <div className="animate-fade-in">
              <label className="block text-xs font-700 tracking-[0.1em] uppercase text-cnv-core/50 mb-2">
                {t.profession}
              </label>
              <input
                type="text"
                name="profession"
                value={formData.profession}
                onChange={handleChange}
                className={inputClasses}
              />
            </div>
          )}
          {profile === 1 && (
            <div className="animate-fade-in">
              <label className="block text-xs font-700 tracking-[0.1em] uppercase text-cnv-core/50 mb-2">
                {t.institution}
              </label>
              <input
                type="text"
                name="institution"
                value={formData.institution}
                onChange={handleChange}
                className={inputClasses}
              />
            </div>
          )}
          <div>
            <label className="block text-xs font-700 tracking-[0.1em] uppercase text-cnv-core/50 mb-2">
              {t.country}
            </label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className={inputClasses}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-700 tracking-[0.1em] uppercase text-cnv-core/50 mb-2">
            {messageLabel}
          </label>
          <textarea
            name="message"
            rows={4}
            value={formData.message}
            onChange={handleChange}
            className={`${inputClasses} resize-none`}
          />
        </div>

        {status === 'error' && (
          <p className="text-sm font-700 text-red-600 bg-red-50 p-3 border-l-2 border-red-600">{t.error}</p>
        )}

        <div className="flex items-center justify-between mt-4">
          <button
            type="submit"
            disabled={status === 'loading'}
            className={`inline-flex items-center gap-2 px-8 py-4 text-sm font-800 tracking-wide text-white transition-all duration-300 ${
              status === 'loading' 
                ? 'bg-cnv-core/50 cursor-not-allowed' 
                : 'bg-cnv-core hover:bg-cnv-core-alt cursor-pointer hover:shadow-lg hover:-translate-y-0.5'
            }`}
          >
            {status === 'loading' ? (
              <>
                <svg className="animate-spin" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="6" stroke="currentColor" strokeOpacity="0.3" strokeWidth="2"/>
                  <path d="M8 2a6 6 0 016 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                {t.sending}
              </>
            ) : (
              <>
                {t.submit}
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </>
            )}
          </button>
          <p className="text-xs font-700 text-cnv-core/30 uppercase tracking-widest">
            {t.response_time}
          </p>
        </div>
      </form>
    </div>
  );
}