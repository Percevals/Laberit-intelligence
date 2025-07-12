/**
 * Unit tests for DII Calculator
 * @module dii-calculator.test
 */

import {
  calculateDII,
  calculateDIIRaw,
  normalizeDIIScore,
  getMaturityStage,
  calculatePercentile,
  validateInputs,
  BUSINESS_MODELS,
  DII_BASE_VALUES,
  MATURITY_STAGES
} from './dii-calculator.js';

/**
 * Test runner utility
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

  function assertClose(actual, expected, tolerance = 0.001, message) {
    const diff = Math.abs(actual - expected);
    if (diff > tolerance) {
      throw new Error(message || `Expected ${expected}, got ${actual} (diff: ${diff})`);
    }
  }

  // Define tests
  test('calculateDIIRaw - basic calculation', () => {
    const result = calculateDIIRaw(5, 6, 3, 4, 2);
    assertClose(result, 1.25, 0.001, 'DII Raw should be (5*6)/(3*4*2) = 1.25');
  });

  test('calculateDIIRaw - edge case with 1s', () => {
    const result = calculateDIIRaw(1, 1, 1, 1, 1);
    assertClose(result, 1.0, 0.001, 'DII Raw with all 1s should be 1.0');
  });

  test('calculateDIIRaw - high resilience scenario', () => {
    const result = calculateDIIRaw(10, 10, 1, 1, 1);
    assertClose(result, 100.0, 0.001, 'Maximum resilience scenario');
  });

  test('calculateDIIRaw - input validation', () => {
    try {
      calculateDIIRaw(0, 5, 5, 5, 5);
      throw new Error('Should have thrown error for out of range input');
    } catch (e) {
      assert(e.message.includes('must be between 1 and 10'), 'Should validate range');
    }
  });

  test('normalizeDIIScore - Comercio Híbrido', () => {
    const diiRaw = 1.75;
    const normalized = normalizeDIIScore(diiRaw, BUSINESS_MODELS.COMERCIO_HIBRIDO);
    assertClose(normalized, 10.0, 0.01, 'Should normalize to 10.0');
  });

  test('normalizeDIIScore - Servicios Financieros', () => {
    const diiRaw = 0.4;
    const normalized = normalizeDIIScore(diiRaw, BUSINESS_MODELS.SERVICIOS_FINANCIEROS);
    assertClose(normalized, 10.0, 0.01, 'Should normalize to 10.0');
  });

  test('normalizeDIIScore - caps at 10', () => {
    const diiRaw = 5.0; // Very high raw score
    const normalized = normalizeDIIScore(diiRaw, BUSINESS_MODELS.SERVICIOS_FINANCIEROS);
    assert(normalized === 10, 'Should cap at 10');
  });

  test('getMaturityStage - Frágil', () => {
    const stage = getMaturityStage(3.5);
    assert(stage.stage === 'FRAGIL', 'Should be Frágil stage');
    assert(stage.color === '#e74c3c', 'Should have correct color');
  });

  test('getMaturityStage - Robusto', () => {
    const stage = getMaturityStage(5.0);
    assert(stage.stage === 'ROBUSTO', 'Should be Robusto stage');
    assert(stage.color === '#f39c12', 'Should have correct color');
  });

  test('getMaturityStage - Resiliente', () => {
    const stage = getMaturityStage(7.0);
    assert(stage.stage === 'RESILIENTE', 'Should be Resiliente stage');
    assert(stage.color === '#2ecc71', 'Should have correct color');
  });

  test('getMaturityStage - Adaptativo', () => {
    const stage = getMaturityStage(8.5);
    assert(stage.stage === 'ADAPTATIVO', 'Should be Adaptativo stage');
    assert(stage.color === '#3498db', 'Should have correct color');
  });

  test('calculatePercentile - median performer', () => {
    const percentile = calculatePercentile(5.5, BUSINESS_MODELS.COMERCIO_HIBRIDO);
    assert(percentile >= 45 && percentile <= 55, 'Should be around 50th percentile');
  });

  test('calculatePercentile - top performer', () => {
    const percentile = calculatePercentile(8.0, BUSINESS_MODELS.COMERCIO_HIBRIDO);
    assert(percentile >= 90, 'Should be in top 10%');
  });

  test('calculatePercentile - bottom performer', () => {
    const percentile = calculatePercentile(2.0, BUSINESS_MODELS.COMERCIO_HIBRIDO);
    assert(percentile <= 10, 'Should be in bottom 10%');
  });

  test('validateInputs - valid inputs', () => {
    const result = validateInputs({
      TRD: 5, AER: 6, HFP: 3, BRI: 4, RRG: 2
    });
    assert(result.isValid === true, 'Should be valid');
    assert(result.errors.length === 0, 'Should have no errors');
  });

  test('validateInputs - missing dimension', () => {
    const result = validateInputs({
      TRD: 5, AER: 6, HFP: 3, BRI: 4
      // Missing RRG
    });
    assert(result.isValid === false, 'Should be invalid');
    assert(result.errors.some(e => e.includes('RRG')), 'Should mention missing RRG');
  });

  test('validateInputs - out of range', () => {
    const result = validateInputs({
      TRD: 11, AER: 6, HFP: 3, BRI: 4, RRG: 2
    });
    assert(result.isValid === false, 'Should be invalid');
    assert(result.errors.some(e => e.includes('between 1 and 10')), 'Should mention range');
  });

  test('calculateDII - complete calculation for Software Crítico', () => {
    const result = calculateDII({
      businessModel: BUSINESS_MODELS.SOFTWARE_CRITICO,
      dimensions: { TRD: 6, AER: 7, HFP: 4, BRI: 3, RRG: 2 }
    });

    assert(result.success === true, 'Should succeed');
    assert(result.results.diiRaw > 0, 'Should have positive raw score');
    assert(result.results.diiScore >= 1 && result.results.diiScore <= 10, 'Score in range');
    assert(result.results.stage.stage, 'Should have stage');
    assert(result.results.percentile >= 0 && result.results.percentile <= 100, 'Valid percentile');
    assert(result.results.interpretation.executiveSummary, 'Should have interpretation');
  });

  test('calculateDII - complete calculation for Servicios Financieros', () => {
    const result = calculateDII({
      businessModel: BUSINESS_MODELS.SERVICIOS_FINANCIEROS,
      dimensions: { TRD: 3, AER: 4, HFP: 8, BRI: 7, RRG: 6 }
    });

    assert(result.success === true, 'Should succeed');
    const expectedRaw = (3 * 4) / (8 * 7 * 6); // 0.0357
    assertClose(result.results.diiRaw, expectedRaw, 0.001, 'Raw calculation correct');
  });

  test('calculateDII - error handling for invalid business model', () => {
    const result = calculateDII({
      businessModel: 99,
      dimensions: { TRD: 5, AER: 5, HFP: 5, BRI: 5, RRG: 5 }
    });

    assert(result.success === false, 'Should fail');
    assert(result.error.includes('between 1 and 8'), 'Should have appropriate error');
  });

  test('calculateDII - error handling for invalid dimensions', () => {
    const result = calculateDII({
      businessModel: BUSINESS_MODELS.COMERCIO_HIBRIDO,
      dimensions: { TRD: 0, AER: 5, HFP: 5, BRI: 5, RRG: 5 }
    });

    assert(result.success === false, 'Should fail');
    assert(result.error.includes('Invalid dimensions'), 'Should have appropriate error');
  });

  // Run all tests
  console.log('Running DII Calculator Tests...\n');

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