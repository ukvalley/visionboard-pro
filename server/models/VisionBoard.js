const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
  completed: {
    type: Boolean,
    default: false
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
});

// Strategy Sheet Schema - Complete 20 sections
const strategySheetSchema = new mongoose.Schema({
  // Section 1: Company Overview
  companyOverview: {
    completed: { type: Boolean, default: false },
    data: {
      companyName: { type: String, default: '' },
      industry: { type: String, default: '' },
      coreOffering: { type: String, default: '' },
      targetCustomerProfile: {
        whoBuys: { type: String, default: '' },
        companySize: { type: String, default: '' },
        industryType: { type: String, default: '' },
        geography: { type: String, default: '' }
      },
      primaryProblem: { type: String, default: '' },
      businessStage: { type: String, enum: ['Idea', 'Validation', 'Early Revenue', 'Scaling', ''], default: '' },
      uniqueDifferentiation: { type: String, default: '' },
      businessModel: { type: String, default: '' }
    }
  },

  // Section 2: Core Purpose
  corePurpose: {
    completed: { type: Boolean, default: false },
    data: {
      brokenSituation: { type: String, default: '' },
      whoBenefits: { type: String, default: '' },
      purposeStatement: { type: String, default: '' }
    }
  },

  // Section 3: Vision
  vision: {
    completed: { type: Boolean, default: false },
    data: {
      timeHorizon: { type: String, default: '10+ years' },
      desiredMarketPosition: { type: String, default: '' },
      scale: { type: String, default: '' },
      impactType: { type: String, default: '' },
      visionStatement: { type: String, default: '' }
    }
  },

  // Section 4: Mission
  mission: {
    completed: { type: Boolean, default: false },
    data: {
      dailyActions: { type: String, default: '' },
      valueDelivery: { type: String, default: '' },
      primaryFocus: { type: String, default: '' },
      missionStatement: { type: String, default: '' }
    }
  },

  // Section 5: Brand Promise
  brandPromise: {
    completed: { type: Boolean, default: false },
    data: {
      promisedOutcome: { type: String, default: '' },
      timeframe: { type: String, default: '' },
      riskReduction: { type: String, default: '' },
      promiseStatement: { type: String, default: '' }
    }
  },

  // Section 6: Core Values
  coreValues: {
    completed: { type: Boolean, default: false },
    data: {
      values: [{
        value: { type: String, default: '' },
        behavior: { type: String, default: '' }
      }]
    }
  },

  // Section 7: BHAG
  bhag: {
    completed: { type: Boolean, default: false },
    data: {
      timeHorizon: { type: String, default: '10 years' },
      revenueGoal: { type: String, default: '' },
      customerScale: { type: String, default: '' },
      marketPosition: { type: String, default: '' },
      bhagStatement: { type: String, default: '' }
    }
  },

  // Section 8: Vivid Description
  vividDescription: {
    completed: { type: Boolean, default: false },
    data: {
      customerExperience: { type: String, default: '' },
      internalOperations: { type: String, default: '' },
      systemsProcesses: { type: String, default: '' },
      decisionMaking: { type: String, default: '' },
      marketPerception: { type: String, default: '' },
      additionalPoints: [{ type: String }]
    }
  },

  // Section 9: SWOT Analysis
  swotAnalysis: {
    completed: { type: Boolean, default: false },
    data: {
      strengths: [{ type: String }],
      weaknesses: [{ type: String }],
      opportunities: [{ type: String }],
      threats: [{ type: String }]
    }
  },

  // Section 10: Strategic Priorities
  strategicPriorities: {
    completed: { type: Boolean, default: false },
    data: {
      priorities: [{
        id: { type: Number },
        name: { type: String, default: '' },
        whyItMatters: { type: String, default: '' },
        capabilitiesRequired: { type: String, default: '' },
        successLooksLike: { type: String, default: '' }
      }],
      // WWW Actions
      wwwActions: [{
        id: { type: Number },
        who: { type: String, default: '' },
        what: { type: String, default: '' },
        when: { type: String, default: '' },
        status: { type: String, enum: ['Pending', 'Done', ''], default: 'Pending' }
      }],
      // Rockefeller Habits
      habits: [{
        id: { type: Number },
        name: { type: String, default: '' },
        description: { type: String, default: '' },
        completed: { type: Boolean, default: false }
      }],
      // Project Portfolio
      projects: [{
        id: { type: Number },
        name: { type: String, default: '' },
        owner: { type: String, default: '' },
        deadline: { type: String, default: '' },
        status: { type: String, enum: ['Planning', 'In Progress', 'On Hold', 'Complete', ''], default: 'Planning' },
        priority: { type: String, enum: ['Low', 'Medium', 'High', ''], default: 'Medium' },
        progress: { type: Number, default: 0 }
      }]
    }
  },

  // Section 11: 3-Year Strategy Map
  threeYearStrategy: {
    completed: { type: Boolean, default: false },
    data: {
      year1: {
        objectives: [{ type: String }],
        initiatives: [{ type: String }],
        outcomes: [{ type: String }]
      },
      year2: {
        objectives: [{ type: String }],
        initiatives: [{ type: String }],
        outcomes: [{ type: String }]
      },
      year3: {
        objectives: [{ type: String }],
        initiatives: [{ type: String }],
        outcomes: [{ type: String }]
      }
    }
  },

  // Section 12: 1-Year SMART Goals
  smartGoals: {
    completed: { type: Boolean, default: false },
    data: {
      goals: [{
        goal: { type: String, default: '' },
        metric: { type: String, default: '' },
        target: { type: String, default: '' },
        deadline: { type: Date },
        owner: { type: String, default: '' },
        progress: { type: Number, default: 0 }
      }],
      okrs: [{
        id: { type: Number },
        objective: { type: String, default: '' },
        keyResults: [{
          text: { type: String, default: '' },
          progress: { type: Number, default: 0 }
        }],
        owner: { type: String, default: '' },
        progress: { type: Number, default: 0 }
      }],
      kpis: [{
        id: { type: Number },
        name: { type: String, default: '' },
        target: { type: String, default: '' },
        current: { type: String, default: '' },
        unit: { type: String, default: '' }
      }]
    }
  },

  // Section 13: Quarterly Execution Plan
  quarterlyPlan: {
    completed: { type: Boolean, default: false },
    data: {
      quarters: [{
        quarter: { type: String, enum: ['Q1', 'Q2', 'Q3', 'Q4'], default: 'Q1' },
        focusTheme: { type: String, default: '' },
        keyActions: [{ type: String }],
        kpis: [{ type: String }],
        owner: { type: String, default: '' }
      }]
    }
  },

  // Section 14: Revenue Model & Targets
  revenueModel: {
    completed: { type: Boolean, default: false },
    data: {
      revenueStreams: [{ type: String }],
      pricingStructure: { type: String, default: '' },
      averageDealSize: { type: Number, default: 0 },
      monthlyRevenueTarget: { type: Number, default: 0 },
      annualRevenueTarget: { type: Number, default: 0 },
      leadRequirements: { type: String, default: '' },
      conversionAssumptions: { type: String, default: '' },
      // FP&A Dashboard fields
      currentRevenue: { type: Number, default: 0 },
      currentExpenses: { type: Number, default: 0 },
      grossMargin: { type: Number, default: 0 },
      netMargin: { type: Number, default: 0 },
      cashOnHand: { type: Number, default: 0 },
      monthlyBurn: { type: Number, default: 0 },
      runway: { type: Number, default: 0 },
      // CASh Strategies
      cashStrategies: [{
        name: { type: String, default: '' },
        impact: { type: String, enum: ['Low', 'Medium', 'High', ''], default: '' }
      }],
      // Forecasting
      forecast: {
        year1Revenue: { type: Number, default: 0 },
        year2Revenue: { type: Number, default: 0 },
        year3Revenue: { type: Number, default: 0 },
        growthRate: { type: Number, default: 0 },
        assumptions: { type: String, default: '' }
      },
      // ROI Calculations
      roiCalculations: [{
        name: { type: String, default: '' },
        investment: { type: Number, default: 0 },
        return: { type: Number, default: 0 },
        timeframe: { type: Number, default: 12 }
      }]
    }
  },

  // Section 15: Organizational Structure
  organizationalStructure: {
    completed: { type: Boolean, default: false },
    data: {
      roles: [{
        role: { type: String, default: '' },
        responsibility: { type: String, default: '' },
        successMeasure: { type: String, default: '' }
      }],
      faceChart: [{
        id: { type: Number },
        function: { type: String, default: '' },
        owner: { type: String, default: '' },
        accountable: { type: String, default: '' },
        consulted: { type: String, default: '' },
        informed: { type: String, default: '' }
      }],
      talentAssessment: [{
        id: { type: Number },
        name: { type: String, default: '' },
        role: { type: String, default: '' },
        performance: { type: String, enum: ['Low', 'Medium', 'High', ''], default: '' },
        potential: { type: String, enum: ['Low', 'Medium', 'High', ''], default: '' },
        notes: { type: String, default: '' }
      }]
    }
  },

  // Section 16: SOP Roadmap
  sopRoadmap: {
    completed: { type: Boolean, default: false },
    data: {
      sops: [{
        order: { type: Number, default: 0 },
        name: { type: String, default: '' },
        description: { type: String, default: '' }
      }],
      paceChart: [{
        id: { type: Number },
        process: { type: String, default: '' },
        owner: { type: String, default: '' },
        frequency: { type: String, default: '' },
        status: { type: String, enum: ['Not Started', 'In Progress', 'Complete', ''], default: '' }
      }]
    }
  },

  // Section 17: Automation & Systems
  automationSystems: {
    completed: { type: Boolean, default: false },
    data: {
      coreTools: [{ type: String }],
      keyAutomations: [{ type: String }],
      dashboardsNeeded: [{ type: String }]
    }
  },

  // Section 18: KPI Dashboard
  kpiDashboard: {
    completed: { type: Boolean, default: false },
    data: {
      financialKpis: [{ type: String }],
      salesKpis: [{ type: String }],
      operationalKpis: [{ type: String }],
      customerKpis: [{ type: String }],
      peopleKpis: [{ type: String }]
    }
  },

  // Section 19: Risk Management
  riskManagement: {
    completed: { type: Boolean, default: false },
    data: {
      risks: [{
        id: { type: Number },
        risk: { type: String, default: '' },
        probability: { type: String, enum: ['Low', 'Medium', 'High', ''], default: '' },
        impact: { type: String, enum: ['Low', 'Medium', 'High', ''], default: '' },
        preventionStrategy: { type: String, default: '' },
        monitoringMethod: { type: String, default: '' }
      }]
    }
  },

  // Section 21: Collaboration Hub
  collaboration: {
    completed: { type: Boolean, default: false },
    data: {
      workspaces: [{
        id: { type: Number },
        name: { type: String, default: '' },
        description: { type: String, default: '' },
        members: [{ type: String }],
        createdAt: { type: Date, default: Date.now }
      }],
      discussions: [{
        id: { type: Number },
        title: { type: String, default: '' },
        content: { type: String, default: '' },
        author: { type: String, default: '' },
        createdAt: { type: Date, default: Date.now },
        replies: [{ type: mongoose.Schema.Types.Mixed }]
      }],
      mentorships: [{
        id: { type: Number },
        mentor: { type: String, default: '' },
        mentee: { type: String, default: '' },
        topic: { type: String, default: '' },
        frequency: { type: String, enum: ['Weekly', 'Bi-weekly', 'Monthly', 'Quarterly', ''], default: 'Monthly' },
        status: { type: String, enum: ['Active', 'Completed', 'On Hold', ''], default: 'Active' }
      }],
      knowledgeBase: [{
        id: { type: Number },
        title: { type: String, default: '' },
        category: { type: String, enum: ['Process', 'Best Practice', 'Template', 'Guide', 'Reference', ''], default: 'Process' },
        content: { type: String, default: '' },
        createdAt: { type: Date, default: Date.now }
      }]
    }
  },

  // Section 20: Final Strategy Summary
  strategySummary: {
    completed: { type: Boolean, default: false },
    data: {
      whoWeServe: { type: String, default: '' },
      problemWeSolve: { type: String, default: '' },
      howWeMakeMoney: { type: String, default: '' },
      whyWeWin: { type: String, default: '' },
      year1Focus: { type: String, default: '' },
      threeYearDirection: { type: String, default: '' },
      tenYearAmbition: { type: String, default: '' }
    }
  }
}, { _id: false });

