/**
 * Enhanced Mock AI Provider with Fuzzy Search
 * Includes 50+ LATAM companies and intelligent fuzzy matching
 */
// @ts-nocheck

import { BaseAIProvider } from '../base-provider';
import type { CompanyInfo } from '../types';

// Expanded LATAM company database
const LATAM_COMPANIES: Record<string, CompanyInfo> = {
  // Original companies
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
    industry: 'Software',
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
    industry: 'Retail',
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
    industry: 'Software',
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
  },
  
  // Mexican companies
  'cemex': {
    name: 'CEMEX',
    legalName: 'CEMEX S.A.B. de C.V.',
    employees: 40000,
    employeeRange: '10000-50000',
    revenue: 14000000000,
    revenueRange: '$10B+',
    headquarters: 'San Pedro Garza García, Mexico',
    country: 'Mexico',
    region: 'LATAM',
    operatingCountries: ['Mexico', 'USA', 'Colombia', 'Spain', 'Egypt'],
    industry: 'Manufacturing',
    description: 'Global building materials company and cement producer.',
    website: 'https://www.cemex.com',
    yearFounded: 1906,
    dataSource: 'ai',
    confidence: 0.9
  },
  'bimbo': {
    name: 'Grupo Bimbo',
    legalName: 'Grupo Bimbo S.A.B. de C.V.',
    employees: 134000,
    employeeRange: '100000+',
    revenue: 16000000000,
    revenueRange: '$10B+',
    headquarters: 'Mexico City, Mexico',
    country: 'Mexico',
    region: 'LATAM',
    operatingCountries: ['Mexico', 'USA', 'Canada', 'Spain', 'Brazil', 'Argentina'],
    industry: 'Logistics',
    description: 'Largest bakery company in the world.',
    website: 'https://www.grupobimbo.com',
    yearFounded: 1945,
    dataSource: 'ai',
    confidence: 0.95
  },
  'aeromexico': {
    name: 'Aeroméxico',
    legalName: 'Grupo Aeroméxico S.A.B. de C.V.',
    employees: 15000,
    employeeRange: '10000-50000',
    revenue: 3000000000,
    revenueRange: '$1B-$5B',
    headquarters: 'Mexico City, Mexico',
    country: 'Mexico',
    region: 'LATAM',
    industry: 'Logistics',
    description: 'Flag carrier airline of Mexico.',
    website: 'https://www.aeromexico.com',
    yearFounded: 1934,
    dataSource: 'ai',
    confidence: 0.9
  },
  'liverpool': {
    name: 'Liverpool',
    legalName: 'El Puerto de Liverpool S.A.B. de C.V.',
    employees: 60000,
    employeeRange: '50000-100000',
    revenue: 8000000000,
    revenueRange: '$5B-$10B',
    headquarters: 'Mexico City, Mexico',
    country: 'Mexico',
    region: 'LATAM',
    industry: 'Retail',
    description: 'Chain of department stores in Mexico.',
    website: 'https://www.liverpool.com.mx',
    yearFounded: 1847,
    dataSource: 'ai',
    confidence: 0.88
  },
  
  // Brazilian companies
  'petrobras': {
    name: 'Petrobras',
    legalName: 'Petróleo Brasileiro S.A.',
    employees: 45000,
    employeeRange: '10000-50000',
    revenue: 100000000000,
    revenueRange: '$10B+',
    headquarters: 'Rio de Janeiro, Brazil',
    country: 'Brazil',
    region: 'LATAM',
    industry: 'Manufacturing',
    description: 'Brazilian multinational petroleum corporation.',
    website: 'https://www.petrobras.com.br',
    yearFounded: 1953,
    publicCompany: true,
    stockSymbol: 'PBR',
    dataSource: 'ai',
    confidence: 0.95
  },
  'vale': {
    name: 'Vale',
    legalName: 'Vale S.A.',
    employees: 125000,
    employeeRange: '100000+',
    revenue: 54000000000,
    revenueRange: '$10B+',
    headquarters: 'Rio de Janeiro, Brazil',
    country: 'Brazil',
    region: 'LATAM',
    industry: 'Manufacturing',
    description: 'One of the largest mining companies in the world.',
    website: 'https://www.vale.com',
    yearFounded: 1942,
    publicCompany: true,
    stockSymbol: 'VALE',
    dataSource: 'ai',
    confidence: 0.95
  },
  'nubank': {
    name: 'Nubank',
    legalName: 'Nu Pagamentos S.A.',
    employees: 6000,
    employeeRange: '5000-10000',
    revenue: 1800000000,
    revenueRange: '$1B-$5B',
    headquarters: 'São Paulo, Brazil',
    country: 'Brazil',
    region: 'LATAM',
    operatingCountries: ['Brazil', 'Mexico', 'Colombia'],
    industry: 'Financial Services',
    description: 'Largest digital bank in Latin America.',
    website: 'https://www.nubank.com.br',
    yearFounded: 2013,
    techStack: ['AWS', 'Clojure', 'React Native', 'Kafka'],
    publicCompany: true,
    stockSymbol: 'NU',
    dataSource: 'ai',
    confidence: 0.92
  },
  'ifood': {
    name: 'iFood',
    legalName: 'iFood.com Agência de Restaurantes Online S.A.',
    employees: 5000,
    employeeRange: '1000-5000',
    revenue: 500000000,
    revenueRange: '$500M-$1B',
    headquarters: 'São Paulo, Brazil',
    country: 'Brazil',
    region: 'LATAM',
    industry: 'Software',
    description: 'Leading food delivery platform in Brazil.',
    website: 'https://www.ifood.com.br',
    yearFounded: 2011,
    techStack: ['AWS', 'Java', 'Kotlin', 'React'],
    dataSource: 'ai',
    confidence: 0.88
  },
  
  // Chilean companies
  'falabella': {
    name: 'Falabella',
    legalName: 'S.A.C.I. Falabella',
    employees: 100000,
    employeeRange: '50000-100000',
    revenue: 12000000000,
    revenueRange: '$10B+',
    headquarters: 'Santiago, Chile',
    country: 'Chile',
    region: 'LATAM',
    operatingCountries: ['Chile', 'Peru', 'Colombia', 'Argentina', 'Brazil', 'Mexico'],
    industry: 'Retail',
    description: 'Largest retail company in Chile.',
    website: 'https://www.falabella.com',
    yearFounded: 1889,
    publicCompany: true,
    dataSource: 'ai',
    confidence: 0.9
  },
  'latam': {
    name: 'LATAM Airlines',
    legalName: 'LATAM Airlines Group S.A.',
    employees: 30000,
    employeeRange: '10000-50000',
    revenue: 8500000000,
    revenueRange: '$5B-$10B',
    headquarters: 'Santiago, Chile',
    country: 'Chile',
    region: 'LATAM',
    industry: 'Logistics',
    description: 'Largest airline in Latin America.',
    website: 'https://www.latam.com',
    yearFounded: 1929,
    publicCompany: true,
    dataSource: 'ai',
    confidence: 0.92
  },
  'cencosud': {
    name: 'Cencosud',
    legalName: 'Cencosud S.A.',
    employees: 140000,
    employeeRange: '100000+',
    revenue: 15000000000,
    revenueRange: '$10B+',
    headquarters: 'Santiago, Chile',
    country: 'Chile',
    region: 'LATAM',
    operatingCountries: ['Chile', 'Argentina', 'Brazil', 'Peru', 'Colombia'],
    industry: 'Retail',
    description: 'Multinational retail conglomerate.',
    website: 'https://www.cencosud.com',
    yearFounded: 1960,
    publicCompany: true,
    dataSource: 'ai',
    confidence: 0.9
  },
  
  // Colombian companies
  'ecopetrol': {
    name: 'Ecopetrol',
    legalName: 'Ecopetrol S.A.',
    employees: 18000,
    employeeRange: '10000-50000',
    revenue: 25000000000,
    revenueRange: '$10B+',
    headquarters: 'Bogotá, Colombia',
    country: 'Colombia',
    region: 'LATAM',
    industry: 'Manufacturing',
    description: 'National oil company of Colombia.',
    website: 'https://www.ecopetrol.com.co',
    yearFounded: 1951,
    publicCompany: true,
    stockSymbol: 'EC',
    dataSource: 'ai',
    confidence: 0.92
  },
  'avianca': {
    name: 'Avianca',
    legalName: 'Avianca Holdings S.A.',
    employees: 12000,
    employeeRange: '10000-50000',
    revenue: 4000000000,
    revenueRange: '$1B-$5B',
    headquarters: 'Bogotá, Colombia',
    country: 'Colombia',
    region: 'LATAM',
    industry: 'Logistics',
    description: 'Second largest airline in Latin America.',
    website: 'https://www.avianca.com',
    yearFounded: 1919,
    dataSource: 'ai',
    confidence: 0.88
  },
  
  // Peruvian companies
  'backus': {
    name: 'Backus',
    legalName: 'Unión de Cervecerías Peruanas Backus y Johnston S.A.A.',
    employees: 4500,
    employeeRange: '1000-5000',
    revenue: 800000000,
    revenueRange: '$500M-$1B',
    headquarters: 'Lima, Peru',
    country: 'Peru',
    region: 'LATAM',
    industry: 'Logistics',
    description: 'Largest brewery in Peru.',
    website: 'https://www.backus.pe',
    yearFounded: 1876,
    dataSource: 'ai',
    confidence: 0.85
  },
  'intercorp': {
    name: 'Intercorp',
    legalName: 'Intercorp Financial Services Inc.',
    employees: 45000,
    employeeRange: '10000-50000',
    revenue: 4000000000,
    revenueRange: '$1B-$5B',
    headquarters: 'Lima, Peru',
    country: 'Peru',
    region: 'LATAM',
    industry: 'Financial Services',
    description: 'Leading financial services provider in Peru.',
    website: 'https://www.intercorp.com.pe',
    yearFounded: 1994,
    publicCompany: true,
    dataSource: 'ai',
    confidence: 0.87
  },
  
  // Tech startups and smaller companies
  'kavak': {
    name: 'Kavak',
    legalName: 'Kavak Holdings',
    employees: 5000,
    employeeRange: '1000-5000',
    revenue: 1200000000,
    revenueRange: '$1B-$5B',
    headquarters: 'Mexico City, Mexico',
    country: 'Mexico',
    region: 'LATAM',
    operatingCountries: ['Mexico', 'Brazil', 'Argentina'],
    industry: 'Retail',
    description: 'Online platform for buying and selling used cars.',
    website: 'https://www.kavak.com',
    yearFounded: 2016,
    techStack: ['AWS', 'React', 'Node.js', 'Python'],
    dataSource: 'ai',
    confidence: 0.85
  },
  'cornershop': {
    name: 'Cornershop',
    legalName: 'Cornershop Technologies Inc.',
    employees: 3000,
    employeeRange: '1000-5000',
    revenue: 200000000,
    revenueRange: '$100M-$500M',
    headquarters: 'Santiago, Chile',
    country: 'Chile',
    region: 'LATAM',
    operatingCountries: ['Chile', 'Mexico', 'Brazil', 'Peru', 'Colombia'],
    industry: 'Software',
    description: 'On-demand grocery delivery service acquired by Uber.',
    website: 'https://www.cornershopapp.com',
    yearFounded: 2015,
    dataSource: 'ai',
    confidence: 0.8
  },
  'platzi': {
    name: 'Platzi',
    legalName: 'Platzi Inc.',
    employees: 300,
    employeeRange: '100-500',
    revenue: 50000000,
    revenueRange: '$10M-$100M',
    headquarters: 'Bogotá, Colombia',
    country: 'Colombia',
    region: 'LATAM',
    industry: 'Software',
    description: 'Online education platform for technology professionals.',
    website: 'https://www.platzi.com',
    yearFounded: 2011,
    techStack: ['AWS', 'React', 'Python', 'Django'],
    dataSource: 'ai',
    confidence: 0.82
  },
  'vtex': {
    name: 'VTEX',
    legalName: 'VTEX S.A.',
    employees: 1500,
    employeeRange: '1000-5000',
    revenue: 150000000,
    revenueRange: '$100M-$500M',
    headquarters: 'São Paulo, Brazil',
    country: 'Brazil',
    region: 'LATAM',
    operatingCountries: ['Brazil', 'USA', 'Mexico', 'Argentina', 'Chile'],
    industry: 'Retail',
    description: 'Commerce platform for enterprise brands and retailers.',
    website: 'https://www.vtex.com',
    yearFounded: 2000,
    techStack: ['AWS', 'React', 'Node.js', 'GraphQL'],
    publicCompany: true,
    stockSymbol: 'VTEX',
    dataSource: 'ai',
    confidence: 0.85
  }
};

