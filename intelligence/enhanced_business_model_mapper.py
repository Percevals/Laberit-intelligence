"""
Enhanced Business Model Mapper
Bridges technical depth for IT/Security teams with business clarity for C-suite
"""

class EnhancedBusinessModelMapper:
    """Maps cyber incidents to business models with dual-language approach"""
    
    def __init__(self):
        # Business models remain the same
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
        
        # Enhanced threat taxonomy with business translation
        self.cyber_threats = {
            "ransomware": {
                "technical_name": "Ransomware",
                "business_name": "Operations Shutdown Attack",
                "executive_impact": "Can't operate for X days, lose $Y per day",
                "mid_level_pitch": "Encrypts systems, demands payment, stops all operations",
                "real_examples": {
                    "retail": "Target store closed 5 days, $2M loss",
                    "manufacturing": "Factory stopped 10 days, $5M loss",
                    "healthcare": "Hospital diverted patients, $3M loss + lawsuits"
                }
            },
            "data_breach": {
                "technical_name": "Data Exfiltration",
                "business_name": "Customer Trust Crisis", 
                "executive_impact": "Lose X% customers, $Y in fines, reputation damage",
                "mid_level_pitch": "Stolen customer data leads to regulatory fines and lost business",
                "real_examples": {
                    "retail": "Lost 15% customers after breach, $1M GDPR fine",
                    "financial": "Banking license review, $10M settlement",
                    "healthcare": "HIPAA fines $5M, class action lawsuit"
                }
            },
            "ddos": {
                "technical_name": "Denial of Service",
                "business_name": "Revenue Channel Block",
                "executive_impact": "Can't sell for X hours, lose $Y in sales",
                "mid_level_pitch": "Website/app down means no digital revenue",
                "real_examples": {
                    "ecommerce": "Black Friday attack, $500K/hour loss",
                    "banking": "Mobile app down, 10K customer complaints",
                    "gaming": "Launch day attack, 50% refund requests"
                }
            },
            "supply_chain": {
                "technical_name": "Supply Chain Compromise",
                "business_name": "Partner Contamination",
                "executive_impact": "Trusted vendor becomes attack path, $X cleanup",
                "mid_level_pitch": "Attackers use your vendors to reach you",
                "real_examples": {
                    "software": "Update server compromised, 1000 customers hit",
                    "manufacturing": "Supplier ransomware spread to 5 partners",
                    "retail": "POS vendor breach, all stores affected"
                }
            },
            "insider_threat": {
                "technical_name": "Malicious Insider",
                "business_name": "Trust Betrayal Loss",
                "executive_impact": "Employee steals IP/data, competitor advantage",
                "mid_level_pitch": "Authorized access used for theft or sabotage",
                "real_examples": {
                    "tech": "Engineer stole code, started competitor",
                    "financial": "Trader hidden losses, $100M damage",
                    "healthcare": "Nurse sold patient records, 50K affected"
                }
            }
        }
        
        # How attacks happen (simplified for executives)
        self.attack_vectors = {
            "phishing": {
                "technical_term": "Phishing/Social Engineering",
                "simple_term": "Fake Emails That Trick People",
                "how_it_works": "Employees click bad links → attacker gets in",
                "business_relevance": "Your people are the weakest link",
                "prevention_cost": "$50/user training vs $2M breach"
            },
            "stolen_credentials": {
                "technical_term": "Compromised Credentials",
                "simple_term": "Stolen Passwords",
                "how_it_works": "Reused passwords from other breaches → easy access",
                "business_relevance": "One password = many systems compromised",
                "prevention_cost": "$10/user MFA vs $500K incident"
            },
            "unpatched_systems": {
                "technical_term": "Unpatched Vulnerabilities", 
                "simple_term": "Unfixed Security Holes",
                "how_it_works": "Known problems not fixed → attackers walk in",
                "business_relevance": "Like leaving doors unlocked",
                "prevention_cost": "$5K/month patching vs $1M breach"
            },
            "cloud_misconfiguration": {
                "technical_term": "Cloud Misconfiguration",
                "simple_term": "Cloud Settings Wrong",
                "how_it_works": "Storage left public → data exposed",
                "business_relevance": "Your data visible to everyone",
                "prevention_cost": "$2K audit vs $5M data leak"
            },
            "third_party_compromise": {
                "technical_term": "Third-Party Compromise",
                "simple_term": "Vendor Got Hacked", 
                "how_it_works": "Trusted vendor breached → access to you",
                "business_relevance": "Your security = weakest vendor",
                "prevention_cost": "$10K vendor audit vs $2M cleanup"
            }
        }
        
        # Where attacks hit (business terms)
        self.attack_surfaces = {
            "email": {
                "technical_name": "Email Infrastructure",
                "business_name": "Communication Channel",
                "why_targeted": "Everyone uses it, easy to fake",
                "impact": "Compromised email = trusted attacker"
            },
            "web_apps": {
                "technical_name": "Web Applications",
                "business_name": "Customer Interface",
                "why_targeted": "Public-facing, valuable data",
                "impact": "Down = no digital revenue"
            },
            "cloud": {
                "technical_name": "Cloud Infrastructure",
                "business_name": "Digital Operations Platform",
                "why_targeted": "All your data in one place",
                "impact": "Breach = everything exposed"
            },
            "erp": {
                "technical_name": "ERP/Critical Systems",
                "business_name": "Business Brain",
                "why_targeted": "Controls everything",
                "impact": "Down = company paralyzed"
            },
            "mobile": {
                "technical_name": "Mobile Applications",
                "business_name": "Customer Pocket Presence",
                "why_targeted": "Direct customer access",
                "impact": "Breach = customer exodus"
            }
        }
        
        # Business impact categories (what executives care about)
        self.business_impacts = {
            "operational": {
                "name": "Can't Operate",
                "examples": ["Factory stops", "Orders halt", "Services down"],
                "metrics": "Days down × Daily revenue = Loss"
            },
            "customer": {
                "name": "Lose Customers",
                "examples": ["Trust broken", "Competitors gain", "Churn spike"],
                "metrics": "Customer lifetime value × Churn rate = Loss"
            },
            "regulatory": {
                "name": "Legal Penalties", 
                "examples": ["GDPR fines", "License review", "Lawsuits"],
                "metrics": "Fine + Legal costs + Remediation = Loss"
            },
            "competitive": {
                "name": "Market Position Loss",
                "examples": ["IP stolen", "First-mover lost", "Reputation hit"],
                "metrics": "Market share loss × Revenue = Loss"
            },
            "financial": {
                "name": "Direct Money Loss",
                "examples": ["Ransom paid", "Fraud loss", "Recovery cost"],
                "metrics": "Direct loss + Recovery + Opportunity cost = Loss"
            }
        }
        
        # Enhanced attack patterns with business context
        self.attack_patterns = {
            "ransomware": {
                "affected_models": [1, 2, 3, 4, 5, 6, 7, 8],
                "primary_models": [6],  # Legacy systems most vulnerable
                "business_translation": "Everything stops until you pay or rebuild",
                "typical_entry": ["phishing", "unpatched_systems"],
                "typical_cost": "$500K-$10M depending on size",
                "recovery_time": "5-15 days",
                "prevention_roi": "20:1 (prevent:incident cost)"
            },
            "api_exploitation": {
                "affected_models": [2, 3, 4, 5],
                "primary_models": [4],  # Digital ecosystems
                "business_translation": "Your digital connections become attack paths",
                "typical_entry": ["stolen_credentials", "unpatched_systems"],
                "typical_cost": "$1M-$5M in breach costs",
                "recovery_time": "10-30 days",
                "prevention_roi": "15:1"
            },
            "supply_chain": {
                "affected_models": [1, 6, 7],
                "primary_models": [7],  # Supply chain model
                "business_translation": "Your vendor's problem becomes your crisis",
                "typical_entry": ["third_party_compromise"],
                "typical_cost": "$2M-$20M cascade effect",
                "recovery_time": "30-90 days", 
                "prevention_roi": "10:1"
            },
            "data_exfiltration": {
                "affected_models": [3, 5, 8],
                "primary_models": [3, 8],  # Data services & regulated
                "business_translation": "Your crown jewels stolen, customers leave",
                "typical_entry": ["phishing", "insider_threat"],
                "typical_cost": "$3M-$50M with fines",
                "recovery_time": "6-12 months reputation",
                "prevention_roi": "25:1"
            },
            "account_takeover": {
                "affected_models": [2, 4, 5],
                "primary_models": [5],  # Financial services
                "business_translation": "Criminals become your customers",
                "typical_entry": ["stolen_credentials", "phishing"],
                "typical_cost": "$500K-$5M fraud losses",
                "recovery_time": "Ongoing monitoring",
                "prevention_roi": "30:1"
            },
            "pos_malware": {
                "affected_models": [1, 5],
                "primary_models": [1],  # Hybrid commerce
                "business_translation": "Every sale = stolen card",
                "typical_entry": ["third_party_compromise", "insider_threat"],
                "typical_cost": "$1M-$10M + fines",
                "recovery_time": "3-6 months",
                "prevention_roi": "20:1"
            },
            "cloud_breach": {
                "affected_models": [2, 3, 4, 5],
                "primary_models": [2],  # Critical software
                "business_translation": "Your cloud = their playground",
                "typical_entry": ["cloud_misconfiguration", "stolen_credentials"],
                "typical_cost": "$2M-$15M",
                "recovery_time": "1-3 months",
                "prevention_roi": "18:1"
            },
            "iot_botnet": {
                "affected_models": [1, 4, 6],
                "primary_models": [4],  # Digital ecosystem
                "business_translation": "Your devices attack others",
                "typical_entry": ["unpatched_systems"],
                "typical_cost": "$500K-$2M liability",
                "recovery_time": "1-2 months",
                "prevention_roi": "12:1"
            },
            "cryptojacking": {
                "affected_models": [2, 4, 6],
                "primary_models": [6],  # Legacy infrastructure
                "business_translation": "Your servers mine their crypto",
                "typical_entry": ["unpatched_systems", "cloud_misconfiguration"],
                "typical_cost": "$100K-$1M energy + performance",
                "recovery_time": "1-2 weeks",
                "prevention_roi": "8:1"
            },
            "business_email_compromise": {
                "affected_models": [1, 5, 7],
                "primary_models": [7],  # Supply chain
                "business_translation": "Fake invoices, real payments",
                "typical_entry": ["phishing", "stolen_credentials"],
                "typical_cost": "$500K-$5M direct loss",
                "recovery_time": "Immediate loss",
                "prevention_roi": "40:1"
            }
        }

    def analyze_threat(self, threat_data):
        """
        Analyzes a threat with both technical depth and business clarity
        Returns dual-language analysis for mid-level and executive audiences
        """
        # Extract threat indicators
        title = threat_data.get('title', '').lower()
        description = threat_data.get('description', '').lower()
        tags = [tag.lower() for tag in threat_data.get('tags', [])]
        iocs = threat_data.get('iocs', {})
        
        # Identify attack pattern
        detected_pattern = self._detect_attack_pattern(title, description, tags)
        
        # Get affected business models
        if detected_pattern:
            pattern_info = self.attack_patterns[detected_pattern]
            affected_models = pattern_info['affected_models']
            primary_models = pattern_info['primary_models']
        else:
            affected_models = []
            primary_models = []
        
        # Identify attack vector
        detected_vector = self._detect_attack_vector(title, description, tags, iocs)
        
        # Calculate business impact
        impact_analysis = self._analyze_business_impact(
            detected_pattern, 
            detected_vector,
            affected_models
        )
        
        # Build comprehensive analysis
        analysis = {
            "threat_analysis": {
                # Technical layer (for IT/Security)
                "technical": {
                    "attack_pattern": detected_pattern,
                    "attack_vector": detected_vector,
                    "ioc_count": sum(len(v) if isinstance(v, list) else 1 
                                    for v in iocs.values()),
                    "affected_systems": self._identify_affected_systems(iocs),
                    "ttps": self._extract_ttps(description, tags)
                },
                
                # Business layer (for executives)
                "business": {
                    "simple_explanation": self._get_simple_explanation(detected_pattern),
                    "cost_range": pattern_info.get('typical_cost', 'Unknown') 
                                 if detected_pattern else "Requires analysis",
                    "recovery_time": pattern_info.get('recovery_time', 'Unknown')
                                    if detected_pattern else "Varies",
                    "similar_incidents": self._get_similar_incidents(detected_pattern),
                    "key_question": self._get_key_question(detected_pattern)
                },
                
                # Bridge layer (for mid-level to pitch upward)
                "pitch_points": {
                    "elevator_pitch": self._create_elevator_pitch(
                        detected_pattern, 
                        impact_analysis
                    ),
                    "roi_statement": self._create_roi_statement(detected_pattern),
                    "urgency_driver": self._create_urgency_driver(
                        detected_pattern,
                        threat_data
                    ),
                    "competitor_angle": self._create_competitor_angle(detected_pattern)
                }
            },
            
            # Business model impact
            "business_model_impact": {
                "affected_models": affected_models,
                "primary_impact_models": primary_models,
                "model_names": {
                    str(m): self.business_models[m] 
                    for m in affected_models
                },
                "impact_narrative": self._create_impact_narrative(
                    primary_models,
                    detected_pattern
                )
            },
            
            # Actionable intelligence
            "recommendations": {
                "immediate_check": self._get_immediate_check(detected_pattern),
                "quick_win": self._get_quick_win(detected_pattern, detected_vector),
                "strategic_investment": self._get_strategic_investment(
                    detected_pattern,
                    primary_models
                ),
                "expected_roi": pattern_info.get('prevention_roi', 'High')
                               if detected_pattern else "10:1 typical"
            },
            
            # Executive decision support
            "executive_summary": {
                "threat_in_one_line": self._create_one_liner(
                    detected_pattern,
                    impact_analysis
                ),
                "business_risk": impact_analysis['primary_impact'],
                "financial_exposure": impact_analysis['financial_range'],
                "action_required": impact_analysis['action_urgency'],
                "board_ready_statement": self._create_board_statement(
                    detected_pattern,
                    impact_analysis
                )
            }
        }
        
        return analysis
    
    def _detect_attack_pattern(self, title, description, tags):
        """Detects attack pattern from threat indicators"""
        combined_text = f"{title} {description} {' '.join(tags)}"
        
        pattern_keywords = {
            'ransomware': ['ransomware', 'ransom', 'encrypt', 'lockbit', 'conti'],
            'api_exploitation': ['api', 'endpoint', 'rest', 'graphql', 'webhook'],
            'supply_chain': ['supply chain', 'vendor', 'third party', 'provider'],
            'data_exfiltration': ['exfiltrat', 'data theft', 'breach', 'leak'],
            'account_takeover': ['account takeover', 'ato', 'credential stuff'],
            'pos_malware': ['pos', 'point of sale', 'payment', 'card'],
            'cloud_breach': ['cloud', 'aws', 'azure', 'gcp', 's3'],
            'iot_botnet': ['iot', 'botnet', 'mirai', 'device'],
            'cryptojacking': ['crypto', 'mining', 'monero', 'coinhive'],
            'business_email_compromise': ['bec', 'ceo fraud', 'invoice', 'wire']
        }
        
        for pattern, keywords in pattern_keywords.items():
            if any(keyword in combined_text for keyword in keywords):
                return pattern
        
        return None
    
    def _detect_attack_vector(self, title, description, tags, iocs):
        """Detects how the attack happens"""
        combined_text = f"{title} {description} {' '.join(tags)}"
        
        vector_keywords = {
            'phishing': ['phish', 'spear', 'email', 'social'],
            'stolen_credentials': ['credential', 'password', 'brute', 'stuff'],
            'unpatched_systems': ['cve', 'vulnerab', 'exploit', 'patch'],
            'cloud_misconfiguration': ['misconfig', 'exposed', 'public', 'open'],
            'third_party_compromise': ['vendor', 'supply', 'third', 'partner'],
            'insider_threat': ['insider', 'employee', 'privileged', 'abuse']
        }
        
        for vector, keywords in vector_keywords.items():
            if any(keyword in combined_text for keyword in keywords):
                return vector
                
        # Check IOCs for vector hints
        if iocs.get('email', []):
            return 'phishing'
        elif iocs.get('hash', []) and 'malware' in combined_text:
            return 'unpatched_systems'
            
        return 'unknown'
    
    def _analyze_business_impact(self, pattern, vector, affected_models):
        """Analyzes business impact in executive terms"""
        if not pattern:
            return {
                'primary_impact': 'Unknown - requires investigation',
                'financial_range': 'Varies by industry',
                'action_urgency': 'Schedule assessment'
            }
        
        # Map patterns to primary business impacts
        impact_map = {
            'ransomware': 'operational',
            'data_exfiltration': 'customer',
            'supply_chain': 'operational',
            'cloud_breach': 'customer',
            'business_email_compromise': 'financial'
        }
        
        primary_impact_type = impact_map.get(pattern, 'operational')
        impact_info = self.business_impacts[primary_impact_type]
        
        # Determine urgency based on pattern and vector
        if pattern in ['ransomware', 'data_exfiltration'] and vector == 'phishing':
            urgency = "IMMEDIATE - Active campaigns detected"
        elif len(affected_models) > 5:
            urgency = "HIGH - Affects most business models"
        elif vector in ['unpatched_systems', 'cloud_misconfiguration']:
            urgency = "MODERATE - Proactive fix needed"
        else:
            urgency = "STANDARD - Include in quarterly review"
        
        # Get financial range from pattern
        pattern_info = self.attack_patterns.get(pattern, {})
        
        return {
            'primary_impact': impact_info['name'],
            'impact_examples': impact_info['examples'],
            'financial_range': pattern_info.get('typical_cost', 'Unknown'),
            'action_urgency': urgency
        }
    
    def _get_simple_explanation(self, pattern):
        """Returns exec-friendly explanation"""
        explanations = {
            'ransomware': "Attackers lock your systems and demand payment",
            'data_exfiltration': "Customer data stolen, trust and money lost",
            'supply_chain': "Your vendor's problem becomes your crisis",
            'api_exploitation': "Your digital connections turned against you",
            'cloud_breach': "Your cloud storage exposed to the world",
            'business_email_compromise': "Fake invoices, real money lost"
        }
        return explanations.get(pattern, "Sophisticated attack requiring analysis")
    
    def _get_similar_incidents(self, pattern):
        """Returns relevant examples by pattern"""
        if not pattern:
            return "Contact us for industry-specific examples"
            
        threat_info = self.cyber_threats.get(pattern, {})
        examples = threat_info.get('real_examples', {})
        
        # Format as executive-friendly list
        return [f"{industry.title()}: {impact}" 
                for industry, impact in examples.items()][:2]
    
    def _get_key_question(self, pattern):
        """The one question that makes executives think"""
        questions = {
            'ransomware': "Can you operate without computers for 10 days?",
            'data_exfiltration': "What % of customers would you lose after a breach?",
            'supply_chain': "Do you know your vendors' security scores?",
            'cloud_breach': "Who has access to your cloud accounts?",
            'business_email_compromise': "Could someone approve a wire with just email?"
        }
        return questions.get(pattern, "Is your security investment less than 1% of potential loss?")
    
    def _create_elevator_pitch(self, pattern, impact_analysis):
        """30-second pitch for mid-level to exec"""
        if not pattern:
            return "New threat detected that could impact operations. Worth investigating."
        
        pattern_info = self.attack_patterns[pattern]
        
        return (f"Companies like ours are losing {pattern_info['typical_cost']} "
                f"to {pattern} attacks. Recovery takes {pattern_info['recovery_time']}. "
                f"For {pattern_info['prevention_roi']} ROI, we can prevent this.")
    
    def _create_roi_statement(self, pattern):
        """Clear ROI for investment decision"""
        if not pattern:
            return "Typical security ROI is 10:1 (prevention vs incident cost)"
            
        pattern_info = self.attack_patterns[pattern]
        cost_range = pattern_info.get('typical_cost', '$1M-$5M')
        roi = pattern_info.get('prevention_roi', '10:1')
        
        # Extract minimum cost for calculation
        import re
        costs = re.findall(r'\$(\d+)([KM])', cost_range)
        if costs:
            min_cost = float(costs[0][0]) * (1000000 if costs[0][1] == 'M' else 1000)
            roi_num = float(roi.split(':')[0])
            prevention_cost = min_cost / roi_num
            
            return (f"Spend ${prevention_cost:,.0f} to prevent "
                   f"${min_cost:,.0f} minimum loss = {roi} ROI")
        
        return f"Prevention ROI typically {roi} for {pattern} attacks"
    
    def _create_urgency_driver(self, pattern, threat_data):
        """Why act now vs later"""
        # Check for active campaign indicators
        if 'campaign' in str(threat_data).lower() or 'active' in str(threat_data).lower():
            return "ACTIVE CAMPAIGN - Attackers targeting our industry NOW"
        
        urgency_map = {
            'ransomware': "3 competitors hit this quarter",
            'data_exfiltration': "New regulations = 10x higher fines",
            'supply_chain': "Your top vendor on breach watch list",
            'business_email_compromise': "Q4 = high wire transfer season"
        }
        
        return urgency_map.get(pattern, "Threat landscape evolving rapidly")
    
    def _create_competitor_angle(self, pattern):
        """Competitive advantage perspective"""
        angles = {
            'ransomware': "Competitors down = your market opportunity",
            'data_exfiltration': "Their breach = your customer gain",
            'supply_chain': "Secure supply chain = premium pricing power",
            'cloud_breach': "Cloud confidence = digital transformation edge"
        }
        return angles.get(pattern, "Security leadership = market differentiation")
    
    def _create_impact_narrative(self, primary_models, pattern):
        """Story of how this affects the specific business model"""
        if not primary_models or not pattern:
            return "Impact varies by business model"
        
        model_id = primary_models[0]
        model_name = self.business_models[model_id]
        
        narratives = {
            (1, 'ransomware'): "Stores can't process sales, online orders halt",
            (3, 'data_exfiltration'): "Your data IS your business - stolen means dead",
            (5, 'account_takeover'): "Fake transactions drain customer accounts",
            (6, 'ransomware'): "Legacy systems = longer recovery, higher cost",
            (7, 'supply_chain'): "One vendor breach cascades through your network",
            (8, 'data_exfiltration'): "Regulatory fines start at $10M for breaches"
        }
        
        key = (model_id, pattern)
        return narratives.get(key, f"{model_name} operations severely impacted")
    
    def _get_immediate_check(self, pattern):
        """What to check RIGHT NOW"""
        checks = {
            'ransomware': "Verify backups actually restore (test one now)",
            'phishing': "Check who clicked suspicious emails this week",
            'data_exfiltration': "Review who accessed customer DB last 30 days",
            'cloud_breach': "Scan for public S3 buckets/storage",
            'business_email_compromise': "Review wire transfer approvals process"
        }
        return checks.get(pattern, "Run basic vulnerability scan")
    
    def _get_quick_win(self, pattern, vector):
        """Low cost, high impact action"""
        if vector == 'phishing':
            return "Enable email warning banners for external senders ($0)"
        elif vector == 'stolen_credentials':
            return "Force password reset + MFA for admins ($10/user)"
        elif vector == 'unpatched_systems':
            return "Patch critical vulnerabilities this weekend"
        elif pattern == 'ransomware':
            return "Test restore 3 critical systems TODAY"
        else:
            return "Implement security awareness reminder (1 hour effort)"
    
    def _get_strategic_investment(self, pattern, models):
        """Longer-term investment recommendation"""
        if pattern == 'ransomware' and 6 in models:  # Legacy systems
            return "Modernization program - replace legacy incrementally"
        elif pattern == 'data_exfiltration' and 8 in models:  # Regulated
            return "Data loss prevention (DLP) + encryption program"
        elif pattern == 'supply_chain':
            return "Vendor risk management platform + audits"
        elif pattern == 'cloud_breach':
            return "Cloud security posture management (CSPM)"
        else:
            return "Comprehensive security assessment + roadmap"
    
    def _create_one_liner(self, pattern, impact):
        """The headline that gets attention"""
        if not pattern:
            return "New threat detected - assessment recommended"
        
        cost = self.attack_patterns[pattern].get('typical_cost', 'significant cost')
        impact_type = impact['primary_impact']
        
        return f"{pattern.replace('_', ' ').title()} attacks cost {cost} and {impact_type.lower()}"
    
    def _create_board_statement(self, pattern, impact):
        """What to tell the board"""
        if not pattern:
            return "Emerging threat requires investigation to quantify risk"
        
        pattern_info = self.attack_patterns[pattern]
        
        return (f"Industry facing {pattern.replace('_', ' ')} attacks with "
                f"{pattern_info['typical_cost']} average loss. Our exposure assessment "
                f"shows {impact['action_urgency'].split(' - ')[0]} priority. "
                f"Recommend {pattern_info['prevention_roi']} ROI prevention investment.")
    
    def _identify_affected_systems(self, iocs):
        """Maps IOCs to business systems"""
        systems = []
        if iocs.get('email'):
            systems.append('Email/Communications')
        if iocs.get('ip') or iocs.get('domain'):
            systems.append('Web/Digital Properties')
        if iocs.get('hash'):
            systems.append('Endpoints/Workstations')
        if iocs.get('url'):
            systems.append('Web Applications')
        return systems or ['Multiple Systems']
    
    def _extract_ttps(self, description, tags):
        """Extract tactics, techniques, procedures"""
        ttps = []
        
        # Simple TTP detection
        if any(t in description for t in ['phish', 'spear', 'social']):
            ttps.append('T1566 - Phishing')
        if any(t in description for t in ['ransomware', 'encrypt']):
            ttps.append('T1486 - Data Encrypted')
        if any(t in description for t in ['exfiltrat', 'steal', 'theft']):
            ttps.append('T1567 - Exfiltration')
            
        return ttps[:3]  # Top 3 most relevant


