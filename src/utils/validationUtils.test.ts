import { describe, it, expect } from 'vitest';
import { validateResumeForExport } from './validationUtils';
import { resumeHasKeyword, expandKeyword } from './skillSynonyms';
import { ResumeData } from '../types/resume';

const empty = (): ResumeData => ({
  personalInfo: { name: '', email: '', phone: '', location: '' },
  sections: {
    education: [],
    experience: [],
    skills: [],
    projects: [],
    awards: [],
    certifications: [],
    custom: [],
  },
  sectionOrder: [],
  styling: {
    template: 'professional',
    fontSize: 11,
    fontFamily: 'Arial',
    spacing: 1.2,
    colors: { primary: '#000', secondary: '#333', accent: '#666' },
  },
});

describe('validateResumeForExport', () => {
  it('errors on missing name and email', () => {
    const issues = validateResumeForExport(empty());
    expect(issues.some(i => i.field === 'name' && i.level === 'error')).toBe(true);
    expect(issues.some(i => i.field === 'email' && i.level === 'error')).toBe(true);
  });

  it('accepts valid contact basics', () => {
    const d = empty();
    d.personalInfo = { name: 'A B', email: 'a@b.com', phone: '555', location: 'X' };
    const issues = validateResumeForExport(d);
    expect(issues.filter(i => i.level === 'error')).toHaveLength(0);
  });
});

describe('skill synonyms', () => {
  it('expands k8s to kubernetes', () => {
    expect(expandKeyword('k8s').some(x => x.includes('kubernetes'))).toBe(true);
  });

  it('matches synonym in resume text', () => {
    expect(resumeHasKeyword('experience with kubernetes and docker', 'k8s')).toBe(true);
    expect(resumeHasKeyword('uses react daily', 'reactjs')).toBe(true);
  });
});
