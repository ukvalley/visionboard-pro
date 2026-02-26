// Module Educational Guides - Explains each module to beginners

export const moduleGuides = {
  // Target Tracker
  okrs: {
    title: 'OKRs - Objectives & Key Results',
    what: 'OKRs are a goal-setting framework that helps organizations define ambitious objectives and track their achievement through measurable key results.',
    why: 'Used by Google, Intel, and thousands of companies to align teams and drive measurable outcomes. They create focus, alignment, and accountability.',
    how: [
      '1. Write an inspiring Objective (qualitative goal)',
      '2. Add 3-5 measurable Key Results (quantitative metrics)',
      '3. Set a timeline (usually quarterly)',
      '4. Track progress weekly/monthly',
      '5. Score at end of period (0.0 to 1.0)'
    ],
    example: {
      objective: 'Become the #1 project management tool for small businesses',
      keyResults: [
        'Increase monthly active users from 10K to 50K',
        'Achieve Net Promoter Score of 50+',
        'Reduce customer churn to under 5%'
      ]
    },
    tips: [
      'Set ambitious goals - 70% achievement is good!',
      'OKRs should cascade from company to teams to individuals',
      'Don\'t tie OKRs directly to compensation',
      'Review and update regularly'
    ]
  },

  smartGoals: {
    title: 'SMART Goals Framework',
    what: 'SMART is an acronym that ensures goals are well-defined and achievable: Specific, Measurable, Achievable, Relevant, Time-bound.',
    why: 'Vague goals lead to vague results. SMART goals create clarity, focus, and a clear path to achievement.',
    how: [
      'Specific: What exactly will you accomplish?',
      'Measurable: How will you know when it\'s done?',
      'Achievable: Is it realistic with available resources?',
      'Relevant: Does it align with your bigger vision?',
      'Time-bound: What\'s the deadline?'
    ],
    example: {
      bad: 'I want to grow my business',
      good: 'Increase monthly revenue from $50K to $75K by December 31st by launching 2 new products and increasing marketing spend by 20%'
    },
    tips: [
      'Write goals down - written goals are 42% more likely to be achieved',
      'Break large goals into smaller milestones',
      'Share goals with someone for accountability'
    ]
  },

  quarterlyPlan: {
    title: 'Quarterly Planning',
    what: 'A quarterly plan breaks your annual goals into 90-day focused execution periods with specific themes and actions.',
    why: '90 days is the perfect planning horizon - long enough to accomplish something meaningful, short enough to maintain urgency.',
    how: [
      '1. Review annual goals and assess progress',
      '2. Choose ONE theme/focus for the quarter',
      '3. Set 3-5 key initiatives that support the theme',
      '4. Assign owners and deadlines',
      '5. Review weekly, adjust as needed'
    ],
    example: {
      q1: { theme: 'Foundation', focus: 'Build core product and get first 100 users' },
      q2: { theme: 'Growth', focus: 'Scale to 1000 users, launch marketing' },
      q3: { theme: 'Optimize', focus: 'Improve retention, add premium features' },
      q4: { theme: 'Scale', focus: 'Expand team, prepare for next year' }
    }
  },

  kpis: {
    title: 'KPI Dashboard - Key Performance Indicators',
    what: 'KPIs are quantifiable metrics that show how effectively you\'re achieving key business objectives.',
    why: 'What gets measured gets managed. KPIs give you visibility into business health and early warning of problems.',
    how: [
      '1. Identify 5-10 metrics that truly matter',
      '2. Set targets based on benchmarks or goals',
      '3. Track consistently (daily/weekly/monthly)',
      '4. Review trends, not just snapshots',
      '5. Take action when metrics go off track'
    ],
    categories: {
      financial: ['Revenue', 'Gross Margin', 'Cash Flow', 'ARR/MRR'],
      sales: ['Leads', 'Conversion Rate', 'Average Deal Size', 'Sales Cycle'],
      customer: ['NPS', 'Churn Rate', 'Customer Lifetime Value', 'Acquisition Cost'],
      operational: ['On-time Delivery', 'Quality Score', 'Utilization Rate'],
      people: ['Employee Satisfaction', 'Turnover Rate', 'Productivity']
    }
  },

  // Resource Management
  faceChart: {
    title: 'FACe Chart - Functional Accountability Chart',
    what: 'A FACe Chart clarifies who owns what FUNCTION in your organization. Unlike an org chart (which shows people), a FACe chart shows accountability for each business function.',
    why: 'Most small businesses have confusion about who owns what. This leads to dropped balls, duplication of work, and frustration. FACe eliminates ambiguity.',
    how: [
      '1. List all major functions (Sales, Marketing, Finance, etc.)',
      '2. For each function, assign one person as Owner (O)',
      '3. Identify who is Accountable (A) if different',
      '4. Note who should be Consulted (C) before decisions',
      '5. List who should be Informed (I) of outcomes'
    ],
    raci: {
      owner: 'Makes decisions, takes responsibility',
      accountable: 'Ultimately answerable for success',
      consulted: 'Provides input before decisions',
      informed: 'Kept in the loop after decisions'
    },
    example: {
      function: 'Sales',
      owner: 'VP Sales',
      accountable: 'CEO',
      consulted: 'Marketing, Product',
      informed: 'Finance, Operations'
    },
    tips: [
      'Every function needs ONE owner - no sharing',
      'Owner doesn\'t mean doing all the work',
      'Review quarterly as organization changes'
    ]
  },

  paceChart: {
    title: 'PACe Chart - Process Accountability Chart',
    what: 'While FACe covers functions, PACe covers PROCESSES. It documents who owns each key business process and how often it runs.',
    why: 'Processes are how work gets done. Without clear process ownership, things fall through cracks, quality varies, and scaling becomes impossible.',
    how: [
      '1. Identify your 10-20 most important processes',
      '2. Name the process clearly (e.g., "Lead Qualification")',
      '3. Assign a single Process Owner',
      '4. Define frequency (daily, weekly, monthly, on-demand)',
      '5. Document the process steps',
      '6. Track if process is working'
    ],
    example: [
      { process: 'Daily Huddle', owner: 'Each Team Lead', frequency: 'Daily, 9am' },
      { process: 'Weekly Pipeline Review', owner: 'VP Sales', frequency: 'Friday 2pm' },
      { process: 'Monthly Financial Close', owner: 'CFO', frequency: 'By 10th of month' },
      { process: 'Customer Onboarding', owner: 'Customer Success', frequency: 'Per new customer' }
    ]
  },

  nineBoxGrid: {
    title: '9-Box Grid - Talent Assessment',
    what: 'A 9-box grid plots team members on two dimensions: Performance (current results) and Potential (future growth capacity). This helps with development and succession planning.',
    why: 'Not all employees are the same. The 9-box helps you make better decisions about development, promotion, compensation, and when to let someone go.',
    how: [
      '1. Rate each person on Performance (Low/Medium/High)',
      '2. Rate each person on Potential (Low/Medium/High)',
      '3. Plot them on the 9-box grid',
      '4. Create development plans based on their box',
      '5. Review annually (or more often for fast-growing teams)'
    ],
    boxes: [
      { name: 'Stars', performance: 'High', potential: 'High', action: 'Invest heavily, give stretch assignments, prepare for leadership' },
      { name: 'High Performers', performance: 'High', potential: 'Medium', action: 'Recognize, retain, leverage their expertise' },
      { name: 'High Potential', performance: 'Medium', potential: 'High', action: 'Coach, mentor, give growth opportunities' },
      { name: 'Core Players', performance: 'Medium', potential: 'Medium', action: 'Develop, keep engaged, steady growth' },
      { name: 'Solid Performers', performance: 'High', potential: 'Low', action: 'Value their consistency, expert roles' },
      { name: 'Underperformers', performance: 'Low', potential: 'Low', action: 'Performance improvement plan or exit' }
    ],
    tips: [
      'Be honest - overrating helps no one',
      'Potential is about capacity to grow, not desire',
      'Don\'t share exact box placement with employees',
      'Use as input, not sole decision factor'
    ]
  },

  // Execution & Risk
  wwwActions: {
    title: 'WWW Actions - Who-What-When',
    what: 'A simple meeting output format that captures: WHO is doing WHAT by WHEN. Every meeting should end with clear WWW actions.',
    why: 'Most meetings are unproductive because nothing gets written down. WWW creates accountability and ensures follow-through.',
    how: [
      '1. At end of every meeting, review decisions',
      '2. For each action, ask: Who will do this?',
      '3. Write exactly WHAT they will do',
      '4. Set a specific WHEN (date, not "soon")',
      '5. Start next meeting by reviewing WWWs'
    ],
    example: [
      { who: 'Sarah', what: 'Send proposal to Acme Corp', when: 'Friday, March 15' },
      { who: 'Mike', what: 'Update sales dashboard with Q1 targets', when: 'Wednesday, March 13' },
      { who: 'Team', what: 'Complete 360 reviews', when: 'March 31' }
    ],
    tips: [
      'One person per WWW - split into multiple if needed',
      'Specific dates, not "next week"',
      'Review outstanding WWWs before every meeting'
    ]
  },

  rockefellerHabits: {
    title: 'Rockefeller Habits Checklist',
    what: '10 habits from "Mastering the Rockefeller Habits" that help scaling companies maintain alignment and execution excellence.',
    why: 'These habits create the rhythm and discipline needed to scale. Companies that implement them well grow faster with less chaos.',
    habits: [
      { name: 'Executive Team', desc: 'Is healthy and aligned on goals' },
      { name: 'One-Page Plan', desc: 'Everyone knows the top 5 priorities' },
      { name: 'Communication Rhythm', desc: 'Daily huddles, weekly meetings, monthly reviews' },
      { name: 'Scoreboard', desc: 'Everyone sees key metrics daily/weekly' },
      { name: 'Employee Feedback', desc: 'Regular input from front lines' },
      { name: 'Customer Feedback', desc: 'Systematic voice of customer program' },
      { name: 'Core Values', desc: 'Values are alive and used in decisions' },
      { name: 'Brand Promise', desc: 'Clear promise to customers' },
      { name: 'SOPs', desc: 'Key processes documented' },
      { name: 'Budgeting', desc: 'Annual and quarterly planning process' }
    ]
  },

  riskMatrix: {
    title: 'Risk Matrix',
    what: 'A visual tool to assess and prioritize risks based on their Probability (likelihood of occurring) and Impact (severity if they do occur).',
    why: 'Every business faces risks. A risk matrix helps you focus on the most critical ones and prepare mitigation strategies.',
    how: [
      '1. Brainstorm all potential risks',
      '2. Rate each risk: High/Medium/Low probability',
      '3. Rate each risk: High/Medium/Low impact',
      '4. Plot on the matrix',
      '5. Address High-High risks first',
      '6. Create prevention strategies',
      '7. Set up monitoring methods'
    ],
    categories: [
      { level: 'Critical', probability: 'High', impact: 'High', action: 'Immediate action required' },
      { level: 'High', probability: 'Medium', impact: 'High', action: 'Plan mitigation now' },
      { level: 'Medium', probability: 'High', impact: 'Low', action: 'Monitor closely' },
      { level: 'Low', probability: 'Low', impact: 'Low', action: 'Accept or ignore' }
    ],
    tips: [
      'Include team members in risk brainstorming',
      'Review risks monthly',
      'Don\'t ignore "unlikely but devastating" risks',
      'Have contingency plans for critical risks'
    ]
  },

  // Financial
  fpaDashboard: {
    title: 'FP&A Dashboard - Financial Planning & Analysis',
    what: 'A real-time view of your company\'s financial health including revenue, expenses, margins, cash position, and runway.',
    why: 'Cash is the lifeblood of business. Without clear visibility into financial metrics, you can\'t make good decisions or avoid running out of money.',
    how: [
      '1. Track revenue and expenses monthly',
      '2. Calculate gross margin (Revenue - Cost of Goods)/Revenue',
      '3. Monitor cash on hand weekly',
      '4. Calculate burn rate (monthly expenses)',
      '5. Estimate runway (Cash / Monthly Burn)'
    ],
    keyMetrics: [
      { name: 'Revenue', desc: 'Total money coming in' },
      { name: 'Gross Margin', desc: 'Revenue minus direct costs' },
      { name: 'Net Margin', desc: 'Profit after all expenses' },
      { name: 'Cash on Hand', desc: 'Money in bank' },
      { name: 'Burn Rate', desc: 'Monthly cash consumption' },
      { name: 'Runway', desc: 'Months until cash runs out' }
    ]
  },

  cashStrategies: {
    title: 'CASh Strategies - Cash Acceleration',
    what: 'Specific actions to improve cash flow and reduce the time between spending money and getting paid.',
    why: 'Many profitable businesses fail because they run out of cash. CASh strategies help you get paid faster and hold onto cash longer.',
    how: [
      '1. Reduce DSO (Days Sales Outstanding) - get paid faster',
      '2. Extend DPO (Days Payable Outstanding) - pay bills later',
      '3. Minimize inventory holding time',
      '4. Price for value, not cost',
      '5. Add recurring revenue streams',
      '6. Negotiate better payment terms'
    ],
    strategies: [
      { name: 'Require deposits', impact: 'High', desc: 'Get 50% upfront on large projects' },
      { name: 'Automated billing', impact: 'Medium', desc: 'Auto-charge credit cards for subscriptions' },
      { name: 'Early payment discounts', impact: 'Medium', desc: '2% off if paid within 10 days' },
      { name: 'Payment plans', impact: 'High', desc: 'Split payments to close larger deals' }
    ]
  },

  forecasting: {
    title: 'Revenue Forecasting',
    what: 'Projecting future revenue based on historical data, market conditions, and growth assumptions.',
    why: 'Forecasting helps you plan hiring, investments, and expenses. It\'s essential for fundraising and board reporting.',
    how: [
      '1. Start with historical data',
      '2. Identify growth drivers (new customers, expansion, pricing)',
      '3. Apply growth assumptions (conservative, moderate, aggressive)',
      '4. Build bottom-up forecast by revenue stream',
      '5. Document your assumptions',
      '6. Compare forecast to actuals monthly'
    ],
    tips: [
      'Create multiple scenarios (best/worst/likely)',
      'Forecasts are always wrong - the goal is to be less wrong',
      'Review and adjust quarterly'
    ]
  },

  roiCalculator: {
    title: 'ROI Calculator - Return on Investment',
    what: 'Calculate the return on investment for projects, initiatives, or expenses to make better resource allocation decisions.',
    why: 'You have limited resources. ROI helps you prioritize investments that will have the biggest impact.',
    how: [
      '1. Identify total investment (time + money)',
      '2. Estimate expected return (revenue increase, cost savings)',
      '3. Calculate ROI: (Return - Investment) / Investment × 100',
      '4. Consider payback period (time to recover investment)',
      '5. Compare across alternatives'
    ],
    example: {
      project: 'New CRM System',
      investment: 50000,
      return: 150000,
      roi: '200%',
      payback: '8 months'
    }
  },

  // Collaboration
  workspaces: {
    title: 'Shared Workspaces',
    what: 'Virtual spaces where teams collaborate on specific projects, initiatives, or ongoing work.',
    why: 'Workspaces reduce email clutter, centralize information, and create clear context for collaborative work.',
    how: [
      '1. Create a workspace for each major project or team',
      '2. Add relevant team members',
      '3. Share files, notes, and updates in the workspace',
      '4. Set clear goals and timeline',
      '5. Archive when complete'
    ]
  },

  mentorship: {
    title: 'Mentorship Programs',
    what: 'Structured relationships where experienced individuals (mentors) guide less experienced individuals (mentees) in their development.',
    why: 'Mentorship accelerates learning, improves retention, transfers institutional knowledge, and builds stronger teams.',
    how: [
      '1. Match mentors and mentees based on goals/skills',
      '2. Set clear expectations and frequency',
      '3. Provide structure (topics, goals)',
      '4. Track progress',
      '5. Gather feedback and adjust'
    ],
    tips: [
      'Consider reverse mentoring (junior teaches senior)',
      'Don\'t force matches that don\'t work',
      'Provide training for mentors'
    ]
  },

  knowledgeBase: {
    title: 'Knowledge Base',
    what: 'A centralized repository of documented processes, best practices, guides, and reference materials.',
    why: 'When knowledge lives in people\'s heads, you lose it when they leave. A knowledge base preserves and shares institutional knowledge.',
    how: [
      '1. Start with most important/repeated processes',
      '2. Write clear, step-by-step instructions',
      '3. Include screenshots/examples',
      '4. Keep it updated',
      '5. Make it searchable and organized'
    ],
    categories: [
      'Process Documentation',
      'Best Practices',
      'Training Guides',
      'Reference Materials',
      'FAQs'
    ]
  },

  aiCoach: {
    title: 'AI Business Coach',
    what: 'An AI-powered assistant trained on Scaling Up and business methodology that can answer questions and provide guidance.',
    why: 'Not everyone can afford a business coach. AI provides instant access to frameworks, best practices, and strategic guidance.',
    sampleQuestions: [
      'How do I set better goals?',
      'What\'s the best way to run a weekly meeting?',
      'How can I improve my cash flow?',
      'What should I delegate first?',
      'How do I create a compelling vision?'
    ]
  }
};

// Helper component props
export const getGuideForView = (moduleView) => {
  return moduleGuides[moduleView] || null;
};

export default moduleGuides;