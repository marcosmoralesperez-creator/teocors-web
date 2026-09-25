import { formatPrice } from '@/data/products';
import { FREE_SHIPPING } from '@/data/site';

export function AnnouncementBar() {
  return (
    <div className="grid h-(--announce-h) place-items-center overflow-hidden border-b bg-elevated px-4 text-center text-xs font-medium uppercase tracking-[0.14em] text-gold-bright">
      <p>
        Envío gratis en Colombia desde {formatPrice(FREE_SHIPPING)}
        <span className="max-lg:hidden"> · Colección 01 disponible</span>
      </p>
    </div>
  );
}
