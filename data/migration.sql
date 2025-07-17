-- DII Historical Data Migration SQL
-- Generated: 2025-07-17T11:28:41.219Z
-- Total Companies: 150

BEGIN;

-- Company: Chama (SOFTWARE_CRITICO - 90.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  35, 'Chama', 'chama.com', 'Technology', 'SOFTWARE_CRITICO', 0.9, 'Software platforms require 24/7 availability with customer data protection', 'Brazil', 'Brazil', 'South America', 70, 0, '2025-07-17T11:28:41.221Z', 'historical_migration', 0, false, 35, 3.69, 0.9, 'v4.0', '2025-07-17T11:28:41.221Z', false, 1, false
);

-- Company: CIMED (COMERCIO_HIBRIDO - 90.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  36, 'CIMED', 'cimed.com', 'Pharma', 'COMERCIO_HIBRIDO', 0.9, 'Omnichannel retail combining physical and digital sales channels; Matrix classification: product_sales + hybrid_model', 'Brazil', 'Brazil', 'South America', 2457, 0, '2025-07-17T11:28:41.222Z', 'historical_migration', 0, false, 36, 2.95, 0.9, 'v4.0', '2025-07-17T11:28:41.222Z', false, 1, false
);

-- Company: Cocamar (COMERCIO_HIBRIDO - 90.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  39, 'Cocamar', 'cocamar.com', 'Industrial', 'COMERCIO_HIBRIDO', 0.9, 'Omnichannel retail combining physical and digital sales channels; Matrix classification: product_sales + hybrid_model', 'Brazil', 'Brazil', 'South America', 2492, 0, '2025-07-17T11:28:41.222Z', 'historical_migration', 0, false, 39, 3.74, 0.9, 'v4.0', '2025-07-17T11:28:41.222Z', false, 1, false
);

-- Company: Fondo Social para la Vivienda (ECOSISTEMA_DIGITAL - 70.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  58, 'Fondo Social para la Vivienda', 'fondosocialparalaviv.com', 'Public', 'ECOSISTEMA_DIGITAL', 0.7, 'Public sector digital platform for citizen services', 'El Salvador', 'El Salvador', 'Central America', 547, 0, '2025-07-17T11:28:41.222Z', 'historical_migration', 0, false, 58, 3.60, 0.7, 'v4.0', '2025-07-17T11:28:41.222Z', false, 1, false
);

-- Company: Grupo Auto F‡cil (SERVICIOS_FINANCIEROS - 95.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  62, 'Grupo Auto F‡cil', 'grupoautofcil.com', 'Financial', 'SERVICIOS_FINANCIEROS', 0.95, 'Banking operations require real-time transaction processing with zero downtime tolerance', 'El Salvador', 'El Salvador', 'Central America', 504, 0, '2025-07-17T11:28:41.222Z', 'historical_migration', 0, false, 62, 4.87, 0.95, 'v4.0', '2025-07-17T11:28:41.222Z', false, 1, false
);

-- Company: Grupo Q (COMERCIO_HIBRIDO - 90.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  68, 'Grupo Q', 'grupoq.com', 'Retail', 'COMERCIO_HIBRIDO', 0.9, 'Retail operations span physical stores and digital channels requiring omnichannel security', 'El Salvador', 'El Salvador', 'Central America', 2395, 0, '2025-07-17T11:28:41.222Z', 'historical_migration', 0, false, 68, 3.75, 0.9, 'v4.0', '2025-07-17T11:28:41.222Z', false, 1, false
);

-- Company: Grupo Sur (COMERCIO_HIBRIDO - 90.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  69, 'Grupo Sur', 'gruposur.com', 'Industrial', 'COMERCIO_HIBRIDO', 0.9, 'Omnichannel retail combining physical and digital sales channels; Matrix classification: product_sales + hybrid_model', 'Costa Rica', 'Costa Rica', 'Central America', 917, 0, '2025-07-17T11:28:41.222Z', 'historical_migration', 0, false, 69, 3.13, 0.9, 'v4.0', '2025-07-17T11:28:41.222Z', false, 1, false
);

-- Company: HDI Seguros (SERVICIOS_FINANCIEROS - 95.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  72, 'HDI Seguros', 'hdiseguros.com', 'Financial', 'SERVICIOS_FINANCIEROS', 0.95, 'Banking operations require real-time transaction processing with zero downtime tolerance', 'Brazil', 'Brazil', 'South America', 4241, 0, '2025-07-17T11:28:41.222Z', 'historical_migration', 0, false, 72, 3.59, 0.95, 'v4.0', '2025-07-17T11:28:41.222Z', false, 1, false
);

-- Company: Lavoro (COMERCIO_HIBRIDO - 90.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  80, 'Lavoro', 'lavoro.com', 'Industrial', 'COMERCIO_HIBRIDO', 0.9, 'Traditional retail with digital transformation initiatives; Matrix classification: direct_sales + physical_critical', 'Brazil', 'Brazil', 'South America', 2265, 0, '2025-07-17T11:28:41.223Z', 'historical_migration', 0, false, 80, 4.38, 0.9, 'v4.0', '2025-07-17T11:28:41.223Z', false, 1, false
);

-- Company: Meco (COMERCIO_HIBRIDO - 90.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  81, 'Meco', 'meco.com', 'Industrial', 'COMERCIO_HIBRIDO', 0.9, 'Omnichannel retail combining physical and digital sales channels; Matrix classification: product_sales + hybrid_model', 'Costa Rica', 'Costa Rica', 'Central America', 927, 0, '2025-07-17T11:28:41.223Z', 'historical_migration', 0, false, 81, 3.58, 0.9, 'v4.0', '2025-07-17T11:28:41.223Z', false, 1, false
);

-- Company: Prodam (SERVICIOS_DATOS - 75.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  107, 'Prodam', 'prodam.com', 'Public', 'SERVICIOS_DATOS', 0.75, 'Public sector digital platform for citizen services; Public sector platform likely focuses on data services', 'Brazil', 'Brazil', 'South America', 6583, 0, '2025-07-17T11:28:41.223Z', 'historical_migration', 0, false, 107, 3.21, 0.75, 'v4.0', '2025-07-17T11:28:41.223Z', false, 1, false
);

-- Company: Siqueira Castro (SOFTWARE_CRITICO - 80.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  113, 'Siqueira Castro', 'siqueiracastro.com', 'Services', 'SOFTWARE_CRITICO', 0.8, 'Software service with some physical touchpoints but primarily digital delivery; Matrix classification: recurring_subscriptions + hybrid_model', 'Brazil', 'Brazil', 'South America', 905, 0, '2025-07-17T11:28:41.224Z', 'historical_migration', 0, false, 113, 2.60, 0.8, 'v4.0', '2025-07-17T11:28:41.224Z', false, 1, false
);

-- Company: Tesouro Nacional (SERVICIOS_DATOS - 75.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  120, 'Tesouro Nacional', 'tesouronacional.com', 'Public', 'SERVICIOS_DATOS', 0.75, 'Public sector digital platform for citizen services; Public sector platform likely focuses on data services', 'Brazil', 'Brazil', 'South America', 798, 0, '2025-07-17T11:28:41.224Z', 'historical_migration', 0, false, 120, 3.44, 0.75, 'v4.0', '2025-07-17T11:28:41.224Z', false, 1, false
);

-- Company: Corporaci—n Multi Inversiones (COMERCIO_HIBRIDO - 95.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  38, 'Corporaci—n Multi Inversiones', 'corporacinmultiinver.com', 'Industrial', 'COMERCIO_HIBRIDO', 0.95, 'Hybrid commerce model balancing physical and digital channels; Matrix classification: direct_sales + hybrid_model', 'Guatemala', 'Guatemala', 'Central America', 8038, 0, '2025-07-17T11:28:41.224Z', 'historical_migration', 0, false, 38, 3.34, 0.95, 'v4.0', '2025-07-17T11:28:41.224Z', false, 1, false
);

-- Company: Oficina Nacional de Defensa Pœblica Repœblica Dominicana (SERVICIOS_DATOS - 75.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  45, 'Oficina Nacional de Defensa Pœblica Repœblica Dominicana', 'oficinanacionaldedef.com', 'Public', 'SERVICIOS_DATOS', 0.75, 'Public sector digital platform for citizen services; Public sector platform likely focuses on data services', 'Dominican Republic', 'Dominican Republic', 'Caribbean', 317, 0, '2025-07-17T11:28:41.224Z', 'historical_migration', 0, false, 45, 3.43, 0.75, 'v4.0', '2025-07-17T11:28:41.224Z', false, 1, false
);

-- Company: Pinnacle (ECOSISTEMA_DIGITAL - 95.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  103, 'Pinnacle', 'pinnacle.com', 'Entertainment', 'ECOSISTEMA_DIGITAL', 0.95, 'Digital ecosystem monetizing through platform participation fees; Matrix classification: platform_fees + fully_digital', 'United States', 'United States', 'North America', 897, 0, '2025-07-17T11:28:41.224Z', 'historical_migration', 0, false, 103, 4.24, 0.95, 'v4.0', '2025-07-17T11:28:41.224Z', false, 1, false
);

-- Company: Farmaenlace (COMERCIO_HIBRIDO - 90.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  57, 'Farmaenlace', 'farmaenlace.com', 'Retail', 'COMERCIO_HIBRIDO', 0.9, 'Retail operations span physical stores and digital channels requiring omnichannel security', 'Ecuador', 'Ecuador', 'South America', 6216, 0, '2025-07-17T11:28:41.224Z', 'historical_migration', 0, false, 57, 3.30, 0.9, 'v4.0', '2025-07-17T11:28:41.224Z', false, 1, false
);

-- Company: Ministerio de Educacion Publica Costa Rica (ECOSISTEMA_DIGITAL - 95.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  84, 'Ministerio de Educacion Publica Costa Rica', 'ministeriodeeducacio.com', 'Education', 'ECOSISTEMA_DIGITAL', 0.95, 'Digital ecosystem monetizing through platform participation fees; Matrix classification: platform_fees + hybrid_model', 'Costa Rica', 'Costa Rica', 'Central America', 101807, 0, '2025-07-17T11:28:41.224Z', 'historical_migration', 0, false, 84, 3.38, 0.95, 'v4.0', '2025-07-17T11:28:41.224Z', false, 1, false
);

-- Company: Abank (SERVICIOS_FINANCIEROS - 95.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  1, 'Abank', 'abank.com', 'Financial', 'SERVICIOS_FINANCIEROS', 0.95, 'Banking operations require real-time transaction processing with zero downtime tolerance', 'El Salvador', 'El Salvador', 'Central America', 702, 0, '2025-07-17T11:28:41.224Z', 'historical_migration', 0, false, 1, 3.94, 0.95, 'v4.0', '2025-07-17T11:28:41.224Z', false, 1, false
);

