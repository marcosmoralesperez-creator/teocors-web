import { Component, type ReactNode } from 'react';

/** Renders `fallback` instead of crashing the page when a child throws. */
export class ErrorBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.warn('Contenido interactivo no disponible, se muestra la alternativa.', error);
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
