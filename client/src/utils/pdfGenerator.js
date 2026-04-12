// PDF Generator utility for exporting Vision Board and Strategy Sheet
// Fixed version with robust error handling

export const generatePDF = async (visionBoard, options = {}) => {
  const { includeStrategySheet = true, onePageSummary = false } = options;

  try {
    // Validate visionBoard data
    if (!visionBoard) {
      throw new Error('No vision board data provided');
    }

    // Create a printable version of the vision board
    const printContent = createPrintContent(visionBoard, { includeStrategySheet, onePageSummary });

    // Open print dialog
    const printWindow = window.open('', '_blank');

    // Check if popup was blocked
    if (!printWindow) {
      alert('Popup blocked! Please allow popups for this site to export PDFs.');
      return;
    }

    printWindow.document.write(printContent);
    printWindow.document.close();

    // Trigger print after content loads
    setTimeout(() => {
      try {
        printWindow.focus();
        printWindow.print();
      } catch (e) {
        console.error('Print error:', e);
      }
    }, 500);

  } catch (error) {
    console.error('PDF generation error:', error);
    alert('Failed to generate PDF: ' + error.message);
  }
};

// Safe string conversion - prevents circular reference issues
const safeString = (val, fallback = 'Not specified') => {
  if (val === null || val === undefined || val === '') return fallback;
  if (typeof val === 'string') return val;
  if (typeof val === 'number') return val.toLocaleString();
  if (typeof val === 'boolean') return val ? 'Yes' : 'No';
  if (Array.isArray(val)) {
    if (val.length === 0) return fallback;
    return val.map(item => {
      if (typeof item === 'string') return item;
      if (typeof item === 'number') return String(item);
      if (typeof item === 'object' && item !== null) {
        // Try to extract a meaningful string from object
        return item.name || item.title || item.label || item.value || 'Item';
      }
      return String(item);
    }).join(', ');
  }
  if (typeof val === 'object') {
    // For objects, try to extract key properties
    try {
      const keys = Object.keys(val).slice(0, 3);
      return keys.map(k => `${safeFormatFieldName(k)}: ${safeString(val[k], '')}`).filter(s => s && !s.includes(': :')).join(', ');
    } catch (e) {
      return '[Object]';
    }
  }
  return String(val);
};

// Format field name
const safeFormatFieldName = (key) => {
  if (!key || typeof key !== 'string') return '';
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
};

// Create print content
const createPrintContent = (visionBoard, options) => {
  const { includeStrategySheet, onePageSummary } = options;
  const sections = visionBoard.sections || {};
  const strategySheet = visionBoard.strategySheet || {};

  // If one-page summary, use compact format
  if (onePageSummary) {
    return createOnePageSummary(visionBoard, strategySheet);
  }

  // Build full PDF content
  return createFullPDF(visionBoard, sections, strategySheet, includeStrategySheet);
};

