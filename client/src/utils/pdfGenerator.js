// PDF Generator utility for exporting Vision Board

export const generatePDF = async (visionBoard) => {
  // Create a printable version of the vision board
  const printContent = createPrintContent(visionBoard);

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

const createPrintContent = (visionBoard) => {
  const sections = visionBoard.sections || {};

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
        <div class="subtitle">Business Vision Board</div>
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${visionBoard.overallProgress}%">
            ${visionBoard.overallProgress}% Complete
          </div>
        </div>
      </div>

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

      <div class="footer">
        Generated by VisionBoard Pro | ${new Date().toLocaleDateString()}
      </div>
    </body>
    </html>
  `;
};

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

export default generatePDF;