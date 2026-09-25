import { cn } from '@/lib/utils';

export function Eyebrow({ className, ...props }: React.ComponentProps<'p'>) {
  return (
    <p className={cn('mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-gold', className)} {...props} />
  );
}

/** Serif display title; wrap a word in <em> to set it in gold italics. */
export function SectionTitle({ className, ...props }: React.ComponentProps<'h2'>) {
  return (
    <h2
      className={cn(
        'font-serif text-[clamp(40px,5.4vw,76px)] font-medium leading-[1.02] tracking-[-0.01em] text-balance [&_em]:text-gold-bright',
        className,
      )}
      {...props}
    />
  );
}

export function SectionLead({ className, ...props }: React.ComponentProps<'p'>) {
  return <p className={cn('max-w-[50ch] text-[17px] text-muted-foreground', className)} {...props} />;
}

/** Vertical rhythm shared by the main sections. */
export const sectionY = 'py-[clamp(88px,11vw,160px)]';
