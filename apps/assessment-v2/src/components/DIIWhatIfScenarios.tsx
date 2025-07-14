import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus,
  Trash2,
  X,
  TrendingUp,
  TrendingDown,
  Target,
  AlertCircle,
  Shield
} from 'lucide-react';
import { useDIIDimensionsStore, type DIIDimension } from '@/store/dii-dimensions-store';
import { cn } from '@shared/utils/cn';

interface ScenarioEditorProps {
  scenarioId: string;
  onClose: () => void;
}

function ScenarioEditor({ scenarioId, onClose }: ScenarioEditorProps) {
  const { 
    scenarios, 
    dimensions,
    updateScenario,
    deleteScenario 
  } = useDIIDimensionsStore();

  const scenario = scenarios.find(s => s.id === scenarioId);
  if (!scenario) return null;

  const [editingValues, setEditingValues] = useState<Record<string, number>>({
    TRD: scenario.modifiedDimensions.TRD?.metricValue || dimensions.TRD?.metricValue || 24,
    AER: scenario.modifiedDimensions.AER?.metricValue || dimensions.AER?.metricValue || 100000,
    HFP: scenario.modifiedDimensions.HFP?.metricValue || dimensions.HFP?.metricValue || 20,
    BRI: scenario.modifiedDimensions.BRI?.metricValue || dimensions.BRI?.metricValue || 40,
    RRG: scenario.modifiedDimensions.RRG?.metricValue || dimensions.RRG?.metricValue || 2
  });

  const dimensionInfo = {
    TRD: { 
      label: 'Time to Revenue Impact', 
      unit: 'hours',
      min: 1, max: 168, step: 1,
      format: (v: number) => `${v}h`
    },
    AER: { 
      label: 'Attack Value Potential', 
      unit: 'USD',
      min: 1000, max: 5000000, step: 10000,
      format: (v: number) => `$${v >= 1000000 ? `${(v/1000000).toFixed(1)}M` : `${Math.round(v/1000)}K`}`
    },
    HFP: { 
      label: 'Human Failure Rate', 
      unit: '%',
      min: 0, max: 100, step: 5,
      format: (v: number) => `${v}%`
    },
    BRI: { 
      label: 'Blast Radius', 
      unit: '%',
      min: 0, max: 100, step: 5,
      format: (v: number) => `${v}%`
    },
    RRG: { 
      label: 'Recovery Gap', 
      unit: 'x',
      min: 1, max: 10, step: 0.5,
      format: (v: number) => `${v}x`
    }
  };

  const handleUpdate = (dimension: DIIDimension) => {
    if (editingValues[dimension] !== undefined) {
      updateScenario(scenarioId, dimension, editingValues[dimension]);
    }
  };

  const handleDelete = () => {
    deleteScenario(scenarioId);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{scenario.name}</h3>
            <p className="text-sm text-gray-600">{scenario.description}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 overflow-y-auto">
          {/* Current vs Projected */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Current DII</div>
              <div className="text-3xl font-bold text-gray-900">
                {useDIIDimensionsStore.getState().currentDII?.score || 0}
              </div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-sm text-blue-600 mb-1">Projected DII</div>
              <div className="text-3xl font-bold text-blue-900">
                {scenario.projectedDII.score}
              </div>
              {scenario.impact.scoreDelta !== 0 && (
                <div className={cn(
                  'text-sm font-medium mt-1',
                  scenario.impact.scoreDelta > 0 ? 'text-green-600' : 'text-red-600'
                )}>
                  {scenario.impact.scoreDelta > 0 ? '+' : ''}{scenario.impact.scoreDelta}
                </div>
              )}
            </div>
          </div>

          {/* Impact Interpretation */}
          <div className="p-4 bg-yellow-50 rounded-lg">
            <p className="text-sm text-yellow-800">
              <AlertCircle className="w-4 h-4 inline mr-1" />
              {scenario.impact.interpretation}
            </p>
          </div>

          {/* Dimension Adjustments */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Adjust Dimensions</h4>
            {(Object.keys(dimensionInfo) as DIIDimension[]).map(dimension => {
              const info = dimensionInfo[dimension];
              const currentValue = dimensions[dimension]?.metricValue;
              const hasChanged = currentValue !== undefined && editingValues[dimension] !== currentValue;

              return (
                <div key={dimension} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">
                      {info.label}
                    </label>
                    <div className="flex items-center gap-2">
                      {currentValue !== undefined && (
                        <span className="text-xs text-gray-500">
                          Current: {info.format(currentValue)}
                        </span>
                      )}
                      <span className={cn(
                        'text-sm font-medium',
                        hasChanged ? 'text-blue-600' : 'text-gray-900'
                      )}>
                        {editingValues[dimension] !== undefined ? info.format(editingValues[dimension]) : '--'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min={info.min}
                      max={info.max}
                      step={info.step}
                      value={editingValues[dimension]}
                      onChange={(e) => {
                        const newValue = parseFloat(e.target.value);
                        setEditingValues(prev => ({ ...prev, [dimension]: newValue }));
                        handleUpdate(dimension);
                      }}
                      className="flex-1"
                    />
                    <input
                      type="number"
                      min={info.min}
                      max={info.max}
                      step={info.step}
                      value={editingValues[dimension]}
                      onChange={(e) => {
                        const newValue = parseFloat(e.target.value);
                        if (!isNaN(newValue)) {
                          setEditingValues(prev => ({ ...prev, [dimension]: newValue }));
                          handleUpdate(dimension);
                        }
                      }}
                      className="w-20 px-2 py-1 text-sm border rounded"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <button
            onClick={handleDelete}
            className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete Scenario
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Done
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function DIIWhatIfScenarios() {
  const {
    scenarios,
    currentDII,
    createScenario,
    compareScenarios
  } = useDIIDimensionsStore();

  const [isCreating, setIsCreating] = useState(false);
  const [newScenarioName, setNewScenarioName] = useState('');
  const [newScenarioDescription, setNewScenarioDescription] = useState('');
  const [editingScenarioId, setEditingScenarioId] = useState<string | null>(null);

  const handleCreateScenario = () => {
    if (newScenarioName.trim()) {
      createScenario(
        newScenarioName,
        newScenarioDescription || 'Custom what-if scenario'
      );
      setNewScenarioName('');
      setNewScenarioDescription('');
      setIsCreating(false);
    }
  };

  const scenarioTemplates = [
    {
      name: 'Security Investment',
      description: 'What if we improve our weakest dimensions?',
      icon: Shield,
      color: 'blue'
    },
    {
      name: 'Budget Cuts',
      description: 'Impact of reducing security resources',
      icon: TrendingDown,
      color: 'red'
    },
    {
      name: 'Best Case',
      description: 'Achieving industry-leading metrics',
      icon: Target,
      color: 'green'
    }
  ];

  return (
    <div className="bg-white rounded-lg border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">What-If Scenarios</h3>
          <p className="text-sm text-gray-600">
            Explore how changes would impact your Digital Immunity
          </p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Scenario
        </button>
      </div>

      {/* Current Score Reference */}
      {currentDII && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">Current DII Score</div>
              <div className="text-2xl font-bold text-gray-900">{currentDII.score}</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Confidence</div>
              <div className="text-lg font-medium text-gray-700">{currentDII.confidence}%</div>
            </div>
          </div>
        </div>
      )}

      {/* Scenario Templates */}
      {scenarios.length === 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {scenarioTemplates.map((template, index) => {
            const Icon = template.icon;
            return (
              <motion.button
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setNewScenarioName(template.name);
                  setNewScenarioDescription(template.description);
                  setIsCreating(true);
                }}
                className={cn(
                  'p-4 rounded-lg border-2 border-dashed hover:border-solid transition-all text-left',
                  template.color === 'blue' && 'border-blue-300 hover:border-blue-400 hover:bg-blue-50',
                  template.color === 'red' && 'border-red-300 hover:border-red-400 hover:bg-red-50',
                  template.color === 'green' && 'border-green-300 hover:border-green-400 hover:bg-green-50'
                )}
              >
                <Icon className={cn(
                  'w-8 h-8 mb-2',
                  template.color === 'blue' && 'text-blue-500',
                  template.color === 'red' && 'text-red-500',
                  template.color === 'green' && 'text-green-500'
                )} />
                <h4 className="font-medium text-gray-900">{template.name}</h4>
                <p className="text-sm text-gray-600 mt-1">{template.description}</p>
              </motion.button>
            );
          })}
        </div>
      )}

      {/* Existing Scenarios */}
      {scenarios.length > 0 && (
        <div className="space-y-3">
          {scenarios.map(scenario => {
            const comparison = compareScenarios([scenario.id])[0];
            const isPositive = (comparison?.comparison.delta ?? 0) > 0;

            return (
              <motion.div
                key={scenario.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 border rounded-lg hover:border-blue-300 transition-all cursor-pointer"
                onClick={() => setEditingScenarioId(scenario.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{scenario.name}</h4>
                    <p className="text-sm text-gray-600">{scenario.description}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm text-gray-600">Projected DII</div>
                      <div className="text-xl font-bold text-gray-900">
                        {scenario.projectedDII.score}
                      </div>
                    </div>
                    <div className={cn(
                      'px-3 py-2 rounded-lg text-sm font-medium',
                      isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    )}>
                      {isPositive ? (
                        <TrendingUp className="w-4 h-4 inline mr-1" />
                      ) : (
                        <TrendingDown className="w-4 h-4 inline mr-1" />
                      )}
                      {isPositive ? '+' : ''}{comparison?.comparison.delta?.toFixed(0) || '0'}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Create Scenario Modal */}
      <AnimatePresence>
        {isCreating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setIsCreating(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Create What-If Scenario
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Scenario Name
                  </label>
                  <input
                    type="text"
                    value={newScenarioName}
                    onChange={(e) => setNewScenarioName(e.target.value)}
                    placeholder="e.g., Security Investment Plan"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={newScenarioDescription}
                    onChange={(e) => setNewScenarioDescription(e.target.value)}
                    placeholder="What are you testing with this scenario?"
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 mt-6">
                <button
                  onClick={() => {
                    setIsCreating(false);
                    setNewScenarioName('');
                    setNewScenarioDescription('');
                  }}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateScenario}
                  disabled={!newScenarioName.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  Create Scenario
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Scenario Modal */}
      <AnimatePresence>
        {editingScenarioId && (
          <ScenarioEditor
            scenarioId={editingScenarioId}
            onClose={() => setEditingScenarioId(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}