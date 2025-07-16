/**
 * Data Validation Matrix Component
 * Comprehensive grid showing validation status for each company
 */

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  Search,
  ChevronUp,
  ChevronDown,
  Filter,
  AlertCircle
} from 'lucide-react';
import { cn } from '@shared/utils/cn';
import type { Company } from '@/database/types';
import { BUSINESS_MODEL_DEFINITIONS } from '@/core/business-model/business-model-definitions';

interface DataValidationMatrixProps {
  companies: Company[];
  onSelectCompany: (company: Company) => void;
}

type SortField = 'name' | 'score' | 'confidence' | 'completeness' | 'model' | 'status';
type SortDirection = 'asc' | 'desc';

export function DataValidationMatrix({ companies, onSelectCompany }: DataValidationMatrixProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('status');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [filterStatus, setFilterStatus] = useState<'all' | 'valid' | 'warning' | 'error'>('all');

  // Validation functions
  const validateScore = (score: number | null): 'valid' | 'warning' | 'error' => {
    if (score === null || score === undefined) return 'error';
    if (score === 10.0) return 'warning'; // Perfect score is suspicious
    if (score < 0 || score > 10) return 'error';
    return 'valid';
  };

  const validateDimensions = (company: Company): { complete: boolean; count: number } => {
    // In a real implementation, we'd check the actual dimension data
    // For now, we'll use data_completeness as a proxy
    const completeness = company.data_completeness || 0;
    return {
      complete: completeness >= 0.9,
      count: Math.round(completeness * 5) // Assuming 5 dimensions
    };
  };

  const validateBusinessModel = (company: Company): boolean => {
    // Check if business model aligns with industry
    const model = company.dii_business_model;
    const industry = company.industry_traditional;
    
    // Simple validation - in production, this would be more sophisticated
    return model !== null && BUSINESS_MODEL_DEFINITIONS[model] !== undefined;
  };

  const getCompanyStatus = (company: Company): 'valid' | 'warning' | 'error' => {
    const scoreStatus = validateScore(company.original_dii_score);
    const dimensions = validateDimensions(company);
    const modelValid = validateBusinessModel(company);
    
    if (scoreStatus === 'error' || !dimensions.complete || !modelValid) {
      return 'error';
    }
    if (scoreStatus === 'warning' || company.needs_reassessment) {
      return 'warning';
    }
    return 'valid';
  };

  // Filter and sort companies
  const processedCompanies = useMemo(() => {
    let filtered = companies.filter(company => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (!company.name.toLowerCase().includes(query) &&
            !company.industry_traditional?.toLowerCase().includes(query)) {
          return false;
        }
      }
      
      // Status filter
      if (filterStatus !== 'all') {
        const status = getCompanyStatus(company);
        if (status !== filterStatus) return false;
      }
      
      return true;
    });

    // Sort
    filtered.sort((a, b) => {
      let aVal: any, bVal: any;
      
      switch (sortField) {
        case 'name':
          aVal = a.name.toLowerCase();
          bVal = b.name.toLowerCase();
          break;
        case 'score':
          aVal = a.original_dii_score || 0;
          bVal = b.original_dii_score || 0;
          break;
        case 'confidence':
          aVal = a.migration_confidence || '';
          bVal = b.migration_confidence || '';
          break;
        case 'completeness':
          aVal = a.data_completeness || 0;
          bVal = b.data_completeness || 0;
          break;
        case 'model':
          aVal = a.dii_business_model || '';
          bVal = b.dii_business_model || '';
          break;
        case 'status':
          aVal = getCompanyStatus(a);
          bVal = getCompanyStatus(b);
          break;
      }
      
      if (sortDirection === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
    
    return filtered;
  }, [companies, searchQuery, sortField, sortDirection, filterStatus]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? 
      <ChevronUp className="w-3 h-3" /> : 
      <ChevronDown className="w-3 h-3" />;
  };

  const statusCounts = useMemo(() => {
    const counts = { valid: 0, warning: 0, error: 0 };
    companies.forEach(company => {
      const status = getCompanyStatus(company);
      counts[status]++;
    });
    return counts;
  }, [companies]);

  return (
    <div className="space-y-4">
      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-dark-text-secondary" />
          <input
            type="text"
            placeholder="Search companies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-dark-bg border border-dark-border rounded-lg
                     text-dark-text-primary placeholder-dark-text-secondary
                     focus:outline-none focus:border-primary-600"
          />
        </div>
        
        <div className="flex gap-2">
          {(['all', 'valid', 'warning', 'error'] as const).map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={cn(
                "px-3 py-2 rounded-lg text-sm font-medium transition-all",
                filterStatus === status
                  ? status === 'valid' ? 'bg-green-600/20 text-green-400 border border-green-600/30' :
                    status === 'warning' ? 'bg-yellow-600/20 text-yellow-400 border border-yellow-600/30' :
                    status === 'error' ? 'bg-red-600/20 text-red-400 border border-red-600/30' :
                    'bg-primary-600/20 text-primary-600 border border-primary-600/30'
                  : 'bg-dark-bg text-dark-text-secondary border border-dark-border hover:text-dark-text-primary'
              )}
            >
              {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
              {status !== 'all' && (
                <span className="ml-1">({statusCounts[status]})</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Validation Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-dark-border">
              <th className="text-left py-3 px-4">
                <button
                  onClick={() => handleSort('name')}
                  className="flex items-center gap-1 text-sm font-medium text-dark-text-secondary hover:text-dark-text-primary"
                >
                  Company <SortIcon field="name" />
                </button>
              </th>
              <th className="text-left py-3 px-4">
                <button
                  onClick={() => handleSort('score')}
                  className="flex items-center gap-1 text-sm font-medium text-dark-text-secondary hover:text-dark-text-primary"
                >
                  DII Score <SortIcon field="score" />
                </button>
              </th>
              <th className="text-left py-3 px-4">
                <button
                  onClick={() => handleSort('confidence')}
                  className="flex items-center gap-1 text-sm font-medium text-dark-text-secondary hover:text-dark-text-primary"
                >
                  Confidence <SortIcon field="confidence" />
                </button>
              </th>
              <th className="text-left py-3 px-4">
                <button
                  onClick={() => handleSort('completeness')}
                  className="flex items-center gap-1 text-sm font-medium text-dark-text-secondary hover:text-dark-text-primary"
                >
                  Dimensions <SortIcon field="completeness" />
                </button>
              </th>
              <th className="text-left py-3 px-4">
                <span className="text-sm font-medium text-dark-text-secondary">
                  ZT Data
                </span>
              </th>
              <th className="text-left py-3 px-4">
                <button
                  onClick={() => handleSort('model')}
                  className="flex items-center gap-1 text-sm font-medium text-dark-text-secondary hover:text-dark-text-primary"
                >
                  Business Model <SortIcon field="model" />
                </button>
              </th>
              <th className="text-left py-3 px-4">
                <button
                  onClick={() => handleSort('status')}
                  className="flex items-center gap-1 text-sm font-medium text-dark-text-secondary hover:text-dark-text-primary"
                >
                  Status <SortIcon field="status" />
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {processedCompanies.map((company, index) => {
              const scoreStatus = validateScore(company.original_dii_score);
              const dimensions = validateDimensions(company);
              const modelValid = validateBusinessModel(company);
              const overallStatus = getCompanyStatus(company);
              
              return (
                <motion.tr
                  key={company.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.02 }}
                  onClick={() => onSelectCompany(company)}
                  className="border-b border-dark-border/50 hover:bg-dark-bg/50 cursor-pointer transition-colors"
                >
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium text-dark-text-primary">{company.name}</p>
                      <p className="text-xs text-dark-text-secondary">{company.industry_traditional}</p>
                    </div>
                  </td>
                  
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "font-medium",
                        scoreStatus === 'valid' ? 'text-dark-text-primary' :
                        scoreStatus === 'warning' ? 'text-yellow-400' : 'text-red-400'
                      )}>
                        {company.original_dii_score?.toFixed(2) || 'N/A'}
                      </span>
                      {scoreStatus === 'warning' && (
                        <AlertTriangle className="w-3 h-3 text-yellow-400" title="Perfect score - suspicious" />
                      )}
                    </div>
                  </td>
                  
                  <td className="py-3 px-4">
                    <span className={cn(
                      "px-2 py-1 rounded text-xs font-medium",
                      company.migration_confidence === 'HIGH' ? 'bg-green-600/20 text-green-400' :
                      company.migration_confidence === 'MEDIUM' ? 'bg-yellow-600/20 text-yellow-400' :
                      'bg-red-600/20 text-red-400'
                    )}>
                      {company.migration_confidence || 'UNKNOWN'}
                    </span>
                  </td>
                  
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "text-sm",
                        dimensions.complete ? 'text-green-400' : 'text-yellow-400'
                      )}>
                        {dimensions.count}/5
                      </span>
                      {dimensions.complete ? (
                        <CheckCircle className="w-3 h-3 text-green-400" />
                      ) : (
                        <AlertCircle className="w-3 h-3 text-yellow-400" />
                      )}
                    </div>
                  </td>
                  
                  <td className="py-3 px-4">
                    {company.has_zt_maturity ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-400" />
                    )}
                  </td>
                  
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "text-sm",
                        modelValid ? 'text-dark-text-primary' : 'text-red-400'
                      )}>
                        {company.dii_business_model ? 
                          BUSINESS_MODEL_DEFINITIONS[company.dii_business_model]?.name : 
                          'Not set'}
                      </span>
                      {!modelValid && (
                        <AlertCircle className="w-3 h-3 text-red-400" />
                      )}
                    </div>
                  </td>
                  
                  <td className="py-3 px-4">
                    <span className={cn(
                      "px-2 py-1 rounded text-xs font-medium",
                      overallStatus === 'valid' ? 'bg-green-600/20 text-green-400' :
                      overallStatus === 'warning' ? 'bg-yellow-600/20 text-yellow-400' :
                      'bg-red-600/20 text-red-400'
                    )}>
                      {overallStatus === 'valid' ? 'Valid' :
                       overallStatus === 'warning' ? 'Review' : 'Error'}
                    </span>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Results Summary */}
      <div className="text-sm text-dark-text-secondary text-center py-4">
        Showing {processedCompanies.length} of {companies.length} companies
      </div>
    </div>
  );
}