// Create one-page summary
const createOnePageSummary = (visionBoard, strategySheet) => {
  const companyOverview = strategySheet.companyOverview?.data || {};
  const corePurpose = strategySheet.corePurpose?.data || {};
  const vision = strategySheet.vision?.data || {};
  const mission = strategySheet.mission?.data || {};
  const bhag = strategySheet.bhag?.data || {};
  const coreValues = strategySheet.coreValues?.data || {};
  const brandPromise = strategySheet.brandPromise?.data || {};
  const summary = strategySheet.strategySummary?.data || {};
  const swot = strategySheet.swotAnalysis?.data || {};
  const priorities = strategySheet.strategicPriorities?.data?.priorities || [];

  return `
<!DOCTYPE html>
<html>
<head>
  <title>One-Page Strategy - ${escapeHtml(visionBoard.name || 'Vision Board')}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: Arial, sans-serif;
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
      font-size: 12px;
    }
    h1 { font-size: 24px; margin-bottom: 5px; color: #1e3a5f; }
    .tagline { color: #666; margin-bottom: 20px; font-size: 14px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px; }
    .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin-bottom: 15px; }
    .box { border: 1px solid #ddd; border-radius: 8px; padding: 12px; background: #f9f9f9; }
    .box-title { font-size: 11px; color: #666; text-transform: uppercase; margin-bottom: 8px; border-bottom: 1px solid #eee; padding-bottom: 5px; }
    .box-content { font-size: 13px; line-height: 1.4; }
    .full { grid-column: 1 / -1; }
    .values { display: flex; flex-wrap: wrap; gap: 8px; }
    .value-tag { background: #e3f2fd; padding: 4px 12px; border-radius: 15px; font-size: 11px; }
    .swot-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
    .swot-box { padding: 10px; border-radius: 6px; }
    .strengths { background: #e8f5e9; border-left: 3px solid #4caf50; }
    .weaknesses { background: #ffebee; border-left: 3px solid #f44336; }
    .opportunities { background: #e3f2fd; border-left: 3px solid #2196f3; }
    .threats { background: #fff3e0; border-left: 3px solid #ff9800; }
    .footer { margin-top: 20px; text-align: center; color: #999; font-size: 10px; }
  </style>
</head>
<body>
  <h1>${escapeHtml(companyOverview.companyName || visionBoard.name || 'My Business')}</h1>
  <p class="tagline">${escapeHtml(corePurpose.purposeStatement || 'Our Vision & Strategy')}</p>

  <div class="grid-3">
    <div class="box">
      <div class="box-title">Core Purpose</div>
      <div class="box-content">${escapeHtml(corePurpose.purposeStatement || 'Not defined')}</div>
    </div>
    <div class="box">
      <div class="box-title">Vision</div>
      <div class="box-content">${escapeHtml(vision.visionStatement || 'Not defined')}</div>
    </div>
    <div class="box">
      <div class="box-title">Mission</div>
      <div class="box-content">${escapeHtml(mission.missionStatement || 'Not defined')}</div>
    </div>
  </div>

  <div class="grid">
    <div class="box">
      <div class="box-title">BHAG (10-Year Goal)</div>
      <div class="box-content">${escapeHtml(bhag.bhagStatement || 'Not defined')}</div>
    </div>
    <div class="box">
      <div class="box-title">Brand Promise</div>
      <div class="box-content">${escapeHtml(brandPromise.promiseStatement || 'Not defined')}</div>
    </div>
  </div>

  <div class="box full">
    <div class="box-title">Core Values</div>
    <div class="values">
      ${renderValues(coreValues.values)}
    </div>
  </div>

  <div class="grid-3">
    <div class="box">
      <div class="box-title">Who We Serve</div>
      <div class="box-content">${escapeHtml(summary.whoWeServe || companyOverview.targetCustomerProfile?.whoBuys || 'Not defined')}</div>
    </div>
    <div class="box">
      <div class="box-title">Problem We Solve</div>
      <div class="box-content">${escapeHtml(summary.problemWeSolve || companyOverview.primaryProblem || 'Not defined')}</div>
    </div>
    <div class="box">
      <div class="box-title">How We Win</div>
      <div class="box-content">${escapeHtml(summary.whyWeWin || companyOverview.uniqueDifferentiation || 'Not defined')}</div>
    </div>
  </div>

  <div class="box full">
    <div class="box-title">SWOT Analysis</div>
    <div class="swot-grid">
      <div class="swot-box strengths">
        <strong>Strengths</strong><br>${renderArray(swot.strengths)}
      </div>
      <div class="swot-box weaknesses">
        <strong>Weaknesses</strong><br>${renderArray(swot.weaknesses)}
      </div>
      <div class="swot-box opportunities">
        <strong>Opportunities</strong><br>${renderArray(swot.opportunities)}
      </div>
      <div class="swot-box threats">
        <strong>Threats</strong><br>${renderArray(swot.threats)}
      </div>
    </div>
  </div>

  <div class="box full">
    <div class="box-title">Strategic Priorities</div>
    <div class="grid-3">
      ${priorities.slice(0, 3).map((p, i) => `
        <div class="swot-box opportunities">
          <strong>Priority ${i + 1}</strong><br>
          ${escapeHtml(p.name || p.title || 'Priority')}<br>
          <small>${escapeHtml(p.description || '')}</small>
        </div>
      `).join('')}
    </div>
  </div>

  <div class="grid-3">
    <div class="box">
      <div class="box-title">Year 1 Focus</div>
      <div class="box-content">${escapeHtml(summary.year1Focus || 'Not defined')}</div>
    </div>
    <div class="box">
      <div class="box-title">3-Year Direction</div>
      <div class="box-content">${escapeHtml(summary.threeYearDirection || 'Not defined')}</div>
    </div>
    <div class="box">
      <div class="box-title">10-Year Ambition</div>
      <div class="box-content">${escapeHtml(summary.tenYearAmbition || 'Not defined')}</div>
    </div>
  </div>

  <div class="footer">
    One-Page Strategy | VisionBoard Pro | ${new Date().toLocaleDateString()}
  </div>
</body>
</html>
`;
};