// Fuzzy search utilities
class FuzzySearch {
  /**
   * Calculate Levenshtein distance between two strings
   */
  static levenshteinDistance(str1: string, str2: string): number {
    const m = str1.length;
    const n = str2.length;
    const dp: number[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));

    for (let i = 0; i <= m; i++) dp[i]![0] = i;
    for (let j = 0; j <= n; j++) dp[0]![j] = j;

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (str1[i - 1] === str2[j - 1]) {
          dp[i]![j] = dp[i - 1]![j - 1]!;
        } else {
          dp[i]![j] = Math.min(
            dp[i - 1]![j]! + 1,    // deletion
            dp[i]![j - 1]! + 1,    // insertion
            dp[i - 1]![j - 1]! + 1 // substitution
          );
        }
      }
    }

    return dp[m]![n]!;
  }

  /**
   * Calculate similarity score (0-1) based on Levenshtein distance
   */
  static similarity(str1: string, str2: string): number {
    const distance = this.levenshteinDistance(str1.toLowerCase(), str2.toLowerCase());
    const maxLength = Math.max(str1.length, str2.length);
    return maxLength === 0 ? 1 : 1 - (distance / maxLength);
  }

  /**
   * Check if one string contains another with fuzzy matching
   */
  static fuzzyContains(haystack: string, needle: string, threshold: number = 0.8): boolean {
    const haystackLower = haystack.toLowerCase();
    const needleLower = needle.toLowerCase();

    // Exact substring match
    if (haystackLower.includes(needleLower)) return true;

    // Check each word in haystack
    const words = haystackLower.split(/\s+/);
    for (const word of words) {
      if (this.similarity(word, needleLower) >= threshold) return true;
    }

    // Sliding window fuzzy match
    for (let i = 0; i <= haystackLower.length - needleLower.length; i++) {
      const substring = haystackLower.substring(i, i + needleLower.length);
      if (this.similarity(substring, needleLower) >= threshold) return true;
    }

    return false;
  }

  /**
   * Tokenize and normalize company names for better matching
   */
  static normalizeCompanyName(name: string): string {
    return name
      .toLowerCase()
      .replace(/\b(s\.?a\.?|inc\.?|ltd\.?|corp\.?|company|co\.?)\b/gi, '') // Remove common suffixes
      .replace(/[^\w\s]/g, '') // Remove special characters
      .replace(/\s+/g, ' ')    // Normalize spaces
      .trim();
  }
}

