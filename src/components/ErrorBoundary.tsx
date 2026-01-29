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
          <div className="min-h-screen flex items-center justify-center p-6">
            <div className="max-w-md w-full">
              <div className="text-6xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
              <p className="text-white/60 mb-6">
                An error occurred while rendering this section.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 rounded-full bg-white text-black font-medium hover:bg-white/90 transition-colors"
              >
                Refresh Page
              </button>
              {this.state.error && (
                <div className="mt-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                  <p className="text-sm text-red-400 font-mono mb-2">Error:</p>
                  <p className="text-xs text-red-300/80 font-mono break-all">
                    {this.state.error.toString()}
                  </p>
                </div>
              )}
              {this.state.errorInfo && (
                <pre className="mt-4 p-4 rounded-lg bg-white/5 text-left text-xs text-white/40 overflow-auto max-h-40">
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
