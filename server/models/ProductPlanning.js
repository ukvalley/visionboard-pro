const mongoose = require('mongoose');

const ProductPlanningSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    enum: ['saas', 'app', 'service', 'physical', 'other'],
    required: true
  },
  status: {
    type: String,
    enum: ['idea', 'validation', 'mvp', 'launched', 'scaling'],
    default: 'idea'
  },
  // Step 1: Problem Definition
  problemDescription: String,
  whoFacingProblem: String,
  frequency: String,
  currentSolutions: String,
  painLevel: { type: Number, default: 5 },
  // Step 2: Target Audience
  industry: String,
  ageRange: String,
  incomeLevel: String,
  location: String,
  behaviorPatterns: String,
  dailyWorkflow: String,
  buyingPower: String,
  keyFrustrations: String,
  // Step 3: Problem Validation
  interviewsConducted: Number,
  keyInsights: String,
  currentlyPaying: String,
  willingnessToPay: String,
  validationScore: { type: Number, default: 0 },
  // Step 4: Solution Definition
  solutionStatement: String,
  keyBenefits: String,
  differentiation: String,
  // Step 5: Market Validation
  landingPageCreated: String,
  adSpend: Number,
  ctr: Number,
  leadsCollected: Number,
  preOrders: Number,
  // Step 6: MVP Planning
  mustHaveFeatures: String,
  goodToHaveFeatures: String,
  futureFeatures: String,
  // Step 7: Product Visualization
  wireframes: [String],
  figmaLink: String,
  demoVideoLink: String,
  // Step 8: Business Model
  revenueModel: String,
  pricing: String,
  cac: Number,
  ltv: Number,
  // Step 9: Go-To-Market
  targetChannels: [String],
  first100UsersPlan: String,
  salesFunnel: String,
  budgetAllocation: String,
  // Step 10: Metrics & KPIs
  conversionRate: Number,
  retentionRate: Number,
  revenueTarget: Number,
  growthTarget: Number,
  otherMetrics: String,
  // Metadata
  completedSteps: [{ type: Number }],
  isDeleted: { type: Boolean, default: false }
}, {
  timestamps: true
});

// Indexes for better query performance
ProductPlanningSchema.index({ user: 1, isDeleted: 1 });
ProductPlanningSchema.index({ status: 1 });
ProductPlanningSchema.index({ category: 1 });

module.exports = mongoose.model('ProductPlanning', ProductPlanningSchema);
