/**
 * Breach Evidence Service
 * Modular service to fetch and match breach evidence with assessments
 */

interface BreachCase {
  breach_id: string;
  date_discovered: string;
  victim_profile: {
    size_employees: string;
    region: string;
    sector: string;
    dii_estimate?: number;
  };
  business_model_match: {
    primary_model: number;
    confidence: 'high' | 'medium' | 'low';
  };
  attack: {
    vector: string;
    method: string;
    duration_days: number;
  };
  impact: {
    financial_loss_usd: number;
    operational_impact: {
      downtime_hours: number;
      recovery_time_hours: number;
    };
  };
  dii_dimensions_impact?: {
    TRD?: { hours_to_revenue_impact: number };
    AER?: { ratio: number };
    HFP?: { human_factor_involved: boolean };
    BRI?: { blast_radius_percent: number };
    RRG?: { gap_multiplier: number };
  };
}

interface BreachCatalog {
  version: string;
  last_updated: string;
  total_breaches: number;
  breaches_by_model: Record<string, { name: string; count: number }>;
  breaches: BreachCase[];
}

interface MatchingCriteria {
  businessModel: number;
  companySize?: string;
  region?: string;
  diiScore?: number;
  limit?: number;
}

export class BreachEvidenceService {
  private static instance: BreachEvidenceService;
  private catalog: BreachCatalog | null = null;
  private catalogUrl = 'intelligence/breach-evidence/catalog.json';
  private lastFetch: number = 0;
  private cacheDuration = 3600000; // 1 hour cache

  private constructor() {}

  public static getInstance(): BreachEvidenceService {
    if (!BreachEvidenceService.instance) {
      BreachEvidenceService.instance = new BreachEvidenceService();
    }
    return BreachEvidenceService.instance;
  }

  /**
   * Load breach catalog (with caching)
   */
  private async loadCatalog(): Promise<BreachCatalog> {
    const now = Date.now();
    
    // Use cache if available and fresh
    if (this.catalog && (now - this.lastFetch) < this.cacheDuration) {
      return this.catalog;
    }

    try {
      const response = await fetch(this.catalogUrl);
      if (!response.ok) {
        throw new Error(`Failed to load breach catalog: ${response.status}`);
      }
      
      this.catalog = await response.json();
      this.lastFetch = now;
      
      console.log(`Loaded ${this.catalog.total_breaches} breach cases`);
      return this.catalog;
      
    } catch (error) {
      console.error('Error loading breach catalog:', error);
      
      // Return empty catalog as fallback
      return {
        version: '1.0.0',
        last_updated: new Date().toISOString(),
        total_breaches: 0,
        breaches_by_model: {},
        breaches: []
      };
    }
  }

  /**
   * Get recent breaches for a specific business model
   */
  public async getBreachesByModel(
    modelId: number, 
    limit: number = 5
  ): Promise<BreachCase[]> {
    const catalog = await this.loadCatalog();
    
    return catalog.breaches
      .filter(breach => breach.business_model_match.primary_model === modelId)
      .sort((a, b) => new Date(b.date_discovered).getTime() - new Date(a.date_discovered).getTime())
      .slice(0, limit);
  }

  /**
   * Find similar breaches based on company profile
   */
  public async findSimilarBreaches(criteria: MatchingCriteria): Promise<{
    exact_matches: BreachCase[];
    similar_matches: BreachCase[];
    risk_insights: {
      average_loss: number;
      average_downtime: number;
      common_vectors: string[];
      peer_comparison: string;
    };
  }> {
    const catalog = await this.loadCatalog();
    const { businessModel, companySize, region, diiScore, limit = 10 } = criteria;
    
    // Score each breach by similarity
    const scoredBreaches = catalog.breaches.map(breach => {
      let score = 0;
      
      // Business model match (highest weight)
      if (breach.business_model_match.primary_model === businessModel) {
        score += breach.business_model_match.confidence === 'high' ? 10 : 
                breach.business_model_match.confidence === 'medium' ? 7 : 5;
      }
      
      // Company size match
      if (companySize && breach.victim_profile.size_employees === companySize) {
        score += 5;
      }
      
      // Region match
      if (region && breach.victim_profile.region === region) {
        score += 3;
      }
      
      // DII score proximity (if victim DII is estimated)
      if (diiScore && breach.victim_profile.dii_estimate) {
        const diff = Math.abs(diiScore - breach.victim_profile.dii_estimate);
        score += Math.max(0, 5 - diff);
      }
      
      return { breach, score };
    });
    
    // Sort by score and separate exact vs similar
    const sorted = scoredBreaches
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score);
    
    const exact_matches = sorted
      .filter(item => item.score >= 10)
      .map(item => item.breach)
      .slice(0, limit);
    
    const similar_matches = sorted
      .filter(item => item.score >= 5 && item.score < 10)
      .map(item => item.breach)
      .slice(0, limit);
    
    // Calculate risk insights
    const relevantBreaches = [...exact_matches, ...similar_matches];
    const risk_insights = this.calculateRiskInsights(relevantBreaches, diiScore);
    
