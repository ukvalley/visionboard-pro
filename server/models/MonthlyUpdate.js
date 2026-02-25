const mongoose = require('mongoose');

const monthlyUpdateSchema = new mongoose.Schema({
  visionBoardId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'VisionBoard',
    required: true
  },
  month: {
    type: String,
    required: true,
    enum: ['January', 'February', 'March', 'April', 'May', 'June',
           'July', 'August', 'September', 'October', 'November', 'December']
  },
  year: {
    type: Number,
    required: true,
    min: 2020,
    max: 2100
  },
  actualRevenue: {
    type: Number,
    default: 0
  },
  actualTeamSize: {
    type: Number,
    default: 0
  },
  actualLeads: {
    type: Number,
    default: 0
  },
  actualCustomers: {
    type: Number,
    default: 0
  },
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot be more than 1000 characters']
  },
  wins: {
    type: String,
    maxlength: [500, 'Wins cannot be more than 500 characters']
  },
  challenges: {
    type: String,
    maxlength: [500, 'Challenges cannot be more than 500 characters']
  },
  nextMonthGoals: {
    type: String,
    maxlength: [500, 'Next month goals cannot be more than 500 characters']
  }
}, {
  timestamps: true
});

// Compound index to ensure one update per month per vision board
monthlyUpdateSchema.index({ visionBoardId: 1, month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('MonthlyUpdate', monthlyUpdateSchema);