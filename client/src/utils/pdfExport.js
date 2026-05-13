/**
 * PDF Export Utility for Product Planning
 * Generates a professional PDF document from product planning data
 */

export const generateProductPlanPDF = (product) => {
  // Create HTML content for the PDF
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${product.name} - Product Plan</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Arial', sans-serif;
      line-height: 1.6;
      color: #333;
      background: #fff;
    }
    .page {
      width: 210mm;
      min-height: 297mm;
      padding: 20mm;
      margin: 0 auto;
      page-break-after: always;
    }
    .cover {
      height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }
    .cover h1 {
      font-size: 48px;
      margin-bottom: 20px;
      font-weight: bold;
    }
    .cover .subtitle {
      font-size: 24px;
      opacity: 0.9;
      margin-bottom: 40px;
    }
    .cover .meta {
      font-size: 16px;
      opacity: 0.8;
    }
    .section {
      margin-bottom: 30px;
      page-break-inside: avoid;
    }
    .section-title {
      font-size: 24px;
      color: #667eea;
      border-bottom: 3px solid #667eea;
      padding-bottom: 10px;
      margin-bottom: 20px;
    }
    .content-block {
      background: #f8f9fa;
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 15px;
    }
    .content-label {
      font-weight: bold;
      color: #666;
      font-size: 12px;
      text-transform: uppercase;
      margin-bottom: 5px;
    }
    .content-value {
      font-size: 14px;
      color: #333;
    }
    .two-column {
      display: flex;
      gap: 20px;
    }
    .two-column > div {
      flex: 1;
    }
    .metric-box {
      background: #667eea;
      color: white;
      padding: 20px;
      border-radius: 8px;
      text-align: center;
    }
    .metric-value {
      font-size: 36px;
      font-weight: bold;
    }
    .metric-label {
      font-size: 14px;
      opacity: 0.9;
    }
    .status-badge {
      display: inline-block;
      padding: 5px 15px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: bold;
      text-transform: uppercase;
    }
    .status-idea { background: #e2e8f0; color: #475569; }
    .status-validation { background: #fef3c7; color: #92400e; }
    .status-mvp { background: #dbeafe; color: #1e40af; }
    .status-launched { background: #d1fae5; color: #065f46; }
    .status-scaling { background: #e9d5ff; color: #6b21a8; }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
    }
    th, td {
      padding: 10px;
      text-align: left;
      border-bottom: 1px solid #e2e8f0;
    }
    th {
      background: #f1f5f9;
      font-weight: bold;
    }
    @media print {
      .page { page-break-after: always; }
      .no-break { page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  <!-- Cover Page -->
  <div class="page cover">
    <h1>${product.name}</h1>
    <p class="subtitle">Product Planning Document</p>
    <div class="meta">
      <p>Category: ${product.category?.toUpperCase() || 'N/A'}</p>
      <p>Status: <span class="status-badge status-${product.status}">${product.status?.toUpperCase() || 'IDEA'}</span></p>
      <p>Created: ${new Date(product.createdAt).toLocaleDateString()}</p>
    </div>
  </div>

  <!-- Problem Section -->
  <div class="page">
    <div class="section">
      <h2 class="section-title">1. Problem Definition</h2>

      <div class="content-block">
        <div class="content-label">What problem are you solving?</div>
        <div class="content-value">${product.problemDescription || 'Not defined'}</div>
      </div>

      <div class="content-block">
        <div class="content-label">Who is facing this problem?</div>
        <div class="content-value">${product.whoFacingProblem || 'Not defined'}</div>
      </div>

      <div class="two-column">
        <div class="content-block">
          <div class="content-label">Frequency</div>
          <div class="content-value">${product.frequency || 'Not defined'}</div>
        </div>
        <div class="content-block">
          <div class="content-label">Pain Level</div>
          <div class="content-value">${product.painLevel || 0}/10</div>
        </div>
      </div>
    </div>
  </div>

  <!-- Target Audience Section -->
  <div class="page">
    <div class="section">
      <h2 class="section-title">2. Target Audience</h2>

      <div class="two-column">
        <div class="content-block">
          <div class="content-label">Industry / Segment</div>
          <div class="content-value">${product.industry || 'Not defined'}</div>
        </div>
        <div class="content-block">
          <div class="content-label">Age Range</div>
          <div class="content-value">${product.ageRange || 'Not defined'}</div>
        </div>
      </div>

      <div class="two-column">
        <div class="content-block">
          <div class="content-label">Income Level</div>
          <div class="content-value">${product.incomeLevel || 'Not defined'}</div>
        </div>
        <div class="content-block">
          <div class="content-label">Location</div>
          <div class="content-value">${product.location || 'Not defined'}</div>
        </div>
      </div>

      <div class="content-block">
        <div class="content-label">Key Frustrations</div>
        <div class="content-value">${product.keyFrustrations || 'Not defined'}</div>
      </div>
    </div>
  </div>

  <!-- Validation Section -->
  <div class="page">
    <div class="section">
      <h2 class="section-title">3. Problem Validation</h2>

      <div class="metric-box" style="margin-bottom: 20px;">
        <div class="metric-value">${product.validationScore || 0}/100</div>
        <div class="metric-label">Validation Score</div>
      </div>

      <div class="content-block">
        <div class="content-label">Interviews Conducted</div>
        <div class="content-value">${product.interviewsConducted || 0}</div>
      </div>

      <div class="content-block">
        <div class="content-label">Key Insights</div>
        <div class="content-value">${product.keyInsights || 'Not recorded'}</div>
      </div>

      <div class="content-block">
        <div class="content-label">Currently Paying</div>
        <div class="content-value">${product.currentlyPaying || 'Unknown'}</div>
      </div>
    </div>
  </div>

  <!-- Solution Section -->
  <div class="page">
    <div class="section">
      <h2 class="section-title">4. Solution Definition</h2>

      <div class="content-block">
        <div class="content-label">Solution Statement</div>
        <div class="content-value">${product.solutionStatement || 'Not defined'}</div>
      </div>

      <div class="content-block">
        <div class="content-label">Key Benefits</div>
        <div class="content-value">${product.keyBenefits || 'Not defined'}</div>
      </div>

      <div class="content-block">
        <div class="content-label">Differentiation</div>
        <div class="content-value">${product.differentiation || 'Not defined'}</div>
      </div>
    </div>
  </div>

  <!-- Business Model Section -->
  <div class="page">
    <div class="section">
      <h2 class="section-title">8. Business Model</h2>

      <div class="content-block">
        <div class="content-label">Revenue Model</div>
        <div class="content-value">${product.revenueModel || 'Not defined'}</div>
      </div>

      <div class="content-block">
        <div class="content-label">Pricing</div>
        <div class="content-value">${product.pricing || 'Not defined'}</div>
      </div>

      <div class="two-column">
        <div class="metric-box">
          <div class="metric-value">₹${product.cac || 0}</div>
          <div class="metric-label">Customer Acquisition Cost</div>
        </div>
        <div class="metric-box">
          <div class="metric-value">₹${product.ltv || 0}</div>
          <div class="metric-label">Lifetime Value</div>
        </div>
      </div>
    </div>
  </div>

  <!-- Go-To-Market Section -->
  <div class="page">
    <div class="section">
      <h2 class="section-title">9. Go-To-Market Strategy</h2>

      <div class="content-block">
        <div class="content-label">Target Channels</div>
        <div class="content-value">${product.targetChannels?.join(', ') || 'Not defined'}</div>
      </div>

      <div class="content-block">
        <div class="content-label">First 100 Users Plan</div>
        <div class="content-value">${product.first100UsersPlan || 'Not defined'}</div>
      </div>

      <div class="content-block">
        <div class="content-label">Budget Allocation</div>
        <div class="content-value">${product.budgetAllocation || 'Not defined'}</div>
      </div>
    </div>
  </div>

  <!-- Metrics Section -->
  <div class="page">
    <div class="section">
      <h2 class="section-title">10. Metrics & KPIs</h2>

      <table>
        <thead>
          <tr>
            <th>Metric</th>
            <th>Target</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Conversion Rate</td>
            <td>${product.conversionRate || 0}%</td>
          </tr>
          <tr>
            <td>Retention Rate</td>
            <td>${product.retentionRate || 0}%</td>
          </tr>
          <tr>
            <td>Revenue Target</td>
            <td>₹${product.revenueTarget || 0}</td>
          </tr>
          <tr>
            <td>Growth Target</td>
            <td>${product.growthTarget || 0}%</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="section" style="margin-top: 50px; text-align: center;">
      <p style="color: #667eea; font-size: 18px;">This document was generated using VisionBoard Pro</p>
      <p style="color: #999; font-size: 12px; margin-top: 10px;">© ${new Date().getFullYear()} - All rights reserved</p>
    </div>
  </div>
</body>
</html>
  `;

  return htmlContent;
};

// Helper function to open print dialog for PDF generation
export const openPDFPrintDialog = (product) => {
  const htmlContent = generateProductPlanPDF(product);
  const printWindow = window.open('', '_blank', 'width=1200,height=800');

  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();

    // Wait for content to load then print
    printWindow.onload = () => {
      printWindow.print();
    };

    // Fallback if onload doesn't fire
    setTimeout(() => {
      if (printWindow.document.readyState === 'complete') {
        printWindow.print();
      }
    }, 1000);
  } else {
    alert('Please allow popups to generate PDF.');
  }
};

// Export data as JSON
export const exportProductData = (product) => {
  const dataStr = JSON.stringify(product, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = window.URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${product.name}_Product_Plan.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};
