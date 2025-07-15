/**
 * Admin Company Manager Component
 * Interface for managing companies with filters, re-verification, and editing capabilities
 */

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  Filter,
  RefreshCw,
  Edit,
  Search,
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  X,
  ChevronDown,
  Globe,
  Users,
  DollarSign,
  Loader2,
  Upload,
  Download,
  BarChart
} from 'lucide-react';
import { cn } from '@shared/utils/cn';
import { CompanySearchInput } from '@/features/company-search';
import { createMockDatabaseService } from '@/database/mock-database.service';
import type { Company, DIIBusinessModel, VerificationSource } from '@/database/types';
import type { CompanyInfo } from '@/services/ai/types';
import { BusinessModelInfo } from './BusinessModelInfo';
import { BulkImportExport } from './BulkImportExport';
import { ClassificationMetrics } from './ClassificationMetrics';

// Business model display names
const BUSINESS_MODEL_NAMES: Record<DIIBusinessModel, string> = {
  COMERCIO_HIBRIDO: 'Comercio Híbrido',
  SOFTWARE_CRITICO: 'Software Crítico',
  SERVICIOS_DATOS: 'Servicios de Datos',
  ECOSISTEMA_DIGITAL: 'Ecosistema Digital',
  SERVICIOS_FINANCIEROS: 'Servicios Financieros',
  INFRAESTRUCTURA_HEREDADA: 'Infraestructura Heredada',
  CADENA_SUMINISTRO: 'Cadena de Suministro',
  INFORMACION_REGULADA: 'Información Regulada'
};

// Business model colors
const BUSINESS_MODEL_COLORS: Record<DIIBusinessModel, string> = {
  COMERCIO_HIBRIDO: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  SOFTWARE_CRITICO: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  SERVICIOS_DATOS: 'bg-green-500/20 text-green-400 border-green-500/30',
  ECOSISTEMA_DIGITAL: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
  SERVICIOS_FINANCIEROS: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  INFRAESTRUCTURA_HEREDADA: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  CADENA_SUMINISTRO: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  INFORMACION_REGULADA: 'bg-rose-500/20 text-rose-400 border-rose-500/30'
};

interface FilterState {
  businessModel: DIIBusinessModel | 'all';
  freshnessStatus: 'all' | 'fresh' | 'stale' | 'critical';
  isProspect: 'all' | 'yes' | 'no';
  searchQuery: string;
}

interface EditModalProps {
  company: Company;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedCompany: Partial<Company>) => void;
}

interface AddCompanyModalProps {
  companyInfo: CompanyInfo | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (companyData: Partial<Company>) => void;
}

