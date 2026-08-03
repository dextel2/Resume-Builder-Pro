import React, { useState } from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp, Sparkles, Loader } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../hooks';
import { addExperience, updateExperience, removeExperience } from '../../store/resumeSlice';
import { ExperienceEntry } from '../../types/resume';
import { rewriteBulletWithAI } from '../../utils/atsUtils';

const ExperienceForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const experiences = useAppSelector(state => state.resume.data.sections.experience);
  const aiSettings = useAppSelector(state => state.resume.settings.ai);
  const darkMode = useAppSelector(state => state.resume.settings.darkMode);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [rewriting, setRewriting] = useState<Record<string, boolean>>({});

  const update = (id: string, data: Partial<ExperienceEntry>) => dispatch(updateExperience({ id, data }));

  const toggleCollapse = (id: string) => setCollapsed(p => ({ ...p, [id]: !p[id] }));

  const updateAchievement = (id: string, idx: number, value: string) => {
    const exp = experiences.find(e => e.id === id)!;
    const achievements = [...exp.achievements];
    achievements[idx] = value;
    update(id, { achievements });
  };

  const addAchievement = (id: string) => {
    const exp = experiences.find(e => e.id === id)!;
    update(id, { achievements: [...exp.achievements, ''] });
  };

  const removeAchievement = (id: string, idx: number) => {
    const exp = experiences.find(e => e.id === id)!;
    const achievements = exp.achievements.filter((_, i) => i !== idx);
    update(id, { achievements: achievements.length ? achievements : [''] });
  };

  const rewriteBullet = async (expId: string, idx: number) => {
    const exp = experiences.find(e => e.id === expId)!;
    const bullet = exp.achievements[idx];
    if (!bullet.trim()) return;
    const key = `${expId}-${idx}`;
    setRewriting(p => ({ ...p, [key]: true }));
    try {
      const rewritten = await rewriteBulletWithAI(bullet, { position: exp.position, company: exp.company }, aiSettings);
      const achievements = [...exp.achievements];
      achievements[idx] = rewritten;
      update(expId, { achievements });
    } finally {
      setRewriting(p => ({ ...p, [key]: false }));
    }
  };

  const inputCls = `w-full px-3 py-2 rounded-lg border text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors ${
    darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' : 'bg-white border-gray-300 text-gray-900'
  }`;
  const labelCls = `block text-xs font-semibold mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`;
  const cardCls = `rounded-xl border p-4 space-y-3 ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}`;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Work Experience</h2>
        <button onClick={() => dispatch(addExperience())} className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition-colors">
          <Plus className="h-3.5 w-3.5" /> Add
        </button>
      </div>

      {experiences.length === 0 && (
        <div className={`text-center py-8 rounded-xl border-2 border-dashed ${darkMode ? 'border-gray-700 text-gray-500' : 'border-gray-200 text-gray-400'}`}>
          <p className="text-sm">No experience entries yet.</p>
          <button onClick={() => dispatch(addExperience())} className="mt-2 text-indigo-500 text-sm hover:underline">+ Add your first position</button>
        </div>
      )}

      {experiences.map((exp, expIdx) => (
        <div key={exp.id} className={cardCls}>
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <button onClick={() => toggleCollapse(exp.id)} className="flex-1 text-left">
              <div className={`font-semibold text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {exp.position || exp.company || `Experience ${expIdx + 1}`}
              </div>
              {(exp.company || exp.startDate) && (
                <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {exp.company}{exp.startDate ? ` · ${exp.startDate}` : ''}
                </div>
              )}
            </button>
            <div className="flex items-center gap-1">
              <button onClick={() => toggleCollapse(exp.id)} className={`p-1.5 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}>
                {collapsed[exp.id] ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
              </button>
              <button onClick={() => dispatch(removeExperience(exp.id))} className="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          {!collapsed[exp.id] && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Company *</label>
                  <input className={inputCls} value={exp.company} onChange={e => update(exp.id, { company: e.target.value })} placeholder="Google" />
                </div>
                <div>
                  <label className={labelCls}>Job Title *</label>
                  <input className={inputCls} value={exp.position} onChange={e => update(exp.id, { position: e.target.value })} placeholder="Software Engineer" />
                </div>
                <div>
                  <label className={labelCls}>Location</label>
                  <input className={inputCls} value={exp.location} onChange={e => update(exp.id, { location: e.target.value })} placeholder="Mountain View, CA" />
                </div>
                <div>
                  <label className={labelCls}>Start Date</label>
                  <input className={inputCls} type="month" value={exp.startDate} onChange={e => update(exp.id, { startDate: e.target.value })} />
                </div>
                <div>
                  <label className={labelCls}>End Date</label>
                  <input className={inputCls} type="month" value={exp.endDate} onChange={e => update(exp.id, { endDate: e.target.value })} disabled={exp.current} />
                </div>
                <div className="flex items-center gap-2 pt-5">
                  <input type="checkbox" id={`current-${exp.id}`} checked={exp.current} onChange={e => update(exp.id, { current: e.target.checked, endDate: e.target.checked ? '' : exp.endDate })} className="rounded border-gray-300 text-indigo-600" />
                  <label htmlFor={`current-${exp.id}`} className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Currently working here</label>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className={labelCls}>Achievement Bullet Points</label>
                  <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Start with a strong action verb + number</span>
                </div>
                <div className="space-y-2">
                  {exp.achievements.map((ach, i) => (
                    <div key={i} className="flex gap-2 items-start">
                      <span className={`text-sm pt-2.5 flex-shrink-0 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>•</span>
                      <textarea
                        className={`${inputCls} resize-none flex-1`}
                        rows={2}
                        value={ach}
                        onChange={e => updateAchievement(exp.id, i, e.target.value)}
                        placeholder="Led migration of X system, reducing costs by 30% and improving availability by 40%."
                      />
                      <div className="flex flex-col gap-1 flex-shrink-0">
                        <button
                          onClick={() => rewriteBullet(exp.id, i)}
                          disabled={rewriting[`${exp.id}-${i}`] || !ach.trim()}
                          title="AI-rewrite this bullet"
                          className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 disabled:opacity-40 transition-colors"
                        >
                          {rewriting[`${exp.id}-${i}`] ? <Loader className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
                        </button>
                        <button onClick={() => removeAchievement(exp.id, i)} className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-colors">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={() => addAchievement(exp.id)} className={`mt-2 flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-colors ${darkMode ? 'border-gray-600 text-gray-400 hover:bg-gray-700' : 'border-gray-300 text-gray-600 hover:bg-gray-100'}`}>
                  <Plus className="h-3 w-3" /> Add bullet point
                </button>
              </div>

              <div>
                <label className={labelCls}>Technologies / Tools Used</label>
                <input className={inputCls} value={exp.technologies || ''} onChange={e => update(exp.id, { technologies: e.target.value })} placeholder="React, Node.js, AWS, PostgreSQL, Docker" />
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default ExperienceForm;
