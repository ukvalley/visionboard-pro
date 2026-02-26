const OpenAI = require('openai');

// Initialize OpenAI client
let openai = null;

const getOpenAI = () => {
  if (!openai && process.env.OPENAI_API_KEY) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }
  return openai;
};

// System prompt for business coaching
const SYSTEM_PROMPT = `You are Patrick, an expert business coach specializing in the Scaling Up methodology by Verne Harnish. You help entrepreneurs and business leaders with:

1. **Strategy** - One-Page Strategic Plan, BHAG, Core Values, Mission/Vision
2. **Execution** - Rockefeller Habits, Priorities, KPIs, Meeting Rhythms
3. **People** - FACe Charts, PACe Charts, 9-Box Grid, Hiring, Culture
4. **Cash** - Financial metrics, Cash flow, Revenue models, Forecasting

Guidelines:
- Be concise and actionable (2-3 paragraphs max unless asked for more detail)
- Reference specific Scaling Up frameworks when relevant
- Ask clarifying questions when needed
- Provide examples from successful companies when helpful
- Be encouraging but honest about challenges
- Format responses with bullet points or numbered lists for readability

If asked about topics outside business strategy, politely redirect to business-related topics.`;

// Chat with AI
const chat = async (messages, context = {}) => {
  const client = getOpenAI();

  if (!client) {
    // Return a helpful message if no API key configured
    return {
      success: false,
      message: 'AI assistant is not configured. Please add OPENAI_API_KEY to your environment variables.',
      fallback: getFallbackResponse(messages[messages.length - 1]?.content)
    };
  }

  try {
    // Build context about the user's vision board if provided
    let contextPrompt = '';
    if (context.visionBoard) {
      contextPrompt = `\n\nContext about the user's business:\n${JSON.stringify(context.visionBoard, null, 2)}`;
    }

    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini', // Cost-effective model
      messages: [
        { role: 'system', content: SYSTEM_PROMPT + contextPrompt },
        ...messages.map(m => ({
          role: m.role,
          content: m.content
        }))
      ],
      max_tokens: 1000,
      temperature: 0.7
    });

    return {
      success: true,
      message: response.choices[0].message.content
    };
  } catch (error) {
    console.error('AI Chat Error:', error);
    return {
      success: false,
      message: 'Sorry, I encountered an error. Please try again.',
      error: error.message
    };
  }
};

// Generate AI suggestions for vision board
const generateAISuggestions = async (visionBoard, monthlyUpdates = []) => {
  const client = getOpenAI();

  // If no OpenAI key, use rule-based suggestions
  if (!client) {
    return generateRuleBasedSuggestions(visionBoard, monthlyUpdates);
  }

  try {
    const prompt = `Analyze this business vision board and provide 3-5 actionable suggestions for improvement:

${JSON.stringify(visionBoard, null, 2)}

Provide suggestions in JSON format as an array of objects with:
- type: (warning|recommendation|info|success|alert)
- category: (Strategy|Execution|People|Cash|Systems|Marketing|Lifestyle)
- title: (short title)
- message: (detailed message)
- action: (specific next step)
- priority: (high|medium|low)`;

    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a business strategy expert. Respond only with valid JSON array.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 1500,
      temperature: 0.7
    });

    const content = response.choices[0].message.content;

    try {
      // Try to extract JSON from response
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return JSON.parse(content);
    } catch {
      // Fall back to rule-based if parsing fails
      return generateRuleBasedSuggestions(visionBoard, monthlyUpdates);
    }
  } catch (error) {
    console.error('AI Suggestions Error:', error);
    return generateRuleBasedSuggestions(visionBoard, monthlyUpdates);
  }
};

// Analyze financial data
const analyzeFinancials = async (financialData) => {
  const client = getOpenAI();

  if (!client) {
    return { success: false, analysis: 'AI analysis not configured. Add OPENAI_API_KEY to enable.' };
  }

  try {
    const prompt = `Analyze these financial metrics and provide insights:

${JSON.stringify(financialData, null, 2)}

Provide a financial health analysis with:
1. Overall financial health assessment (1-10 score)
2. Key strengths
3. Areas of concern
4. 3 specific recommendations
5. Key metrics to watch`;

    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a CFO consultant. Be specific and actionable.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 1000,
      temperature: 0.7
    });

    return {
      success: true,
      analysis: response.choices[0].message.content
    };
  } catch (error) {
    console.error('Financial Analysis Error:', error);
    return { success: false, analysis: 'Error analyzing financials.', error: error.message };
  }
};

