
import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useApp } from '@/contexts/app/AppContext';
import { Progress } from '@/components/ui/progress';

type WorkflowStep = 'contacts' | 'template' | 'campaign' | 'schedule' | 'review';

const steps: { key: WorkflowStep; label: string }[] = [
  { key: 'contacts', label: 'Select Contacts' },
  { key: 'template', label: 'Choose Template' },
  { key: 'campaign', label: 'Configure Campaign' },
  { key: 'schedule', label: 'Set Schedule' },
  { key: 'review', label: 'Review & Launch' }
];

export const WorkflowProgress: React.FC = () => {
  const { workflow } = useApp();
  
  if (!workflow.active) return null;
  
  const currentIndex = steps.findIndex(step => step.key === workflow.currentStep);
  const progressPercentage = ((currentIndex + 1) / steps.length) * 100;
  
  return (
    <div className="bg-background border rounded-lg p-4 mb-6 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-medium">Campaign Setup</h3>
        <span className="text-sm text-muted-foreground">
          Step {currentIndex + 1} of {steps.length}
        </span>
      </div>
      
      <Progress value={progressPercentage} className="h-2 mb-4" />
      
      <div className="grid grid-cols-5 gap-2">
        {steps.map((step, index) => {
          const isActive = workflow.currentStep === step.key;
          const isCompleted = index < currentIndex;
          
          return (
            <div 
              key={step.key}
              className={cn(
                "flex flex-col items-center text-center",
                isActive ? "text-primary" : 
                isCompleted ? "text-muted-foreground" : "text-muted-foreground/60"
              )}
            >
              <div className="flex items-center justify-center mb-1">
                {isCompleted ? (
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                ) : (
                  <Circle 
                    className={cn(
                      "h-5 w-5",
                      isActive ? "text-primary fill-primary/20" : "text-muted-foreground/60"
                    )} 
                  />
                )}
              </div>
              <span className="text-xs font-medium">{step.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
