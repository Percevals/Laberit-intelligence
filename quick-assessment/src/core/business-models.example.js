/**
 * Usage examples for Business Models module
 * @module business-models.example
 */

import {
  businessModels,
  getBusinessModel,
  getBusinessModelByName,
  getResilienceWindow,
  getRegionalExamples,
  getSectorAdjustment,
  getAllBusinessModelsSorted,
  getModelsByDigitalDependency,
  getRiskProfile
} from './business-models.js';

console.log('=== Business Models Module Examples ===\n');

// Example 1: Get model by ID
console.log('Example 1: Get Business Model by ID');
console.log('-'.repeat(50));

const comercioHibrido = getBusinessModel(1);
console.log(`Model: ${comercioHibrido.name}`);
console.log(`Description: ${comercioHibrido.description}`);
console.log(`DII Base: ${comercioHibrido.diiBase.average} (range: ${comercioHibrido.diiBase.range})`);
console.log(`Digital Dependency: ${comercioHibrido.characteristics.digitalDependency}`);
console.log(`Risk Multiplier: ${comercioHibrido.riskMultiplier}x`);

console.log('\n');

// Example 2: Get model by name
console.log('Example 2: Get Business Model by Name');
console.log('-'.repeat(50));

const fintech = getBusinessModelByName('Servicios Financieros');
console.log(`Found: ${fintech.name} (ID: ${fintech.id})`);
console.log(`Critical Factor: ${fintech.characteristics.criticalFactor}`);
console.log(`Customer Channels: ${fintech.characteristics.customerChannels.join(', ')}`);

console.log('\n');

// Example 3: Get resilience window
console.log('Example 3: Resilience Windows Comparison');
console.log('-'.repeat(50));

[1, 4, 5].forEach(id => {
  const window = getResilienceWindow(id);
  console.log(`\n${window.modelName}:`);
  console.log(`  Typical window: ${window.window.typical} hours`);
  console.log(`  Range: ${window.window.minHours}-${window.window.maxHours} hours`);
  console.log(`  Interpretation: ${window.interpretation}`);
});

console.log('\n');

// Example 4: Regional examples
console.log('Example 4: Regional Examples');
console.log('-'.repeat(50));

const softwareExamples = getRegionalExamples(2, 'all');
console.log(`\nExamples for ${softwareExamples.modelName}:`);
console.log('\nLATAM:');
softwareExamples.examples.latam.forEach(ex => {
  console.log(`  - ${ex.company} (${ex.country}) - ${ex.sector}`);
});
console.log('\nSpain:');
softwareExamples.examples.spain.forEach(ex => {
  console.log(`  - ${ex.company} (${ex.country}) - ${ex.sector}`);
});

console.log('\n');

// Example 5: Sector adjustments
console.log('Example 5: Sector Adjustments');
console.log('-'.repeat(50));

const modelId = 5; // Financial Services
const sectors = ['digitalBank', 'paymentProcessor', 'cryptocurrency', 'insurtech'];

console.log(`\nSector adjustments for ${businessModels[modelId].name}:`);
sectors.forEach(sector => {
  const adjustment = getSectorAdjustment(modelId, sector);
  console.log(`  ${sector}: ${adjustment}x`);
});

console.log('\n');

// Example 6: Models sorted by DII Base
console.log('Example 6: Models Sorted by DII Base (Resilience)');
console.log('-'.repeat(50));

const sortedModels = getAllBusinessModelsSorted('desc');
console.log('\nFrom highest to lowest resilience:');
sortedModels.forEach((model, index) => {
  console.log(`${index + 1}. ${model.name}: ${model.diiBase.average} (${model.diiBase.range})`);
});

console.log('\n');

// Example 7: Models by digital dependency
console.log('Example 7: Models by Digital Dependency Level');
console.log('-'.repeat(50));

['low', 'medium', 'high'].forEach(level => {
  const models = getModelsByDigitalDependency(level);
  console.log(`\n${level.toUpperCase()} dependency models:`);
  models.forEach(model => {
    console.log(`  - ${model.name}: ${model.characteristics.digitalDependency}`);
  });
});

console.log('\n');

// Example 8: Risk profiles
console.log('Example 8: Risk Profiles Analysis');
console.log('-'.repeat(50));

console.log('\nRisk profiles for all models:');
getAllBusinessModelsSorted('asc').forEach(model => {
  const profile = getRiskProfile(model.id);
  console.log(`\n${profile.modelName}:`);
  console.log(`  Risk Level: ${profile.riskLevel} (${profile.riskMultiplier}x)`);
  console.log(`  DII Base: ${profile.diiBase}`);
  console.log(`  Resilience Window: ${profile.resilienceWindow} hours`);
  console.log(`  Recommendation: ${profile.recommendation}`);
});

console.log('\n');

// Example 9: Business model comparison table
console.log('Example 9: Business Model Comparison Table');
console.log('-'.repeat(50));

console.log('\n| Model | DII Base | Risk | Digital Dep. | Resilience (h) |');
console.log('|-------|----------|------|--------------|----------------|');

Object.values(businessModels).forEach(model => {
  const riskProfile = getRiskProfile(model.id);
  console.log(
    `| ${model.name.padEnd(21)} | ${
      model.diiBase.average.toFixed(2).padEnd(8)
    } | ${
      riskProfile.riskLevel.padEnd(4)
    } | ${
      model.characteristics.digitalDependency.padEnd(12)
    } | ${
      model.resilienceWindow.typical.toString().padEnd(14)
    } |`
  );
});

console.log('\n');

// Example 10: Find models for specific criteria
console.log('Example 10: Finding Models by Criteria');
console.log('-'.repeat(50));

// Find models with high resilience (DII Base > 1.0)
const highResilience = Object.values(businessModels).filter(m => m.diiBase.average > 1.0);
console.log('\nModels with high resilience (DII Base > 1.0):');
highResilience.forEach(model => {
  console.log(`  - ${model.name}: ${model.diiBase.average}`);
});

// Find models with critical risk (multiplier > 2.5)
const criticalRisk = Object.values(businessModels).filter(m => m.riskMultiplier > 2.5);
console.log('\nModels with critical risk (multiplier > 2.5):');
criticalRisk.forEach(model => {
  console.log(`  - ${model.name}: ${model.riskMultiplier}x`);
});

// Find models that can operate > 24h without digital systems
const longResilience = Object.values(businessModels).filter(m => m.resilienceWindow.typical > 24);
console.log('\nModels that can operate >24h without digital systems:');
longResilience.forEach(model => {
  console.log(`  - ${model.name}: ${model.resilienceWindow.typical}h`);
});

console.log('\n=== End of Examples ===');