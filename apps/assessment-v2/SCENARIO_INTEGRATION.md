# Scenario Integration into Assessment Flow

## Overview

Successfully integrated the 8x5 Business Model Pain Discovery Matrix into the assessment workflow, starting with the TRD (Threat Resilience & Downtime) dimension for the light assessment.

## Implementation Details

### 1. **State Management Updates** (`assessment-store.ts`)
- Added `scenarioResponses` array to store user responses
- Created `addScenarioResponse()` action to save responses
- Created `getScenarioResponse()` to retrieve responses by dimension
- Responses persist between sessions

### 2. **Question Display Component** (`ScenarioQuestionCard.tsx`)
- Visual card showing personalized scenario question
- 1-5 scale response options with semantic labels
- Shows interpretation hint after response
- Animated feedback for better UX

### 3. **Assessment Flow Integration** (`ScenarioQuestionsPage.tsx`)
- Replaces the placeholder QuestionsPage
- Loads personalized TRD question based on business model
- Maps business models to appropriate scenario IDs
- Calculates preliminary DII score (simplified for demo)
- Routes to results page after response

### 4. **Business Model to Scenario Mapping**
```typescript
SUBSCRIPTION_BASED → 2_software_critico
TRANSACTION_BASED → 5_servicios_financieros
ASSET_LIGHT → 2_software_critico
ASSET_HEAVY → 6_infraestructura_heredada
DATA_DRIVEN → 3_servicios_datos
PLATFORM_ECOSYSTEM → 4_ecosistema_digital
DIRECT_TO_CONSUMER → 1_comercio_hibrido
B2B_ENTERPRISE → 5_servicios_financieros
```

## User Experience Flow

1. **Company Search** → Find and select company
2. **Confirmation** → Verify data and critical infrastructure
3. **Business Model Reveal** → See detected model and risks
4. **Scenario Question** → Answer personalized TRD question
5. **Results** → View preliminary DII score

## Example Question Adaptation

**Original Template:**
"Si tu servicio falla ahora, ¿cuántos clientes empezarían a buscar alternativas después de 2 horas?"

**Adapted for TechCorp LATAM (500 employees, $50M revenue):**
"Si el servicio de TechCorp LATAM falla ahora, ¿cuántos clientes empezarían a buscar alternativas después de 8 horas?"

## Score Calculation (Simplified)

For the light assessment with only TRD:
- Response 1 (Muy deficiente) → 20 DII score → FRAGIL stage
- Response 2 (Deficiente) → 40 DII score → ROBUSTO stage  
- Response 3 (Regular) → 60 DII score → RESILIENTE stage
- Response 4 (Bueno) → 80 DII score → ADAPTATIVO stage
- Response 5 (Muy bueno) → 100 DII score → ADAPTATIVO stage

## Next Steps for Full Implementation

1. **Expand to All 5 Dimensions**
   - Add questions for AER, HFP, BRI, RRG
   - Create multi-step question flow
   - Update progress tracking

2. **Enhanced Score Calculation**
   - Implement full DII formula: (TRD × AER) / (HFP × BRI × RRG)
   - Add business model weights
   - Include industry benchmarks

3. **Premium Features**
   - Multiple questions per dimension
   - Deep-dive scenarios
   - Detailed recommendations

## Testing

The implementation can be tested by:
1. Starting a new assessment
2. Searching for a company
3. Confirming details
4. Viewing business model
5. Answering the TRD question
6. Seeing preliminary results

The personalized question will adapt based on company size, revenue, and industry context.