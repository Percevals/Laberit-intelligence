/**
 * Bulk Import/Export Component
 * CSV handling for prospect campaigns
 */

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  Download,
  AlertCircle,
  CheckCircle2,
  FileSpreadsheet,
  X,
  Loader2,
  AlertTriangle,
  Edit
} from 'lucide-react';
import { cn } from '@shared/utils/cn';
import type { Company, DIIBusinessModel } from '@/database/types';
import { classifyBusinessModel } from '@/core/business-model/enhanced-classifier';
import { BUSINESS_MODEL_DEFINITIONS } from '@/core/business-model/business-model-definitions';

// Required CSV columns
const REQUIRED_COLUMNS = ['company_name', 'industry'] as const;
const OPTIONAL_COLUMNS = ['employees', 'revenue', 'headquarters', 'country', 'website', 'description'] as const;

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

interface ImportResult {
  success: number;
  errors: number;
  warnings: number;
  details: Array<{
    row: number;
    company: string;
    status: 'success' | 'error' | 'warning';
    message: string;
    businessModel?: DIIBusinessModel;
    confidence?: number;
    data?: Partial<Company>;
  }>;
  pendingCompanies?: Array<Partial<Company>>;
}

interface BulkImportExportProps {
  onImport: (companies: Partial<Company>[]) => Promise<void>;
  companies: Company[];
  onClose?: () => void;
}

interface ReviewCompany extends Partial<Company> {
  originalIndex: number;
  originalModel: DIIBusinessModel;
  originalConfidence: number;
}

