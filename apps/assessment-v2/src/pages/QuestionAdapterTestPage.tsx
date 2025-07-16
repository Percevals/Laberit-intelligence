/**
 * Question Adapter Test Page
 * Test dynamic question adaptation with company context
 */

import { useState, useEffect } from 'react';
import { assessmentAdapter } from '@services/question-adapter';
import type { BusinessModelScenarioId, DIIDimension } from '@core/types/pain-scenario.types';
import type { CompanyInfo } from '@services/ai/types';
import type { AssessmentQuestion } from '@services/question-adapter/assessment-adapter';

// Sample companies for testing
const sampleCompanies: CompanyInfo[] = [
  {
    name: 'TechCorp LATAM',
    employees: 500,
    revenue: 50000000, // $50M
    headquarters: 'São Paulo, Brasil',
    country: 'Brasil',
    industry: 'Software',
    dataSource: 'manual',
    confidence: 1
  },
  {
    name: 'Banco Digital',
    employees: 2500,
    revenue: 500000000, // $500M
    headquarters: 'Ciudad de México',
    country: 'México',
    industry: 'Servicios Financieros',
    dataSource: 'manual',
    confidence: 1
  },
  {
    name: 'MiniMart Express',
    employees: 50,
    revenue: 5000000, // $5M
    headquarters: 'Buenos Aires',
    country: 'Argentina',
    industry: 'Comercio Minorista',
    dataSource: 'manual',
    confidence: 1
  }
];

export function QuestionAdapterTestPage() {
  const [selectedCompany, setSelectedCompany] = useState<CompanyInfo>(sampleCompanies[0]!);
  const [selectedModel, setSelectedModel] = useState<BusinessModelScenarioId>('2_software_critico');
  const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDimension, setSelectedDimension] = useState<DIIDimension | 'all'>('all');

  const businessModels: { id: BusinessModelScenarioId; name: string }[] = [
    { id: '1_comercio_hibrido', name: 'Comercio Híbrido' },
    { id: '2_software_critico', name: 'Software Crítico' },
    { id: '3_servicios_datos', name: 'Servicios de Datos' },
    { id: '4_ecosistema_digital', name: 'Ecosistema Digital' },
    { id: '5_servicios_financieros', name: 'Servicios Financieros' },
    { id: '6_infraestructura_heredada', name: 'Infraestructura Heredada' },
    { id: '7_cadena_suministro', name: 'Cadena de Suministro' },
    { id: '8_informacion_regulada', name: 'Información Regulada' }
  ];

  const dimensions: DIIDimension[] = ['TRD', 'AER', 'HFP', 'BRI', 'RRG'];

  const loadQuestions = async () => {
    setLoading(true);
    try {
      if (selectedDimension === 'all') {
        const adaptedQuestions = await assessmentAdapter.getPersonalizedQuestions(
          selectedModel,
          selectedCompany,
          true
        );
        setQuestions(adaptedQuestions);
      } else {
        const adaptedQuestion = await assessmentAdapter.getPersonalizedQuestion(
          selectedModel,
          selectedDimension,
          selectedCompany,
          true
        );
        setQuestions([adaptedQuestion]);
      }
    } catch (error) {
      console.error('Error loading questions:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadQuestions();
  }, [selectedCompany, selectedModel, selectedDimension]);

  return (
    <div className="min-h-screen bg-dark-bg p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Question Adapter Test</h1>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Company Selection */}
          <div className="card p-6">
            <h3 className="font-semibold mb-4">Test Company</h3>
            <select
              value={sampleCompanies.indexOf(selectedCompany)}
              onChange={(e) => {
                const company = sampleCompanies[parseInt(e.target.value)];
                if (company) setSelectedCompany(company);
              }}
              className="w-full p-2 bg-dark-surface border border-dark-border rounded mb-4"
            >
              {sampleCompanies.map((company, idx) => (
                <option key={idx} value={idx}>{company.name}</option>
              ))}
            </select>
            
            <div className="text-sm space-y-1 text-dark-text-secondary">
              <div>Empleados: {selectedCompany.employees?.toLocaleString()}</div>
              <div>Ingresos: ${(selectedCompany.revenue! / 1000000).toFixed(0)}M</div>
              <div>Ubicación: {selectedCompany.headquarters}</div>
              <div>Industria: {selectedCompany.industry}</div>
            </div>
          </div>

          {/* Business Model Selection */}
          <div className="card p-6">
            <h3 className="font-semibold mb-4">Business Model</h3>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value as BusinessModelScenarioId)}
              className="w-full p-2 bg-dark-surface border border-dark-border rounded"
            >
              {businessModels.map(model => (
                <option key={model.id} value={model.id}>{model.name}</option>
              ))}
            </select>
          </div>

          {/* Dimension Filter */}
          <div className="card p-6">
            <h3 className="font-semibold mb-4">Dimension</h3>
            <select
              value={selectedDimension}
              onChange={(e) => setSelectedDimension(e.target.value as DIIDimension | 'all')}
              className="w-full p-2 bg-dark-surface border border-dark-border rounded"
            >
              <option value="all">All Dimensions</option>
              {dimensions.map(dim => (
                <option key={dim} value={dim}>{dim}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Examples */}
        <div className="card p-6 mb-8">
          <h3 className="font-semibold mb-4">Adaptation Examples</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            {Object.entries(assessmentAdapter.getExampleAdaptations()).map(([key, example]) => (
              <div key={key} className="space-y-2">
                <div>
                  <span className="text-dark-text-secondary">Original:</span>
                  <p className="text-xs italic">{example.original}</p>
                </div>
                <div>
                  <span className="text-primary-600">Adapted:</span>
                  <p className="text-xs italic">{example.adapted}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Questions Display */}
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto" />
          </div>
        ) : (
          <div className="space-y-6">
            {questions.map((q, idx) => (
              <div key={idx} className="card p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-primary-600">
                    {q.dimension} Question
                  </h3>
                  <span className={`text-xs px-2 py-1 rounded ${
                    q.adaptedQuestion.aiEnhanced ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'
                  }`}>
                    {q.adaptedQuestion.aiEnhanced ? 'AI Enhanced' : 'Template Based'}
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-dark-text-secondary mb-1">Original:</h4>
                    <p className="text-sm italic">{q.adaptedQuestion.original}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-primary-600 mb-1">Personalized:</h4>
                    <p className="text-lg">{q.adaptedQuestion.adapted}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-dark-text-secondary mb-1">Variables Used:</h4>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(q.adaptedQuestion.variables).map(([key, value]) => (
                        value && (
                          <span key={key} className="text-xs px-2 py-1 bg-dark-border/50 rounded">
                            {key}: {value}
                          </span>
                        )
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-dark-text-secondary mb-1">Interpretation Guide:</h4>
                    <p className="text-xs text-dark-text-secondary italic">{q.interpretation}</p>
                  </div>

                  <div className="text-xs text-dark-text-secondary">
                    Confidence: {(q.adaptedQuestion.confidence * 100).toFixed(0)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}