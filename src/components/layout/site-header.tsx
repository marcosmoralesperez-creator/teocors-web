import { CartSheet } from '@/components/shop/cart-sheet';
import { MobileNav } from '@/components/layout/mobile-nav';
import { navLinks } from '@/data/site';
import { useActiveSection } from '@/hooks/use-active-section';
import { useScrolled } from '@/hooks/use-scrolled';
import { cn } from '@/lib/utils';

const sectionIds = navLinks.map((l) => l.id);

export function SiteHeader() {
  const scrolled = useScrolled(24);
  const active = useActiveSection(sectionIds);

  return (
    <header
      className={cn(
        'sticky top-0 z-40 h-(--header-h) border-b border-transparent transition-[background-color,border-color,backdrop-filter] duration-350 ease-luxe',
        scrolled && 'border-border bg-background/80 backdrop-blur-[14px] backdrop-saturate-[1.2]',
      )}
    >
      <div className="shell grid h-full grid-cols-[44px_1fr_44px] items-center lg:grid-cols-[1fr_auto_1fr]">
        <MobileNav />
        <a
          href="#inicio"
          aria-label="TEOCORS, volver al inicio"
          className="-mr-[0.42em] justify-self-center text-base font-bold tracking-[0.42em] lg:justify-self-start lg:text-lg"
        >
          TEOCORS
        </a>
        <nav aria-label="Principal" className="max-lg:hidden">
          <ul className="flex gap-8 xl:gap-10">
            {navLinks.map((link) => {
              const isActive = active === link.id;
              return (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    aria-current={isActive ? 'location' : undefined}
                    className={cn(
                      'relative inline-block py-3 text-[13px] font-medium uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-foreground',
                      'after:absolute after:inset-x-0 after:bottom-1.5 after:h-px after:origin-left after:scale-x-0 after:bg-gold after:transition-transform after:duration-350 after:ease-luxe hover:after:scale-x-100',
                      isActive && 'text-foreground after:scale-x-100',
                    )}
                  >
                    {link.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
        <CartSheet />
      </div>
    </header>
  );
}
