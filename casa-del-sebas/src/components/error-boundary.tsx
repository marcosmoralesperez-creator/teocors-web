import { Component, type ReactNode } from 'react';

/** Keeps a failing island (e.g. a 3D scene that cannot download) from taking the page down. */
export class ErrorBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.warn('Sección 3D no disponible:', error);
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
