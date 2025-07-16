/**
 * Manual Review Interface Component
 * Detailed company review and validation interface
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Building2,
  CheckCircle,
  XCircle,
  Edit,
  Save,
  AlertTriangle,
  Clock,
  BarChart,
  FileText,
  ChevronLeft,
  ChevronRight,
  Flag
} from 'lucide-react';
import { cn } from '@shared/utils/cn';
import type { Company } from '@/database/types';
import { BUSINESS_MODEL_DEFINITIONS, type DIIBusinessModel } from '@/core/business-model/business-model-definitions';
import { getDatabaseService } from '@/database';

interface ManualReviewInterfaceProps {
  company: Company | null;
  companies: Company[];
  onSelectCompany: (company: Company) => void;
  onUpdate: () => void;
}

interface ReviewState {
  scoreReasonable: boolean;
  modelCorrect: boolean;
  needsReassessment: boolean;
  notes: string;
}

export function ManualReviewInterface({ 
  company, 
  companies, 
  onSelectCompany, 
  onUpdate 
}: ManualReviewInterfaceProps) {
  const [reviewState, setReviewState] = useState<ReviewState>({
    scoreReasonable: true,
    modelCorrect: true,
    needsReassessment: false,
    notes: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editedModel, setEditedModel] = useState<DIIBusinessModel | null>(null);
  const [editedConfidence, setEditedConfidence] = useState<string>('MEDIUM');

  useEffect(() => {
    if (company) {
      // Reset review state for new company
      setReviewState({
        scoreReasonable: company.original_dii_score !== 10.0,
        modelCorrect: true,
        needsReassessment: company.needs_reassessment || false,
        notes: ''
      });
      setEditedModel(company.dii_business_model);
      setEditedConfidence(company.migration_confidence || 'MEDIUM');
      setIsEditing(false);
    }
  }, [company]);

  const handleSaveReview = async () => {
    if (!company) return;
    
    setSaving(true);
    try {
      const dbService = await getDatabaseService();
      
      // Update company with review results
      await dbService.updateCompany(company.id, {
        needs_reassessment: reviewState.needsReassessment,
        dii_business_model: editedModel || company.dii_business_model,
        migration_confidence: editedConfidence as any
      });
      
      // In a real app, we'd also save the review record
      // await dbService.createReview({ ... });
      
      onUpdate();
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save review:', error);
    } finally {
      setSaving(false);
    }
  };

  const navigateCompany = (direction: 'prev' | 'next') => {
    if (!company) return;
    const currentIndex = companies.findIndex(c => c.id === company.id);
    const newIndex = direction === 'next' 
      ? Math.min(currentIndex + 1, companies.length - 1)
      : Math.max(currentIndex - 1, 0);
    onSelectCompany(companies[newIndex]);
  };

  if (!company) {
    return (
      <div className="text-center py-12">
        <Building2 className="w-12 h-12 text-dark-text-secondary mx-auto mb-4" />
        <p className="text-dark-text-primary">Select a company to begin review</p>
        <p className="text-sm text-dark-text-secondary mt-2">
          Choose from the validation matrix or anomaly detection tabs
        </p>
      </div>
    );
  }

  const currentIndex = companies.findIndex(c => c.id === company.id);
  const dimensions = company.data_completeness ? Math.round(company.data_completeness * 5) : 0;

  return (
    <div className="space-y-6">
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateCompany('prev')}
            disabled={currentIndex === 0}
            className="p-2 text-dark-text-secondary hover:text-dark-text-primary 
                     disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <span className="text-sm text-dark-text-secondary">
            {currentIndex + 1} of {companies.length}
          </span>
          
          <button
            onClick={() => navigateCompany('next')}
            disabled={currentIndex === companies.length - 1}
            className="p-2 text-dark-text-secondary hover:text-dark-text-primary 
                     disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="btn-secondary text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveReview}
                disabled={saving}
                className="btn-primary text-sm flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save Review'}
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="btn-secondary text-sm flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit
            </button>
          )}
        </div>
      </div>

      {/* Company Information */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-dark-bg border border-dark-border rounded-lg p-6"
      >
        <h3 className="text-xl font-semibold text-dark-text-primary mb-4">
          {company.name}
        </h3>
        
        <div className="grid grid-cols-2 gap-6">
          {/* Left Column - Basic Info */}
          <div className="space-y-4">
            <div>
              <p className="text-sm text-dark-text-secondary mb-1">Industry</p>
              <p className="text-dark-text-primary">{company.industry_traditional}</p>
            </div>
            
            <div>
              <p className="text-sm text-dark-text-secondary mb-1">Country</p>
              <p className="text-dark-text-primary">{company.country || 'Unknown'}</p>
            </div>
            
            <div>
              <p className="text-sm text-dark-text-secondary mb-1">Legacy DII ID</p>
              <p className="text-dark-text-primary font-mono">#{company.legacy_dii_id}</p>
            </div>
            
            <div>
              <p className="text-sm text-dark-text-secondary mb-1">Migration Date</p>
              <p className="text-dark-text-primary">
                {company.migration_date ? new Date(company.migration_date).toLocaleDateString() : 'Unknown'}
              </p>
            </div>
          </div>

          {/* Right Column - Scores and Data */}
          <div className="space-y-4">
            <div>
              <p className="text-sm text-dark-text-secondary mb-1">DII Score</p>
              <div className="flex items-center gap-2">
                <p className={cn(
                  "text-2xl font-bold",
                  company.original_dii_score === 10.0 ? 'text-yellow-400' : 'text-dark-text-primary'
                )}>
                  {company.original_dii_score?.toFixed(2) || 'N/A'}
                </p>
                {company.original_dii_score === 10.0 && (
                  <AlertTriangle className="w-5 h-5 text-yellow-400" title="Perfect score" />
                )}
              </div>
            </div>
            
            <div>
              <p className="text-sm text-dark-text-secondary mb-1">Migration Confidence</p>
              {isEditing ? (
                <select
                  value={editedConfidence}
                  onChange={(e) => setEditedConfidence(e.target.value)}
                  className="bg-dark-surface border border-dark-border rounded px-3 py-1
                           text-dark-text-primary focus:outline-none focus:border-primary-600"
                >
                  <option value="HIGH">HIGH</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="LOW">LOW</option>
                </select>
              ) : (
                <span className={cn(
                  "px-3 py-1 rounded text-sm font-medium",
                  editedConfidence === 'HIGH' ? 'bg-green-600/20 text-green-400' :
                  editedConfidence === 'MEDIUM' ? 'bg-yellow-600/20 text-yellow-400' :
                  'bg-red-600/20 text-red-400'
                )}>
                  {editedConfidence}
                </span>
              )}
            </div>
            
            <div>
              <p className="text-sm text-dark-text-secondary mb-1">Data Completeness</p>
              <div className="flex items-center gap-2">
                <p className="text-dark-text-primary">{dimensions}/5 dimensions</p>
                {dimensions < 5 && <FileText className="w-4 h-4 text-yellow-400" />}
              </div>
            </div>
            
            <div>
              <p className="text-sm text-dark-text-secondary mb-1">Zero Trust Data</p>
              <div className="flex items-center gap-2">
                {company.has_zt_maturity ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-green-400">Available</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-red-400" />
                    <span className="text-red-400">Missing</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Business Model */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-dark-bg border border-dark-border rounded-lg p-6"
      >
        <h4 className="text-lg font-medium text-dark-text-primary mb-4">
          Business Model Classification
        </h4>
        
        {isEditing ? (
          <select
            value={editedModel || ''}
            onChange={(e) => setEditedModel(e.target.value as DIIBusinessModel)}
            className="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-2
                     text-dark-text-primary focus:outline-none focus:border-primary-600"
          >
            {Object.entries(BUSINESS_MODEL_DEFINITIONS).map(([key, def]) => (
              <option key={key} value={key}>
                {def.name} - {def.description}
              </option>
            ))}
          </select>
        ) : (
          <div>
            <p className="text-primary-600 font-medium mb-2">
              {editedModel ? BUSINESS_MODEL_DEFINITIONS[editedModel].name : 'Not classified'}
            </p>
            {editedModel && (
              <p className="text-sm text-dark-text-secondary">
                {BUSINESS_MODEL_DEFINITIONS[editedModel].description}
              </p>
            )}
          </div>
        )}
      </motion.div>

      {/* Review Checklist */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-dark-bg border border-dark-border rounded-lg p-6"
      >
        <h4 className="text-lg font-medium text-dark-text-primary mb-4">
          Review Checklist
        </h4>
        
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={reviewState.scoreReasonable}
              onChange={(e) => setReviewState(prev => ({ 
                ...prev, 
                scoreReasonable: e.target.checked 
              }))}
              disabled={!isEditing}
              className="w-4 h-4 text-primary-600 bg-dark-surface border-dark-border 
                       rounded focus:ring-primary-600"
            />
            <span className="text-dark-text-primary">
              DII score appears reasonable for this company
            </span>
          </label>
          
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={reviewState.modelCorrect}
              onChange={(e) => setReviewState(prev => ({ 
                ...prev, 
                modelCorrect: e.target.checked 
              }))}
              disabled={!isEditing}
              className="w-4 h-4 text-primary-600 bg-dark-surface border-dark-border 
                       rounded focus:ring-primary-600"
            />
            <span className="text-dark-text-primary">
              Business model classification is appropriate
            </span>
          </label>
          
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={reviewState.needsReassessment}
              onChange={(e) => setReviewState(prev => ({ 
                ...prev, 
                needsReassessment: e.target.checked 
              }))}
              disabled={!isEditing}
              className="w-4 h-4 text-primary-600 bg-dark-surface border-dark-border 
                       rounded focus:ring-primary-600"
            />
            <span className="text-dark-text-primary">
              Flag for reassessment
            </span>
          </label>
        </div>

        {/* Review Notes */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-dark-text-secondary mb-2">
            Review Notes
          </label>
          <textarea
            value={reviewState.notes}
            onChange={(e) => setReviewState(prev => ({ ...prev, notes: e.target.value }))}
            disabled={!isEditing}
            rows={3}
            className="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-2
                     text-dark-text-primary placeholder-dark-text-secondary
                     focus:outline-none focus:border-primary-600 disabled:opacity-50"
            placeholder="Add any notes about this company's data quality or migration issues..."
          />
        </div>
      </motion.div>

      {/* Quick Actions */}
      {reviewState.needsReassessment && (
        <div className="bg-orange-600/10 border border-orange-600/20 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Flag className="w-5 h-5 text-orange-400" />
            <p className="text-sm text-orange-400">
              This company has been flagged for reassessment
            </p>
          </div>
        </div>
      )}
    </div>
  );
}