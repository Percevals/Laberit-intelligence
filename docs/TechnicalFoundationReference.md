DII Assessment Platform v2 - Technical Foundation Reference
For Claude Code Implementation
🎯 Project Identity
What We're Building: A Business Model Reality Check System that reveals cyber resilience through proven frameworks and real breach evidence.
Why This Exists: Companies need brutal honesty about their cyber resilience based on their business model, not generic security assessments that ignore operational reality.
Core Principle: We assume compromise. We measure survival.

🏗️ Technical Foundation Requirements
Core Architecture Principles
What: Modular, type-safe, evidence-driven architecture Why: Each component must be independently testable, verifiable against real data, and maintainable as we scale from Light to Premium versions.
// Every module follows this pattern
interface CoreModule<T> {
  validate(input: unknown): input is T;
  calculate(input: T): Result;
  interpret(result: Result): BusinessMeaning;
  verify(result: Result, evidence: BreachEvidence[]): Validation;
}
Business Model Engine
What: The classification and profiling system for 8 distinct business models Why: Business model determines inherent cyber resilience more than any security control. This is our core differentiation.
interface BusinessModelEngine {
  // Classification based on revenue model, not industry
  classify(answers: ClassificationAnswers): BusinessModel;
  
  // Each model has unique resilience characteristics
  getProfile(model: BusinessModel): ModelProfile;
  
  // Real examples for credibility
  getExamples(model: BusinessModel, region: Region): Company[];
  
  // Historical breach patterns
  getVulnerabilities(model: BusinessModel): VulnerabilityPattern[];
}

interface ModelProfile {
  id: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  name: string;
  diiBase: { min: number; max: number; avg: number };
  inherentStrengths: string[];
  fatalFlaws: string[];
  typicalAttacks: AttackPattern[];
  resilienceWindow: { hours: number; description: string };
}
DII Calculation Engine
What: The mathematical core that computes Digital Immunity Index Why: Our formula is proven across 150+ assessments. It's not arbitrary - it predicts real operational impact.
interface DIIEngine {
  // Core formula: DII = (TRD × AER) / (HFP × BRI × RRG)
  calculate(dimensions: DIIDimensions): DIIRawScore;
  
  // Normalize based on business model
  normalize(raw: DIIRawScore, model: BusinessModel): DIIScore;
  
  // Interpret into business language
  interpret(score: DIIScore): MaturityStage;
  
  // Compare to peer benchmarks
  benchmark(score: DIIScore, model: BusinessModel): Percentile;
}

interface DIIDimensions {
  TRD: number; // Time to Revenue Degradation (1-10)
  AER: number; // Attack Economics Ratio (1-10)
  HFP: number; // Human Failure Probability (1-10)
  BRI: number; // Blast Radius Index (1-10)
  RRG: number; // Recovery Reality Gap (1-10)
}

type MaturityStage = 'FRAGIL' | 'ROBUSTO' | 'RESILIENTE' | 'ADAPTATIVO';
Breach Evidence System
What: Repository and matcher for real breach cases Why: We don't predict - we show what actually happened to similar companies. Evidence beats theory.
interface BreachEvidenceSystem {
  // Find breaches matching user profile
  findSimilar(profile: CompanyProfile): BreachCase[];
  
  // Analyze if user would survive similar attack
  analyzeSurvival(userDII: DIIScore, breach: BreachCase): SurvivalAnalysis;
  
  // Extract prevention patterns
  extractPrevention(breaches: BreachCase[]): PreventionPattern[];
  
  // Calculate real costs in business terms
  calculateImpact(breach: BreachCase, company: CompanyProfile): FinancialImpact;
}

interface BreachCase {
  id: string;
  date: Date;
  victim: {
    businessModel: BusinessModel;
    size: CompanySize;
    region: string;
    industry: string;
  };
  attack: {
    vector: string;
    method: string;
    sophistication: 'COMMODITY' | 'TARGETED' | 'ADVANCED';
  };
  impact: {
    financialLoss: number;
    downtimeHours: number;
    operationalLoss: Percentage;
    dataExfiltrated: boolean;
  };
  timeline: BreachEvent[];
  prevention: {
    whatWouldHaveHelped: Control[];
    whatFailedToHelp: Control[];
  };
}
Reality Check Interface
What: The question flow that reveals truth in 30 minutes Why: Every question is based on breach patterns. No fluff, only what distinguishes victims from survivors.
interface RealityCheckFlow {
  // Dynamic questions based on business model
  getQuestions(model: BusinessModel): Question[];
  
  // Each question links to real breach evidence
  getEvidence(question: Question): BreachCase[];
  
  // Progressive calculation as user answers
  calculateProgressive(answers: Answer[]): PartialDIIScore;
  