# Enhanced report generator for dual audience
def generate_enhanced_report(threat_data, mapper):
    """
    Generates a report suitable for both technical and executive audiences
    """
    analysis = mapper.analyze_threat(threat_data)
    
    report = {
        "metadata": {
            "report_date": "2024-07-13",
            "threat_id": threat_data.get('id', 'Unknown'),
            "classification": "UNCLASSIFIED"
        },
        
        # Executive section (1 page)
        "executive_briefing": {
            "headline": analysis['executive_summary']['threat_in_one_line'],
            "business_risk": analysis['executive_summary']['business_risk'],
            "financial_exposure": analysis['executive_summary']['financial_exposure'],
            "similar_incidents": analysis['threat_analysis']['business']['similar_incidents'],
            "key_question": analysis['threat_analysis']['business']['key_question'],
            "recommended_action": analysis['executive_summary']['action_required'],
            "roi_justification": analysis['threat_analysis']['pitch_points']['roi_statement']
        },
        
        # Mid-level pitch section
        "management_summary": {
            "elevator_pitch": analysis['threat_analysis']['pitch_points']['elevator_pitch'],
            "urgency_reason": analysis['threat_analysis']['pitch_points']['urgency_driver'],
            "competitive_angle": analysis['threat_analysis']['pitch_points']['competitor_angle'],
            "quick_wins": [
                analysis['recommendations']['immediate_check'],
                analysis['recommendations']['quick_win']
            ],
            "investment_ask": analysis['recommendations']['strategic_investment']
        },
        
        # Technical appendix
        "technical_details": {
            "attack_pattern": analysis['threat_analysis']['technical']['attack_pattern'],
            "attack_vector": analysis['threat_analysis']['technical']['attack_vector'],
            "affected_systems": analysis['threat_analysis']['technical']['affected_systems'],
            "ttps": analysis['threat_analysis']['technical']['ttps'],
            "ioc_summary": f"{analysis['threat_analysis']['technical']['ioc_count']} indicators",
            "affected_business_models": analysis['business_model_impact']['model_names']
        }
    }
    
    return report


