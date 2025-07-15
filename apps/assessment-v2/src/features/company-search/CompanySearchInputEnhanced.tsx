import { useState, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Building2, Loader2, AlertCircle, Database, Cloud, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@shared/utils/cn';
import { useCompanySearch } from './useCompanySearch';
import { AIHealthIndicator } from '@/components/AIHealthIndicator';
import type { HybridCompanyInfo } from '@/services/hybrid-search.service';

interface CompanySearchInputEnhancedProps {
  onSelect: (company: HybridCompanyInfo) => void;
  className?: string;
  showSearchMode?: boolean;
}

export function CompanySearchInputEnhanced({ 
  onSelect, 
  className,
  showSearchMode = true 
}: CompanySearchInputEnhancedProps) {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { search, results, loading, error, searchMode, setSearchMode } = useCompanySearch();

  // Debounced search
  const searchDebounced = useMemo(() => {
    let timeoutId: NodeJS.Timeout;
    return (q: string) => {
      clearTimeout(timeoutId);
      if (q.length < 2) {
        return;
      }
      timeoutId = setTimeout(() => search(q), 500);
    };
  }, [search]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setIsOpen(true);
    searchDebounced(value);
  }, [searchDebounced]);

  const handleSelect = (company: HybridCompanyInfo) => {
    setQuery(company.name);
    setIsOpen(false);
    onSelect(company);
  };

  const handleManualEntry = () => {
    setIsOpen(false);
    onSelect({
      name: query,
      dataSource: 'manual',
      confidence: 0,
      source: 'database',
      matchScore: 1.0,
      matchType: 'exact'
    } as HybridCompanyInfo);
  };

  return (
    <div className={cn('relative', className)}>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder={t('companySearch.placeholder', 'Ingrese el nombre de su empresa...')}
          className={cn(
            'w-full px-4 py-3 pl-12 pr-4',
            'bg-dark-surface border border-dark-border rounded-lg',
            'text-dark-text-primary placeholder-dark-text-secondary',
            'focus:outline-none focus:border-primary-600',
            'transition-colors duration-200'
          )}
        />
        <Search className="absolute left-4 top-3.5 w-5 h-5 text-dark-text-secondary" />
        <div className="absolute right-4 top-3.5 flex items-center gap-2">
          {loading && (
            <Loader2 className="w-5 h-5 text-primary-600 animate-spin" />
          )}
          <AIHealthIndicator 
            status={results.provider === 'hybrid' ? 'active' : 
                   results.provider === 'database' ? 'cached' : 'offline'} 
          />
        </div>
      </div>

      {showSearchMode && (
        <div className="flex items-center gap-2 mt-2">
          <span className="text-xs text-dark-text-secondary">Modo de búsqueda:</span>
          <div className="flex gap-1 bg-dark-surface p-1 rounded-lg">
            <button
              onClick={() => setSearchMode('hybrid')}
              className={cn(
                'px-3 py-1 text-xs rounded transition-colors',
                searchMode === 'hybrid' 
                  ? 'bg-primary-600 text-white' 
                  : 'text-dark-text-secondary hover:text-dark-text-primary'
              )}
            >
              Híbrido
            </button>
            <button
              onClick={() => setSearchMode('ai-only')}
              className={cn(
                'px-3 py-1 text-xs rounded transition-colors',
                searchMode === 'ai-only' 
                  ? 'bg-primary-600 text-white' 
                  : 'text-dark-text-secondary hover:text-dark-text-primary'
              )}
            >
              Solo AI
            </button>
          </div>
        </div>
      )}

      <AnimatePresence>
        {isOpen && query.length >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={cn(
              'absolute top-full left-0 right-0 mt-2 z-50',
              'bg-dark-surface border border-dark-border rounded-lg',
              'shadow-xl shadow-black/20',
              'max-h-96 overflow-y-auto'
            )}
          >
            {/* Search Stats */}
            {results.companies.length > 0 && (
              <div className="px-4 py-2 border-b border-dark-border text-xs text-dark-text-secondary">
                <div className="flex items-center justify-between">
                  <span>
                    {results.companies.length} resultados encontrados
                  </span>
                  <div className="flex items-center gap-3">
                    {results.databaseMatches > 0 && (
                      <span className="flex items-center gap-1">
                        <Database className="w-3 h-3" />
                        {results.databaseMatches} local
                      </span>
                    )}
                    {results.aiMatches > 0 && (
                      <span className="flex items-center gap-1">
                        <Cloud className="w-3 h-3" />
                        {results.aiMatches} AI
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="p-4 border-l-4 border-red-500 bg-red-500/10">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-red-400 mb-1">
                      No pudimos buscar su empresa
                    </p>
                    <p className="text-xs text-red-300 mb-3">
                      {error.includes('fetch') || error.includes('network') 
                        ? 'Verifique su conexión a internet e intente nuevamente.'
                        : error.includes('timeout') 
                        ? 'La búsqueda está tardando más de lo normal. Intente con un término más específico.'
                        : error.includes('API') || error.includes('500')
                        ? 'Nuestro servicio de búsqueda está temporalmente no disponible.'
                        : 'Ocurrió un error inesperado durante la búsqueda.'}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => search(query)}
                        className="text-xs bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition-colors"
                      >
                        Reintentar
                      </button>
                      <button
                        onClick={handleManualEntry}
                        className="text-xs bg-dark-surface hover:bg-dark-border text-dark-text px-3 py-1 rounded transition-colors"
                      >
                        Ingresar manualmente
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!loading && !error && results.companies.length === 0 && (
              <div className="p-6 text-center">
                <p className="text-dark-text-secondary mb-4">
                  {t('companySearch.noResults', 'No encontramos resultados para')} "{query}"
                </p>
                <button
                  onClick={handleManualEntry}
                  className="btn-secondary text-sm"
                >
                  {t('companySearch.enterManually', 'Ingresar manualmente')}
                </button>
              </div>
            )}

            {results.companies.map((company: HybridCompanyInfo, index: number) => (
              <EnhancedCompanyCard
                key={`${company.source}-${company.databaseId || index}`}
                company={company}
                onClick={() => handleSelect(company)}
              />
            ))}

            {results.companies.length > 0 && (
              <div className="p-3 border-t border-dark-border">
                <button
                  onClick={handleManualEntry}
                  className="text-sm text-dark-text-secondary hover:text-primary-600 transition-colors"
                >
                  {t('companySearch.notListed', '¿No encuentra su empresa? Ingrese manualmente')}
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface EnhancedCompanyCardProps {
  company: HybridCompanyInfo;
  onClick: () => void;
}

function EnhancedCompanyCard({ company, onClick }: EnhancedCompanyCardProps) {
  const { t } = useTranslation();
  
  const getSourceIcon = () => {
    switch (company.source) {
      case 'database':
        return <Database className="w-3 h-3" />;
      case 'ai':
        return <Cloud className="w-3 h-3" />;
      case 'combined':
        return <Sparkles className="w-3 h-3" />;
    }
  };

  const getSourceLabel = () => {
    switch (company.source) {
      case 'database':
        return 'Base de datos local';
      case 'ai':
        return 'Búsqueda AI';
      case 'combined':
        return 'Datos combinados';
    }
  };

  const getMatchTypeColor = () => {
    switch (company.matchType) {
      case 'exact':
        return 'text-green-500';
      case 'fuzzy':
        return 'text-yellow-500';
      case 'ai':
        return 'text-blue-500';
    }
  };
  
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full p-4 text-left',
        'hover:bg-dark-border/50 transition-colors',
        'border-b border-dark-border last:border-b-0'
      )}
    >
      <div className="flex items-start gap-3">
        <Building2 className="w-5 h-5 text-primary-600 mt-0.5" />
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <h4 className="font-semibold text-dark-text-primary">
              {company.name}
            </h4>
            <div className="flex items-center gap-2 text-xs">
              <span className={cn('flex items-center gap-1', getMatchTypeColor())}>
                {getSourceIcon()}
                {getSourceLabel()}
              </span>
              {company.matchScore > 0 && (
                <span className="text-dark-text-secondary">
                  {Math.round(company.matchScore * 100)}% match
                </span>
              )}
            </div>
          </div>
          
          {company.legalName && company.legalName !== company.name && (
            <p className="text-sm text-dark-text-secondary italic">
              {company.legalName}
            </p>
          )}
          
          {company.industry && (
            <p className="text-sm text-dark-text-secondary mt-1">
              {company.industry}
            </p>
          )}
          
          <div className="flex flex-wrap gap-4 mt-2 text-xs text-dark-text-secondary">
            {company.headquarters && (
              <span>{company.headquarters}</span>
            )}
            {company.employees && (
              <span>
                {company.employees.toLocaleString()} {t('companySearch.employees', 'empleados')}
              </span>
            )}
            {company.revenue && (
              <span>
                ${(company.revenue / 1000000).toFixed(0)}M {t('companySearch.revenue', 'ingresos')}
              </span>
            )}
            {company.website && (
              <span className="text-primary-600">
                {company.website}
              </span>
            )}
          </div>
          
          {company.description && (
            <p className="text-xs text-dark-text-secondary mt-2 line-clamp-2">
              {company.description}
            </p>
          )}
          
          {company.confidence && company.confidence > 0 && (
            <div className="mt-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-dark-text-secondary">
                  {t('companySearch.confidence', 'Confianza')}:
                </span>
                <div className="flex-1 h-1 bg-dark-border rounded-full overflow-hidden max-w-[100px]">
                  <div 
                    className={cn(
                      'h-full rounded-full',
                      company.source === 'database' ? 'bg-green-500' :
                      company.source === 'combined' ? 'bg-blue-500' :
                      'bg-primary-600'
                    )}
                    style={{ width: `${company.confidence * 100}%` }}
                  />
                </div>
                <span className={cn(
                  'text-xs',
                  company.source === 'database' ? 'text-green-500' :
                  company.source === 'combined' ? 'text-blue-500' :
                  'text-primary-600'
                )}>
                  {Math.round(company.confidence * 100)}%
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </button>
  );
}