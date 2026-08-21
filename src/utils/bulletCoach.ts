import { ContentIssue } from '../types/resume';

const WEAK_VERBS = [
  'helped', 'assisted', 'worked on', 'was responsible for', 'responsible for',
  'participated in', 'involved in', 'contributed to', 'supported', 'did', 'made',
  'handled', 'dealt with', 'tried to', 'attempted to',
];

const FILLER_WORDS = [
  'very', 'really', 'quite', 'basically', 'literally', 'honestly',
  'actually', 'various', 'numerous', 'many', 'several', 'some', 'different',
  'a lot of', 'lots of', 'hard working', 'team player', 'go-getter',
  'results-oriented', 'self-starter', 'detail-oriented', 'passionate about',
  'dynamic', 'synergy', 'leverage', 'utilize', 'innovative', 'strategic',
];

const STRONG_VERBS = [
  'Led', 'Built', 'Developed', 'Architected', 'Optimized', 'Drove',
  'Delivered', 'Designed', 'Implemented', 'Created', 'Reduced', 'Increased',
];

export type BulletIssueType =
  | 'weak_verb'
  | 'passive_voice'
  | 'no_metric'
  | 'too_short'
  | 'too_long'
  | 'filler_word';

export interface BulletIssue {
  type: BulletIssueType;
  label: string;
  suggestion: string;
}

const LABEL: Record<BulletIssueType, string> = {
  weak_verb: 'Weak verb',
  passive_voice: 'Passive voice',
  no_metric: 'No metric',
  too_short: 'Too short',
  too_long: 'Too long',
  filler_word: 'Filler',
};

/** Analyze a single achievement line. */
export function analyzeBullet(ach: string): BulletIssue[] {
  const trimmed = ach.trim();
  if (!trimmed) return [];

  const issues: BulletIssue[] = [];
  const lower = trimmed.toLowerCase();

  const foundWeak = WEAK_VERBS.find(v => lower.startsWith(v) || lower.includes(` ${v} `));
  if (foundWeak) {
    issues.push({
      type: 'weak_verb',
      label: LABEL.weak_verb,
      suggestion: `Replace "${foundWeak}" with a strong action verb (Led, Built, Drove…).`,
    });
  }

  if (/\bwas (done|completed|built|created|developed|implemented|managed|handled)\b/i.test(trimmed)) {
    issues.push({
      type: 'passive_voice',
      label: LABEL.passive_voice,
      suggestion: 'Rewrite in active voice (e.g. "Built…" instead of "was built").',
    });
  }

  if (!/\d+/.test(trimmed) && trimmed.length > 30) {
    issues.push({
      type: 'no_metric',
      label: LABEL.no_metric,
      suggestion: 'Add a number or metric (%, $, users, time saved).',
    });
  }

  if (trimmed.length < 20) {
    issues.push({
      type: 'too_short',
      label: LABEL.too_short,
      suggestion: 'Expand with context, action, and result.',
    });
  }

  if (trimmed.length > 220) {
    issues.push({
      type: 'too_long',
      label: LABEL.too_long,
      suggestion: 'Shorten to 1–2 lines focusing on action + outcome.',
    });
  }

  const foundFiller = FILLER_WORDS.find(f => lower.includes(f.toLowerCase()));
  if (foundFiller) {
    issues.push({
      type: 'filler_word',
      label: LABEL.filler_word,
      suggestion: `Remove filler "${foundFiller}".`,
    });
  }

  return issues;
}

/** Rule-based one-click improve (mirrors atsUtils rewrite). */
export function quickFixBullet(bullet: string): string {
  const trimmed = bullet.trim();
  if (!trimmed) return trimmed;
  const lower = trimmed.toLowerCase();

  for (const weak of WEAK_VERBS) {
    if (lower.startsWith(weak)) {
      const rest = trimmed.slice(weak.length);
      const strong = STRONG_VERBS[Math.floor(Math.random() * STRONG_VERBS.length)];
      return strong + rest;
    }
  }

  const firstWord = trimmed.split(' ')[0];
  const isStrong = STRONG_VERBS.some(v => v.toLowerCase() === firstWord.toLowerCase());
  if (!isStrong) {
    const strong = STRONG_VERBS[Math.floor(Math.random() * STRONG_VERBS.length)];
    return strong + ' ' + trimmed.charAt(0).toLowerCase() + trimmed.slice(1);
  }

  // Strip common fillers
  let out = trimmed;
  for (const f of FILLER_WORDS) {
    const re = new RegExp(`\\b${f.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    out = out.replace(re, '').replace(/\s{2,}/g, ' ').trim();
  }
  return out || trimmed;
}

export function experienceWritingScore(
  achievements: string[]
): { score: number; issueCount: number; bulletCount: number } {
  const bullets = achievements.filter(a => a.trim());
  let issueCount = 0;
  for (const b of bullets) {
    issueCount += analyzeBullet(b).length;
  }
  const bulletCount = bullets.length;
  const score =
    bulletCount === 0 ? 0 : Math.max(0, Math.round(100 - (issueCount / Math.max(bulletCount, 1)) * 80));
  return { score, issueCount, bulletCount };
}

/** Map ContentIssue from full resume check to display (optional bridge). */
export function contentIssueToLabel(issue: ContentIssue): string {
  return LABEL[issue.type as BulletIssueType] || issue.type;
}