export class EnhancedMockProvider extends BaseAIProvider {
  constructor() {
    super({
      id: 'enhanced-mock',
      name: 'Enhanced Mock Provider',
      timeout: 1000,
      rateLimit: {
        requests: 1000,
        window: 60
      }
    });
  }

  async searchCompany(query: string): Promise<CompanyInfo[]> {
    await this.simulateDelay();

    const normalizedQuery = FuzzySearch.normalizeCompanyName(query);
    const results: Array<{ company: CompanyInfo; score: number }> = [];

    // Search through all companies with fuzzy matching
    for (const [key, company] of Object.entries(LATAM_COMPANIES)) {
      let score = 0;

      // Check various fields with different weights
      const nameScore = FuzzySearch.similarity(
        FuzzySearch.normalizeCompanyName(company.name), 
        normalizedQuery
      ) * 1.0; // Full weight for name

      const legalNameScore = company.legalName ? 
        FuzzySearch.similarity(
          FuzzySearch.normalizeCompanyName(company.legalName), 
          normalizedQuery
        ) * 0.9 : 0; // 90% weight for legal name

      const keyScore = FuzzySearch.similarity(key, normalizedQuery) * 0.8; // 80% weight for key

      // Take the highest score
      score = Math.max(nameScore, legalNameScore, keyScore);

      // Also check if query contains company name or vice versa
      if (FuzzySearch.fuzzyContains(company.name, query, 0.85) ||
          FuzzySearch.fuzzyContains(query, company.name, 0.85)) {
        score = Math.max(score, 0.85);
      }

      // Boost score for exact word matches
      const queryWords = normalizedQuery.split(/\s+/);
      const nameWords = FuzzySearch.normalizeCompanyName(company.name).split(/\s+/);
      for (const qWord of queryWords) {
        for (const nWord of nameWords) {
          if (qWord === nWord && qWord.length > 2) {
            score = Math.max(score, 0.9);
          }
        }
      }

      if (score > 0.3) { // Threshold for inclusion
        results.push({
          company: {
            ...company,
            confidence: Math.min((company.confidence || 0.8) * score, 0.95),
            lastUpdated: new Date()
          },
          score
        });
      }
    }

    // Sort by score and confidence
    results.sort((a, b) => {
      const scoreA = a.score * (a.company.confidence || 0.8);
      const scoreB = b.score * (b.company.confidence || 0.8);
      return scoreB - scoreA;
    });

    // If no good matches, create a minimal company profile with user's input
    if (results.length === 0 || results[0].score < 0.5) {
      const unknownCompany = this.createUnknownCompanyProfile(query);
      results.push({
        company: { ...unknownCompany, confidence: 0.2 },
        score: 0.2
      });
    }

    // Return top 5 results with adjusted confidence based on match score
    return results
      .slice(0, 5)
      .map(r => ({
        ...r.company,
        dataSource: 'mixed' as const
      }) as CompanyInfo);
  }

