import { AppSettings, CoverLetter, ResumeRecord } from '../types/resume';
import {
  listResumes,
  saveResume,
  deleteResume,
  loadSettings,
  saveSettings,
  listAllCoverLetters,
  saveCoverLetter,
  deleteCoverLetter,
} from '../db/resumeDB';

export const BACKUP_SCHEMA_VERSION = 1;

export interface WorkspaceBackup {
  schemaVersion: number;
  exportedAt: string;
  app: string;
  resumes: ResumeRecord[];
  settings?: AppSettings;
  coverLetters: CoverLetter[];
  /** True when AI API key was included in this file */
  includesApiKey?: boolean;
}

function downloadJson(filename: string, data: unknown): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function redactSettings(settings: AppSettings | undefined, includeApiKey: boolean): AppSettings | undefined {
  if (!settings) return undefined;
  if (includeApiKey) return settings;
  return {
    ...settings,
    ai: {
      ...settings.ai,
      apiKey: '',
    },
  };
}

/** Build and download a full workspace backup JSON file. */
export async function exportWorkspaceBackup(options?: { includeApiKey?: boolean }): Promise<void> {
  const includeApiKey = options?.includeApiKey === true;
  const [resumes, settings, coverLetters] = await Promise.all([
    listResumes(),
    loadSettings(),
    listAllCoverLetters(),
  ]);

  const backup: WorkspaceBackup = {
    schemaVersion: BACKUP_SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    app: 'resume-builder-pro',
    resumes,
    settings: redactSettings(settings, includeApiKey),
    coverLetters,
    includesApiKey: includeApiKey && !!settings?.ai?.apiKey,
  };

  const stamp = new Date().toISOString().slice(0, 10);
  downloadJson(`resume-builder-pro-backup-${stamp}.json`, backup);
}

export function isWorkspaceBackup(value: unknown): value is WorkspaceBackup {
  if (!value || typeof value !== 'object') return false;
  const v = value as Record<string, unknown>;
  if (v.app !== 'resume-builder-pro' && v.app !== undefined) {
    // allow missing app for slightly older hand-made files if resumes array looks valid
  }
  if (!Array.isArray(v.resumes)) return false;
  return v.resumes.every((r) => r && typeof r === 'object' && typeof (r as ResumeRecord).id === 'string' && (r as ResumeRecord).data);
}

export type ImportMode = 'merge' | 'replace';

export interface ImportResult {
  resumesImported: number;
  coverLettersImported: number;
  settingsImported: boolean;
}

/**
 * Import a workspace backup.
 * - merge: upsert by id (overwrite same ids, keep others)
 * - replace: delete all local resumes + cover letters, then import
 */
export async function importWorkspaceBackup(
  backup: WorkspaceBackup,
  mode: ImportMode,
  options?: { importSettings?: boolean }
): Promise<ImportResult> {
  const importSettings = options?.importSettings !== false;

  if (mode === 'replace') {
    const existing = await listResumes();
    for (const r of existing) {
      await deleteResume(r.id);
    }
    const existingCls = await listAllCoverLetters();
    for (const cl of existingCls) {
      await deleteCoverLetter(cl.id);
    }
  }

  for (const record of backup.resumes) {
    await saveResume({
      ...record,
      versions: record.versions || [],
      updatedAt: record.updatedAt || new Date().toISOString(),
      createdAt: record.createdAt || new Date().toISOString(),
    });
  }

  let coverLettersImported = 0;
  for (const cl of backup.coverLetters || []) {
    if (!cl?.id) continue;
    await saveCoverLetter(cl);
    coverLettersImported += 1;
  }

  let settingsImported = false;
  if (importSettings && backup.settings) {
    const current = await loadSettings();
    const incoming = backup.settings;
    // Never wipe a local API key with an empty redacted key unless the backup intentionally includes keys
    const apiKey =
      backup.includesApiKey || incoming.ai?.apiKey
        ? incoming.ai?.apiKey || ''
        : current?.ai?.apiKey || '';
    await saveSettings({
      ...current,
      ...incoming,
      ai: {
        provider: incoming.ai?.provider ?? current?.ai?.provider ?? 'none',
        apiKey,
        model: incoming.ai?.model ?? current?.ai?.model ?? '',
      },
      darkMode: incoming.darkMode ?? current?.darkMode ?? false,
      autoSave: incoming.autoSave ?? current?.autoSave ?? true,
    });
    settingsImported = true;
  }

  return {
    resumesImported: backup.resumes.length,
    coverLettersImported,
    settingsImported,
  };
}

export async function readBackupFile(file: File): Promise<WorkspaceBackup> {
  const text = await file.text();
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error('Invalid JSON file.');
  }
  if (!isWorkspaceBackup(parsed)) {
    throw new Error('Not a valid ResumeBuilder Pro backup (missing resumes array or ids).');
  }
  return parsed as WorkspaceBackup;
}
