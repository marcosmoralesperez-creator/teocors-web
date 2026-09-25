import * as React from 'react';

import { cn } from '@/lib/utils';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'flex min-h-13 w-full min-w-0 rounded-md border border-input bg-background px-4.5 text-base text-foreground transition-colors placeholder:text-[#7d776f] hover:border-foreground/40 disabled:cursor-not-allowed disabled:opacity-50',
        'focus-visible:border-gold focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-gold',
        'aria-invalid:border-destructive',
        className,
      )}
      {...props}
    />
  );
}

export { Input };
