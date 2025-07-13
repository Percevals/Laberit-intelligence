import { cn } from '@shared/utils/cn';
import { useTranslation } from 'react-i18next';

type AIHealthStatus = 'active' | 'cached' | 'offline';

interface AIHealthIndicatorProps {
  status: AIHealthStatus;
  className?: string;
}

export function AIHealthIndicator({ status, className }: AIHealthIndicatorProps) {
  const { t } = useTranslation();
  
  const statusConfig = {
    active: {
      color: 'bg-green-500',
      pulse: true,
      tooltip: t('ai.health.active', 'Verificación de datos: Activa')
    },
    cached: {
      color: 'bg-yellow-500',
      pulse: false,
      tooltip: t('ai.health.cached', 'Usando datos en caché')
    },
    offline: {
      color: 'bg-red-500',
      pulse: false,
      tooltip: t('ai.health.offline', 'Entrada manual')
    }
  };
  
  const config = statusConfig[status];
  
  return (
    <div className={cn('relative group inline-flex items-center', className)}>
      <div className="relative">
        <div className={cn(
          'w-3 h-3 rounded-full',
          config.color
        )} />
        {config.pulse && (
          <div className={cn(
            'absolute inset-0 w-3 h-3 rounded-full animate-ping',
            config.color,
            'opacity-75'
          )} />
        )}
      </div>
      
      {/* Tooltip */}
      <div className="absolute left-0 top-full mt-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <div className="bg-dark-surface border border-dark-border rounded px-2 py-1 text-xs whitespace-nowrap">
          {config.tooltip}
        </div>
      </div>
    </div>
  );
}