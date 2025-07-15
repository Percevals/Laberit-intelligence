/**
 * Hybrid Company Search Service
 * Combines database search with fuzzy matching and AI fallback
 */

import type { CompanyInfo, CompanySearchResult } from '@services/ai/types';
import type { Company, CompanyDatabaseService } from '@/database/types';
import { fuzzySearch, fuzzyMatchScore } from '@/utils/fuzzy-match';
import { AIService } from '@services/ai/ai-service';

/**
 * Extended company info that includes source information
 */
export interface HybridCompanyInfo extends CompanyInfo {
  source: 'database' | 'ai' | 'combined';
  databaseId?: string;
  matchScore: number;
  matchType: 'exact' | 'fuzzy' | 'ai';
}

/**
 * Result from hybrid search
 */
export interface HybridSearchResult extends CompanySearchResult {
  companies: HybridCompanyInfo[];
  databaseMatches: number;
  aiMatches: number;
  totalTime: number;
}

/**
 * Options for hybrid search
 */
export interface HybridSearchOptions {
  maxDatabaseResults?: number;
  maxAIResults?: number;
  fuzzyThreshold?: number;
  useAIFallback?: boolean;
  combineResults?: boolean;
}

export class HybridSearchService {
  constructor(
    private databaseService: CompanyDatabaseService,
    private aiService: AIService
  ) {}

  /**
   * Perform hybrid search combining database and AI
   */
  async search(
    query: string,
    options: HybridSearchOptions = {}
  ): Promise<HybridSearchResult> {
    const {
      maxDatabaseResults = 20,
      maxAIResults = 10,
      fuzzyThreshold = 0.4,
      useAIFallback = true,
      combineResults = true
    } = options;

    const startTime = Date.now();
    
    // Step 1: Search database with fuzzy matching
    const databaseResults = await this.searchDatabase(query, {
      maxResults: maxDatabaseResults,
      fuzzyThreshold
    });

    // Step 2: Determine if we need AI search
    const hasGoodDatabaseMatches = databaseResults.some(r => r.matchScore > 0.7);
    const shouldUseAI = useAIFallback && (!hasGoodDatabaseMatches || combineResults);

    let aiResults: HybridCompanyInfo[] = [];
    let aiSearchTime = 0;

    if (shouldUseAI) {
      // Step 3: Perform AI search
      const aiStartTime = Date.now();
      try {
        const aiSearchResult = await this.aiService.searchCompany(query);
        aiSearchTime = Date.now() - aiStartTime;
        
        // Convert AI results to hybrid format
        aiResults = aiSearchResult.companies.slice(0, maxAIResults).map(company => ({
          ...company,
          source: 'ai' as const,
          matchScore: 0.6, // Default score for AI results
          matchType: 'ai' as const,
          dataSource: 'ai' as const
        }));
      } catch (error) {
        console.error('AI search failed, using database results only:', error);
      }
    }

    // Step 4: Combine and rank results
    const combinedResults = this.combineAndRankResults(
      databaseResults,
      aiResults,
      query
    );

    const totalTime = Date.now() - startTime;

    return {
      companies: combinedResults,
      query,
      provider: shouldUseAI ? 'hybrid' : 'database',
      searchTime: totalTime,
      databaseMatches: databaseResults.length,
      aiMatches: aiResults.length,
      totalTime
    };
  }

  /**
   * Search database with fuzzy matching
   */
  private async searchDatabase(
    query: string,
    options: { maxResults: number; fuzzyThreshold: number }
  ): Promise<HybridCompanyInfo[]> {
    // First, try exact search
    const exactMatches = await this.databaseService.searchCompanies(query);
    
    // Get all companies for fuzzy matching
    // In a real implementation, this would be optimized
    const allCompanies = await this.getAllCompaniesForFuzzyMatch();
    
    // Perform fuzzy search
    const fuzzyMatches = fuzzySearch(
      allCompanies.map(c => ({
        ...c,
        alternativeNames: c.legal_name ? [c.legal_name] : []
      })),
      query,
      {
        threshold: options.fuzzyThreshold,
        maxResults: options.maxResults * 2, // Get more for deduplication
        includeScore: true
      }
    );

    // Combine and deduplicate
    const seen = new Set<string>();
    const results: HybridCompanyInfo[] = [];

    // Add exact matches first
    for (const company of exactMatches) {
      if (!seen.has(company.id)) {
        seen.add(company.id);
        results.push(this.convertToHybridInfo(company, 1.0, 'exact'));
      }
    }

    // Add fuzzy matches
    for (const match of fuzzyMatches) {
      if (!seen.has(match.id) && match.matchScore) {
        seen.add(match.id);
        results.push(this.convertToHybridInfo(match, match.matchScore, 'fuzzy'));
      }
    }

    return results.slice(0, options.maxResults);
  }

