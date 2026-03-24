// PDF Generator utility for exporting Vision Board and Strategy Sheet

export const generatePDF = async (visionBoard, options = {}) => {
  const { includeStrategySheet = true, onePageSummary = false } = options;

  // Create a printable version of the vision board
  const printContent = createPrintContent(visionBoard, { includeStrategySheet, onePageSummary });

  // Open print dialog
  const printWindow = window.open('', '_blank');
  printWindow.document.write(printContent);
  printWindow.document.close();

  // Wait for content to load then print
  printWindow.onload = () => {
    printWindow.print();
    printWindow.close();
  };
};

// Strategy Sheet section names for display
const STRATEGY_SECTION_NAMES = {
  companyOverview: 'Company Overview',
  corePurpose: 'Core Purpose',
  vision: 'Vision',
  mission: 'Mission',
  brandPromise: 'Brand Promise',
  coreValues: 'Core Values',
  bhag: 'BHAG (Big Hairy Audacious Goal)',
  vividDescription: 'Vivid Description',
  swotAnalysis: 'SWOT Analysis',
  strategicPriorities: 'Strategic Priorities',
  threeYearStrategy: '3-Year Strategy',
  smartGoals: 'SMART Goals',
  quarterlyPlan: 'Quarterly Plan',
  revenueModel: 'Revenue Model',
  organizationalStructure: 'Organizational Structure',
  sopRoadmap: 'SOP Roadmap',
  automationSystems: 'Automation & Systems',
  kpiDashboard: 'KPI Dashboard',
  riskManagement: 'Risk Management',
  strategySummary: 'Strategy Summary'
};

// Legacy Vision Board section names
const LEGACY_SECTION_NAMES = {
  businessOverview: 'Business Overview',
  financialGoals: 'Financial Goals',
  growthStrategy: 'Growth Strategy',
  productService: 'Product/Service Plan',
  systemsToBuild: 'Systems to Build',
  teamPlan: 'Team Plan',
  brandGoals: 'Brand Goals',
  lifestyleVision: 'Lifestyle Vision'
};

// Strategy Sheet Icons (for visual reference in PDF)
const SECTION_ICONS = {
  companyOverview: '🏢',
  corePurpose: '🎯',
  vision: '🔭',
  mission: '📍',
  brandPromise: '💎',
  coreValues: '⚖️',
  bhag: '🚀',
  vividDescription: '🎨',
  swotAnalysis: '📊',
  strategicPriorities: '🎯',
  threeYearStrategy: '📅',
  smartGoals: '✅',
  quarterlyPlan: '📆',
  revenueModel: '💰',
  organizationalStructure: '👥',
  sopRoadmap: '📋',
  automationSystems: '⚙️',
  kpiDashboard: '📈',
  riskManagement: '🛡️',
  strategySummary: '📝'
};