function EditModal({ company, isOpen, onClose, onSave }: EditModalProps) {
  const [editedCompany, setEditedCompany] = useState<Partial<Company>>({
    name: company.name,
    dii_business_model: company.dii_business_model,
    confidence_score: company.confidence_score,
    is_prospect: company.is_prospect,
    data_freshness_days: company.data_freshness_days
  });

  const handleSave = () => {
    onSave(editedCompany);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-dark-surface border border-dark-border rounded-xl p-6 max-w-md w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-dark-text-primary">
              Edit Company
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-dark-border/50 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-dark-text-secondary" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-dark-text-secondary mb-2">
                Company Name
              </label>
              <input
                type="text"
                value={editedCompany.name}
                onChange={(e) => setEditedCompany({ ...editedCompany, name: e.target.value })}
                className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg
                         text-dark-text-primary focus:outline-none focus:border-primary-600
                         transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-text-secondary mb-2">
                Business Model
              </label>
              <select
                value={editedCompany.dii_business_model}
                onChange={(e) => setEditedCompany({ 
                  ...editedCompany, 
                  dii_business_model: e.target.value as DIIBusinessModel 
                })}
                className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg
                         text-dark-text-primary focus:outline-none focus:border-primary-600
                         transition-colors"
              >
                {Object.entries(BUSINESS_MODEL_NAMES).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-text-secondary mb-2">
                Confidence Score
              </label>
              <input
                type="number"
                min="0"
                max="1"
                step="0.05"
                value={editedCompany.confidence_score}
                onChange={(e) => setEditedCompany({ 
                  ...editedCompany, 
                  confidence_score: parseFloat(e.target.value) 
                })}
                className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg
                         text-dark-text-primary focus:outline-none focus:border-primary-600
                         transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-text-secondary mb-2">
                Data Freshness (days)
              </label>
              <input
                type="number"
                min="1"
                max="365"
                value={editedCompany.data_freshness_days}
                onChange={(e) => setEditedCompany({ 
                  ...editedCompany, 
                  data_freshness_days: parseInt(e.target.value) 
                })}
                className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg
                         text-dark-text-primary focus:outline-none focus:border-primary-600
                         transition-colors"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is-prospect"
                checked={editedCompany.is_prospect}
                onChange={(e) => setEditedCompany({ 
                  ...editedCompany, 
                  is_prospect: e.target.checked 
                })}
                className="w-4 h-4 bg-dark-bg border-dark-border rounded text-primary-600
                         focus:ring-primary-600 focus:ring-offset-0"
              />
              <label htmlFor="is-prospect" className="text-sm text-dark-text-secondary">
                Is Prospect
              </label>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleSave}
              className="flex-1 btn-primary"
            >
              Save Changes
            </button>
            <button
              onClick={onClose}
              className="flex-1 btn-secondary"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function AddCompanyModal({ companyInfo, isOpen, onClose, onConfirm }: AddCompanyModalProps) {
  const [businessModel, setBusinessModel] = useState<DIIBusinessModel>('COMERCIO_HIBRIDO');
  const [isProspect, setIsProspect] = useState(true);
  const [dataFreshnessDays, setDataFreshnessDays] = useState(90);
  const [isClassifying, setIsClassifying] = useState(false);
  const [classificationConfidence, setClassificationConfidence] = useState<number>(0);
  const [showModelDetails, setShowModelDetails] = useState(false);
  const dbService = useMemo(() => createMockDatabaseService(), []);

  useEffect(() => {
    if (companyInfo && isOpen) {
      classifyCompany();
    }
  }, [companyInfo, isOpen]);

  const classifyCompany = async () => {
    if (!companyInfo) return;
    
    setIsClassifying(true);
    try {
      const classification = await dbService.classifyBusinessModel({
        company_name: companyInfo.name,
        industry_traditional: companyInfo.industry || 'Unknown',
        company_description: companyInfo.description,
        domain: companyInfo.domain,
        employee_count: companyInfo.employees,
        annual_revenue: companyInfo.revenue,
        headquarters: companyInfo.headquarters,
        // Add any known signals
        is_b2b: companyInfo.description?.toLowerCase().includes('b2b') || 
                companyInfo.description?.toLowerCase().includes('enterprise'),
        is_saas: companyInfo.description?.toLowerCase().includes('saas') || 
                 companyInfo.description?.toLowerCase().includes('software as a service'),
        is_regulated: companyInfo.certifications && companyInfo.certifications.length > 0
      });
      
      setBusinessModel(classification.dii_business_model);
      setClassificationConfidence(classification.confidence_score);
      
      // Auto-show details for low confidence
      if (classification.confidence_score < 0.7) {
        setShowModelDetails(true);
        console.log('Low confidence classification:', classification.reasoning);
      }
    } catch (error) {
      console.error('Failed to classify company:', error);
    } finally {
      setIsClassifying(false);
    }
  };

  const handleConfirm = () => {
    if (!companyInfo) return;
    
    onConfirm({
      name: companyInfo.name,
      legal_name: companyInfo.name,
      domain: companyInfo.domain,
      industry_traditional: companyInfo.industry || 'Unknown',
      dii_business_model: businessModel,
      headquarters: companyInfo.headquarters,
      country: companyInfo.country,
      region: 'LATAM',
      employees: companyInfo.employees,
      revenue: companyInfo.revenue,
      data_freshness_days: dataFreshnessDays,
      is_prospect: isProspect
    });
  };

  if (!isOpen || !companyInfo) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-dark-surface border border-dark-border rounded-xl p-6 max-w-lg w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-dark-text-primary">
              Add New Company
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-dark-border/50 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-dark-text-secondary" />
            </button>
          </div>

          <div className="space-y-4">
            {/* Company Info Display */}
            <div className="bg-dark-bg p-4 rounded-lg space-y-2">
              <h4 className="font-semibold text-dark-text-primary">{companyInfo.name}</h4>
              {companyInfo.industry && (
                <p className="text-sm text-dark-text-secondary">Industry: {companyInfo.industry}</p>
              )}
              {companyInfo.headquarters && (
                <p className="text-sm text-dark-text-secondary">Location: {companyInfo.headquarters}</p>
              )}
              {companyInfo.employees && (
                <p className="text-sm text-dark-text-secondary">Employees: {companyInfo.employees.toLocaleString()}</p>
              )}
              {companyInfo.revenue && (
                <p className="text-sm text-dark-text-secondary">Revenue: ${(companyInfo.revenue / 1000000).toFixed(0)}M</p>
              )}
            </div>

            {/* Business Model Selection */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-dark-text-secondary">
                  Business Model Classification
                </label>
                <button
                  type="button"
                  onClick={() => setShowModelDetails(!showModelDetails)}
                  className="text-xs text-primary-600 hover:text-primary-700 transition-colors"
                >
                  {showModelDetails ? 'Hide Details' : 'Show Details'}
                </button>
              </div>
              
              {isClassifying ? (
                <div className="flex items-center gap-2 text-primary-600 p-4 bg-dark-bg rounded-lg border border-dark-border">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Analyzing company and classifying business model...</span>
                </div>
              ) : (
                <div className="space-y-3">
                  <select
                    value={businessModel}
                    onChange={(e) => setBusinessModel(e.target.value as DIIBusinessModel)}
                    className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg
                             text-dark-text-primary focus:outline-none focus:border-primary-600
                             transition-colors"
                  >
                    {Object.entries(BUSINESS_MODEL_NAMES).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                  
                  {showModelDetails && (
                    <div className="p-4 bg-dark-bg rounded-lg border border-dark-border">
                      <BusinessModelInfo 
                        model={businessModel}
                        confidence={classificationConfidence}
                        showDetails={true}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Data Freshness */}
            <div>
              <label className="block text-sm font-medium text-dark-text-secondary mb-2">
                Data Freshness Period (days)
              </label>
              <input
                type="number"
                min="1"
                max="365"
                value={dataFreshnessDays}
                onChange={(e) => setDataFreshnessDays(parseInt(e.target.value))}
                className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg
                         text-dark-text-primary focus:outline-none focus:border-primary-600
                         transition-colors"
              />
            </div>

            {/* Prospect Checkbox */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="add-is-prospect"
                checked={isProspect}
                onChange={(e) => setIsProspect(e.target.checked)}
                className="w-4 h-4 bg-dark-bg border-dark-border rounded text-primary-600
                         focus:ring-primary-600 focus:ring-offset-0"
              />
              <label htmlFor="add-is-prospect" className="text-sm text-dark-text-secondary">
                Mark as Prospect
              </label>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleConfirm}
              className="flex-1 btn-primary"
            >
              Add Company
            </button>
            <button
              onClick={onClose}
              className="flex-1 btn-secondary"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export function AdminCompanyManager() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    businessModel: 'all',
    freshnessStatus: 'all',
    isProspect: 'all',
    searchQuery: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [addingCompany, setAddingCompany] = useState<CompanyInfo | null>(null);
  const [verifyingCompanies, setVerifyingCompanies] = useState<Set<string>>(new Set());
  const [showImportExport, setShowImportExport] = useState(false);
  const [showMetrics, setShowMetrics] = useState(false);
  
  const dbService = useMemo(() => createMockDatabaseService(), []);

  // Load companies
  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    setLoading(true);
    try {
      // In a real app, we'd have a method to get all companies
      // For now, we'll use search with an empty query
      const allCompanies = await dbService.searchCompanies('');
      setCompanies(allCompanies);
    } catch (error) {
      console.error('Failed to load companies:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate data freshness status
  const getDataFreshnessStatus = (company: Company): 'fresh' | 'stale' | 'critical' => {
    if (!company.last_verified) return 'critical';
    
    const daysSinceVerified = Math.floor(
      (Date.now() - new Date(company.last_verified).getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (daysSinceVerified > company.data_freshness_days) {
      return daysSinceVerified > company.data_freshness_days * 2 ? 'critical' : 'stale';
    }
    return 'fresh';
  };

  // Filter companies
  const filteredCompanies = useMemo(() => {
    return companies.filter(company => {
      // Business model filter
      if (filters.businessModel !== 'all' && company.dii_business_model !== filters.businessModel) {
        return false;
      }

      // Freshness status filter
      if (filters.freshnessStatus !== 'all') {
        const status = getDataFreshnessStatus(company);
        if (filters.freshnessStatus !== status) {
          return false;
        }
      }

      // Prospect filter
      if (filters.isProspect !== 'all') {
        const isProspect = filters.isProspect === 'yes';
        if (company.is_prospect !== isProspect) {
          return false;
        }
      }

      // Search query
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        return (
          company.name.toLowerCase().includes(query) ||
          company.domain?.toLowerCase().includes(query) ||
          company.industry_traditional.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [companies, filters]);

  // Handle re-verification
  const handleReVerify = async (company: Company) => {
    setVerifyingCompanies(prev => new Set(prev).add(company.id));
    
    // Simulate AI search with a delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    try {
      await dbService.updateCompanyVerification(company.id, 'ai_search');
      await loadCompanies(); // Reload to get updated data
    } catch (error) {
      console.error('Failed to re-verify company:', error);
    } finally {
      setVerifyingCompanies(prev => {
        const newSet = new Set(prev);
        newSet.delete(company.id);
        return newSet;
      });
    }
  };

  // Handle edit save
  const handleEditSave = async (updatedData: Partial<Company>) => {
    if (!editingCompany) return;
    
    try {
      await dbService.updateCompany(editingCompany.id, updatedData);
      await loadCompanies(); // Reload to get updated data
    } catch (error) {
      console.error('Failed to update company:', error);
    }
  };

  // Handle new company from search
  const handleNewCompany = (companyInfo: CompanyInfo) => {
    setAddingCompany(companyInfo);
  };

  // Handle confirming new company
  const handleConfirmNewCompany = async (companyData: Partial<Company>) => {
    try {
      const classification = await dbService.classifyBusinessModel({
        company_name: companyData.name || '',
        industry_traditional: companyData.industry_traditional || 'Unknown'
      });

      await dbService.createCompany({
        ...companyData,
        confidence_score: classification.confidence_score,
        classification_reasoning: classification.reasoning,
        last_verified: new Date(),
        verification_source: 'ai_search'
      } as Company);

      await loadCompanies();
      setAddingCompany(null);
    } catch (error) {
      console.error('Failed to add new company:', error);
    }
  };

  // Handle bulk import
  const handleBulkImport = async (importedCompanies: Partial<Company>[]) => {
    try {
      for (const company of importedCompanies) {
        await dbService.createCompany(company as Company);
      }
      await loadCompanies();
      setShowImportExport(false);
    } catch (error) {
      console.error('Failed to import companies:', error);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-dark-text-primary">
              Company Management
            </h1>
            <p className="text-dark-text-secondary mt-2">
              Manage companies, classifications, and data freshness
            </p>
          </div>
          <div className="flex items-center gap-4">
            <CompanySearchInput
              onSelect={handleNewCompany}
              className="w-64"
            />
            <button
              onClick={() => setShowImportExport(!showImportExport)}
              className={cn(
                "p-3 rounded-lg border transition-all",
                showImportExport
                  ? "bg-primary-600/20 border-primary-600 text-primary-600"
                  : "bg-dark-surface border-dark-border text-dark-text-secondary hover:text-dark-text-primary"
              )}
              title="Import/Export CSV"
            >
              <Upload className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowMetrics(!showMetrics)}
              className={cn(
                "p-3 rounded-lg border transition-all",
                showMetrics
                  ? "bg-primary-600/20 border-primary-600 text-primary-600"
                  : "bg-dark-surface border-dark-border text-dark-text-secondary hover:text-dark-text-primary"
              )}
              title="Classification Metrics"
            >
              <BarChart className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "p-3 rounded-lg border transition-all",
                showFilters
                  ? "bg-primary-600/20 border-primary-600 text-primary-600"
                  : "bg-dark-surface border-dark-border text-dark-text-secondary hover:text-dark-text-primary"
              )}
              title="Filters"
            >
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="bg-dark-surface border border-dark-border rounded-xl p-6">
                <h3 className="text-lg font-semibold text-dark-text-primary mb-4">
                  Filters
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Search */}
                  <div>
                    <label className="block text-sm font-medium text-dark-text-secondary mb-2">
                      Search
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 w-4 h-4 text-dark-text-secondary" />
                      <input
                        type="text"
                        value={filters.searchQuery}
                        onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
                        placeholder="Search companies..."
                        className="w-full pl-10 pr-4 py-2 bg-dark-bg border border-dark-border rounded-lg
                                 text-dark-text-primary placeholder-dark-text-secondary
                                 focus:outline-none focus:border-primary-600 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Business Model */}
                  <div>
                    <label className="block text-sm font-medium text-dark-text-secondary mb-2">
                      Business Model
                    </label>
                    <select
                      value={filters.businessModel}
                      onChange={(e) => setFilters({ 
                        ...filters, 
                        businessModel: e.target.value as DIIBusinessModel | 'all' 
                      })}
                      className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg
                               text-dark-text-primary focus:outline-none focus:border-primary-600
                               transition-colors appearance-none"
                    >
                      <option value="all">All Models</option>
                      {Object.entries(BUSINESS_MODEL_NAMES).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Freshness Status */}
                  <div>
                    <label className="block text-sm font-medium text-dark-text-secondary mb-2">
                      Data Freshness
                    </label>
                    <select
                      value={filters.freshnessStatus}
                      onChange={(e) => setFilters({ 
                        ...filters, 
                        freshnessStatus: e.target.value as FilterState['freshnessStatus'] 
                      })}
                      className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg
                               text-dark-text-primary focus:outline-none focus:border-primary-600
                               transition-colors appearance-none"
                    >
                      <option value="all">All Status</option>
                      <option value="fresh">Fresh</option>
                      <option value="stale">Stale</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>

                  {/* Prospect Status */}
                  <div>
                    <label className="block text-sm font-medium text-dark-text-secondary mb-2">
                      Prospect Status
                    </label>
                    <select
                      value={filters.isProspect}
                      onChange={(e) => setFilters({ 
                        ...filters, 
                        isProspect: e.target.value as FilterState['isProspect'] 
                      })}
                      className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg
                               text-dark-text-primary focus:outline-none focus:border-primary-600
                               transition-colors appearance-none"
                    >
                      <option value="all">All Companies</option>
                      <option value="yes">Prospects Only</option>
                      <option value="no">Customers Only</option>
                    </select>
                  </div>
                </div>

                {/* Clear Filters */}
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => setFilters({
                      businessModel: 'all',
                      freshnessStatus: 'all',
                      isProspect: 'all',
                      searchQuery: ''
                    })}
                    className="text-sm text-primary-600 hover:text-primary-700 transition-colors"
                  >
                    Clear all filters
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Import/Export Section */}
        <AnimatePresence>
          {showImportExport && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <BulkImportExport
                onImport={handleBulkImport}
                companies={filteredCompanies}
                onClose={() => setShowImportExport(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Metrics Section */}
        <AnimatePresence>
          {showMetrics && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <ClassificationMetrics companies={companies} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Companies Table */}
        <div className="bg-dark-surface border border-dark-border rounded-xl overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <Loader2 className="w-8 h-8 text-primary-600 animate-spin mx-auto mb-4" />
              <p className="text-dark-text-secondary">Loading companies...</p>
            </div>
          ) : filteredCompanies.length === 0 ? (
            <div className="p-12 text-center">
              <Building2 className="w-12 h-12 text-dark-text-secondary mx-auto mb-4" />
              <p className="text-dark-text-secondary">No companies found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-dark-border">
                    <th className="px-6 py-4 text-left text-sm font-medium text-dark-text-secondary">
                      Company
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-dark-text-secondary">
                      Business Model
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-dark-text-secondary">
                      Last Verification
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-dark-text-secondary">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-dark-text-secondary">
                      Details
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-medium text-dark-text-secondary">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCompanies.map((company) => {
                    const freshnessStatus = getDataFreshnessStatus(company);
                    const daysSinceVerified = company.last_verified
                      ? Math.floor((Date.now() - new Date(company.last_verified).getTime()) / (1000 * 60 * 60 * 24))
                      : null;

                    return (
                      <tr key={company.id} className="border-b border-dark-border/50 hover:bg-dark-border/20 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <Building2 className="w-10 h-10 text-primary-600 p-2 bg-primary-600/10 rounded-lg" />
                            <div>
                              <p className="font-semibold text-dark-text-primary">
                                {company.name}
                              </p>
                              <p className="text-sm text-dark-text-secondary">
                                {company.industry_traditional}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={cn(
                            "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border",
                            BUSINESS_MODEL_COLORS[company.dii_business_model]
                          )}>
                            {BUSINESS_MODEL_NAMES[company.dii_business_model]}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="w-4 h-4 text-dark-text-secondary" />
                            <span className="text-dark-text-primary">
                              {company.last_verified
                                ? new Date(company.last_verified).toLocaleDateString()
                                : 'Never'}
                            </span>
                            {daysSinceVerified !== null && (
                              <span className="text-dark-text-secondary">
                                ({daysSinceVerified}d ago)
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium",
                              freshnessStatus === 'fresh' && "bg-green-500/20 text-green-400",
                              freshnessStatus === 'stale' && "bg-amber-500/20 text-amber-400",
                              freshnessStatus === 'critical' && "bg-red-500/20 text-red-400"
                            )}>
                              {freshnessStatus === 'fresh' && <CheckCircle className="w-3 h-3" />}
                              {freshnessStatus === 'stale' && <Clock className="w-3 h-3" />}
                              {freshnessStatus === 'critical' && <AlertCircle className="w-3 h-3" />}
                              {freshnessStatus.charAt(0).toUpperCase() + freshnessStatus.slice(1)}
                            </div>
                            {company.is_prospect && (
                              <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                                Prospect
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4 text-xs text-dark-text-secondary">
                            {company.headquarters && (
                              <div className="flex items-center gap-1">
                                <Globe className="w-3 h-3" />
                                {company.headquarters}
                              </div>
                            )}
                            {company.employees && (
                              <div className="flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                {company.employees.toLocaleString()}
                              </div>
                            )}
                            {company.revenue && (
                              <div className="flex items-center gap-1">
                                <DollarSign className="w-3 h-3" />
                                ${(company.revenue / 1000000).toFixed(0)}M
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleReVerify(company)}
                              disabled={verifyingCompanies.has(company.id)}
                              className={cn(
                                "p-2 rounded-lg transition-all",
                                verifyingCompanies.has(company.id)
                                  ? "bg-dark-border/50 text-dark-text-secondary cursor-not-allowed"
                                  : "bg-primary-600/20 text-primary-600 hover:bg-primary-600/30"
                              )}
                              title="Re-verify with AI"
                            >
                              {verifyingCompanies.has(company.id) ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <RefreshCw className="w-4 h-4" />
                              )}
                            </button>
                            <button
                              onClick={() => setEditingCompany(company)}
                              className="p-2 bg-dark-border/50 text-dark-text-secondary hover:text-dark-text-primary hover:bg-dark-border rounded-lg transition-all"
                              title="Edit company"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-dark-surface border border-dark-border rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-dark-text-secondary">Total Companies</p>
                <p className="text-2xl font-bold text-dark-text-primary">{companies.length}</p>
              </div>
              <Building2 className="w-8 h-8 text-primary-600/20" />
            </div>
          </div>
          <div className="bg-dark-surface border border-dark-border rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-dark-text-secondary">Fresh Data</p>
                <p className="text-2xl font-bold text-green-400">
                  {companies.filter(c => getDataFreshnessStatus(c) === 'fresh').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400/20" />
            </div>
          </div>
          <div className="bg-dark-surface border border-dark-border rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-dark-text-secondary">Stale Data</p>
                <p className="text-2xl font-bold text-amber-400">
                  {companies.filter(c => getDataFreshnessStatus(c) === 'stale').length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-amber-400/20" />
            </div>
          </div>
          <div className="bg-dark-surface border border-dark-border rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-dark-text-secondary">Critical</p>
                <p className="text-2xl font-bold text-red-400">
                  {companies.filter(c => getDataFreshnessStatus(c) === 'critical').length}
                </p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-400/20" />
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editingCompany && (
        <EditModal
          company={editingCompany}
          isOpen={!!editingCompany}
          onClose={() => setEditingCompany(null)}
          onSave={handleEditSave}
        />
      )}

      {/* Add Company Modal */}
      <AddCompanyModal
        companyInfo={addingCompany}
        isOpen={!!addingCompany}
        onClose={() => setAddingCompany(null)}
        onConfirm={handleConfirmNewCompany}
      />
    </div>
  );
}