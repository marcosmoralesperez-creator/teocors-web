import { RefreshCcw, ShieldCheck, Truck } from 'lucide-react';

import { Reveal } from '@/components/common/reveal';
import { formatPrice } from '@/data/products';
import { FREE_SHIPPING } from '@/data/site';

const benefits = [
  { icon: Truck, title: 'Envíos a todo el país', text: `Gratis desde ${formatPrice(FREE_SHIPPING)}. Llega en 2 a 5 días hábiles.` },
  { icon: RefreshCcw, title: 'Cambios en 30 días', text: '¿No te quedó? Cambias la talla sin costo.' },
  { icon: ShieldCheck, title: 'Pago seguro', text: 'Paga con tarjeta, PSE o Nequi.' },
];

export function Benefits() {
  return (
    <section id="ayuda" aria-label="Beneficios de comprar en TEOCORS" className="border-y bg-elevated">
      <ul className="shell grid md:grid-cols-3">
        {benefits.map(({ icon: Icon, title, text }, i) => (
          <li
            key={title}
            className="border-t first:border-t-0 md:border-t-0 md:border-l md:px-8 md:first:border-l-0 md:first:pl-0"
          >
            <Reveal delay={i * 0.08} className="flex gap-[18px] py-7 md:py-10">
              <Icon aria-hidden="true" strokeWidth={1.5} className="size-7 flex-none text-gold" />
              <div>
                <h3 className="mb-1 text-[15px] font-semibold">{title}</h3>
                <p className="text-sm text-muted-foreground">{text}</p>
              </div>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
