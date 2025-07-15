import { useState } from 'react';
import { CompanySearchInputEnhanced } from '@/features/company-search';
import type { HybridCompanyInfo } from '@/features/company-search';
import { Database, Cloud, Sparkles, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@shared/utils/cn';

export function CompanySearchDemo() {
  const [selectedCompany, setSelectedCompany] = useState<HybridCompanyInfo | null>(null);
  const [searchHistory, setSearchHistory] = useState<HybridCompanyInfo[]>([]);

  const handleCompanySelect = (company: HybridCompanyInfo) => {
    setSelectedCompany(company);
    setSearchHistory(prev => [company, ...prev.filter(c => c.name !== company.name)].slice(0, 5));
  };

  return (
    <div className="min-h-screen bg-dark-bg p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-dark-text-primary mb-2">
            Hybrid Company Search Demo
          </h1>
          <p className="text-dark-text-secondary">
            Sistema de búsqueda híbrido que combina base de datos local con búsqueda por IA
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Search Section */}
          <div className="space-y-6">
            <div className="bg-dark-surface p-6 rounded-lg border border-dark-border">
              <h2 className="text-xl font-semibold text-dark-text-primary mb-4">
                Búsqueda de Empresas
              </h2>
              <CompanySearchInputEnhanced 
                onSelect={handleCompanySelect}
                showSearchMode={true}
              />
              
              <div className="mt-6 space-y-4">
                <h3 className="text-sm font-medium text-dark-text-secondary">
                  Características del Sistema:
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                    <span className="text-dark-text-secondary">
                      <strong>Búsqueda fuzzy:</strong> Maneja errores tipográficos y coincidencias parciales
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                    <span className="text-dark-text-secondary">
                      <strong>Base de datos local:</strong> Búsqueda rápida en empresas conocidas
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                    <span className="text-dark-text-secondary">
                      <strong>Fallback con IA:</strong> Encuentra empresas no registradas localmente
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                    <span className="text-dark-text-secondary">
                      <strong>Ranking inteligente:</strong> Prioriza coincidencias exactas
                    </span>
                  </li>
                </ul>
              </div>

              <div className="mt-6 p-4 bg-dark-bg rounded-lg">
                <h3 className="text-sm font-medium text-dark-text-secondary mb-2">
                  Prueba estas búsquedas:
                </h3>
                <div className="flex flex-wrap gap-2">
                  {['TechnoLogix', 'MediCloud', 'Cyber', 'Agri', 'Microsoft', 'Mercado Libre'].map((term) => (
                    <button
                      key={term}
                      onClick={() => {
                        const input = document.querySelector('input[type="text"]') as HTMLInputElement;
                        if (input) {
                          input.value = term;
                          input.dispatchEvent(new Event('input', { bubbles: true }));
                          input.focus();
                        }
                      }}
                      className="px-3 py-1 text-xs bg-primary-600/20 text-primary-400 rounded hover:bg-primary-600/30 transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Search History */}
            {searchHistory.length > 0 && (
              <div className="bg-dark-surface p-6 rounded-lg border border-dark-border">
                <h3 className="text-lg font-semibold text-dark-text-primary mb-4">
                  Historial de Búsqueda
                </h3>
                <div className="space-y-2">
                  {searchHistory.map((company, index) => (
                    <button
                      key={`${company.name}-${index}`}
                      onClick={() => setSelectedCompany(company)}
                      className={cn(
                        'w-full p-3 rounded-lg border transition-colors text-left',
                        selectedCompany?.name === company.name
                          ? 'border-primary-600 bg-primary-600/10'
                          : 'border-dark-border hover:border-dark-border-hover'
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-dark-text-primary">
                          {company.name}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-dark-text-secondary">
                          {company.source === 'database' && <Database className="w-3 h-3" />}
                          {company.source === 'ai' && <Cloud className="w-3 h-3" />}
                          {company.source === 'combined' && <Sparkles className="w-3 h-3" />}
                          {company.source}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Selected Company Details */}
          <div className="bg-dark-surface p-6 rounded-lg border border-dark-border">
            <h2 className="text-xl font-semibold text-dark-text-primary mb-4">
              Detalles de la Empresa
            </h2>
            
            {selectedCompany ? (
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-dark-text-primary">
                      {selectedCompany.name}
                    </h3>
                    {selectedCompany.legalName && selectedCompany.legalName !== selectedCompany.name && (
                      <p className="text-sm text-dark-text-secondary italic">
                        {selectedCompany.legalName}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      'flex items-center gap-1 px-2 py-1 rounded text-xs',
                      selectedCompany.source === 'database' ? 'bg-green-500/20 text-green-400' :
                      selectedCompany.source === 'ai' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-purple-500/20 text-purple-400'
                    )}>
                      {selectedCompany.source === 'database' && <Database className="w-3 h-3" />}
                      {selectedCompany.source === 'ai' && <Cloud className="w-3 h-3" />}
                      {selectedCompany.source === 'combined' && <Sparkles className="w-3 h-3" />}
                      {selectedCompany.source}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <InfoItem label="Industria" value={selectedCompany.industry} />
                  <InfoItem label="Sede" value={selectedCompany.headquarters} />
                  <InfoItem label="País" value={selectedCompany.country} />
                  <InfoItem label="Región" value={selectedCompany.region} />
                  <InfoItem 
                    label="Empleados" 
                    value={selectedCompany.employees?.toLocaleString()} 
                  />
                  <InfoItem 
                    label="Ingresos" 
                    value={selectedCompany.revenue ? `$${(selectedCompany.revenue / 1000000).toFixed(0)}M` : undefined} 
                  />
                  <InfoItem label="Sitio Web" value={selectedCompany.website} isLink />
                  <InfoItem label="Año Fundado" value={selectedCompany.yearFounded?.toString()} />
                </div>

                {selectedCompany.description && (
                  <div>
                    <h4 className="text-sm font-medium text-dark-text-secondary mb-1">
                      Descripción
                    </h4>
                    <p className="text-sm text-dark-text-primary">
                      {selectedCompany.description}
                    </p>
                  </div>
                )}

                <div className="pt-4 border-t border-dark-border">
                  <h4 className="text-sm font-medium text-dark-text-secondary mb-2">
                    Información de Búsqueda
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-dark-text-secondary">Tipo de coincidencia:</span>
                      <span className={cn(
                        'font-medium',
                        selectedCompany.matchType === 'exact' ? 'text-green-400' :
                        selectedCompany.matchType === 'fuzzy' ? 'text-yellow-400' :
                        'text-blue-400'
                      )}>
                        {selectedCompany.matchType}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-dark-text-secondary">Puntuación:</span>
                      <span className="font-medium text-dark-text-primary">
                        {Math.round(selectedCompany.matchScore * 100)}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-dark-text-secondary">Fuente de datos:</span>
                      <span className="font-medium text-dark-text-primary">
                        {selectedCompany.dataSource}
                      </span>
                    </div>
                    {selectedCompany.confidence !== undefined && (
                      <div className="flex items-center justify-between">
                        <span className="text-dark-text-secondary">Confianza:</span>
                        <span className="font-medium text-dark-text-primary">
                          {Math.round((selectedCompany.confidence || 0) * 100)}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {selectedCompany.databaseId && (
                  <div className="text-xs text-dark-text-secondary">
                    ID en base de datos: {selectedCompany.databaseId}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-dark-text-secondary">
                  Selecciona una empresa para ver sus detalles
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface InfoItemProps {
  label: string;
  value?: string;
  isLink?: boolean;
}

function InfoItem({ label, value, isLink }: InfoItemProps) {
  if (!value) return null;
  
  return (
    <div>
      <p className="text-xs text-dark-text-secondary">{label}</p>
      {isLink ? (
        <a 
          href={`https://${value}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-sm font-medium text-primary-600 hover:text-primary-500"
        >
          {value}
        </a>
      ) : (
        <p className="text-sm font-medium text-dark-text-primary">{value}</p>
      )}
    </div>
  );
}