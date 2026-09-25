import { useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eyebrow, SectionLead, SectionTitle, sectionY } from '@/components/common/section-heading';
import { Reveal } from '@/components/common/reveal';
import { cn } from '@/lib/utils';

const HELP = 'Te escribimos solo cuando haya algo nuevo.';

export function Newsletter() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [attempted, setAttempted] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const [sending, setSending] = useState(false);
  const [msg, setMsg] = useState<{ text: string; kind: '' | 'error' | 'success' }>({ text: HELP, kind: '' });

  function validate() {
    const input = inputRef.current!;
    const ok = input.value.trim() !== '' && input.checkValidity();
    setInvalid(!ok);
    setMsg(ok ? { text: HELP, kind: '' } : { text: 'Escribe un correo válido, por ejemplo nombre@correo.com.', kind: 'error' });
    return ok;
  }

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setAttempted(true);
    if (!validate()) {
      inputRef.current?.focus();
      return;
    }
    // TODO: connect to the mailing-list service (Mailchimp, Brevo…).
    setSending(true);
    const form = e.currentTarget;
    setTimeout(() => {
      setSending(false);
      form.reset();
      setAttempted(false);
      setInvalid(false);
      setMsg({ text: '¡Listo! Ya estás en la lista. Te avisaremos del próximo drop.', kind: 'success' });
    }, 700);
  }

  return (
    <section aria-labelledby="newsletter-title" className={sectionY}>
      <div className="shell">
        <Reveal className="grid items-end gap-12 rounded-lg border bg-[radial-gradient(ellipse_60%_90%_at_0%_0%,rgb(201_164_92/0.12),transparent_60%),var(--card)] p-[clamp(28px,6vw,80px)] lg:grid-cols-2">
          <div>
            <Eyebrow>Lista privada</Eyebrow>
            <SectionTitle id="newsletter-title" className="mb-4">
              Entra al <em>círculo</em>
            </SectionTitle>
            <SectionLead>Sé el primero en enterarte de cada drop. Sin spam, solo lanzamientos.</SectionLead>
          </div>
          <form noValidate onSubmit={submit}>
            <label htmlFor="newsletter-email" className="mb-2.5 block text-[13px] font-semibold tracking-[0.08em]">
              Correo electrónico
            </label>
            <div className="flex gap-2.5 max-sm:flex-col">
              <Input
                ref={inputRef}
                id="newsletter-email"
                name="email"
                type="email"
                autoComplete="email"
                inputMode="email"
                placeholder="tu@correo.com"
                aria-describedby="newsletter-help"
                aria-invalid={invalid || undefined}
                required
                onBlur={() => attempted && validate()}
                className="flex-1"
              />
              <Button type="submit" disabled={sending}>
                {sending ? 'Enviando…' : 'Suscribirme'}
              </Button>
            </div>
            <p
              id="newsletter-help"
              aria-live="polite"
              className={cn(
                'mt-2.5 text-[13px] text-muted-foreground',
                msg.kind === 'error' && 'text-destructive',
                msg.kind === 'success' && 'text-success',
              )}
            >
              {msg.text}
            </p>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
