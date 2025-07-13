import { cn } from '@shared/utils/cn';
import { Check } from 'lucide-react';

interface ProgressIndicatorProps {
  currentStep: number;
  steps: Array<{
    label: string;
    description?: string;
  }>;
}

export function ProgressIndicator({ currentStep, steps }: ProgressIndicatorProps) {
  return (
    <div className="w-full max-w-3xl mx-auto mb-12 mt-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          const isLast = index === steps.length - 1;

          return (
            <div key={index} className="flex items-center flex-1">
              <div className="relative flex flex-col items-center">
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center font-medium transition-all',
                    isCompleted
                      ? 'bg-primary-600 text-white'
                      : isCurrent
                      ? 'bg-primary-600 text-white ring-4 ring-primary-600/20'
                      : 'bg-dark-surface border-2 border-dark-border text-dark-text-secondary'
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span>{stepNumber}</span>
                  )}
                </div>
                <div className="absolute top-12 text-center w-32 -ml-4">
                  <p className={cn(
                    'text-sm font-medium',
                    isCurrent ? 'text-dark-text-primary' : 'text-dark-text-secondary'
                  )}>
                    {step.label}
                  </p>
                  {step.description && (
                    <p className="text-xs text-dark-text-secondary mt-1 hidden sm:block">
                      {step.description}
                    </p>
                  )}
                </div>
              </div>
              {!isLast && (
                <div
                  className={cn(
                    'flex-1 h-0.5 mx-2',
                    isCompleted ? 'bg-primary-600' : 'bg-dark-border'
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}