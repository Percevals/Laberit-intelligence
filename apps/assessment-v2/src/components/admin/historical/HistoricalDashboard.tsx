/**
 * Historical Data Quality Dashboard
 * Main container for validating ZT v1 to DII v4.0 migration
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  History, 
  AlertTriangle, 
  CheckCircle, 
  RefreshCw,
  FileSearch,
  Settings 
} from 'lucide-react';
import { getDatabaseService } from '@/database';
import { MigrationQualityOverview } from './MigrationQualityOverview';
import { DataValidationMatrix } from './DataValidationMatrix';
import { AnomalyDetection } from './AnomalyDetection';
import { ManualReviewInterface } from './ManualReviewInterface';
import { BulkActions } from './BulkActions';
import type { Company } from '@/database/types';

interface QualityMetrics {
  totalCompanies: number;
  highConfidence: number;
  mediumConfidence: number;
  lowConfidence: number;
  completeData: number;
  hasZTMaturity: number;
  needsReassessment: number;
  perfectScores: number;
  dataQualityScore: number;
  migrationConfidenceIndex: number;
}

export function HistoricalDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'validation' | 'anomalies' | 'review' | 'bulk'>('overview');
  const [companies, setCompanies] = useState<Company[]>([]);
  const [metrics, setMetrics] = useState<QualityMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  useEffect(() => {
    loadHistoricalData();
  }, []);

  const loadHistoricalData = async () => {
    setLoading(true);
    try {
      const dbService = await getDatabaseService();
      const allCompanies = await dbService.searchCompanies('');
      
      // Filter for companies with historical data
      const historicalCompanies = allCompanies.filter(c => c.legacy_dii_id != null);
      setCompanies(historicalCompanies);
      
      // Calculate metrics
      const metrics = calculateQualityMetrics(historicalCompanies);
      setMetrics(metrics);
    } catch (error) {
      console.error('Failed to load historical data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateQualityMetrics = (companies: Company[]): QualityMetrics => {
    const total = companies.length;
    const highConfidence = companies.filter(c => c.migration_confidence === 'HIGH').length;
    const mediumConfidence = companies.filter(c => c.migration_confidence === 'MEDIUM').length;
    const lowConfidence = companies.filter(c => c.migration_confidence === 'LOW').length;
    const completeData = companies.filter(c => (c.data_completeness || 0) >= 0.9).length;
    const hasZTMaturity = companies.filter(c => c.has_zt_maturity).length;
    const needsReassessment = companies.filter(c => c.needs_reassessment).length;
    const perfectScores = companies.filter(c => c.original_dii_score === 10.0).length;
    
    // Calculate Data Quality Score (0-100)
    const completenessScore = (completeData / total) * 25;
    const validityScore = ((total - perfectScores) / total) * 25;
    const confidenceScore = ((highConfidence + mediumConfidence * 0.6) / total) * 25;
    const freshnessScore = ((total - needsReassessment) / total) * 25;
    const dataQualityScore = completenessScore + validityScore + confidenceScore + freshnessScore;
    
    // Calculate Migration Confidence Index (0-1)
    const migrationConfidenceIndex = (
      (highConfidence * 1.0 + mediumConfidence * 0.6 + lowConfidence * 0.2) / total
    );
    
    return {
      totalCompanies: total,
      highConfidence,
      mediumConfidence,
      lowConfidence,
      completeData,
      hasZTMaturity,
      needsReassessment,
      perfectScores,
      dataQualityScore: Math.round(dataQualityScore),
      migrationConfidenceIndex: Math.round(migrationConfidenceIndex * 100) / 100
    };
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: History },
    { id: 'validation', label: 'Validation', icon: CheckCircle },
    { id: 'anomalies', label: 'Anomalies', icon: AlertTriangle },
    { id: 'review', label: 'Manual Review', icon: FileSearch },
    { id: 'bulk', label: 'Bulk Actions', icon: Settings }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RefreshCw className="w-8 h-8 text-primary-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-dark-surface border border-dark-border rounded-xl p-6">
        <h1 className="text-2xl font-bold text-dark-text-primary mb-2">
          Historical Data Quality Dashboard
        </h1>
        <p className="text-dark-text-secondary">
          Validating migration from Zero Trust v1 to DII v4.0 for {metrics?.totalCompanies || 0} companies
        </p>
        
        {/* Quality Score Banner */}
        {metrics && (
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="bg-dark-bg rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-dark-text-secondary">Data Quality Score</span>
                <span className={`text-2xl font-bold ${
                  metrics.dataQualityScore >= 80 ? 'text-green-400' :
                  metrics.dataQualityScore >= 60 ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {metrics.dataQualityScore}%
                </span>
              </div>
              <div className="mt-2 h-2 bg-dark-border rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all ${
                    metrics.dataQualityScore >= 80 ? 'bg-green-400' :
                    metrics.dataQualityScore >= 60 ? 'bg-yellow-400' : 'bg-red-400'
                  }`}
                  style={{ width: `${metrics.dataQualityScore}%` }}
                />
              </div>
            </div>
            
            <div className="bg-dark-bg rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-dark-text-secondary">Migration Confidence</span>
                <span className="text-2xl font-bold text-primary-600">
                  {metrics.migrationConfidenceIndex}
                </span>
              </div>
              <div className="mt-2 text-xs text-dark-text-secondary">
                Index scale: 0.0 (low) to 1.0 (high)
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="bg-dark-surface border border-dark-border rounded-xl overflow-hidden">
        <div className="border-b border-dark-border">
          <div className="flex">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 px-4 py-3 flex items-center justify-center gap-2 transition-all ${
                    activeTab === tab.id
                      ? 'bg-primary-600/10 text-primary-600 border-b-2 border-primary-600'
                      : 'text-dark-text-secondary hover:text-dark-text-primary'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'overview' && metrics && (
              <MigrationQualityOverview 
                metrics={metrics} 
                onRefresh={loadHistoricalData}
              />
            )}
            
            {activeTab === 'validation' && (
              <DataValidationMatrix 
                companies={companies}
                onSelectCompany={setSelectedCompany}
              />
            )}
            
            {activeTab === 'anomalies' && (
              <AnomalyDetection 
                companies={companies}
                onSelectCompany={setSelectedCompany}
              />
            )}
            
            {activeTab === 'review' && (
              <ManualReviewInterface 
                company={selectedCompany}
                companies={companies}
                onSelectCompany={setSelectedCompany}
                onUpdate={loadHistoricalData}
              />
            )}
            
            {activeTab === 'bulk' && (
              <BulkActions 
                companies={companies}
                onUpdate={loadHistoricalData}
              />
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}