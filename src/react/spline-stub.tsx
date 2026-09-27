// Versión de un solo archivo: la escena de Spline se descarga de internet y
// su motor pesa varios MB, así que aquí no se incluye. <ErrorBoundary> muestra
// en su lugar la figura en video.
export default function SplineUnavailable(): never {
  throw new Error('Spline no se incluye en la versión de un solo archivo.');
}
