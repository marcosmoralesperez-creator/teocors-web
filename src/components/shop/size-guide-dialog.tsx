import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { useShop } from '@/components/shop/shop-provider';

const rows = [
  { size: 'S', chest: 56, length: 70, sleeve: 22 },
  { size: 'M', chest: 59, length: 72, sleeve: 23 },
  { size: 'L', chest: 62, length: 74, sleeve: 24 },
  { size: 'XL', chest: 65, length: 76, sleeve: 25 },
];

export function SizeGuideDialog() {
  const { sizeGuideOpen, closeSizeGuide, returnFocus } = useShop();

  return (
    <Dialog open={sizeGuideOpen} onOpenChange={(open) => !open && closeSizeGuide()}>
      <DialogContent
        className="max-w-[600px] p-[clamp(24px,5vw,44px)]"
        onCloseAutoFocus={(e) => {
          e.preventDefault();
          returnFocus.current.sizeGuide?.focus();
        }}
      >
        <DialogTitle className="pr-10">Guía de tallas</DialogTitle>
        <DialogDescription className="mt-3 mb-6">
          Medidas de la prenda en centímetros. Nuestro corte es amplio: si prefieres un fit regular, pide una talla
          menos.
        </DialogDescription>
        <table className="w-full border-collapse text-left tabular-nums">
          <thead>
            <tr className="text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">
              <th scope="col" className="border-b px-2 py-3">Talla</th>
              <th scope="col" className="border-b px-2 py-3">Ancho de pecho</th>
              <th scope="col" className="border-b px-2 py-3">Largo total</th>
              <th scope="col" className="border-b px-2 py-3">Manga</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.size}>
                <th scope="row" className="border-b px-2 py-3">{r.size}</th>
                <td className="border-b px-2 py-3">{r.chest}</td>
                <td className="border-b px-2 py-3">{r.length}</td>
                <td className="border-b px-2 py-3">{r.sleeve}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </DialogContent>
    </Dialog>
  );
}
