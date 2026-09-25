import { useState } from 'react';
import { ArrowUpRight, Play } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Eyebrow, SectionLead, SectionTitle, sectionY } from '@/components/common/section-heading';
import { Reveal } from '@/components/common/reveal';
import { music } from '@/data/site';
import { cn } from '@/lib/utils';

const bars = ['', '[animation-duration:0.8s] [animation-delay:-0.3s]', '[animation-duration:1.3s] [animation-delay:-0.6s]', '[animation-duration:0.9s] [animation-delay:-0.2s]', '[animation-duration:1.2s] [animation-delay:-0.8s]'];

/**
 * Lightweight YouTube embed: the player loads only after the visitor presses
 * play. Opened from disk (file://) embedding can't work, so the poster stays a
 * plain link to YouTube.
 */
function Video() {
  const [playing, setPlaying] = useState(false);
  const [thumbFailed, setThumbFailed] = useState(false);

  return (
    <div className="relative z-[1] aspect-video overflow-hidden rounded-md bg-[#080706] shadow-[0_40px_90px_-30px_rgb(0_0_0/0.9),0_0_0_1px_var(--border)]">
      {playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${music.videoId}?autoplay=1&rel=0&playsinline=1`}
          title={music.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          className="absolute inset-0 size-full border-0"
          ref={(el) => el?.focus()}
        />
      ) : (
        <a
          href={music.url}
          target="_blank"
          rel="noopener"
          aria-label={`Reproducir video: ${music.title}`}
          onClick={(e) => {
            if (!location.protocol.startsWith('http')) return;
            e.preventDefault();
            setPlaying(true);
          }}
          className="group absolute inset-0 block bg-[radial-gradient(ellipse_60%_70%_at_50%_50%,rgb(201_164_92/0.2),transparent_70%),repeating-linear-gradient(90deg,rgb(255_255_255/0.025)_0_1px,transparent_1px_22px)] bg-[#110f0d]"
        >
          {!thumbFailed && (
            <img
              src={`https://i.ytimg.com/vi/${music.videoId}/hqdefault.jpg`}
              alt=""
              width={480}
              height={360}
              loading="lazy"
              onError={() => setThumbFailed(true)}
              className="size-full object-cover opacity-70 transition-[transform,opacity] duration-900 ease-luxe group-hover:scale-[1.03] group-hover:opacity-90"
            />
          )}
          <span className="absolute top-1/2 left-1/2 grid size-[68px] -translate-1/2 place-items-center rounded-full bg-primary text-primary-foreground shadow-[0_0_0_12px_rgb(201_164_92/0.18)] transition-transform duration-350 ease-luxe group-hover:scale-[1.07] sm:size-[84px]">
            <Play aria-hidden="true" className="ml-1 size-[30px] fill-current" />
          </span>
          <span className="absolute bottom-4 left-5 text-xs font-semibold tracking-[0.2em] uppercase">
            Reproducir · YouTube
          </span>
        </a>
      )}
    </div>
  );
}

export function Music() {
  return (
    <section id="musica" aria-labelledby="musica-title" className={cn('relative isolate overflow-clip border-y', sectionY)}>
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_50%_65%_at_75%_50%,rgb(201_164_92/0.13),transparent_70%),linear-gradient(180deg,#0f0d0b,#0b0a09)]"
      />
      <div className="shell grid items-center gap-[clamp(48px,6vw,96px)] lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
        <Reveal>
          <Eyebrow>Sonido TEOCORS</Eyebrow>
          <SectionTitle id="musica-title" className="mb-6 text-[clamp(40px,4.8vw,68px)] leading-[1.02]">
            Música por amigos del colegio de <em>Marko</em>
          </SectionTitle>
          <SectionLead className="mb-8">
            La banda sonora de TEOCORS la ponen los amigos del colegio de Marko. Dale play y deja que suene mientras
            eliges tu próxima prenda.
          </SectionLead>
          <div aria-hidden="true" className="mb-8 flex h-[30px] items-end gap-[5px]">
            {bars.map((extra, i) => (
              <span key={i} className={cn('h-full w-1 origin-bottom animate-eq rounded-sm bg-gold', extra)} />
            ))}
          </div>
          <Button asChild variant="glass">
            <a href={music.url} target="_blank" rel="noopener">
              Ver en YouTube <ArrowUpRight aria-hidden="true" />
            </a>
          </Button>
        </Reveal>

        <Reveal className="relative max-w-[720px] sm:pr-[clamp(0px,7vw,110px)] lg:max-w-none">
          <div
            aria-hidden="true"
            className="vinyl absolute top-1/2 right-0 aspect-square w-[min(72%,460px)] -translate-y-1/2 animate-spin-slow rounded-full max-sm:hidden"
          >
            <div className="absolute inset-[34%] grid place-items-center rounded-full bg-[radial-gradient(circle,#0b0a09_0_6%,var(--gold)_7%_100%)] font-serif text-[clamp(18px,3vw,40px)] font-semibold text-primary-foreground">
              T
            </div>
          </div>
          <Video />
        </Reveal>
      </div>
    </section>
  );
}
