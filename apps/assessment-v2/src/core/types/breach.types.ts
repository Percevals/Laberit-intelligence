/**
 * Breach evidence types
 * Real incidents mapped to business impact
 */

import type { Currency, Hours, Percentage } from './brand.types';
import type { BusinessModel, CompanySize } from './business-model.types';

export interface BreachCase {
  id: string;
  verifiedDate: Date;
  
  // Victim profile
  victim: {
    name?: string; // May be anonymized
    businessModel: BusinessModel;
    size: CompanySize;
    region: string;
    industry: string;
    employees?: number;
    revenue?: Currency;
  };
  
  // Attack details
  attack: {
    vector: AttackVector;
    method: string;
    sophistication: 'COMMODITY' | 'TARGETED' | 'ADVANCED';
    insiderThreat: boolean;
    duration: {
      dwellTime: Hours; // Time from breach to detection
      containment: Hours; // Time from detection to containment
      recovery: Hours; // Time to full recovery
    };
  };
  
  // Measured impact
  impact: {
    financialLoss: Currency;
    downtimeHours: Hours;
    operationalLoss: Percentage; // % of operations affected
    dataExfiltrated: boolean;
    dataTypes?: DataType[];
    recordsCompromised?: number;
    ransomDemanded?: Currency;
    ransomPaid?: boolean;
    
    // Business consequences
    customersLost?: Percentage;
    stockPriceImpact?: Percentage;
    executivesFired?: boolean;
    companyShutdown?: boolean;
  };
  
  // Timeline of events
  timeline: BreachEvent[];
  
  // What could have prevented this
  prevention: {
    whatWouldHaveHelped: Control[];
    whatFailedToHelp: Control[];
    rootCauses: string[];
  };
  
  // Verification
  sources: Source[];
  confidence: 'VERIFIED' | 'PROBABLE' | 'ESTIMATED';
  
  // Immutability marker
  readonly [Symbol.for('immutable')]: true;
}

export type AttackVector = 
  | 'PHISHING'
  | 'RANSOMWARE'
  | 'SUPPLY_CHAIN'
  | 'INSIDER'
  | 'WEB_APP'
  | 'CLOUD_MISCONFIGURATION'
  | 'CREDENTIAL_STUFFING'
  | 'ZERO_DAY'
  | 'PHYSICAL_BREACH'
  | 'SOCIAL_ENGINEERING'
  | 'API_ABUSE'
  | 'IOT_COMPROMISE';

export type DataType = 
  | 'PII'           // Personal Identifiable Information
  | 'PHI'           // Protected Health Information
  | 'PCI'           // Payment Card Information
  | 'INTELLECTUAL_PROPERTY'
  | 'TRADE_SECRETS'
  | 'CREDENTIALS'
  | 'FINANCIAL_RECORDS'
  | 'EMPLOYEE_DATA'
  | 'CUSTOMER_DATA'
  | 'SOURCE_CODE';

export interface BreachEvent {
  date: Date;
  event: string;
  category: 'ATTACK' | 'DETECTION' | 'RESPONSE' | 'RECOVERY' | 'DISCLOSURE';
  significance: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface Control {
  category: ControlCategory;
  name: string;
  effectiveness: Percentage;
  implementationCost: 'LOW' | 'MEDIUM' | 'HIGH';
  implementationTime: 'DAYS' | 'WEEKS' | 'MONTHS';
}

export type ControlCategory = 
  | 'IDENTITY'
  | 'DEVICE'
  | 'NETWORK'
  | 'APPLICATION'
  | 'DATA'
  | 'INFRASTRUCTURE'
  | 'GOVERNANCE'
  | 'RESPONSE';

export interface Source {
  type: 'NEWS' | 'SEC_FILING' | 'COURT_DOCUMENT' | 'COMPANY_DISCLOSURE' | 'RESEARCHER' | 'INTELLIGENCE';
  name: string;
  url?: string;
  date: Date;
  credibility: 'HIGH' | 'MEDIUM' | 'LOW';
}

// For comparing breaches to user profile
export interface SimilarityScore {
  overall: Percentage;
  factors: {
    businessModel: Percentage;
    companySize: Percentage;
    region: Percentage;
    industry: Percentage;
    attackVector: Percentage;
  };
}

export interface BreachSurvivalAnalysis {
  wouldSurvive: boolean;
  confidence: Percentage;
  criticalFactors: string[];
  estimatedImpact: {
    downtime: Hours;
    financialLoss: Currency;
    operationalLoss: Percentage;
  };
  recommendations: string[];
}