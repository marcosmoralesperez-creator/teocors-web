const items = ['Edición limitada', 'Algodón 280 g/m²', 'Diseñado en Colombia', 'Envíos a todo el país', 'Colección 01'];

export function Marquee() {
  return (
    <div className="group overflow-hidden border-y bg-elevated py-[22px]">
      <p className="sr-only">{items.join(' · ')}</p>
      <div aria-hidden="true" className="flex w-max animate-marquee group-hover:[animation-play-state:paused]">
        {[...items, ...items].map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-12 pr-12 font-serif text-[clamp(22px,2.4vw,32px)] italic whitespace-nowrap after:size-2 after:rotate-45 after:bg-gold"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