-- Company: Asociacion Cibao de Ahorros y Prestamos (SERVICIOS_FINANCIEROS - 95.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  2, 'Asociacion Cibao de Ahorros y Prestamos', 'asociacioncibaodeaho.com', 'Financial', 'SERVICIOS_FINANCIEROS', 0.95, 'Banking operations require real-time transaction processing with zero downtime tolerance', 'Dominican Republic', 'Dominican Republic', 'Caribbean', 905, 0, '2025-07-17T11:28:41.224Z', 'historical_migration', 0, false, 2, 4.82, 0.95, 'v4.0', '2025-07-17T11:28:41.224Z', false, 1, false
);

-- Company: Asociacion Chilena de Seguridad (INFORMACION_REGULADA - 95.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  3, 'Asociacion Chilena de Seguridad', 'asociacionchilenades.com', 'Healthcare', 'INFORMACION_REGULADA', 0.95, 'Healthcare data requires strict compliance with patient privacy regulations', 'Chile', 'Chile', 'South America', 8264, 0, '2025-07-17T11:28:41.224Z', 'historical_migration', 0, false, 3, 4.31, 0.95, 'v4.0', '2025-07-17T11:28:41.224Z', false, 1, false
);

-- Company: ADIUM (COMERCIO_HIBRIDO - 90.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  4, 'ADIUM', 'adium.com', 'Pharma', 'COMERCIO_HIBRIDO', 0.9, 'Omnichannel retail combining physical and digital sales channels; Matrix classification: product_sales + hybrid_model', 'Uruguay', 'Uruguay', 'South America', 4998, 0, '2025-07-17T11:28:41.225Z', 'historical_migration', 0, false, 4, 3.94, 0.9, 'v4.0', '2025-07-17T11:28:41.225Z', false, 1, false
);

-- Company: Agrex (COMERCIO_HIBRIDO - 90.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  5, 'Agrex', 'agrex.com', 'Industrial', 'COMERCIO_HIBRIDO', 0.9, 'Omnichannel retail combining physical and digital sales channels; Matrix classification: product_sales + hybrid_model', 'Brazil', 'Brazil', 'South America', 737, 0, '2025-07-17T11:28:41.225Z', 'historical_migration', 0, false, 5, 3.26, 0.9, 'v4.0', '2025-07-17T11:28:41.225Z', false, 1, false
);

-- Company: Agrosuper (COMERCIO_HIBRIDO - 90.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  6, 'Agrosuper', 'agrosuper.com', 'Industrial', 'COMERCIO_HIBRIDO', 0.9, 'Retail operations span physical stores and digital channels requiring omnichannel security', 'Chile', 'Chile', 'South America', 4769, 0, '2025-07-17T11:28:41.225Z', 'historical_migration', 0, false, 6, 3.98, 0.9, 'v4.0', '2025-07-17T11:28:41.225Z', false, 1, false
);

-- Company: Aleatica (ECOSISTEMA_DIGITAL - 85.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  7, 'Aleatica', 'aleatica.com', 'Transportation', 'ECOSISTEMA_DIGITAL', 0.85, 'Airlines operate digital booking ecosystems with partners, lounges, and services', 'Mexico', 'Mexico', 'North America', 2302, 0, '2025-07-17T11:28:41.225Z', 'historical_migration', 0, false, 7, 4.67, 0.85, 'v4.0', '2025-07-17T11:28:41.225Z', false, 1, false
);

-- Company: Alimentos Diana (COMERCIO_HIBRIDO - 90.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  8, 'Alimentos Diana', 'alimentosdiana.com', 'Industrial', 'COMERCIO_HIBRIDO', 0.9, 'Omnichannel retail combining physical and digital sales channels; Matrix classification: product_sales + hybrid_model', 'El Salvador', 'El Salvador', 'Central America', 1085, 0, '2025-07-17T11:28:41.225Z', 'historical_migration', 0, false, 8, 3.63, 0.9, 'v4.0', '2025-07-17T11:28:41.225Z', false, 1, false
);

-- Company: Ancine (SERVICIOS_DATOS - 75.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  9, 'Ancine', 'ancine.com', 'Public', 'SERVICIOS_DATOS', 0.75, 'Public sector digital platform for citizen services; Public sector platform likely focuses on data services', 'Brazil', 'Brazil', 'South America', 627, 0, '2025-07-17T11:28:41.225Z', 'historical_migration', 0, false, 9, 3.36, 0.75, 'v4.0', '2025-07-17T11:28:41.225Z', false, 1, false
);

-- Company: Apoyo Integral (SERVICIOS_FINANCIEROS - 95.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  10, 'Apoyo Integral', 'apoyointegral.com', 'Financial', 'SERVICIOS_FINANCIEROS', 0.95, 'Banking operations require real-time transaction processing with zero downtime tolerance', 'Colombia', 'Colombia', 'South America', 541, 0, '2025-07-17T11:28:41.225Z', 'historical_migration', 0, false, 10, 3.49, 0.95, 'v4.0', '2025-07-17T11:28:41.225Z', false, 1, false
);

-- Company: ARCOR (COMERCIO_HIBRIDO - 90.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  11, 'ARCOR', 'arcor.com', 'Industrial', 'COMERCIO_HIBRIDO', 0.9, 'Omnichannel retail combining physical and digital sales channels; Matrix classification: product_sales + hybrid_model', 'Argentina', 'Argentina', 'South America', 11800, 0, '2025-07-17T11:28:41.225Z', 'historical_migration', 0, false, 11, 4.46, 0.9, 'v4.0', '2025-07-17T11:28:41.225Z', false, 1, false
);

-- Company: ARS SENASA (INFORMACION_REGULADA - 95.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  12, 'ARS SENASA', 'arssenasa.com', 'Healthcare', 'INFORMACION_REGULADA', 0.95, 'Healthcare data requires strict compliance with patient privacy regulations', 'Dominican Republic', 'Dominican Republic', 'Caribbean', 1965, 0, '2025-07-17T11:28:41.225Z', 'historical_migration', 0, false, 12, 3.14, 0.95, 'v4.0', '2025-07-17T11:28:41.225Z', false, 1, false
);

-- Company: Aseguradora General (SERVICIOS_FINANCIEROS - 95.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  13, 'Aseguradora General', 'aseguradorageneral.com', 'Financial', 'SERVICIOS_FINANCIEROS', 0.95, 'Banking operations require real-time transaction processing with zero downtime tolerance', 'Guatemala', 'Guatemala', 'Central America', 466, 0, '2025-07-17T11:28:41.225Z', 'historical_migration', 0, false, 13, 3.62, 0.95, 'v4.0', '2025-07-17T11:28:41.225Z', false, 1, false
);

-- Company: Asopagos (SERVICIOS_FINANCIEROS - 95.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  14, 'Asopagos', 'asopagos.com', 'Financial', 'SERVICIOS_FINANCIEROS', 0.95, 'Banking operations require real-time transaction processing with zero downtime tolerance', 'Colombia', 'Colombia', 'South America', 158, 0, '2025-07-17T11:28:41.225Z', 'historical_migration', 0, false, 14, 3.16, 0.95, 'v4.0', '2025-07-17T11:28:41.225Z', false, 1, false
);

-- Company: Administradora de Subsidios Sociales (SERVICIOS_DATOS - 75.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  15, 'Administradora de Subsidios Sociales', 'administradoradesubs.com', 'Public', 'SERVICIOS_DATOS', 0.75, 'Public sector digital platform for citizen services; Public sector platform likely focuses on data services', 'Dominican Republic', 'Dominican Republic', 'Caribbean', 316, 0, '2025-07-17T11:28:41.225Z', 'historical_migration', 0, false, 15, 4.31, 0.75, 'v4.0', '2025-07-17T11:28:41.225Z', false, 1, false
);

-- Company: Banco Aliado (SERVICIOS_FINANCIEROS - 95.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  16, 'Banco Aliado', 'bancoaliado.com', 'Financial', 'SERVICIOS_FINANCIEROS', 0.95, 'Banking operations require real-time transaction processing with zero downtime tolerance', 'Panama', 'Panama', 'Central America', 618, 0, '2025-07-17T11:28:41.225Z', 'historical_migration', 0, false, 16, 4.46, 0.95, 'v4.0', '2025-07-17T11:28:41.225Z', false, 1, false
);

-- Company: Banco Atlantida (SERVICIOS_FINANCIEROS - 95.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  17, 'Banco Atlantida', 'bancoatlantida.com', 'Financial', 'SERVICIOS_FINANCIEROS', 0.95, 'Banking operations require real-time transaction processing with zero downtime tolerance', 'Honduras', 'Honduras', 'Central America', 731, 0, '2025-07-17T11:28:41.226Z', 'historical_migration', 0, false, 17, 4.58, 0.95, 'v4.0', '2025-07-17T11:28:41.226Z', false, 1, false
);

-- Company: Banco Galicia (SERVICIOS_FINANCIEROS - 95.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  18, 'Banco Galicia', 'bancogalicia.com', 'Financial', 'SERVICIOS_FINANCIEROS', 0.95, 'Banking operations require real-time transaction processing with zero downtime tolerance', 'Argentina', 'Argentina', 'South America', 9388, 0, '2025-07-17T11:28:41.226Z', 'historical_migration', 0, false, 18, 4.88, 0.95, 'v4.0', '2025-07-17T11:28:41.226Z', false, 1, false
);

-- Company: Banco Hipotecario (SERVICIOS_FINANCIEROS - 95.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  19, 'Banco Hipotecario', 'bancohipotecario.com', 'Financial', 'SERVICIOS_FINANCIEROS', 0.95, 'Banking operations require real-time transaction processing with zero downtime tolerance', 'Argentina', 'Argentina', 'South America', 2747, 0, '2025-07-17T11:28:41.226Z', 'historical_migration', 0, false, 19, 3.86, 0.95, 'v4.0', '2025-07-17T11:28:41.226Z', false, 1, false
);

-- Company: Banco Mœltiple (SERVICIOS_FINANCIEROS - 95.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  20, 'Banco Mœltiple', 'bancomltiple.com', 'Financial', 'SERVICIOS_FINANCIEROS', 0.95, 'Banking operations require real-time transaction processing with zero downtime tolerance', 'Panama', 'Panama', 'Central America', 7062, 0, '2025-07-17T11:28:41.226Z', 'historical_migration', 0, false, 20, 5.22, 0.95, 'v4.0', '2025-07-17T11:28:41.226Z', false, 1, false
);

