import { useEffect, useState } from 'react';
import { Menu, ShoppingBag, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useCart } from '@/lib/cart';
import { whatsappLink } from '@/lib/site';
import { Monogram } from '@/components/brand-icons';
import { cn } from '@/lib/utils';

const links = [
  { href: '#coleccion', label: 'Colección' },
  { href: '#a-medida', label: 'A medida' },
  { href: '#oro-18k', label: 'Oro 18k' },
  { href: '#cuidado', label: 'Garantía' },
];

export function Header() {
  const { count, setOpen } = useCart();
  const [solid, setSolid] = useState(false);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menu ? 'hidden' : '';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenu(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menu]);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-40 transition-[background-color,box-shadow,backdrop-filter] duration-500',
        solid ? 'bg-ivory/90 shadow-[0_1px_0_var(--color-border)] backdrop-blur-md' : 'bg-transparent',
      )}
    >
      <div className="mx-auto grid h-16 max-w-[1400px] grid-cols-[1fr_auto_1fr] items-center px-4 sm:h-20 sm:px-8">
        <nav aria-label="Principal" className="hidden items-center gap-7 lg:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="eyebrow text-[0.68rem] whitespace-nowrap text-ink transition-colors hover:text-gold">
              {l.label}
            </a>
          ))}
        </nav>
        <button
          type="button"
          className="-ml-2 inline-flex size-11 items-center justify-center lg:hidden"
          aria-label="Abrir menú"
          aria-expanded={menu}
          onClick={() => setMenu(true)}
        >
          <Menu className="size-5" strokeWidth={1.5} />
        </button>

        <a href="#inicio" className="flex items-center gap-3 text-ink" aria-label="Casa del Sebas, inicio">
          <Monogram className="size-8 text-gold sm:size-9" />
          <span className="display text-lg tracking-[0.28em] whitespace-nowrap uppercase sm:text-xl">Casa del Sebas</span>
        </a>

        <div className="flex items-center justify-end gap-2 sm:gap-5">
          <a
            href={whatsappLink('Hola, Casa del Sebas. Quiero agendar una cita privada.')}
            target="_blank"
            rel="noreferrer"
            className="eyebrow hidden text-[0.68rem] text-ink transition-colors hover:text-gold md:inline"
          >
            Cita privada
          </a>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="relative -mr-2 inline-flex size-11 items-center justify-center text-ink"
            aria-label={`Abrir bolsa, ${count} ${count === 1 ? 'pieza' : 'piezas'}`}
          >
            <ShoppingBag className="size-5" strokeWidth={1.5} />
            {count > 0 && (
              <span className="absolute top-1.5 right-1 flex size-[18px] items-center justify-center rounded-full bg-ink text-[10px] font-medium text-ivory">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menu && (
          <motion.div
            className="fixed inset-0 z-50 flex flex-col bg-noir px-6 pt-5 pb-10 text-ivory lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label="Menú"
          >
            <div className="flex items-center justify-between">
              <span className="display text-lg tracking-[0.28em] uppercase">Casa del Sebas</span>
              <button type="button" className="-mr-2 inline-flex size-11 items-center justify-center" aria-label="Cerrar menú" onClick={() => setMenu(false)} autoFocus>
                <X className="size-6" strokeWidth={1.5} />
              </button>
            </div>
            <nav aria-label="Menú móvil" className="mt-14 flex flex-col gap-6">
              {[{ href: '#inicio', label: 'Inicio' }, ...links].map((l, i) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  onClick={() => setMenu(false)}
                  className="display text-4xl"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + i * 0.05 }}
                >
                  {l.label}
                </motion.a>
              ))}
            </nav>
            <a
              href={whatsappLink('Hola, Casa del Sebas. Quiero agendar una cita privada.')}
              target="_blank"
              rel="noreferrer"
              className="btn btn-gold mt-auto"
            >
              Agendar cita privada
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
