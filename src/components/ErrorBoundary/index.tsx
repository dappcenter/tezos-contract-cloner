import React, { ReactElement } from "react";

class ErrorBoundary extends React.Component<{ fallback: ReactElement }> {
  state = { error: false };

  static getDerivedStateFromError(error: any) {
    return { error };
  }

  componentDidCatch(error: any) {
    // Log or store the error
    console.error(error);
  }

  render() {
    return this.state.error ? this.props.fallback : this.props.children;
  }
}

export default ErrorBoundary;
