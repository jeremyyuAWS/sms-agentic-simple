
import React from 'react';
import { cn } from '@/lib/utils';

interface AnimatedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  animateIn?: boolean;
  animationDelay?: number;
  hoverEffect?: 'lift' | 'glow' | 'scale' | 'none';
}

const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  className,
  animateIn = true,
  animationDelay = 0,
  hoverEffect = 'lift',
  ...props
}) => {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 10 + animationDelay);

    return () => clearTimeout(timer);
  }, [animationDelay]);

  const hoverStyles = {
    lift: 'hover:-translate-y-1 hover:shadow-md',
    glow: 'hover:shadow-lg hover:border-primary/20',
    scale: 'hover:scale-[1.02]',
    none: ''
  };

  return (
    <div
      className={cn(
        'glass-card p-5 overflow-hidden',
        animateIn && 'opacity-0 translate-y-2 scale-[0.98]',
        mounted && 'opacity-100 translate-y-0 scale-100 transition-all duration-500',
        hoverStyles[hoverEffect],
        'transition-all duration-300 ease-in-out',
        className
      )}
      style={{ 
        transitionDelay: `${animationDelay}ms`
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export default AnimatedCard;
