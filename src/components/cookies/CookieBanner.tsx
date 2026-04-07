'use client';
import { useState, useEffect } from 'react';

declare global {
  interface Window {
    dataLayer: any[];
  }
}

interface Props {
  t: {
    text: string;
    accept: string;
    reject: string;
    manage: string;
  };
}

export default function CookieBanner({ t }: Props) {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Revisar si ya hay consentimiento guardado
    const savedConsent = localStorage.getItem('cnv_cookie_consent');
    
    if (!savedConsent) {
      // Si no hay, mostramos el banner
      setShowBanner(true);
    } else {
      // Si ya hay, leemos qué decidió
      const consentData = JSON.parse(savedConsent);
      if (consentData.analytics) {
        injectGoogleAnalytics();
      }
    }
  }, []);

  const injectGoogleAnalytics = () => {
    const gaId = import.meta.env.PUBLIC_GA_ID;
    if (!gaId || window.dataLayer) return; // Evitar inyecciones dobles

    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    script.async = true;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag(...args: any[]) {
      window.dataLayer.push(args);
    }
    gtag('js', new Date());
    gtag('config', gaId);
  };

  const handleConsent = (acceptAnalytics: boolean) => {
    // Log de auditoría estricto en localStorage
    const consentData = {
      analytics: acceptAnalytics,
      timestamp: new Date().toISOString(),
      version: '1.0'
    };
    
    localStorage.setItem('cnv_cookie_consent', JSON.stringify(consentData));
    
    if (acceptAnalytics) {
      injectGoogleAnalytics();
    }
    
    setShowBanner(false);
  };

  if (!showBanner) {
    return (
      <button 
        onClick={() => setShowBanner(true)}
        className="fixed bottom-4 left-4 z-50 p-3 bg-cnv-core text-white rounded-full shadow-lg hover:scale-110 transition-transform group"
        aria-label={t.manage}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <circle cx="12" cy="12" r="3"></circle>
          <line x1="12" y1="2" x2="12" y2="4"></line>
          <line x1="12" y1="20" x2="12" y2="22"></line>
          <line x1="2" y1="12" x2="4" y2="12"></line>
          <line x1="20" y1="12" x2="22" y2="12"></line>
        </svg>
        <span className="absolute left-full ml-3 px-2 py-1 bg-gray-900 text-xs text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          {t.manage}
        </span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 w-full z-50 p-4 md:p-6 animate-fade-up">
      <div className="max-w-4xl mx-auto bg-white border border-gray-200 shadow-2xl p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start md:items-center">
        
        <div className="flex-1">
          <p className="text-sm md:text-base text-gray-700 leading-relaxed font-500">
            {t.text}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto flex-shrink-0">
          <button 
            onClick={() => handleConsent(false)}
            className="px-6 py-3 border-2 border-gray-200 text-gray-600 font-700 text-sm hover:bg-gray-50 transition-colors whitespace-nowrap"
          >
            {t.reject}
          </button>
          <button 
            onClick={() => handleConsent(true)}
            className="px-6 py-3 bg-cnv-core text-white font-800 text-sm hover:bg-cnv-core-alt transition-colors shadow-md hover:shadow-lg whitespace-nowrap"
          >
            {t.accept}
          </button>
        </div>

      </div>
    </div>
  );
}