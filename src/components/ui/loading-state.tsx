
import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingStateProps {
  isLoading: boolean;
  loadingText?: string;
  error?: string | null;
  children: React.ReactNode;
  className?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({
  isLoading,
  loadingText = 'Loading...',
  error,
  children,
  className
}) => {
  if (isLoading) {
    return (
      <div className={cn("flex flex-col items-center justify-center p-6", className)}>
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-2" />
        <p className="text-muted-foreground">{loadingText}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("flex flex-col items-center justify-center p-6 bg-destructive/10 rounded-md", className)}>
        <p className="text-destructive font-medium">Error</p>
        <p className="text-destructive-foreground">{error}</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default LoadingState;
