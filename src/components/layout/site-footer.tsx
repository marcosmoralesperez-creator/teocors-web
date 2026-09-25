import { InstagramIcon, TikTokIcon, YouTubeIcon } from '@/components/common/brand-icons';
import { useShop } from '@/components/shop/shop-provider';
import { categories } from '@/data/products';
import { socials } from '@/data/site';

const linkClass = 'inline-flex min-h-10 items-center text-[15px] transition-colors hover:text-gold-bright';
const headingClass = 'mb-4 text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase';

export function SiteFooter() {
  const { setFilter, openSizeGuide } = useShop();

  return (
    <footer className="border-t pt-[72px]">
      <div className="shell grid grid-cols-2 gap-10 pb-14 lg:grid-cols-[2fr_1fr_1fr_1fr]">
        <div className="col-span-2 lg:col-span-1">
          <a href="#inicio" className="-mr-[0.42em] text-lg font-bold tracking-[0.42em]">
            TEOCORS
          </a>
          <p className="mt-4 max-w-[30ch] text-muted-foreground">Ropa de edición limitada diseñada en Colombia.</p>
        </div>

        <nav aria-label="Tienda">
          <h2 className={headingClass}>Tienda</h2>
          <ul className="grid gap-0.5">
            {categories
              .filter((c) => c.id !== 'all')
              .map((c) => (
                <li key={c.id}>
                  <a href="#coleccion" onClick={() => setFilter(c.id)} className={linkClass}>
                    {c.label}
                  </a>
                </li>
              ))}
          </ul>
        </nav>

        <nav aria-label="Ayuda">
          <h2 className={headingClass}>Ayuda</h2>
          <ul className="grid gap-0.5">
            <li>
              <a href="#ayuda" className={linkClass}>
                Envíos
              </a>
            </li>
            <li>
              <a href="#ayuda" className={linkClass}>
                Cambios y devoluciones
              </a>
            </li>
            <li>
              <button type="button" onClick={openSizeGuide} className={linkClass}>
                Guía de tallas
              </button>
            </li>
          </ul>
        </nav>

        <div>
          <h2 className={headingClass}>Síguenos</h2>
          <ul className="flex gap-2.5">
            {[
              { href: socials.instagram, label: 'TEOCORS en Instagram', Icon: InstagramIcon, external: false },
              { href: socials.tiktok, label: 'TEOCORS en TikTok', Icon: TikTokIcon, external: false },
              { href: socials.youtube, label: 'Música TEOCORS en YouTube', Icon: YouTubeIcon, external: true },
            ].map(({ href, label, Icon, external }) => (
              <li key={label}>
                <a
                  href={href}
                  aria-label={label}
                  {...(external ? { target: '_blank', rel: 'noopener' } : {})}
                  className="grid size-11 place-items-center rounded-full border border-input transition-colors hover:border-gold hover:text-gold-bright"
                >
                  <Icon className="size-5" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="shell flex flex-wrap justify-between gap-3 border-t py-6 text-[13px] text-muted-foreground">
        <p>© 2026 TEOCORS. Todos los derechos reservados.</p>
        <p>Hecho en Colombia</p>
      </div>
    </footer>
  );
}