  async enhanceCompanyData(partial: Partial<CompanyInfo>): Promise<CompanyInfo> {
    await this.simulateDelay();

    // Try to find best match in database
    const searchResults = await this.searchCompany(partial.name || '');
    
    if (searchResults.length > 0 && searchResults[0] && (searchResults[0].confidence || 0) > 0.7) {
      // Merge with found company data
      return this.validateCompanyInfo({
        ...searchResults[0],
        ...partial,
        dataSource: 'mixed',
        lastUpdated: new Date()
      });
    }

    // Generate enhanced data for unknown company
    return this.validateCompanyInfo({
      ...partial,
      employees: partial.employees || this.estimateEmployees(partial.industry || 'Other'),
      revenue: partial.revenue || this.estimateRevenue(partial.industry || 'Other', partial.employees || 100),
      headquarters: partial.headquarters || this.generateHeadquarters(),
      country: partial.country || this.extractCountry(partial.headquarters),
      region: partial.region || 'LATAM',
      industry: partial.industry || 'Other',
      description: partial.description || this.generateDescription(partial.name || 'Company', partial.industry || 'Other'),
      website: partial.website || this.generateWebsite(partial.name || 'company'),
      dataSource: 'ai',
      confidence: 0.5,
      lastUpdated: new Date()
    });
  }