  // Show impact of each answer
  explainImpact(question: Question, answer: Answer): ImpactExplanation;
}

interface Question {
  id: string;
  text: string;
  why: string; // Why this matters
  evidence: string[]; // Breach IDs that prove it
  dimension: keyof DIIDimensions;
  weight: number;
}
Intelligence Integration
What: Weekly breach intelligence translated to business impact Why: Continuous evidence that our framework works. Shows evolution of threats mapped to business models.
interface IntelligenceService {
  // Process weekly breach reports
  processWeeklyIntel(report: WeeklyReport): ProcessedIntelligence;
  
  // Map to business models
  mapToModels(intel: ProcessedIntelligence): ModelImpactMap;
  
  // Generate alerts for users
  generateAlerts(userProfile: CompanyProfile, intel: ProcessedIntelligence): Alert[];
  
  // Update breach evidence database
  updateEvidence(intel: ProcessedIntelligence): BreachCase[];
}

interface ProcessedIntelligence {
  week: Date;
  breaches: BreachSummary[];
  emergingPatterns: ThreatPattern[];
  modelImpacts: Map<BusinessModel, Impact>;
  preventionInsights: Insight[];
}
Roadmap Generator
What: Practical action plans based on assessment results Why: We don't give generic advice. Every recommendation is tied to preventing specific breaches.
interface RoadmapGenerator {
  // Generate prioritized actions
  generate(assessment: AssessmentResult): Roadmap;
  
  // Calculate real ROI based on breach prevention
  calculateROI(action: Action, profile: CompanyProfile): ROI;
  
  // Show which breaches each action prevents
  mapToPrevention(action: Action): BreachCase[];
  
  // Track implementation success
  trackProgress(roadmap: Roadmap, milestones: Milestone[]): Progress;
}

interface Roadmap {
  immediate: Action[]; // Week 1 - Quick wins
  shortTerm: Action[]; // Month 1 - High ROI
  strategic: Action[]; // Quarter 1 - Transformation
  
  preventedBreaches: BreachCase[];
  estimatedSavings: number;
  difficultyScore: number;
}
Visualization System
What: Consistent visual language for cyber resilience Why: Complex data must be instantly understandable by executives. Our visuals are our brand.
interface VisualizationSystem {
  // Signature DII Gauge
  gauge: DIIGaugeComponent;
  
  // Business Model Risk Matrix
  riskMatrix: RiskMatrixComponent;
  
  // Breach Timeline
  timeline: TimelineComponent;
  
  // Cost Impact
  costImpact: CostImpactComponent;
  
  // All support static generation for reports
  generateStatic(data: VisualizationData): StaticOutput;
}

// Consistent across all products
interface DIIVisualization {
  theme: 'light' | 'dark';
  size: 'small' | 'medium' | 'large';
  interactive: boolean;
  exportable: boolean;
  accessible: boolean; // WCAG 2.1 AA
}

🔧 Technical Standards
Type Safety
What: Strict TypeScript with no any types Why: Financial and operational calculations must be error-free. Types catch mistakes before they impact users.
// Example: Strict typing for calculations
type Score = number & { readonly brand: unique symbol };
type Percentage = number & { readonly brand: unique symbol };

function calculateDII(dimensions: DIIDimensions): Score {
  // TypeScript ensures valid inputs and outputs
}
Testing Philosophy
What: Test against real breach data, not mocks Why: Our value is truth. Tests must verify against actual incidents.
// Example: Reality-based testing
describe('DII Calculator', () => {
  it('correctly predicts operational loss for real breaches', () => {
    realBreaches.forEach(breach => {
      const dii = calculateDII(breach.priorAssessment);
      const predicted = interpretOperationalLoss(dii);
      const actual = breach.actualOperationalLoss;
      
      expect(predicted).toBeWithinRange(actual - 0.1, actual + 0.1);
    });
  });
});
Data Integrity
What: Immutable breach evidence with audit trail Why: Our credibility depends on verifiable data. No tampering with evidence.
interface BreachRecord {
  readonly id: string;
  readonly verifiedDate: Date;
  readonly sources: Source[];
  readonly verificationMethod: string;
  readonly confidence: 'VERIFIED' | 'PROBABLE' | 'ESTIMATED';
  
  // Prevent modifications
  readonly [immutable: symbol]: true;
}
Performance Requirements
What: Sub-second calculations, instant feedback Why: Truth shouldn't keep you waiting. Fast insights enable quick decisions.
interface PerformanceRequirements {
  calculation: { max: 100 }; // ms
  pageLoad: { max: 1000 };   // ms
  interaction: { max: 50 };   // ms
  export: { max: 2000 };      // ms
}