# Example usage
if __name__ == "__main__":
    # Create enhanced mapper
    mapper = EnhancedBusinessModelMapper()
    
    # Example threat
    sample_threat = {
        "id": "THREAT-2024-001",
        "title": "LockBit Ransomware Targeting LATAM Retail",
        "description": "Active campaign using phishing emails to deploy ransomware",
        "tags": ["ransomware", "lockbit", "retail", "latam"],
        "iocs": {
            "email": ["malicious@fake-invoice.com"],
            "hash": ["d4f5g6h7j8k9"],
            "domain": ["command-control.bad"]
        }
    }
    
    # Generate analysis
    analysis = mapper.analyze_threat(sample_threat)
    
    # Generate report
    report = generate_enhanced_report(sample_threat, mapper)
    
    # Print executive briefing
    print("=== EXECUTIVE BRIEFING ===")
    print(f"Headline: {report['executive_briefing']['headline']}")
    print(f"Risk: {report['executive_briefing']['business_risk']}")
    print(f"Exposure: {report['executive_briefing']['financial_exposure']}")
    print(f"Action: {report['executive_briefing']['recommended_action']}")
    print(f"\nThe Question: {report['executive_briefing']['key_question']}")
    
    print("\n=== FOR YOUR MANAGER ===")
    print(f"30-Second Pitch: {report['management_summary']['elevator_pitch']}")
    print(f"Why Now: {report['management_summary']['urgency_reason']}")
    print(f"Quick Wins: {', '.join(report['management_summary']['quick_wins'])}")
