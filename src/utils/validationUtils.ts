import { ResumeData } from '../types/resume';

export interface ValidationIssue {
  level: 'error' | 'warn';
  field: string;
  message: string;
}

const EMAIL_RE = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export function validateResumeForExport(data: ResumeData): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const { personalInfo, sections } = data;

  if (!personalInfo.name?.trim()) {
    issues.push({ level: 'error', field: 'name', message: 'Full name is required before export.' });
  }

  if (!personalInfo.email?.trim()) {
    issues.push({ level: 'error', field: 'email', message: 'Email is required before export.' });
  } else if (!EMAIL_RE.test(personalInfo.email.trim())) {
    issues.push({ level: 'error', field: 'email', message: 'Email format looks invalid.' });
  }

  if (!personalInfo.phone?.trim()) {
    issues.push({ level: 'warn', field: 'phone', message: 'Phone number is missing (many recruiters expect it).' });
  }

  if (!personalInfo.location?.trim()) {
    issues.push({ level: 'warn', field: 'location', message: 'Location is missing (ATS often filter by city/state).' });
  }

  if (sections.experience.length === 0) {
    issues.push({ level: 'warn', field: 'experience', message: 'No work experience entries yet.' });
  } else {
    for (const exp of sections.experience) {
      if (exp.startDate && exp.endDate && !exp.current && exp.endDate < exp.startDate) {
        issues.push({
          level: 'warn',
          field: 'experience-dates',
          message: `End date before start date: ${exp.position || exp.company || 'role'}.`,
        });
      }
    }
  }

  return issues;
}

export function formatValidationMessage(issues: ValidationIssue[]): string {
  const errors = issues.filter(i => i.level === 'error');
  const warns = issues.filter(i => i.level === 'warn');
  const lines: string[] = [];
  if (errors.length) {
    lines.push('Please fix before export:');
    errors.forEach(e => lines.push(`• ${e.message}`));
  }
  if (warns.length) {
    lines.push(errors.length ? '\nAlso note:' : 'Warnings:');
    warns.forEach(w => lines.push(`• ${w.message}`));
  }
  return lines.join('\n');
}