📦 Module Specifications
Assessment Light Module
What: 30-minute reality check revealing cyber truth Why: Free access to brutal honesty creates trust and demand for deeper analysis.
interface AssessmentLight {
  // Classify business model in 2 questions
  classifier: BusinessClassifier;
  
  // 15 killer questions based on breach patterns
  assessment: QuickAssessment;
  
  // Show 3 relevant breaches
  breachComparison: BreachMatcher;
  
  // Single page of truth
  report: RealityReport;
  
  // Tease premium value
  upgrade: UpgradePath;
}
Assessment Premium Module
What: 2-5 day comprehensive analysis with implementation roadmap Why: Deep dive for organizations ready to transform their resilience.
interface AssessmentPremium {
  // All Light features plus:
  detailedAnalysis: ComprehensiveAssessment;
  peerBenchmarking: BenchmarkAnalysis;
  scenarioTesting: WhatIfAnalyzer;
  implementationPlan: DetailedRoadmap;
  progressTracking: ImplementationTracker;
  expertGuidance: ConsultancySupport;
}
Intelligence Hub Module
What: Weekly reality updates showing latest breaches Why: Continuous evidence that our framework predicts real outcomes.
interface IntelligenceHub {
  // Weekly breach summaries
  weeklyDigest: BreachDigest;
  
  // Pattern detection
  emergingThreats: PatternAnalyzer;
  
  // Model-specific impacts
  modelAlerts: ModelImpactTracker;
  
  // Prevention insights
  lessonsLearned: PreventionExtractor;
}

🎨 Design System Requirements
Visual Identity
What: Consistent visual language across all touchpoints Why: Professional credibility through cohesive design. Recognition builds trust.
interface DesignSystem {
  colors: {
    fragil: '#DC2626';      // Danger
    robusto: '#F59E0B';     // Warning  
    resiliente: '#10B981';  // Good
    adaptativo: '#3B82F6';  // Excellent
  };
  
  typography: {
    display: 'Inter';       // Clean, modern
    weights: [300, 400, 700, 900];
  };
  
  components: {
    gauge: DIIGauge;        // Signature visual
    matrix: RiskMatrix;     // Business model positioning
    timeline: BreachTimeline; // Cost progression
  };
}
Responsive Behavior
What: Mobile-first but desktop-optimized Why: Executives check on phones but analyze on desktops.
interface ResponsiveStrategy {
  mobile: {
    priority: 'speed';
    interaction: 'touch';
    content: 'essential';
  };
  
  desktop: {
    priority: 'depth';
    interaction: 'hover';
    content: 'comprehensive';
  };
}

🔐 Security & Privacy
Data Handling
What: Zero storage of identifiable assessment data Why: Trust requires privacy. We analyze, we don't surveil.
interface PrivacyFirst {
  storage: 'session-only';
  identification: 'none';
  tracking: 'anonymous-metrics-only';
  export: 'client-side-only';
}
Breach Evidence Protection
What: Verified but anonymized breach data Why: Real evidence without violating confidentiality.
interface EvidenceProtection {
  anonymization: 'irreversible';
  verification: 'multi-source';
  storage: 'encrypted';
  access: 'read-only-public';
}

🚀 Integration Requirements
API Design
What: RESTful API with GraphQL for complex queries Why: Simple for basic needs, powerful for advanced analysis.
interface APIDesign {
  rest: {
    '/assess/quick': QuickAssessmentEndpoint;
    '/assess/full': FullAssessmentEndpoint;
    '/breaches/similar': SimilarBreachesEndpoint;
    '/intelligence/weekly': WeeklyIntelEndpoint;
  };
  
  graphql: {
    query: ComplexAnalysisQueries;
    subscription: RealTimeAlerts;
  };
}
Export Capabilities
What: Multiple formats for different uses Why: Truth must be shareable in any context.
interface ExportFormats {
  pdf: ExecutiveReport;      // For boards
  pptx: PresentationDeck;    // For meetings
  json: RawData;            // For analysis
  png: VisualSummary;       // For sharing
}

📊 Analytics Requirements
Success Tracking
What: Measure real impact, not vanity metrics Why: Our success is measured in breaches prevented.
interface SuccessMetrics {
  breachesPrevented: VerifiedPrevention[];
  moneySaved: FinancialImpact;
  timeRecovered: OperationalHours;
  truthsRevealed: AhaMoments;
  actionsImplemented: RoadmapProgress;
}

🎯 The North Star
Every technical decision must answer:
	1	Does this reveal truth about business model resilience?
	2	Is this backed by real breach evidence?
	3	Will this drive practical action, not theater?
Remember: We're not building another security tool. We're building the first Business Model Reality Check System that tells the truth.

For Claude Code: This is your blueprint. Build with conviction. Test against reality. Ship with pride.
