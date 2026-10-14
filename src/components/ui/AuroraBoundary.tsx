import { Component, type ReactNode } from "react";
import { StaticAurora } from "./SoftAurora";

interface AuroraBoundaryState {
  failed: boolean;
}

/**
 * Component-scoped boundary so a decorative WebGL backdrop can never bring
 * down the application. On an unexpected error the static aurora substitute
 * is rendered instead of the canvas and the rest of the site keeps working.
 */
export default class AuroraBoundary extends Component<{ children: ReactNode }, AuroraBoundaryState> {
  state: AuroraBoundaryState = { failed: false };

  static getDerivedStateFromError(): AuroraBoundaryState {
    return { failed: true };
  }

  componentDidCatch(error: unknown): void {
    // Decorative layer only — no crash of the whole tree.
    if (typeof console !== "undefined" && console.error) {
      console.error("SoftAurora failed; using static aurora fallback.", error);
    }
  }

  render() {
    if (this.state.failed) return <StaticAurora />;
    return this.props.children;
  }
}