  async isAvailable(): Promise<boolean> {
    return true;
  }

  estimateCost(): number {
    return 0;
  }

  private async simulateDelay(): Promise<void> {
    const delay = Math.random() * 300 + 100; // 100-400ms
    await new Promise(resolve => setTimeout(resolve, delay));
  }

  /**
   * Create a minimal profile for unknown companies without fake data
   */
  private createUnknownCompanyProfile(name: string): CompanyInfo {
    // Only guess industry if there are clear indicators in the name
    let industry = 'Other';
    const possibleIndustry = this.guessIndustryConservative(name);
    if (possibleIndustry) {
      industry = possibleIndustry;
    }

    return this.validateCompanyInfo({
      name: name.trim(),
      industry: industry,
      description: `Company information for "${name}" is not available in our database. Please verify and update company details manually.`,
      dataSource: 'ai',
      confidence: 0.2,
      lastUpdated: new Date(),
      // Don't include fake revenue, employees, location, etc.
      // Let the user fill these in manually
    });
  }

  /**
   * Conservative industry guessing - only for very obvious cases
   */
  private guessIndustryConservative(name: string): string | null {
    const nameLower = name.toLowerCase();
    
    // Only guess if there are very clear indicators
    const obviousPatterns = {
      'Software': ['software', 'tech', 'digital', 'saas', 'app'],
      'Financial Services': ['bank', 'banco', 'financial', 'fintech'],
      'Healthcare': ['hospital', 'clinic', 'health', 'medical', 'pharma'],
      'Energy': ['energy', 'energia', 'electric', 'power', 'oil', 'gas'],
      'Logistics': ['logistics', 'transport', 'delivery', 'shipping'],
    };

    for (const [industry, patterns] of Object.entries(obviousPatterns)) {
      if (patterns.some(pattern => nameLower.includes(pattern))) {
        return industry;
      }
    }

    return null; // Don't guess if not obvious
  }