-- Company: Banco BCT Costa Rica (SERVICIOS_FINANCIEROS - 95.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  21, 'Banco BCT Costa Rica', 'bancobctcostarica.com', 'Financial', 'SERVICIOS_FINANCIEROS', 0.95, 'Banking operations require real-time transaction processing with zero downtime tolerance', 'Costa Rica', 'Costa Rica', 'Central America', 483, 0, '2025-07-17T11:28:41.226Z', 'historical_migration', 0, false, 21, 5.30, 0.95, 'v4.0', '2025-07-17T11:28:41.226Z', false, 1, false
);

-- Company: Banco BCT Panama (SERVICIOS_FINANCIEROS - 95.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  22, 'Banco BCT Panama', 'bancobctpanama.com', 'Financial', 'SERVICIOS_FINANCIEROS', 0.95, 'Banking operations require real-time transaction processing with zero downtime tolerance', 'Panama', 'Panama', 'Central America', 276, 0, '2025-07-17T11:28:41.226Z', 'historical_migration', 0, false, 22, 4.92, 0.95, 'v4.0', '2025-07-17T11:28:41.226Z', false, 1, false
);

-- Company: Bercomat (COMERCIO_HIBRIDO - 90.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  23, 'Bercomat', 'bercomat.com', 'Retail', 'COMERCIO_HIBRIDO', 0.9, 'Retail operations span physical stores and digital channels requiring omnichannel security', 'Argentina', 'Argentina', 'South America', 1144, 0, '2025-07-17T11:28:41.226Z', 'historical_migration', 0, false, 23, 3.65, 0.9, 'v4.0', '2025-07-17T11:28:41.226Z', false, 1, false
);

-- Company: Banco General Ruminahui (SERVICIOS_FINANCIEROS - 95.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  24, 'Banco General Ruminahui', 'bancogeneralruminahu.com', 'Financial', 'SERVICIOS_FINANCIEROS', 0.95, 'Banking operations require real-time transaction processing with zero downtime tolerance', 'Ecuador', 'Ecuador', 'South America', 907, 0, '2025-07-17T11:28:41.226Z', 'historical_migration', 0, false, 24, 4.82, 0.95, 'v4.0', '2025-07-17T11:28:41.226Z', false, 1, false
);

-- Company: Bioritmo (SOFTWARE_CRITICO - 80.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  25, 'Bioritmo', 'bioritmo.com', 'Services', 'SOFTWARE_CRITICO', 0.8, 'Software service with some physical touchpoints but primarily digital delivery; Matrix classification: recurring_subscriptions + hybrid_model', 'Brazil', 'Brazil', 'South America', 15360, 0, '2025-07-17T11:28:41.226Z', 'historical_migration', 0, false, 25, 3.83, 0.8, 'v4.0', '2025-07-17T11:28:41.226Z', false, 1, false
);

-- Company: Bolsa Nacional de Valores (SERVICIOS_FINANCIEROS - 95.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  26, 'Bolsa Nacional de Valores', 'bolsanacionaldevalor.com', 'Financial', 'SERVICIOS_FINANCIEROS', 0.95, 'Banking operations require real-time transaction processing with zero downtime tolerance', 'Costa Rica', 'Costa Rica', 'Central America', 123, 0, '2025-07-17T11:28:41.226Z', 'historical_migration', 0, false, 26, 5.00, 0.95, 'v4.0', '2025-07-17T11:28:41.226Z', false, 1, false
);

-- Company: Banco Tierra del Fuego (SERVICIOS_FINANCIEROS - 95.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  27, 'Banco Tierra del Fuego', 'bancotierradelfuego.com', 'Financial', 'SERVICIOS_FINANCIEROS', 0.95, 'Banking operations require real-time transaction processing with zero downtime tolerance', 'Argentina', 'Argentina', 'South America', 425, 0, '2025-07-17T11:28:41.226Z', 'historical_migration', 0, false, 27, 4.50, 0.95, 'v4.0', '2025-07-17T11:28:41.226Z', false, 1, false
);

-- Company: Municipio de Caguas (SERVICIOS_DATOS - 75.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  28, 'Municipio de Caguas', 'municipiodecaguas.com', 'Public', 'SERVICIOS_DATOS', 0.75, 'Public sector digital platform for citizen services; Public sector platform likely focuses on data services', 'Puerto Rico', 'Puerto Rico', 'Caribbean', 843, 0, '2025-07-17T11:28:41.226Z', 'historical_migration', 0, false, 28, 4.40, 0.75, 'v4.0', '2025-07-17T11:28:41.226Z', false, 1, false
);

-- Company: Caja de Valores (SERVICIOS_FINANCIEROS - 95.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  29, 'Caja de Valores', 'cajadevalores.com', 'Financial', 'SERVICIOS_FINANCIEROS', 0.95, 'Banking operations require real-time transaction processing with zero downtime tolerance', 'Argentina', 'Argentina', 'South America', 876, 0, '2025-07-17T11:28:41.226Z', 'historical_migration', 0, false, 29, 5.17, 0.95, 'v4.0', '2025-07-17T11:28:41.226Z', false, 1, false
);

-- Company: Compa–’a de Acero del Pac’fico (COMERCIO_HIBRIDO - 90.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  30, 'Compa–’a de Acero del Pac’fico', 'compaadeacerodelpacf.com', 'Industrial', 'COMERCIO_HIBRIDO', 0.9, 'Omnichannel retail combining physical and digital sales channels; Matrix classification: product_sales + hybrid_model', 'Chile', 'Chile', 'South America', 252, 0, '2025-07-17T11:28:41.226Z', 'historical_migration', 0, false, 30, 3.52, 0.9, 'v4.0', '2025-07-17T11:28:41.226Z', false, 1, false
);

-- Company: CAPEX (INFRAESTRUCTURA_HEREDADA - 85.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  31, 'CAPEX', 'capex.com', 'Energy', 'INFRAESTRUCTURA_HEREDADA', 0.85, 'Energy and utilities operate critical legacy infrastructure', 'Argentina', 'Argentina', 'South America', 736, 0, '2025-07-17T11:28:41.227Z', 'historical_migration', 0, false, 31, 4.43, 0.85, 'v4.0', '2025-07-17T11:28:41.227Z', false, 1, false
);

-- Company: Carozzi (COMERCIO_HIBRIDO - 90.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  32, 'Carozzi', 'carozzi.com', 'Industrial', 'COMERCIO_HIBRIDO', 0.9, 'Omnichannel retail combining physical and digital sales channels; Matrix classification: product_sales + hybrid_model', 'Chile', 'Chile', 'South America', 3571, 0, '2025-07-17T11:28:41.227Z', 'historical_migration', 0, false, 32, 4.34, 0.9, 'v4.0', '2025-07-17T11:28:41.227Z', false, 1, false
);

-- Company: Casa Toro (COMERCIO_HIBRIDO - 90.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  33, 'Casa Toro', 'casatoro.com', 'Retail', 'COMERCIO_HIBRIDO', 0.9, 'Retail operations span physical stores and digital channels requiring omnichannel security', 'Colombia', 'Colombia', 'South America', 1856, 0, '2025-07-17T11:28:41.227Z', 'historical_migration', 0, false, 33, 3.60, 0.9, 'v4.0', '2025-07-17T11:28:41.227Z', false, 1, false
);

-- Company: Cepel (INFRAESTRUCTURA_HEREDADA - 85.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  34, 'Cepel', 'cepel.com', 'Energy', 'INFRAESTRUCTURA_HEREDADA', 0.85, 'Energy and utilities operate critical legacy infrastructure', 'Brazil', 'Brazil', 'South America', 524, 0, '2025-07-17T11:28:41.227Z', 'historical_migration', 0, false, 34, 3.93, 0.85, 'v4.0', '2025-07-17T11:28:41.227Z', false, 1, false
);

-- Company: Clinica Biblica (INFORMACION_REGULADA - 95.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  37, 'Clinica Biblica', 'clinicabiblica.com', 'Healthcare', 'INFORMACION_REGULADA', 0.95, 'Healthcare data requires strict compliance with patient privacy regulations', 'Costa Rica', 'Costa Rica', 'Central America', 1936, 0, '2025-07-17T11:28:41.227Z', 'historical_migration', 0, false, 37, 3.43, 0.95, 'v4.0', '2025-07-17T11:28:41.227Z', false, 1, false
);

-- Company: Construmart (COMERCIO_HIBRIDO - 90.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  40, 'Construmart', 'construmart.com', 'Retail', 'COMERCIO_HIBRIDO', 0.9, 'Retail operations span physical stores and digital channels requiring omnichannel security', 'Chile', 'Chile', 'South America', 829, 0, '2025-07-17T11:28:41.227Z', 'historical_migration', 0, false, 40, 2.29, 0.9, 'v4.0', '2025-07-17T11:28:41.227Z', false, 1, false
);

-- Company: Coopcentral (SERVICIOS_FINANCIEROS - 95.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  41, 'Coopcentral', 'coopcentral.com', 'Financial', 'SERVICIOS_FINANCIEROS', 0.95, 'Banking operations require real-time transaction processing with zero downtime tolerance', 'Colombia', 'Colombia', 'South America', 705, 0, '2025-07-17T11:28:41.227Z', 'historical_migration', 0, false, 41, 4.01, 0.95, 'v4.0', '2025-07-17T11:28:41.227Z', false, 1, false
);

-- Company: Correos de Costa Rica (SERVICIOS_DATOS - 75.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  42, 'Correos de Costa Rica', 'correosdecostarica.com', 'Public', 'SERVICIOS_DATOS', 0.75, 'Public sector digital platform for citizen services; Public sector platform likely focuses on data services', 'Costa Rica', 'Costa Rica', 'Central America', 892, 0, '2025-07-17T11:28:41.227Z', 'historical_migration', 0, false, 42, 3.87, 0.75, 'v4.0', '2025-07-17T11:28:41.227Z', false, 1, false
);

-- Company: Cuestamoras (COMERCIO_HIBRIDO - 90.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  43, 'Cuestamoras', 'cuestamoras.com', 'Industrial', 'COMERCIO_HIBRIDO', 0.9, 'Omnichannel retail combining physical and digital sales channels; Matrix classification: product_sales + hybrid_model', 'Costa Rica', 'Costa Rica', 'Central America', 142, 0, '2025-07-17T11:28:41.227Z', 'historical_migration', 0, false, 43, 4.18, 0.9, 'v4.0', '2025-07-17T11:28:41.227Z', false, 1, false
);