// Create full PDF
const createFullPDF = (visionBoard, sections, strategySheet, includeStrategySheet) => {
  // DEBUG: Log the data structure to console
  console.log('PDF Generator - visionBoard:', visionBoard);
  console.log('PDF Generator - strategySheet:', strategySheet);
  console.log('PDF Generator - revenueModel data:', strategySheet?.revenueModel?.data);

  // Extract data from both legacy sections and strategy sheet
  // Strategy Sheet data takes precedence if available
  const revenueModel = strategySheet?.revenueModel?.data || {};
  const smartGoals = strategySheet?.smartGoals?.data || {};
  const strategicPriorities = strategySheet?.strategicPriorities?.data || {};
  const orgStructure = strategySheet?.organizationalStructure?.data || {};
  const companyOverview = strategySheet?.companyOverview?.data || {};
  const growthStrategyData = strategySheet?.growthStrategy?.data || {};
  const systemsData = strategySheet?.systemsToBuild?.data || {};
  const teamPlanData = strategySheet?.teamPlan?.data || {};
  const quarterly = strategySheet?.quarterlyPlan?.data || {};
  const risks = strategySheet?.riskManagement?.data || {};

  // Check if any financial data exists
  const hasFinancialData = revenueModel.currentRevenue || revenueModel.currentExpenses ||
                           revenueModel.cashOnHand || revenueModel.monthlyBurn ||
                           revenueModel.grossMargin || revenueModel.netMargin ||
                           revenueModel.annualRevenueTarget || revenueModel.monthlyRevenueTarget;

  let strategyContent = '';

  if (includeStrategySheet && Object.keys(strategySheet).length > 0) {
    strategyContent = `
      <div class="section-divider">
        <h2 class="divider-title">Strategy Sheet</h2>
      </div>
      ${renderStrategySheetSections(strategySheet)}
    `;
  }

  return `
<!DOCTYPE html>
<html>
<head>
  <title>Vision Board - ${escapeHtml(visionBoard.name || 'Export')}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: Arial, sans-serif;
      padding: 30px;
      max-width: 900px;
      margin: 0 auto;
      color: #333;
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 3px solid #2563eb;
    }
    .header h1 { font-size: 28px; color: #1e3a5f; margin-bottom: 10px; }
    .progress-bar {
      height: 20px;
      background: #e5e7eb;
      border-radius: 10px;
      margin: 15px auto;
      max-width: 300px;
      overflow: hidden;
    }
    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #2563eb, #10b981);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
      font-size: 11px;
    }
    .section { margin-bottom: 25px; page-break-inside: avoid; }
    .section-header {
      background: linear-gradient(135deg, #2563eb, #1d4ed8);
      color: white;
      padding: 12px 16px;
      border-radius: 8px 8px 0 0;
      font-size: 16px;
      font-weight: 600;
    }
    .section-header.strategy {
      background: linear-gradient(135deg, #7c3aed, #6d28d9);
    }
    .section-content {
      border: 1px solid #e5e7eb;
      border-top: none;
      padding: 16px;
      border-radius: 0 0 8px 8px;
      background: #fafafa;
    }
    .field { margin-bottom: 10px; display: flex; flex-wrap: wrap; }
    .field-label { font-weight: 600; min-width: 150px; color: #4b5563; }
    .field-value { color: #1f2937; flex: 1; }
    .field-empty { color: #9ca3af; font-style: italic; }
    .two-column { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
    .section-divider { margin: 40px 0 25px; text-align: center; }
    .divider-title {
      display: inline-block;
      padding: 12px 30px;
      background: linear-gradient(135deg, #7c3aed, #6d28d9);
      color: white;
      border-radius: 25px;
      font-size: 20px;
    }
    .footer { margin-top: 30px; text-align: center; color: #9ca3af; font-size: 11px; }
    @media print { body { padding: 15px; } .section { page-break-inside: avoid; } }
  </style>
</head>
<body>
  <div class="header">
    <h1>${escapeHtml(visionBoard.name || 'Vision Board')}</h1>
    <div class="progress-bar">
      <div class="progress-fill" style="width: ${visionBoard.overallProgress || 0}%">
        ${visionBoard.overallProgress || 0}% Complete
      </div>
    </div>
  </div>

  <!-- Business Overview - Uses Strategy Sheet Company Overview -->
  ${renderMergedSection('Business Overview', [
    { key: 'companyName', label: 'Business Name', value: companyOverview.companyName || sections?.businessOverview?.data?.businessName },
    { key: 'industry', label: 'Industry', value: companyOverview.industry || sections?.businessOverview?.data?.industry },
    { key: 'coreOffering', label: 'Core Offering', value: companyOverview.coreOffering },
    { key: 'businessStage', label: 'Business Stage', value: companyOverview.businessStage },
    { key: 'visionStatement', label: 'Vision Statement', value: sections?.businessOverview?.data?.visionStatement }
  ])}

  <!-- Financial Goals - Uses Strategy Sheet Revenue Model -->
  ${renderMergedSection('Financial Goals', [
    { key: 'currentRevenue', label: 'Current Revenue', value: revenueModel.currentRevenue, format: 'currency' },
    { key: 'currentExpenses', label: 'Current Expenses', value: revenueModel.currentExpenses, format: 'currency' },
    { key: 'grossMargin', label: 'Gross Margin', value: revenueModel.grossMargin, format: 'percent' },
    { key: 'netMargin', label: 'Net Margin', value: revenueModel.netMargin, format: 'percent' },
    { key: 'cashOnHand', label: 'Cash on Hand', value: revenueModel.cashOnHand, format: 'currency' },
    { key: 'monthlyBurn', label: 'Monthly Burn', value: revenueModel.monthlyBurn, format: 'currency' },
    { key: 'runway', label: 'Runway (Months)', value: revenueModel.runway },
    { key: 'annualRevenueTarget', label: 'Annual Revenue Target', value: revenueModel.annualRevenueTarget || sections?.financialGoals?.data?.annualRevenue, format: 'currency' },
    { key: 'monthlyRevenueTarget', label: 'Monthly Revenue Target', value: revenueModel.monthlyRevenueTarget || sections?.financialGoals?.data?.monthlyRevenue, format: 'currency' }
  ], true)}

  <!-- Revenue Forecast -->
  ${revenueModel.forecast?.year1Revenue || revenueModel.forecast?.year2Revenue || revenueModel.forecast?.year3Revenue ? `
  ${renderMergedSection('Revenue Forecast', [
    { key: 'year1Revenue', label: 'Year 1 Revenue', value: revenueModel.forecast?.year1Revenue, format: 'currency' },
    { key: 'year2Revenue', label: 'Year 2 Revenue', value: revenueModel.forecast?.year2Revenue, format: 'currency' },
    { key: 'year3Revenue', label: 'Year 3 Revenue', value: revenueModel.forecast?.year3Revenue, format: 'currency' },
    { key: 'growthRate', label: 'Growth Rate %', value: revenueModel.forecast?.growthRate, format: 'percent' }
  ], true)}
  ` : ''}

  <!-- Growth Strategy -->
  ${renderMergedSection('Growth Strategy', [
    { key: 'primaryRevenueSources', label: 'Primary Revenue Sources', value: growthStrategyData.primaryRevenueSources || sections?.growthStrategy?.data?.primaryRevenueSources },
    { key: 'targetCustomerSegments', label: 'Target Customer Segments', value: growthStrategyData.targetCustomerSegments || sections?.growthStrategy?.data?.targetCustomerSegments },
    { key: 'highValueClients', label: 'High-Value Clients', value: growthStrategyData.highValueClients || sections?.growthStrategy?.data?.highValueClients },
    { key: 'revenueStreams', label: 'Revenue Streams', value: revenueModel.revenueStreams },
    { key: 'averageDealSize', label: 'Average Deal Size', value: revenueModel.averageDealSize, format: 'currency' }
  ])}

  <!-- Target Customer Profile -->
  ${companyOverview.targetCustomerProfile?.whoBuys ? `
  ${renderMergedSection('Target Customer Profile', [
    { key: 'whoBuys', label: 'Who Buys', value: companyOverview.targetCustomerProfile?.whoBuys },
    { key: 'companySize', label: 'Company Size', value: companyOverview.targetCustomerProfile?.companySize },
    { key: 'industryType', label: 'Industry Type', value: companyOverview.targetCustomerProfile?.industryType },
    { key: 'geography', label: 'Geography', value: companyOverview.targetCustomerProfile?.geography }
  ])}
  ` : ''}

  <!-- Product/Service -->
  ${renderMergedSection('Product/Service', [
    { key: 'currentServices', label: 'Current Services', value: sections?.productService?.data?.currentServices },
    { key: 'futureProducts', label: 'Future Products', value: sections?.productService?.data?.futureProducts },
    { key: 'primaryProblem', label: 'Primary Problem Solved', value: companyOverview.primaryProblem },
    { key: 'uniqueDifferentiation', label: 'Unique Differentiation', value: companyOverview.uniqueDifferentiation }
  ])}

  <!-- Systems to Build -->
  ${renderMergedSection('Systems to Build', [
    { key: 'crmSystem', label: 'CRM System', value: systemsData.crmSystem || sections?.systemsToBuild?.data?.crmSystem },
    { key: 'salesFunnel', label: 'Sales Funnel', value: systemsData.salesFunnel || sections?.systemsToBuild?.data?.salesFunnel },
    { key: 'operations', label: 'Operations', value: systemsData.operations || sections?.systemsToBuild?.data?.operations },
    { key: 'financialTracking', label: 'Financial Tracking', value: systemsData.financialTracking },
    { key: 'marketingAutomation', label: 'Marketing Automation', value: systemsData.marketingAutomation }
  ])}

  <!-- Team Plan -->
  ${renderMergedSection('Team Plan', [
    { key: 'currentTeam', label: 'Current Team', value: teamPlanData.currentTeam || sections?.teamPlan?.data?.currentTeam },
    { key: 'futureHires', label: 'Future Hires', value: teamPlanData.futureHires || sections?.teamPlan?.data?.futureHires },
    { key: 'organizationalStructure', label: 'Organizational Structure', value: teamPlanData.organizationalStructure },
    { key: 'teamCulture', label: 'Team Culture', value: teamPlanData.teamCulture }
  ])}

  <!-- Brand Goals -->
  ${renderMergedSection('Brand Goals', [
    { key: 'websiteLeads', label: 'Website Leads/Month', value: sections?.brandGoals?.data?.websiteLeads },
    { key: 'socialFollowers', label: 'Social Media Followers', value: sections?.brandGoals?.data?.socialFollowers },
    { key: 'caseStudies', label: 'Case Studies Goal', value: sections?.brandGoals?.data?.caseStudies },
    { key: 'speakingEvents', label: 'Speaking/Events Goals', value: sections?.brandGoals?.data?.speakingEvents }
  ], true)}

  <!-- Lifestyle Vision -->
  ${renderMergedSection('Lifestyle Vision', [
    { key: 'workingHours', label: 'Working Hours/Day', value: sections?.lifestyleVision?.data?.workingHours },
    { key: 'freeDays', label: 'Free Days/Month', value: sections?.lifestyleVision?.data?.freeDays },
    { key: 'travelGoals', label: 'Travel Goals', value: sections?.lifestyleVision?.data?.travelGoals },
    { key: 'netWorthTarget', label: 'Net Worth Target', value: sections?.lifestyleVision?.data?.netWorthTarget, format: 'currency' }
  ], true)}

  ${strategyContent}

  <div class="footer">
    Generated by VisionBoard Pro | ${new Date().toLocaleDateString()}
  </div>
</body>
</html>
`;
};

