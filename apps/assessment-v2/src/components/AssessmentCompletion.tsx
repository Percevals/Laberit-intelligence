import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield,
  Share2,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Users,
  Sparkles,
  Zap,
  Target,
  Brain,
  Lock,
  Layers,
  BarChart3,
  ExternalLink,
  Copy,
  Check
} from 'lucide-react';
import { cn } from '@shared/utils/cn';
import { useDIIDimensionsStore, type DIIDimension, type BusinessModelId } from '@/store/dii-dimensions-store';
import { generateInsightRevelation } from '@/services/insight-revelation-service';

interface DimensionStrength {
  dimension: DIIDimension;
  score: number;
  percentile: number;
  label: string;
  icon: React.ReactNode;
  color: string;
}

interface CompoundEffect {
  dimensions: DIIDimension[];
  effect: 'amplifies' | 'mitigates' | 'compounds';
  message: string;
  severity: 'critical' | 'warning' | 'info';
}

const DIMENSION_METADATA = {
  TRD: { label: 'Protección de Ingresos', icon: '⏱️', color: 'text-red-500' },
  AER: { label: 'Valor como Objetivo', icon: '💰', color: 'text-green-500' },
  HFP: { label: 'Defensa Humana', icon: '👥', color: 'text-blue-500' },
  BRI: { label: 'Control de Daños', icon: '🛡️', color: 'text-purple-500' },
  RRG: { label: 'Velocidad de Recuperación', icon: '🔄', color: 'text-orange-500' }
};

const BUSINESS_MODEL_NAMES: Record<BusinessModelId, string> = {
  1: 'Comercio Híbrido',
  2: 'Software Crítico',
  3: 'Servicios de Datos',
  4: 'Ecosistema Digital',
  5: 'Servicios Financieros',
  6: 'Infraestructura Heredada',
  7: 'Cadena de Suministro',
  8: 'Información Regulada'
};

interface AssessmentCompletionProps {
  onExploreScenarios?: () => void;
  onGetDetailedAnalysis?: () => void;
  className?: string;
}

