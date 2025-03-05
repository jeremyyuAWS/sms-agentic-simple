
import React from 'react';

interface FallbackProps {
  error?: Error;
  resetErrorBoundary?: () => void;
}

const Fallback: React.FC<FallbackProps> = ({ error, resetErrorBoundary }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <div className="card p-6 max-w-md w-full border rounded shadow">
        <h1 className="text-xl font-bold mb-2">Something went wrong</h1>
        {error && (
          <div className="mb-4 p-2 bg-red-50 border border-red-100 rounded text-sm text-red-800">
            {error.message}
          </div>
        )}
        <p className="text-muted-foreground mb-4">
          The application encountered an error. Please try refreshing the page.
        </p>
        {resetErrorBoundary && (
          <button
            onClick={resetErrorBoundary}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Try again
          </button>
        )}
      </div>
    </div>
  );
};

export default Fallback;
