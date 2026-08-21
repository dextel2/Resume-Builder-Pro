import React, { useMemo, useState } from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp, Sparkles, Loader, Wand2 } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../hooks';
import { addExperience, updateExperience, removeExperience } from '../../store/resumeSlice';
import { ExperienceEntry } from '../../types/resume';
import { rewriteBulletWithAI } from '../../utils/atsUtils';
import { humanizeAIError } from '../../utils/aiErrors';
import { analyzeBullet, quickFixBullet, experienceWritingScore } from '../../utils/bulletCoach';

const badgeColor = (type: string, dark: boolean) => {
  switch (type) {
    case 'weak_verb':
    case 'passive_voice':
      return dark ? 'bg-amber-900/50 text-amber-200' : 'bg-amber-100 text-amber-800';
    case 'no_metric':
      return dark ? 'bg-blue-900/50 text-blue-200' : 'bg-blue-100 text-blue-800';
    case 'filler_word':
      return dark ? 'bg-purple-900/50 text-purple-200' : 'bg-purple-100 text-purple-800';
    default:
      return dark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700';
  }
};

const ExperienceForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const experiences = useAppSelector(state => state.resume.data.sections.experience);
  const aiSettings = useAppSelector(state => state.resume.settings.ai);
  const darkMode = useAppSelector(state => state.resume.settings.darkMode);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [rewriting, setRewriting] = useState<Record<string, boolean>>({});
  const [aiNotice, setAiNotice] = useState<string | null>(null);

  const allAchievements = useMemo(
    () => experiences.flatMap(e => e.achievements),
    [experiences]
  );
  const writing = experienceWritingScore(allAchievements);

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
    setAiNotice(null);
    try {
      const rewritten = await rewriteBulletWithAI(
        bullet,
        { position: exp.position, company: exp.company },
        aiSettings
      );
      const achievements = [...exp.achievements];
      achievements[idx] = rewritten;
      update(expId, { achievements });
      if (aiSettings.provider !== 'none' && aiSettings.apiKey) {
        // soft note when provider is on (rule-based may still have been used on failure inside helper)
      }
    } catch (err) {
      setAiNotice(humanizeAIError(err) + ' Using rule-based rewrite when possible.');
      try {
        const rewritten = await rewriteBulletWithAI(
          bullet,
          { position: exp.position, company: exp.company },
          { provider: 'none', apiKey: '' }
        );
        const achievements = [...exp.achievements];
        achievements[idx] = rewritten;
        update(expId, { achievements });
      } catch {
        /* ignore */
      }
    } finally {
      setRewriting(p => ({ ...p, [key]: false }));
    }
  };

  const applyQuickFix = (expId: string, idx: number) => {
    const exp = experiences.find(e => e.id === expId)!;
    const bullet = exp.achievements[idx];
    if (!bullet.trim()) return;
    const achievements = [...exp.achievements];
    achievements[idx] = quickFixBullet(bullet);
    update(expId, { achievements });
  };

  const inputCls = `w-full px-3 py-2 rounded-lg border text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors ${
    darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' : 'bg-white border-gray-300 text-gray-900'
  }`;
  const labelCls = `block text-xs font-semibold mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`;
  const cardCls = `rounded-xl border p-4 space-y-3 ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}`;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Work Experience</h2>
        <div className="flex items-center gap-2">
          {writing.bulletCount > 0 && (
            <span
              className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                writing.score >= 70
                  ? darkMode
                    ? 'bg-green-900/40 text-green-300'
                    : 'bg-green-100 text-green-800'
                  : writing.score >= 40
                    ? darkMode
                      ? 'bg-amber-900/40 text-amber-200'
                      : 'bg-amber-100 text-amber-800'
                    : darkMode
                      ? 'bg-red-900/40 text-red-300'
                      : 'bg-red-100 text-red-800'
              }`}
              title={`${writing.issueCount} writing issue(s) across ${writing.bulletCount} bullet(s)`}
            >
              Writing {writing.score}/100
            </span>
          )}
          <button
            onClick={() => dispatch(addExperience())}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" /> Add
          </button>
        </div>
      </div>

      {aiNotice && (
        <div className={`text-xs rounded-lg px-3 py-2 ${darkMode ? 'bg-amber-900/40 text-amber-200' : 'bg-amber-50 text-amber-900'}`}>
          {aiNotice}
        </div>
      )}

      {experiences.length === 0 && (
        <div className={`text-center py-8 rounded-xl border-2 border-dashed ${darkMode ? 'border-gray-700 text-gray-500' : 'border-gray-200 text-gray-400'}`}>
          <p className="text-sm">No experience entries yet.</p>
          <button onClick={() => dispatch(addExperience())} className="mt-2 text-indigo-500 text-sm hover:underline">
            + Add your first position
          </button>
        </div>
      )}

      {experiences.map((exp, expIdx) => (
        <div key={exp.id} className={cardCls}>
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
              <button
                onClick={() => dispatch(removeExperience(exp.id))}
                className="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
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
                  <input
                    type="checkbox"
                    id={`current-${exp.id}`}
                    checked={exp.current}
                    onChange={e => update(exp.id, { current: e.target.checked, endDate: e.target.checked ? '' : exp.endDate })}
                    className="rounded border-gray-300 text-indigo-600"
                  />
                  <label htmlFor={`current-${exp.id}`} className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Currently working here
                  </label>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className={labelCls}>Achievement Bullet Points</label>
                  <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    Action verb + metric · coach runs live
                  </span>
                </div>
                <div className="space-y-3">
                  {exp.achievements.map((ach, i) => {
                    const issues = analyzeBullet(ach);
                    const key = `${exp.id}-${i}`;
                    return (
                      <div key={i}>
                        <div className="flex gap-2 items-start">
                          <span className={`text-sm pt-2.5 flex-shrink-0 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>•</span>
                          <textarea
                            className={`${inputCls} resize-none flex-1`}
                            rows={2}
                            value={ach}
                            onChange={e => updateAchievement(exp.id, i, e.target.value)}
                            placeholder="Led migration of X system, reducing costs by 30% and improving availability by 40%."
                          />
                          <div className="flex flex-col gap-1 flex-shrink-0">
                            {issues.length > 0 && (
                              <button
                                type="button"
                                onClick={() => applyQuickFix(exp.id, i)}
                                title="Quick fix (rule-based)"
                                className={`p-1.5 rounded-lg transition-colors ${
                                  darkMode
                                    ? 'bg-amber-900/40 text-amber-200 hover:bg-amber-900/70'
                                    : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                                }`}
                              >
                                <Wand2 className="h-3.5 w-3.5" />
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => rewriteBullet(exp.id, i)}
                              disabled={rewriting[key] || !ach.trim()}
                              title="AI rewrite (or rule-based if AI off)"
                              className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 disabled:opacity-40 transition-colors"
                            >
                              {rewriting[key] ? (
                                <Loader className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <Sparkles className="h-3.5 w-3.5" />
                              )}
                            </button>
                            <button
                              type="button"
                              onClick={() => removeAchievement(exp.id, i)}
                              className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-colors"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                        {issues.length > 0 && (
                          <div className="ml-5 mt-1.5 flex flex-wrap gap-1.5 items-center">
                            {issues.map(iss => (
                              <span
                                key={iss.type}
                                title={iss.suggestion}
                                className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${badgeColor(iss.type, darkMode)}`}
                              >
                                {iss.label}
                              </span>
                            ))}
                            <span className={`text-[10px] ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                              Hover badge · wand = quick fix
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                <button
                  type="button"
                  onClick={() => addAchievement(exp.id)}
                  className={`mt-2 flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                    darkMode
                      ? 'border-gray-600 text-gray-400 hover:bg-gray-700'
                      : 'border-gray-300 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Plus className="h-3 w-3" /> Add bullet point
                </button>
              </div>

              <div>
                <label className={labelCls}>Technologies / Tools Used</label>
                <input
                  className={inputCls}
                  value={exp.technologies || ''}
                  onChange={e => update(exp.id, { technologies: e.target.value })}
                  placeholder="React, Node.js, AWS, PostgreSQL, Docker"
                />
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default ExperienceForm;
