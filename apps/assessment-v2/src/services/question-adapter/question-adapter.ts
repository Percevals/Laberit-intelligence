/**
 * Question Adapter Service
 * Adapts scenario questions based on company context
 */

import type {
  QuestionContext,
  TemplateVariables,
  AdaptedQuestion,
  AdaptationRequest,
  BatchAdaptationResponse
} from './types';
import type { AIProvider } from '@services/ai/types';

export class QuestionAdapter {
  private aiProvider?: AIProvider | undefined;
  
  constructor(aiProvider?: AIProvider) {
    this.aiProvider = aiProvider;
  }

  /**
   * Adapt a single question based on company context
   */
  async adaptQuestion(request: AdaptationRequest): Promise<AdaptedQuestion> {
    // const startTime = performance.now(); // Reserved for future use
    
    // Extract the question to adapt
    const originalQuestion = this.extractQuestion(request);
    
    // Build template variables from context
    const variables = this.buildTemplateVariables(request.context);
    
    // Perform adaptation
    let adapted: string;
    let aiEnhanced = false;
    let confidence = 1.0;
    
    if (request.useAI && this.aiProvider) {
      // Use AI for more sophisticated adaptation
      const aiResult = await this.adaptWithAI(originalQuestion, variables, request.context);
      adapted = aiResult.adapted;
      aiEnhanced = true;
      confidence = aiResult.confidence;
    } else {
      // Use simple template replacement
      adapted = this.adaptWithTemplates(originalQuestion, variables);
      confidence = 0.8; // Lower confidence for template-only adaptation
    }
    
    return {
      original: originalQuestion,
      adapted,
      variables,
      aiEnhanced,
      confidence
    };
  }

  /**
   * Adapt multiple questions in batch
   */
  async adaptBatch(
    requests: AdaptationRequest[]
  ): Promise<BatchAdaptationResponse> {
    const startTime = performance.now();
    
    const questions = await Promise.all(
      requests.map(req => this.adaptQuestion(req))
    );
    
    const endTime = performance.now();
    
    return {
      questions,
      processingTime: endTime - startTime,
      aiUsed: questions.some(q => q.aiEnhanced),
      provider: this.aiProvider?.name || undefined
    };
  }

  /**
   * Extract the specific question from the scenario
   */
  private extractQuestion(request: AdaptationRequest): string {
    const { scenario, questionType, questionIndex = 0 } = request;
    
    if (questionType === 'light') {
      // Use measurement_question for v2.0.0, fallback to light_question
      return scenario.measurement_question || scenario.light_question || '';
    } else {
      return scenario.premium_questions?.[questionIndex] || scenario.premium_questions?.[0] || '';
    }
  }

  /**
   * Build template variables from company context
   */
  private buildTemplateVariables(context: QuestionContext): TemplateVariables {
    const { company } = context;
    
    // Calculate dynamic thresholds based on company size
    const amountThreshold = this.calculateAmountThreshold(company.revenue, company.employees);
    const timeThreshold = this.calculateTimeThreshold(company.employees);
    const percentageThreshold = this.calculatePercentageThreshold(company.revenue);
    
    return {
      companyName: company.name,
      revenue: this.formatRevenue(company.revenue),
      employees: this.formatEmployees(company.employees),
      industry: company.industry,
      location: company.headquarters || company.country,
      amountThreshold,
      timeThreshold,
      percentageThreshold
    };
  }

  /**
   * Simple template-based adaptation
   */
  private adaptWithTemplates(question: string, variables: TemplateVariables): string {
    let adapted = question;
    
    // Common replacements
    const replacements: Record<string, string | undefined> = {
      'tu empresa': variables.companyName,
      'tu compañía': variables.companyName,
      'tu organización': variables.companyName,
      'tu negocio': variables.companyName,
      'tus sistemas': `los sistemas de ${variables.companyName}`,
      'tus empleados': `los empleados de ${variables.companyName}`,
      'tus clientes': `los clientes de ${variables.companyName}`,
      '$100K': variables.amountThreshold,
      '$500': this.calculateMinorAmount(variables.amountThreshold || undefined),
      '24 horas': variables.timeThreshold,
      '2 horas': this.calculateShortTime(variables.timeThreshold || undefined),
      '50%': variables.percentageThreshold
    };
    
    // Apply replacements
    Object.entries(replacements).forEach(([pattern, replacement]) => {
      if (replacement) {
        adapted = adapted.replace(new RegExp(pattern, 'gi'), replacement);
      }
    });
    
    return adapted;
  }

