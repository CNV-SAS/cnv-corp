export const prerender = false;
import type { APIRoute } from 'astro';
import crypto from 'node:crypto';
import { PRODUCTOS_BY_ID, totalPrice, type Producto } from '../../data/nutraceuticos';

// Llaves de Wompi (configúralas en Vercel → Settings → Environment Variables).
// La PÚBLICA puede ir en el navegador; el SECRETO DE INTEGRIDAD nunca sale del servidor.
// `process.env` (ejecución) y no `import.meta.env` (compilación): con el segundo
// el valor se hornea en el build y un despliegue puede nacer con la llave en
// `undefined` aunque la variable exista en Vercel. Ver ia-diagnostico.ts.
const WOMPI_PUBLIC_KEY = process.env.WOMPI_PUBLIC_KEY;
const WOMPI_INTEGRITY_SECRET = process.env.WOMPI_INTEGRITY_SECRET;

// URL del Checkout Web de Wompi (producción). Para pruebas se usa la misma con llaves de sandbox.
const WOMPI_CHECKOUT_URL = 'https://checkout.wompi.co/p/';

const SITE_URL = import.meta.env.PUBLIC_SITE_URL || 'https://cnvsystem.com';

interface CartLine {
  id: string;
  qty: number;
}

/** Genera una referencia única e irrepetible por orden. */
function makeReference(): string {
  return `CNV-${Date.now()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    if (!WOMPI_PUBLIC_KEY || !WOMPI_INTEGRITY_SECRET) {
      return new Response(
        JSON.stringify({ error: 'wompi_not_configured', message: 'La pasarela de pagos aún no está configurada. Falta WOMPI_PUBLIC_KEY / WOMPI_INTEGRITY_SECRET.' }),
        { status: 503, headers: { 'Content-Type': 'application/json' } },
      );
    }

    const body = await request.json();
    const items: CartLine[] = Array.isArray(body?.items) ? body.items : [];
    const customer = body?.customer ?? {};

    if (items.length === 0) {
      return new Response(JSON.stringify({ error: 'empty_cart' }), { status: 400 });
    }

    // 🔒 El precio SIEMPRE se recalcula en el servidor desde el catálogo canónico.
    let totalCOP = 0;
    for (const line of items) {
      const p: Producto | undefined = PRODUCTOS_BY_ID[line.id];
      const qty = Math.max(1, Math.min(99, Math.floor(Number(line.qty) || 0)));
      if (!p) {
        return new Response(JSON.stringify({ error: 'unknown_product', id: line.id }), { status: 400 });
      }
      totalCOP += totalPrice(p) * qty;
    }

    if (totalCOP <= 0) {
      return new Response(JSON.stringify({ error: 'invalid_total' }), { status: 400 });
    }

    const amountInCents = totalCOP * 100;
    const currency = 'COP';
    const reference = makeReference();

    // Firma de integridad Wompi: SHA256("<referencia><monto><moneda><secreto>")
    const signature = crypto
      .createHash('sha256')
      .update(`${reference}${amountInCents}${currency}${WOMPI_INTEGRITY_SECRET}`)
      .digest('hex');

    const params = new URLSearchParams({
      'public-key': WOMPI_PUBLIC_KEY,
      currency,
      'amount-in-cents': String(amountInCents),
      reference,
      'signature:integrity': signature,
      'redirect-url': `${SITE_URL}/tienda/gracias`,
    });

    // Prellenamos los datos del cliente si el navegador los envió (opcional para Wompi).
    if (customer.email) params.set('customer-data:email', String(customer.email).slice(0, 120));
    if (customer.name) params.set('customer-data:full-name', String(customer.name).slice(0, 120));
    if (customer.phone) params.set('customer-data:phone-number', String(customer.phone).slice(0, 30));

    const checkoutUrl = `${WOMPI_CHECKOUT_URL}?${params.toString()}`;

    return new Response(
      JSON.stringify({ checkoutUrl, reference, amountInCents, totalCOP }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  } catch (err) {
    console.error('checkout-wompi error:', err);
    return new Response(JSON.stringify({ error: 'internal_error' }), { status: 500 });
  }
};
