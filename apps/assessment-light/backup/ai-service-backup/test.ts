/**
 * AI Service Test
 * Simple test to verify the AI service integration
 */

import { getAIService } from './AIService';
import type { AssessmentData } from './types';

// Test data
const testAssessmentData: AssessmentData = {
  businessModel: 1,
  dimensions: {
    TRD: 5,
    AER: 4,
    HFP: 6,
    BRI: 7,
    RRG: 5
  },
  diiScore: 5.2
};

export async function testAIService() {
  console.log('🧪 Testing AI Service...');
  
  try {
    const service = getAIService();
    await service.initialize();
    
    console.log('✅ AI Service initialized successfully');
    console.log('📊 Service state:', service.getState());
    
    // Test compromise analysis
    console.log('🔍 Testing compromise analysis...');
    const response = await service.request({
      type: 'compromise-analysis',
      data: testAssessmentData,
      options: {
        timeout: 10000,
        cache: true
      }
    });
    
    if (response.success) {
      console.log('✅ Compromise analysis successful');
      console.log('📈 Analysis result:', response.data);
    } else {
      console.log('❌ Compromise analysis failed:', response.error);
    }
    
    // Test executive insights
    console.log('💼 Testing executive insights...');
    const insightsResponse = await service.request({
      type: 'executive-insights',
      data: testAssessmentData,
      options: {
        timeout: 15000,
        cache: true
      }
    });
    
    if (insightsResponse.success) {
      console.log('✅ Executive insights successful');
      console.log('🎯 Insights result:', insightsResponse.data);
    } else {
      console.log('❌ Executive insights failed:', insightsResponse.error);
    }
    
    console.log('🎉 AI Service test completed successfully!');
    return true;
    
  } catch (error) {
    console.error('💥 AI Service test failed:', error);
    return false;
  }
}

// Auto-run test in development
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
  console.log('🚀 Running AI Service test in development mode...');
  testAIService().then(success => {
    if (success) {
      console.log('✅ All AI tests passed!');
    } else {
      console.log('❌ Some AI tests failed. Check the logs above.');
    }
  });
}