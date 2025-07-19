import React, { useState } from 'react';
import styled from '@emotion/styled';

const DemoContainer = styled.div`
  min-height: 100vh;
  background: #091F2C;
  color: #ffffff;
  padding: 40px 20px;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 60px;
`;

const Title = styled.h1`
  font-size: 48px;
  background: linear-gradient(45deg, #B4B5DF, #6B9BD1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 20px;
`;

const Subtitle = styled.p`
  font-size: 20px;
  color: #A6BBC8;
  max-width: 600px;
  margin: 0 auto;
`;

const DemoSection = styled.section`
  max-width: 1200px;
  margin: 0 auto 60px;
  background: rgba(180, 181, 223, 0.1);
  padding: 40px;
  border-radius: 16px;
  border: 1px solid rgba(180, 181, 223, 0.2);
`;

const SectionTitle = styled.h2`
  font-size: 32px;
  color: #B4B5DF;
  margin-bottom: 30px;
`;

const ScenarioGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin-top: 30px;
`;

const ScenarioCard = styled.div`
  background: rgba(13, 25, 41, 0.7);
  padding: 30px;
  border-radius: 12px;
  border: 1px solid rgba(180, 181, 223, 0.2);
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    border-color: #6B9BD1;
    box-shadow: 0 10px 30px rgba(107, 155, 209, 0.2);
  }
`;

const MetricDisplay = styled.div`
  text-align: center;
  margin: 20px 0;
`;

const MetricValue = styled.div`
  font-size: 64px;
  font-weight: bold;
  color: ${props => props.color || '#ffffff'};
  line-height: 1;
`;

const MetricLabel = styled.div`
  font-size: 16px;
  color: #A6BBC8;
  margin-top: 10px;
`;

const Alert = styled.div`
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  padding: 20px;
  border-radius: 8px;
  margin: 20px 0;
`;

const ActionButton = styled.button`
  background: linear-gradient(45deg, #B4B5DF, #6B9BD1);
  color: #091F2C;
  border: none;
  padding: 15px 30px;
  border-radius: 8px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 20px;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 5px 20px rgba(107, 155, 209, 0.4);
  }
`;

const Calculator = styled.div`
  background: rgba(13, 25, 41, 0.9);
  padding: 30px;
  border-radius: 12px;
  margin-top: 30px;
`;

const Slider = styled.input`
  width: 100%;
  margin: 20px 0;
`;

const ROIDisplay = styled.div`
  font-size: 36px;
  color: #4ade80;
  text-align: center;
  margin-top: 20px;
`;

export const Demo: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState<'ceo' | 'ciso' | 'board' | null>(null);
  const [investmentLevel, setInvestmentLevel] = useState(50000);

  const calculateROI = (investment: number) => {
    const riskReduction = investment / 1000; // Simplified calculation
    const savedLosses = riskReduction * 15000; // Average loss prevention
    return Math.round((savedLosses - investment) / investment * 100);
  };

  return (
    <DemoContainer>
      <Header>
        <Title>Interactive Demo - DII Platform</Title>
        <Subtitle>
          Experience how Digital Immunity Intelligence transforms your security conversations
        </Subtitle>
      </Header>

      <DemoSection>
        <SectionTitle>1. Choose Your Audience</SectionTitle>
        <ScenarioGrid>
          <ScenarioCard onClick={() => setSelectedScenario('ceo')}>
            <h3>CEO / Executive</h3>
            <p>Focus on business impact, competitive advantage, and ROI</p>
          </ScenarioCard>
          <ScenarioCard onClick={() => setSelectedScenario('ciso')}>
            <h3>CISO / Security</h3>
            <p>Technical metrics, threat landscape, and security posture</p>
          </ScenarioCard>
          <ScenarioCard onClick={() => setSelectedScenario('board')}>
            <h3>Board / Investors</h3>
            <p>Risk quantification, compliance, and industry benchmarks</p>
          </ScenarioCard>
        </ScenarioGrid>
      </DemoSection>

      {selectedScenario && (
        <DemoSection>
          <SectionTitle>2. Key Conversation Points</SectionTitle>
          
          {selectedScenario === 'ceo' && (
            <>
              <Alert>
                <h3>⚠️ Business Critical Alert</h3>
                <p>Your immunity score of 2.8 puts you 45% below industry average</p>
                <p>Estimated annual risk exposure: $2.3M</p>
              </Alert>
              
              <MetricDisplay>
                <MetricValue color="#ef4444">2.8</MetricValue>
                <MetricLabel>Current Immunity Score</MetricLabel>
              </MetricDisplay>

              <h3>Competitive Analysis</h3>
              <p>3 of your top 5 competitors have immunity scores above 4.0</p>
              <p>They're 60% less likely to suffer business disruption from cyber attacks</p>
            </>
          )}

          {selectedScenario === 'ciso' && (
            <>
              <h3>Technical Breakdown</h3>
              <ScenarioGrid>
                <MetricDisplay>
                  <MetricValue color="#ef4444">12</MetricValue>
                  <MetricLabel>TRD Score (Critical)</MetricLabel>
                </MetricDisplay>
                <MetricDisplay>
                  <MetricValue color="#fbbf24">75</MetricValue>
                  <MetricLabel>AER Score (Warning)</MetricLabel>
                </MetricDisplay>
                <MetricDisplay>
                  <MetricValue color="#4ade80">72</MetricValue>
                  <MetricLabel>HFP Score (Good)</MetricLabel>
                </MetricDisplay>
              </ScenarioGrid>
              
              <h3>Immediate Actions Required</h3>
              <ul>
                <li>Patch 23 critical vulnerabilities in production systems</li>
                <li>Implement MFA for 340 privileged accounts</li>
                <li>Update incident response plan (last updated 18 months ago)</li>
              </ul>
            </>
          )}

          {selectedScenario === 'board' && (
            <>
              <h3>Industry Benchmark</h3>
              <p>Your organization ranks in the bottom 25% for digital immunity in your sector</p>
              
              <MetricDisplay>
                <MetricValue color="#ef4444">25th</MetricValue>
                <MetricLabel>Percentile in Industry</MetricLabel>
              </MetricDisplay>

              <h3>Compliance Risk</h3>
              <p>Current posture may not meet upcoming EU DORA requirements</p>
              <p>Potential fines: Up to 2% of annual revenue</p>
            </>
          )}
        </DemoSection>
      )}

      {selectedScenario && (
        <DemoSection>
          <SectionTitle>3. ROI Calculator</SectionTitle>
          <Calculator>
            <h3>Investment Simulator</h3>
            <p>Monthly Security Investment: ${investmentLevel.toLocaleString()}</p>
            <Slider
              type="range"
              min="10000"
              max="200000"
              step="5000"
              value={investmentLevel}
              onChange={(e) => setInvestmentLevel(Number(e.target.value))}
            />
            
            <ROIDisplay>
              {calculateROI(investmentLevel)}% ROI
            </ROIDisplay>
            <p style={{ textAlign: 'center', color: '#A6BBC8' }}>
              Within 12 months based on risk reduction
            </p>
          </Calculator>

          <ActionButton>
            Schedule Strategy Session →
          </ActionButton>
        </DemoSection>
      )}

      <DemoSection>
        <SectionTitle>4. Next Steps</SectionTitle>
        <ol style={{ fontSize: '18px', lineHeight: '2' }}>
          <li>Share this dashboard with your team</li>
          <li>Schedule a 30-minute deep dive</li>
          <li>Get your custom improvement roadmap</li>
          <li>Start tracking progress weekly</li>
        </ol>
      </DemoSection>
    </DemoContainer>
  );
};