const mongoose = require('mongoose');

const adminAnalyticsSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  totalUsers: {
    type: Number,
    default: 0
  },
  activeUsers: {
    type: Number,
    default: 0
  },
  newUsersToday: {
    type: Number,
    default: 0
  },
  totalVisionBoards: {
    type: Number,
    default: 0
  },
  activeVisionBoards: {
    type: Number,
    default: 0
  },
  averageProgress: {
    type: Number,
    default: 0
  },
  totalMonthlyUpdates: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('AdminAnalytics', adminAnalyticsSchema);