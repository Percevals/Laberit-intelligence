#!/usr/bin/env python3
"""
Business Model Mapper - Phase 1 of Business Translation Layer
Maps technical threats to DII business models based on attack patterns

@author: Lãberit Intelligence
@version: 1.0.0
"""

import json
import os
from typing import List, Dict, Tuple, Optional
from datetime import datetime
import re


class BusinessModelMapper:
    """
    Maps technical threats to DII business models based on attack patterns
    """
    
    def __init__(self):
        """Initialize mapper with attack pattern rules"""
        self.business_models = {
            1: "Comercio Híbrido",
            2: "Software Crítico", 
            3: "Servicios de Datos",
            4: "Ecosistema Digital",
            5: "Servicios Financieros",
            6: "Infraestructura Heredada",
            7: "Cadena de Suministro",
            8: "Información Regulada"
        }
        
        # Attack pattern mapping rules from spec
        self.attack_patterns = {
            "ransomware": {
                "affects": [1, 2, 3, 4, 5, 6, 7, 8],  # All models
                "primary_impact": [6],  # Infraestructura Heredada
                "keywords": ["ransomware", "ransom", "encrypt", "lockbit", "blackcat", "alphv", "conti", "revil", "ryuk"]
            },
            "api_exploitation": {
                "affects": [2, 3, 4, 5],
                "primary_impact": [4],  # Ecosistema Digital
                "keywords": ["api", "endpoint", "rest", "graphql", "swagger", "oauth", "jwt", "authentication bypass"]
            },
            "supply_chain": {
                "affects": [1, 6, 7],
                "primary_impact": [7],  # Cadena de Suministro
                "keywords": ["supply chain", "third party", "vendor", "provider", "solarwinds", "kaseya", "dependency"]
            },
            "data_exfiltration": {
                "affects": [3, 5, 8],
                "primary_impact": [3],  # Servicios de Datos
                "keywords": ["exfiltration", "data breach", "leak", "stolen data", "database", "pii", "gdpr", "sensitive"]
            },
            "pos_malware": {
                "affects": [1, 5],
                "primary_impact": [1],  # Comercio Híbrido
                "keywords": ["pos", "point of sale", "retail", "credit card", "skimmer", "magecart"]
            },
            "cloud_misconfiguration": {
                "affects": [2, 3, 4],
                "primary_impact": [2],  # Software Crítico
                "keywords": ["s3", "bucket", "cloud", "aws", "azure", "gcp", "misconfiguration", "exposed"]
            },
            "ics_ot_attack": {
                "affects": [6, 7],
                "primary_impact": [6],  # Infraestructura Heredada
                "keywords": ["ics", "scada", "ot", "industrial", "plc", "hmi", "modbus", "critical infrastructure"]
            },
            "healthcare_targeted": {
                "affects": [8],
                "primary_impact": [8],  # Información Regulada
                "keywords": ["healthcare", "hospital", "medical", "patient", "hipaa", "health records", "ehr"]
            },
            "financial_malware": {
                "affects": [5],
                "primary_impact": [5],  # Servicios Financieros
                "keywords": ["banking", "trojan", "financial", "swift", "atm", "fintech", "payment", "transaction"]
            },
            "ddos": {
                "affects": [2, 4, 5],
                "primary_impact": [4],  # Ecosistema Digital
                "keywords": ["ddos", "denial of service", "botnet", "amplification", "volumetric", "flood"]
            },
            "bec": {
                "affects": [1, 5, 7],
                "primary_impact": [5],  # Servicios Financieros
                "keywords": ["bec", "business email", "ceo fraud", "wire transfer", "invoice", "phishing"]
            }
        }
        
        # Sector to model mapping for additional context
        self.sector_patterns = {
            "retail": [1],
            "ecommerce": [1, 4],
            "saas": [2],
            "software": [2],
            "analytics": [3],
            "data": [3],
            "platform": [4],
            "marketplace": [4],
            "banking": [5],
            "finance": [5],
            "fintech": [5],
            "telecom": [6],
            "energy": [6],
            "utility": [6],
            "manufacturing": [6, 7],
            "logistics": [7],
            "supply": [7],
            "healthcare": [8],
            "medical": [8],
            "insurance": [8]
        }
        
    def map_threat_to_model(self, threat_data: dict) -> List[int]:
        """
        Maps a threat to affected business models
        
        Args:
            threat_data: Dictionary containing threat information
                Expected keys: title, description, tags, indicators, malware_families
                
        Returns:
            List of affected business model IDs (1-8)
        """
        affected_models = set()
        
        # Extract text content for analysis
        text_content = self._extract_threat_text(threat_data)
        text_lower = text_content.lower()
        
        # Check against attack patterns
        for attack_type, pattern in self.attack_patterns.items():
            if any(keyword in text_lower for keyword in pattern["keywords"]):
                affected_models.update(pattern["affects"])
        
        # Check sector mentions
        for sector, models in self.sector_patterns.items():
            if sector in text_lower:
                affected_models.update(models)
        
        # If no specific patterns matched, analyze indicators
        if not affected_models:
            affected_models = self._analyze_indicators(threat_data)
        
        # Default to all models if completely generic threat
        if not affected_models and self._is_generic_threat(threat_data):
            affected_models = set(range(1, 9))
        
        return sorted(list(affected_models))
    
    def get_primary_impact_models(self, threat_data: dict) -> List[int]:
        """
        Get business models with primary impact from the threat
        
        Args:
            threat_data: Threat information dictionary
            
        Returns:
            List of primary impact model IDs
        """
        primary_models = set()
        text_lower = self._extract_threat_text(threat_data).lower()
        
        for attack_type, pattern in self.attack_patterns.items():
            if any(keyword in text_lower for keyword in pattern["keywords"]):
                primary_models.update(pattern["primary_impact"])
        
        return sorted(list(primary_models))
    
    def get_model_exposure(self, iocs: List[dict], model_id: int) -> float:
        """
        Calculate exposure level (0-1) for specific model based on IOCs
        
        Args:
            iocs: List of indicators of compromise
            model_id: Business model ID (1-8)
            
        Returns:
            Exposure score between 0 and 1
        """
        if not iocs or model_id not in range(1, 9):
            return 0.0
        
        exposure_score = 0.0
        model_name = self.business_models[model_id]
        
        # Model-specific IOC patterns
        model_ioc_weights = {
            1: {  # Comercio Híbrido
                "domain": 0.3,
                "IPv4": 0.2,
                "FileHash-MD5": 0.4,
                "email": 0.1
            },
            2: {  # Software Crítico
                "domain": 0.4,
                "URL": 0.3,
                "CVE": 0.2,
                "IPv4": 0.1
            },
            3: {  # Servicios de Datos
                "domain": 0.3,
                "IPv4": 0.3,
                "URL": 0.2,
                "FileHash-SHA256": 0.2
            },
            4: {  # Ecosistema Digital
                "domain": 0.4,
                "URL": 0.3,
                "IPv4": 0.2,
                "email": 0.1
            },
            5: {  # Servicios Financieros
                "domain": 0.3,
                "FileHash-MD5": 0.3,
                "email": 0.2,
                "IPv4": 0.2
            },
            6: {  # Infraestructura Heredada
                "IPv4": 0.4,
                "CVE": 0.3,
                "FileHash-MD5": 0.2,
                "domain": 0.1
            },
            7: {  # Cadena de Suministro
                "email": 0.3,
                "domain": 0.3,
                "FileHash-SHA256": 0.2,
                "URL": 0.2
            },
            8: {  # Información Regulada
                "FileHash-SHA256": 0.3,
                "email": 0.3,
                "domain": 0.2,
                "IPv4": 0.2
            }
        }
        
        weights = model_ioc_weights.get(model_id, {})
        ioc_type_counts = {}
        
        # Count IOC types
        for ioc in iocs:
            ioc_type = ioc.get("type", "")
            ioc_type_counts[ioc_type] = ioc_type_counts.get(ioc_type, 0) + 1
        
        # Calculate weighted exposure
        total_weight = sum(weights.values()) if weights else 1.0
        
        for ioc_type, count in ioc_type_counts.items():
            if ioc_type in weights:
                # Normalize count (cap at 10 for calculation)
                normalized_count = min(count, 10) / 10
                exposure_score += weights[ioc_type] * normalized_count
        
        # Normalize to 0-1 range
        exposure_score = min(exposure_score / total_weight, 1.0) if total_weight > 0 else 0.0
        
        return round(exposure_score, 2)
    
    def analyze_threat_context(self, threat_data: dict) -> Dict[str, any]:
        """
        Comprehensive analysis of threat in business context
        
        Args:
            threat_data: Threat information
            
        Returns:
            Dictionary with business context analysis
        """
        affected_models = self.map_threat_to_model(threat_data)
        primary_models = self.get_primary_impact_models(threat_data)
        
        # Extract attack type
        attack_type = self._identify_attack_type(threat_data)
        
        # Calculate exposure for each affected model
        iocs = threat_data.get("indicators", [])
        model_exposures = {}
        for model_id in affected_models:
            model_exposures[model_id] = {
                "model_name": self.business_models[model_id],
                "exposure_score": self.get_model_exposure(iocs, model_id),
                "is_primary_impact": model_id in primary_models
            }
        
        return {
            "affected_models": affected_models,
            "primary_impact_models": primary_models,
            "model_exposures": model_exposures,
            "attack_type": attack_type,
            "threat_classification": self._classify_threat_severity(affected_models, primary_models),
            "analysis_timestamp": datetime.now().isoformat()
        }
    
    def _extract_threat_text(self, threat_data: dict) -> str:
        """Extract searchable text from threat data"""
        text_parts = []
        
        # Add main text fields
        for field in ["name", "title", "description", "summary"]:
            if field in threat_data and threat_data[field]:
                text_parts.append(str(threat_data[field]))
        
        # Add tags
        if "tags" in threat_data:
            tags = threat_data["tags"]
            if isinstance(tags, list):
                text_parts.extend(tags)
            elif isinstance(tags, str):
                text_parts.append(tags)
        
        # Add malware families
        if "malware_families" in threat_data:
            families = threat_data["malware_families"]
            if isinstance(families, list):
                text_parts.extend(families)
        
        # Add targeted sectors/industries
        for field in ["targeted_sectors", "industries", "sectors"]:
            if field in threat_data:
                sectors = threat_data[field]
                if isinstance(sectors, list):
                    text_parts.extend(sectors)
                elif isinstance(sectors, str):
                    text_parts.append(sectors)
        
        return " ".join(text_parts)
    
    def _analyze_indicators(self, threat_data: dict) -> set:
        """Analyze indicators to determine affected models"""
        affected = set()
        indicators = threat_data.get("indicators", [])
        
        if not indicators:
            return affected
        
        # IOC type patterns
        for ioc in indicators:
            ioc_type = ioc.get("type", "").lower()
            ioc_value = ioc.get("indicator", "").lower()
            
            # File hashes suggest malware
            if "filehash" in ioc_type:
                affected.update([1, 2, 5, 6])  # Common malware targets
            
            # Email addresses suggest phishing/BEC
            elif ioc_type == "email":
                affected.update([1, 5, 7])
            
            # Domains/URLs could affect any online service
            elif ioc_type in ["domain", "url"]:
                # Check for specific patterns
                if any(fin in ioc_value for fin in ["bank", "pay", "transf"]):
                    affected.add(5)
                elif any(api in ioc_value for api in ["api", "swagger", "graphql"]):
                    affected.update([2, 4])
        
        return affected
    
    def _is_generic_threat(self, threat_data: dict) -> bool:
        """Determine if threat is generic/widespread"""
        generic_indicators = [
            "widespread", "multiple sectors", "various industries",
            "global campaign", "mass exploitation", "opportunistic"
        ]
        
        text = self._extract_threat_text(threat_data).lower()
        return any(indicator in text for indicator in generic_indicators)
    
    def _identify_attack_type(self, threat_data: dict) -> str:
        """Identify the primary attack type"""
        text = self._extract_threat_text(threat_data).lower()
        
        for attack_type, pattern in self.attack_patterns.items():
            if any(keyword in text for keyword in pattern["keywords"]):
                return attack_type
        
        return "unknown"
    
    def _classify_threat_severity(self, affected_models: List[int], primary_models: List[int]) -> str:
        """Classify threat severity based on impact"""
        if len(affected_models) >= 6:
            return "CRITICAL"
        elif len(primary_models) >= 2 or 5 in primary_models:  # Multiple primary or Financial
            return "HIGH"
        elif len(affected_models) >= 3:
            return "MEDIUM"
        else:
            return "LOW"
    
    def generate_model_report(self, threat_data: dict) -> str:
        """
        Generate human-readable report of model mapping
        
        Args:
            threat_data: Threat information
            
        Returns:
            Formatted report string
        """
        analysis = self.analyze_threat_context(threat_data)
        
        report = []
        report.append("=== Business Model Impact Analysis ===")
        report.append(f"Threat: {threat_data.get('name', 'Unknown')}")
        report.append(f"Attack Type: {analysis['attack_type']}")
        report.append(f"Severity: {analysis['threat_classification']}")
        report.append("")
        
        report.append("Affected Business Models:")
        for model_id, exposure in analysis['model_exposures'].items():
            impact = "PRIMARY IMPACT" if exposure['is_primary_impact'] else "Secondary"
            report.append(f"  [{model_id}] {exposure['model_name']} - Exposure: {exposure['exposure_score']:.0%} ({impact})")
        
        report.append("")
        report.append("Recommendation: Focus protection on primary impact models")
        
        return "\n".join(report)


if __name__ == "__main__":
    # Test the mapper with sample data
    mapper = BusinessModelMapper()
    
    # Sample threat data
    sample_threat = {
        "name": "Cobalt Strike Campaign Targeting LATAM Financial Sector",
        "description": "Advanced threat actors using Cobalt Strike to target banking institutions",
        "tags": ["cobalt-strike", "banking", "financial", "latam"],
        "indicators": [
            {"type": "domain", "indicator": "malicious-bank.com"},
            {"type": "FileHash-MD5", "indicator": "d41d8cd98f00b204e9800998ecf8427e"},
            {"type": "IPv4", "indicator": "192.168.1.1"}
        ]
    }
    
    # Test mapping
    print(mapper.generate_model_report(sample_threat))