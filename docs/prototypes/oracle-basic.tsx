import React, { useState, useEffect } from 'react';
import { MessageCircle, AlertTriangle, TrendingUp, DollarSign, Clock, Shield, Send, Sparkles, ChevronRight, Brain, Target, Zap } from 'lucide-react';

const DII_ORACLE = () => {
  const [messages, setMessages] = useState([
    {
      type: 'oracle',
      content: '¡Hola! Soy tu DII Oracle 🤖. Puedo ayudarte a entender tu inmunidad digital en términos de negocio. ¿Comenzamos con un assessment rápido o prefieres que analice alguna amenaza específica?',
      timestamp: new Date().toISOString()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentAssessment, setCurrentAssessment] = useState(null);
  const [assessmentStep, setAssessmentStep] = useState(0);
  const [weeklyThreat, setWeeklyThreat] = useState(null);

  // Simulated weekly intelligence data
  useEffect(() => {
    // En producción, esto vendría del Weekly Intelligence Report
    setWeeklyThreat({
      name: 'BlackCat Ransomware',
      targetSector: 'Servicios Financieros',
      averageDowntime: 72,
      averageLoss: 2500000,
      activeThisWeek: true,
      affectedCompanies: 3
    });
  }, []);

  const assessmentQuestions = [
    {
      dimension: 'business_model',
      question: '¿Cuál es tu modelo de negocio principal?',
      options: [
        'Comercio con tiendas físicas + online',
        'Software que otros negocios necesitan para operar',
        'Vendemos datos o análisis',
        'Plataforma que conecta compradores y vendedores',
        'Servicios financieros o fintech',
        'Empresa tradicional con sistemas viejos',
        'Logística o cadena de suministro',
        'Manejamos información médica o regulada'
      ]
    },
    {
      dimension: 'aer',
      question: 'Si un hacker invierte $10,000 atacándote, ¿cuánto podría robar o extorsionar?',
      options: ['Menos de $10K', 'Como $50K', 'Unos $100K', 'Más de $500K'],
      businessContext: '💡 Esto determina qué tan atractivo eres para criminales'
    },
    {
      dimension: 'hfp',
      question: '¿Qué porcentaje de tu gente cae en pruebas de phishing?',
      options: ['Menos del 10%', '10-20%', '20-40%', 'Más del 40%', 'No hemos probado'],
      businessContext: '💡 El 91% de los ataques exitosos empiezan con un email'
    },
    {
      dimension: 'trd',
      question: 'Si tus sistemas principales fallan, ¿cuándo empiezas a perder dinero significativo?',
      options: ['En menos de 2 horas', '2-6 horas', '6-24 horas', '1-3 días', 'Más de 3 días'],
      businessContext: '💡 Esto define tu tolerancia real al downtime'
    },
    {
      dimension: 'rrg',
      question: 'Cuando hay problemas, ¿cuánto más tarda la recuperación vs. lo planeado?',
      options: ['Lo que planeamos', '2x más', '3x más', '5x o más', 'No tenemos plan'],
      businessContext: '💡 La realidad siempre supera los planes'
    }
  ];

  const calculateDII = (answers) => {
    // Simplified DII calculation for prototype
    const modelBase = [1.75, 1.0, 0.7, 0.6, 0.4, 0.35, 0.6, 0.55];
    const base = modelBase[answers.business_model] || 1.0;
    
    // Mock calculation - in production would use full formula
    const mockScore = 3.5 + Math.random() * 3;
    return {
      score: mockScore.toFixed(1),
      stage: mockScore < 4 ? 'Frágil' : mockScore < 6 ? 'Robusto' : 'Resiliente',
      percentile: Math.floor(20 + Math.random() * 60),
      weakestDimension: ['AER', 'HFP', 'BRI', 'TRD', 'RRG'][Math.floor(Math.random() * 5)]
    };
  };

  const generateInsight = async (diiScore, context = 'general') => {
    // In production, this would use window.claude.complete
    // For prototype, using contextual responses
    
    if (context === 'threat' && weeklyThreat) {
      return {
        impact: `Con tu DII ${diiScore.score}, si ${weeklyThreat.name} te ataca HOY, pierdes $${(weeklyThreat.averageLoss * (10 - diiScore.score) / 10 / 1000000).toFixed(1)}M y tardas ${Math.floor(weeklyThreat.averageDowntime * (10 - diiScore.score) / 10)} horas en recuperarte.`,
        comparison: `Empresas de tu sector con DII > 6.0 solo perdieron $${(weeklyThreat.averageLoss * 0.3 / 1000000).toFixed(1)}M`,
        action: 'Prioridad #1: Implementar MFA resistente a phishing. ROI en 2 semanas.'
      };
    }
    
    return {
      executive: `Tu empresa mantiene ${Math.floor(diiScore.score * 10)}% de operación bajo ataque. El promedio del sector es ${Math.floor((parseFloat(diiScore.score) - 0.5) * 10)}%.`,
      risk: `Principal vulnerabilidad: ${diiScore.weakestDimension}. Esto significa que ${diiScore.weakestDimension === 'HFP' ? 'tus empleados son la puerta de entrada' : diiScore.weakestDimension === 'TRD' ? 'pierdes dinero muy rápido cuando fallas' : 'los ataques se expanden rápidamente'}.`,
      opportunity: `Mejorar a DII 6.0 = Ahorrar $${(Math.random() * 2 + 1).toFixed(1)}M anuales en pérdidas evitadas.`
    };
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMessage = {
      type: 'user',
      content: input,
      timestamp: new Date().toISOString()
    };
    
    setMessages([...messages, userMessage]);
    setInput('');
    setIsTyping(true);
    
    // Simulate Oracle processing
    setTimeout(async () => {
      let oracleResponse = '';
      
      if (input.toLowerCase().includes('assessment') || input.toLowerCase().includes('evaluar')) {
        setAssessmentStep(1);
        oracleResponse = assessmentQuestions[0].question;
      } else if (input.toLowerCase().includes('amenaza') || input.toLowerCase().includes('blackcat')) {
        if (currentAssessment) {
          const insight = await generateInsight(currentAssessment, 'threat');
          oracleResponse = `🔴 ALERTA ACTIVA: ${weeklyThreat.name}\n\n${insight.impact}\n\n${insight.comparison}\n\n✅ ${insight.action}`;
        } else {
          oracleResponse = 'Necesito evaluar tu DII primero para analizar el impacto de amenazas. ¿Hacemos un assessment rápido?';
        }
      } else if (assessmentStep > 0 && assessmentStep <= assessmentQuestions.length) {
        // Handle assessment flow
        handleAssessmentAnswer(input);
        return;
      } else {
        oracleResponse = 'Puedo ayudarte con:\n• Evaluar tu DII actual\n• Analizar amenazas de esta semana\n• Explicar qué significa tu score\n• Compararte con tu industria\n\n¿Qué te gustaría saber?';
      }
      
      setMessages(prev => [...prev, {
        type: 'oracle',
        content: oracleResponse,
        timestamp: new Date().toISOString()
      }]);
      setIsTyping(false);
    }, 1000);
  };

  const handleAssessmentAnswer = (answer) => {
    // Store answer and move to next question
    const questionIndex = assessmentStep - 1;
    
    if (assessmentStep <= assessmentQuestions.length) {
      setTimeout(() => {
        if (assessmentStep < assessmentQuestions.length) {
          const nextQuestion = assessmentQuestions[assessmentStep];
          setMessages(prev => [...prev, {
            type: 'oracle',
            content: `${nextQuestion.question}\n\n${nextQuestion.businessContext || ''}`,
            timestamp: new Date().toISOString()
          }]);
          setAssessmentStep(assessmentStep + 1);
        } else {
          // Calculate DII and show results
          const diiResult = calculateDII({business_model: 0}); // Simplified for prototype
          setCurrentAssessment(diiResult);
          const insights = generateInsight(diiResult);
          
          setMessages(prev => [...prev, {
            type: 'oracle',
            content: `📊 **TU DIAGNÓSTICO DII**\n\nScore: ${diiResult.score}/10 (${diiResult.stage})\nPercentil: Top ${diiResult.percentile}% de tu industria\n\n💰 **Lo que significa para tu negocio:**\n${insights.executive}\n\n⚠️ **Tu mayor riesgo:**\n${insights.risk}\n\n🎯 **Oportunidad:**\n${insights.opportunity}\n\n¿Quieres que analice cómo te afectarían las amenazas actuales?`,
            timestamp: new Date().toISOString()
          }]);
          setAssessmentStep(0);
        }
        setIsTyping(false);
      }, 1000);
    }
  };

  const QuickAction = ({ icon: Icon, label, action }) => (
    <button
      onClick={action}
      className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm font-medium text-gray-700"
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Brain className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold">DII Oracle</h1>
              <p className="text-red-100">Tu CISO virtual que habla lenguaje de negocio</p>
            </div>
          </div>
          {currentAssessment && (
            <div className="text-right">
              <div className="text-3xl font-bold">{currentAssessment.score}</div>
              <div className="text-sm text-red-100">Tu DII Score</div>
            </div>
          )}
        </div>
        
        {/* Weekly Threat Alert */}
        {weeklyThreat && weeklyThreat.activeThisWeek && (
          <div className="bg-red-800 bg-opacity-50 p-3 rounded-lg flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <div className="flex-1">
              <div className="font-semibold">Amenaza Activa Esta Semana</div>
              <div className="text-sm text-red-100">
                {weeklyThreat.name} - {weeklyThreat.affectedCompanies} empresas afectadas en tu sector
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Chat Interface */}
      <div className="bg-white rounded-lg shadow-lg h-[500px] flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-4 rounded-lg ${
                  msg.type === 'user'
                    ? 'bg-gray-100 text-gray-800'
                    : 'bg-red-50 text-gray-800 border border-red-200'
                }`}
              >
                {msg.type === 'oracle' && (
                  <div className="flex items-center gap-2 mb-2 text-red-600">
                    <Sparkles className="w-4 h-4" />
                    <span className="font-semibold">Oracle</span>
                  </div>
                )}
                <div className="whitespace-pre-wrap">{msg.content}</div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-red-50 text-gray-800 p-4 rounded-lg border border-red-200">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce delay-200" />
                  </div>
                  <span className="text-sm text-gray-600">Oracle está analizando...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="border-t p-3 bg-gray-50">
          <div className="flex gap-2 flex-wrap">
            <QuickAction
              icon={Target}
              label="Evaluar mi DII"
              action={() => setInput('Quiero hacer un assessment rápido')}
            />
            <QuickAction
              icon={AlertTriangle}
              label="Analizar amenaza actual"
              action={() => setInput(`¿Cómo me afectaría ${weeklyThreat?.name}?`)}
            />
            <QuickAction
              icon={TrendingUp}
              label="Mejorar mi score"
              action={() => setInput('¿Cómo puedo mejorar mi DII?')}
            />
            <QuickAction
              icon={DollarSign}
              label="Ver ROI"
              action={() => setInput('¿Cuánto ahorraría mejorando mi DII?')}
            />
          </div>
        </div>

        {/* Input */}
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Pregúntame sobre tu inmunidad digital..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <button
              onClick={handleSend}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              Enviar
            </button>
          </div>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-red-600">
          <div className="flex items-center gap-3 mb-2">
            <Zap className="w-5 h-5 text-red-600" />
            <h3 className="font-semibold">Respuestas en segundos</h3>
          </div>
          <p className="text-sm text-gray-600">
            Sin jerga técnica. Directo al impacto en tu negocio.
          </p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-red-600">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-5 h-5 text-red-600" />
            <h3 className="font-semibold">Inteligencia actualizada</h3>
          </div>
          <p className="text-sm text-gray-600">
            Conectado con amenazas reales de esta semana en tu sector.
          </p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-red-600">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="w-5 h-5 text-red-600" />
            <h3 className="font-semibold">ROI cuantificado</h3>
          </div>
          <p className="text-sm text-gray-600">
            Cada recomendación incluye el retorno esperado.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DII_ORACLE;