-- Company: Cuestamoras Salud (COMERCIO_HIBRIDO - 90.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  44, 'Cuestamoras Salud', 'cuestamorassalud.com', 'Retail', 'COMERCIO_HIBRIDO', 0.9, 'Retail operations span physical stores and digital channels requiring omnichannel security', 'Costa Rica', 'Costa Rica', 'Central America', 1279, 0, '2025-07-17T11:28:41.227Z', 'historical_migration', 0, false, 44, 3.48, 0.9, 'v4.0', '2025-07-17T11:28:41.227Z', false, 1, false
);

-- Company: Defensoria Penal Publica (SERVICIOS_DATOS - 75.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  46, 'Defensoria Penal Publica', 'defensoriapenalpubli.com', 'Public', 'SERVICIOS_DATOS', 0.75, 'Public sector digital platform for citizen services; Public sector platform likely focuses on data services', 'Chile', 'Chile', 'South America', 2242, 0, '2025-07-17T11:28:41.227Z', 'historical_migration', 0, false, 46, 3.60, 0.75, 'v4.0', '2025-07-17T11:28:41.227Z', false, 1, false
);

-- Company: Derco (COMERCIO_HIBRIDO - 90.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  47, 'Derco', 'derco.com', 'Retail', 'COMERCIO_HIBRIDO', 0.9, 'Retail operations span physical stores and digital channels requiring omnichannel security', 'Chile', 'Chile', 'South America', 5629, 0, '2025-07-17T11:28:41.227Z', 'historical_migration', 0, false, 47, 3.82, 0.9, 'v4.0', '2025-07-17T11:28:41.227Z', false, 1, false
);

-- Company: Dichter & Neira (SOFTWARE_CRITICO - 80.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  48, 'Dichter & Neira', 'dichterneira.com', 'Services', 'SOFTWARE_CRITICO', 0.8, 'Software service with some physical touchpoints but primarily digital delivery; Matrix classification: recurring_subscriptions + hybrid_model', 'Costa Rica', 'Costa Rica', 'Central America', 583, 0, '2025-07-17T11:28:41.227Z', 'historical_migration', 0, false, 48, 3.05, 0.8, 'v4.0', '2025-07-17T11:28:41.227Z', false, 1, false
);

-- Company: Diners Club (SERVICIOS_FINANCIEROS - 95.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  49, 'Diners Club', 'dinersclub.com', 'Financial', 'SERVICIOS_FINANCIEROS', 0.95, 'Banking operations require real-time transaction processing with zero downtime tolerance', 'Ecuador', 'Ecuador', 'South America', 1826, 0, '2025-07-17T11:28:41.227Z', 'historical_migration', 0, false, 49, 5.08, 0.95, 'v4.0', '2025-07-17T11:28:41.227Z', false, 1, false
);

-- Company: Distriluz (INFRAESTRUCTURA_HEREDADA - 85.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  50, 'Distriluz', 'distriluz.com', 'Energy', 'INFRAESTRUCTURA_HEREDADA', 0.85, 'Energy and utilities operate critical legacy infrastructure', 'Peru', 'Peru', 'South America', 3312, 0, '2025-07-17T11:28:41.228Z', 'historical_migration', 0, false, 50, 3.75, 0.85, 'v4.0', '2025-07-17T11:28:41.228Z', false, 1, false
);

-- Company: DUOC (ECOSISTEMA_DIGITAL - 95.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  51, 'DUOC', 'duoc.com', 'Education', 'ECOSISTEMA_DIGITAL', 0.95, 'Digital ecosystem monetizing through platform participation fees; Matrix classification: platform_fees + hybrid_model', 'Chile', 'Chile', 'South America', 6661, 0, '2025-07-17T11:28:41.228Z', 'historical_migration', 0, false, 51, 3.44, 0.95, 'v4.0', '2025-07-17T11:28:41.228Z', false, 1, false
);

-- Company: Edenor (INFRAESTRUCTURA_HEREDADA - 85.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  52, 'Edenor', 'edenor.com', 'Energy', 'INFRAESTRUCTURA_HEREDADA', 0.85, 'Energy and utilities operate critical legacy infrastructure', 'Argentina', 'Argentina', 'South America', 6187, 0, '2025-07-17T11:28:41.228Z', 'historical_migration', 0, false, 52, 4.39, 0.85, 'v4.0', '2025-07-17T11:28:41.228Z', false, 1, false
);

-- Company: Edenorte (INFRAESTRUCTURA_HEREDADA - 85.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  53, 'Edenorte', 'edenorte.com', 'Energy', 'INFRAESTRUCTURA_HEREDADA', 0.85, 'Energy and utilities operate critical legacy infrastructure', 'Dominican Republic', 'Dominican Republic', 'Caribbean', 2038, 0, '2025-07-17T11:28:41.228Z', 'historical_migration', 0, false, 53, 4.14, 0.85, 'v4.0', '2025-07-17T11:28:41.228Z', false, 1, false
);

-- Company: EGEHAINA (INFRAESTRUCTURA_HEREDADA - 85.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  54, 'EGEHAINA', 'egehaina.com', 'Energy', 'INFRAESTRUCTURA_HEREDADA', 0.85, 'Energy and utilities operate critical legacy infrastructure', 'Dominican Republic', 'Dominican Republic', 'Caribbean', 454, 0, '2025-07-17T11:28:41.228Z', 'historical_migration', 0, false, 54, 5.54, 0.85, 'v4.0', '2025-07-17T11:28:41.228Z', false, 1, false
);

-- Company: EGEHID (SERVICIOS_DATOS - 75.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  55, 'EGEHID', 'egehid.com', 'Public', 'SERVICIOS_DATOS', 0.75, 'Public sector digital platform for citizen services; Public sector platform likely focuses on data services', 'Dominican Republic', 'Dominican Republic', 'Caribbean', 751, 0, '2025-07-17T11:28:41.228Z', 'historical_migration', 0, false, 55, 3.28, 0.75, 'v4.0', '2025-07-17T11:28:41.228Z', false, 1, false
);

-- Company: Elcatex (COMERCIO_HIBRIDO - 90.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  56, 'Elcatex', 'elcatex.com', 'Industrial', 'COMERCIO_HIBRIDO', 0.9, 'Omnichannel retail combining physical and digital sales channels; Matrix classification: product_sales + hybrid_model', 'Honduras', 'Honduras', 'Central America', 1611, 0, '2025-07-17T11:28:41.228Z', 'historical_migration', 0, false, 56, 4.22, 0.9, 'v4.0', '2025-07-17T11:28:41.228Z', false, 1, false
);

-- Company: Galaxy (ECOSISTEMA_DIGITAL - 95.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  59, 'Galaxy', 'galaxy.com', 'Entertainment', 'ECOSISTEMA_DIGITAL', 0.95, 'Digital ecosystem monetizing through platform participation fees; Matrix classification: platform_fees + fully_digital', 'Venezuela', 'Venezuela', 'South America', 162, 0, '2025-07-17T11:28:41.228Z', 'historical_migration', 0, false, 59, 3.72, 0.95, 'v4.0', '2025-07-17T11:28:41.228Z', false, 1, false
);

-- Company: Garantizar (SERVICIOS_FINANCIEROS - 95.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  60, 'Garantizar', 'garantizar.com', 'Financial', 'SERVICIOS_FINANCIEROS', 0.95, 'Banking operations require real-time transaction processing with zero downtime tolerance', 'Argentina', 'Argentina', 'South America', 449, 0, '2025-07-17T11:28:41.228Z', 'historical_migration', 0, false, 60, 4.01, 0.95, 'v4.0', '2025-07-17T11:28:41.228Z', false, 1, false
);

-- Company: Gloria (COMERCIO_HIBRIDO - 90.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  61, 'Gloria', 'gloria.com', 'Industrial', 'COMERCIO_HIBRIDO', 0.9, 'Omnichannel retail combining physical and digital sales channels; Matrix classification: product_sales + hybrid_model', 'Peru', 'Peru', 'South America', 7325, 0, '2025-07-17T11:28:41.228Z', 'historical_migration', 0, false, 61, 3.98, 0.9, 'v4.0', '2025-07-17T11:28:41.228Z', false, 1, false
);

-- Company: Grupo Corripio (COMERCIO_HIBRIDO - 90.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  63, 'Grupo Corripio', 'grupocorripio.com', 'Retail', 'COMERCIO_HIBRIDO', 0.9, 'Retail operations span physical stores and digital channels requiring omnichannel security', 'Dominican Republic', 'Dominican Republic', 'Caribbean', 2341, 0, '2025-07-17T11:28:41.228Z', 'historical_migration', 0, false, 63, 3.82, 0.9, 'v4.0', '2025-07-17T11:28:41.228Z', false, 1, false
);

-- Company: Grupo Diesco (COMERCIO_HIBRIDO - 90.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  64, 'Grupo Diesco', 'grupodiesco.com', 'Industrial', 'COMERCIO_HIBRIDO', 0.9, 'Omnichannel retail combining physical and digital sales channels; Matrix classification: product_sales + hybrid_model', 'Dominican Republic', 'Dominican Republic', 'Caribbean', 380, 0, '2025-07-17T11:28:41.228Z', 'historical_migration', 0, false, 64, 3.52, 0.9, 'v4.0', '2025-07-17T11:28:41.228Z', false, 1, false
);

-- Company: Grupo Express (ECOSISTEMA_DIGITAL - 85.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  65, 'Grupo Express', 'grupoexpress.com', 'Transportation', 'ECOSISTEMA_DIGITAL', 0.85, 'Airlines operate digital booking ecosystems with partners, lounges, and services', 'Colombia', 'Colombia', 'South America', 1487, 0, '2025-07-17T11:28:41.228Z', 'historical_migration', 0, false, 65, 3.28, 0.85, 'v4.0', '2025-07-17T11:28:41.228Z', false, 1, false
);

-- Company: Grupo Jacto (COMERCIO_HIBRIDO - 90.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  66, 'Grupo Jacto', 'grupojacto.com', 'Industrial', 'COMERCIO_HIBRIDO', 0.9, 'Omnichannel retail combining physical and digital sales channels; Matrix classification: product_sales + hybrid_model', 'Brazil', 'Brazil', 'South America', 1847, 0, '2025-07-17T11:28:41.228Z', 'historical_migration', 0, false, 66, 3.68, 0.9, 'v4.0', '2025-07-17T11:28:41.228Z', false, 1, false
);

-- Company: Grupo Purdy (COMERCIO_HIBRIDO - 90.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  67, 'Grupo Purdy', 'grupopurdy.com', 'Industrial', 'COMERCIO_HIBRIDO', 0.9, 'Omnichannel retail combining physical and digital sales channels; Matrix classification: product_sales + hybrid_model', 'Costa Rica', 'Costa Rica', 'Central America', 1275, 0, '2025-07-17T11:28:41.228Z', 'historical_migration', 0, false, 67, 3.40, 0.9, 'v4.0', '2025-07-17T11:28:41.228Z', false, 1, false
);