export function BulkImportExport({ onImport, companies, onClose }: BulkImportExportProps) {
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [reviewMode, setReviewMode] = useState(false);
  const [reviewCompanies, setReviewCompanies] = useState<ReviewCompany[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Parse CSV content
  const parseCSV = (content: string): { headers: string[]; rows: string[][] } => {
    // Handle different line endings (Windows, Mac, Unix)
    const lines = content.trim().replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
    
    // Parse headers - handle both semicolon and comma separators
    const firstLine = lines[0];
    const separator = firstLine.includes(';') ? ';' : ',';
    
    // More robust header parsing
    const headers = firstLine
      .split(separator)
      .map(h => h.trim()
        .toLowerCase()
        .replace(/['"]/g, '')
        .replace(/^\uFEFF/, '') // Remove BOM if present
        .replace(/\s+/g, '_') // Replace spaces with underscores
      );
    
    console.log('Parsed headers:', headers); // Debug log
    
    const rows = lines.slice(1).map(line => {
      if (!line.trim()) return []; // Skip empty lines
      
      // Handle quoted values with the detected separator
      const regex = new RegExp(`(".*?"|[^"${separator}]+)(?=${separator}|$)`, 'g');
      const matches = line.match(regex);
      return matches ? matches.map(m => m.replace(/^"|"$/g, '').trim()) : [];
    });
    
    return { headers, rows: rows.filter(row => row.length > 0) };
  };

  // Validate CSV structure
  const validateCSV = (headers: string[]): { valid: boolean; missingColumns: string[] } => {
    const missingColumns = REQUIRED_COLUMNS.filter(col => !headers.includes(col));
    return {
      valid: missingColumns.length === 0,
      missingColumns
    };
  };

  // Process CSV file
  const processCSV = async (file: File) => {
    setImporting(true);
    setImportResult(null);

    try {
      const content = await file.text();
      const { headers, rows } = parseCSV(content);
      
      // Validate structure
      const validation = validateCSV(headers);
      if (!validation.valid) {
        setImportResult({
          success: 0,
          errors: rows.length,
          warnings: 0,
          details: [{
            row: 0,
            company: 'CSV Structure',
            status: 'error',
            message: `Missing required columns: ${validation.missingColumns.join(', ')}. Found headers: ${headers.join(', ')}`
          }]
        });
        setImporting(false);
        return;
      }

      // Process each row
      const result: ImportResult = {
        success: 0,
        errors: 0,
        warnings: 0,
        details: []
      };

      const companiesToImport: Partial<Company>[] = [];

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const rowNum = i + 2; // Excel-style row numbering

        // Skip empty rows
        if (row.length === 0 || row.every(cell => !cell)) {
          continue;
        }

        // Extract values
        const getValue = (column: string) => {
          const index = headers.indexOf(column);
          return index >= 0 && row[index] ? row[index] : undefined;
        };

        const companyName = getValue('company_name');
        const industry = getValue('industry');

        if (!companyName || !industry) {
          result.errors++;
          result.details.push({
            row: rowNum,
            company: companyName || 'Unknown',
            status: 'error',
            message: 'Missing required fields: company_name or industry'
          });
          continue;
        }

        // Parse optional fields
        const employees = getValue('employees');
        const revenue = getValue('revenue');
        const headquarters = getValue('headquarters');
        const country = getValue('country');
        const website = getValue('website');
        const description = getValue('description');

        // Classify business model
        const classification = classifyBusinessModel({
          companyName,
          industry,
          description,
          employees: employees ? parseInt(employees) : undefined,
          revenue: revenue ? parseFloat(revenue) : undefined,
          headquarters,
          website
        });

        // Create company object
        const companyData: Partial<Company> = {
          name: companyName,
          legal_name: companyName,
          industry_traditional: industry,
          dii_business_model: classification.model,
          confidence_score: classification.confidence,
          classification_reasoning: classification.reasoning,
          employees: employees ? parseInt(employees) : undefined,
          revenue: revenue ? parseFloat(revenue) : undefined,
          headquarters,
          country: country || 'Unknown',
          domain: website,
          is_prospect: true,
          data_freshness_days: 90,
          last_verified: new Date(),
          verification_source: 'import' as const
        };

        companiesToImport.push(companyData);

        // Track results
        const status = classification.confidence >= 0.7 ? 'success' : 'warning';
        if (status === 'success') {
          result.success++;
        } else {
          result.warnings++;
        }
        
        result.details.push({
          row: rowNum,
          company: companyName,
          status,
          message: `${BUSINESS_MODEL_DEFINITIONS[classification.model].name} (${Math.round(classification.confidence * 100)}% confianza)`,
          businessModel: classification.model,
          confidence: classification.confidence,
          data: companyData
        });
      }

      // Store pending companies for review instead of auto-importing
      result.pendingCompanies = companiesToImport;
      setImportResult(result);
    } catch (error) {
      setImportResult({
        success: 0,
        errors: 1,
        warnings: 0,
        details: [{
          row: 0,
          company: 'File Processing',
          status: 'error',
          message: error instanceof Error ? error.message : 'Failed to process CSV file'
        }]
      });
    } finally {
      setImporting(false);
    }
  };

  // Export CSV
  const exportCSV = () => {
    const headers = [
      'company_name',
      'business_model',
      'business_model_es',
      'confidence',
      'industry',
      'employees',
      'revenue',
      'headquarters',
      'country',
      'website',
      'is_prospect',
      'last_verified',
      'days_since_verified',
      'data_freshness_status'
    ];

    const rows = companies.map(company => {
      const daysSinceVerified = company.last_verified
        ? Math.floor((Date.now() - new Date(company.last_verified).getTime()) / (1000 * 60 * 60 * 24))
        : 999;
      
      const freshnessStatus = daysSinceVerified > company.data_freshness_days * 2 ? 'critical' :
                             daysSinceVerified > company.data_freshness_days ? 'stale' : 'fresh';

      return [
        company.name,
        company.dii_business_model,
        BUSINESS_MODEL_DEFINITIONS[company.dii_business_model].name,
        (company.confidence_score * 100).toFixed(0) + '%',
        company.industry_traditional,
        company.employees || '',
        company.revenue || '',
        company.headquarters || '',
        company.country || '',
        company.domain || '',
        company.is_prospect ? 'Yes' : 'No',
        company.last_verified ? new Date(company.last_verified).toISOString().split('T')[0] : '',
        daysSinceVerified,
        freshnessStatus
      ];
    });

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `companies_export_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Handle file drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'text/csv') {
      processCSV(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Import Section */}
      <div className="bg-dark-surface border border-dark-border rounded-xl p-6">
        <h3 className="text-lg font-semibold text-dark-text-primary mb-4 flex items-center gap-2">
          <Upload className="w-5 h-5 text-primary-600" />
          Importar CSV
        </h3>

        <div className="space-y-4">
          {/* Drop Zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all",
              dragActive
                ? "border-primary-600 bg-primary-600/10"
                : "border-dark-border hover:border-primary-600/50"
            )}
          >
            <FileSpreadsheet className="w-12 h-12 text-dark-text-secondary mx-auto mb-4" />
            <p className="text-dark-text-primary mb-2">
              Arrastra tu archivo CSV aquí o haz clic para seleccionar
            </p>
            <p className="text-sm text-dark-text-secondary">
              Columnas requeridas: company_name, industry
            </p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) processCSV(file);
            }}
            className="hidden"
          />

          {/* Template Download */}
          <div className="flex items-center justify-between p-4 bg-dark-bg rounded-lg">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-blue-400" />
              <div>
                <p className="text-sm text-dark-text-primary">¿Necesitas una plantilla?</p>
                <p className="text-xs text-dark-text-secondary">
                  Descarga un CSV de ejemplo con el formato correcto
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                const template = 'company_name,industry,employees,revenue,headquarters,country,website,description\n' +
                  '"Ejemplo Corp","Software",500,10000000,"Ciudad de México","México","ejemplo.com","Empresa de software B2B"';
                const blob = new Blob([template], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'plantilla_importacion.csv';
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="text-sm text-primary-600 hover:text-primary-700 transition-colors"
            >
              Descargar plantilla
            </button>
          </div>
        </div>

        {/* Import Progress */}
        {importing && (
          <div className="mt-6 p-4 bg-primary-600/10 border border-primary-600/20 rounded-lg">
            <div className="flex items-center gap-3">
              <Loader2 className="w-5 h-5 text-primary-600 animate-spin" />
              <p className="text-sm text-dark-text-primary">Procesando archivo CSV...</p>
            </div>
          </div>
        )}

        {/* Import Results */}
        {importResult && !reviewMode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 space-y-4"
          >
            {/* Summary */}
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-green-600/10 border border-green-600/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  <div>
                    <p className="text-2xl font-bold text-green-400">{importResult.success}</p>
                    <p className="text-sm text-dark-text-secondary">Importados</p>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-yellow-600/10 border border-yellow-600/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-400" />
                  <div>
                    <p className="text-2xl font-bold text-yellow-400">{importResult.warnings}</p>
                    <p className="text-sm text-dark-text-secondary">Advertencias</p>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-red-600/10 border border-red-600/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                  <div>
                    <p className="text-2xl font-bold text-red-400">{importResult.errors}</p>
                    <p className="text-sm text-dark-text-secondary">Errores</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="max-h-60 overflow-y-auto bg-dark-bg rounded-lg p-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-dark-border">
                    <th className="text-left py-2 text-dark-text-secondary">Fila</th>
                    <th className="text-left py-2 text-dark-text-secondary">Empresa</th>
                    <th className="text-left py-2 text-dark-text-secondary">Estado</th>
                    <th className="text-left py-2 text-dark-text-secondary">Mensaje</th>
                  </tr>
                </thead>
                <tbody>
                  {importResult.details.map((detail, i) => (
                    <tr key={i} className="border-b border-dark-border/50">
                      <td className="py-2 text-dark-text-secondary">{detail.row}</td>
                      <td className="py-2 text-dark-text-primary">{detail.company}</td>
                      <td className="py-2">
                        <span className={cn(
                          "px-2 py-1 rounded text-xs",
                          detail.status === 'success' && "bg-green-600/20 text-green-400",
                          detail.status === 'warning' && "bg-yellow-600/20 text-yellow-400",
                          detail.status === 'error' && "bg-red-600/20 text-red-400"
                        )}>
                          {detail.status}
                        </span>
                      </td>
                      <td className="py-2 text-dark-text-secondary">{detail.message}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Review Button */}
            {importResult.pendingCompanies && importResult.pendingCompanies.length > 0 && (
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => {
                    const companiesForReview = importResult.pendingCompanies!.map((company, index) => ({
                      ...company,
                      originalIndex: index,
                      originalModel: company.dii_business_model!,
                      originalConfidence: company.confidence_score!
                    }));
                    setReviewCompanies(companiesForReview);
                    setReviewMode(true);
                  }}
                  className="btn-primary flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Revisar y Editar Clasificaciones
                </button>
              </div>
            )}
          </motion.div>
        )}

        {/* Review Mode */}
        {reviewMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-dark-text-primary">Revisar Clasificaciones</h4>
              <button
                onClick={() => {
                  setReviewMode(false);
                  setEditingIndex(null);
                }}
                className="text-dark-text-secondary hover:text-dark-text-primary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {reviewCompanies.map((company, index) => (
                <div key={index} className="bg-dark-bg border border-dark-border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h5 className="font-medium text-dark-text-primary">{company.name}</h5>
                      <p className="text-sm text-dark-text-secondary mt-1">
                        {company.industry_traditional} • {company.employees ? `${company.employees} empleados` : 'Sin datos de empleados'}
                      </p>
                      
                      {editingIndex === index ? (
                        <div className="mt-3 space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-dark-text-secondary mb-1">
                              Modelo de Negocio
                            </label>
                            <select
                              value={company.dii_business_model}
                              onChange={(e) => {
                                const updated = [...reviewCompanies];
                                updated[index] = {
                                  ...updated[index],
                                  dii_business_model: e.target.value as DIIBusinessModel
                                };
                                setReviewCompanies(updated);
                              }}
                              className="w-full bg-dark-surface border border-dark-border rounded-lg px-3 py-2 text-dark-text-primary"
                            >
                              {Object.entries(BUSINESS_MODEL_DEFINITIONS).map(([key, def]) => (
                                <option key={key} value={key}>
                                  {def.name}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-dark-text-secondary mb-1">
                              Confianza (%)
                            </label>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={Math.round((company.confidence_score || 0) * 100)}
                              onChange={(e) => {
                                const updated = [...reviewCompanies];
                                updated[index] = {
                                  ...updated[index],
                                  confidence_score: parseInt(e.target.value) / 100
                                };
                                setReviewCompanies(updated);
                              }}
                              className="w-full bg-dark-surface border border-dark-border rounded-lg px-3 py-2 text-dark-text-primary"
                            />
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setEditingIndex(null)}
                              className="btn-secondary text-sm px-3 py-1"
                            >
                              Guardar
                            </button>
                            <button
                              onClick={() => {
                                const updated = [...reviewCompanies];
                                updated[index] = {
                                  ...updated[index],
                                  dii_business_model: company.originalModel,
                                  confidence_score: company.originalConfidence
                                };
                                setReviewCompanies(updated);
                                setEditingIndex(null);
                              }}
                              className="text-sm text-dark-text-secondary hover:text-dark-text-primary px-3 py-1"
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="mt-3">
                          <div className="flex items-center gap-4">
                            <span className={cn(
                              "px-3 py-1 rounded-full text-sm border",
                              BUSINESS_MODEL_COLORS[company.dii_business_model!]
                            )}>
                              {BUSINESS_MODEL_DEFINITIONS[company.dii_business_model!].name}
                            </span>
                            <span className="text-sm text-dark-text-secondary">
                              {Math.round((company.confidence_score || 0) * 100)}% confianza
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      {editingIndex !== index && (
                        <button
                          onClick={() => setEditingIndex(index)}
                          className="p-2 text-primary-600 hover:bg-primary-600/10 rounded-lg transition-colors"
                          title="Editar clasificación"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => {
                          const updated = reviewCompanies.filter((_, i) => i !== index);
                          setReviewCompanies(updated);
                        }}
                        className="p-2 text-red-400 hover:bg-red-600/10 rounded-lg transition-colors"
                        title="Eliminar de la importación"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Import Actions */}
            <div className="mt-6 flex justify-between">
              <div className="text-sm text-dark-text-secondary">
                {reviewCompanies.length} empresas listas para importar
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setReviewMode(false);
                    setReviewCompanies([]);
                    setImportResult(null);
                  }}
                  className="btn-secondary"
                >
                  Cancelar
                </button>
                <button
                  onClick={async () => {
                    setImporting(true);
                    try {
                      console.log('Starting import of', reviewCompanies.length, 'companies');
                      await onImport(reviewCompanies);
                      setReviewMode(false);
                      setReviewCompanies([]);
                      setImportResult({
                        success: reviewCompanies.length,
                        errors: 0,
                        warnings: 0,
                        details: [{
                          row: 0,
                          company: 'Importación completada',
                          status: 'success',
                          message: `${reviewCompanies.length} empresas importadas exitosamente`
                        }]
                      });
                    } catch (error) {
                      console.error('Import error:', error);
                      setImportResult({
                        success: 0,
                        errors: reviewCompanies.length,
                        warnings: 0,
                        details: [{
                          row: 0,
                          company: 'Error de importación',
                          status: 'error',
                          message: error instanceof Error ? error.message : 'Error desconocido al importar'
                        }]
                      });
                    } finally {
                      setImporting(false);
                    }
                  }}
                  disabled={importing || reviewCompanies.length === 0}
                  className="btn-primary flex items-center gap-2"
                >
                  {importing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Importando...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Confirmar Importación
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Export Section */}
      <div className="bg-dark-surface border border-dark-border rounded-xl p-6">
        <h3 className="text-lg font-semibold text-dark-text-primary mb-4 flex items-center gap-2">
          <Download className="w-5 h-5 text-primary-600" />
          Exportar Datos
        </h3>

        <div className="space-y-4">
          <p className="text-dark-text-secondary">
            Exporta todos los datos de empresas incluyendo modelo de negocio, confianza y estado de datos.
          </p>

          <div className="flex items-center justify-between p-4 bg-dark-bg rounded-lg">
            <div>
              <p className="font-medium text-dark-text-primary">
                {companies.length} empresas disponibles
              </p>
              <p className="text-sm text-dark-text-secondary">
                Incluye clasificación DII y días desde verificación
              </p>
            </div>
            <button
              onClick={exportCSV}
              className="btn-primary flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Exportar CSV
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}