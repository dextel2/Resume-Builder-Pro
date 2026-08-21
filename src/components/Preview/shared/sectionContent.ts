import {
  EducationEntry,
  ExperienceEntry,
  ProjectEntry,
  SkillEntry,
  AwardEntry,
  CertificationEntry,
  CustomSection,
} from '../../../types/resume';
import { dateRange, fmtDate } from './fmtDate';

/** Shared pure helpers so every template formats the same fields the same way. */

export function nonEmptyAchievements(exp: ExperienceEntry): string[] {
  return exp.achievements.filter(a => a.trim());
}

export function experienceDateLine(exp: ExperienceEntry): string {
  return dateRange(exp.startDate, exp.endDate, exp.current);
}

export function educationDegreeLine(edu: EducationEntry): string {
  const parts = [
    edu.degree,
    edu.field ? `in ${edu.field}` : '',
    edu.gpa ? `GPA: ${edu.gpa}` : '',
  ].filter(Boolean);
  return parts.join(edu.field && edu.degree ? ' ' : ' · ').replace(' in ', ' in ');
}

export function educationDateLine(edu: EducationEntry): string {
  return dateRange(edu.startDate, edu.endDate);
}

export function projectTitleYear(proj: ProjectEntry): { title: string; year: string } {
  return { title: proj.title, year: proj.year || '' };
}

export function skillRows(skills: SkillEntry[]): SkillEntry[] {
  return skills.filter(s => s.skills?.trim());
}

export function splitSkillPills(skills: string): string[] {
  return skills
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);
}

export function awardLine(aw: AwardEntry): string {
  return [aw.title, aw.issuer ? `— ${aw.issuer}` : '', aw.date ? `(${aw.date})` : '']
    .filter(Boolean)
    .join(' ');
}

export function certificationLine(cert: CertificationEntry): string {
  return [cert.name, cert.issuer ? `— ${cert.issuer}` : '', cert.date ? `(${cert.date})` : '']
    .filter(Boolean)
    .join(' ');
}

export function findCustomSection(
  custom: CustomSection[],
  sectionId: string
): CustomSection | undefined {
  return custom.find(c => c.id === sectionId);
}

export { fmtDate, dateRange };
