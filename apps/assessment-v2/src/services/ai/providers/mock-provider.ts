/**
 * Mock AI Provider
 * For development and testing without API costs
 */

import { BaseAIProvider } from '../base-provider';
import type { CompanyInfo } from '../types';

const MOCK_COMPANIES: Record<string, CompanyInfo> = {
  'bancolombia': {
    name: 'Bancolombia S.A.',
    legalName: 'Bancolombia S.A.',
    employees: 35000,
    employeeRange: '10000-50000',
    revenue: 4500000000,
    revenueRange: '$1B-$5B',
    headquarters: 'Medellín, Colombia',
    country: 'Colombia',
    region: 'LATAM',
    operatingCountries: ['Colombia', 'Panama', 'El Salvador', 'Guatemala'],
    industry: 'Financial Services',
    description: 'Largest commercial bank in Colombia, providing retail and corporate banking services.',
    website: 'https://www.bancolombia.com',
    yearFounded: 1945,
    techStack: ['AWS', 'Oracle', 'SAP', 'Java', 'Python'],
    cloudProviders: ['AWS', 'Azure'],
    publicCompany: true,
    stockSymbol: 'CIB',
    certifications: ['ISO 27001', 'PCI DSS'],
    dataSource: 'ai',
    confidence: 0.95
  },
  'rappi': {
    name: 'Rappi',
    legalName: 'Rappi S.A.S.',
    employees: 15000,
    employeeRange: '10000-50000',
    revenue: 800000000,
    revenueRange: '$500M-$1B',
    headquarters: 'Bogotá, Colombia',
    country: 'Colombia',
    region: 'LATAM',
    operatingCountries: ['Colombia', 'Mexico', 'Brazil', 'Argentina', 'Chile', 'Peru'],
    industry: 'Platform Ecosystem',
    description: 'On-demand delivery platform connecting users with couriers for food, groceries, and more.',
    website: 'https://www.rappi.com',
    yearFounded: 2015,
    techStack: ['AWS', 'Kubernetes', 'Node.js', 'React', 'PostgreSQL'],
    cloudProviders: ['AWS'],
    publicCompany: false,
    dataSource: 'ai',
    confidence: 0.9
  },
  'mercadolibre': {
    name: 'MercadoLibre',
    legalName: 'MercadoLibre, Inc.',
    employees: 45000,
    employeeRange: '10000-50000',
    revenue: 10500000000,
    revenueRange: '$10B+',
    headquarters: 'Buenos Aires, Argentina',
    country: 'Argentina',
    region: 'LATAM',
    operatingCountries: ['Argentina', 'Brazil', 'Mexico', 'Colombia', 'Chile', 'Uruguay'],
    industry: 'E-commerce Platform',
    description: 'Leading e-commerce and fintech platform in Latin America.',
    website: 'https://www.mercadolibre.com',
    yearFounded: 1999,
    techStack: ['AWS', 'Java', 'React', 'MySQL', 'ElasticSearch'],
    cloudProviders: ['AWS'],
    publicCompany: true,
    stockSymbol: 'MELI',
    certifications: ['PCI DSS', 'ISO 27001'],
    dataSource: 'ai',
    confidence: 0.95
  },
  'globant': {
    name: 'Globant',
    legalName: 'Globant S.A.',
    employees: 27000,
    employeeRange: '10000-50000',
    revenue: 1800000000,
    revenueRange: '$1B-$5B',
    headquarters: 'Buenos Aires, Argentina',
    country: 'Argentina',
    region: 'LATAM',
    operatingCountries: ['Argentina', 'Colombia', 'Mexico', 'Brazil', 'USA', 'Spain'],
    industry: 'Software Development',
    description: 'Digital transformation and software development company.',
    website: 'https://www.globant.com',
    yearFounded: 2003,
    techStack: ['AWS', 'Azure', 'React', 'Node.js', 'Python', 'AI/ML'],
    cloudProviders: ['AWS', 'Azure', 'Google Cloud'],
    publicCompany: true,
    stockSymbol: 'GLOB',
    certifications: ['ISO 27001', 'CMMI Level 5'],
    dataSource: 'ai',
    confidence: 0.92
  }
};

