import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  public render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex min-h-[100dvh] items-center justify-center bg-background p-6">
            <div className="glass-panel-soft w-full max-w-md p-6">
              <div className="mb-5 h-px w-16 bg-accent" />
              <h2 className="mb-4 text-2xl font-semibold text-primary">Something went wrong</h2>
              <p className="mb-6 text-secondary">
                An error occurred while rendering this section.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="action-primary focus-ring px-6 py-3 font-medium"
              >
                Refresh page
              </button>
              {this.state.error && (
                <div className="mt-6 border border-red-500/20 bg-red-500/10 p-4">
                  <p className="text-sm text-red-400 font-mono mb-2">Error:</p>
                  <p className="text-xs text-red-300/80 font-mono break-all">
                    {this.state.error.toString()}
                  </p>
                </div>
              )}
              {this.state.errorInfo && (
                <pre className="mt-4 max-h-40 overflow-auto bg-white/5 p-4 text-left text-xs text-white/40">
                  {this.state.errorInfo.componentStack}
                </pre>
              )}
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