// Render a legacy section
const renderSection = (title, data, fields, twoColumn = false) => {
  if (!data || Object.keys(data).length === 0) {
    return `
      <div class="section">
        <div class="section-header">${escapeHtml(title)}</div>
        <div class="section-content">
          <p class="field-empty">Not yet completed</p>
        </div>
      </div>
    `;
  }

  const content = fields.map(field => {
    let value = data[field.key];

    if (value === undefined || value === null || value === '') {
      return `
        <div class="field">
          <span class="field-label">${escapeHtml(field.label)}:</span>
          <span class="field-value field-empty">Not specified</span>
        </div>
      `;
    }

    // Format value
    if (field.format === 'currency' && typeof value === 'number') {
      value = '$' + value.toLocaleString();
    } else if (field.format === 'percent') {
      value = value + '%';
    }

    return `
      <div class="field">
        <span class="field-label">${escapeHtml(field.label)}:</span>
        <span class="field-value">${escapeHtml(safeString(value))}</span>
      </div>
    `;
  }).join('');

  return `
    <div class="section">
      <div class="section-header">${escapeHtml(title)}</div>
      <div class="section-content ${twoColumn ? 'two-column' : ''}">
        ${content}
      </div>
    </div>
  `;
};

// Render merged section (Strategy Sheet data with fallback to legacy sections)
const renderMergedSection = (title, fields, twoColumn = false) => {
  // Filter out fields with truly no value (undefined, null, empty string)
  // BUT allow 0 as a valid value for numbers
  const fieldsWithData = fields.filter(field => {
    const val = field.value;
    return val !== undefined && val !== null && val !== '' &&
           !(Array.isArray(val) && val.length === 0);
  });

  // Check if any fields have data
  const hasData = fieldsWithData.length > 0;

  if (!hasData) {
    return `
      <div class="section">
        <div class="section-header">${escapeHtml(title)}</div>
        <div class="section-content">
          <p class="field-empty">Not yet completed</p>
        </div>
      </div>
    `;
  }

  const content = fields.map(field => {
    let value = field.value;

    // Handle truly empty values (but NOT 0)
    if (value === undefined || value === null || value === '') {
      return `
        <div class="field">
          <span class="field-label">${escapeHtml(field.label)}:</span>
          <span class="field-value field-empty">Not specified</span>
        </div>
      `;
    }

    // Format array values
    if (Array.isArray(value)) {
      if (value.length === 0) {
        return `
          <div class="field">
            <span class="field-label">${escapeHtml(field.label)}:</span>
            <span class="field-value field-empty">None</span>
          </div>
        `;
      }
      value = value.join(', ');
    }

    // Format numbers
    if (field.format === 'currency' && typeof value === 'number') {
      value = '$' + value.toLocaleString();
    } else if (field.format === 'percent') {
      value = value + '%';
    }

    return `
      <div class="field">
        <span class="field-label">${escapeHtml(field.label)}:</span>
        <span class="field-value">${escapeHtml(String(value))}</span>
      </div>
    `;
  }).join('');

  return `
    <div class="section">
      <div class="section-header">${escapeHtml(title)}</div>
      <div class="section-content ${twoColumn ? 'two-column' : ''}">
        ${content}
      </div>
    </div>
  `;
};

