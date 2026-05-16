# Connected Nutrition Ventures (CNV) — Plataforma Web principal y Ecosistema de salud

Repositorio oficial del sitio web principal y capa de presentación del ecosistema **Connected Nutrition Ventures (CNV)**. Este proyecto sirve como la puerta de entrada a la plataforma tecnológica ATLAS y al modelo de atención preventivo ANI-BIS-E.

## 🧬 Sobre el Proyecto

CNV no es un prestador directo de servicios de salud, sino el operador y orquestador de un ecosistema clínico-científico con enfoque preventivo, funcional y longitudinal. Este sitio web está diseñado con arquitectura de alto rendimiento, seguridad de grado corporativo e internacionalización (i18n) nativa.

### 🚀 Stack Tecnológico (Core)

- **Framework:** [Astro](https://astro.build/) (Static Site Generation para máximo rendimiento).
- **UI & Interacciones:** [React](https://reactjs.org/) (Componentes aislados).
- **Estilos:** [Tailwind CSS v4](https://tailwindcss.com/).
- **Seguridad (Anti-Bot):** [Cloudflare Turnstile](https://www.cloudflare.com/products/turnstile/).
- **Infraestructura de Correo:** [Resend](https://resend.com/).
- **Analítica:** Google Analytics 4 (Con inyección condicional para cumplimiento de Ley 1581/GDPR).
- **Despliegue:** Vercel + Cloudflare (Edge Network).

## ⚙️ Variables de Entorno (.env)

Para ejecutar este proyecto en local, necesitas configurar las siguientes variables de entorno. Solicita las credenciales al administrador de infraestructura.

```env
RESEND_API_KEY=re_...
CONTACT_EMAIL=correo@ejemplo.com

PUBLIC_TURNSTILE_SITE_KEY=0x...
TURNSTILE_SECRET_KEY=0x...

PUBLIC_GA_ID=G-...