export function AssessmentCompletion({ 
  onExploreScenarios,
  onGetDetailedAnalysis,
  className 
}: AssessmentCompletionProps) {
  const [copied, setCopied] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);
  
  const {
    businessModelId,
    dimensions,
    currentDII,
    calculateConfidence
  } = useDIIDimensionsStore();

  if (!currentDII || Object.keys(dimensions).length < 5) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Complete las 5 dimensiones para ver su perfil de inmunidad</p>
      </div>
    );
  }

  // Calculate dimension strengths
  const dimensionStrengths: DimensionStrength[] = Object.entries(dimensions)
    .map(([dim, response]) => {
      const dimension = dim as DIIDimension;
      const insight = generateInsightRevelation(
        dimension,
        response,
        businessModelId,
        dimensions,
        currentDII
      );
      
      return {
        dimension,
        score: response.normalizedScore,
        percentile: insight.peerComparison.percentile,
        label: DIMENSION_METADATA[dimension].label,
        icon: DIMENSION_METADATA[dimension].icon,
        color: DIMENSION_METADATA[dimension].color
      };
    })
    .sort((a, b) => b.percentile - a.percentile);

  const topStrengths = dimensionStrengths.slice(0, 2);
  const criticalGaps = dimensionStrengths.slice(-2);

  // Identify compound effects
  const compoundEffects = identifyCompoundEffects(dimensions);

  // Determine immunity level
  const immunityLevel = getImmunityLevel(currentDII.score);

  // Generate recommendations
  const recommendations = generateRecommendations(
    currentDII.score,
    dimensionStrengths,
    compoundEffects
  );

  const handleShare = async () => {
    const shareData = {
      title: 'Mi Puntuación de Inmunidad Digital',
      text: `Obtuve ${currentDII.score} en el Índice de Inmunidad Digital. ¿Qué tan inmune es su organización?`,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share failed:', err);
      }
    } else {
      // Fallback to copy
      handleCopyLink();
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      ref={resultsRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn("max-w-4xl mx-auto space-y-6", className)}
    >
      {/* Header with Score */}
      <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center relative overflow-hidden">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.1 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <Shield className="w-96 h-96" />
        </motion.div>

        <div className="relative z-10">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="mb-6"
          >
            <div className="text-7xl font-bold mb-2">{currentDII.score}</div>
            <div className="text-xl opacity-90">Índice de Inmunidad Digital</div>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-2"
          >
            <div className={cn(
              "text-2xl font-semibold",
              immunityLevel.color
            )}>
              {immunityLevel.label}
            </div>
            <div className="text-lg opacity-80">
              Organización {BUSINESS_MODEL_NAMES[businessModelId]}
            </div>
            <div className="flex items-center justify-center gap-4 text-sm opacity-70">
              <span>Top {100 - (currentDII.percentile || 50)}% en su industria</span>
              <span>•</span>
              <span>{calculateConfidence()}% confianza</span>
            </div>
          </motion.div>
        </div>

        {/* Share buttons */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={handleShare}
            className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
            title="Compartir resultados"
          >
            <Share2 className="w-5 h-5" />
          </button>
          <button
            onClick={handleCopyLink}
            className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
            title="Copiar enlace"
          >
            {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Key Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Strengths */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl border p-6"
        >
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            Sus Fortalezas de Inmunidad
          </h3>
          <div className="space-y-3">
            {topStrengths.map((strength, index) => (
              <motion.div
                key={strength.dimension}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="flex items-center justify-between p-3 bg-green-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{strength.icon}</span>
                  <div>
                    <div className="font-medium text-gray-900">{strength.label}</div>
                    <div className="text-sm text-gray-600">
                      Top {100 - strength.percentile}% rendimiento
                    </div>
                  </div>
                </div>
                <TrendingUp className="w-5 h-5 text-green-600" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Critical Gaps */}
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl border p-6"
        >
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            Brechas Críticas de Inmunidad
          </h3>
          <div className="space-y-3">
            {criticalGaps.map((gap, index) => (
              <motion.div
                key={gap.dimension}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="flex items-center justify-between p-3 bg-red-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{gap.icon}</span>
                  <div>
                    <div className="font-medium text-gray-900">{gap.label}</div>
                    <div className="text-sm text-gray-600">
                      Último {gap.percentile}% en la industria
                    </div>
                  </div>
                </div>
                <TrendingDown className="w-5 h-5 text-red-600" />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Dimension Interaction Effects */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6"
      >
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Layers className="w-5 h-5 text-purple-600" />
          Cómo Interactúan Sus Dimensiones
        </h3>
        <div className="space-y-3">
          {compoundEffects.map((effect, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className={cn(
                "flex items-start gap-3 p-3 rounded-lg",
                effect.severity === 'critical' ? 'bg-red-100' :
                effect.severity === 'warning' ? 'bg-yellow-100' : 'bg-blue-100'
              )}
            >
              <Sparkles className={cn(
                "w-5 h-5 mt-0.5",
                effect.severity === 'critical' ? 'text-red-600' :
                effect.severity === 'warning' ? 'text-yellow-600' : 'text-blue-600'
              )} />
              <div>
                <div className="font-medium text-gray-900">
                  {effect.dimensions.join(' + ')} {effect.effect === 'amplifies' ? '🔥' : effect.effect === 'compounds' ? '🌀' : '🛡️'}
                </div>
                <div className="text-sm text-gray-700">{effect.message}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Visual Breakdown */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="bg-white rounded-xl border p-6"
      >
        <h3 className="font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          Perfil Completo de Inmunidad
        </h3>
        <div className="space-y-4">
          {dimensionStrengths.map((dim, index) => (
            <motion.div
              key={dim.dimension}
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{dim.icon}</span>
                  <span className="font-medium text-gray-700">{dim.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Puntuación: {dim.score.toFixed(1)}</span>
                  <span className={cn(
                    "text-sm font-medium px-2 py-0.5 rounded",
                    dim.percentile >= 70 ? 'bg-green-100 text-green-700' :
                    dim.percentile <= 30 ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  )}>
                    Percentil {dim.percentile}
                  </span>
                </div>
              </div>
              <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${dim.percentile}%` }}
                  transition={{ delay: 0.9 + index * 0.1, duration: 0.5 }}
                  className={cn(
                    "absolute inset-y-0 left-0",
                    dim.percentile >= 70 ? 'bg-green-500' :
                    dim.percentile <= 30 ? 'bg-red-500' :
                    'bg-yellow-500'
                  )}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Clear Next Actions */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="bg-white rounded-xl border p-6"
      >
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-blue-600" />
          Su Plan de Acción de Inmunidad
        </h3>
        <div className="space-y-3">
          {recommendations.map((rec, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 + index * 0.1 }}
              className={cn(
                "flex items-start gap-3 p-4 rounded-lg border",
                rec.priority === 'critical' ? 'border-red-200 bg-red-50' :
                rec.priority === 'high' ? 'border-orange-200 bg-orange-50' :
                'border-blue-200 bg-blue-50'
              )}
            >
              <div className={cn(
                "p-2 rounded-lg",
                rec.priority === 'critical' ? 'bg-red-200' :
                rec.priority === 'high' ? 'bg-orange-200' :
                'bg-blue-200'
              )}>
                {rec.icon}
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900">{rec.title}</div>
                <div className="text-sm text-gray-700 mt-1">{rec.action}</div>
                {rec.impact && (
                  <div className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    {rec.impact}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Call to Action */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.1 }}
        className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white"
      >
        <div className="text-center space-y-4">
          <h3 className="text-2xl font-bold">
            Vea Cómo Mejorar Su Inmunidad
          </h3>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Su perfil de inmunidad revela oportunidades específicas para fortalecer la resiliencia 
            cibernética de su organización. Explore escenarios hipotéticos u obtenga análisis detallado para planificar sus próximos movimientos.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <button
              onClick={onExploreScenarios}
              className="px-6 py-3 bg-white text-blue-600 rounded-lg font-medium 
                       hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
            >
              <Brain className="w-5 h-5" />
              Explorar Escenarios
            </button>
            <button
              onClick={onGetDetailedAnalysis}
              className="px-6 py-3 bg-blue-700 text-white rounded-lg font-medium 
                       hover:bg-blue-800 transition-colors flex items-center justify-center gap-2"
            >
              <Lock className="w-5 h-5" />
              Obtener Análisis Detallado
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Helper functions
function getImmunityLevel(score: number): { label: string; color: string } {
  if (score >= 80) return { label: 'Inmunidad Excelente', color: 'text-green-400' };
  if (score >= 60) return { label: 'Buena Inmunidad', color: 'text-blue-400' };
  if (score >= 40) return { label: 'Inmunidad Moderada', color: 'text-yellow-400' };
  if (score >= 20) return { label: 'Vulnerable', color: 'text-orange-400' };
  return { label: 'Riesgo Crítico', color: 'text-red-400' };
}

function identifyCompoundEffects(
  dimensions: Record<string, any>
): CompoundEffect[] {
  const effects: CompoundEffect[] = [];
  
  // Check for critical combinations
  if (dimensions.TRD?.metricValue <= 6 && dimensions.RRG?.metricValue >= 3) {
    effects.push({
      dimensions: ['TRD', 'RRG'],
      effect: 'amplifies',
      message: 'La pérdida rápida de ingresos combinada con recuperación lenta crea riesgo existencial para el negocio',
      severity: 'critical'
    });
  }
  
  if (dimensions.HFP?.metricValue >= 30 && dimensions.AER?.metricValue >= 500000) {
    effects.push({
      dimensions: ['HFP', 'AER'],
      effect: 'compounds',
      message: 'Humanos vulnerables protegiendo activos valiosos atraen ingeniería social sofisticada',
      severity: 'critical'
    });
  }
  
  if (dimensions.BRI?.metricValue >= 60 && dimensions.TRD?.metricValue <= 12) {
    effects.push({
      dimensions: ['BRI', 'TRD'],
      effect: 'amplifies',
      message: 'Radio de impacto amplio significa que los impactos en ingresos se propagan por toda su operación',
      severity: 'warning'
    });
  }
  
  // Check for mitigating combinations
  if (dimensions.RRG?.metricValue <= 2 && dimensions.HFP?.metricValue <= 15) {
    effects.push({
      dimensions: ['RRG', 'HFP'],
      effect: 'mitigates',
      message: 'Defensas humanas fuertes y recuperación rápida crean resiliencia incluso bajo ataque',
      severity: 'info'
    });
  }
  
  return effects;
}

function generateRecommendations(
  score: number,
  dimensions: DimensionStrength[],
  compoundEffects: CompoundEffect[]
): Array<{
  title: string;
  action: string;
  priority: 'critical' | 'high' | 'medium';
  impact?: string;
  icon: React.ReactNode;
}> {
  const recommendations: Array<{
    title: string;
    action: string;
    priority: 'critical' | 'high' | 'medium';
    impact?: string;
    icon: React.ReactNode;
  }> = [];
  
  // Address critical gaps first
  const criticalGaps = dimensions.filter(d => d.percentile <= 25);
  criticalGaps.forEach(gap => {
    const rec = getDimensionRecommendation(gap.dimension, gap.score);
    recommendations.push({
      ...rec,
      priority: 'critical',
      impact: `Podría mejorar la puntuación de inmunidad en ${Math.round(10 / criticalGaps.length)}+ puntos`
    });
  });
  
  // Address compound effects
  const criticalEffects = compoundEffects.filter(e => e.severity === 'critical');
  if (criticalEffects.length > 0) {
    recommendations.push({
      title: 'Romper Combinaciones de Riesgo Crítico',
      action: 'Sus dimensiones más débiles se están amplificando entre sí. Enfoque en mejorar al menos una dimensión en cada par crítico.',
      priority: 'critical',
      icon: <Layers className="w-5 h-5" />,
      impact: 'Reducir riesgo de fallas en cascada en 60%+'
    });
  }
  
  // General recommendations based on score
  if (score < 40) {
    recommendations.push({
      title: 'Implementar Fundamentos de Seguridad',
      action: 'Su inmunidad necesita atención inmediata. Comience con higiene de seguridad básica y victorias rápidas.',
      priority: 'high',
      icon: <Shield className="w-5 h-5" />
    });
  } else if (score < 70) {
    recommendations.push({
      title: 'Madurar Prácticas de Seguridad',
      action: 'Construya sobre su base con capacidades avanzadas de detección y respuesta a amenazas.',
      priority: 'medium',
      icon: <Target className="w-5 h-5" />
    });
  }
  
  return recommendations.slice(0, 4); // Limit to top 4
}

function getDimensionRecommendation(
  dimension: DIIDimension, 
  _score: number
): { title: string; action: string; icon: React.ReactNode } {
  const recs = {
    TRD: {
      low: {
        title: 'Proteger Flujos de Ingresos',
        action: 'Implemente sistemas redundantes y respaldos fuera de línea para operaciones críticas de ingresos',
        icon: <Shield className="w-5 h-5" />
      }
    },
    AER: {
      low: {
        title: 'Reducir Valor de Ataque',
        action: 'Implemente minimización de datos y limite el acceso a activos de alto valor',
        icon: <Lock className="w-5 h-5" />
      }
    },
    HFP: {
      low: {
        title: 'Fortalecer Defensas Humanas',
        action: 'Lance entrenamiento integral de concienciación de seguridad con simulaciones de phishing',
        icon: <Users className="w-5 h-5" />
      }
    },
    BRI: {
      low: {
        title: 'Contener Radio de Impacto',
        action: 'Implemente segmentación de red y principios de arquitectura de confianza cero',
        icon: <Layers className="w-5 h-5" />
      }
    },
    RRG: {
      low: {
        title: 'Acelerar Recuperación',
        action: 'Pruebe y automatice procedimientos de recuperación con simulacros regulares de recuperación ante desastres',
        icon: <Zap className="w-5 h-5" />
      }
    }
  };
  
  return recs[dimension].low;
}