    return {
      exact_matches,
      similar_matches,
      risk_insights
    };
  }

  /**
   * Get breaches that affected specific DII dimensions
   */
  public async getBreachesByDimension(
    dimension: keyof NonNullable<BreachCase['dii_dimensions_impact']>,
    modelId?: number
  ): Promise<BreachCase[]> {
    const catalog = await this.loadCatalog();
    
    return catalog.breaches.filter(breach => {
      // Check if dimension was impacted
      const dimensionImpacted = breach.dii_dimensions_impact?.[dimension];
      if (!dimensionImpacted) return false;
      
      // Filter by model if specified
      if (modelId && breach.business_model_match.primary_model !== modelId) {
        return false;
      }
      
      return true;
    });
  }

  /**
   * Get attack trends for a business model
   */
  public async getAttackTrends(modelId: number): Promise<{
    top_vectors: Array<{ vector: string; count: number; avg_loss: number }>;
    monthly_trend: Array<{ month: string; count: number }>;
    severity_distribution: { low: number; medium: number; high: number; critical: number };
  }> {
    const catalog = await this.loadCatalog();
    const modelBreaches = catalog.breaches.filter(
      b => b.business_model_match.primary_model === modelId
    );
    
    // Aggregate by attack vector
    const vectorStats: Record<string, { count: number; total_loss: number }> = {};
    modelBreaches.forEach(breach => {
      const vector = breach.attack.vector;
      if (!vectorStats[vector]) {
        vectorStats[vector] = { count: 0, total_loss: 0 };
      }
      vectorStats[vector].count++;
      vectorStats[vector].total_loss += breach.impact.financial_loss_usd;
    });
    
    const top_vectors = Object.entries(vectorStats)
      .map(([vector, stats]) => ({
        vector,
        count: stats.count,
        avg_loss: Math.round(stats.total_loss / stats.count)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    
    // Monthly trend (last 6 months)
    const monthly_trend = this.calculateMonthlyTrend(modelBreaches);
    
    // Severity distribution based on financial impact
    const severity_distribution = this.calculateSeverityDistribution(modelBreaches);
    
    return {
      top_vectors,
      monthly_trend,
      severity_distribution
    };
  }

  /**
   * Calculate risk insights from breach data
   */
  private calculateRiskInsights(
    breaches: BreachCase[], 
    userDiiScore?: number
  ): BreachEvidenceService['findSimilarBreaches'] extends (...args: any[]) => Promise<{ risk_insights: infer T }> ? T : never {
    if (breaches.length === 0) {
      return {
        average_loss: 0,
        average_downtime: 0,
        common_vectors: [],
        peer_comparison: 'No comparable breaches found'
      };
    }
    
    // Calculate averages
    const totalLoss = breaches.reduce((sum, b) => sum + b.impact.financial_loss_usd, 0);
    const totalDowntime = breaches.reduce((sum, b) => sum + b.impact.operational_impact.downtime_hours, 0);
    
    // Find common attack vectors
    const vectorCounts: Record<string, number> = {};
    breaches.forEach(breach => {
      vectorCounts[breach.attack.vector] = (vectorCounts[breach.attack.vector] || 0) + 1;
    });
    
    const common_vectors = Object.entries(vectorCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([vector]) => vector);
    
    // Peer comparison
    let peer_comparison = `Based on ${breaches.length} similar breaches`;
    if (userDiiScore && breaches.some(b => b.victim_profile.dii_estimate)) {
      const avgVictimDii = breaches
        .filter(b => b.victim_profile.dii_estimate)
        .reduce((sum, b) => sum + (b.victim_profile.dii_estimate || 0), 0) / 
        breaches.filter(b => b.victim_profile.dii_estimate).length;
      
      if (userDiiScore > avgVictimDii) {
        peer_comparison += `, your DII score (${userDiiScore}) is ${(userDiiScore - avgVictimDii).toFixed(1)} points higher than breach victims`;
      } else {
        peer_comparison += `, your DII score (${userDiiScore}) is similar to breach victims (${avgVictimDii.toFixed(1)})`;
      }
    }
    
    return {
      average_loss: Math.round(totalLoss / breaches.length),
      average_downtime: Math.round(totalDowntime / breaches.length),
      common_vectors,
      peer_comparison
    };
  }

  /**
   * Calculate monthly breach trend
   */
  private calculateMonthlyTrend(breaches: BreachCase[]): Array<{ month: string; count: number }> {
    const monthCounts: Record<string, number> = {};
    const now = new Date();
    
    // Initialize last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = date.toISOString().slice(0, 7); // YYYY-MM
      monthCounts[key] = 0;
    }
    
    // Count breaches by month
    breaches.forEach(breach => {
      const month = breach.date_discovered.slice(0, 7);
      if (monthCounts.hasOwnProperty(month)) {
        monthCounts[month]++;
      }
    });
    
    return Object.entries(monthCounts).map(([month, count]) => ({ month, count }));
  }

  /**
   * Calculate severity distribution
   */
  private calculateSeverityDistribution(
    breaches: BreachCase[]
  ): { low: number; medium: number; high: number; critical: number } {
    const distribution = { low: 0, medium: 0, high: 0, critical: 0 };
    
    breaches.forEach(breach => {
      const loss = breach.impact.financial_loss_usd;
      if (loss < 50000) distribution.low++;
      else if (loss < 250000) distribution.medium++;
      else if (loss < 1000000) distribution.high++;
      else distribution.critical++;
    });
    
    return distribution;
  }
}

// Export singleton instance
export const breachEvidenceService = BreachEvidenceService.getInstance();