-- Company: GT Transmeridian (SOFTWARE_CRITICO - 80.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  70, 'GT Transmeridian', 'gttransmeridian.com', 'Services', 'SOFTWARE_CRITICO', 0.8, 'Software service with some physical touchpoints but primarily digital delivery; Matrix classification: recurring_subscriptions + hybrid_model', 'Peru', 'Peru', 'South America', 673, 0, '2025-07-17T11:28:41.228Z', 'historical_migration', 0, false, 70, 3.10, 0.8, 'v4.0', '2025-07-17T11:28:41.228Z', false, 1, false
);

-- Company: Municipio de Guaynabo (SERVICIOS_DATOS - 75.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  71, 'Municipio de Guaynabo', 'municipiodeguaynabo.com', 'Public', 'SERVICIOS_DATOS', 0.75, 'Public sector digital platform for citizen services; Public sector platform likely focuses on data services', 'Puerto Rico', 'Puerto Rico', 'Caribbean', 881, 0, '2025-07-17T11:28:41.229Z', 'historical_migration', 0, false, 71, 3.32, 0.75, 'v4.0', '2025-07-17T11:28:41.229Z', false, 1, false
);

-- Company: Hospital General de la Plaza de la Salud (INFORMACION_REGULADA - 95.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  73, 'Hospital General de la Plaza de la Salud', 'hospitalgeneraldelap.com', 'Healthcare', 'INFORMACION_REGULADA', 0.95, 'Healthcare data requires strict compliance with patient privacy regulations', 'Dominican Republic', 'Dominican Republic', 'Caribbean', 1990, 0, '2025-07-17T11:28:41.229Z', 'historical_migration', 0, false, 73, 3.72, 0.95, 'v4.0', '2025-07-17T11:28:41.229Z', false, 1, false
);

-- Company: INMO Grupo Gibraltar (COMERCIO_HIBRIDO - 90.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  74, 'INMO Grupo Gibraltar', 'inmogrupogibraltar.com', 'Industrial', 'COMERCIO_HIBRIDO', 0.9, 'Omnichannel retail combining physical and digital sales channels; Matrix classification: product_sales + hybrid_model', 'Panama', 'Panama', 'Central America', 873, 0, '2025-07-17T11:28:41.229Z', 'historical_migration', 0, false, 74, 3.80, 0.9, 'v4.0', '2025-07-17T11:28:41.229Z', false, 1, false
);

-- Company: ISA (INFRAESTRUCTURA_HEREDADA - 85.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  75, 'ISA', 'isa.com', 'Energy', 'INFRAESTRUCTURA_HEREDADA', 0.85, 'Energy and utilities operate critical legacy infrastructure', 'Colombia', 'Colombia', 'South America', 1808, 0, '2025-07-17T11:28:41.229Z', 'historical_migration', 0, false, 75, 4.94, 0.85, 'v4.0', '2025-07-17T11:28:41.229Z', false, 1, false
);

-- Company: It Regency (COMERCIO_HIBRIDO - 90.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  76, 'It Regency', 'itregency.com', 'Retail', 'COMERCIO_HIBRIDO', 0.9, 'Retail operations span physical stores and digital channels requiring omnichannel security', 'Panama', 'Panama', 'Central America', 989, 0, '2025-07-17T11:28:41.229Z', 'historical_migration', 0, false, 76, 3.67, 0.9, 'v4.0', '2025-07-17T11:28:41.229Z', false, 1, false
);

-- Company: Information Technology and Suport CR (SOFTWARE_CRITICO - 90.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  77, 'Information Technology and Suport CR', 'informationtechnolog.com', 'Technology', 'SOFTWARE_CRITICO', 0.9, 'Software platforms require 24/7 availability with customer data protection', 'Costa Rica', 'Costa Rica', 'Central America', 281, 0, '2025-07-17T11:28:41.229Z', 'historical_migration', 0, false, 77, 3.54, 0.9, 'v4.0', '2025-07-17T11:28:41.229Z', false, 1, false
);

-- Company: Lima Airport Partners (ECOSISTEMA_DIGITAL - 85.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  78, 'Lima Airport Partners', 'limaairportpartners.com', 'Transportation', 'ECOSISTEMA_DIGITAL', 0.85, 'Airlines operate digital booking ecosystems with partners, lounges, and services', 'Peru', 'Peru', 'South America', 1017, 0, '2025-07-17T11:28:41.229Z', 'historical_migration', 0, false, 78, 3.87, 0.85, 'v4.0', '2025-07-17T11:28:41.229Z', false, 1, false
);

-- Company: Municipalidad Las Condes (SERVICIOS_DATOS - 75.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  79, 'Municipalidad Las Condes', 'municipalidadlascond.com', 'Public', 'SERVICIOS_DATOS', 0.75, 'Public sector digital platform for citizen services; Public sector platform likely focuses on data services', 'Chile', 'Chile', 'South America', 1788, 0, '2025-07-17T11:28:41.229Z', 'historical_migration', 0, false, 79, 3.40, 0.75, 'v4.0', '2025-07-17T11:28:41.229Z', false, 1, false
);

-- Company: Megalabs (INFRAESTRUCTURA_HEREDADA - 80.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  82, 'Megalabs', 'megalabs.com', 'Pharma', 'INFRAESTRUCTURA_HEREDADA', 0.8, 'Physical product distribution requiring supply chain coordination; Matrix classification: product_sales + physical_critical; Large manufacturer (6602 employees) likely has legacy infrastructure', 'Uruguay', 'Uruguay', 'South America', 6602, 0, '2025-07-17T11:28:41.229Z', 'historical_migration', 0, false, 82, 3.54, 0.8, 'v4.0', '2025-07-17T11:28:41.229Z', false, 1, false
);

-- Company: Ministerio de Energia y Minas Republica Dominicana (SERVICIOS_DATOS - 75.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  83, 'Ministerio de Energia y Minas Republica Dominicana', 'ministeriodeenergiay.com', 'Public', 'SERVICIOS_DATOS', 0.75, 'Public sector digital platform for citizen services; Public sector platform likely focuses on data services', 'Dominican Republic', 'Dominican Republic', 'Caribbean', 382, 0, '2025-07-17T11:28:41.229Z', 'historical_migration', 0, false, 83, 3.50, 0.75, 'v4.0', '2025-07-17T11:28:41.229Z', false, 1, false
);

-- Company: Mercasid (COMERCIO_HIBRIDO - 90.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  85, 'Mercasid', 'mercasid.com', 'Industrial', 'COMERCIO_HIBRIDO', 0.9, 'Omnichannel retail combining physical and digital sales channels; Matrix classification: product_sales + hybrid_model', 'Dominican Republic', 'Dominican Republic', 'Caribbean', 1290, 0, '2025-07-17T11:28:41.229Z', 'historical_migration', 0, false, 85, 3.67, 0.9, 'v4.0', '2025-07-17T11:28:41.229Z', false, 1, false
);

-- Company: Ministerio de Agricultura (SERVICIOS_DATOS - 75.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  86, 'Ministerio de Agricultura', 'ministeriodeagricult.com', 'Public', 'SERVICIOS_DATOS', 0.75, 'Public sector digital platform for citizen services; Public sector platform likely focuses on data services', 'Colombia', 'Colombia', 'South America', 657, 0, '2025-07-17T11:28:41.229Z', 'historical_migration', 0, false, 86, 3.72, 0.75, 'v4.0', '2025-07-17T11:28:41.229Z', false, 1, false
);

-- Company: Ministerio de Interior y Polic’a Republica Dominicana (SERVICIOS_DATOS - 75.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  87, 'Ministerio de Interior y Polic’a Republica Dominicana', 'ministeriodeinterior.com', 'Public', 'SERVICIOS_DATOS', 0.75, 'Public sector digital platform for citizen services; Public sector platform likely focuses on data services', 'Dominican Republic', 'Dominican Republic', 'Caribbean', 611, 0, '2025-07-17T11:28:41.229Z', 'historical_migration', 0, false, 87, 3.21, 0.75, 'v4.0', '2025-07-17T11:28:41.229Z', false, 1, false
);

-- Company: MINSA Costa Rica (SERVICIOS_DATOS - 75.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  88, 'MINSA Costa Rica', 'minsacostarica.com', 'Public', 'SERVICIOS_DATOS', 0.75, 'Public sector digital platform for citizen services; Public sector platform likely focuses on data services', 'Costa Rica', 'Costa Rica', 'Central America', 2385, 0, '2025-07-17T11:28:41.229Z', 'historical_migration', 0, false, 88, 3.80, 0.75, 'v4.0', '2025-07-17T11:28:41.229Z', false, 1, false
);

-- Company: MINTIC Colombia (SERVICIOS_DATOS - 60.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  89, 'MINTIC Colombia', 'minticcolombia.com', 'Public', 'SERVICIOS_DATOS', 0.6000000000000001, 'Public sector digital platform for citizen services; Public sector platform likely focuses on data services; Low confidence in original classification', 'Colombia', 'Colombia', 'South America', 1455, 0, '2025-07-17T11:28:41.229Z', 'historical_migration', 0, false, 89, 3.72, 0.6000000000000001, 'v4.0', '2025-07-17T11:28:41.229Z', true, 1, false
);

-- Company: MINVIVIENDA Colombia (SERVICIOS_DATOS - 60.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  90, 'MINVIVIENDA Colombia', 'minviviendacolombia.com', 'Public', 'SERVICIOS_DATOS', 0.6000000000000001, 'Public sector digital platform for citizen services; Public sector platform likely focuses on data services; Low confidence in original classification', 'Colombia', 'Colombia', 'South America', 1257, 0, '2025-07-17T11:28:41.229Z', 'historical_migration', 0, false, 90, 3.64, 0.6000000000000001, 'v4.0', '2025-07-17T11:28:41.229Z', true, 1, false
);

-- Company: Multinational Life Insurance (SERVICIOS_FINANCIEROS - 95.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  91, 'Multinational Life Insurance', 'multinationallifeins.com', 'Financial', 'SERVICIOS_FINANCIEROS', 0.95, 'Banking operations require real-time transaction processing with zero downtime tolerance', 'Puerto Rico', 'Puerto Rico', 'Caribbean', 643, 0, '2025-07-17T11:28:41.229Z', 'historical_migration', 0, false, 91, 3.89, 0.95, 'v4.0', '2025-07-17T11:28:41.229Z', false, 1, false
);