// Render strategy sheet sections
const renderStrategySheetSections = (strategySheet) => {
  if (!strategySheet || Object.keys(strategySheet).length === 0) return '';

  let html = '';

  // Section 1: Company Overview
  if (strategySheet.companyOverview?.data) {
    const data = strategySheet.companyOverview.data;
    html += renderStrategySection('Company Overview (Strategy Sheet)', [
      { label: 'Company Name', value: data.companyName },
      { label: 'Industry', value: data.industry },
      { label: 'Core Offering', value: data.coreOffering },
      { label: 'Primary Problem', value: data.primaryProblem },
      { label: 'Business Stage', value: data.businessStage },
      { label: 'Unique Differentiation', value: data.uniqueDifferentiation },
      { label: 'Business Model', value: data.businessModel }
    ]);

    // Target Customer Profile
    if (data.targetCustomerProfile?.whoBuys) {
      html += renderStrategySection('Target Customer Profile', [
        { label: 'Who Buys', value: data.targetCustomerProfile.whoBuys },
        { label: 'Company Size', value: data.targetCustomerProfile.companySize },
        { label: 'Industry Type', value: data.targetCustomerProfile.industryType },
        { label: 'Geography', value: data.targetCustomerProfile.geography }
      ]);
    }
  }

  // Section 2: Core Purpose
  if (strategySheet.corePurpose?.data) {
    const data = strategySheet.corePurpose.data;
    html += renderStrategySection('Core Purpose', [
      { label: 'Broken Situation', value: data.brokenSituation },
      { label: 'Who Benefits', value: data.whoBenefits },
      { label: 'Purpose Statement', value: data.purposeStatement }
    ]);
  }

  // Section 3: Vision
  if (strategySheet.vision?.data) {
    const data = strategySheet.vision.data;
    html += renderStrategySection('Vision', [
      { label: 'Time Horizon', value: data.timeHorizon },
      { label: 'Desired Market Position', value: data.desiredMarketPosition },
      { label: 'Scale', value: data.scale },
      { label: 'Impact Type', value: data.impactType },
      { label: 'Vision Statement', value: data.visionStatement }
    ]);
  }

  // Section 4: Mission
  if (strategySheet.mission?.data) {
    const data = strategySheet.mission.data;
    html += renderStrategySection('Mission', [
      { label: 'Daily Actions', value: data.dailyActions },
      { label: 'Value Delivery', value: data.valueDelivery },
      { label: 'Primary Focus', value: data.primaryFocus },
      { label: 'Mission Statement', value: data.missionStatement }
    ]);
  }

  // Section 5: Brand Promise
  if (strategySheet.brandPromise?.data) {
    const data = strategySheet.brandPromise.data;
    html += renderStrategySection('Brand Promise', [
      { label: 'Promised Outcome', value: data.promisedOutcome },
      { label: 'Timeframe', value: data.timeframe },
      { label: 'Risk Reduction', value: data.riskReduction },
      { label: 'Promise Statement', value: data.promiseStatement }
    ]);
  }

  // Section 6: Core Values
  if (strategySheet.coreValues?.data?.values?.length > 0) {
    const values = strategySheet.coreValues.data.values;
    html += renderStrategySection('Core Values', values.map(v => ({
      label: v.value || 'Value',
      value: v.behavior || ''
    })));
  }

  // Section 7: BHAG
  if (strategySheet.bhag?.data) {
    const data = strategySheet.bhag.data;
    html += renderStrategySection('BHAG (Big Hairy Audacious Goal)', [
      { label: 'Time Horizon', value: data.timeHorizon },
      { label: 'Revenue Goal', value: data.revenueGoal },
      { label: 'Customer Scale', value: data.customerScale },
      { label: 'Market Position', value: data.marketPosition },
      { label: 'BHAG Statement', value: data.bhagStatement }
    ]);
  }

  // Section 8: Vivid Description
  if (strategySheet.vividDescription?.data) {
    const data = strategySheet.vividDescription.data;
    const fields = [
      { label: 'Customer Experience', value: data.customerExperience },
      { label: 'Internal Operations', value: data.internalOperations },
      { label: 'Systems & Processes', value: data.systemsProcesses },
      { label: 'Decision Making', value: data.decisionMaking },
      { label: 'Market Perception', value: data.marketPerception }
    ];
    if (data.additionalPoints?.length > 0) {
      fields.push({ label: 'Additional Points', value: data.additionalPoints.join('; ') });
    }
    html += renderStrategySection('Vivid Description', fields);
  }

  // Section 9: SWOT Analysis
  if (strategySheet.swotAnalysis?.data) {
    const data = strategySheet.swotAnalysis.data;
    html += renderStrategySection('SWOT Analysis', [
      { label: 'Strengths', value: data.strengths?.join(', ') },
      { label: 'Weaknesses', value: data.weaknesses?.join(', ') },
      { label: 'Opportunities', value: data.opportunities?.join(', ') },
      { label: 'Threats', value: data.threats?.join(', ') }
    ]);
  }

  // Section 10: Strategic Priorities
  if (strategySheet.strategicPriorities?.data) {
    const data = strategySheet.strategicPriorities.data;

    // Priorities
    if (data.priorities?.length > 0) {
      html += `
        <div class="section">
          <div class="section-header strategy">Strategic Priorities</div>
          <div class="section-content">
            ${data.priorities.map((p, i) => `
              <div class="field" style="margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 10px;">
                <div><strong>${i + 1}. ${escapeHtml(p.name || p.title || 'Priority')}</strong></div>
                ${p.whyItMatters ? `<div style="margin-left: 20px; margin-top: 5px;"><span class="field-label">Why:</span> ${escapeHtml(p.whyItMatters)}</div>` : ''}
                ${p.capabilitiesRequired ? `<div style="margin-left: 20px;"><span class="field-label">Capabilities:</span> ${escapeHtml(p.capabilitiesRequired)}</div>` : ''}
                ${p.successLooksLike ? `<div style="margin-left: 20px;"><span class="field-label">Success:</span> ${escapeHtml(p.successLooksLike)}</div>` : ''}
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    // WWW Actions
    if (data.wwwActions?.length > 0) {
      html += renderStrategySection('WWW Actions (Who, What, When)', data.wwwActions.map(a => ({
        label: `${a.who || 'Unknown'} - ${a.what || 'Action'}`,
        value: a.when || 'Not scheduled'
      })));
    }

    // Rockefeller Habits
    if (data.habits?.length > 0) {
      html += renderStrategySection('Rockefeller Habits', data.habits.map(h => ({
        label: h.name || 'Habit',
        value: h.description || ''
      })));
    }

    // Projects
    if (data.projects?.length > 0) {
      html += `
        <div class="section">
          <div class="section-header strategy">Project Portfolio</div>
          <div class="section-content">
            ${data.projects.map(p => `
              <div class="field" style="margin-bottom: 10px;">
                <span class="field-label">${escapeHtml(p.name || 'Project')}:</span>
                <span class="field-value">Owner: ${escapeHtml(p.owner || 'Unassigned')}, Status: ${escapeHtml(p.status || 'Planning')}, Progress: ${p.progress || 0}%</span>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }
  }

  // Section 11: 3-Year Strategy
  if (strategySheet.threeYearStrategy?.data) {
    const data = strategySheet.threeYearStrategy.data;
    ['year1', 'year2', 'year3'].forEach(year => {
      if (data[year]) {
        html += renderStrategySection(`Year ${year.replace('year', '')} Strategy`, [
          { label: 'Objectives', value: data[year].objectives?.join(', ') },
          { label: 'Initiatives', value: data[year].initiatives?.join(', ') },
          { label: 'Outcomes', value: data[year].outcomes?.join(', ') }
        ]);
      }
    });
  }

  // Section 12: SMART Goals
  if (strategySheet.smartGoals?.data) {
    const data = strategySheet.smartGoals.data;

    // Goals
    if (data.goals?.length > 0) {
      html += `
        <div class="section">
          <div class="section-header strategy">SMART Goals</div>
          <div class="section-content">
            ${data.goals.map((g, i) => `
              <div class="field" style="margin-bottom: 12px; padding-bottom: 10px; border-bottom: 1px solid #eee;">
                <div><strong>Goal ${i + 1}: ${escapeHtml(g.goal || 'Unnamed Goal')}</strong></div>
                ${g.metric ? `<div style="margin-left: 20px;"><span class="field-label">Metric:</span> ${escapeHtml(g.metric)}</div>` : ''}
                ${g.target ? `<div style="margin-left: 20px;"><span class="field-label">Target:</span> ${escapeHtml(g.target)}</div>` : ''}
                ${g.deadline ? `<div style="margin-left: 20px;"><span class="field-label">Deadline:</span> ${new Date(g.deadline).toLocaleDateString()}</div>` : ''}
                ${g.owner ? `<div style="margin-left: 20px;"><span class="field-label">Owner:</span> ${escapeHtml(g.owner)}</div>` : ''}
                ${g.progress ? `<div style="margin-left: 20px;"><span class="field-label">Progress:</span> ${g.progress}%</div>` : ''}
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    // OKRs
    if (data.okrs?.length > 0) {
      html += `
        <div class="section">
          <div class="section-header strategy">OKRs</div>
          <div class="section-content">
            ${data.okrs.map((okr, i) => `
              <div class="field" style="margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px solid #eee;">
                <div><strong>Objective ${i + 1}: ${escapeHtml(okr.objective || 'Unnamed Objective')}</strong></div>
                ${okr.keyResults?.length > 0 ? `
                  <div style="margin-left: 20px; margin-top: 5px;">
                    <span class="field-label">Key Results:</span>
                    <ul style="margin-left: 20px; margin-top: 5px;">
                      ${okr.keyResults.map(kr => `
                        <li>${escapeHtml(kr.text || 'KR')} ${kr.progress ? `(${kr.progress}%)` : ''}</li>
                      `).join('')}
                    </ul>
                  </div>
                ` : ''}
                ${okr.owner ? `<div style="margin-left: 20px;"><span class="field-label">Owner:</span> ${escapeHtml(okr.owner)}</div>` : ''}
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    // KPIs
    if (data.kpis?.length > 0) {
      html += `
        <div class="section">
          <div class="section-header strategy">KPIs</div>
          <div class="section-content">
            <div class="two-column">
              ${data.kpis.map(kpi => `
                <div class="field" style="margin-bottom: 8px;">
                  <span class="field-label">${escapeHtml(kpi.name || 'KPI')}:</span>
                  <span class="field-value">${escapeHtml(kpi.current || '0')} / ${escapeHtml(kpi.target || '0')} ${escapeHtml(kpi.unit || '')}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `;
    }
  }

  // Section 13: Quarterly Plan
  if (strategySheet.quarterlyPlan?.data?.quarters?.length > 0) {
    const quarters = strategySheet.quarterlyPlan.data.quarters;
    html += `
      <div class="section">
        <div class="section-header strategy">Quarterly Plan</div>
        <div class="section-content">
          ${quarters.map(q => `
            <div class="field" style="margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px solid #eee;">
              <div><strong>${escapeHtml(q.quarter || 'Q')} - ${escapeHtml(q.focusTheme || 'No Theme')}</strong>${q.owner ? ` (Owner: ${escapeHtml(q.owner)})` : ''}</div>
              ${q.keyActions?.length > 0 ? `
                <div style="margin-left: 20px; margin-top: 5px;">
                  <span class="field-label">Key Actions:</span> ${escapeHtml(q.keyActions.join(', '))}
                </div>
              ` : ''}
              ${q.kpis?.length > 0 ? `
                <div style="margin-left: 20px;">
                  <span class="field-label">KPIs:</span> ${escapeHtml(q.kpis.join(', '))}
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // Section 14: Revenue Model
  if (strategySheet.revenueModel?.data) {
    const data = strategySheet.revenueModel.data;
    html += renderStrategySection('Revenue Model Details', [
      { label: 'Revenue Streams', value: data.revenueStreams?.join(', ') },
      { label: 'Pricing Structure', value: data.pricingStructure },
      { label: 'Average Deal Size', value: data.averageDealSize ? `$${data.averageDealSize.toLocaleString()}` : '' },
      { label: 'Lead Requirements', value: data.leadRequirements },
      { label: 'Conversion Assumptions', value: data.conversionAssumptions }
    ]);

    // Cash Strategies
    if (data.cashStrategies?.length > 0) {
      html += renderStrategySection('Cash Strategies', data.cashStrategies.map(cs => ({
        label: cs.name || 'Strategy',
        value: cs.impact ? `Impact: ${cs.impact}` : ''
      })));
    }

    // ROI Calculations
    if (data.roiCalculations?.length > 0) {
      html += `
        <div class="section">
          <div class="section-header strategy">ROI Calculations</div>
          <div class="section-content">
            ${data.roiCalculations.map(roi => `
              <div class="field" style="margin-bottom: 10px;">
                <span class="field-label">${escapeHtml(roi.name || 'Investment')}:</span>
                <span class="field-value">Invest: $${(roi.investment || 0).toLocaleString()}, Return: $${(roi.return || 0).toLocaleString()}, Timeframe: ${roi.timeframe || 12} months</span>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }
  }

  // Section 15: Organizational Structure
  if (strategySheet.organizationalStructure?.data) {
    const data = strategySheet.organizationalStructure.data;

    // Roles
    if (data.roles?.length > 0) {
      html += `
        <div class="section">
          <div class="section-header strategy">Organizational Roles</div>
          <div class="section-content">
            ${data.roles.map(r => `
              <div class="field" style="margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid #eee;">
                <div><strong>${escapeHtml(r.role || 'Role')}</strong></div>
                ${r.responsibility ? `<div style="margin-left: 20px;"><span class="field-label">Responsibility:</span> ${escapeHtml(r.responsibility)}</div>` : ''}
                ${r.successMeasure ? `<div style="margin-left: 20px;"><span class="field-label">Success Measure:</span> ${escapeHtml(r.successMeasure)}</div>` : ''}
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    // Face Chart
    if (data.faceChart?.length > 0) {
      html += `
        <div class="section">
          <div class="section-header strategy">FACE Chart</div>
          <div class="section-content">
            ${data.faceChart.map(f => `
              <div class="field" style="margin-bottom: 10px;">
                <span class="field-label">${escapeHtml(f.function || 'Function')}:</span>
                <span class="field-value">Owner: ${escapeHtml(f.owner || 'Unassigned')}, A: ${escapeHtml(f.accountable || '-')}, C: ${escapeHtml(f.consulted || '-')}, I: ${escapeHtml(f.informed || '-')}</span>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    // Talent Assessment
    if (data.talentAssessment?.length > 0) {
      html += `
        <div class="section">
          <div class="section-header strategy">Talent Assessment</div>
          <div class="section-content">
            ${data.talentAssessment.map(t => `
              <div class="field" style="margin-bottom: 10px;">
                <span class="field-label">${escapeHtml(t.name || 'Team Member')} (${escapeHtml(t.role || 'No Role')}):</span>
                <span class="field-value">Performance: ${escapeHtml(t.performance || 'N/A')}, Potential: ${escapeHtml(t.potential || 'N/A')}${t.notes ? ` - ${escapeHtml(t.notes)}` : ''}</span>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }
  }

  // Section 16: SOP Roadmap
  if (strategySheet.sopRoadmap?.data) {
    const data = strategySheet.sopRoadmap.data;

    if (data.sops?.length > 0) {
      html += renderStrategySection('SOPs', data.sops.map(s => ({
        label: s.name || 'SOP',
        value: s.description || ''
      })));
    }

    if (data.paceChart?.length > 0) {
      html += `
        <div class="section">
          <div class="section-header strategy">PACE Chart</div>
          <div class="section-content">
            ${data.paceChart.map(p => `
              <div class="field" style="margin-bottom: 10px;">
                <span class="field-label">${escapeHtml(p.process || 'Process')}:</span>
                <span class="field-value">Owner: ${escapeHtml(p.owner || 'Unassigned')}, Frequency: ${escapeHtml(p.frequency || 'N/A')}, Status: ${escapeHtml(p.status || 'Not Started')}</span>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }
  }

  // Section 17: Automation & Systems
  if (strategySheet.automationSystems?.data) {
    const data = strategySheet.automationSystems.data;
    html += renderStrategySection('Automation & Systems', [
      { label: 'Core Tools', value: data.coreTools?.join(', ') },
      { label: 'Key Automations', value: data.keyAutomations?.join(', ') },
      { label: 'Dashboards Needed', value: data.dashboardsNeeded?.join(', ') }
    ]);
  }

  // Section 18: KPI Dashboard
  if (strategySheet.kpiDashboard?.data) {
    const data = strategySheet.kpiDashboard.data;
    html += renderStrategySection('KPI Dashboard', [
      { label: 'Financial KPIs', value: data.financialKpis?.join(', ') },
      { label: 'Sales KPIs', value: data.salesKpis?.join(', ') },
      { label: 'Operational KPIs', value: data.operationalKpis?.join(', ') },
      { label: 'Customer KPIs', value: data.customerKpis?.join(', ') },
      { label: 'People KPIs', value: data.peopleKpis?.join(', ') }
    ]);
  }

  // Section 19: Risk Management
  if (strategySheet.riskManagement?.data?.risks?.length > 0) {
    const risks = strategySheet.riskManagement.data.risks;
    html += `
      <div class="section">
        <div class="section-header strategy">Risk Management</div>
        <div class="section-content">
          ${risks.map((r, i) => `
            <div class="field" style="margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px solid #eee;">
              <div><strong>Risk ${i + 1}: ${escapeHtml(r.risk || 'Unnamed Risk')}</strong></div>
              <div style="margin-left: 20px; margin-top: 5px;">
                <span class="field-label">Probability:</span> ${escapeHtml(r.probability || 'N/A')}
                <span class="field-label" style="margin-left: 20px;">Impact:</span> ${escapeHtml(r.impact || 'N/A')}
              </div>
              ${r.preventionStrategy ? `<div style="margin-left: 20px;"><span class="field-label">Prevention:</span> ${escapeHtml(r.preventionStrategy)}</div>` : ''}
              ${r.monitoringMethod ? `<div style="margin-left: 20px;"><span class="field-label">Monitoring:</span> ${escapeHtml(r.monitoringMethod)}</div>` : ''}
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // Section 20: Strategy Summary
  if (strategySheet.strategySummary?.data) {
    const data = strategySheet.strategySummary.data;
    html += renderStrategySection('Strategy Summary', [
      { label: 'Who We Serve', value: data.whoWeServe },
      { label: 'Problem We Solve', value: data.problemWeSolve },
      { label: 'How We Make Money', value: data.howWeMakeMoney },
      { label: 'Why We Win', value: data.whyWeWin },
      { label: 'Year 1 Focus', value: data.year1Focus },
      { label: '3-Year Direction', value: data.threeYearDirection },
      { label: '10-Year Ambition', value: data.tenYearAmbition }
    ]);
  }

  return html;
};

// Render a strategy section (accepts array of field objects)
const renderStrategySection = (title, fields) => {
  if (!fields || fields.length === 0) return '';

  // Filter out fields with no value
  const validFields = fields.filter(f => {
    const val = f.value;
    return val !== undefined && val !== null && val !== '' && val !== 0 &&
           !(Array.isArray(val) && val.length === 0);
  });

  if (validFields.length === 0) return '';

  const content = validFields.map(field => {
    let value = field.value;

    // Handle arrays
    if (Array.isArray(value)) {
      value = value.join(', ');
    }

    return `
      <div class="field">
        <span class="field-label">${escapeHtml(field.label)}:</span>
        <span class="field-value">${escapeHtml(String(value))}</span>
      </div>
    `;
  }).join('');

  return `
    <div class="section">
      <div class="section-header strategy">${escapeHtml(title)}</div>
      <div class="section-content">
        ${content}
      </div>
    </div>
  `;
};

// Helper: Escape HTML
const escapeHtml = (str) => {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

// Helper: Render values array
const renderValues = (values) => {
  if (!values || !Array.isArray(values) || values.length === 0) {
    return '<span class="value-tag">Not defined</span>';
  }
  return values.map(v => {
    const text = typeof v === 'object' ? (v.value || v.name || 'Value') : String(v);
    return `<span class="value-tag">${escapeHtml(text)}</span>`;
  }).join('');

};

// Helper: Render array
const renderArray = (arr) => {
  if (!arr || !Array.isArray(arr) || arr.length === 0) {
    return '<span class="field-empty">None</span>';
  }
  return arr.map(item => {
    const text = typeof item === 'object' ? (item.name || item.title || 'Item') : String(item);
    return escapeHtml(text);
  }).join(', ');
};

export default generatePDF;