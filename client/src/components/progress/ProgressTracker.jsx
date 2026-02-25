import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../common/Card';
import Button from '../common/Button';
import ProgressBar from '../common/ProgressBar';
import { formatDate, formatCurrency, sectionNames, months } from '../../utils/helpers';
import visionBoardService from '../../services/visionBoardService';

const ProgressTracker = () => {
  const navigate = useNavigate();
  const [visionBoards, setVisionBoards] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVisionBoards();
  }, []);

  useEffect(() => {
    if (selectedBoard) {
      fetchUpdates(selectedBoard._id);
    }
  }, [selectedBoard]);

  const fetchVisionBoards = async () => {
    try {
      const response = await visionBoardService.getAll();
      setVisionBoards(response.data || []);
      if (response.data?.length > 0) {
        setSelectedBoard(response.data[0]);
      }
    } catch (error) {
      console.error('Failed to fetch vision boards:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUpdates = async (boardId) => {
    try {
      const response = await visionBoardService.getProgressHistory(boardId);
      setUpdates(response.data || []);
    } catch (error) {
      console.error('Failed to fetch updates:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (visionBoards.length === 0) {
    return (
      <Card className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No vision boards yet
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          Create a vision board first to track your progress
        </p>
        <Button variant="primary" onClick={() => navigate('/visionboards/new')}>
          Create Vision Board
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Progress Tracker
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Track your monthly progress and compare against targets
        </p>
      </div>

      {/* Board Selector */}
      <div className="flex items-center gap-4">
        <select
          className="input max-w-xs"
          value={selectedBoard?._id || ''}
          onChange={(e) => {
            const board = visionBoards.find(b => b._id === e.target.value);
            setSelectedBoard(board);
          }}
        >
          {visionBoards.map((board) => (
            <option key={board._id} value={board._id}>
              {board.name}
            </option>
          ))}
        </select>
      </div>

      {/* Overview Cards */}
      {selectedBoard && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <p className="text-sm text-gray-500 dark:text-gray-400">Overall Progress</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {selectedBoard.overallProgress}%
            </p>
            <ProgressBar value={selectedBoard.overallProgress} showLabel={false} size="sm" />
          </Card>
          <Card>
            <p className="text-sm text-gray-500 dark:text-gray-400">Sections Complete</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {Object.values(selectedBoard.sections || {}).filter(s => s.completed).length} / 8
            </p>
          </Card>
          <Card>
            <p className="text-sm text-gray-500 dark:text-gray-400">Monthly Updates</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {updates.length}
            </p>
          </Card>
          <Card>
            <p className="text-sm text-gray-500 dark:text-gray-400">Target Revenue</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(selectedBoard.sections?.financialGoals?.data?.annualRevenue || 0)}
            </p>
          </Card>
        </div>
      )}

      {/* Monthly Updates */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Monthly Updates
          </h2>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate(`/progress/${selectedBoard._id}/update`)}
          >
            Add Update
          </Button>
        </div>

        {updates.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              No monthly updates yet. Start tracking your progress!
            </p>
            <Button
              variant="primary"
              onClick={() => navigate(`/progress/${selectedBoard._id}/update`)}
            >
              Add First Update
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                    Month
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                    Revenue
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                    Team Size
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                    Leads
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                    Customers
                  </th>
                </tr>
              </thead>
              <tbody>
                {updates.map((update) => (
                  <tr key={update._id} className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">
                      {update.month} {update.year}
                    </td>
                    <td className="py-3 px-4 text-sm text-right text-gray-900 dark:text-white">
                      {formatCurrency(update.actualRevenue)}
                    </td>
                    <td className="py-3 px-4 text-sm text-right text-gray-900 dark:text-white">
                      {update.actualTeamSize}
                    </td>
                    <td className="py-3 px-4 text-sm text-right text-gray-900 dark:text-white">
                      {update.actualLeads}
                    </td>
                    <td className="py-3 px-4 text-sm text-right text-gray-900 dark:text-white">
                      {update.actualCustomers}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Section Progress */}
      {selectedBoard && (
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Section Completion
          </h2>
          <div className="space-y-3">
            {Object.entries(selectedBoard.sections || {}).map(([key, value]) => (
              <div key={key} className="flex items-center gap-4">
                <span className="w-40 text-sm text-gray-600 dark:text-gray-400">
                  {sectionNames[key]}
                </span>
                <div className="flex-1">
                  <ProgressBar value={value.completed ? 100 : 0} showLabel={false} size="sm" />
                </div>
                <span className={`text-sm font-medium ${
                  value.completed ? 'text-green-600' : 'text-gray-400'
                }`}>
                  {value.completed ? 'Complete' : 'Incomplete'}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default ProgressTracker;