  private guessIndustry(name: string): string {
    const nameLower = name.toLowerCase();
    
    // Traditional industry keywords mapping (aligned with industries.ts)
    const industryPatterns = {
      'Software': ['tech', 'soft', 'digital', 'cyber', 'cloud', 'ai', 'saas', 'platform', 'app'],
      'Financial Services': ['bank', 'banco', 'financ', 'credit', 'segur', 'capital', 'payment'],
      'Fintech': ['fintech', 'payment', 'digital bank', 'crypto'],
      'Retail': ['store', 'shop', 'market', 'mercado', 'tienda', 'comercio', 'retail'],
      'E-commerce': ['ecommerce', 'online', 'marketplace', 'delivery'],
      'Manufacturing': ['fabric', 'produc', 'industr', 'manufact', 'factory'],
      'Healthcare': ['salud', 'health', 'medic', 'clinic', 'hospital', 'pharma'],
      'Logistics': ['logist', 'transport', 'delivery', 'shipping', 'cargo', 'supply'],
      'Energy': ['energy', 'energia', 'power', 'electric', 'solar', 'petrol', 'oil', 'gas'],
      'Telecommunications': ['telecom', 'mobile', 'internet', 'fibra', 'connect'],
      'Food & Beverage': ['food', 'comida', 'restaurant', 'cafe', 'bebida', 'brewery'],
      'Education': ['edu', 'school', 'university', 'escuela', 'college', 'curso'],
      'Professional Services': ['data', 'analytics', 'research', 'insight', 'intelligence', 'consult']
    };

    for (const [industry, patterns] of Object.entries(industryPatterns)) {
      if (patterns.some(pattern => nameLower.includes(pattern))) {
        return industry;
      }
    }

    return 'Other'; // Default fallback
  }

  private guessCountry(name: string): string {
    const nameLower = name.toLowerCase();
    
    // Country indicators
    if (nameLower.includes('brasil') || nameLower.includes('brazil')) return 'Brazil';
    if (nameLower.includes('mexico') || nameLower.includes('mex')) return 'Mexico';
    if (nameLower.includes('colombia') || nameLower.includes('col')) return 'Colombia';
    if (nameLower.includes('argentin') || nameLower.includes('arg')) return 'Argentina';
    if (nameLower.includes('chile') || nameLower.includes('cl')) return 'Chile';
    if (nameLower.includes('peru')) return 'Peru';
    
    // Default based on probability
    const countries = ['Brazil', 'Mexico', 'Colombia', 'Argentina', 'Chile'];
    return countries[Math.floor(Math.random() * countries.length)]!;
  }

  private estimateEmployees(industry: string): number {
    const industryRanges = {
      'Software': [50, 5000],
      'SaaS': [50, 2000],
      'Financial Services': [100, 10000],
      'Fintech': [50, 2000],
      'Banking': [1000, 50000],
      'Retail': [200, 20000],
      'E-commerce': [100, 5000],
      'Manufacturing': [500, 50000],
      'Healthcare': [100, 5000],
      'Logistics': [100, 10000],
      'Energy': [200, 20000],
      'Telecommunications': [500, 30000],
      'Food & Beverage': [50, 2000],
      'Education': [50, 2000],
      'Professional Services': [50, 1000],
      'Other': [50, 1000]
    };

    const range = industryRanges[industry as keyof typeof industryRanges] || industryRanges['Other'];
    return Math.floor(Math.random() * (range[1] - range[0]) + range[0]);
  }

