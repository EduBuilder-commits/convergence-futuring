import { NextRequest, NextResponse } from 'next/server'

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || 'sk-ant-placeholder'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, data } = body

    let prompt = ''

    switch (type) {
      case 'scenario_analysis':
        prompt = `You are a strategic futuring expert analyzing scenarios for educational district planning.

Analyze the following scenarios and provide:
1. Risk assessment for each scenario (1-100)
2. Probability of occurrence (%)
3. Key driving factors
4. Recommended actions
5. Early warning indicators to monitor

Scenarios:
${JSON.stringify(data.scenarios, null, 2)}

Provide a detailed analysis in JSON format with the following structure:
{
  "analyses": [
    {
      "scenario": "scenario name",
      "riskScore": 1-100,
      "probability": 0-100,
      "drivingFactors": ["factor1", "factor2"],
      "recommendedActions": ["action1", "action2"],
      "earlyWarnings": ["warning1", "warning2"],
      "timeline": "short/medium/long term",
      "equityImpact": "high/medium/low",
      "affectedStakeholders": ["stakeholder1"]
    }
  ],
  "crossScenarioInsights": "key insights across all scenarios",
  "priorityActions": ["top 3 actions to take"]
}`

      case 'monte_carlo_analysis':
        prompt = `You are a Monte Carlo simulation expert analyzing probabilistic outcomes.

Analyze the following simulation results and provide:
1. Interpretation of the probability distribution
2. Key insights about uncertainty
3. Risk assessment
4. Recommendations for decision-making
5. What drives the variance

Simulation Results:
- Mean: ${data.mean}
- Median: ${data.median}
- Std Dev: ${data.stdDev}
- P10: ${data.p10}
- P90: ${data.p90}
- Iterations: ${data.iterations}

Variables:
${JSON.stringify(data.variables, null, 2)}

Question: ${data.question}

Provide analysis in JSON:
{
  "interpretation": "what the results mean in plain language",
  "confidence": "high/medium/low",
  "keyInsights": ["insight1", "insight2"],
  "decisionGuidance": "how to use these results for decisions",
  "riskFactors": ["factor1", "factor2"],
  "recommendedScenario": "conservative/moderate/optimistic",
  "equityConsiderations": "any equity implications"
}`

      case 'stakeholder_analysis':
        prompt = `You are a stakeholder analysis expert for strategic planning.

Analyze the following stakeholders and provide:
1. Power/Interest grid positioning
2. Engagement strategy recommendations
3. Key concerns for each stakeholder
4. Potential coalition partners
5. Resistance factors

Stakeholders:
${JSON.stringify(data.stakeholders, null, 2)}

Provide analysis in JSON:
{
  "stakeholderPositions": [
    {
      "name": "stakeholder name",
      "power": "high/medium/low",
      "interest": "high/medium/low",
      "position": "grid quadrant",
      "engagementStrategy": "how to engage",
      "keyConcerns": ["concern1"],
      "potentialSupport": "high/medium/low",
      "resistanceRisk": "high/medium/low"
    }
  ],
  "coalitions": ["potential coalitions"],
  "recommendedActions": ["priority actions"],
  "communicationPlan": "key messages by stakeholder"
}`

      case 'trend_analysis':
        prompt = `You are a data analyst specializing in historical trends and forecasting.

Analyze the following historical data and provide:
1. Trend interpretation
2. Seasonality patterns
3. Growth/decline assessment
4. Forecast for next periods
5. Anomaly detection

Historical Data:
${JSON.stringify(data.historical, null, 2)}

Provide analysis in JSON:
{
  "trendSummary": "overall trend description",
  "growthRate": "percentage growth/decline",
  "seasonality": "any seasonal patterns",
  "anomalies": ["any detected anomalies"],
  "forecast": {
    "nextPeriod": "predicted value",
    "confidence": "high/medium/low",
    "range": { "low": X, "high": Y }
  },
  "equityGaps": "any disparities by subgroup",
  "recommendations": ["actions to take"]
}`

      case 'future_wheel':
        prompt = `You are a futures thinking expert using the Future Wheel methodology.

Analyze the following trend/force and map its impacts:
1. First-order impacts (direct)
2. Second-order impacts (indirect)
3. Third-order impacts (ripple effects)
4. Interconnections between impacts
5. Critical uncertainties

Trend/Force: ${data.trend}
Context: ${data.context}

Provide analysis in JSON:
{
  "center": "the central trend/force",
  "firstOrder": [
    { "impact": "direct impact", "type": "positive/negative/neutral" }
  ],
  "secondOrder": [
    { "impact": "indirect impact", "linkedTo": "first order impact" }
  ],
  "thirdOrder": [
    { "impact": "ripple effect", "linkedTo": "second order" }
  ],
  "interconnections": ["key connections between impacts"],
  "criticalUncertainties": ["most uncertain outcomes"],
  "strategicImplications": "what this means for planning"
}`

      case 'cross_impact':
        prompt = `You are an expert in Cross-Impact Analysis for strategic planning.

Analyze the following forces and their interdependencies:
1. How each force impacts others
2. Feedback loops
3. System behaviors
4. Leverage points
5. Tipping points

Forces:
${JSON.stringify(data.forces, null, 2)}

Provide analysis in JSON:
{
  "impacts": [
    {
      "from": "force A",
      "to": "force B",
      "strength": "strong/medium/weak",
      "direction": "positive/negative",
      "timeline": "short/medium/long"
    }
  ],
  "feedbackLoops": ["identified loops"],
  "leveragePoints": ["best intervention points"],
  "tippingPoints": ["potential triggers"],
  "systemDynamics": "overall system behavior",
  "strategicRecommendations": ["priority actions"]
}`

      case 'equity_projection':
        prompt = `You are an equity-centered data analyst for educational planning.

Analyze the following subgroup data and provide:
1. Achievement gap identification
2. Disparity trends
3. Equity-focused projections
4. Targeted intervention recommendations
5. Resource allocation guidance

Data by Subgroup:
${JSON.stringify(data.subgroups, null, 2)}

District Context: ${data.context}

Provide analysis in JSON:
{
  "gaps": [
    {
      "metric": "metric name",
      "subgroupVsDistrict": "percentage difference",
      "trend": "improving/worsening/stable",
      "significance": "high/medium/low"
    }
  ],
  "projections": {
    "ifNoAction": "predicted outcome",
    "withIntervention": "predicted outcome",
    "timeline": "by when"
  },
  "interventions": [
    {
      "target": "subgroup or gap",
      "approach": "recommended approach",
      "expectedImpact": "percentage improvement"
    }
  ],
  "resourceNeeds": "estimated requirements",
  "equityScore": "1-100 score"
}`

      default:
        return NextResponse.json({ error: 'Unknown analysis type' }, { status: 400 })
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4000,
        messages: [{ role: 'user', content: prompt }]
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Anthropic API error:', errorText)
      
      // Return mock data for demo purposes
      return NextResponse.json({
        mock: true,
        message: 'Using demo analysis',
        type,
        analysis: getMockAnalysis(type)
      })
    }

    const result = await response.json()
    const content = result.content[0].text
    
    try {
      const parsed = JSON.parse(content)
      return NextResponse.json(parsed)
    } catch {
      return NextResponse.json({ text: content, raw: true })
    }

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ 
      error: 'Analysis failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

function getMockAnalysis(type: string) {
  switch (type) {
    case 'scenario_analysis':
      return {
        analyses: [
          { scenario: 'Baseline', riskScore: 35, probability: 45, recommendedActions: ['Continue current strategy'] },
          { scenario: 'Transformation', riskScore: 25, probability: 30, recommendedActions: ['Prepare for digital shift'] },
          { scenario: 'Constraint', riskScore: 55, probability: 20, recommendedActions: ['Build reserves', 'Diversify funding'] }
        ],
        priorityActions: ['Monitor key indicators', 'Build strategic reserves']
      }
    case 'monte_carlo_analysis':
      return {
        interpretation: 'Results show moderate uncertainty with 80% confidence interval',
        confidence: 'medium',
        keyInsights: ['Main driver is enrollment change', 'Budget variance is within acceptable range'],
        decisionGuidance: 'Plan for conservative scenario while watching leading indicators'
      }
    default:
      return { message: 'Demo analysis available' }
  }
}
