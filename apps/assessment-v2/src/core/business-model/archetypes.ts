/**
 * DII 4.0 Business Model Archetypes
 * Grouping patterns for how organizations lose value
 */

export interface Archetype {
  id: string;
  name: string;
  emoji: string;
  description: string;
  lossPattern: string;
  typicalLoss: string;
  models: number[]; // Business model IDs
}

export const ARCHETYPES: Record<string, Archetype> = {
  CUSTODIOS: {
    id: 'CUSTODIOS',
    name: 'Custodios',
    emoji: '🏛️',
    description: 'Guardianes de activos críticos ajenos',
    lossPattern: 'Licencia para operar',
    typicalLoss: '$100K+/hora',
    models: [5, 8] // Servicios Financieros, Información Regulada
  },
  CONECTORES: {
    id: 'CONECTORES', 
    name: 'Conectores',
    emoji: '🌐',
    description: 'Facilitadores de transacciones entre desconocidos',
    lossPattern: 'Usuarios del ecosistema',
    typicalLoss: '$50-100K/hora',
    models: [4, 7] // Ecosistema Digital, Cadena de Suministro
  },
  PROCESADORES: {
    id: 'PROCESADORES',
    name: 'Procesadores',
    emoji: '⚙️',
    description: 'Transformadores de información en decisiones',
    lossPattern: 'Ventaja competitiva',
    typicalLoss: '$20-50K/hora',
    models: [2, 3] // Software Crítico, Servicios de Datos
  },
  REDUNDANTES: {
    id: 'REDUNDANTES',
    name: 'Redundantes',
    emoji: '🛡️',
    description: 'Operadores con múltiples caminos al valor',
    lossPattern: 'Eficiencia operacional',
    typicalLoss: '$5-20K/hora',
    models: [1, 6] // Comercio Híbrido, Infraestructura Heredada
  }
};

// Helper function to get archetype by model ID
export function getArchetypeByModel(modelId: number): Archetype | undefined {
  return Object.values(ARCHETYPES).find(arch => arch.models.includes(modelId));
}

// Questions for classification
export const CLASSIFICATION_QUESTIONS = {
  systemFailure: {
    es: "¿Qué pasa si sus sistemas fallan completamente?",
    en: "What happens if your systems fail completely?"
  },
  worstNightmare: {
    es: "¿Cuál es su peor pesadilla?",
    en: "What is your worst nightmare?"
  }
};

// Impact distribution by archetype
export const IMPACT_DISTRIBUTION = {
  CUSTODIOS: {
    operational: 20,
    trust: 35,
    compliance: 40,
    strategic: 5
  },
  CONECTORES: {
    operational: 35,
    trust: 40,
    compliance: 15,
    strategic: 10
  },
  PROCESADORES: {
    operational: 35,
    trust: 25,
    compliance: 15,
    strategic: 25
  },
  REDUNDANTES: {
    operational: 55,
    trust: 25,
    compliance: 15,
    strategic: 5
  }
};