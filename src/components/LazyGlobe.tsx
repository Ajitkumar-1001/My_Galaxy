import React, { lazy, Suspense } from 'react';

// Lazy load the Globe component
const Globe = lazy(() => 
  import('./ui/globe').then(module => ({ default: module.Globe }))
);

// Loading component for the globe with better visibility
const GlobeLoader: React.FC = () => (
  <div className="absolute inset-0 w-full h-full flex items-center justify-center">
    <div className="text-center space-y-4">
      <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
      <p className="text-blue-400 text-sm">Away from the World......</p>
    </div>
  </div>
);

// Error boundary component
class GlobeErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Globe loading error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="absolute inset-0 w-full h-full flex items-center justify-center">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 border-2 border-red-400 rounded-full flex items-center justify-center mx-auto">
              <span className="text-red-400 text-xl">!</span>
            </div>
            <p className="text-red-400 text-sm">Globe failed to load</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Lazy Globe wrapper component
export const LazyGlobe: React.FC<{
  className?: string;
  config?: any;
}> = ({ className, config }) => {
  return (
    <GlobeErrorBoundary>
      <Suspense fallback={<GlobeLoader />}>
        <Globe className={className} config={config} />
      </Suspense>
    </GlobeErrorBoundary>
  );
};

export default LazyGlobe;
