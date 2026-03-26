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

  <!-- Legacy Vision Board Sections -->
  ${renderSection('Business Overview', sections.businessOverview?.data, [
    { key: 'businessName', label: 'Business Name' },
    { key: 'industry', label: 'Industry' },
    { key: 'visionStatement', label: 'Vision Statement' },
    { key: 'targetMarket', label: 'Target Market' }
  ])}

  ${renderSection('Financial Goals', sections.financialGoals?.data, [
    { key: 'annualRevenue', label: 'Annual Revenue Goal', format: 'currency' },
    { key: 'monthlyRevenue', label: 'Monthly Revenue Goal', format: 'currency' },
    { key: 'profitMargin', label: 'Profit Margin', format: 'percent' },
    { key: 'personalIncome', label: 'Personal Income Goal', format: 'currency' }
  ], true)}

  ${renderSection('Growth Strategy', sections.growthStrategy?.data, [
    { key: 'primaryRevenueSources', label: 'Primary Revenue Sources' },
    { key: 'targetCustomerSegments', label: 'Target Customer Segments' },
    { key: 'highValueClients', label: 'High-Value Clients' }
  ])}

  ${renderSection('Product/Service', sections.productService?.data, [
    { key: 'currentServices', label: 'Current Services' },
    { key: 'futureProducts', label: 'Future Products' }
  ])}

  ${renderSection('Systems to Build', sections.systemsToBuild?.data, [
    { key: 'crmSystem', label: 'CRM System' },
    { key: 'salesFunnel', label: 'Sales Funnel' },
    { key: 'operations', label: 'Operations' }
  ])}

  ${renderSection('Team Plan', sections.teamPlan?.data, [
    { key: 'currentTeam', label: 'Current Team' },
    { key: 'futureHires', label: 'Future Hires' }
  ])}

  ${renderSection('Brand Goals', sections.brandGoals?.data, [
    { key: 'websiteLeads', label: 'Website Leads/Month' },
    { key: 'socialFollowers', label: 'Social Media Followers' }
  ], true)}

  ${renderSection('Lifestyle Vision', sections.lifestyleVision?.data, [
    { key: 'workingHours', label: 'Working Hours/Day' },
    { key: 'freeDays', label: 'Free Days/Month' },
    { key: 'travelGoals', label: 'Travel Goals' }
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

// Render strategy sheet sections
const renderStrategySheetSections = (strategySheet) => {
  const sections = [
    { id: 'companyOverview', title: 'Company Overview' },
    { id: 'corePurpose', title: 'Core Purpose' },
    { id: 'vision', title: 'Vision' },
    { id: 'mission', title: 'Mission' },
    { id: 'brandPromise', title: 'Brand Promise' },
    { id: 'coreValues', title: 'Core Values' },
    { id: 'bhag', title: 'BHAG' },
    { id: 'vividDescription', title: 'Vivid Description' },
    { id: 'swotAnalysis', title: 'SWOT Analysis' },
    { id: 'strategicPriorities', title: 'Strategic Priorities' },
    { id: 'threeYearStrategy', title: '3-Year Strategy' },
    { id: 'smartGoals', title: 'SMART Goals' },
    { id: 'quarterlyPlan', title: 'Quarterly Plan' },
    { id: 'revenueModel', title: 'Revenue Model' },
    { id: 'organizationalStructure', title: 'Organizational Structure' },
    { id: 'sopRoadmap', title: 'SOP Roadmap' },
    { id: 'automationSystems', title: 'Automation & Systems' },
    { id: 'kpiDashboard', title: 'KPI Dashboard' },
    { id: 'riskManagement', title: 'Risk Management' },
    { id: 'strategySummary', title: 'Strategy Summary' }
  ];

  return sections.map(section => {
    const data = strategySheet[section.id]?.data;
    if (!data || Object.keys(data).length === 0) return '';

    return renderStrategySection(section.id, section.title, data);
  }).join('');
};

// Render a strategy section
const renderStrategySection = (sectionId, title, data) => {
  const fields = Object.keys(data).slice(0, 15); // Limit fields to prevent overflow

  const content = fields.map(key => {
    const value = data[key];
    const label = safeFormatFieldName(key);

    if (value === undefined || value === null || value === '') {
      return `
        <div class="field">
          <span class="field-label">${escapeHtml(label)}:</span>
          <span class="field-value field-empty">Not specified</span>
        </div>
      `;
    }

    return `
      <div class="field">
        <span class="field-label">${escapeHtml(label)}:</span>
        <span class="field-value">${escapeHtml(safeString(value))}</span>
      </div>
    `;
  }).join('');

  return `
    <div class="section">
      <div class="section-header strategy">${escapeHtml(title)}</div>
      <div class="section-content">
        ${content || '<p class="field-empty">Not yet completed</p>'}
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