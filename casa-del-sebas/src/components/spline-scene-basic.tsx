'use client'

import { useEffect, useRef, useState } from 'react'
import { SplineScene } from '@/components/ui/splite'
import { Card } from '@/components/ui/card'
import { Spotlight } from '@/components/ui/spotlight'
import { ErrorBoundary } from '@/components/error-boundary'
import detail from '@/assets/products/detalle-cubana.webp'

// The demo from the component, adapted to the house: Spanish copy, a gold
// spotlight, stacked on phones, and the Spline runtime only loads once the
// card is about to enter the screen (it is several MB).
export function SplineSceneBasic() {
  const ref = useRef<HTMLDivElement>(null)
  const [near, setNear] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true)
          io.disconnect()
        }
      },
      { rootMargin: '400px 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <Card ref={ref} className="relative min-h-[560px] w-full overflow-hidden rounded-none border-gold/25 bg-black/[0.96] md:h-[560px]">
      <Spotlight className="from-gold-pale via-gold-bright/60 to-transparent" size={360} />

      <div className="flex h-full flex-col md:flex-row">
        {/* Left content */}
        <div className="relative z-10 flex flex-1 flex-col justify-center p-8 sm:p-12">
          <p className="eyebrow text-gold-bright">Taller digital</p>
          <h2 className="display mt-4 bg-gradient-to-b from-neutral-50 to-neutral-400 bg-clip-text text-4xl text-transparent md:text-5xl">
            Tu pieza existe en 3D antes que en oro
          </h2>
          <p className="mt-5 max-w-lg leading-relaxed text-neutral-300">
            Modelamos cada encargo en tres dimensiones para que lo gires, lo veas de cerca y ajustemos grosor, largo y engaste contigo. Cuando lo apruebas, pasa al taller.
          </p>
          <p className="mt-6 text-xs text-neutral-500">Mueve el cursor sobre la escena: te sigue con la mirada.</p>
        </div>

        {/* Right content */}
        <div className="relative h-[360px] flex-1 md:h-auto">
          {near ? (
            <ErrorBoundary
              fallback={<img src={detail} alt="" className="h-full w-full object-cover opacity-90" />}
            >
              <SplineScene scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode" className="h-full w-full" />
            </ErrorBoundary>
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="loader"></span>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
