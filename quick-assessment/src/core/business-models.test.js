/**
 * Unit tests for Business Models module
 * @module business-models.test
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

/**
 * Test runner
 */
function runTests() {
  const tests = [];
  let passed = 0;
  let failed = 0;

  function test(name, fn) {
    tests.push({ name, fn });
  }

  function assert(condition, message) {
    if (!condition) {
      throw new Error(message || 'Assertion failed');
    }
  }

  // Define tests
  test('businessModels - all 8 models defined', () => {
    assert(Object.keys(businessModels).length === 8, 'Should have exactly 8 models');
    for (let i = 1; i <= 8; i++) {
      assert(businessModels[i], `Model ${i} should exist`);
      assert(businessModels[i].id === i, `Model ${i} should have correct id`);
    }
  });

  test('businessModels - required properties', () => {
    Object.values(businessModels).forEach(model => {
      assert(model.id, 'Should have id');
      assert(model.key, 'Should have key');
      assert(model.name, 'Should have name');
      assert(model.nameEn, 'Should have English name');
      assert(model.description, 'Should have description');
      assert(model.diiBase, 'Should have diiBase');
      assert(model.characteristics, 'Should have characteristics');
      assert(model.resilienceWindow, 'Should have resilienceWindow');
      assert(model.riskMultiplier, 'Should have riskMultiplier');
      assert(model.examples, 'Should have examples');
      assert(model.sectorAdjustments, 'Should have sectorAdjustments');
    });
  });

  test('getBusinessModel - valid ID', () => {
    const model = getBusinessModel(1);
    assert(model !== null, 'Should return model');
    assert(model.name === 'Comercio Híbrido', 'Should be Comercio Híbrido');
    assert(model.diiBase.average === 1.75, 'Should have correct DII base');
  });

  test('getBusinessModel - invalid ID', () => {
    assert(getBusinessModel(0) === null, 'Should return null for 0');
    assert(getBusinessModel(9) === null, 'Should return null for 9');
    assert(getBusinessModel('1') === null, 'Should return null for string');
    assert(getBusinessModel(null) === null, 'Should return null for null');
  });

  test('getBusinessModelByName - Spanish name', () => {
    const model = getBusinessModelByName('Software Crítico');
    assert(model !== null, 'Should find model');
    assert(model.id === 2, 'Should be model 2');
  });

  test('getBusinessModelByName - English name', () => {
    const model = getBusinessModelByName('Digital Ecosystem');
    assert(model !== null, 'Should find model');
    assert(model.id === 4, 'Should be model 4');
  });

  test('getBusinessModelByName - key name', () => {
    const model = getBusinessModelByName('SERVICIOS_FINANCIEROS');
    assert(model !== null, 'Should find model');
    assert(model.id === 5, 'Should be model 5');
  });

  test('getBusinessModelByName - case insensitive', () => {
    const model = getBusinessModelByName('COMERCIO híbrido');
    assert(model !== null, 'Should find model');
    assert(model.id === 1, 'Should be model 1');
  });

  test('getBusinessModelByName - not found', () => {
    assert(getBusinessModelByName('Invalid Model') === null, 'Should return null');
    assert(getBusinessModelByName('') === null, 'Should return null for empty');
    assert(getBusinessModelByName(null) === null, 'Should return null for null');
  });

  test('getResilienceWindow - valid model', () => {
    const window = getResilienceWindow(1);
    assert(window !== null, 'Should return window');
    assert(window.modelId === 1, 'Should have model ID');
    assert(window.window.typical === 36, 'Should have typical hours');
    assert(window.interpretation.includes('múltiples días'), 'Should have interpretation');
  });

  test('getResilienceWindow - financial services', () => {
    const window = getResilienceWindow(5);
    assert(window.window.typical === 1, 'Should have 1 hour typical');
    assert(window.interpretation.includes('crítica'), 'Should mention critical');
  });

  test('getRegionalExamples - LATAM', () => {
    const examples = getRegionalExamples(1, 'latam');
    assert(examples !== null, 'Should return examples');
    assert(examples.region === 'LATAM', 'Should be LATAM region');
    assert(Array.isArray(examples.examples), 'Should have examples array');
    assert(examples.examples.length > 0, 'Should have examples');
    assert(examples.examples[0].company === 'Falabella', 'Should have Falabella');
  });

  test('getRegionalExamples - Spain', () => {
    const examples = getRegionalExamples(2, 'spain');
    assert(examples !== null, 'Should return examples');
    assert(examples.region === 'España', 'Should be España region');
    assert(examples.examples.some(e => e.country === 'España'), 'Should have Spanish companies');
  });

  test('getRegionalExamples - all regions', () => {
    const examples = getRegionalExamples(3, 'all');
    assert(examples !== null, 'Should return examples');
    assert(examples.examples.latam, 'Should have LATAM examples');
    assert(examples.examples.spain, 'Should have Spain examples');
  });

  test('getSectorAdjustment - exact match', () => {
    const adjustment = getSectorAdjustment(1, 'retail');
    assert(adjustment === 1.0, 'Should return retail adjustment');
  });

  test('getSectorAdjustment - partial match', () => {
    const adjustment = getSectorAdjustment(5, 'digital');
    assert(adjustment === 1.2, 'Should match digitalBank');
  });

  test('getSectorAdjustment - no match', () => {
    const adjustment = getSectorAdjustment(1, 'unknown');
    assert(adjustment === 1.0, 'Should return default 1.0');
  });

  test('getAllBusinessModelsSorted - ascending', () => {
    const models = getAllBusinessModelsSorted('asc');
    assert(models.length === 8, 'Should have 8 models');
    assert(models[0].diiBase.average <= models[1].diiBase.average, 'Should be ascending');
    assert(models[0].id === 6, 'First should be Infrastructure (lowest DII)');
  });

  test('getAllBusinessModelsSorted - descending', () => {
    const models = getAllBusinessModelsSorted('desc');
    assert(models[0].diiBase.average >= models[1].diiBase.average, 'Should be descending');
    assert(models[0].id === 1, 'First should be Comercio Híbrido (highest DII)');
  });

  test('getModelsByDigitalDependency - low', () => {
    const models = getModelsByDigitalDependency('low');
    assert(models.length > 0, 'Should have low dependency models');
    assert(models.some(m => m.id === 6), 'Should include Infrastructure');
  });

  test('getModelsByDigitalDependency - high', () => {
    const models = getModelsByDigitalDependency('high');
    assert(models.length > 0, 'Should have high dependency models');
    assert(models.some(m => m.id === 4), 'Should include Digital Ecosystem');
    assert(models.some(m => m.id === 5), 'Should include Financial Services');
  });

  test('getRiskProfile - complete profile', () => {
    const profile = getRiskProfile(5);
    assert(profile !== null, 'Should return profile');
    assert(profile.modelName === 'Servicios Financieros', 'Should have model name');
    assert(profile.riskMultiplier === 3.5, 'Should have risk multiplier');
    assert(profile.riskLevel === 'Crítico', 'Should be critical risk');
    assert(profile.recommendation.includes('Zero Trust'), 'Should recommend Zero Trust');
  });

  test('getRiskProfile - low risk model', () => {
    const profile = getRiskProfile(1);
    assert(profile.riskLevel === 'Bajo', 'Should be low risk');
    assert(profile.recommendation.includes('redundancia natural'), 'Should mention natural redundancy');
  });

  test('DII Base ranges validation', () => {
    Object.values(businessModels).forEach(model => {
      assert(model.diiBase.min < model.diiBase.max, 'Min should be less than max');
      assert(model.diiBase.average >= model.diiBase.min, 'Average should be >= min');
      assert(model.diiBase.average <= model.diiBase.max, 'Average should be <= max');
    });
  });

  test('Risk multipliers range', () => {
    Object.values(businessModels).forEach(model => {
      assert(model.riskMultiplier >= 1.0, 'Risk multiplier should be >= 1.0');
      assert(model.riskMultiplier <= 3.5, 'Risk multiplier should be <= 3.5');
    });
  });

  // Run all tests
  console.log('Running Business Models Tests...\n');

  tests.forEach(({ name, fn }) => {
    try {
      fn();
      console.log(`✓ ${name}`);
      passed++;
    } catch (error) {
      console.log(`✗ ${name}`);
      console.log(`  Error: ${error.message}\n`);
      failed++;
    }
  });

  console.log(`\nTest Results: ${passed} passed, ${failed} failed`);
  console.log(`Total: ${tests.length} tests`);

  return failed === 0;
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const success = runTests();
  process.exit(success ? 0 : 1);
}

export { runTests };