  private estimateRevenue(industry: string, employees: number): number {
    // Revenue per employee estimates by traditional industry (USD)
    const revenuePerEmployee = {
      'Software': 300000,
      'SaaS': 350000,
      'Financial Services': 500000,
      'Fintech': 400000,
      'Banking': 600000,
      'Retail': 150000,
      'E-commerce': 200000,
      'Manufacturing': 250000,
      'Healthcare': 200000,
      'Logistics': 180000,
      'Energy': 800000,
      'Telecommunications': 400000,
      'Food & Beverage': 100000,
      'Education': 80000,
      'Professional Services': 150000,
      'Other': 150000
    };

    const rpe = revenuePerEmployee[industry as keyof typeof revenuePerEmployee] || 150000;
    const baseRevenue = employees * rpe;
    
    // Add some variance
    const variance = 0.3;
    const multiplier = 1 + (Math.random() - 0.5) * variance;
    
    return Math.floor(baseRevenue * multiplier);
  }

  private getEmployeeRange(employees: number): string {
    if (employees < 10) return '1-10';
    if (employees < 50) return '10-50';
    if (employees < 100) return '50-100';
    if (employees < 500) return '100-500';
    if (employees < 1000) return '500-1000';
    if (employees < 5000) return '1000-5000';
    if (employees < 10000) return '5000-10000';
    if (employees < 50000) return '10000-50000';
    if (employees < 100000) return '50000-100000';
    return '100000+';
  }

  private getRevenueRange(revenue: number): string {
    if (revenue < 1000000) return '<$1M';
    if (revenue < 10000000) return '$1M-$10M';
    if (revenue < 100000000) return '$10M-$100M';
    if (revenue < 500000000) return '$100M-$500M';
    if (revenue < 1000000000) return '$500M-$1B';
    if (revenue < 5000000000) return '$1B-$5B';
    if (revenue < 10000000000) return '$5B-$10B';
    return '$10B+';
  }

  private generateHeadquarters(country?: string): string {
    const cities = {
      'Brazil': ['São Paulo', 'Rio de Janeiro', 'Brasília', 'Belo Horizonte'],
      'Mexico': ['Mexico City', 'Guadalajara', 'Monterrey', 'Puebla'],
      'Colombia': ['Bogotá', 'Medellín', 'Cali', 'Barranquilla'],
      'Argentina': ['Buenos Aires', 'Córdoba', 'Rosario', 'Mendoza'],
      'Chile': ['Santiago', 'Valparaíso', 'Concepción', 'La Serena'],
      'Peru': ['Lima', 'Arequipa', 'Trujillo', 'Cusco']
    };

    const selectedCountry = country || this.guessCountry('');
    const citiesForCountry = cities[selectedCountry as keyof typeof cities] || cities['Brazil'];
    const city = citiesForCountry[Math.floor(Math.random() * citiesForCountry.length)]!;
    
    return `${city}, ${selectedCountry}`;
  }

  private extractCountry(headquarters?: string): string {
    if (!headquarters) return 'Brazil';
    
    const countries = ['Brazil', 'Mexico', 'Colombia', 'Argentina', 'Chile', 'Peru'];
    for (const country of countries) {
      if (headquarters.includes(country)) return country;
    }
    
    return 'Brazil';
  }

  private generateDescription(name: string, industry: string): string {
    const templates = [
      `${name} is a ${industry?.toLowerCase()} company operating in Latin America.`,
      `Leading provider of ${industry?.toLowerCase()} solutions in the LATAM region.`,
      `${name} specializes in ${industry?.toLowerCase()} services for businesses across Latin America.`,
      `Innovative ${industry?.toLowerCase()} company serving the Latin American market.`
    ];
    
    return templates[Math.floor(Math.random() * templates.length)];
  }

  private generateWebsite(name: string): string {
    
    const cleanName = name
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, '')
      .substring(0, 30);
    
    const tlds = ['.com', '.com.br', '.com.mx', '.com.co', '.com.ar', '.cl'];
    const tld = tlds[Math.floor(Math.random() * tlds.length)];
    
    return `https://www.${cleanName}${tld}`;
  }
}