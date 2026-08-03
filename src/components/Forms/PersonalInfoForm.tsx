import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../hooks';
import { updatePersonalInfo } from '../../store/resumeSlice';
import { generateSummaryWithAI } from '../../utils/atsUtils';
import { Sparkles, Loader } from 'lucide-react';

const PersonalInfoForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const info = useAppSelector(state => state.resume.data.personalInfo);
  const aiSettings = useAppSelector(state => state.resume.settings.ai);
  const resumeData = useAppSelector(state => state.resume.data);
  const darkMode = useAppSelector(state => state.resume.settings.darkMode);
  const [generatingSummary, setGeneratingSummary] = useState(false);

  const handleChange = (field: keyof typeof info, value: string) => {
    dispatch(updatePersonalInfo({ [field]: value }));
  };

  const handleGenerateSummary = async () => {
    setGeneratingSummary(true);
    try {
      const summary = await generateSummaryWithAI(resumeData, aiSettings);
      dispatch(updatePersonalInfo({ summary }));
    } finally {
      setGeneratingSummary(false);
    }
  };

  const inputCls = `w-full px-3 py-2 rounded-lg border text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors ${
    darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' : 'bg-white border-gray-300 text-gray-900'
  }`;
  const labelCls = `block text-xs font-semibold mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`;

  return (
    <div className="space-y-5">
      <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Personal Information</h2>

      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className={labelCls}>Full Name *</label>
          <input className={inputCls} value={info.name} onChange={e => handleChange('name', e.target.value)} placeholder="John Smith" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Email *</label>
            <input className={inputCls} type="email" value={info.email} onChange={e => handleChange('email', e.target.value)} placeholder="john@email.com" />
          </div>
          <div>
            <label className={labelCls}>Phone *</label>
            <input className={inputCls} type="tel" value={info.phone} onChange={e => handleChange('phone', e.target.value)} placeholder="+1 (555) 000-0000" />
          </div>
        </div>
        <div>
          <label className={labelCls}>Location</label>
          <input className={inputCls} value={info.location} onChange={e => handleChange('location', e.target.value)} placeholder="San Francisco, CA" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>LinkedIn URL</label>
            <input className={inputCls} value={info.linkedin || ''} onChange={e => handleChange('linkedin', e.target.value)} placeholder="linkedin.com/in/yourname" />
          </div>
          <div>
            <label className={labelCls}>GitHub URL</label>
            <input className={inputCls} value={info.github || ''} onChange={e => handleChange('github', e.target.value)} placeholder="github.com/yourname" />
          </div>
        </div>
        <div>
          <label className={labelCls}>Website / Portfolio</label>
          <input className={inputCls} value={info.website || ''} onChange={e => handleChange('website', e.target.value)} placeholder="yourportfolio.com" />
        </div>

        {/* Summary with AI */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className={labelCls}>Professional Summary</label>
            <button
              onClick={handleGenerateSummary}
              disabled={generatingSummary}
              className="flex items-center gap-1.5 text-xs px-2.5 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-60 transition-colors"
            >
              {generatingSummary ? <Loader className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
              {generatingSummary ? 'Generating...' : aiSettings.provider !== 'none' && aiSettings.apiKey ? 'AI Generate' : 'Auto-Write'}
            </button>
          </div>
          <textarea
            className={`${inputCls} resize-none`}
            rows={4}
            value={info.summary || ''}
            onChange={e => handleChange('summary', e.target.value)}
            placeholder="2–4 sentences: your role, years of experience, top skills, and key achievement. This is the first thing recruiters read."
          />
          <p className={`mt-1 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            {(info.summary || '').length}/400 chars · Aim for 60–100 words with keywords from the job description.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoForm;
