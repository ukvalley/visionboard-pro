// AI Suggestions Service - Rule-based analysis for vision board optimization

const generateAISuggestions = (visionBoard, monthlyUpdates) => {
  const suggestions = [];

  if (!visionBoard || !visionBoard.sections) {
    return suggestions;
  }

  const financialGoals = visionBoard.sections.financialGoals?.data || {};
  const teamPlan = visionBoard.sections.teamPlan?.data || {};
  const systemsToBuild = visionBoard.sections.systemsToBuild?.data || {};
  const brandGoals = visionBoard.sections.brandGoals?.data || {};
  const lifestyleVision = visionBoard.sections.lifestyleVision?.data || {};

  // 1. Revenue vs Team Analysis
  if (financialGoals.annualRevenue > 1000000) {
    const teamCount = teamPlan.roles?.length || 0;
    if (teamCount < 3) {
      suggestions.push({
        type: 'warning',
        category: 'Team',
        icon: 'users',
        title: 'Team Scaling Needed',
        message: `Your annual revenue target of $${financialGoals.annualRevenue.toLocaleString()} is ambitious. With only ${teamCount} team ${teamCount === 1 ? 'member' : 'members'} planned, consider expanding your team capacity to achieve this goal.`,
        action: 'Review your team plan to ensure adequate support for revenue targets.',
        priority: 'high'
      });
    }
  }

  // 2. Systems vs Revenue Alignment
  const systems = systemsToBuild.systems || [];
  const completedSystems = systems.filter(s => s.status === 'completed').length;
  if (completedSystems < 3 && financialGoals.annualRevenue > 500000) {
    suggestions.push({
      type: 'recommendation',
      category: 'Systems',
      icon: 'cog',
      title: 'Build Core Systems First',
      message: `You have ${completedSystems} completed systems. For a revenue target of $${financialGoals.annualRevenue?.toLocaleString()}, focus on building CRM, Sales Funnel, and Operations systems before scaling.`,
      action: 'Prioritize system development in your quarterly planning.',
      priority: 'high'
    });
  }

  // 3. Profit Margin Check
  const profitMargin = financialGoals.profitMargin || 0;
  if (profitMargin < 15 && profitMargin > 0) {
    suggestions.push({
      type: 'alert',
      category: 'Financial',
      icon: 'dollar-sign',
      title: 'Profit Margin Alert',
      message: `Your target profit margin of ${profitMargin}% is below the recommended 15%. This may impact your ability to reinvest in growth and handle unexpected expenses.`,
      action: 'Review your pricing strategy and operational costs.',
      priority: 'high'
    });
  }

  // 4. Lifestyle Alignment
  const workingHours = lifestyleVision.workingHours || 0;
  if (workingHours > 10 && financialGoals.annualRevenue > 500000) {
    suggestions.push({
      type: 'warning',
      category: 'Lifestyle',
      icon: 'clock',
      title: 'Work-Life Balance Risk',
      message: `Your target of ${workingHours} hours/day with high revenue goals may lead to burnout. Consider building systems and team to reduce your direct involvement.`,
      action: 'Plan for delegation and automation to achieve sustainable growth.',
      priority: 'medium'
    });
  }

  // 5. Monthly Revenue Consistency Check
  const monthlyRevenue = financialGoals.monthlyRevenue || 0;
  const annualRevenue = financialGoals.annualRevenue || 0;
  if (monthlyRevenue > 0 && annualRevenue > 0) {
    const impliedAnnual = monthlyRevenue * 12;
    const variance = Math.abs(impliedAnnual - annualRevenue) / annualRevenue * 100;
    if (variance > 10) {
      suggestions.push({
        type: 'info',
        category: 'Financial',
        icon: 'trending-up',
        title: 'Revenue Goal Alignment',
        message: `Your monthly revenue target ($${monthlyRevenue.toLocaleString()}/mo) implies $${impliedAnnual.toLocaleString()}/year, which differs from your annual target by ${variance.toFixed(1)}%.`,
        action: 'Align your monthly and annual targets for clearer progress tracking.',
        priority: 'low'
      });
    }
  }

  // 6. Brand Goals Check
  const websiteLeads = brandGoals.websiteLeads || 0;
  if (websiteLeads > 100 && completedSystems < 2) {
    suggestions.push({
      type: 'recommendation',
      category: 'Marketing',
      icon: 'target',
      title: 'Lead Generation Capacity',
      message: `Targeting ${websiteLeads} leads/month is ambitious. Ensure you have systems to capture, nurture, and convert these leads effectively.`,
      action: 'Build your CRM and email marketing systems before scaling lead generation.',
      priority: 'medium'
    });
  }

  // 7. Progress Check
  if (visionBoard.overallProgress < 50 && monthlyUpdates.length === 0) {
    suggestions.push({
      type: 'info',
      category: 'Progress',
      icon: 'bar-chart',
      title: 'Start Tracking Progress',
      message: 'Your vision board is under 50% complete with no monthly updates yet. Regular progress tracking helps maintain momentum.',
      action: 'Complete your vision board sections and start adding monthly updates.',
      priority: 'medium'
    });
  }

  // 8. Based on recent monthly updates
  if (monthlyUpdates.length > 0) {
    const lastUpdate = monthlyUpdates[0];
    const actualVsTarget = lastUpdate.actualRevenue / (financialGoals.monthlyRevenue || 1);

    if (actualVsTarget < 0.7) {
      suggestions.push({
        type: 'alert',
        category: 'Performance',
        icon: 'trending-down',
        title: 'Revenue Below Target',
        message: `Last month's revenue was ${Math.round((1 - actualVsTarget) * 100)}% below target. Analyze what's working and what needs adjustment.`,
        action: 'Review your sales process and marketing efforts for quick wins.',
        priority: 'high'
      });
    } else if (actualVsTarget > 1.2) {
      suggestions.push({
        type: 'success',
        category: 'Performance',
        icon: 'trending-up',
        title: 'Exceeding Revenue Targets',
        message: `You're exceeding your revenue targets by ${Math.round((actualVsTarget - 1) * 100)}%. Consider raising your goals or investing in growth.`,
        action: 'Document what\'s working and scale successful strategies.',
        priority: 'low'
      });
    }
  }

  // 9. Cash Reserve Recommendation
  const cashReserve = financialGoals.cashReserve || 0;
  const monthlyExpenses = financialGoals.monthlyRevenue * (1 - (profitMargin / 100));
  const monthsCovered = monthlyExpenses > 0 ? cashReserve / monthlyExpenses : 0;

  if (monthsCovered < 3 && financialGoals.annualRevenue > 250000) {
    suggestions.push({
      type: 'recommendation',
      category: 'Financial',
      icon: 'shield',
      title: 'Emergency Fund Goal',
      message: `Your cash reserve target covers approximately ${monthsCovered.toFixed(1)} months of expenses. Aim for 3-6 months for financial security.`,
      action: 'Increase your cash reserve target to build a stronger financial cushion.',
      priority: 'medium'
    });
  }

  // 10. Net Worth Trajectory
  const netWorthTarget = lifestyleVision.netWorth || 0;
  const personalIncome = financialGoals.personalIncome || 0;
  if (netWorthTarget > 0 && personalIncome > 0) {
    const yearsToTarget = netWorthTarget / personalIncome;
    if (yearsToTarget > 10) {
      suggestions.push({
        type: 'info',
        category: 'Wealth Building',
        icon: 'pie-chart',
        title: 'Net Worth Trajectory',
        message: `At your current personal income target, reaching $${netWorthTarget.toLocaleString()} net worth would take approximately ${Math.round(yearsToTarget)} years. Consider additional income streams or investment strategies.`,
        action: 'Explore investment options and passive income opportunities.',
        priority: 'low'
      });
    }
  }

  // Sort by priority
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  suggestions.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return suggestions;
};

module.exports = { generateAISuggestions };