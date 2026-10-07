// Stand-in for @splinetool/react-spline in the `artifact` build, where the page
// cannot reach prod.spline.design. Throwing lets the ErrorBoundary around the
// scene show its photo instead, without shipping the multi-MB runtime.
export default function SplineUnavailable(): never {
  throw new Error('La escena 3D de Spline no está disponible en esta versión.');
}
