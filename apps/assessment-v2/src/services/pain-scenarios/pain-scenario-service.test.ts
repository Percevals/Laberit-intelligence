/**
 * Pain Scenario Service Tests
 * Verify the service can retrieve scenarios by business model ID and dimension name
 */

import { painScenarioService } from './pain-scenario-service';
import type { BusinessModelScenarioId, DIIDimension } from '@core/types/pain-scenario.types';

// Test retrieval of a specific scenario
function testSpecificScenario() {
  console.log('=== Testing Specific Scenario Retrieval ===');
  
  const businessModelId: BusinessModelScenarioId = '1_comercio_hibrido';
  const dimension: DIIDimension = 'TRD';
  
  try {
    const result = painScenarioService.getScenario(businessModelId, dimension);
    console.log(`✅ Successfully retrieved scenario for ${businessModelId} - ${dimension}`);
    console.log('Pain Point:', result.scenario.pain_point);
    console.log('Light Question:', result.scenario.light_question);
    console.log('Premium Questions Count:', result.scenario.premium_questions.length);
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Test retrieval of all scenarios for a business model
function testBusinessModelScenarios() {
  console.log('\n=== Testing Business Model Scenarios Retrieval ===');
  
  const businessModelId: BusinessModelScenarioId = '2_software_critico';
  
  try {
    const scenarios = painScenarioService.getBusinessModelScenarios(businessModelId);
    console.log(`✅ Successfully retrieved all scenarios for ${businessModelId}`);
    console.log('Dimensions found:', Object.keys(scenarios));
    
    // Sample one dimension
    console.log('\nSample AER scenario:');
    console.log('Pain Point:', scenarios.AER.pain_point);
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Test retrieval of scenarios by dimension
function testDimensionScenarios() {
  console.log('\n=== Testing Dimension Scenarios Retrieval ===');
  
  const dimension: DIIDimension = 'HFP';
  
  try {
    const scenarios = painScenarioService.getDimensionScenarios(dimension);
    console.log(`✅ Successfully retrieved all ${dimension} scenarios`);
    console.log('Business models found:', Object.keys(scenarios).length);
    
    // Sample one business model
    const sampleKey = Object.keys(scenarios)[0] as BusinessModelScenarioId;
    console.log(`\nSample ${dimension} scenario for ${sampleKey}:`);
    console.log('Root Cause:', scenarios[sampleKey].root_cause);
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Test matrix metadata
function testMatrixInfo() {
  console.log('\n=== Testing Matrix Info ===');
  
  const info = painScenarioService.getMatrixInfo();
  console.log('Matrix Version:', info.version);
  console.log('Description:', info.description);
  console.log('Business Models Count:', info.businessModels.length);
  console.log('Dimensions:', info.dimensions);
}

// Test light questions retrieval
function testLightQuestions() {
  console.log('\n=== Testing Light Questions Retrieval ===');
  
  const businessModelId: BusinessModelScenarioId = '5_servicios_financieros';
  
  try {
    const questions = painScenarioService.getLightQuestions(businessModelId);
    console.log(`✅ Successfully retrieved light questions for ${businessModelId}`);
    console.log('Questions found for dimensions:', Object.keys(questions));
    console.log('\nSample TRD question:');
    console.log(questions.TRD);
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Test premium questions retrieval
function testPremiumQuestions() {
  console.log('\n=== Testing Premium Questions Retrieval ===');
  
  const businessModelId: BusinessModelScenarioId = '8_informacion_regulada';
  const dimension: DIIDimension = 'RRG';
  
  try {
    const questions = painScenarioService.getPremiumQuestions(businessModelId, dimension);
    console.log(`✅ Successfully retrieved premium questions for ${businessModelId} - ${dimension}`);
    console.log('Number of questions:', questions.length);
    console.log('\nFirst question:');
    console.log(questions[0]);
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Test error handling
function testErrorHandling() {
  console.log('\n=== Testing Error Handling ===');
  
  try {
    // @ts-expect-error Testing invalid business model
    painScenarioService.getScenario('invalid_model', 'TRD');
  } catch (error) {
    console.log('✅ Correctly caught invalid business model error:', (error as Error).message);
  }
  
  try {
    // @ts-expect-error Testing invalid dimension
    painScenarioService.getScenario('1_comercio_hibrido', 'INVALID');
  } catch (error) {
    console.log('✅ Correctly caught invalid dimension error:', (error as Error).message);
  }
}

// Run all tests
export function runPainScenarioTests() {
  console.log('🧪 Running Pain Scenario Service Tests\n');
  
  testSpecificScenario();
  testBusinessModelScenarios();
  testDimensionScenarios();
  testMatrixInfo();
  testLightQuestions();
  testPremiumQuestions();
  testErrorHandling();
  
  console.log('\n✅ All tests completed!');
}

// Export for use in dev environment
if (import.meta.env.DEV) {
  // @ts-ignore
  window.runPainScenarioTests = runPainScenarioTests;
  console.log('💡 Run window.runPainScenarioTests() in console to test the service');
}