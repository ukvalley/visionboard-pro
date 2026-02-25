import Card from '../common/Card';
import ProgressBar from '../common/ProgressBar';
import { sectionNames } from '../../utils/helpers';

const ProgressSummary = ({ sections }) => {
  if (!sections) return null;

  const sectionList = Object.entries(sections).map(([key, value]) => ({
    key,
    name: sectionNames[key] || key,
    completed: value.completed,
    data: value.data
  }));

  return (
    <Card>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Section Progress
      </h3>
      <div className="space-y-4">
        {sectionList.map((section) => (
          <div key={section.key}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {section.name}
              </span>
              <span className={`text-sm font-medium ${
                section.completed
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-gray-500 dark:text-gray-400'
              }`}>
                {section.completed ? 'Complete' : 'Incomplete'}
              </span>
            </div>
            <ProgressBar
              value={section.completed ? 100 : 0}
              showLabel={false}
              size="sm"
            />
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ProgressSummary;