-- Company: Ministerio de Obras Publicas y Comunicaciones Paraguay (SERVICIOS_DATOS - 60.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  92, 'Ministerio de Obras Publicas y Comunicaciones Paraguay', 'ministeriodeobraspub.com', 'Public', 'SERVICIOS_DATOS', 0.6000000000000001, 'Public sector digital platform for citizen services; Public sector platform likely focuses on data services; Low confidence in original classification', 'Paraguay', 'Paraguay', 'South America', 1498, 0, '2025-07-17T11:28:41.230Z', 'historical_migration', 0, false, 92, 3.55, 0.6000000000000001, 'v4.0', '2025-07-17T11:28:41.230Z', true, 1, false
);

-- Company: Ministerio de Transportes y Comunicaciones Peru (SERVICIOS_DATOS - 60.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  93, 'Ministerio de Transportes y Comunicaciones Peru', 'ministeriodetranspor.com', 'Public', 'SERVICIOS_DATOS', 0.6000000000000001, 'Public sector digital platform for citizen services; Public sector platform likely focuses on data services; Low confidence in original classification', 'Peru', 'Peru', 'South America', 2500, 0, '2025-07-17T11:28:41.230Z', 'historical_migration', 0, false, 93, 3.50, 0.6000000000000001, 'v4.0', '2025-07-17T11:28:41.230Z', true, 1, false
);

-- Company: Multiquimica (COMERCIO_HIBRIDO - 72.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  94, 'Multiquimica', 'multiquimica.com', 'Industrial', 'COMERCIO_HIBRIDO', 0.7200000000000001, 'Omnichannel retail combining physical and digital sales channels; Matrix classification: product_sales + hybrid_model; Low confidence in original classification', 'Dominican Republic', 'Dominican Republic', 'Caribbean', 275, 0, '2025-07-17T11:28:41.230Z', 'historical_migration', 0, false, 94, 3.24, 0.7200000000000001, 'v4.0', '2025-07-17T11:28:41.230Z', false, 1, false
);

-- Company: Novacero (COMERCIO_HIBRIDO - 72.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  95, 'Novacero', 'novacero.com', 'Industrial', 'COMERCIO_HIBRIDO', 0.7200000000000001, 'Omnichannel retail combining physical and digital sales channels; Matrix classification: product_sales + hybrid_model; Low confidence in original classification', 'Ecuador', 'Ecuador', 'South America', 692, 0, '2025-07-17T11:28:41.230Z', 'historical_migration', 0, false, 95, 3.39, 0.7200000000000001, 'v4.0', '2025-07-17T11:28:41.230Z', false, 1, false
);

-- Company: Numar (COMERCIO_HIBRIDO - 72.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  96, 'Numar', 'numar.com', 'Industrial', 'COMERCIO_HIBRIDO', 0.7200000000000001, 'Omnichannel retail combining physical and digital sales channels; Matrix classification: product_sales + hybrid_model; Low confidence in original classification', 'Costa Rica', 'Costa Rica', 'Central America', 1147, 0, '2025-07-17T11:28:41.230Z', 'historical_migration', 0, false, 96, 3.35, 0.7200000000000001, 'v4.0', '2025-07-17T11:28:41.230Z', false, 1, false
);

-- Company: OGTIC Republica Dominicana (SERVICIOS_DATOS - 60.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  97, 'OGTIC Republica Dominicana', 'ogticrepublicadomini.com', 'Public', 'SERVICIOS_DATOS', 0.6000000000000001, 'Public sector digital platform for citizen services; Public sector platform likely focuses on data services; Low confidence in original classification', 'Dominican Republic', 'Dominican Republic', 'Caribbean', 480, 0, '2025-07-17T11:28:41.230Z', 'historical_migration', 0, false, 97, 4.54, 0.6000000000000001, 'v4.0', '2025-07-17T11:28:41.230Z', true, 1, false
);

-- Company: Oldelval (INFRAESTRUCTURA_HEREDADA - 68.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  98, 'Oldelval', 'oldelval.com', 'Energy', 'INFRAESTRUCTURA_HEREDADA', 0.68, 'Energy and utilities operate critical legacy infrastructure; Low confidence in original classification', 'Argentina', 'Argentina', 'South America', 345, 0, '2025-07-17T11:28:41.230Z', 'historical_migration', 0, false, 98, 4.13, 0.68, 'v4.0', '2025-07-17T11:28:41.230Z', true, 1, false
);

-- Company: Onyx (COMERCIO_HIBRIDO - 72.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  99, 'Onyx', 'onyx.com', 'Industrial', 'COMERCIO_HIBRIDO', 0.7200000000000001, 'Omnichannel retail combining physical and digital sales channels; Matrix classification: product_sales + hybrid_model; Low confidence in original classification', 'Guatemala', 'Guatemala', 'Central America', 823, 0, '2025-07-17T11:28:41.230Z', 'historical_migration', 0, false, 99, 3.98, 0.7200000000000001, 'v4.0', '2025-07-17T11:28:41.230Z', false, 1, false
);

-- Company: Orizon (INFORMACION_REGULADA - 76.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  100, 'Orizon', 'orizon.com', 'Healthcare', 'INFORMACION_REGULADA', 0.76, 'Healthcare data requires strict compliance with patient privacy regulations; Low confidence in original classification', 'Brazil', 'Brazil', 'South America', 1930, 0, '2025-07-17T11:28:41.230Z', 'historical_migration', 0, false, 100, 4.14, 0.76, 'v4.0', '2025-07-17T11:28:41.230Z', false, 1, false
);

-- Company: Pampa Energ’a (INFRAESTRUCTURA_HEREDADA - 68.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  101, 'Pampa Energ’a', 'pampaenerga.com', 'Energy', 'INFRAESTRUCTURA_HEREDADA', 0.68, 'Energy and utilities operate critical legacy infrastructure; Low confidence in original classification', 'Argentina', 'Argentina', 'South America', 3125, 0, '2025-07-17T11:28:41.230Z', 'historical_migration', 0, false, 101, 4.63, 0.68, 'v4.0', '2025-07-17T11:28:41.230Z', true, 1, false
);

-- Company: PetroPeru (INFRAESTRUCTURA_HEREDADA - 68.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  102, 'PetroPeru', 'petroperu.com', 'Energy', 'INFRAESTRUCTURA_HEREDADA', 0.68, 'Energy and utilities operate critical legacy infrastructure; Low confidence in original classification', 'Peru', 'Peru', 'South America', 2916, 0, '2025-07-17T11:28:41.230Z', 'historical_migration', 0, false, 102, 4.54, 0.68, 'v4.0', '2025-07-17T11:28:41.230Z', true, 1, false
);

-- Company: Plaenge (ECOSISTEMA_DIGITAL - 76.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  104, 'Plaenge', 'plaenge.com', 'Industrial', 'ECOSISTEMA_DIGITAL', 0.76, 'Digital ecosystem monetizing through platform participation fees; Matrix classification: platform_fees + hybrid_model; Low confidence in original classification', 'Brazil', 'Brazil', 'South America', 2027, 0, '2025-07-17T11:28:41.230Z', 'historical_migration', 0, false, 104, 5.31, 0.76, 'v4.0', '2025-07-17T11:28:41.230Z', false, 1, false
);

-- Company: Procaps (COMERCIO_HIBRIDO - 72.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  105, 'Procaps', 'procaps.com', 'Pharma', 'COMERCIO_HIBRIDO', 0.7200000000000001, 'Omnichannel retail combining physical and digital sales channels; Matrix classification: product_sales + hybrid_model; Low confidence in original classification', 'Colombia', 'Colombia', 'South America', 3363, 0, '2025-07-17T11:28:41.230Z', 'historical_migration', 0, false, 105, 4.18, 0.7200000000000001, 'v4.0', '2025-07-17T11:28:41.230Z', false, 1, false
);

-- Company: Procolombia (SERVICIOS_DATOS - 60.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  106, 'Procolombia', 'procolombia.com', 'Public', 'SERVICIOS_DATOS', 0.6000000000000001, 'Public sector digital platform for citizen services; Public sector platform likely focuses on data services; Low confidence in original classification', 'Colombia', 'Colombia', 'South America', 626, 0, '2025-07-17T11:28:41.230Z', 'historical_migration', 0, false, 106, 3.83, 0.6000000000000001, 'v4.0', '2025-07-17T11:28:41.230Z', true, 1, false
);

-- Company: Provincia Seguros (SERVICIOS_FINANCIEROS - 95.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  108, 'Provincia Seguros', 'provinciaseguros.com', 'Financial', 'SERVICIOS_FINANCIEROS', 0.95, 'Banking operations require real-time transaction processing with zero downtime tolerance', 'Argentina', 'Argentina', 'South America', 1019, 0, '2025-07-17T11:28:41.230Z', 'historical_migration', 0, false, 108, 4.02, 0.95, 'v4.0', '2025-07-17T11:28:41.230Z', false, 1, false
);

-- Company: RAMO (COMERCIO_HIBRIDO - 72.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  109, 'RAMO', 'ramo.com', 'Industrial', 'COMERCIO_HIBRIDO', 0.7200000000000001, 'Omnichannel retail combining physical and digital sales channels; Matrix classification: product_sales + hybrid_model; Low confidence in original classification', 'Colombia', 'Colombia', 'South America', 770, 0, '2025-07-17T11:28:41.230Z', 'historical_migration', 0, false, 109, 3.00, 0.7200000000000001, 'v4.0', '2025-07-17T11:28:41.230Z', false, 1, false
);

-- Company: Resia (SOFTWARE_CRITICO - 64.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  110, 'Resia', 'resia.com', 'Services', 'SOFTWARE_CRITICO', 0.6400000000000001, 'Software service with some physical touchpoints but primarily digital delivery; Matrix classification: recurring_subscriptions + hybrid_model; Low confidence in original classification', 'United States', 'United States', 'North America', 410, 0, '2025-07-17T11:28:41.231Z', 'historical_migration', 0, false, 110, 4.55, 0.6400000000000001, 'v4.0', '2025-07-17T11:28:41.231Z', true, 1, false
);

-- Company: SEDAPAL (ECOSISTEMA_DIGITAL - 76.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  111, 'SEDAPAL', 'sedapal.com', 'Services', 'ECOSISTEMA_DIGITAL', 0.76, 'Digital ecosystem monetizing through platform participation fees; Matrix classification: platform_fees + fully_digital; Low confidence in original classification', 'Peru', 'Peru', 'South America', 2976, 0, '2025-07-17T11:28:41.231Z', 'historical_migration', 0, false, 111, 3.47, 0.76, 'v4.0', '2025-07-17T11:28:41.231Z', false, 1, false
);

