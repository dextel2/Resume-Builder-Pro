/** Canonical skill → alternate spellings (lowercase). */
export const SKILL_SYNONYMS: Record<string, string[]> = {
  javascript: ['js', 'ecmascript'],
  typescript: ['ts'],
  'node.js': ['nodejs', 'node'],
  react: ['reactjs', 'react.js'],
  'next.js': ['nextjs', 'next'],
  'vue.js': ['vuejs', 'vue'],
  kubernetes: ['k8s'],
  postgresql: ['postgres', 'psql'],
  mongodb: ['mongo'],
  'ci/cd': ['cicd', 'continuous integration'],
  aws: ['amazon web services'],
  gcp: ['google cloud', 'google cloud platform'],
  ml: ['machine learning'],
  ai: ['artificial intelligence'],
  'c++': ['cpp', 'cplusplus'],
  'c#': ['csharp', 'c sharp'],
  golang: ['go'],
};

/** Expand a keyword to itself + known synonyms for matching. */
export function expandKeyword(kw: string): string[] {
  const k = kw.toLowerCase().trim();
  const out = new Set<string>([k]);
  for (const [canon, alts] of Object.entries(SKILL_SYNONYMS)) {
    if (k === canon || alts.includes(k)) {
      out.add(canon);
      alts.forEach(a => out.add(a));
    }
  }
  return Array.from(out);
}

/** True if resume text matches keyword or any synonym. */
export function resumeHasKeyword(resumeTextLower: string, kw: string): boolean {
  return expandKeyword(kw).some(variant => resumeTextLower.includes(variant));
}
