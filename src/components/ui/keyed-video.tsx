import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

type KeyedVideoProps = {
  sources: { src: string; type: string }[];
  poster: string;
  width: number;
  height: number;
  /** Brillo (0–255) del fondo liso del video. Lo que sea igual o más oscuro se vuelve transparente. */
  keyLevel?: number;
  /** Ancho del degradado del borde, para que el recorte no quede serruchado. */
  softness?: number;
  playing?: boolean;
  className?: string;
  label: string;
};

/**
 * Reproduce un video en bucle y pinta cada cuadro en un <canvas> quitando el
 * fondo negro liso, así la figura queda flotando sobre lo que haya detrás.
 * Si el navegador no deja leer los píxeles, muestra el video tal cual.
 */
export function KeyedVideo({
  sources,
  poster,
  width,
  height,
  keyLevel = 14,
  softness = 30,
  playing = true,
  className,
  label,
}: KeyedVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mode, setMode] = useState<'loading' | 'canvas' | 'video'>('loading');

  useEffect(() => {
    const video = videoRef.current!;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) {
      setMode('video');
      return;
    }

    let stopped = false;
    let handle = 0;
    const hasRVFC = 'requestVideoFrameCallback' in HTMLVideoElement.prototype;

    const draw = () => {
      ctx.drawImage(video, 0, 0, width, height);
      const frame = ctx.getImageData(0, 0, width, height);
      const d = frame.data;
      for (let i = 0; i < d.length; i += 4) {
        const m = d[i] > d[i + 1] ? (d[i] > d[i + 2] ? d[i] : d[i + 2]) : d[i + 1] > d[i + 2] ? d[i + 1] : d[i + 2];
        const a = (m - keyLevel) / softness;
        if (a >= 1) continue;
        if (a <= 0) {
          d[i + 3] = 0;
          continue;
        }
        // Borde: se le resta el fondo negro mezclado para que no quede un halo oscuro.
        const k = keyLevel * (1 - a);
        d[i] = (d[i] - k) / a;
        d[i + 1] = (d[i + 1] - k) / a;
        d[i + 2] = (d[i + 2] - k) / a;
        d[i + 3] = a * 255;
      }
      ctx.putImageData(frame, 0, 0);
    };

    const loop = () => {
      if (stopped) return;
      try {
        if (video.readyState >= 2) draw();
      } catch {
        // Canvas "contaminado" (origen cruzado): se usa el video directamente.
        stopped = true;
        setMode('video');
        return;
      }
      setMode((m) => (m === 'loading' ? 'canvas' : m));
      handle = hasRVFC ? video.requestVideoFrameCallback(loop) : requestAnimationFrame(loop);
    };

    const start = () => loop();
    if (video.readyState >= 2) start();
    else video.addEventListener('loadeddata', start, { once: true });

    return () => {
      stopped = true;
      video.removeEventListener('loadeddata', start);
      if (hasRVFC) video.cancelVideoFrameCallback(handle);
      else cancelAnimationFrame(handle);
    };
  }, [width, height, keyLevel, softness]);

  // Pausa cuando no se ve (otra pestaña, fuera de pantalla) o con movimiento reducido.
  useEffect(() => {
    const video = videoRef.current!;
    let visible = true;
    const sync = () => {
      if (playing && visible && !document.hidden) video.play().catch(() => {});
      else video.pause();
    };
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    io.observe(video.parentElement!);
    document.addEventListener('visibilitychange', sync);
    sync();
    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', sync);
    };
  }, [playing]);

  return (
    <div className={cn('relative', className)} role="img" aria-label={label}>
      <video
        ref={videoRef}
        className={cn(
          'absolute inset-0 h-full w-full object-contain mix-blend-lighten',
          mode === 'video' ? 'opacity-100' : 'opacity-0',
        )}
        poster={poster}
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      >
        {sources.map((s) => (
          <source key={s.src} src={s.src} type={s.type} />
        ))}
      </video>
      <img
        src={poster}
        alt=""
        aria-hidden="true"
        className={cn(
          'absolute inset-0 h-full w-full object-contain mix-blend-lighten transition-opacity duration-500',
          mode === 'loading' ? 'opacity-100' : 'opacity-0',
        )}
      />
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        aria-hidden="true"
        className={cn(
          'absolute inset-0 h-full w-full object-contain transition-opacity duration-500',
          mode === 'canvas' ? 'opacity-100' : 'opacity-0',
        )}
      />
    </div>
  );
}
