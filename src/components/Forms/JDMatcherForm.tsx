import React, { useState } from 'react';
import { FileSearch, CheckCircle, XCircle, Plus, RefreshCw } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../hooks';
import { setJobDescription, setJDMatchResult, insertMissingKeyword } from '../../store/resumeSlice';
import { matchJobDescription } from '../../utils/atsUtils';

const JDMatcherForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const resumeData = useAppSelector(state => state.resume.data);
  const jobDescription = useAppSelector(state => state.resume.jobDescription);
  const matchResult = useAppSelector(state => state.resume.jdMatchResult);
  const darkMode = useAppSelector(state => state.resume.settings.darkMode);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) return;
    setIsAnalyzing(true);
    await new Promise(r => setTimeout(r, 300)); // small UX delay
    const result = matchJobDescription(resumeData, jobDescription);
    dispatch(setJDMatchResult(result));
    setIsAnalyzing(false);
  };

  const handleInsertKeyword = (kw: string) => {
    dispatch(insertMissingKeyword(kw));
    // Re-analyze after insertion
    const result = matchJobDescription(
      { ...resumeData, sections: { ...resumeData.sections, skills: resumeData.sections.skills } },
      jobDescription
    );
    dispatch(setJDMatchResult(result));
  };

  const scoreColor = (s: number) => s >= 70 ? 'text-green-600' : s >= 50 ? 'text-yellow-600' : 'text-red-600';
  const scoreBg = (s: number) => s >= 70 ? 'bg-green-100 border-green-200' : s >= 50 ? 'bg-yellow-100 border-yellow-200' : 'bg-red-100 border-red-200';

  const dm = darkMode;
  const cardCls = `rounded-xl border p-4 ${dm ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`;

  return (
    <div className="space-y-5">
      <div>
        <h2 className={`text-lg font-bold ${dm ? 'text-white' : 'text-gray-900'}`}>Job Description Matcher</h2>
        <p className={`text-sm mt-1 ${dm ? 'text-gray-400' : 'text-gray-500'}`}>
          Paste a job posting to see your keyword match score and which skills to add — the feature competitors charge $30+/month for.
        </p>
      </div>

      <div className={`p-3 rounded-xl border-l-4 border-indigo-500 ${dm ? 'bg-indigo-900/20' : 'bg-indigo-50'}`}>
        <p className={`text-xs font-semibold ${dm ? 'text-indigo-300' : 'text-indigo-700'}`}>
          100% Free · No Sign-up · Runs locally in your browser
        </p>
      </div>

      {/* JD Input */}
      <div className={cardCls}>
        <label className={`block text-sm font-semibold mb-2 ${dm ? 'text-gray-200' : 'text-gray-800'}`}>
          Paste Job Description
        </label>
        <textarea
          className={`w-full px-3 py-2.5 rounded-lg border text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none transition-colors ${dm ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'}`}
          rows={8}
          value={jobDescription}
          onChange={e => dispatch(setJobDescription(e.target.value))}
          placeholder="Paste the full job description here. The more text you include, the more accurate the keyword matching will be..."
        />
        <div className="flex items-center justify-between mt-3">
          <span className={`text-xs ${dm ? 'text-gray-500' : 'text-gray-400'}`}>{jobDescription.length} characters</span>
          <button
            onClick={handleAnalyze}
            disabled={!jobDescription.trim() || isAnalyzing}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {isAnalyzing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <FileSearch className="h-4 w-4" />}
            {isAnalyzing ? 'Analyzing...' : 'Analyze Match'}
          </button>
        </div>
      </div>

      {/* Results */}
      {matchResult && (
        <>
          {/* Score banner */}
          <div className={`${cardCls} ${scoreBg(matchResult.score)} text-center py-5`}>
            <div className={`text-5xl font-black mb-1 ${scoreColor(matchResult.score)}`}>{matchResult.score}%</div>
            <div className={`text-sm font-semibold ${scoreColor(matchResult.score)}`}>
              {matchResult.score >= 70 ? 'Great match! Your resume is well-aligned.' :
               matchResult.score >= 50 ? 'Decent match — add more missing keywords.' :
               'Low match — tailor your resume more to this job.'}
            </div>
            <div className="flex justify-center gap-6 mt-3 text-xs font-medium">
              <span className="text-green-600">✓ {matchResult.matchedKeywords.length} matched</span>
              <span className="text-red-500">✗ {matchResult.missingKeywords.length} missing</span>
            </div>
          </div>

          {/* Missing keywords — one-click add */}
          {matchResult.missingKeywords.length > 0 && (
            <div className={cardCls}>
              <h3 className={`text-sm font-bold mb-3 ${dm ? 'text-gray-200' : 'text-gray-800'}`}>
                Missing Keywords — Click to Add to Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {matchResult.missingKeywords.map(kw => (
                  <button
                    key={kw}
                    onClick={() => handleInsertKeyword(kw)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all hover:scale-105 ${dm ? 'bg-red-900/20 border-red-700 text-red-300 hover:bg-red-800/30' : 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100'}`}
                  >
                    <Plus className="h-3 w-3" />
                    {kw}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Matched keywords */}
          {matchResult.matchedKeywords.length > 0 && (
            <div className={cardCls}>
              <h3 className={`text-sm font-bold mb-3 ${dm ? 'text-gray-200' : 'text-gray-800'}`}>
                Matched Keywords ({matchResult.matchedKeywords.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {matchResult.matchedKeywords.map(kw => (
                  <span key={kw} className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium ${dm ? 'bg-green-900/20 text-green-300' : 'bg-green-50 text-green-700'}`}>
                    <CheckCircle className="h-3 w-3" />{kw}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Suggestions */}
          {matchResult.suggestions.length > 0 && (
            <div className={`${cardCls} space-y-2`}>
              <h3 className={`text-sm font-bold ${dm ? 'text-gray-200' : 'text-gray-800'}`}>Recommendations</h3>
              {matchResult.suggestions.map((s, i) => (
                <div key={i} className={`text-xs p-2.5 rounded-lg ${dm ? 'bg-indigo-900/30 text-indigo-300' : 'bg-indigo-50 text-indigo-700'}`}>
                  💡 {s}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default JDMatcherForm;
