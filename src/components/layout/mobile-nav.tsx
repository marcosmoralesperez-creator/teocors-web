import { useRef, useState } from 'react';
import { Menu } from 'lucide-react';

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { navLinks } from '@/data/site';
import { scrollToSection } from '@/lib/scroll';

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const target = useRef<string | null>(null);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        aria-label="Abrir menú"
        className="-ml-2.5 grid size-11 place-items-center rounded-full transition-colors hover:bg-foreground/[0.08] lg:hidden [&_svg]:size-6"
      >
        <Menu aria-hidden="true" strokeWidth={1.5} />
      </SheetTrigger>
      <SheetContent
        side="left"
        closeLabel="Cerrar menú"
        onCloseAutoFocus={(e) => {
          if (!target.current) return;
          e.preventDefault();
          const id = target.current;
          target.current = null;
          requestAnimationFrame(() => scrollToSection(id));
        }}
      >
        <SheetHeader>
          <SheetTitle className="font-sans text-base font-bold tracking-[0.42em]">TEOCORS</SheetTitle>
          <SheetDescription className="sr-only">Secciones de la tienda</SheetDescription>
        </SheetHeader>
        <nav aria-label="Menú móvil">
          <ul className="py-2">
            {navLinks.map((link) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    target.current = link.id;
                    setOpen(false);
                  }}
                  className="block border-b px-6 py-4 font-serif text-[34px] leading-tight transition-colors hover:text-gold-bright"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
