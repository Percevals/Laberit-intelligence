# Historical Company Database Validation Report

Generated: 2025-07-17T10:53:21.085Z

## Summary

- **Total Records Found:** 150
- **Expected Records:** 150
- **Status:** ✅ PASS
- **Encoding Issues:** 0
- **Parse Errors:** 0

## Data Completeness

| Column | Missing Values | Completeness % |
|--------|----------------|----------------|
| Real_Company_Name | 0 | 100.0% |
| Real_Country | 0 | 100.0% |
| Real_Industry | 0 | 100.0% |
| Employee_Count | 0 | 100.0% |
| Anonymized_Name | 58 | 61.3% |
| Company_ID | 0 | 100.0% |
| Business_Model_v3 | 0 | 100.0% |
| Business_Model_Confidence | 43 | 71.3% |
| AER | 0 | 100.0% |
| HFP | 0 | 100.0% |
| BRI | 0 | 100.0% |
| TRD | 0 | 100.0% |
| RRG | 0 | 100.0% |
| CLOUD_ADOPTION_LEVEL | 0 | 100.0% |

## Companies with Incomplete Data (0)


## Duplicate Analysis

- **Duplicate IDs:** 0
- **Duplicate Names:** 0


## Business Model v3 Analysis

### Distribution

| Business Model | Count | Percentage |
|----------------|-------|------------|
| Platform | 52 | 34.7% |
| Manufacturing | 35 | 23.3% |
| Financial Services | 35 | 23.3% |
| Traditional Retail | 11 | 7.3% |
| SaaS | 7 | 4.7% |
| Healthcare | 5 | 3.3% |
| XaaS | 3 | 2.0% |
| Marketplace | 1 | 0.7% |
| Hybrid | 1 | 0.7% |

### Migration Concerns

The following v3 models have high volume and may need special attention:

- **Platform** (52 companies): Large volume requires careful classification between PLATAFORMA_TECNOLOGICA and SERVICIOS_DATOS
- **Manufacturing** (35 companies): May include INFRAESTRUCTURA_HEREDADA candidates for large industrial companies
- **Financial Services** (35 companies): Direct mapping available

## DII v4 Model Candidates

### SERVICIOS_DATOS Candidates (3)

| Company | Current Model | Industry | Reason |
|---------|---------------|----------|--------|
| MINTIC Colombia | Platform | Public | Keywords suggest data/analytics focus |
| MINVIVIENDA Colombia | Platform | Public | Keywords suggest data/analytics focus |
| Procolombia | Platform | Public | Keywords suggest data/analytics focus |

### INFRAESTRUCTURA_HEREDADA Candidates (30)

| Company | Current Model | Industry | Employees | Reason |
|---------|---------------|----------|-----------|--------|
| Cocamar | Manufacturing | Industrial | 2492 | Legacy industry sector |
| Prodam | Platform | Public | 6583 | Large enterprise size |
| Ministerio de Educacion Publica Costa Rica | Platform | Education | 101807 | Large enterprise size |
| Agrosuper | Manufacturing | Industrial | 4769 | Legacy industry sector |
| Aleatica | Platform | Transportation | 2302 | Legacy industry sector |
| Alimentos Diana | Manufacturing | Industrial | 1085 | Legacy industry sector |
| ARCOR | Manufacturing | Industrial | 11800 | Legacy industry sector |
| Carozzi | Manufacturing | Industrial | 3571 | Legacy industry sector |
| Distriluz | Platform | Energy | 3312 | Legacy industry sector |
| DUOC | Platform | Education | 6661 | Large enterprise size |
| Edenor | Platform | Energy | 6187 | Legacy industry sector |
| Edenorte | Platform | Energy | 2038 | Legacy industry sector |
| Elcatex | Manufacturing | Industrial | 1611 | Legacy industry sector |
| Gloria | Manufacturing | Industrial | 7325 | Legacy industry sector |
| Grupo Express | Platform | Transportation | 1487 | Legacy industry sector |
| Grupo Jacto | Manufacturing | Industrial | 1847 | Legacy industry sector |
| Grupo Purdy | Manufacturing | Industrial | 1275 | Legacy industry sector |
| ISA | Platform | Energy | 1808 | Legacy industry sector |
| Lima Airport Partners | Platform | Transportation | 1017 | Legacy industry sector |
| Megalabs | Manufacturing | Pharma | 6602 | Large enterprise size |
| Mercasid | Manufacturing | Industrial | 1290 | Legacy industry sector |
| Numar | Manufacturing | Industrial | 1147 | Legacy industry sector |
| Pampa Energ’a | Platform | Energy | 3125 | Legacy industry sector |
| PetroPeru | Platform | Energy | 2916 | Legacy industry sector |
| Plaenge | Platform | Industrial | 2027 | Legacy industry sector |
| Sierracol | Platform | Energy | 1669 | Legacy industry sector |
| Ticel | Manufacturing | Industrial | 3013 | Legacy industry sector |
| Vipal | Manufacturing | Industrial | 1795 | Legacy industry sector |
| XM | Platform | Energy | 1920 | Legacy industry sector |
| Grupo A | Manufacturing | Industrial | 1597 | Legacy industry sector |

## Recommendations

1. Carefully review 52 Platform companies for proper v4 classification (PLATAFORMA_TECNOLOGICA vs SERVICIOS_DATOS)
2. Consider manual review to identify more SERVICIOS_DATOS candidates from Platform/SaaS companies
3. Create a mapping table for v3 to v4 business model migration with manual review for edge cases
4. Implement data validation rules in PostgreSQL to prevent future data quality issues