-- Company: Seguros Universal (SERVICIOS_FINANCIEROS - 95.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  112, 'Seguros Universal', 'segurosuniversal.com', 'Financial', 'SERVICIOS_FINANCIEROS', 0.95, 'Banking operations require real-time transaction processing with zero downtime tolerance', 'Dominican Republic', 'Dominican Republic', 'Caribbean', 1906, 0, '2025-07-17T11:28:41.231Z', 'historical_migration', 0, false, 112, 4.82, 0.95, 'v4.0', '2025-07-17T11:28:41.231Z', false, 1, false
);

-- Company: Sierracol (INFRAESTRUCTURA_HEREDADA - 68.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  114, 'Sierracol', 'sierracol.com', 'Energy', 'INFRAESTRUCTURA_HEREDADA', 0.68, 'Energy and utilities operate critical legacy infrastructure; Low confidence in original classification', 'Colombia', 'Colombia', 'South America', 1669, 0, '2025-07-17T11:28:41.231Z', 'historical_migration', 0, false, 114, 4.82, 0.68, 'v4.0', '2025-07-17T11:28:41.231Z', true, 1, false
);

-- Company: Sistecredito (SERVICIOS_FINANCIEROS - 95.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  115, 'Sistecredito', 'sistecredito.com', 'Financial', 'SERVICIOS_FINANCIEROS', 0.95, 'Banking operations require real-time transaction processing with zero downtime tolerance', 'Colombia', 'Colombia', 'South America', 946, 0, '2025-07-17T11:28:41.231Z', 'historical_migration', 0, false, 115, 4.58, 0.95, 'v4.0', '2025-07-17T11:28:41.231Z', false, 1, false
);

-- Company: Sociedad Seguros de Vida del Magisterio Nacional (SERVICIOS_FINANCIEROS - 95.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  116, 'Sociedad Seguros de Vida del Magisterio Nacional', 'sociedadsegurosdevid.com', 'Financial', 'SERVICIOS_FINANCIEROS', 0.95, 'Banking operations require real-time transaction processing with zero downtime tolerance', 'Costa Rica', 'Costa Rica', 'Central America', 296, 0, '2025-07-17T11:28:41.231Z', 'historical_migration', 0, false, 116, 3.89, 0.95, 'v4.0', '2025-07-17T11:28:41.231Z', false, 1, false
);

-- Company: Superintendencia Bancos Panama (SERVICIOS_FINANCIEROS - 76.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  117, 'Superintendencia Bancos Panama', 'superintendenciabanc.com', 'Public', 'SERVICIOS_FINANCIEROS', 0.76, 'Banking operations require real-time transaction processing with zero downtime tolerance; Low confidence in original classification', 'Panama', 'Panama', 'Central America', 501, 0, '2025-07-17T11:28:41.231Z', 'historical_migration', 0, false, 117, 3.75, 0.76, 'v4.0', '2025-07-17T11:28:41.231Z', false, 1, false
);

-- Company: Tecniseguros (SERVICIOS_FINANCIEROS - 95.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  118, 'Tecniseguros', 'tecniseguros.com', 'Financial', 'SERVICIOS_FINANCIEROS', 0.95, 'Banking operations require real-time transaction processing with zero downtime tolerance', 'Ecuador', 'Ecuador', 'South America', 783, 0, '2025-07-17T11:28:41.231Z', 'historical_migration', 0, false, 118, 3.74, 0.95, 'v4.0', '2025-07-17T11:28:41.231Z', false, 1, false
);

-- Company: Tempo Assist (SOFTWARE_CRITICO - 64.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  119, 'Tempo Assist', 'tempoassist.com', 'Services', 'SOFTWARE_CRITICO', 0.6400000000000001, 'Software service with some physical touchpoints but primarily digital delivery; Matrix classification: recurring_subscriptions + hybrid_model; Low confidence in original classification', 'Brazil', 'Brazil', 'South America', 2367, 0, '2025-07-17T11:28:41.231Z', 'historical_migration', 0, false, 119, 2.64, 0.6400000000000001, 'v4.0', '2025-07-17T11:28:41.231Z', true, 1, false
);

-- Company: Ticel (COMERCIO_HIBRIDO - 72.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  121, 'Ticel', 'ticel.com', 'Industrial', 'COMERCIO_HIBRIDO', 0.7200000000000001, 'Omnichannel retail combining physical and digital sales channels; Matrix classification: product_sales + hybrid_model; Low confidence in original classification', 'Chile', 'Chile', 'South America', 3013, 0, '2025-07-17T11:28:41.231Z', 'historical_migration', 0, false, 121, 3.74, 0.7200000000000001, 'v4.0', '2025-07-17T11:28:41.231Z', false, 1, false
);

-- Company: Transacciones y Transferencia (SERVICIOS_FINANCIEROS - 95.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  122, 'Transacciones y Transferencia', 'transaccionesytransf.com', 'Financial', 'SERVICIOS_FINANCIEROS', 0.95, 'Banking operations require real-time transaction processing with zero downtime tolerance', 'Guatemala', 'Guatemala', 'Central America', 248, 0, '2025-07-17T11:28:41.231Z', 'historical_migration', 0, false, 122, 5.23, 0.95, 'v4.0', '2025-07-17T11:28:41.231Z', false, 1, false
);

-- Company: Tribunal Electoral Panama (SERVICIOS_DATOS - 60.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  123, 'Tribunal Electoral Panama', 'tribunalelectoralpan.com', 'Public', 'SERVICIOS_DATOS', 0.6000000000000001, 'Public sector digital platform for citizen services; Public sector platform likely focuses on data services; Low confidence in original classification', 'Panama', 'Panama', 'Central America', 480, 0, '2025-07-17T11:28:41.231Z', 'historical_migration', 0, false, 123, 4.31, 0.6000000000000001, 'v4.0', '2025-07-17T11:28:41.231Z', true, 1, false
);

-- Company: Universidad Autonoma de Chile (ECOSISTEMA_DIGITAL - 76.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  124, 'Universidad Autonoma de Chile', 'universidadautonomad.com', 'Education', 'ECOSISTEMA_DIGITAL', 0.76, 'Digital ecosystem monetizing through platform participation fees; Matrix classification: platform_fees + hybrid_model; Low confidence in original classification', 'Chile', 'Chile', 'South America', 2407, 0, '2025-07-17T11:28:41.231Z', 'historical_migration', 0, false, 124, 3.35, 0.76, 'v4.0', '2025-07-17T11:28:41.231Z', false, 1, false
);

-- Company: UADE (ECOSISTEMA_DIGITAL - 76.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  125, 'UADE', 'uade.com', 'Education', 'ECOSISTEMA_DIGITAL', 0.76, 'Digital ecosystem monetizing through platform participation fees; Matrix classification: platform_fees + hybrid_model; Low confidence in original classification', 'Argentina', 'Argentina', 'South America', 486, 0, '2025-07-17T11:28:41.231Z', 'historical_migration', 0, false, 125, 3.64, 0.76, 'v4.0', '2025-07-17T11:28:41.231Z', false, 1, false
);

-- Company: UNED Palmares (ECOSISTEMA_DIGITAL - 76.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  126, 'UNED Palmares', 'unedpalmares.com', 'Education', 'ECOSISTEMA_DIGITAL', 0.76, 'Digital ecosystem monetizing through platform participation fees; Matrix classification: platform_fees + hybrid_model; Low confidence in original classification', 'Costa Rica', 'Costa Rica', 'Central America', 4206, 0, '2025-07-17T11:28:41.231Z', 'historical_migration', 0, false, 126, 4.34, 0.76, 'v4.0', '2025-07-17T11:28:41.231Z', false, 1, false
);

-- Company: Unibank (SERVICIOS_FINANCIEROS - 95.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  127, 'Unibank', 'unibank.com', 'Financial', 'SERVICIOS_FINANCIEROS', 0.95, 'Banking operations require real-time transaction processing with zero downtime tolerance', 'Panama', 'Panama', 'Central America', 121, 0, '2025-07-17T11:28:41.231Z', 'historical_migration', 0, false, 127, 4.28, 0.95, 'v4.0', '2025-07-17T11:28:41.231Z', false, 1, false
);

-- Company: V Suarez&CO (COMERCIO_HIBRIDO - 72.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  128, 'V Suarez&CO', 'vsuarezco.com', 'Retail', 'COMERCIO_HIBRIDO', 0.7200000000000001, 'Retail operations span physical stores and digital channels requiring omnichannel security; Low confidence in original classification', 'Puerto Rico', 'Puerto Rico', 'Caribbean', 109, 0, '2025-07-17T11:28:41.231Z', 'historical_migration', 0, false, 128, 4.06, 0.7200000000000001, 'v4.0', '2025-07-17T11:28:41.231Z', false, 1, false
);

-- Company: Vipal (COMERCIO_HIBRIDO - 72.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  129, 'Vipal', 'vipal.com', 'Industrial', 'COMERCIO_HIBRIDO', 0.7200000000000001, 'Omnichannel retail combining physical and digital sales channels; Matrix classification: product_sales + hybrid_model; Low confidence in original classification', 'Brazil', 'Brazil', 'South America', 1795, 0, '2025-07-17T11:28:41.231Z', 'historical_migration', 0, false, 129, 3.16, 0.7200000000000001, 'v4.0', '2025-07-17T11:28:41.231Z', false, 1, false
);

-- Company: XM (INFRAESTRUCTURA_HEREDADA - 68.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  130, 'XM', 'xm.com', 'Energy', 'INFRAESTRUCTURA_HEREDADA', 0.68, 'Energy and utilities operate critical legacy infrastructure; Low confidence in original classification', 'Colombia', 'Colombia', 'South America', 1920, 0, '2025-07-17T11:28:41.231Z', 'historical_migration', 0, false, 130, 4.70, 0.68, 'v4.0', '2025-07-17T11:28:41.231Z', true, 1, false
);

-- Company: APAP (SERVICIOS_FINANCIEROS - 95.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  131, 'APAP', 'apap.com', 'Financial', 'SERVICIOS_FINANCIEROS', 0.95, 'Banking operations require real-time transaction processing with zero downtime tolerance', 'Dominican Republic', 'Dominican Republic', 'Caribbean', 2508, 0, '2025-07-17T11:28:41.231Z', 'historical_migration', 0, false, 131, 4.51, 0.95, 'v4.0', '2025-07-17T11:28:41.231Z', false, 1, false
);