// Run risk simulation
const simulateRiskScenario = async (risks, projects, priorities) => {
  const client = getOpenAI();

  if (!client) {
    return { success: false, simulation: 'AI simulation not configured. Add OPENAI_API_KEY to enable.' };
  }

  try {
    const prompt = `Run a risk scenario simulation for this business:

Risks:
${JSON.stringify(risks, null, 2)}

Projects:
${JSON.stringify(projects, null, 2)}

Priorities:
${JSON.stringify(priorities, null, 2)}

Simulate a moderate market downturn scenario and provide:
1. Impact assessment on current projects
2. Which risks are most likely to materialize
3. Recommended immediate actions
4. Cash flow implications
5. Opportunities in the crisis`;

    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a risk management consultant. Be realistic and helpful.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 1200,
      temperature: 0.7
    });

    return {
      success: true,
      simulation: response.choices[0].message.content
    };
  } catch (error) {
    console.error('Risk Simulation Error:', error);
    return { success: false, simulation: 'Error running simulation.', error: error.message };
  }
};

// Fallback responses when AI is not configured
const getFallbackResponse = (message) => {
  const responses = {
    strategy: 'For strategy, I recommend starting with your One-Page Strategic Plan. Define your Core Values, Mission, and Vision first. Then set your 3-5 year BHAG (Big Hairy Audacious Goal). Would you like me to explain any of these?',
    execution: 'For execution, focus on the Rockefeller Habits: daily huddles, weekly meetings, and quarterly planning. Set clear priorities and track KPIs. The key is rhythm and consistency.',
    people: 'For people management, use the FACe Chart to clarify who owns what function. The 9-Box Grid helps with talent assessment. Regular feedback and clear accountability are essential.',
    cash: 'For cash management, track your cash conversion cycle, maintain a 13-week cash forecast, and focus on accelerating receivables. Cash is king in growing businesses!',
    okr: 'OKRs (Objectives and Key Results) help you set ambitious goals. Write an inspiring objective, then add 3-5 measurable key results. Track progress weekly and score at quarter end.',
    default: 'I\'m here to help with business strategy, execution, people, and cash questions. Ask me about OKRs, FACe Charts, Rockefeller Habits, or any Scaling Up topic!'
  };

  const keywords = Object.keys(responses);
  const matched = keywords.find(k => message?.toLowerCase().includes(k)) || 'default';
  return responses[matched];
};

// Rule-based suggestions (fallback when AI is not configured)
const generateRuleBasedSuggestions = (visionBoard, monthlyUpdates) => {
  const suggestions = [];

  if (!visionBoard || !visionBoard.sections) {
    return suggestions;
  }

  const financialGoals = visionBoard.sections.financialGoals?.data || {};
  const teamPlan = visionBoard.sections.teamPlan?.data || {};
  const systemsToBuild = visionBoard.sections.systemsToBuild?.data || {};

  // Revenue vs Team Analysis
  if (financialGoals.annualRevenue > 1000000) {
    const teamCount = teamPlan.roles?.length || 0;
    if (teamCount < 3) {
      suggestions.push({
        type: 'warning',
        category: 'People',
        title: 'Team Scaling Needed',
        message: `Your annual revenue target of $${financialGoals.annualRevenue.toLocaleString()} is ambitious. Consider expanding your team capacity.`,
        action: 'Review your team plan to ensure adequate support for revenue targets.',
        priority: 'high'
      });
    }
  }

  // Systems vs Revenue Alignment
  const systems = systemsToBuild.systems || [];
  const completedSystems = systems.filter(s => s.status === 'completed').length;
  if (completedSystems < 3 && financialGoals.annualRevenue > 500000) {
    suggestions.push({
      type: 'recommendation',
      category: 'Systems',
      title: 'Build Core Systems First',
      message: `For a revenue target of $${financialGoals.annualRevenue?.toLocaleString()}, focus on building CRM, Sales Funnel, and Operations systems before scaling.`,
      action: 'Prioritize system development in your quarterly planning.',
      priority: 'high'
    });
  }

  // Profit Margin Check
  const profitMargin = financialGoals.profitMargin || 0;
  if (profitMargin < 15 && profitMargin > 0) {
    suggestions.push({
      type: 'alert',
      category: 'Cash',
      title: 'Profit Margin Alert',
      message: `Your target profit margin of ${profitMargin}% is below the recommended 15%.`,
      action: 'Review your pricing strategy and operational costs.',
      priority: 'high'
    });
  }

  return suggestions;
};

module.exports = {
  chat,
  generateAISuggestions,
  analyzeFinancials,
  simulateRiskScenario
};