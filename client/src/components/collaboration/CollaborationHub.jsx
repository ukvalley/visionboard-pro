import { useState, useEffect } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import Modal from '../common/Modal';
import { ModuleEmptyState, QuickFillGuide } from '../common/ModuleCard';
import visionBoardService from '../../services/visionBoardService';

const CollaborationHub = ({ visionBoardId }) => {
  const [activeView, setActiveView] = useState('overview');
  const [visionBoard, setVisionBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aiMessages, setAiMessages] = useState([]);
  const [userMessage, setUserMessage] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  const quickStartSteps = ['Overview', 'AI Coach', 'Tips'];

  useEffect(() => {
    if (visionBoardId) {
      fetchVisionBoard();
    }
  }, [visionBoardId]);

  const fetchVisionBoard = async () => {
    try {
      const response = await visionBoardService.getById(visionBoardId);
      setVisionBoard(response.data);
    } catch (error) {
      console.error('Failed to fetch vision board:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!userMessage.trim()) return;

    const userMsg = { role: 'user', content: userMessage };
    setAiMessages(prev => [...prev, userMsg]);
    setUserMessage('');
    setAiLoading(true);

    // Simulate AI response (in production, this would call an AI API)
    setTimeout(() => {
      const responses = {
        'strategy': 'Based on your vision board, I recommend focusing on your core differentiators first. What makes your business unique in the market?',
        'growth': 'For growth, consider the Rockefeller Habits: 1) Priorities, 2) Data, 3) Meeting Rhythm. These three pillars will help you scale predictably.',
        'team': 'Building a strong team starts with clarity. Use the FACe chart to define who owns what, and the 9-box grid to assess and develop talent.',
        'revenue': 'To accelerate revenue, focus on your conversion funnel. What\'s your current lead-to-customer conversion rate? Even small improvements can have big impacts.',
        'default': 'Great question! I\'m here to help you implement the Scaling Up methodology. Ask me about strategy, execution, people, or cash - the four major decisions every growing company faces.'
      };

      const keywords = Object.keys(responses);
      const matchedKeyword = keywords.find(k => userMessage.toLowerCase().includes(k)) || 'default';

      const aiMsg = { role: 'assistant', content: responses[matchedKeyword] };
      setAiMessages(prev => [...prev, aiMsg]);
      setAiLoading(false);
    }, 1000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quick Start Guide */}
      <QuickFillGuide
        steps={quickStartSteps}
        currentStep={activeView === 'overview' ? 0 : activeView === 'coach' ? 1 : 2}
        onStepClick={(idx) => setActiveView(idx === 0 ? 'overview' : idx === 1 ? 'coach' : 'tips')}
      />

      {/* Navigation Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { id: 'overview', label: 'Overview', icon: '📋' },
          { id: 'coach', label: 'AI Coach', icon: '🤖' },
          { id: 'tips', label: 'Tips & Resources', icon: '💡' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveView(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
              activeView === tab.id
                ? 'bg-pink-500 text-white shadow-md'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <span>{tab.icon}</span>
            <span className="font-medium text-sm">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        {/* Overview */}
        {activeView === 'overview' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Collaboration Hub</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Tools and resources to help your team work together effectively
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card className="bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 border-pink-200 dark:border-pink-800">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">🤝</span>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Shared Workspaces</h4>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Create shared spaces for teams to collaborate on specific projects or initiatives.
                </p>
                <Button variant="secondary" size="sm" disabled>Coming Soon</Button>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 border-purple-200 dark:border-purple-800">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">👥</span>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Mentorship Programs</h4>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Set up reverse mentoring relationships to transfer knowledge across your organization.
                </p>
                <Button variant="secondary" size="sm" disabled>Coming Soon</Button>
              </Card>

              <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">💬</span>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Guided Discussions</h4>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Structured discussion templates for strategic planning sessions.
                </p>
                <Button variant="secondary" size="sm" disabled>Coming Soon</Button>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">📚</span>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Knowledge Base</h4>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Document and share best practices, processes, and learnings.
                </p>
                <Button variant="secondary" size="sm" disabled>Coming Soon</Button>
              </Card>
            </div>
          </div>
        )}

        {/* AI Coach */}
        {activeView === 'coach' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Ask Patrick - AI Business Coach</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Get guidance on implementing the Scaling Up methodology
              </p>
            </div>

            {/* Chat Messages */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 min-h-[300px] max-h-[400px] overflow-y-auto">
              {aiMessages.length === 0 ? (
                <div className="text-center py-8">
                  <span className="text-4xl mb-4 block">🤖</span>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    Hi! I'm Patrick, your AI business coach. Ask me about:
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {['Strategy', 'Execution', 'People', 'Cash', 'Growth'].map(topic => (
                      <button
                        key={topic}
                        onClick={() => {
                          setUserMessage(`Tell me about ${topic.toLowerCase()}`);
                          setTimeout(() => handleSendMessage(), 100);
                        }}
                        className="px-3 py-1.5 bg-white dark:bg-gray-600 rounded-full text-sm text-gray-600 dark:text-gray-300 hover:bg-pink-50 dark:hover:bg-gray-500"
                      >
                        {topic}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {aiMessages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-xl px-4 py-2 ${
                          msg.role === 'user'
                            ? 'bg-pink-500 text-white'
                            : 'bg-white dark:bg-gray-600 text-gray-800 dark:text-gray-200'
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  {aiLoading && (
                    <div className="flex justify-start">
                      <div className="bg-white dark:bg-gray-600 rounded-xl px-4 py-2">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Input */}
            <div className="flex gap-2">
              <input
                type="text"
                className="input flex-1"
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask a question about growing your business..."
                disabled={aiLoading}
              />
              <Button variant="primary" onClick={handleSendMessage} disabled={aiLoading || !userMessage.trim()}>
                Send
              </Button>
            </div>
          </div>
        )}

        {/* Tips & Resources */}
        {activeView === 'tips' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Tips & Resources</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Best practices from the Scaling Up methodology
              </p>
            </div>

            <div className="space-y-4">
              <TipCard
                icon="🎯"
                title="The One-Page Strategic Plan"
                description="Distill your strategy onto a single page. Include your mission, vision, values, BHAG, and key initiatives."
              />
              <TipCard
                icon="📊"
                title="Daily Huddles"
                description="Hold 15-minute daily standups with each team. Ask: What's up? Any numbers? Where are you stuck?"
              />
              <TipCard
                icon="⚡"
                title="The Who-What-When"
                description="Every meeting should end with clear action items: Who is doing What by When."
              />
              <TipCard
                icon="👤"
                title="FACe Chart"
                description="Functional Accountability Chart - clarify who owns what function, not just job titles."
              />
              <TipCard
                icon="📈"
                title="Smart Numbers"
                description="Identify 1-2 metrics that predict future success, not just track past performance."
              />
              <TipCard
                icon="💰"
                title="Cash Conversion Cycle"
                description="Measure how quickly you turn a dollar invested into a dollar returned."
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Tip Card Component
const TipCard = ({ icon, title, description }) => (
  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
    <div className="flex items-start gap-3">
      <span className="text-2xl">{icon}</span>
      <div>
        <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{title}</h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
      </div>
    </div>
  </div>
);

export default CollaborationHub;