const createPrintContent = (visionBoard, options) => {
  const { includeStrategySheet, onePageSummary } = options;
  const sections = visionBoard.sections || {};
  const strategySheet = visionBoard.strategySheet || {};

  // If one-page summary, use compact format
  if (onePageSummary) {
    return createOnePageSummary(visionBoard, strategySheet);
  }

  // Build full PDF content
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
      <title>Vision Board - ${visionBoard.name}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          padding: 40px;
          max-width: 1200px;
          margin: 0 auto;
          color: #1a1a1a;
        }
        .header {
          text-align: center;
          margin-bottom: 40px;
          padding-bottom: 20px;
          border-bottom: 3px solid #0ea5e9;
        }
        .header h1 {
          font-size: 32px;
          color: #0c4a6e;
          margin-bottom: 10px;
        }
        .header .subtitle {
          color: #64748b;
          font-size: 14px;
        }
        .progress-bar {
          height: 20px;
          background: #e2e8f0;
          border-radius: 10px;
          margin: 20px 0;
          overflow: hidden;
        }
        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #0ea5e9, #22c55e);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 12px;
        }
        .section {
          margin-bottom: 30px;
          page-break-inside: avoid;
        }
        .section-header {
          background: linear-gradient(135deg, #0ea5e9, #0284c7);
          color: white;
          padding: 15px 20px;
          border-radius: 8px 8px 0 0;
          font-size: 18px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .section-header.strategy {
          background: linear-gradient(135deg, #8b5cf6, #7c3aed);
        }
        .section-content {
          border: 1px solid #e2e8f0;
          border-top: none;
          padding: 20px;
          border-radius: 0 0 8px 8px;
          background: #fafafa;
        }
        .field {
          margin-bottom: 12px;
          display: flex;
        }
        .field-label {
          font-weight: 600;
          min-width: 180px;
          color: #475569;
        }
        .field-value {
          color: #1e293b;
        }
        .field-value.empty {
          color: #94a3b8;
          font-style: italic;
        }
        .two-column {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        .section-divider {
          margin: 50px 0 30px;
          text-align: center;
        }
        .divider-title {
          display: inline-block;
          padding: 15px 40px;
          background: linear-gradient(135deg, #8b5cf6, #7c3aed);
          color: white;
          border-radius: 30px;
          font-size: 24px;
        }
        .swot-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }
        .swot-box {
          padding: 15px;
          border-radius: 8px;
          background: #f8fafc;
        }
        .swot-box.strengths { border-left: 4px solid #22c55e; }
        .swot-box.weaknesses { border-left: 4px solid #ef4444; }
        .swot-box.opportunities { border-left: 4px solid #3b82f6; }
        .swot-box.threats { border-left: 4px solid #f59e0b; }
        .swot-title {
          font-weight: 600;
          margin-bottom: 8px;
          color: #334155;
        }
        .swot-items {
          font-size: 14px;
          color: #64748b;
        }
        .values-list {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }
        .value-item {
          padding: 8px 16px;
          background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
          border-radius: 20px;
          font-size: 14px;
          color: #0369a1;
        }
        .priority-item {
          padding: 12px;
          margin-bottom: 10px;
          background: #f8fafc;
          border-radius: 8px;
          border-left: 4px solid #0ea5e9;
        }
        .priority-title {
          font-weight: 600;
          color: #0c4a6e;
          margin-bottom: 4px;
        }
        .priority-desc {
          font-size: 14px;
          color: #64748b;
        }
        .kpi-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 15px;
        }
        .kpi-item {
          padding: 15px;
          background: #f8fafc;
          border-radius: 8px;
          text-align: center;
        }
        .kpi-name {
          font-size: 12px;
          color: #64748b;
          margin-bottom: 5px;
        }
        .kpi-value {
          font-size: 20px;
          font-weight: bold;
          color: #0c4a6e;
        }
        .footer {
          margin-top: 40px;
          text-align: center;
          color: #94a3b8;
          font-size: 12px;
          border-top: 1px solid #e2e8f0;
          padding-top: 20px;
        }
        @media print {
          body { padding: 20px; }
          .section { page-break-inside: avoid; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${visionBoard.name}</h1>
        <div class="subtitle">Business Vision Board & Strategy Sheet</div>
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${visionBoard.overallProgress}%">
            ${visionBoard.overallProgress}% Complete
          </div>
        </div>
      </div>

      <!-- Legacy Vision Board Sections -->
      ${renderSection('Business Overview', sections.businessOverview?.data, [
        { key: 'businessName', label: 'Business Name' },
        { key: 'industry', label: 'Industry' },
        { key: 'visionStatement', label: 'Vision Statement', multiline: true },
        { key: 'targetRevenue', label: 'Target Revenue', format: 'currency' },
        { key: 'targetMarket', label: 'Target Market' }
      ])}

      ${renderSection('Financial Goals', sections.financialGoals?.data, [
        { key: 'annualRevenue', label: 'Annual Revenue Goal', format: 'currency' },
        { key: 'monthlyRevenue', label: 'Monthly Revenue Goal', format: 'currency' },
        { key: 'profitMargin', label: 'Target Profit Margin', format: 'percent' },
        { key: 'personalIncome', label: 'Personal Income Goal', format: 'currency' },
        { key: 'cashReserve', label: 'Cash Reserve Target', format: 'currency' }
      ], true)}

      ${renderSection('Growth Strategy', sections.growthStrategy?.data, [
        { key: 'revenueSources', label: 'Primary Revenue Sources', format: 'array' },
        { key: 'customerSegments', label: 'Target Customer Segments', format: 'array' },
        { key: 'highValueClients', label: 'Top High-Value Clients', format: 'array' }
      ])}

      ${renderSection('Product/Service Plan', sections.productService?.data, [
        { key: 'currentServices', label: 'Current Services', format: 'array' },
        { key: 'futureProducts', label: 'Future Products/Services', format: 'array' }
      ])}

      ${renderSection('Systems to Build', sections.systemsToBuild?.data, [
        { key: 'systems', label: 'Systems', format: 'systems' }
      ])}

      ${renderSection('Team Plan', sections.teamPlan?.data, [
        { key: 'roles', label: 'Team Roles', format: 'roles' }
      ])}

      ${renderSection('Brand Goals', sections.brandGoals?.data, [
        { key: 'websiteLeads', label: 'Website Leads/Month', format: 'number' },
        { key: 'socialFollowers', label: 'Social Media Followers', format: 'number' },
        { key: 'caseStudies', label: 'Case Studies Target', format: 'number' },
        { key: 'speakingEvents', label: 'Speaking/Events Goals' }
      ], true)}

      ${renderSection('Lifestyle Vision', sections.lifestyleVision?.data, [
        { key: 'workingHours', label: 'Working Hours/Day', format: 'number' },
        { key: 'freeDays', label: 'Free Days/Month', format: 'number' },
        { key: 'travelGoals', label: 'Travel Goals', multiline: true },
        { key: 'netWorth', label: 'Net Worth Target', format: 'currency' }
      ], true)}

      ${strategyContent}

      <div class="footer">
        Generated by VisionBoard Pro | ${new Date().toLocaleDateString()}
      </div>
    </body>
    </html>
  `;
};

// Create a one-page summary
const createOnePageSummary = (visionBoard, strategySheet) => {
  const summary = strategySheet.strategySummary?.data || {};
  const companyOverview = strategySheet.companyOverview?.data || {};
  const corePurpose = strategySheet.corePurpose?.data || {};
  const vision = strategySheet.vision?.data || {};
  const mission = strategySheet.mission?.data || {};
  const bhag = strategySheet.bhag?.data || {};
  const coreValues = strategySheet.coreValues?.data || {};

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>One-Page Strategy - ${visionBoard.name}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          padding: 30px;
          max-width: 1000px;
          margin: 0 auto;
          color: #1a1a1a;
          font-size: 12px;
        }
        .header {
          text-align: center;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 2px solid #0ea5e9;
        }
        .header h1 {
          font-size: 24px;
          color: #0c4a6e;
          margin-bottom: 5px;
        }
        .header .tagline {
          color: #64748b;
          font-size: 14px;
        }
        .two-col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 20px;
        }
        .three-col {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 15px;
          margin-bottom: 20px;
        }
        .box {
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 15px;
          background: #fafafa;
        }
        .box-title {
          font-size: 11px;
          font-weight: 600;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
          border-bottom: 1px solid #e2e8f0;
          padding-bottom: 5px;
        }
        .box-content {
          font-size: 13px;
          color: #334155;
          line-height: 1.5;
        }
        .box-content.highlight {
          font-size: 14px;
          font-weight: 500;
        }
        .values-row {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .value-tag {
          padding: 4px 10px;
          background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
          border-radius: 12px;
          font-size: 11px;
          color: #0369a1;
        }
        .full-width {
          grid-column: 1 / -1;
        }
        .swot-mini {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }
        .swot-mini-item {
          padding: 10px;
          background: #f8fafc;
          border-radius: 6px;
        }
        .swot-mini-item.strengths { border-left: 3px solid #22c55e; }
        .swot-mini-item.weaknesses { border-left: 3px solid #ef4444; }
        .swot-mini-item.opportunities { border-left: 3px solid #3b82f6; }
        .swot-mini-item.threats { border-left: 3px solid #f59e0b; }
        .swot-mini-title {
          font-weight: 600;
          font-size: 10px;
          color: #64748b;
          margin-bottom: 5px;
        }
        .footer {
          margin-top: 20px;
          text-align: center;
          color: #94a3b8;
          font-size: 10px;
        }
        @media print {
          body { padding: 20px; font-size: 11px; }
          .box { break-inside: avoid; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${companyOverview.companyName || visionBoard.name}</h1>
        <div class="tagline">${corePurpose.purposeStatement || 'Your Business Strategy'}</div>
      </div>

      <!-- Core Purpose, Vision, Mission -->
      <div class="three-col">
        <div class="box">
          <div class="box-title">Core Purpose</div>
          <div class="box-content highlight">${corePurpose.purposeStatement || 'Not defined'}</div>
        </div>
        <div class="box">
          <div class="box-title">Vision</div>
          <div class="box-content">${vision.visionStatement || 'Not defined'}</div>
        </div>
        <div class="box">
          <div class="box-title">Mission</div>
          <div class="box-content">${mission.missionStatement || 'Not defined'}</div>
        </div>
      </div>

      <!-- BHAG & Brand Promise -->
      <div class="two-col">
        <div class="box">
          <div class="box-title">BHAG (10-Year Goal)</div>
          <div class="box-content highlight">${bhag.bhagStatement || 'Not defined'}</div>
        </div>
        <div class="box">
          <div class="box-title">Brand Promise</div>
          <div class="box-content">${strategySheet.brandPromise?.data?.promiseStatement || 'Not defined'}</div>
        </div>
      </div>

      <!-- Core Values -->
      <div class="box" style="margin-bottom: 20px;">
        <div class="box-title">Core Values</div>
        <div class="values-row">
          ${(coreValues.values || []).map(v => `<span class="value-tag">${v.name || v}</span>`).join('')}
          ${(!coreValues.values || coreValues.values.length === 0) ? '<span class="value-tag">Not defined</span>' : ''}
        </div>
      </div>

      <!-- Strategy Summary -->
      <div class="three-col">
        <div class="box">
          <div class="box-title">Who We Serve</div>
          <div class="box-content">${summary.whoWeServe || companyOverview.targetCustomerProfile?.whoBuys || 'Not defined'}</div>
        </div>
        <div class="box">
          <div class="box-title">Problem We Solve</div>
          <div class="box-content">${summary.problemWeSolve || companyOverview.primaryProblem || 'Not defined'}</div>
        </div>
        <div class="box">
          <div class="box-title">How We Win</div>
          <div class="box-content">${summary.whyWeWin || companyOverview.uniqueDifferentiation || 'Not defined'}</div>
        </div>
      </div>

      <!-- SWOT Analysis -->
      <div class="box" style="margin-bottom: 20px;">
        <div class="box-title">SWOT Analysis</div>
        <div class="swot-mini">
          <div class="swot-mini-item strengths">
            <div class="swot-mini-title">Strengths</div>
            <div>${formatArrayOrText(strategySheet.swotAnalysis?.data?.strengths)}</div>
          </div>
          <div class="swot-mini-item weaknesses">
            <div class="swot-mini-title">Weaknesses</div>
            <div>${formatArrayOrText(strategySheet.swotAnalysis?.data?.weaknesses)}</div>
          </div>
          <div class="swot-mini-item opportunities">
            <div class="swot-mini-title">Opportunities</div>
            <div>${formatArrayOrText(strategySheet.swotAnalysis?.data?.opportunities)}</div>
          </div>
          <div class="swot-mini-item threats">
            <div class="swot-mini-title">Threats</div>
            <div>${formatArrayOrText(strategySheet.swotAnalysis?.data?.threats)}</div>
          </div>
        </div>
      </div>

      <!-- Strategic Priorities -->
      <div class="box" style="margin-bottom: 20px;">
        <div class="box-title">Strategic Priorities (This Year)</div>
        <div class="three-col">
          ${(strategySheet.strategicPriorities?.data?.priorities || []).slice(0, 3).map((p, i) => `
            <div class="swot-mini-item" style="border-left-color: #0ea5e9;">
              <div class="swot-mini-title">Priority ${i + 1}</div>
              <div style="font-weight: 600; color: #0c4a6e; margin-bottom: 3px;">${p.name || p.title || p}</div>
              <div style="font-size: 11px; color: #64748b;">${p.description || ''}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Time Horizon -->
      <div class="three-col">
        <div class="box">
          <div class="box-title">Year 1 Focus</div>
          <div class="box-content">${summary.year1Focus || 'Not defined'}</div>
        </div>
        <div class="box">
          <div class="box-title">3-Year Direction</div>
          <div class="box-content">${summary.threeYearDirection || strategySheet.threeYearStrategy?.data?.overview || 'Not defined'}</div>
        </div>
        <div class="box">
          <div class="box-title">10-Year Ambition</div>
          <div class="box-content">${summary.tenYearAmbition || 'Not defined'}</div>
        </div>
      </div>

      <div class="footer">
        One-Page Strategy | VisionBoard Pro | ${new Date().toLocaleDateString()}
      </div>
    </body>
    </html>
  `;
};

// Render Strategy Sheet sections
const renderStrategySheetSections = (strategySheet) => {
  const sections = [
    { id: 'companyOverview', title: 'Company Overview', icon: '🏢' },
    { id: 'corePurpose', title: 'Core Purpose', icon: '🎯' },
    { id: 'vision', title: 'Vision', icon: '🔭' },
    { id: 'mission', title: 'Mission', icon: '📍' },
    { id: 'brandPromise', title: 'Brand Promise', icon: '💎' },
    { id: 'coreValues', title: 'Core Values', icon: '⚖️' },
    { id: 'bhag', title: 'BHAG', icon: '🚀' },
    { id: 'vividDescription', title: 'Vivid Description', icon: '🎨' },
    { id: 'swotAnalysis', title: 'SWOT Analysis', icon: '📊' },
    { id: 'strategicPriorities', title: 'Strategic Priorities', icon: '🎯' },
    { id: 'threeYearStrategy', title: '3-Year Strategy', icon: '📅' },
    { id: 'smartGoals', title: 'SMART Goals', icon: '✅' },
    { id: 'quarterlyPlan', title: 'Quarterly Plan', icon: '📆' },
    { id: 'revenueModel', title: 'Revenue Model', icon: '💰' },
    { id: 'organizationalStructure', title: 'Organizational Structure', icon: '👥' },
    { id: 'sopRoadmap', title: 'SOP Roadmap', icon: '📋' },
    { id: 'automationSystems', title: 'Automation & Systems', icon: '⚙️' },
    { id: 'kpiDashboard', title: 'KPI Dashboard', icon: '📈' },
    { id: 'riskManagement', title: 'Risk Management', icon: '🛡️' },
    { id: 'strategySummary', title: 'Strategy Summary', icon: '📝' }
  ];

  return sections.map(section => {
    const data = strategySheet[section.id]?.data;
    if (!data || Object.keys(data).length === 0) return '';

    return renderStrategySection(section.id, section.title, section.icon, data);
  }).join('');
};

// Render individual strategy section
const renderStrategySection = (sectionId, title, icon, data) => {
  // Special handling for certain sections
  if (sectionId === 'swotAnalysis') {
    return renderSWOTSection(title, icon, data);
  }
  if (sectionId === 'coreValues') {
    return renderCoreValuesSection(title, icon, data);
  }
  if (sectionId === 'strategicPriorities') {
    return renderPrioritiesSection(title, icon, data);
  }
  if (sectionId === 'kpiDashboard') {
    return renderKPISection(title, icon, data);
  }
  if (sectionId === 'smartGoals') {
    return renderSmartGoalsSection(title, icon, data);
  }
  if (sectionId === 'riskManagement') {
    return renderRiskSection(title, icon, data);
  }

  // Generic section rendering
  const fields = Object.entries(data).map(([key, value]) => {
    const label = formatFieldName(key);
    return { key, label, value };
  });

  const content = fields.map(field => {
    const valueStr = formatValue(field.value);
    return `
      <div class="field">
        <span class="field-label">${field.label}:</span>
        <span class="field-value">${valueStr}</span>
      </div>
    `;
  }).join('');

  return `
    <div class="section">
      <div class="section-header strategy">
        <span>${icon}</span>
        ${title}
      </div>
      <div class="section-content">
        ${content || '<p style="color: #94a3b8; font-style: italic;">Not yet completed</p>'}
      </div>
    </div>
  `;
};

// SWOT Analysis special section
const renderSWOTSection = (title, icon, data) => {
  return `
    <div class="section">
      <div class="section-header strategy">
        <span>${icon}</span>
        ${title}
      </div>
      <div class="section-content">
        <div class="swot-grid">
          <div class="swot-box strengths">
            <div class="swot-title">Strengths</div>
            <div class="swot-items">${formatArrayOrText(data.strengths)}</div>
          </div>
          <div class="swot-box weaknesses">
            <div class="swot-title">Weaknesses</div>
            <div class="swot-items">${formatArrayOrText(data.weaknesses)}</div>
          </div>
          <div class="swot-box opportunities">
            <div class="swot-title">Opportunities</div>
            <div class="swot-items">${formatArrayOrText(data.opportunities)}</div>
          </div>
          <div class="swot-box threats">
            <div class="swot-title">Threats</div>
            <div class="swot-items">${formatArrayOrText(data.threats)}</div>
          </div>
        </div>
      </div>
    </div>
  `;
};

// Core Values special section
const renderCoreValuesSection = (title, icon, data) => {
  const values = data.values || [];
  const valuesHtml = values.length > 0
    ? values.map(v => `<span class="value-item">${typeof v === 'object' ? v.name : v}</span>`).join('')
    : '<span class="field-value empty">Not defined</span>';

  return `
    <div class="section">
      <div class="section-header strategy">
        <span>${icon}</span>
        ${title}
      </div>
      <div class="section-content">
        <div class="values-list">
          ${valuesHtml}
        </div>
        ${data.description ? `<p style="margin-top: 15px; color: #64748b;">${data.description}</p>` : ''}
      </div>
    </div>
  `;
};

// Strategic Priorities special section
const renderPrioritiesSection = (title, icon, data) => {
  const priorities = data.priorities || [];
  const prioritiesHtml = priorities.map(p => `
    <div class="priority-item">
      <div class="priority-title">${p.name || p.title}</div>
      <div class="priority-desc">${p.description || ''}</div>
    </div>
  `).join('');

  return `
    <div class="section">
      <div class="section-header strategy">
        <span>${icon}</span>
        ${title}
      </div>
      <div class="section-content">
        ${prioritiesHtml || '<p style="color: #94a3b8; font-style: italic;">Not yet completed</p>'}
      </div>
    </div>
  `;
};

// KPI Dashboard special section
const renderKPISection = (title, icon, data) => {
  const kpis = data.kpis || data.metrics || [];

  if (Array.isArray(kpis) && kpis.length > 0) {
    const kpisHtml = kpis.map(kpi => `
      <div class="kpi-item">
        <div class="kpi-name">${kpi.name || kpi.label}</div>
        <div class="kpi-value">${kpi.value || kpi.target || 'N/A'}</div>
        ${kpi.unit ? `<div style="font-size: 10px; color: #94a3b8;">${kpi.unit}</div>` : ''}
      </div>
    `).join('');

    return `
      <div class="section">
        <div class="section-header strategy">
          <span>${icon}</span>
          ${title}
        </div>
        <div class="section-content">
          <div class="kpi-grid">
            ${kpisHtml}
          </div>
        </div>
      </div>
    `;
  }

  // Generic rendering for other KPI data structures
  return renderStrategySection('kpiDashboard', title, icon, data);
};

// SMART Goals special section
const renderSmartGoalsSection = (title, icon, data) => {
  const goals = data.goals || [];

  if (Array.isArray(goals) && goals.length > 0) {
    const goalsHtml = goals.map((goal, index) => `
      <div class="priority-item">
        <div class="priority-title">${index + 1}. ${goal.title || goal.name}</div>
        ${goal.description ? `<div class="priority-desc">${goal.description}</div>` : ''}
        ${goal.target ? `<div style="font-size: 12px; color: #0ea5e9; margin-top: 5px;">Target: ${goal.target}</div>` : ''}
        ${goal.deadline ? `<div style="font-size: 12px; color: #64748b;">Deadline: ${goal.deadline}</div>` : ''}
      </div>
    `).join('');

    return `
      <div class="section">
        <div class="section-header strategy">
          <span>${icon}</span>
          ${title}
        </div>
        <div class="section-content">
          ${goalsHtml}
        </div>
      </div>
    `;
  }

  return renderStrategySection('smartGoals', title, icon, data);
};

// Risk Management special section
const renderRiskSection = (title, icon, data) => {
  const risks = data.risks || [];

  if (Array.isArray(risks) && risks.length > 0) {
    const risksHtml = risks.map(risk => `
      <div class="priority-item" style="border-left-color: ${risk.severity === 'high' ? '#ef4444' : risk.severity === 'medium' ? '#f59e0b' : '#22c55e'};">
        <div class="priority-title">${risk.name || risk.description}</div>
        ${risk.mitigation ? `<div class="priority-desc">Mitigation: ${risk.mitigation}</div>` : ''}
        ${risk.likelihood ? `<div style="font-size: 12px; color: #64748b;">Likelihood: ${risk.likelihood}</div>` : ''}
      </div>
    `).join('');

    return `
      <div class="section">
        <div class="section-header strategy">
          <span>${icon}</span>
          ${title}
        </div>
        <div class="section-content">
          ${risksHtml}
        </div>
      </div>
    `;
  }

  return renderStrategySection('riskManagement', title, icon, data);
};

// Render legacy section
const renderSection = (title, data, fields, twoColumn = false) => {
  if (!data || Object.keys(data).length === 0) {
    return `
      <div class="section">
        <div class="section-header">${title}</div>
        <div class="section-content">
          <p style="color: #94a3b8; font-style: italic;">Not yet completed</p>
        </div>
      </div>
    `;
  }

  const content = fields.map(field => {
    let value = data[field.key];

    if (value === undefined || value === null || value === '') {
      return `
        <div class="field">
          <span class="field-label">${field.label}:</span>
          <span class="field-value empty">Not specified</span>
        </div>
      `;
    }

    // Format value based on type
    if (field.format === 'currency') {
      value = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0
      }).format(value);
    } else if (field.format === 'percent') {
      value = `${value}%`;
    } else if (field.format === 'number') {
      value = new Intl.NumberFormat('en-US').format(value);
    } else if (field.format === 'array' && Array.isArray(value)) {
      value = value.map(item => typeof item === 'object' ? item.name || item : item).join(', ');
    } else if (field.format === 'systems' && Array.isArray(value)) {
      value = value.map(s => `${s.name} (${s.status})`).join(', ');
    } else if (field.format === 'roles' && Array.isArray(value)) {
      value = value.map(r => `${r.role} - ${r.timeline} (${r.status})`).join(', ');
    }

    const isMultiline = field.multiline || field.format === 'array';

    return `
      <div class="field" style="${isMultiline ? 'flex-direction: column;' : ''}">
        <span class="field-label">${field.label}:</span>
        <span class="field-value">${value}</span>
      </div>
    `;
  }).join('');

  return `
    <div class="section">
      <div class="section-header">${title}</div>
      <div class="section-content ${twoColumn ? 'two-column' : ''}">
        ${content}
      </div>
    </div>
  `;
};

// Helper functions
const formatFieldName = (key) => {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
};

const formatValue = (value) => {
  if (value === null || value === undefined || value === '') {
    return '<span class="field-value empty">Not specified</span>';
  }

  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }

  if (typeof value === 'number') {
    return value.toLocaleString();
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return '<span class="field-value empty">None</span>';
    }
    return value.map(item => {
      if (typeof item === 'object') {
        return item.name || item.title || JSON.stringify(item);
      }
      return item;
    }).join(', ');
  }

  if (typeof value === 'object') {
    return Object.entries(value)
      .map(([k, v]) => `${formatFieldName(k)}: ${formatValue(v)}`)
      .join('<br>');
  }

  return String(value);
};

const formatArrayOrText = (value) => {
  if (!value) return 'Not specified';

  if (Array.isArray(value)) {
    if (value.length === 0) return 'None';
    return value.map(item => {
      if (typeof item === 'object') {
        return item.name || item.title || item.description || JSON.stringify(item);
      }
      return item;
    }).join(', ');
  }

  return String(value);
};

export default generatePDF;