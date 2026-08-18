import { useEffect, useMemo, useRef, useState } from 'react';
import {
  PRODUCTOS,
  PRODUCTOS_BY_ID,
  basePrice,
  ivaAmount,
  totalPrice,
  formatCOP,
  priceUSD,
  type Producto,
} from '../../data/nutraceuticos';

type StoreStrings = Record<string, string>;

interface Props {
  t: StoreStrings;
  lang: string;
  usdRate: number;
  paypalClientId?: string;
  whatsappPhone?: string; // sin "+", formato wa.me (ej. 573216428280)
}

type Cart = Record<string, number>;

const pad = (n: number) => String(n).padStart(2, '0');
const CART_KEY = 'cnv_cart_v1';

export default function StoreApp({ t, lang, usdRate, paypalClientId, whatsappPhone }: Props) {
  const [cart, setCart] = useState<Cart>({});
  const [open, setOpen] = useState(false);
  const [checkout, setCheckout] = useState(false);
  const [customer, setCustomer] = useState({ name: '', email: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [justAdded, setJustAdded] = useState<string | null>(null);
  const paypalRef = useRef<HTMLDivElement>(null);

  // ---- persistencia en localStorage ----
  useEffect(() => {
    try {
      const raw = localStorage.getItem(CART_KEY);
      if (raw) setCart(JSON.parse(raw));
    } catch {}
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch {}
  }, [cart]);

  const lines = useMemo(
    () =>
      Object.entries(cart)
        .filter(([, q]) => q > 0)
        .map(([id, qty]) => ({ p: PRODUCTOS_BY_ID[id], qty }))
        .filter((l) => l.p),
    [cart],
  );

  const count = lines.reduce((s, l) => s + l.qty, 0);
  const subtotal = lines.reduce((s, l) => s + basePrice(l.p) * l.qty, 0);
  const iva = lines.reduce((s, l) => s + ivaAmount(l.p) * l.qty, 0);
  const total = subtotal + iva;
  const totalUsd = Math.round((total / usdRate) * 100) / 100;

  const add = (id: string) => {
    setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }));
    setJustAdded(id);
    setTimeout(() => setJustAdded((v) => (v === id ? null : v)), 1200);
  };
  const setQty = (id: string, qty: number) =>
    setCart((c) => ({ ...c, [id]: Math.max(0, Math.min(99, qty)) }));
  const remove = (id: string) =>
    setCart((c) => {
      const n = { ...c };
      delete n[id];
      return n;
    });

  // ---- Wompi (Colombia) ----
  const payWompi = async () => {
    setError('');
    if (!customer.name.trim() || !customer.email.trim()) {
      setError(t.error_form);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/checkout-wompi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: lines.map((l) => ({ id: l.p.id, qty: l.qty })),
          customer,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.checkoutUrl) throw new Error(data.message || 'error');
      window.location.href = data.checkoutUrl;
    } catch (e) {
      setError(t.error_generic);
      setLoading(false);
    }
  };

  // ---- WhatsApp ----
  const waHref = useMemo(() => {
    if (!whatsappPhone) return '';
    const detail = lines
      .map((l) => `• ${l.qty} × ${l.p.n} (${formatCOP(totalPrice(l.p))})`)
      .join('%0A');
    const msg =
      lang === 'es'
        ? `Hola CNV, quiero pedir estos nutracéuticos VITACELLEBIS:%0A${detail}%0A%0ATotal: ${formatCOP(total)} (IVA incl.)`
        : `Hi CNV, I'd like to order these VITACELLEBIS nutraceuticals:%0A${detail}%0A%0ATotal: ${formatCOP(total)} (VAT incl.)`;
    return `https://wa.me/${whatsappPhone}?text=${msg}`;
  }, [lines, total, whatsappPhone, lang]);

  // ---- PayPal (internacional, USD, integración cliente) ----
  useEffect(() => {
    if (!checkout || !paypalClientId || total <= 0 || !paypalRef.current) return;
    let cancelled = false;
    const container = paypalRef.current;
    container.innerHTML = '';

    const render = () => {
      const paypal = (window as any).paypal;
      if (cancelled || !paypal || !container) return;
      paypal
        .Buttons({
          style: { layout: 'horizontal', color: 'gold', shape: 'pill', height: 45, tagline: false },
          createOrder: (_: unknown, actions: any) =>
            actions.order.create({
              purchase_units: [
                {
                  amount: { value: totalUsd.toFixed(2), currency_code: 'USD' },
                  description: 'VITACELLEBIS nutraceuticals — CNV',
                },
              ],
            }),
          onApprove: (_: unknown, actions: any) =>
            actions.order.capture().then(() => {
              localStorage.removeItem(CART_KEY);
              window.location.href = '/tienda/gracias';
            }),
          onError: () => setError(t.error_generic),
        })
        .render(container);
    };

    if ((window as any).paypal) {
      render();
    } else if (!document.getElementById('paypal-sdk')) {
      const s = document.createElement('script');
      s.id = 'paypal-sdk';
      s.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(
        paypalClientId,
      )}&currency=USD&components=buttons`;
      s.onload = render;
      document.body.appendChild(s);
    } else {
      document.getElementById('paypal-sdk')?.addEventListener('load', render);
    }
    return () => {
      cancelled = true;
    };
  }, [checkout, paypalClientId, total, totalUsd, lang, t.error_generic]);

  const liquidos = PRODUCTOS.filter((p) => p.linea === 'liquida');
  const polvos = PRODUCTOS.filter((p) => p.linea === 'polvo');

  return (
    <div className="relative">
      {/* Botón flotante del carrito */}
      <button
        onClick={() => {
          setOpen(true);
          setCheckout(false);
        }}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-cnv-core px-5 py-3.5 text-sm font-700 text-white shadow-xl transition-transform hover:scale-105"
        aria-label={t.cart_open}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
        </svg>
        {t.cart_open}
        {count > 0 && (
          <span className="ml-1 flex h-6 min-w-6 items-center justify-center rounded-full bg-cnv-generate px-1.5 text-xs font-800">
            {count}
          </span>
        )}
      </button>

      {/* CATÁLOGO */}
      <ProductGroup title={t.line_liquida} items={liquidos} t={t} add={add} justAdded={justAdded} lang={lang} />
      <ProductGroup title={t.line_polvo} items={polvos} t={t} add={add} justAdded={justAdded} lang={lang} />

      <p className="mx-auto mt-12 max-w-3xl text-center text-xs leading-relaxed text-cnv-core/45">{t.disclaimer}</p>

      {/* DRAWER / CARRITO */}
      {open && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-cnv-core/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <aside className="relative flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
            <header className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <h3 className="text-lg font-800 text-cnv-core">{checkout ? t.customer_title : t.cart_title}</h3>
              <button onClick={() => setOpen(false)} className="text-2xl leading-none text-cnv-core/40 hover:text-cnv-core">×</button>
            </header>

            <div className="flex-1 overflow-y-auto px-6 py-5">
              {lines.length === 0 ? (
                <p className="py-16 text-center text-sm text-cnv-core/50">{t.cart_empty}</p>
              ) : (
                <ul className="flex flex-col gap-4">
                  {lines.map((l) => (
                    <li key={l.p.id} className="flex gap-3 border-b border-slate-50 pb-4">
                      <img
                        src={`/images/vitacellebis/bottle_${pad(l.p.img)}.jpg`}
                        alt={l.p.n}
                        className="h-16 w-16 flex-shrink-0 rounded-lg bg-slate-50 object-contain"
                        onError={(e) => ((e.target as HTMLImageElement).style.visibility = 'hidden')}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-700 text-cnv-core">{l.p.n}</p>
                        <p className="text-xs text-cnv-core/50">{formatCOP(totalPrice(l.p))} {t.unit}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <div className="flex items-center rounded-lg border border-slate-200">
                            <button className="px-2.5 py-1 text-cnv-core/60 hover:text-cnv-core" onClick={() => setQty(l.p.id, l.qty - 1)}>−</button>
                            <span className="w-8 text-center text-sm font-700 text-cnv-core">{l.qty}</span>
                            <button className="px-2.5 py-1 text-cnv-core/60 hover:text-cnv-core" onClick={() => setQty(l.p.id, l.qty + 1)}>+</button>
                          </div>
                          <button className="text-xs text-cnv-core/40 hover:text-red-500" onClick={() => remove(l.p.id)}>{t.remove}</button>
                        </div>
                      </div>
                      <div className="text-right text-sm font-800 text-cnv-core">{formatCOP(totalPrice(l.p) * l.qty)}</div>
                    </li>
                  ))}
                </ul>
              )}

              {checkout && lines.length > 0 && (
                <div className="mt-6 flex flex-col gap-3">
                  <input className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-cnv-execute focus:outline-none" placeholder={t.form_name} value={customer.name} onChange={(e) => setCustomer({ ...customer, name: e.target.value })} />
                  <input type="email" className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-cnv-execute focus:outline-none" placeholder={t.form_email} value={customer.email} onChange={(e) => setCustomer({ ...customer, email: e.target.value })} />
                  <input className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-cnv-execute focus:outline-none" placeholder={t.form_phone} value={customer.phone} onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} />
                </div>
              )}
            </div>

            {lines.length > 0 && (
              <footer className="border-t border-slate-100 px-6 py-5">
                <div className="mb-3 flex flex-col gap-1 text-sm">
                  <div className="flex justify-between text-cnv-core/60"><span>{t.subtotal}</span><span>{formatCOP(subtotal)}</span></div>
                  <div className="flex justify-between text-cnv-core/60"><span>{t.iva}</span><span>{formatCOP(iva)}</span></div>
                  <div className="flex justify-between text-base font-800 text-cnv-core"><span>{t.total}</span><span>{formatCOP(total)}</span></div>
                </div>

                {error && <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">{error}</p>}

                {!checkout ? (
                  <div className="flex flex-col gap-2">
                    <button className="btn-primary w-full justify-center" onClick={() => { setError(''); setCheckout(true); }}>{t.checkout}</button>
                    <button className="text-center text-xs text-cnv-core/50 hover:text-cnv-core" onClick={() => setOpen(false)}>{t.keep_shopping}</button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    <div>
                      <p className="mb-1 text-xs font-700 uppercase tracking-wide text-cnv-core/70">{t.pay_co_title}</p>
                      <p className="mb-2 text-xs text-cnv-core/50">{t.pay_co_desc}</p>
                      <button className="btn-primary w-full justify-center" onClick={payWompi} disabled={loading}>
                        {loading ? t.processing : t.pay_co_btn}
                      </button>
                    </div>

                    {paypalClientId && (
                      <div>
                        <p className="mb-1 text-xs font-700 uppercase tracking-wide text-cnv-core/70">{t.pay_intl_title}</p>
                        <p className="mb-2 text-xs text-cnv-core/50">{t.pay_intl_desc} · ${totalUsd.toFixed(2)} USD</p>
                        <div ref={paypalRef} />
                      </div>
                    )}

                    {whatsappPhone && (
                      <div className="border-t border-slate-100 pt-3">
                        <p className="mb-2 text-xs text-cnv-core/50">{t.pay_wa_title}</p>
                        <a href={waHref} target="_blank" rel="noopener" className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-cnv-generate px-4 py-2.5 text-sm font-700 text-cnv-generate transition-colors hover:bg-cnv-generate hover:text-white">
                          {t.pay_wa_btn}
                        </a>
                      </div>
                    )}

                    <p className="text-center text-[11px] text-cnv-core/40">{t.secure_note}</p>
                    <button className="text-center text-xs text-cnv-core/50 hover:text-cnv-core" onClick={() => setCheckout(false)}>← {t.cart_title}</button>
                  </div>
                )}
              </footer>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}

function ProductGroup({
  title, items, t, add, justAdded, lang,
}: {
  title: string; items: Producto[]; t: StoreStrings; add: (id: string) => void; justAdded: string | null; lang: string;
}) {
  return (
    <section className="mb-16">
      <h2 className="mb-8 flex items-center gap-3 text-sm font-800 uppercase tracking-[0.15em] text-cnv-core">
        <span className="h-px w-8 bg-cnv-generate" />{title}
      </h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((p) => (
          <article key={p.id} className="group flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white transition-shadow hover:shadow-xl">
            <div className="relative flex aspect-square items-center justify-center bg-gradient-to-b from-slate-50 to-white p-6">
              <span className="absolute left-3 top-3 rounded-full bg-cnv-core/5 px-2.5 py-1 text-[10px] font-700 text-cnv-core/60">{p.invima}</span>
              <img
                src={`/images/vitacellebis/bottle_${pad(p.img)}.jpg`}
                alt={p.n}
                loading="lazy"
                className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
              />
            </div>
            <div className="flex flex-1 flex-col p-5">
              <h3 className="text-base font-800 text-cnv-core">{p.n}</h3>
              <p className="mt-1 text-xs font-600 text-cnv-generate">{p.eje}</p>
              <p className="mt-2 flex-1 text-xs leading-relaxed text-cnv-core/55">{p.variedad}</p>
              <p className="mt-3 text-[11px] text-cnv-core/40">{p.forma}</p>
              <div className="mt-4 flex items-end justify-between">
                <div>
                  <p className="text-xl font-800 text-cnv-core">{formatCOP(totalPrice(p))}</p>
                  <p className="text-[11px] text-cnv-core/40">{t.price_iva_note}</p>
                </div>
                <button
                  onClick={() => add(p.id)}
                  className="rounded-full bg-cnv-core px-4 py-2 text-xs font-700 text-white transition-colors hover:bg-cnv-execute"
                >
                  {justAdded === p.id ? t.added : t.add}
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
