/**
 * Fuzzy Matching Utilities
 * Provides fuzzy string matching for company search with typo tolerance
 */

/**
 * Calculate Levenshtein distance between two strings
 * Lower distance means more similar strings
 */
export function levenshteinDistance(str1: string, str2: string): number {
  const track = Array(str2.length + 1)
    .fill(null)
    .map(() => Array(str1.length + 1).fill(null));

  for (let i = 0; i <= str1.length; i += 1) {
    track[0][i] = i;
  }

  for (let j = 0; j <= str2.length; j += 1) {
    track[j][0] = j;
  }

  for (let j = 1; j <= str2.length; j += 1) {
    for (let i = 1; i <= str1.length; i += 1) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      track[j][i] = Math.min(
        track[j][i - 1] + 1, // deletion
        track[j - 1][i] + 1, // insertion
        track[j - 1][i - 1] + indicator // substitution
      );
    }
  }

  return track[str2.length][str1.length];
}

/**
 * Calculate similarity score between two strings (0-1)
 * 1 means exact match, 0 means no similarity
 */
export function similarityScore(str1: string, str2: string): number {
  const distance = levenshteinDistance(str1.toLowerCase(), str2.toLowerCase());
  const maxLength = Math.max(str1.length, str2.length);
  return maxLength === 0 ? 1 : 1 - distance / maxLength;
}

/**
 * Check if a string contains all words from the query (in any order)
 */
export function containsAllWords(text: string, query: string): boolean {
  const textLower = text.toLowerCase();
  const queryWords = query.toLowerCase().split(/\s+/).filter(w => w.length > 0);
  
  return queryWords.every(word => textLower.includes(word));
}

/**
 * Check if a string starts with the query
 */
export function startsWithQuery(text: string, query: string): boolean {
  return text.toLowerCase().startsWith(query.toLowerCase());
}

/**
 * Calculate a composite match score for fuzzy matching
 * Takes into account multiple factors for better relevance
 */
export function fuzzyMatchScore(text: string, query: string): number {
  const textLower = text.toLowerCase();
  const queryLower = query.toLowerCase();
  
  // Exact match
  if (textLower === queryLower) {
    return 1.0;
  }
  
  // Starts with query (high priority)
  if (startsWithQuery(text, query)) {
    return 0.9;
  }
  
  // Contains exact query as substring
  if (textLower.includes(queryLower)) {
    return 0.8;
  }
  
  // Contains all words from query
  if (containsAllWords(text, query)) {
    return 0.7;
  }
  
  // Calculate similarity score (handles typos)
  const similarity = similarityScore(text, query);
  
  // If similarity is high enough, use it
  if (similarity > 0.6) {
    return similarity * 0.8; // Scale down to prioritize exact matches
  }
  
  // Check individual word matches
  const queryWords = queryLower.split(/\s+/).filter(w => w.length > 0);
  const textWords = textLower.split(/\s+/).filter(w => w.length > 0);
  
  let wordMatchScore = 0;
  for (const queryWord of queryWords) {
    for (const textWord of textWords) {
      const wordSimilarity = similarityScore(queryWord, textWord);
      if (wordSimilarity > 0.8) {
        wordMatchScore += wordSimilarity / queryWords.length;
      }
    }
  }
  
  return Math.min(wordMatchScore * 0.6, 0.5); // Cap at 0.5 for partial matches
}

/**
 * Interface for items that can be fuzzy matched
 */
export interface FuzzyMatchable {
  name: string;
  alternativeNames?: string[];
  [key: string]: any;
}

/**
 * Perform fuzzy search on an array of items
 */
export function fuzzySearch<T extends FuzzyMatchable>(
  items: T[],
  query: string,
  options: {
    threshold?: number;
    maxResults?: number;
    includeScore?: boolean;
  } = {}
): Array<T & { matchScore?: number }> {
  const { threshold = 0.3, maxResults = 50, includeScore = false } = options;
  
  if (!query || query.trim().length === 0) {
    return items.slice(0, maxResults);
  }
  
  const scoredItems = items.map(item => {
    // Calculate score for main name
    let score = fuzzyMatchScore(item.name, query);
    
    // Check alternative names if available
    if (item.alternativeNames) {
      for (const altName of item.alternativeNames) {
        const altScore = fuzzyMatchScore(altName, query);
        score = Math.max(score, altScore);
      }
    }
    
    return { ...item, matchScore: score };
  });
  
  // Filter by threshold and sort by score
  const filtered = scoredItems
    .filter(item => item.matchScore >= threshold)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, maxResults);
  
  // Remove score if not requested
  if (!includeScore) {
    return filtered.map(({ matchScore, ...item }) => item as T);
  }
  
  return filtered;
}

/**
 * Highlight matching parts of text
 */
export function highlightMatch(text: string, query: string): string {
  if (!query) return text;
  
  const regex = new RegExp(`(${query.split(/\s+/).join('|')})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}