export class MockProvider extends BaseAIProvider {
  constructor() {
    super({
      id: 'mock',
      name: 'Mock Provider',
      timeout: 1000, // Fast responses
      rateLimit: {
        requests: 1000,
        window: 60
      }
    });
  }

  async searchCompany(query: string): Promise<CompanyInfo[]> {
    // Simulate network delay
    await this.simulateDelay();

    const normalizedQuery = query.toLowerCase().trim();
    const results: CompanyInfo[] = [];

    // Search through mock companies
    for (const [key, company] of Object.entries(MOCK_COMPANIES)) {
      if (
        key.includes(normalizedQuery) ||
        company.name.toLowerCase().includes(normalizedQuery) ||
        company.legalName?.toLowerCase().includes(normalizedQuery)
      ) {
        results.push({
          ...company,
          lastUpdated: new Date()
        });
      }
    }

    // If no exact matches, return fuzzy matches
    if (results.length === 0) {
      // Return a generic company based on query
      results.push(this.generateGenericCompany(query));
    }

    return results.slice(0, 3); // Max 3 results
  }

  async enhanceCompanyData(partial: Partial<CompanyInfo>): Promise<CompanyInfo> {
    await this.simulateDelay();

    // Try to find existing company
    const normalizedName = partial.name?.toLowerCase().trim() || '';
    for (const [key, company] of Object.entries(MOCK_COMPANIES)) {
      if (
        key.includes(normalizedName) ||
        company.name.toLowerCase().includes(normalizedName)
      ) {
        return this.validateCompanyInfo({
          ...company,
          ...partial,
          dataSource: 'mixed',
          lastUpdated: new Date()
        });
      }
    }

    // Generate enhanced data
    return this.validateCompanyInfo({
      ...partial,
      employees: partial.employees || this.randomInRange(100, 10000),
      revenue: partial.revenue || this.randomInRange(1000000, 100000000),
      headquarters: partial.headquarters || 'São Paulo, Brazil',
      country: partial.country || 'Brazil',
      region: partial.region || 'LATAM',
      industry: partial.industry || 'Technology',
      description: partial.description || `${partial.name} is a growing company in the ${partial.industry || 'technology'} sector.`,
      website: partial.website || `https://www.${partial.name?.toLowerCase().replace(/\s+/g, '')}.com`,
      dataSource: 'mixed',
      confidence: 0.7,
      lastUpdated: new Date()
    });
  }

  async isAvailable(): Promise<boolean> {
    return true; // Always available
  }

  estimateCost(): number {
    return 0; // Free!
  }

  private async simulateDelay(): Promise<void> {
    const delay = Math.random() * 500 + 200; // 200-700ms
    await new Promise(resolve => setTimeout(resolve, delay));
  }

  private generateGenericCompany(name: string): CompanyInfo {
    const industries = ['Technology', 'Financial Services', 'Retail', 'Manufacturing', 'Healthcare'];
    const countries = ['Brazil', 'Mexico', 'Colombia', 'Argentina', 'Chile'];
    
    return this.validateCompanyInfo({
      name: name,
      employees: this.randomInRange(50, 5000),
      employeeRange: '50-5000',
      revenue: this.randomInRange(500000, 50000000),
      revenueRange: '$500K-$50M',
      headquarters: `${this.randomFrom(['São Paulo', 'Mexico City', 'Bogotá', 'Buenos Aires'])}, ${this.randomFrom(countries)}`,
      country: this.randomFrom(countries),
      region: 'LATAM',
      industry: this.randomFrom(industries),
      description: `${name} is a company operating in the ${this.randomFrom(industries).toLowerCase()} sector.`,
      website: `https://www.${name.toLowerCase().replace(/\s+/g, '')}.com`,
      dataSource: 'ai',
      confidence: 0.5,
      lastUpdated: new Date()
    });
  }

  private randomInRange(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private randomFrom<T>(array: T[]): T {
    const index = Math.floor(Math.random() * array.length);
    return array[index]!;
  }
}