  /**
   * AI-enhanced adaptation for more sophisticated personalization
   */
  private async adaptWithAI(
    question: string,
    variables: TemplateVariables,
    _context: QuestionContext
  ): Promise<{ adapted: string; confidence: number }> {
    // This would call the AI provider to get a more sophisticated adaptation
    // For now, returning template-based with placeholder for AI integration
    
    // TODO: Implement actual AI call when AI provider supports question adaptation
    const adapted = this.adaptWithTemplates(question, variables);
    
    return {
      adapted,
      confidence: 0.9
    };
  }

  /**
   * Calculate amount threshold based on company size
   */
  private calculateAmountThreshold(revenue?: number, employees?: number): string {
    if (revenue) {
      // Base threshold on 0.1% of annual revenue
      const threshold = Math.round(revenue * 0.001 / 1000) * 1000;
      return this.formatCurrency(Math.max(threshold, 10000));
    } else if (employees) {
      // Estimate based on employees
      const threshold = employees < 50 ? 10000 : 
                       employees < 500 ? 50000 : 
                       employees < 5000 ? 100000 : 500000;
      return this.formatCurrency(threshold);
    }
    return '$100K'; // Default
  }

  /**
   * Calculate time threshold based on company operations
   */
  private calculateTimeThreshold(employees?: number): string {
    if (!employees) return '24 horas';
    
    // Larger companies typically have stricter SLAs
    if (employees > 5000) return '4 horas';
    if (employees > 1000) return '8 horas';
    if (employees > 100) return '24 horas';
    return '48 horas';
  }

  /**
   * Calculate percentage threshold for impact questions
   */
  private calculatePercentageThreshold(revenue?: number): string {
    if (!revenue) return '50%';
    
    // Higher revenue companies are more sensitive to smaller percentages
    if (revenue > 1000000000) return '10%'; // >$1B
    if (revenue > 100000000) return '25%';  // >$100M
    if (revenue > 10000000) return '40%';   // >$10M
    return '50%';
  }

  /**
   * Format currency values
   */
  private formatCurrency(amount: number): string {
    if (amount >= 1000000) {
      return `$${Math.round(amount / 1000000)}M`;
    } else if (amount >= 1000) {
      return `$${Math.round(amount / 1000)}K`;
    }
    return `$${amount}`;
  }

  /**
   * Format revenue for display
   */
  private formatRevenue(revenue?: number): string {
    if (!revenue) return '';
    return this.formatCurrency(revenue);
  }

  /**
   * Format employee count
   */
  private formatEmployees(employees?: number): string {
    if (!employees) return '';
    if (employees > 1000) {
      return `${Math.round(employees / 1000)}K`;
    }
    return employees.toString();
  }

  /**
   * Calculate minor amount (5% of major threshold)
   */
  private calculateMinorAmount(majorAmount: string | undefined): string {
    if (!majorAmount) return '$500';
    
    // Extract number from formatted amount
    const match = majorAmount.match(/\$(\d+)([KM])?/);
    if (!match) return '$500';
    
    const value = parseInt(match[1]!);
    const multiplier = match[2] === 'M' ? 1000000 : match[2] === 'K' ? 1000 : 1;
    const minor = Math.round(value * multiplier * 0.05 / 100) * 100;
    
    return this.formatCurrency(Math.max(minor, 500));
  }

  /**
   * Calculate short time (10% of major threshold)
   */
  private calculateShortTime(majorTime: string | undefined): string {
    if (!majorTime) return '2 horas';
    
    const match = majorTime.match(/(\d+)\s*horas?/);
    if (!match) return '2 horas';
    
    const hours = parseInt(match[1]!);
    const short = Math.max(Math.round(hours * 0.1), 1);
    
    return `${short} hora${short > 1 ? 's' : ''}`;
  }
}

// Export singleton instance without AI for now
export const questionAdapter = new QuestionAdapter();