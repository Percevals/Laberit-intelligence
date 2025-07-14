# Language Support Architecture Analysis - Assessment-v2 Module

## Executive Summary

The assessment-v2 module has a **partial internationalization (i18n) setup** using react-i18next, but it's **incomplete and inconsistently implemented**. While the infrastructure exists for multi-language support, many components still contain hardcoded strings in both English and Spanish, explaining why the assessment remains in English despite previous Spanish UI fixes.

## Current Architecture

### 1. i18n Infrastructure ✅ (Properly Set Up)

- **Configuration**: `/src/shared/i18n/config.ts`
  - Uses react-i18next
  - Default language: Spanish (`es`)
  - Fallback language: Spanish
  - Supports: Spanish (es) and English (en)
  - Properly initialized in `main.tsx`

- **Translation Files**:
  - `/src/shared/i18n/locales/es.json` - Spanish translations
  - `/src/shared/i18n/locales/en.json` - English translations (incomplete)

- **Language Switching**: 
  - Language switcher component exists in HomePage
  - Allows toggling between ES/EN

### 2. Translation Coverage ⚠️ (Incomplete)

#### Components Using Translations (Partially):
- `ScenarioQuestionCard` - Uses `useTranslation` but has hardcoded Spanish strings
- `AdaptiveImmunityBuildingPage` - Uses `useTranslation` but extensive hardcoded strings
- `HomePage`, `CompanySearchPage`, `BusinessModelRevealPage` - Properly internationalized
- Most page components import `useTranslation`

#### Components NOT Using Translations:
- `ImmunityTimelineNavigation` - Completely hardcoded English strings
- `InsightRevelationCard` - Not checked but likely hardcoded
- Various demo components - Hardcoded strings

### 3. Major Issues Found

#### A. Hardcoded English Strings (Examples):
```typescript
// In ImmunityTimelineNavigation.tsx
'Threat Resilience'
'Attack Economics'
'Human Factor'
'Blast Radius'
'Recovery Reality'
'Answering now...'
'Immunity Profile Complete!'
'Calculate My DII Score'
```

#### B. Hardcoded Spanish Strings (Examples):
```typescript
// In ScenarioQuestionCard.tsx
'¿Por qué es importante?'

// In AdaptiveImmunityBuildingPage.tsx
'Recomendaciones inteligentes'
'Responder todas las preguntas'
'minutos restantes'
'Estimación inteligente disponible'
'Valor sugerido'
'horas'
```

#### C. Missing Translation Keys:
The English translation file is missing many keys that exist in the Spanish file, including:
- Dimension names (TRD, AER, HFP, BRI, RRG)
- UI elements (yes, no, edit, confirm)
- Assessment-specific terms
- Company-related fields
- Many assessment flow strings

### 4. Inconsistent Implementation Patterns

1. **Mixed Languages**: Some components mix hardcoded Spanish with translation keys
2. **Incomplete Translation Usage**: Components import `useTranslation` but don't use it for all strings
3. **Missing Fallbacks**: Some translation calls lack fallback strings
4. **Dimension Configurations**: Critical dimension information is hardcoded in component configurations rather than translation files

## Root Cause Analysis

The assessment remains in English because:

1. **Critical Components Not Internationalized**: Key components like `ImmunityTimelineNavigation` have all strings hardcoded in English
2. **Incomplete Migration**: The i18n system was set up but not fully implemented across all components
3. **Mixed Implementation**: Some developers used translations while others hardcoded strings
4. **Missing Translation Keys**: Many strings don't have corresponding translation keys in the locale files

## Recommendations

### Immediate Actions:
1. Add missing translation keys for all hardcoded strings
2. Update `ImmunityTimelineNavigation` to use translations
3. Replace all hardcoded strings in assessment components with translation keys
4. Complete the English translation file

### Long-term Improvements:
1. Establish a translation key naming convention
2. Create a linting rule to prevent hardcoded strings
3. Implement a translation management workflow
4. Add translation coverage tests

## Conclusion

The module was **designed with multi-language support** but the implementation was **never completed**. The i18n infrastructure exists and works, but approximately 40-50% of the UI strings remain hardcoded, creating a mixed-language experience. This is not a design limitation but rather an incomplete implementation that needs to be finished.