-- Company: Banreservas (SERVICIOS_FINANCIEROS - 95.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  132, 'Banreservas', 'banreservas.com', 'Financial', 'SERVICIOS_FINANCIEROS', 0.95, 'Banking operations require real-time transaction processing with zero downtime tolerance', 'Dominican Republic', 'Dominican Republic', 'Caribbean', 12715, 0, '2025-07-17T11:28:41.232Z', 'historical_migration', 0, false, 132, 4.42, 0.95, 'v4.0', '2025-07-17T11:28:41.232Z', false, 1, false
);

-- Company: KMA (COMERCIO_HIBRIDO - 72.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  133, 'KMA', 'kma.com', 'Industrial', 'COMERCIO_HIBRIDO', 0.7200000000000001, 'Omnichannel retail combining physical and digital sales channels; Matrix classification: product_sales + hybrid_model; Low confidence in original classification', 'Colombia', 'Colombia', 'South America', 316, 0, '2025-07-17T11:28:41.232Z', 'historical_migration', 0, false, 133, 3.40, 0.7200000000000001, 'v4.0', '2025-07-17T11:28:41.232Z', false, 1, false
);

-- Company: La Colonial (SERVICIOS_FINANCIEROS - 95.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  134, 'La Colonial', 'lacolonial.com', 'Financial', 'SERVICIOS_FINANCIEROS', 0.95, 'Banking operations require real-time transaction processing with zero downtime tolerance', 'Dominican Republic', 'Dominican Republic', 'Caribbean', 573, 0, '2025-07-17T11:28:41.232Z', 'historical_migration', 0, false, 134, 4.51, 0.95, 'v4.0', '2025-07-17T11:28:41.232Z', false, 1, false
);

-- Company: Nello (COMERCIO_HIBRIDO - 72.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  135, 'Nello', 'nello.com', 'Industrial', 'COMERCIO_HIBRIDO', 0.7200000000000001, 'Omnichannel retail combining physical and digital sales channels; Matrix classification: product_sales + hybrid_model; Low confidence in original classification', 'United States', 'United States', 'North America', 119, 0, '2025-07-17T11:28:41.232Z', 'historical_migration', 0, false, 135, 3.70, 0.7200000000000001, 'v4.0', '2025-07-17T11:28:41.232Z', false, 1, false
);

-- Company: UTESA (ECOSISTEMA_DIGITAL - 76.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  136, 'UTESA', 'utesa.com', 'Education', 'ECOSISTEMA_DIGITAL', 0.76, 'Digital ecosystem monetizing through platform participation fees; Matrix classification: platform_fees + hybrid_model; Low confidence in original classification', 'Dominican Republic', 'Dominican Republic', 'Caribbean', 1256, 0, '2025-07-17T11:28:41.232Z', 'historical_migration', 0, false, 136, 2.85, 0.76, 'v4.0', '2025-07-17T11:28:41.232Z', false, 1, false
);

-- Company: Valid (SOFTWARE_CRITICO - 72.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  137, 'Valid', 'valid.com', 'Technology', 'SOFTWARE_CRITICO', 0.7200000000000001, 'Software platforms require 24/7 availability with customer data protection; Low confidence in original classification', 'Colombia', 'Colombia', 'South America', 304, 0, '2025-07-17T11:28:41.232Z', 'historical_migration', 0, false, 137, 3.50, 0.7200000000000001, 'v4.0', '2025-07-17T11:28:41.232Z', false, 1, false
);

-- Company: Aviomar (ECOSISTEMA_DIGITAL - 68.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  138, 'Aviomar', 'aviomar.com', 'Transportation', 'ECOSISTEMA_DIGITAL', 0.68, 'Airlines operate digital booking ecosystems with partners, lounges, and services; Low confidence in original classification', 'Colombia', 'Colombia', 'South America', 596, 0, '2025-07-17T11:28:41.232Z', 'historical_migration', 0, false, 138, 4.42, 0.68, 'v4.0', '2025-07-17T11:28:41.232Z', true, 1, false
);

-- Company: Caja los Heroes (SERVICIOS_FINANCIEROS - 95.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  139, 'Caja los Heroes', 'cajalosheroes.com', 'Financial', 'SERVICIOS_FINANCIEROS', 0.95, 'Banking operations require real-time transaction processing with zero downtime tolerance', 'Chile', 'Chile', 'South America', 2762, 0, '2025-07-17T11:28:41.232Z', 'historical_migration', 0, false, 139, 4.80, 0.95, 'v4.0', '2025-07-17T11:28:41.232Z', false, 1, false
);

-- Company: Coopealianza (SERVICIOS_FINANCIEROS - 95.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  140, 'Coopealianza', 'coopealianza.com', 'Financial', 'SERVICIOS_FINANCIEROS', 0.95, 'Banking operations require real-time transaction processing with zero downtime tolerance', 'Costa Rica', 'Costa Rica', 'Central America', 738, 0, '2025-07-17T11:28:41.232Z', 'historical_migration', 0, false, 140, 5.60, 0.95, 'v4.0', '2025-07-17T11:28:41.232Z', false, 1, false
);

-- Company: CYS (COMERCIO_HIBRIDO - 72.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  141, 'CYS', 'cys.com', 'Industrial', 'COMERCIO_HIBRIDO', 0.7200000000000001, 'Omnichannel retail combining physical and digital sales channels; Matrix classification: product_sales + hybrid_model; Low confidence in original classification', 'Colombia', 'Colombia', 'South America', 159, 0, '2025-07-17T11:28:41.232Z', 'historical_migration', 0, false, 141, 2.83, 0.7200000000000001, 'v4.0', '2025-07-17T11:28:41.232Z', false, 1, false
);

-- Company: Grupo A (COMERCIO_HIBRIDO - 72.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  142, 'Grupo A', 'grupoa.com', 'Industrial', 'COMERCIO_HIBRIDO', 0.7200000000000001, 'Omnichannel retail combining physical and digital sales channels; Matrix classification: product_sales + hybrid_model; Low confidence in original classification', 'Colombia', 'Colombia', 'South America', 1597, 0, '2025-07-17T11:28:41.232Z', 'historical_migration', 0, false, 142, 3.60, 0.7200000000000001, 'v4.0', '2025-07-17T11:28:41.232Z', false, 1, false
);

-- Company: INM (SERVICIOS_DATOS - 60.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  143, 'INM', 'inm.com', 'Public', 'SERVICIOS_DATOS', 0.6000000000000001, 'Public sector digital platform for citizen services; Public sector platform likely focuses on data services; Low confidence in original classification', 'Colombia', 'Colombia', 'South America', 288, 0, '2025-07-17T11:28:41.232Z', 'historical_migration', 0, false, 143, 3.60, 0.6000000000000001, 'v4.0', '2025-07-17T11:28:41.232Z', true, 1, false
);

-- Company: Investta (SERVICIOS_FINANCIEROS - 95.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  144, 'Investta', 'investta.com', 'Financial', 'SERVICIOS_FINANCIEROS', 0.95, 'Banking operations require real-time transaction processing with zero downtime tolerance', 'Colombia', 'Colombia', 'South America', 31, 0, '2025-07-17T11:28:41.232Z', 'historical_migration', 0, false, 144, 3.46, 0.95, 'v4.0', '2025-07-17T11:28:41.232Z', false, 1, false
);

-- Company: Mario Hernandez (COMERCIO_HIBRIDO - 72.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  145, 'Mario Hernandez', 'mariohernandez.com', 'Industrial', 'COMERCIO_HIBRIDO', 0.7200000000000001, 'Omnichannel retail combining physical and digital sales channels; Matrix classification: product_sales + hybrid_model; Low confidence in original classification', 'Colombia', 'Colombia', 'South America', 319, 0, '2025-07-17T11:28:41.232Z', 'historical_migration', 0, false, 145, 2.90, 0.7200000000000001, 'v4.0', '2025-07-17T11:28:41.232Z', false, 1, false
);

-- Company: Movich (INFORMACION_REGULADA - 76.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  146, 'Movich', 'movich.com', 'Hospitality', 'INFORMACION_REGULADA', 0.76, 'Healthcare data requires strict compliance with patient privacy regulations; Low confidence in original classification', 'Colombia', 'Colombia', 'South America', 478, 0, '2025-07-17T11:28:41.232Z', 'historical_migration', 0, false, 146, 2.34, 0.76, 'v4.0', '2025-07-17T11:28:41.232Z', false, 1, false
);

-- Company: NBC (SOFTWARE_CRITICO - 64.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  147, 'NBC', 'nbc.com', 'Services', 'SOFTWARE_CRITICO', 0.6400000000000001, 'Software service with some physical touchpoints but primarily digital delivery; Matrix classification: recurring_subscriptions + hybrid_model; Low confidence in original classification', 'Colombia', 'Colombia', 'South America', 75, 0, '2025-07-17T11:28:41.232Z', 'historical_migration', 0, false, 147, 2.04, 0.6400000000000001, 'v4.0', '2025-07-17T11:28:41.232Z', true, 1, false
);

-- Company: OTACC (COMERCIO_HIBRIDO - 72.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  148, 'OTACC', 'otacc.com', 'Industrial', 'COMERCIO_HIBRIDO', 0.7200000000000001, 'Omnichannel retail combining physical and digital sales channels; Matrix classification: product_sales + hybrid_model; Low confidence in original classification', 'Colombia', 'Colombia', 'South America', 358, 0, '2025-07-17T11:28:41.232Z', 'historical_migration', 0, false, 148, 2.83, 0.7200000000000001, 'v4.0', '2025-07-17T11:28:41.232Z', false, 1, false
);

-- Company: Shrader Camargo (COMERCIO_HIBRIDO - 72.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  149, 'Shrader Camargo', 'shradercamargo.com', 'Industrial', 'COMERCIO_HIBRIDO', 0.7200000000000001, 'Omnichannel retail combining physical and digital sales channels; Matrix classification: product_sales + hybrid_model; Low confidence in original classification', 'Colombia', 'Colombia', 'South America', 199, 0, '2025-07-17T11:28:41.232Z', 'historical_migration', 0, false, 149, 3.20, 0.7200000000000001, 'v4.0', '2025-07-17T11:28:41.232Z', false, 1, false
);

-- Company: UIB (SERVICIOS_FINANCIEROS - 95.0%)
INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  150, 'UIB', 'uib.com', 'Financial', 'SERVICIOS_FINANCIEROS', 0.95, 'Banking operations require real-time transaction processing with zero downtime tolerance', 'Colombia', 'Colombia', 'South America', 100, 0, '2025-07-17T11:28:41.232Z', 'historical_migration', 0, false, 150, 3.57, 0.95, 'v4.0', '2025-07-17T11:28:41.232Z', false, 1, false
);

COMMIT;

-- Migration Summary:
-- Success: 150
-- Errors: 0
-- Average Confidence: 83.3%