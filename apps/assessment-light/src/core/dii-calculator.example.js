/**
 * Usage examples for DII Calculator
 * @module dii-calculator.example
 */

import {
  calculateDII,
  BUSINESS_MODELS,
  DII_BASE_VALUES
} from './dii-calculator.js';

console.log('=== Digital Immunity Index 4.0 Calculator Examples ===\n');

// Example 1: High-performing Comercio Híbrido
console.log('Example 1: High-performing Retail Chain (Comercio Híbrido)');
console.log('-'.repeat(50));

const retailExample = calculateDII({
  businessModel: BUSINESS_MODELS.COMERCIO_HIBRIDO,
  dimensions: {
    TRD: 8,  // Excellent time to revenue degradation (slow impact)
    AER: 7,  // Good attack economics (expensive to attack)
    HFP: 3,  // Low human failure probability (good training)
    BRI: 2,  // Very low blast radius (excellent segmentation)
    RRG: 3   // Good recovery capability
  }
});

if (retailExample.success) {
  const { results } = retailExample;
  console.log(`DII Raw Score: ${results.diiRaw}`);
  console.log(`DII Normalized Score: ${results.diiScore}/10`);
  console.log(`Maturity Stage: ${results.stage.name} (${results.stage.stage})`);
  console.log(`Percentile: ${results.percentile}th percentile`);
  console.log(`\nExecutive Summary:`);
  console.log(results.interpretation.executiveSummary);
  console.log(`\nOperational Impact: ${results.interpretation.operationalImpact}`);
  console.log(`Recovery Capability: ${results.interpretation.recoveryCapability}`);
}

console.log('\n');

// Example 2: Struggling Fintech
console.log('Example 2: Struggling Fintech (Servicios Financieros)');
console.log('-'.repeat(50));

const fintechExample = calculateDII({
  businessModel: BUSINESS_MODELS.SERVICIOS_FINANCIEROS,
  dimensions: {
    TRD: 2,  // Poor - rapid revenue impact
    AER: 3,  // Low - attractive target
    HFP: 7,  // High - many human vulnerabilities
    BRI: 8,  // Very high - flat architecture
    RRG: 6   // Poor recovery reality
  }
});

if (fintechExample.success) {
  const { results } = fintechExample;
  console.log(`DII Raw Score: ${results.diiRaw}`);
  console.log(`DII Normalized Score: ${results.diiScore}/10`);
  console.log(`Maturity Stage: ${results.stage.name} (${results.stage.stage})`);
  console.log(`Percentile: ${results.percentile}th percentile`);
  console.log(`\nRisk Assessment:`);
  console.log(results.interpretation.riskLevel);
  console.log(`\nPrimary Recommendation:`);
  console.log(results.interpretation.primaryRecommendation);
  console.log(`\nBenchmark Position:`);
  console.log(results.interpretation.benchmarkPosition);
}

console.log('\n');

// Example 3: Average Software Company
console.log('Example 3: Average Software Company (Software Crítico)');
console.log('-'.repeat(50));

const softwareExample = calculateDII({
  businessModel: BUSINESS_MODELS.SOFTWARE_CRITICO,
  dimensions: {
    TRD: 5,  // Average
    AER: 5,  // Average
    HFP: 5,  // Average
    BRI: 5,  // Average
    RRG: 5   // Average
  }
});

if (softwareExample.success) {
  const { results } = softwareExample;
  console.log(`DII Raw Score: ${results.diiRaw}`);
  console.log(`DII Normalized Score: ${results.diiScore}/10`);
  console.log(`Maturity Stage: ${results.stage.name}`);
  console.log(`Color Code: ${results.stage.color}`);
  console.log(`\nFull Interpretation:`);
  console.log(JSON.stringify(results.interpretation, null, 2));
}

console.log('\n');

// Example 4: Comparison across business models
console.log('Example 4: Same dimensions, different business models');
console.log('-'.repeat(50));

const testDimensions = {
  TRD: 6,
  AER: 6,
  HFP: 4,
  BRI: 3,
  RRG: 3
};

console.log('Test dimensions:', testDimensions);
console.log('\nResults by business model:');

Object.entries(BUSINESS_MODELS).forEach(([name, id]) => {
  const result = calculateDII({
    businessModel: id,
    dimensions: testDimensions
  });
  
  if (result.success) {
    const baseValue = DII_BASE_VALUES[id];
    console.log(`\n${name}:`);
    console.log(`  DII Base: ${baseValue}`);
    console.log(`  DII Score: ${result.results.diiScore}/10`);
    console.log(`  Stage: ${result.results.stage.name}`);
    console.log(`  Percentile: ${result.results.percentile}th`);
  }
});

console.log('\n');

// Example 5: Error handling
console.log('Example 5: Error Handling');
console.log('-'.repeat(50));

// Invalid business model
const errorExample1 = calculateDII({
  businessModel: 99,
  dimensions: { TRD: 5, AER: 5, HFP: 5, BRI: 5, RRG: 5 }
});

console.log('Invalid business model result:', errorExample1);

// Missing dimension
const errorExample2 = calculateDII({
  businessModel: BUSINESS_MODELS.COMERCIO_HIBRIDO,
  dimensions: { TRD: 5, AER: 5, HFP: 5, BRI: 5 } // Missing RRG
});

console.log('\nMissing dimension result:', errorExample2);

// Out of range value
const errorExample3 = calculateDII({
  businessModel: BUSINESS_MODELS.COMERCIO_HIBRIDO,
  dimensions: { TRD: 15, AER: 5, HFP: 5, BRI: 5, RRG: 5 }
});

console.log('\nOut of range value result:', errorExample3);

console.log('\n=== End of Examples ===');