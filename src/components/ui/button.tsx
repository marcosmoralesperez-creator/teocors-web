import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  "inline-flex shrink-0 touch-manipulation items-center justify-center gap-2.5 whitespace-nowrap rounded-md text-[13px] font-semibold uppercase tracking-[0.14em] transition-[background-color,border-color,color,transform] duration-250 ease-luxe active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-[18px]",
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-gold-bright',
        outline:
          'border border-input bg-transparent text-foreground hover:border-foreground hover:bg-foreground hover:text-background',
        glass:
          'border border-input bg-foreground/[0.03] text-foreground backdrop-blur-sm hover:border-gold hover:text-gold-bright',
        ghost: 'text-foreground hover:bg-foreground/[0.08]',
        link: 'font-normal normal-case tracking-normal text-muted-foreground underline underline-offset-4 hover:text-foreground',
      },
      size: {
        default: 'min-h-13 px-6.5',
        sm: 'min-h-11 px-4 text-xs tracking-[0.1em]',
        lg: 'min-h-14 px-8',
        icon: 'size-11 rounded-full tracking-normal',
        inline: 'min-h-6 px-0 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : 'button';
  return <Comp data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}

export { Button, buttonVariants };
