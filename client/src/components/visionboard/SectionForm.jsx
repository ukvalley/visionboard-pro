import { useState } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';

const SectionForm = ({ section, data, onComplete, onSave }) => {
  const [formData, setFormData] = useState(data || {});

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const renderFields = () => {
    switch (section) {
      case 'businessOverview':
        return (
          <>
            <Input
              label="Business Name"
              value={formData.businessName || ''}
              onChange={(e) => handleChange('businessName', e.target.value)}
            />
            <Input
              label="Industry"
              value={formData.industry || ''}
              onChange={(e) => handleChange('industry', e.target.value)}
            />
            <div>
              <label className="label">Vision Statement</label>
              <textarea
                className="input min-h-[100px]"
                value={formData.visionStatement || ''}
                onChange={(e) => handleChange('visionStatement', e.target.value)}
              />
            </div>
            <Input
              label="Target Revenue"
              type="number"
              value={formData.targetRevenue || ''}
              onChange={(e) => handleChange('targetRevenue', parseFloat(e.target.value))}
            />
            <Input
              label="Target Market"
              value={formData.targetMarket || ''}
              onChange={(e) => handleChange('targetMarket', e.target.value)}
            />
          </>
        );

      case 'financialGoals':
        return (
          <>
            <Input
              label="Annual Revenue Goal"
              type="number"
              value={formData.annualRevenue || ''}
              onChange={(e) => handleChange('annualRevenue', parseFloat(e.target.value))}
            />
            <Input
              label="Monthly Revenue Goal"
              type="number"
              value={formData.monthlyRevenue || ''}
              onChange={(e) => handleChange('monthlyRevenue', parseFloat(e.target.value))}
            />
            <Input
              label="Profit Margin (%)"
              type="number"
              value={formData.profitMargin || ''}
              onChange={(e) => handleChange('profitMargin', parseFloat(e.target.value))}
            />
            <Input
              label="Personal Income Goal"
              type="number"
              value={formData.personalIncome || ''}
              onChange={(e) => handleChange('personalIncome', parseFloat(e.target.value))}
            />
            <Input
              label="Cash Reserve Target"
              type="number"
              value={formData.cashReserve || ''}
              onChange={(e) => handleChange('cashReserve', parseFloat(e.target.value))}
            />
          </>
        );

      case 'brandGoals':
        return (
          <>
            <Input
              label="Website Leads/Month"
              type="number"
              value={formData.websiteLeads || ''}
              onChange={(e) => handleChange('websiteLeads', parseInt(e.target.value))}
            />
            <Input
              label="Social Media Followers"
              type="number"
              value={formData.socialFollowers || ''}
              onChange={(e) => handleChange('socialFollowers', parseInt(e.target.value))}
            />
            <Input
              label="Case Studies Target"
              type="number"
              value={formData.caseStudies || ''}
              onChange={(e) => handleChange('caseStudies', parseInt(e.target.value))}
            />
            <div>
              <label className="label">Speaking/Events Goals</label>
              <textarea
                className="input min-h-[80px]"
                value={formData.speakingEvents || ''}
                onChange={(e) => handleChange('speakingEvents', e.target.value)}
              />
            </div>
          </>
        );

      case 'lifestyleVision':
        return (
          <>
            <Input
              label="Working Hours/Day"
              type="number"
              value={formData.workingHours || ''}
              onChange={(e) => handleChange('workingHours', parseInt(e.target.value))}
            />
            <Input
              label="Free Days/Month"
              type="number"
              value={formData.freeDays || ''}
              onChange={(e) => handleChange('freeDays', parseInt(e.target.value))}
            />
            <div>
              <label className="label">Travel Goals</label>
              <textarea
                className="input min-h-[80px]"
                value={formData.travelGoals || ''}
                onChange={(e) => handleChange('travelGoals', e.target.value)}
              />
            </div>
            <Input
              label="Net Worth Target"
              type="number"
              value={formData.netWorth || ''}
              onChange={(e) => handleChange('netWorth', parseFloat(e.target.value))}
            />
          </>
        );

      default:
        return (
          <div>
              <label className="label">Section Data (JSON)</label>
            <textarea
              className="input min-h-[200px] font-mono text-sm"
              value={JSON.stringify(formData, null, 2)}
              onChange={(e) => {
                try {
                  setFormData(JSON.parse(e.target.value));
                } catch {}
              }}
            />
          </div>
        );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {renderFields()}
      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="secondary" onClick={onComplete}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          Save Section
        </Button>
      </div>
    </form>
  );
};

export default SectionForm;