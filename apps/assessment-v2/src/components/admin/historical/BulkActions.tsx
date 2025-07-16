/**
 * Bulk Actions Component
 * Manage multiple companies at once for efficiency
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Upload,
  Download,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Settings,
  FileSpreadsheet,
  Database,
  Flag,
  TrendingUp
} from 'lucide-react';
import { cn } from '@shared/utils/cn';
import type { Company } from '@/database/types';
import { getDatabaseService } from '@/database';

interface BulkActionsProps {
  companies: Company[];
  onUpdate: () => void;
}

type ConfidenceLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export function BulkActions({ companies, onUpdate }: BulkActionsProps) {
  const [selectedAction, setSelectedAction] = useState<string>('');
  const [processing, setProcessing] = useState(false);
  const [results, setResults] = useState<{
    success: number;
    failed: number;
    message: string;
  } | null>(null);
  
  // Filters for bulk selection
  const [filters, setFilters] = useState({
    confidence: 'all' as 'all' | ConfidenceLevel,
    hasZTData: 'all' as 'all' | 'yes' | 'no',
    perfectScores: false,
    needsReassessment: false,
    incompleteData: false
  });

  const getFilteredCompanies = () => {
    return companies.filter(company => {
      if (filters.confidence !== 'all' && company.migration_confidence !== filters.confidence) {
        return false;
      }
      if (filters.hasZTData !== 'all') {
        const hasZT = company.has_zt_maturity;
        if (filters.hasZTData === 'yes' && !hasZT) return false;
        if (filters.hasZTData === 'no' && hasZT) return false;
      }
      if (filters.perfectScores && company.original_dii_score !== 10.0) {
        return false;
      }
      if (filters.needsReassessment && !company.needs_reassessment) {
        return false;
      }
      if (filters.incompleteData && (company.data_completeness || 0) >= 0.9) {
        return false;
      }
      return true;
    });
  };

  const handleBulkUpdate = async (action: string) => {
    setProcessing(true);
    setResults(null);
    
    const selectedCompanies = getFilteredCompanies();
    let successCount = 0;
    let failedCount = 0;

    try {
      const dbService = await getDatabaseService();
      
      for (const company of selectedCompanies) {
        try {
          switch (action) {
            case 'flag-reassessment':
              await dbService.updateCompany(company.id, {
                needs_reassessment: true
              });
              break;
              
            case 'update-confidence-low':
              await dbService.updateCompany(company.id, {
                migration_confidence: 'LOW' as any
              });
              break;
              
            case 'update-confidence-medium':
              await dbService.updateCompany(company.id, {
                migration_confidence: 'MEDIUM' as any
              });
              break;
              
            case 'update-confidence-high':
              await dbService.updateCompany(company.id, {
                migration_confidence: 'HIGH' as any
              });
              break;
          }
          successCount++;
        } catch (error) {
          failedCount++;
          console.error(`Failed to update company ${company.name}:`, error);
        }
      }
      
      setResults({
        success: successCount,
        failed: failedCount,
        message: `Successfully updated ${successCount} companies`
      });
      
      onUpdate(); // Refresh the data
    } catch (error) {
      setResults({
        success: 0,
        failed: selectedCompanies.length,
        message: 'Bulk update failed'
      });
    } finally {
      setProcessing(false);
    }
  };

  const exportForReview = () => {
    const selectedCompanies = getFilteredCompanies();
    
    const csv = [
      // Headers
      ['Company Name', 'Industry', 'Country', 'DII Score', 'Confidence', 'Has ZT Data', 'Data Completeness', 'Business Model', 'Needs Reassessment', 'Legacy ID'],
      // Data
      ...selectedCompanies.map(company => [
        company.name,
        company.industry_traditional || '',
        company.country || '',
        company.original_dii_score?.toString() || '',
        company.migration_confidence || '',
        company.has_zt_maturity ? 'Yes' : 'No',
        ((company.data_completeness || 0) * 100).toFixed(0) + '%',
        company.dii_business_model || '',
        company.needs_reassessment ? 'Yes' : 'No',
        company.legacy_dii_id?.toString() || ''
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `historical_data_review_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const selectedCount = getFilteredCompanies().length;

  return (
    <div className="space-y-6">
      {/* Selection Filters */}
      <div className="bg-dark-bg border border-dark-border rounded-lg p-6">
        <h3 className="text-lg font-medium text-dark-text-primary mb-4">
          Select Companies
        </h3>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Confidence Filter */}
          <div>
            <label className="block text-sm font-medium text-dark-text-secondary mb-2">
              Migration Confidence
            </label>
            <select
              value={filters.confidence}
              onChange={(e) => setFilters(prev => ({ ...prev, confidence: e.target.value as any }))}
              className="w-full bg-dark-surface border border-dark-border rounded-lg px-3 py-2
                       text-dark-text-primary focus:outline-none focus:border-primary-600"
            >
              <option value="all">All Confidence Levels</option>
              <option value="HIGH">HIGH Only</option>
              <option value="MEDIUM">MEDIUM Only</option>
              <option value="LOW">LOW Only</option>
            </select>
          </div>
          
          {/* ZT Data Filter */}
          <div>
            <label className="block text-sm font-medium text-dark-text-secondary mb-2">
              Zero Trust Data
            </label>
            <select
              value={filters.hasZTData}
              onChange={(e) => setFilters(prev => ({ ...prev, hasZTData: e.target.value as any }))}
              className="w-full bg-dark-surface border border-dark-border rounded-lg px-3 py-2
                       text-dark-text-primary focus:outline-none focus:border-primary-600"
            >
              <option value="all">All Companies</option>
              <option value="yes">Has ZT Data</option>
              <option value="no">Missing ZT Data</option>
            </select>
          </div>
        </div>
        
        {/* Checkbox Filters */}
        <div className="space-y-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.perfectScores}
              onChange={(e) => setFilters(prev => ({ ...prev, perfectScores: e.target.checked }))}
              className="w-4 h-4 text-primary-600 bg-dark-surface border-dark-border rounded"
            />
            <span className="text-sm text-dark-text-primary">Perfect scores (10.0)</span>
          </label>
          
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.needsReassessment}
              onChange={(e) => setFilters(prev => ({ ...prev, needsReassessment: e.target.checked }))}
              className="w-4 h-4 text-primary-600 bg-dark-surface border-dark-border rounded"
            />
            <span className="text-sm text-dark-text-primary">Already flagged for reassessment</span>
          </label>
          
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.incompleteData}
              onChange={(e) => setFilters(prev => ({ ...prev, incompleteData: e.target.checked }))}
              className="w-4 h-4 text-primary-600 bg-dark-surface border-dark-border rounded"
            />
            <span className="text-sm text-dark-text-primary">Incomplete data (&lt;90%)</span>
          </label>
        </div>
        
        {/* Selection Summary */}
        <div className="mt-4 p-3 bg-primary-600/10 border border-primary-600/20 rounded-lg">
          <p className="text-sm text-primary-600">
            <span className="font-semibold">{selectedCount}</span> companies selected
            {selectedCount > 0 && ` (${((selectedCount / companies.length) * 100).toFixed(0)}% of total)`}
          </p>
        </div>
      </div>

      {/* Available Actions */}
      <div className="bg-dark-bg border border-dark-border rounded-lg p-6">
        <h3 className="text-lg font-medium text-dark-text-primary mb-4">
          Bulk Actions
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
          {/* Update Actions */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-dark-text-secondary">Update Actions</h4>
            
            <button
              onClick={() => handleBulkUpdate('flag-reassessment')}
              disabled={selectedCount === 0 || processing}
              className={cn(
                "w-full p-3 rounded-lg border text-left transition-all flex items-center gap-3",
                selectedCount === 0 || processing
                  ? "border-dark-border bg-dark-surface/50 text-dark-text-secondary cursor-not-allowed"
                  : "border-dark-border hover:border-orange-600/50 hover:bg-orange-600/5"
              )}
            >
              <Flag className="w-5 h-5 text-orange-400" />
              <div>
                <p className="font-medium text-dark-text-primary">Flag for Reassessment</p>
                <p className="text-xs text-dark-text-secondary">Mark selected companies for new assessment</p>
              </div>
            </button>
            
            <div className="space-y-2">
              <p className="text-xs text-dark-text-secondary">Update Confidence Level:</p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleBulkUpdate('update-confidence-low')}
                  disabled={selectedCount === 0 || processing}
                  className="flex-1 px-3 py-2 bg-red-600/10 text-red-400 border border-red-600/20 
                           rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed
                           hover:bg-red-600/20 transition-colors"
                >
                  LOW
                </button>
                <button
                  onClick={() => handleBulkUpdate('update-confidence-medium')}
                  disabled={selectedCount === 0 || processing}
                  className="flex-1 px-3 py-2 bg-yellow-600/10 text-yellow-400 border border-yellow-600/20 
                           rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed
                           hover:bg-yellow-600/20 transition-colors"
                >
                  MEDIUM
                </button>
                <button
                  onClick={() => handleBulkUpdate('update-confidence-high')}
                  disabled={selectedCount === 0 || processing}
                  className="flex-1 px-3 py-2 bg-green-600/10 text-green-400 border border-green-600/20 
                           rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed
                           hover:bg-green-600/20 transition-colors"
                >
                  HIGH
                </button>
              </div>
            </div>
          </div>
          
          {/* Export Actions */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-dark-text-secondary">Export Actions</h4>
            
            <button
              onClick={exportForReview}
              disabled={selectedCount === 0}
              className={cn(
                "w-full p-3 rounded-lg border text-left transition-all flex items-center gap-3",
                selectedCount === 0
                  ? "border-dark-border bg-dark-surface/50 text-dark-text-secondary cursor-not-allowed"
                  : "border-dark-border hover:border-primary-600/50 hover:bg-primary-600/5"
              )}
            >
              <FileSpreadsheet className="w-5 h-5 text-primary-600" />
              <div>
                <p className="font-medium text-dark-text-primary">Export for Review</p>
                <p className="text-xs text-dark-text-secondary">Download CSV with selected companies</p>
              </div>
            </button>
            
            <button
              disabled
              className="w-full p-3 rounded-lg border border-dark-border bg-dark-surface/50 
                       text-dark-text-secondary cursor-not-allowed text-left flex items-center gap-3"
            >
              <Upload className="w-5 h-5" />
              <div>
                <p className="font-medium">Import Corrections</p>
                <p className="text-xs">Coming soon - upload reviewed CSV</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Processing Status */}
      {processing && (
        <div className="bg-primary-600/10 border border-primary-600/20 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <RefreshCw className="w-5 h-5 text-primary-600 animate-spin" />
            <p className="text-sm text-primary-600">Processing bulk update...</p>
          </div>
        </div>
      )}

      {/* Results */}
      {results && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "rounded-lg p-4",
            results.failed === 0
              ? "bg-green-600/10 border border-green-600/20"
              : "bg-yellow-600/10 border border-yellow-600/20"
          )}
        >
          <div className="flex items-center gap-3">
            {results.failed === 0 ? (
              <CheckCircle className="w-5 h-5 text-green-400" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
            )}
            <div>
              <p className={cn(
                "font-medium",
                results.failed === 0 ? "text-green-400" : "text-yellow-400"
              )}>
                {results.message}
              </p>
              {results.failed > 0 && (
                <p className="text-sm text-dark-text-secondary">
                  {results.failed} companies failed to update
                </p>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Summary Statistics */}
      <div className="bg-dark-surface/50 rounded-lg p-4">
        <h4 className="text-sm font-medium text-dark-text-secondary mb-3">Quick Stats</h4>
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-primary-600">{companies.length}</p>
            <p className="text-xs text-dark-text-secondary">Total Companies</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-yellow-400">
              {companies.filter(c => c.needs_reassessment).length}
            </p>
            <p className="text-xs text-dark-text-secondary">Need Reassessment</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-red-400">
              {companies.filter(c => c.migration_confidence === 'LOW').length}
            </p>
            <p className="text-xs text-dark-text-secondary">Low Confidence</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-400">
              {companies.filter(c => c.has_zt_maturity).length}
            </p>
            <p className="text-xs text-dark-text-secondary">Have ZT Data</p>
          </div>
        </div>
      </div>
    </div>
  );
}