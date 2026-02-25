import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Card from '../common/Card';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';
import { months } from '../../utils/helpers';
import visionBoardService from '../../services/visionBoardService';

const MonthlyUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    month: months[new Date().getMonth()],
    year: new Date().getFullYear(),
    actualRevenue: '',
    actualTeamSize: '',
    actualLeads: '',
    actualCustomers: '',
    wins: '',
    challenges: '',
    notes: '',
    nextMonthGoals: ''
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await visionBoardService.addMonthlyUpdate(id, {
        ...formData,
        actualRevenue: parseFloat(formData.actualRevenue) || 0,
        actualTeamSize: parseInt(formData.actualTeamSize) || 0,
        actualLeads: parseInt(formData.actualLeads) || 0,
        actualCustomers: parseInt(formData.actualCustomers) || 0
      });
      navigate('/progress');
    } catch (error) {
      alert('Failed to save monthly update');
    } finally {
      setLoading(false);
    }
  };

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 5 }, (_, i) => ({
    value: currentYear - i,
    label: (currentYear - i).toString()
  }));

  const monthOptions = months.map(m => ({ value: m, label: m }));

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Monthly Update
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Record your progress for this month
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          {/* Period Selection */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <Select
              label="Month"
              options={monthOptions}
              value={formData.month}
              onChange={(e) => handleChange('month', e.target.value)}
            />
            <Select
              label="Year"
              options={yearOptions}
              value={formData.year}
              onChange={(e) => handleChange('year', parseInt(e.target.value))}
            />
          </div>

          {/* Metrics */}
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Key Metrics
          </h3>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <Input
              label="Actual Revenue"
              type="number"
              placeholder="0"
              value={formData.actualRevenue}
              onChange={(e) => handleChange('actualRevenue', e.target.value)}
            />
            <Input
              label="Team Size"
              type="number"
              placeholder="0"
              value={formData.actualTeamSize}
              onChange={(e) => handleChange('actualTeamSize', e.target.value)}
            />
            <Input
              label="New Leads"
              type="number"
              placeholder="0"
              value={formData.actualLeads}
              onChange={(e) => handleChange('actualLeads', e.target.value)}
            />
            <Input
              label="New Customers"
              type="number"
              placeholder="0"
              value={formData.actualCustomers}
              onChange={(e) => handleChange('actualCustomers', e.target.value)}
            />
          </div>

          {/* Reflection */}
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Reflection
          </h3>
          <div className="space-y-4">
            <div>
              <label className="label">Wins This Month</label>
              <textarea
                className="input min-h-[80px]"
                placeholder="What went well this month?"
                value={formData.wins}
                onChange={(e) => handleChange('wins', e.target.value)}
              />
            </div>
            <div>
              <label className="label">Challenges Faced</label>
              <textarea
                className="input min-h-[80px]"
                placeholder="What obstacles did you encounter?"
                value={formData.challenges}
                onChange={(e) => handleChange('challenges', e.target.value)}
              />
            </div>
            <div>
              <label className="label">Next Month Goals</label>
              <textarea
                className="input min-h-[80px]"
                placeholder="What do you want to achieve next month?"
                value={formData.nextMonthGoals}
                onChange={(e) => handleChange('nextMonthGoals', e.target.value)}
              />
            </div>
            <div>
              <label className="label">Additional Notes</label>
              <textarea
                className="input min-h-[80px]"
                placeholder="Any other notes or observations..."
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
              />
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/progress')}
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={loading}>
            Save Update
          </Button>
        </div>
      </form>
    </div>
  );
};

export default MonthlyUpdate;