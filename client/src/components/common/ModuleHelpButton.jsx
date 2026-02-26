import { useState } from 'react';
import Modal from './Modal';
import { moduleGuides } from './ModuleGuide';

// Help Button that shows educational content for each module
const ModuleHelpButton = ({ guideKey }) => {
  const [isOpen, setIsOpen] = useState(false);
  const guide = moduleGuides[guideKey];

  if (!guide) return null;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        title="Learn about this feature"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>What is this?</span>
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={guide.title}
        size="full"
      >
        <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
          {/* What is it */}
          <div>
            <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">What is it?</h4>
            <p className="text-gray-700 dark:text-gray-300">{guide.what}</p>
          </div>

          {/* Why use it */}
          <div>
            <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Why use it?</h4>
            <p className="text-gray-700 dark:text-gray-300">{guide.why}</p>
          </div>

          {/* How to use */}
          {guide.how && (
            <div>
              <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">How to use it</h4>
              <ol className="space-y-2">
                {guide.how.map((step, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex items-center justify-center text-xs font-medium">
                      {index + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Example */}
          {guide.example && (
            <div>
              <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Example</h4>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 text-sm">
                {typeof guide.example === 'object' ? (
                  <pre className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                    {JSON.stringify(guide.example, null, 2)
                      .replace(/[{}"[\],]/g, '')
                      .split('\n')
                      .filter(line => line.trim())
                      .map(line => line.trim())
                      .join('\n')}
                  </pre>
                ) : (
                  <p className="text-gray-700 dark:text-gray-300">{guide.example}</p>
                )}
              </div>
            </div>
          )}

          {/* Tips */}
          {guide.tips && (
            <div>
              <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Tips</h4>
              <ul className="space-y-2">
                {guide.tips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                    <span className="text-green-500">💡</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Categories/boxes for special cases */}
          {guide.boxes && (
            <div>
              <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">The 9 Boxes</h4>
              <div className="grid gap-2">
                {guide.boxes.map((box, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                    <div className="font-medium text-gray-900 dark:text-white">{box.name}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      Performance: {box.performance} | Potential: {box.potential}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{box.action}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Habits list */}
          {guide.habits && (
            <div>
              <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">The 10 Habits</h4>
              <div className="grid gap-2">
                {guide.habits.map((habit, index) => (
                  <div key={index} className="flex items-start gap-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                    <span className="w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 flex items-center justify-center text-xs font-medium">{index + 1}</span>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">{habit.name}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{habit.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Key metrics */}
          {guide.keyMetrics && (
            <div>
              <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Key Metrics</h4>
              <div className="grid gap-2 md:grid-cols-2">
                {guide.keyMetrics.map((metric, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                    <div className="font-medium text-gray-900 dark:text-white">{metric.name}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{metric.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Strategies */}
          {guide.strategies && (
            <div>
              <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Sample Strategies</h4>
              <div className="grid gap-2">
                {guide.strategies.map((strategy, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">{strategy.name}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{strategy.desc}</div>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      strategy.impact === 'High' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                    }`}>{strategy.impact} impact</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sample questions for AI */}
          {guide.sampleQuestions && (
            <div>
              <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Try asking...</h4>
              <div className="flex flex-wrap gap-2">
                {guide.sampleQuestions.map((question, index) => (
                  <span key={index} className="px-3 py-1.5 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded-full text-sm">
                    "{question}"
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Categories */}
          {guide.categories && !guide.keyMetrics && (
            <div>
              <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Categories</h4>
              <div className="grid gap-2 md:grid-cols-2">
                {Object.entries(guide.categories).map(([key, values]) => (
                  <div key={key} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                    <div className="font-medium text-gray-900 dark:text-white capitalize mb-1">{key}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{Array.isArray(values) ? values.join(', ') : values}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* RACI for FACe */}
          {guide.raci && (
            <div>
              <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Understanding Roles</h4>
              <div className="grid gap-2 md:grid-cols-2">
                {Object.entries(guide.raci).map(([role, desc]) => (
                  <div key={role} className="flex items-start gap-2">
                    <span className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex items-center justify-center text-xs font-bold uppercase">
                      {role.charAt(0).toUpperCase()}
                    </span>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white capitalize">{role}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors"
          >
            Got it, thanks!
          </button>
        </div>
      </Modal>
    </>
  );
};

export default ModuleHelpButton;