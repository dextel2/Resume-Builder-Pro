import React, { useState } from 'react';
import { Bot, Key, Eye, EyeOff, ExternalLink, CheckCircle } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../hooks';
import { updateAISettings } from '../../store/resumeSlice';

const AISettingsForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const aiSettings = useAppSelector(state => state.resume.settings.ai);
  const darkMode = useAppSelector(state => state.resume.settings.darkMode);
  const [showKey, setShowKey] = useState(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'ok' | 'fail'>('idle');

  const dm = darkMode;
  const inputCls = `w-full px-3 py-2 rounded-lg border text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors ${dm ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' : 'bg-white border-gray-300 text-gray-900'}`;
  const labelCls = `block text-xs font-semibold mb-1 ${dm ? 'text-gray-300' : 'text-gray-600'}`;
  const cardCls = `rounded-xl border p-4 ${dm ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`;

  const handleTestKey = async () => {
    if (!aiSettings.apiKey) return;
    setTestStatus('testing');
    try {
      if (aiSettings.provider === 'openai') {
        const res = await fetch('https://api.openai.com/v1/models', { headers: { Authorization: `Bearer ${aiSettings.apiKey}` } });
        setTestStatus(res.ok ? 'ok' : 'fail');
      } else if (aiSettings.provider === 'gemini') {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${aiSettings.apiKey}`);
        setTestStatus(res.ok ? 'ok' : 'fail');
      }
    } catch {
      setTestStatus('fail');
    }
    setTimeout(() => setTestStatus('idle'), 4000);
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className={`text-lg font-bold ${dm ? 'text-white' : 'text-gray-900'}`}>AI Settings</h2>
        <p className={`text-sm mt-1 ${dm ? 'text-gray-400' : 'text-gray-500'}`}>
          Add your own free API key to unlock AI bullet rewriting, summary generation, and resume tailoring. Your key is stored locally only — never sent to our servers.
        </p>
      </div>

      <div className={`p-4 rounded-xl border-l-4 border-green-500 ${dm ? 'bg-green-900/20' : 'bg-green-50'}`}>
        <p className={`text-sm font-semibold ${dm ? 'text-green-300' : 'text-green-700'}`}>All features work without AI</p>
        <p className={`text-xs mt-1 ${dm ? 'text-green-400' : 'text-green-600'}`}>Rule-based suggestions (weak verbs, metrics, keyword matching) are 100% free forever. AI adds smarter rewrites but is optional.</p>
      </div>

      <div className={cardCls}>
        <label className={labelCls}>AI Provider</label>
        <div className="grid grid-cols-3 gap-2 mt-1">
          {(['none', 'openai', 'gemini'] as const).map(p => (
            <button
              key={p}
              onClick={() => dispatch(updateAISettings({ provider: p }))}
              className={`py-2 px-3 rounded-lg text-sm font-medium border transition-colors ${aiSettings.provider === p ? 'bg-indigo-600 text-white border-indigo-600' : (dm ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-600 hover:bg-gray-50')}`}
            >
              {p === 'none' ? 'None (Free)' : p === 'openai' ? 'OpenAI' : 'Gemini'}
            </button>
          ))}
        </div>

        {aiSettings.provider !== 'none' && (
          <div className="mt-4 space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className={labelCls}>API Key</label>
                <a
                  href={aiSettings.provider === 'openai' ? 'https://platform.openai.com/api-keys' : 'https://aistudio.google.com/app/apikey'}
                  target="_blank" rel="noopener noreferrer"
                  className="text-xs text-indigo-500 flex items-center gap-1 hover:underline"
                >
                  Get free key <ExternalLink className="h-3 w-3" />
                </a>
              </div>
              <div className="relative">
                <input
                  className={inputCls}
                  type={showKey ? 'text' : 'password'}
                  value={aiSettings.apiKey}
                  onChange={e => dispatch(updateAISettings({ apiKey: e.target.value }))}
                  placeholder={aiSettings.provider === 'openai' ? 'sk-...' : 'AIza...'}
                />
                <button onClick={() => setShowKey(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className={labelCls}>Model (optional)</label>
              <input
                className={inputCls}
                value={aiSettings.model || ''}
                onChange={e => dispatch(updateAISettings({ model: e.target.value }))}
                placeholder={aiSettings.provider === 'openai' ? 'gpt-4o-mini (default)' : 'gemini-1.5-flash (default)'}
              />
            </div>

            <button
              onClick={handleTestKey}
              disabled={!aiSettings.apiKey || testStatus === 'testing'}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                testStatus === 'ok' ? 'bg-green-600 text-white' :
                testStatus === 'fail' ? 'bg-red-600 text-white' :
                'bg-indigo-600 text-white hover:bg-indigo-700'
              } disabled:opacity-50`}
            >
              {testStatus === 'ok' ? <><CheckCircle className="h-4 w-4" /> Key Valid!</> :
               testStatus === 'fail' ? 'Invalid Key' :
               testStatus === 'testing' ? 'Testing...' :
               <><Key className="h-4 w-4" /> Test Key</>}
            </button>
          </div>
        )}
      </div>

      {/* How AI features work */}
      <div className={cardCls}>
        <h3 className={`text-sm font-bold mb-3 ${dm ? 'text-gray-200' : 'text-gray-800'}`}>AI Features</h3>
        <div className="space-y-3">
          {[
            { icon: '✏️', feature: 'Bullet Rewrite', desc: 'Click the sparkle icon next to any bullet point in Experience to AI-rewrite it.' },
            { icon: '📝', feature: 'Summary Generator', desc: 'Click "AI Generate" in Personal Info to auto-write your professional summary.' },
            { icon: '🎯', feature: 'Tailor to JD', desc: 'Keyword matching in JD Matcher is always free; AI can enhance suggestions.' },
          ].map(item => (
            <div key={item.feature} className={`flex gap-3 p-3 rounded-lg ${dm ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <span className="text-lg">{item.icon}</span>
              <div>
                <div className={`text-sm font-semibold ${dm ? 'text-gray-200' : 'text-gray-800'}`}>{item.feature}</div>
                <div className={`text-xs ${dm ? 'text-gray-400' : 'text-gray-500'}`}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AISettingsForm;
