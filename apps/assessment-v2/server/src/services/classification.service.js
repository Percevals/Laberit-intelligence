// Business model classification service
// This is a simplified version - in production, import from the frontend code

const BUSINESS_MODELS = {
  COMERCIO_HIBRIDO: 'Hybrid Commerce',
  SOFTWARE_CRITICO: 'Critical Software',
  SERVICIOS_DATOS: 'Data Services',
  ECOSISTEMA_DIGITAL: 'Digital Ecosystem',
  SERVICIOS_FINANCIEROS: 'Financial Services',
  INFRAESTRUCTURA_HEREDADA: 'Legacy Infrastructure',
  CADENA_SUMINISTRO: 'Supply Chain',
  INFORMACION_REGULADA: 'Regulated Information'
};

export function classifyBusinessModel(input) {
  const { companyName, industry, description, employees, revenue } = input;
  
  // Simple industry-based classification
  const industryLower = (industry || '').toLowerCase();
  
  // Financial services
  if (industryLower.includes('financ') || industryLower.includes('bank') || 
      industryLower.includes('insurance') || industryLower.includes('fintech')) {
    return {
      model: 'SERVICIOS_FINANCIEROS',
      confidence: 85,
      reasoning: 'Financial industry with high regulatory requirements'
    };
  }
  
  // Software/Technology
  if (industryLower.includes('software') || industryLower.includes('saas') || 
      industryLower.includes('technology') || industryLower.includes('tech')) {
    return {
      model: 'SOFTWARE_CRITICO',
      confidence: 80,
      reasoning: 'Software company requiring high availability'
    };
  }
  
  // Healthcare
  if (industryLower.includes('health') || industryLower.includes('medical') || 
      industryLower.includes('pharma')) {
    return {
      model: 'INFORMACION_REGULADA',
      confidence: 85,
      reasoning: 'Healthcare industry with sensitive data regulations'
    };
  }
  
  // Retail/Commerce
  if (industryLower.includes('retail') || industryLower.includes('commerce') || 
      industryLower.includes('store')) {
    return {
      model: 'COMERCIO_HIBRIDO',
      confidence: 75,
      reasoning: 'Retail operations with physical and digital channels'
    };
  }
  
  // Logistics
  if (industryLower.includes('logistic') || industryLower.includes('transport') || 
      industryLower.includes('delivery')) {
    return {
      model: 'CADENA_SUMINISTRO',
      confidence: 80,
      reasoning: 'Logistics company with supply chain dependencies'
    };
  }
  
  // Data/Analytics
  if (industryLower.includes('data') || industryLower.includes('analytics') || 
      industryLower.includes('intelligence')) {
    return {
      model: 'SERVICIOS_DATOS',
      confidence: 75,
      reasoning: 'Data-centric business model'
    };
  }
  
  // Manufacturing/Industry
  if (industryLower.includes('manufactur') || industryLower.includes('industrial') || 
      industryLower.includes('factory')) {
    return {
      model: 'INFRAESTRUCTURA_HEREDADA',
      confidence: 70,
      reasoning: 'Manufacturing with legacy systems'
    };
  }
  
  // Default to ecosystem if platform/marketplace
  if (industryLower.includes('platform') || industryLower.includes('marketplace')) {
    return {
      model: 'ECOSISTEMA_DIGITAL',
      confidence: 70,
      reasoning: 'Platform business with ecosystem dependencies'
    };
  }
  
  // Default fallback based on company size
  if (employees > 5000 || revenue > 100000000) {
    return {
      model: 'INFRAESTRUCTURA_HEREDADA',
      confidence: 60,
      reasoning: 'Large company likely with legacy infrastructure'
    };
  }
  
  return {
    model: 'SOFTWARE_CRITICO',
    confidence: 50,
    reasoning: 'Default classification - manual review recommended'
  };
}