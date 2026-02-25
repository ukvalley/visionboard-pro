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
        name: { type: String, default: '' },
        whyItMatters: { type: String, default: '' },
        capabilitiesRequired: { type: String, default: '' },
        successLooksLike: { type: String, default: '' }
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
        owner: { type: String, default: '' }
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
      conversionAssumptions: { type: String, default: '' }
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
        risk: { type: String, default: '' },
        probability: { type: String, enum: ['Low', 'Medium', 'High', ''], default: '' },
        impact: { type: String, enum: ['Low', 'Medium', 'High', ''], default: '' },
        preventionStrategy: { type: String, default: '' },
        monitoringMethod: { type: String, default: '' }
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
  // Legacy sections progress
  const legacySections = Object.values(this.sections || {});
  const legacyCompleted = legacySections.filter(s => s.completed).length;

  // Strategy sheet sections progress
  const strategySections = Object.keys(this.strategySheet || {}).filter(
    key => this.strategySheet[key] && typeof this.strategySheet[key] === 'object'
  );
  const strategyCompleted = strategySections.filter(
    key => this.strategySheet[key]?.completed
  ).length;

  const totalSections = legacySections.length + strategySections.length;
  const totalCompleted = legacyCompleted + strategyCompleted;

  if (totalSections > 0) {
    this.overallProgress = Math.round((totalCompleted / totalSections) * 100);
  }

  next();
});

module.exports = mongoose.model('VisionBoard', visionBoardSchema);