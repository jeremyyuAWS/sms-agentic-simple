
import React from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';

interface FallbackProps {
  error?: Error | null;
  loading?: boolean;
  message?: string;
}

const Fallback: React.FC<FallbackProps> = ({
  error,
  loading = false,
  message = "Something went wrong"
}) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-6">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading application...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-6">
        <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
        <h2 className="text-xl font-semibold mb-2">Application Error</h2>
        <p className="text-muted-foreground mb-4">{message}</p>
        <p className="text-xs text-red-500 max-w-md overflow-auto p-2 bg-red-50 rounded">
          {error.message}
        </p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          Reload Application
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-6">
      <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
      <h2 className="text-xl font-semibold mb-2">Unexpected State</h2>
      <p className="text-muted-foreground">{message}</p>
      <button 
        onClick={() => window.location.reload()} 
        className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
      >
        Reload Application
      </button>
    </div>
  );
};

export default Fallback;