// Main VisionBoard Schema
const visionBoardSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  overallProgress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  // Legacy sections (keeping for backward compatibility)
  sections: {
    businessOverview: {
      type: sectionSchema,
      default: () => ({ completed: false, data: {} })
    },
    financialGoals: {
      type: sectionSchema,
      default: () => ({ completed: false, data: {} })
    },
    growthStrategy: {
      type: sectionSchema,
      default: () => ({ completed: false, data: {} })
    },
    productService: {
      type: sectionSchema,
      default: () => ({ completed: false, data: {} })
    },
    systemsToBuild: {
      type: sectionSchema,
      default: () => ({ completed: false, data: {} })
    },
    teamPlan: {
      type: sectionSchema,
      default: () => ({ completed: false, data: {} })
    },
    brandGoals: {
      type: sectionSchema,
      default: () => ({ completed: false, data: {} })
    },
    lifestyleVision: {
      type: sectionSchema,
      default: () => ({ completed: false, data: {} })
    }
  },
  // New Strategy Sheet
  strategySheet: {
    type: strategySheetSchema,
    default: () => ({})
  },
  archivedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Calculate overall progress before saving
visionBoardSchema.pre('save', function(next) {
  // Known section names
  const legacySectionNames = ['businessOverview', 'financialGoals', 'growthStrategy',
    'productService', 'systemsToBuild', 'teamPlan', 'brandGoals', 'lifestyleVision'];

  const strategySectionNames = ['companyOverview', 'corePurpose', 'vision', 'mission', 'brandPromise',
    'coreValues', 'bhag', 'vividDescription', 'swotAnalysis', 'strategicPriorities',
    'threeYearStrategy', 'smartGoals', 'quarterlyPlan', 'revenueModel',
    'organizationalStructure', 'sopRoadmap', 'automationSystems', 'kpiDashboard',
    'riskManagement', 'strategySummary', 'collaboration'];

  // Legacy sections progress
  const legacyCompleted = legacySectionNames.filter(
    name => this.sections?.[name]?.completed
  ).length;

  // Strategy sheet sections progress
  const strategyCompleted = strategySectionNames.filter(
    name => this.strategySheet?.[name]?.completed
  ).length;

  const totalSections = legacySectionNames.length + strategySectionNames.length;
  const totalCompleted = legacyCompleted + strategyCompleted;

  this.overallProgress = Math.round((totalCompleted / totalSections) * 100);

  next();
});

module.exports = mongoose.model('VisionBoard', visionBoardSchema);