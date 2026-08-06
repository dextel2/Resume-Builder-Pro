import { ResumeData, JDMatchResult } from '../types/resume';
import { extractKeywords } from './atsUtils';
import { resumeHasKeyword } from './skillSynonyms';

function getResumeText(data: ResumeData): string {
  const parts: string[] = [
    data.personalInfo.name,
    data.personalInfo.summary || '',
  ];
  for (const exp of data.sections.experience) {
    parts.push(exp.position, exp.company, ...exp.achievements, exp.technologies || '');
  }
  for (const edu of data.sections.education) {
    parts.push(edu.degree, edu.field, edu.institution, edu.coursework || '');
  }
  for (const s of data.sections.skills) {
    parts.push(s.category, s.skills);
  }
  for (const proj of data.sections.projects) {
    parts.push(proj.title, proj.description, proj.technologies || '');
  }
  for (const aw of data.sections.awards) {
    parts.push(aw.title, aw.description);
  }
  return parts.join(' ');
}

/** JD match with skill synonym expansion (preferred over plain includes). */
export function matchJobDescriptionWithSynonyms(
  data: ResumeData,
  jobDescription: string
): JDMatchResult {
  if (!jobDescription.trim()) {
    return { score: 0, matchedKeywords: [], missingKeywords: [], suggestions: [] };
  }

  const jdKeywords = extractKeywords(jobDescription);
  const resumeText = getResumeText(data).toLowerCase();
  const matched: string[] = [];
  const missing: string[] = [];
  const unique = Array.from(new Set(jdKeywords));

  for (const kw of unique) {
    if (resumeHasKeyword(resumeText, kw)) matched.push(kw);
    else missing.push(kw);
  }

  const totalMeaningful = Math.min(unique.length, 80);
  const matchedMeaningful = Math.min(matched.length, totalMeaningful);
  const rawScore =
    totalMeaningful === 0 ? 0 : Math.round((matchedMeaningful / totalMeaningful) * 100);
  const score = Math.min(rawScore, 100);

  const suggestions: string[] = [];
  if (missing.length > 0) {
    suggestions.push(`Add these missing keywords to your resume: ${missing.slice(0, 8).join(', ')}`);
  }
  if (score < 50) {
    suggestions.push(
      'Your resume matches less than 50% of the job description keywords. Consider tailoring your experience bullet points.'
    );
  }
  if (!data.personalInfo.summary) {
    suggestions.push(
      'Add a professional summary that incorporates key terms from the job description.'
    );
  }

  return {
    score,
    matchedKeywords: matched.slice(0, 30),
    missingKeywords: missing.slice(0, 30),
    suggestions,
  };
}
