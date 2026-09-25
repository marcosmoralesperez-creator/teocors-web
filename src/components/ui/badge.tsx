import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex w-fit shrink-0 items-center gap-1 whitespace-nowrap rounded-sm border px-2.5 py-1.5 text-xs font-semibold uppercase leading-none tracking-[0.12em]',
  {
    variants: {
      variant: {
        default: 'border-gold/40 bg-background/70 text-gold-bright backdrop-blur-sm',
        solid: 'border-transparent bg-primary text-primary-foreground',
        outline: 'border-input text-foreground',
      },
    },
    defaultVariants: { variant: 'default' },
  },
);

function Badge({ className, variant, ...props }: React.ComponentProps<'span'> & VariantProps<typeof badgeVariants>) {
  return <span data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
