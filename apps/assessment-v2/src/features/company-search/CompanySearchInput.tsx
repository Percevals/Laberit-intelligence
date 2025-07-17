import { useState, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Building2, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@shared/utils/cn';
import { useCompanySearch } from './useCompanySearch';
import { AIHealthIndicator } from '@/components/AIHealthIndicator';
import type { CompanyInfo } from '@services/ai/types';

interface CompanySearchInputProps {
  onSelect: (company: CompanyInfo) => void;
  className?: string;
}

export function CompanySearchInput({ onSelect, className }: CompanySearchInputProps) {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { search, results, loading, error } = useCompanySearch();

  // Debounced search
  const searchDebounced = useMemo(() => {
    let timeoutId: NodeJS.Timeout;
    return (q: string) => {
      clearTimeout(timeoutId);
      if (q.length < 2) {
        results.companies = [];
        return;
      }
      timeoutId = setTimeout(() => search(q), 500);
    };
  }, [search, results]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setIsOpen(true);
    searchDebounced(value);
  }, [searchDebounced]);

  const handleSelect = (company: CompanyInfo) => {
    setQuery(company.name);
    setIsOpen(false);
    onSelect(company);
  };

  const handleManualEntry = () => {
    setIsOpen(false);
    onSelect({
      name: query,
      dataSource: 'manual',
      confidence: 0
    } as CompanyInfo);
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
            status={results.provider === 'Mistral AI' || results.provider === 'OpenAI Provider' ? 'active' : 
                   results.provider === 'cache' ? 'cached' : 'offline'} 
          />
        </div>
      </div>

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
            {error && (
              <div className="p-4 border-l-4 border-red-500 bg-red-500/10">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-red-400 mb-1">
                      {t('companySearch.searchError.title', 'No pudimos buscar su empresa')}
                    </p>
                    <p className="text-xs text-red-300 mb-3">
                      {error.includes('fetch') || error.includes('network') 
                        ? t('companySearch.searchError.networkError', 'Verifique su conexión a internet e intente nuevamente.')
                        : error.includes('timeout') 
                        ? t('companySearch.searchError.timeoutError', 'La búsqueda está tardando más de lo normal. Intente con un término más específico.')
                        : error.includes('API') || error.includes('500')
                        ? t('companySearch.searchError.apiError', 'Nuestro servicio de búsqueda está temporalmente no disponible.')
                        : t('companySearch.searchError.genericError', 'Ocurrió un error inesperado durante la búsqueda.')}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => search(query)}
                        className="text-xs bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition-colors"
                      >
                        {t('companySearch.searchError.retry', 'Reintentar')}
                      </button>
                      <button
                        onClick={handleManualEntry}
                        className="text-xs bg-dark-surface hover:bg-dark-border text-dark-text px-3 py-1 rounded transition-colors"
                      >
                        {t('companySearch.searchError.manualEntry', 'Ingresar manualmente')}
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

            {results.companies.map((company: CompanyInfo, index: number) => (
              <CompanyCard
                key={index}
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

interface CompanyCardProps {
  company: CompanyInfo;
  onClick: () => void;
}

function CompanyCard({ company, onClick }: CompanyCardProps) {
  const { t } = useTranslation();
  
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
          <h4 className="font-semibold text-dark-text-primary">
            {company.name}
          </h4>
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
          </div>
          {company.confidence && company.confidence > 0 && (
            <div className="mt-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-dark-text-secondary">
                  {t('companySearch.confidence', 'Confianza')}:
                </span>
                <div className="flex-1 h-1 bg-dark-border rounded-full overflow-hidden max-w-[100px]">
                  <div 
                    className="h-full bg-primary-600 rounded-full"
                    style={{ width: `${company.confidence * 100}%` }}
                  />
                </div>
                <span className="text-xs text-primary-600">
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