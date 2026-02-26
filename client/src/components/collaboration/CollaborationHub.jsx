import { useState, useEffect } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import Modal from '../common/Modal';
import { ModuleEmptyState, QuickFillGuide } from '../common/ModuleCard';
import visionBoardService from '../../services/visionBoardService';

const CollaborationHub = ({ visionBoardId }) => {
  const views = ['overview', 'workspaces', 'discussions', 'mentorship', 'knowledge', 'coach'];
  const quickStartSteps = ['Overview', 'Workspaces', 'Discussions', 'Mentorship', 'Knowledge', 'AI Coach'];

  const [activeView, setActiveView] = useState('overview');
  const [visionBoard, setVisionBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aiMessages, setAiMessages] = useState([]);
  const [userMessage, setUserMessage] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  // Workspaces
  const [workspaces, setWorkspaces] = useState([]);
  const [showWorkspaceModal, setShowWorkspaceModal] = useState(false);
  const [newWorkspace, setNewWorkspace] = useState({ name: '', description: '', members: [] });

  // Discussions
  const [discussions, setDiscussions] = useState([]);
  const [newDiscussion, setNewDiscussion] = useState({ title: '', content: '', author: '' });

  // Mentorship
  const [mentorships, setMentorships] = useState([]);
  const [newMentorship, setNewMentorship] = useState({ mentor: '', mentee: '', topic: '', frequency: 'Monthly' });

  // Knowledge Base
  const [knowledgeBase, setKnowledgeBase] = useState([]);
  const [newArticle, setNewArticle] = useState({ title: '', category: 'Process', content: '' });

  useEffect(() => {
    if (visionBoardId) {
      fetchVisionBoard();
    }
  }, [visionBoardId]);

  const fetchVisionBoard = async () => {
    try {
      const response = await visionBoardService.getById(visionBoardId);
      setVisionBoard(response.data);

      // Load collaboration data from strategySheet
      const ss = response.data.strategySheet || {};
      if (ss.collaboration?.data) {
        setWorkspaces(ss.collaboration.data.workspaces || []);
        setDiscussions(ss.collaboration.data.discussions || []);
        setMentorships(ss.collaboration.data.mentorships || []);
        setKnowledgeBase(ss.collaboration.data.knowledgeBase || []);
      }
    } catch (error) {
      console.error('Failed to fetch vision board:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveCollaboration = async () => {
    try {
      await visionBoardService.updateSection(visionBoardId, 'collaboration', {
        completed: true,
        data: { workspaces, discussions, mentorships, knowledgeBase }
      });
    } catch (error) {
      console.error('Failed to save:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!userMessage.trim()) return;

    const userMsg = { role: 'user', content: userMessage };
    setAiMessages(prev => [...prev, userMsg]);
    setUserMessage('');
    setAiLoading(true);

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

  const handleAddWorkspace = async () => {
    if (!newWorkspace.name.trim()) return;
    const updated = [...workspaces, { ...newWorkspace, id: Date.now(), createdAt: new Date().toISOString() }];
    setWorkspaces(updated);
    await saveCollaboration();
    setShowWorkspaceModal(false);
    setNewWorkspace({ name: '', description: '', members: [] });
  };

  const handleAddDiscussion = async () => {
    if (!newDiscussion.title.trim()) return;
    const updated = [...discussions, { ...newDiscussion, id: Date.now(), createdAt: new Date().toISOString(), replies: [] }];
    setDiscussions(updated);
    await saveCollaboration();
    setNewDiscussion({ title: '', content: '', author: '' });
  };

  const handleAddMentorship = async () => {
    if (!newMentorship.mentor.trim() || !newMentorship.mentee.trim()) return;
    const updated = [...mentorships, { ...newMentorship, id: Date.now(), status: 'Active' }];
    setMentorships(updated);
    await saveCollaboration();
    setNewMentorship({ mentor: '', mentee: '', topic: '', frequency: 'Monthly' });
  };

  const handleAddArticle = async () => {
    if (!newArticle.title.trim()) return;
    const updated = [...knowledgeBase, { ...newArticle, id: Date.now(), createdAt: new Date().toISOString() }];
    setKnowledgeBase(updated);
    await saveCollaboration();
    setNewArticle({ title: '', category: 'Process', content: '' });
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
        currentStep={views.indexOf(activeView)}
        onStepClick={(idx) => setActiveView(views[idx])}
      />

      {/* Navigation Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { id: 'overview', label: 'Overview', icon: '📋' },
          { id: 'workspaces', label: 'Workspaces', icon: '🏢' },
          { id: 'discussions', label: 'Discussions', icon: '💬' },
          { id: 'mentorship', label: 'Mentorship', icon: '👥' },
          { id: 'knowledge', label: 'Knowledge Base', icon: '📚' },
          { id: 'coach', label: 'AI Coach', icon: '🤖' }
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
                  <span className="text-2xl">🏢</span>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Shared Workspaces</h4>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {workspaces.length} workspace{workspaces.length !== 1 ? 's' : ''} created
                </p>
                <Button variant="secondary" size="sm" onClick={() => setActiveView('workspaces')}>View Workspaces</Button>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 border-purple-200 dark:border-purple-800">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">👥</span>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Mentorship Programs</h4>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {mentorships.length} active mentorship{mentorships.length !== 1 ? 's' : ''}
                </p>
                <Button variant="secondary" size="sm" onClick={() => setActiveView('mentorship')}>View Mentorships</Button>
              </Card>

              <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">💬</span>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Guided Discussions</h4>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {discussions.length} discussion{discussions.length !== 1 ? 's' : ''} started
                </p>
                <Button variant="secondary" size="sm" onClick={() => setActiveView('discussions')}>View Discussions</Button>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">📚</span>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Knowledge Base</h4>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {knowledgeBase.length} article{knowledgeBase.length !== 1 ? 's' : ''} documented
                </p>
                <Button variant="secondary" size="sm" onClick={() => setActiveView('knowledge')}>View Articles</Button>
              </Card>
            </div>
          </div>
        )}

        {/* Workspaces */}
        {activeView === 'workspaces' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Shared Workspaces</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Create shared spaces for teams to collaborate on specific projects
                </p>
              </div>
              <Button variant="primary" onClick={() => setShowWorkspaceModal(true)}>+ Add Workspace</Button>
            </div>

            {workspaces.length === 0 ? (
              <ModuleEmptyState moduleName="Workspaces" onAction={() => setShowWorkspaceModal(true)} actionText="Create Your First Workspace" />
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {workspaces.map((ws) => (
                  <div key={ws.id} className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">{ws.name}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{ws.description}</p>
                        {ws.members?.length > 0 && (
                          <div className="flex items-center gap-1 mt-2">
                            <span className="text-xs text-gray-400">{ws.members.length} members</span>
                          </div>
                        )}
                      </div>
                      <button onClick={() => setWorkspaces(workspaces.filter(w => w.id !== ws.id))} className="text-gray-400 hover:text-red-500">✕</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Discussions */}
        {activeView === 'discussions' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Guided Discussions</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Structured discussion templates for strategic planning sessions
                </p>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-4">
              <input
                type="text"
                className="input mb-2"
                placeholder="Discussion title..."
                value={newDiscussion.title}
                onChange={(e) => setNewDiscussion({ ...newDiscussion, title: e.target.value })}
              />
              <textarea
                className="input mb-2 min-h-[80px]"
                placeholder="Start a discussion..."
                value={newDiscussion.content}
                onChange={(e) => setNewDiscussion({ ...newDiscussion, content: e.target.value })}
              />
              <div className="flex justify-between items-center">
                <input
                  type="text"
                  className="input w-48"
                  placeholder="Your name"
                  value={newDiscussion.author}
                  onChange={(e) => setNewDiscussion({ ...newDiscussion, author: e.target.value })}
                />
                <Button variant="primary" onClick={handleAddDiscussion}>Post Discussion</Button>
              </div>
            </div>

            <div className="space-y-4">
              {discussions.map((disc) => (
                <div key={disc.id} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white">{disc.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{disc.content}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                        <span>By {disc.author}</span>
                        <span>{new Date(disc.createdAt).toLocaleDateString()}</span>
                        {disc.replies?.length > 0 && <span>{disc.replies.length} replies</span>}
                      </div>
                    </div>
                    <button onClick={() => setDiscussions(discussions.filter(d => d.id !== disc.id))} className="text-gray-400 hover:text-red-500">✕</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mentorship */}
        {activeView === 'mentorship' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Mentorship Programs</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Set up reverse mentoring relationships to transfer knowledge
                </p>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-2 gap-2 mb-2">
                <input type="text" className="input" placeholder="Mentor name" value={newMentorship.mentor} onChange={(e) => setNewMentorship({ ...newMentorship, mentor: e.target.value })} />
                <input type="text" className="input" placeholder="Mentee name" value={newMentorship.mentee} onChange={(e) => setNewMentorship({ ...newMentorship, mentee: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <input type="text" className="input" placeholder="Topic/Skill" value={newMentorship.topic} onChange={(e) => setNewMentorship({ ...newMentorship, topic: e.target.value })} />
                <select className="input" value={newMentorship.frequency} onChange={(e) => setNewMentorship({ ...newMentorship, frequency: e.target.value })}>
                  <option>Weekly</option>
                  <option>Bi-weekly</option>
                  <option>Monthly</option>
                  <option>Quarterly</option>
                </select>
              </div>
              <Button variant="primary" onClick={handleAddMentorship}>Add Mentorship</Button>
            </div>

            <div className="space-y-3">
              {mentorships.map((m) => (
                <div key={m.id} className="flex items-center gap-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900 dark:text-white">{m.mentor}</span>
                      <span className="text-gray-400">→</span>
                      <span className="font-medium text-gray-900 dark:text-white">{m.mentee}</span>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                      <span>{m.topic}</span>
                      <span>{m.frequency}</span>
                      <span className={`px-2 py-0.5 rounded text-xs ${m.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{m.status}</span>
                    </div>
                  </div>
                  <button onClick={() => setMentorships(mentorships.filter(x => x.id !== m.id))} className="text-gray-400 hover:text-red-500">✕</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Knowledge Base */}
        {activeView === 'knowledge' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Knowledge Base</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Document and share best practices, processes, and learnings
                </p>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-4">
              <input
                type="text"
                className="input mb-2"
                placeholder="Article title..."
                value={newArticle.title}
                onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
              />
              <div className="flex gap-2 mb-2">
                <select className="input w-40" value={newArticle.category} onChange={(e) => setNewArticle({ ...newArticle, category: e.target.value })}>
                  <option>Process</option>
                  <option>Best Practice</option>
                  <option>Template</option>
                  <option>Guide</option>
                  <option>Reference</option>
                </select>
              </div>
              <textarea
                className="input mb-2 min-h-[100px]"
                placeholder="Article content..."
                value={newArticle.content}
                onChange={(e) => setNewArticle({ ...newArticle, content: e.target.value })}
              />
              <Button variant="primary" onClick={handleAddArticle}>Add Article</Button>
            </div>

            <div className="space-y-3">
              {knowledgeBase.map((article) => (
                <div key={article.id} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-gray-900 dark:text-white">{article.title}</h4>
                        <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-xs">{article.category}</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">{article.content}</p>
                    </div>
                    <button onClick={() => setKnowledgeBase(knowledgeBase.filter(a => a.id !== article.id))} className="text-gray-400 hover:text-red-500 ml-4">✕</button>
                  </div>
                </div>
              ))}
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
      </div>

      {/* Workspace Modal */}
      <Modal isOpen={showWorkspaceModal} onClose={() => setShowWorkspaceModal(false)} title="Create Workspace">
        <div className="space-y-4">
          <div>
            <label className="label">Workspace Name *</label>
            <input type="text" className="input" value={newWorkspace.name} onChange={(e) => setNewWorkspace({ ...newWorkspace, name: e.target.value })} placeholder="e.g., Marketing Team" />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea className="input min-h-[80px]" value={newWorkspace.description} onChange={(e) => setNewWorkspace({ ...newWorkspace, description: e.target.value })} placeholder="What is this workspace for?" />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="secondary" onClick={() => setShowWorkspaceModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleAddWorkspace}>Create</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CollaborationHub;