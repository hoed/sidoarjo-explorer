import { Component, type ReactNode } from "react";

/**
 * Wraps decorative content (3D scenes, etc.) that could fail for reasons
 * outside our control — a blocked third-party asset domain, a slow network,
 * a WebGL context loss. Without this, an uncaught error in a Suspense-wrapped
 * child unmounts the nearest error boundary, which by default is the root of
 * the app — i.e. the whole site goes blank. Here it just quietly renders
 * nothing (or a fallback) and leaves everything else working.
 */
export class SceneErrorBoundary extends Component<{ children: ReactNode; fallback?: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    // eslint-disable-next-line no-console
    console.warn("Decorative scene failed to render, hiding it:", error);
  }

  render() {
    if (this.state.hasError) return this.props.fallback ?? null;
    return this.props.children;
  }
}
