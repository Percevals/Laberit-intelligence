/**
 * Impact Distribution Chart Component
 * Shows how business value loss is distributed across impact types
 */

import { motion } from 'framer-motion';
import { 
  Factory, 
  Heart, 
  Scale, 
  TrendingUp, 
  AlertTriangle,
  Info
} from 'lucide-react';
import { cn } from '@shared/utils/cn';
import type { ImpactDistribution } from '@/core/dii-engine/maturity-v4';

interface ImpactDistributionChartProps {
  distribution: ImpactDistribution;
  businessModel: string;
  className?: string;
}

interface ImpactTypeInfo {
  key: keyof ImpactDistribution;
  label: string;
  description: string;
  icon: typeof Factory;
  color: string;
  bgColor: string;
}

const IMPACT_TYPES: ImpactTypeInfo[] = [
  {
    key: 'operational',
    label: 'Impacto Operacional',
    description: 'Sistemas caídos, procesos interrumpidos, productividad perdida',
    icon: Factory,
    color: 'text-red-500',
    bgColor: 'bg-red-500'
  },
  {
    key: 'trust',
    label: 'Impacto en Confianza',
    description: 'Pérdida de clientes, daño reputacional, erosión de marca',
    icon: Heart,
    color: 'text-orange-500',
    bgColor: 'bg-orange-500'
  },
  {
    key: 'compliance',
    label: 'Impacto de Compliance',
    description: 'Multas regulatorias, pérdida de licencias, restricciones',
    icon: Scale,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500'
  },
  {
    key: 'strategic',
    label: 'Impacto Estratégico',
    description: 'Pérdida de IP, ventaja competitiva, oportunidades perdidas',
    icon: TrendingUp,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500'
  }
];

export function ImpactDistributionChart({ 
  distribution, 
  businessModel,
  className 
}: ImpactDistributionChartProps) {
  // Sort impacts by percentage for better visualization
  const sortedImpacts = IMPACT_TYPES
    .map(type => ({
      ...type,
      percentage: distribution[type.key]
    }))
    .sort((a, b) => b.percentage - a.percentage);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("bg-dark-surface rounded-lg border border-dark-border p-6", className)}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-purple-600/10 rounded-lg flex items-center justify-center">
          <AlertTriangle className="w-6 h-6 text-purple-400" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-dark-text">
            Distribución de Impacto de Valor
          </h3>
          <p className="text-sm text-dark-text-secondary">
            Cómo se distribuyen las pérdidas para {businessModel}
          </p>
        </div>
      </div>

      {/* Visual Distribution Bar */}
      <div className="mb-6">
        <div className="flex rounded-lg overflow-hidden h-4 bg-dark-bg">
          {sortedImpacts.map((impact, index) => (
            <motion.div
              key={impact.key}
              initial={{ width: 0 }}
              animate={{ width: `${impact.percentage}%` }}
              transition={{ delay: index * 0.1, duration: 0.8, ease: "easeOut" }}
              className={impact.bgColor}
              style={{ width: `${impact.percentage}%` }}
            />
          ))}
        </div>
        <div className="flex justify-between text-xs text-dark-text-secondary mt-2">
          <span>0%</span>
          <span>Distribución de pérdida de valor</span>
          <span>100%</span>
        </div>
      </div>

      {/* Impact Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sortedImpacts.map((impact, index) => {
          const Icon = impact.icon;
          
          return (
            <motion.div
              key={impact.key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 bg-dark-bg rounded-lg border border-dark-border hover:border-primary-600/30 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                  impact.bgColor + "/10"
                )}>
                  <Icon className={cn("w-5 h-5", impact.color)} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-dark-text text-sm">
                      {impact.label}
                    </h4>
                    <span className={cn("text-2xl font-bold", impact.color)}>
                      {impact.percentage}%
                    </span>
                  </div>
                  
                  <p className="text-xs text-dark-text-secondary leading-relaxed">
                    {impact.description}
                  </p>
                  
                  {/* Priority indicator */}
                  {index === 0 && (
                    <div className="flex items-center gap-1 mt-2">
                      <div className="w-2 h-2 bg-primary-500 rounded-full" />
                      <span className="text-xs text-primary-400 font-medium">
                        Impacto principal
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Insights */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 p-4 bg-blue-600/10 border border-blue-600/20 rounded-lg"
      >
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
          <div>
            <h5 className="text-sm font-medium text-blue-400 mb-1">
              Insight para su modelo de negocio
            </h5>
            <p className="text-sm text-dark-text-secondary">
              {getBusinessModelInsight(businessModel, sortedImpacts[0])}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function getBusinessModelInsight(businessModel: string, topImpact: any): string {
  const insights: Record<string, Record<string, string>> = {
    'operational': {
      'COMERCIO_HIBRIDO': 'Su dependencia de sistemas digitales para ventas hace crítico mantener disponibilidad 24/7.',
      'SOFTWARE_CRITICO': 'Los usuarios dependen de su software para operaciones críticas - cualquier interrupción afecta su negocio.',
      'SERVICIOS_DATOS': 'Sus clientes necesitan acceso continuo a datos - la disponibilidad es su propuesta de valor.',
      'ECOSISTEMA_DIGITAL': 'Su plataforma conecta múltiples actores - las interrupciones se amplifican por efectos de red.',
      'SERVICIOS_FINANCIEROS': 'Las transacciones no pueden esperar - cada minuto de interrupción genera pérdidas directas.',
      'INFRAESTRUCTURA_HEREDADA': 'Los sistemas legacy son frágiles pero críticos - la modernización selectiva es clave.',
      'CADENA_SUMINISTRO': 'La operación just-in-time no tolera interrupciones - necesita redundancia operacional.',
      'INFORMACION_REGULADA': 'Los procesos de compliance requieren disponibilidad continua para evitar violaciones.'
    },
    'trust': {
      'COMERCIO_HIBRIDO': 'La confianza de clientes es su activo más valioso - protegerla debe ser la prioridad máxima.',
      'ECOSISTEMA_DIGITAL': 'Su valor está en la confianza del ecosistema - un incidente afecta a toda la red.',
      'CADENA_SUMINISTRO': 'Los partners necesitan confiar en su seguridad - la reputación impulsa nuevos contratos.',
      'default': 'La confianza de clientes tarda años en construirse y minutos en perderse durante un incidente.'
    },
    'compliance': {
      'SERVICIOS_FINANCIEROS': 'Las multas regulatorias pueden superar el daño operacional - el compliance es supervivencia.',
      'INFORMACION_REGULADA': 'Su licencia para operar depende del cumplimiento - las violaciones pueden cerrar el negocio.',
      'default': 'Las multas y restricciones regulatorias pueden tener impacto duradero en la operación.'
    },
    'strategic': {
      'SOFTWARE_CRITICO': 'Su código e innovación son su ventaja competitiva - protegerlos es proteger su futuro.',
      'SERVICIOS_DATOS': 'Sus algoritmos y datos únicos son su diferenciador - exponerlos beneficia a competidores.',
      'default': 'La propiedad intelectual y ventajas competitivas son difíciles de recuperar una vez expuestas.'
    }
  };

  const impactInsights = insights[topImpact.key] || {};
  return impactInsights[businessModel] || impactInsights['default'] || 
         'Este tipo de impacto es el más significativo para organizaciones como la suya.';
}