  /**
   * Get all companies for fuzzy matching
   * In production, this would use a more efficient approach
   */
  private async getAllCompaniesForFuzzyMatch(): Promise<Company[]> {
    // For mock database, we can get all companies
    // In production with PostgreSQL, you'd use full-text search or trigram similarity
    try {
      // Search with empty query to get all (limited by the service)
      return await this.databaseService.searchCompanies('');
    } catch {
      return [];
    }
  }

  /**
   * Convert database company to hybrid info
   */
  private convertToHybridInfo(
    company: Company,
    matchScore: number,
    matchType: 'exact' | 'fuzzy'
  ): HybridCompanyInfo {
    return {
      name: company.name,
      legalName: company.legal_name,
      employees: company.employees,
      revenue: company.revenue,
      headquarters: company.headquarters,
      country: company.country,
      region: company.region,
      industry: company.industry_traditional,
      website: company.domain,
      dataSource: 'manual',
      confidence: company.confidence_score,
      source: 'database',
      databaseId: company.id,
      matchScore,
      matchType
    };
  }

  /**
   * Combine and rank results from different sources
   */
  private combineAndRankResults(
    databaseResults: HybridCompanyInfo[],
    aiResults: HybridCompanyInfo[],
    query: string
  ): HybridCompanyInfo[] {
    const allResults = [...databaseResults];
    const seen = new Set<string>();

    // Add database results to seen set
    for (const result of databaseResults) {
      const key = this.getCompanyKey(result);
      seen.add(key);
    }

    // Add AI results that aren't duplicates
    for (const aiResult of aiResults) {
      const key = this.getCompanyKey(aiResult);
      
      // Check if we've seen this company
      if (!seen.has(key)) {
        seen.add(key);
        allResults.push(aiResult);
      } else {
        // Find the database match and enhance it with AI data
        const dbMatch = allResults.find(r => 
          this.getCompanyKey(r) === key && r.source === 'database'
        );
        
        if (dbMatch) {
          // Enhance database entry with AI data
          this.enhanceWithAIData(dbMatch, aiResult);
        }
      }
    }

    // Re-score all results based on the query
    for (const result of allResults) {
      if (result.source === 'database') {
        // Recalculate score for better ranking
        const nameScore = fuzzyMatchScore(result.name, query);
        const domainScore = result.website ? fuzzyMatchScore(result.website, query) : 0;
        result.matchScore = Math.max(nameScore, domainScore * 0.8);
      }
    }

    // Sort by match score and source preference
    return allResults.sort((a, b) => {
      // First by match score
      if (Math.abs(a.matchScore - b.matchScore) > 0.1) {
        return b.matchScore - a.matchScore;
      }
      
      // Then prefer database results over AI
      if (a.source !== b.source) {
        return a.source === 'database' ? -1 : 1;
      }
      
      // Finally by match type
      const typeOrder = { exact: 0, fuzzy: 1, ai: 2 };
      return typeOrder[a.matchType] - typeOrder[b.matchType];
    });
  }

  /**
   * Get a unique key for a company to detect duplicates
   */
  private getCompanyKey(company: HybridCompanyInfo): string {
    // Try to match by domain first (most reliable)
    if (company.website) {
      return `domain:${company.website.toLowerCase()}`;
    }
    
    // Then by normalized name
    const normalizedName = company.name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .substring(0, 20);
    
    return `name:${normalizedName}`;
  }

  /**
   * Enhance database company info with AI data
   */
  private enhanceWithAIData(
    dbCompany: HybridCompanyInfo,
    aiCompany: HybridCompanyInfo
  ): void {
    // Mark as combined source
    dbCompany.source = 'combined';
    
    // Fill in missing fields from AI
    if (!dbCompany.description && aiCompany.description) {
      dbCompany.description = aiCompany.description;
    }
    
    if (!dbCompany.techStack && aiCompany.techStack) {
      dbCompany.techStack = aiCompany.techStack;
    }
    
    if (!dbCompany.yearFounded && aiCompany.yearFounded) {
      dbCompany.yearFounded = aiCompany.yearFounded;
    }
    
    if (!dbCompany.operatingCountries && aiCompany.operatingCountries) {
      dbCompany.operatingCountries = aiCompany.operatingCountries;
    }
    
    // Update confidence based on both sources
    if (aiCompany.confidence) {
      dbCompany.confidence = Math.max(
        dbCompany.confidence || 0,
        aiCompany.confidence
      );
    }
  }
}