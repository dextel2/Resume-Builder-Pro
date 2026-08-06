import { openDB, IDBPDatabase } from 'idb';
import { ResumeRecord, AppSettings, CoverLetter } from '../types/resume';

const DB_NAME = 'resume-builder-pro';
const DB_VERSION = 1;

let db: IDBPDatabase | null = null;

async function getDB() {
  if (db) return db;
  db = await openDB(DB_NAME, DB_VERSION, {
    upgrade(database) {
      if (!database.objectStoreNames.contains('resumes')) {
        const resumeStore = database.createObjectStore('resumes', { keyPath: 'id' });
        resumeStore.createIndex('updatedAt', 'updatedAt');
      }
      if (!database.objectStoreNames.contains('settings')) {
        database.createObjectStore('settings', { keyPath: 'key' });
      }
      if (!database.objectStoreNames.contains('coverLetters')) {
        const clStore = database.createObjectStore('coverLetters', { keyPath: 'id' });
        clStore.createIndex('resumeId', 'resumeId');
      }
    },
  });
  return db;
}

// ── Resumes ──────────────────────────────────────────────────────────────────

export async function saveResume(record: ResumeRecord): Promise<void> {
  const database = await getDB();
  await database.put('resumes', record);
}

export async function loadResume(id: string): Promise<ResumeRecord | undefined> {
  const database = await getDB();
  return database.get('resumes', id);
}

export async function listResumes(): Promise<ResumeRecord[]> {
  const database = await getDB();
  return database.getAll('resumes');
}

export async function deleteResume(id: string): Promise<void> {
  const database = await getDB();
  await database.delete('resumes', id);
}

// ── Settings ─────────────────────────────────────────────────────────────────

export async function saveSettings(settings: AppSettings): Promise<void> {
  const database = await getDB();
  await database.put('settings', { key: 'appSettings', value: settings });
}

export async function loadSettings(): Promise<AppSettings | undefined> {
  const database = await getDB();
  const record = await database.get('settings', 'appSettings');
  return record?.value;
}

// ── Cover Letters ─────────────────────────────────────────────────────────────

export async function saveCoverLetter(cl: CoverLetter): Promise<void> {
  const database = await getDB();
  await database.put('coverLetters', cl);
}

export async function loadCoverLettersByResume(resumeId: string): Promise<CoverLetter[]> {
  const database = await getDB();
  return database.getAllFromIndex('coverLetters', 'resumeId', resumeId);
}

export async function listAllCoverLetters(): Promise<CoverLetter[]> {
  const database = await getDB();
  return database.getAll('coverLetters');
}

export async function deleteCoverLetter(id: string): Promise<void> {
  const database = await getDB();
  await database.delete('coverLetters', id);
}

// ── Migration: import any existing localStorage data ──────────────────────────

export async function migrateFromLocalStorage(defaultResumeId: string): Promise<boolean> {
  const raw = localStorage.getItem('resumeData');
  if (!raw) return false;
  try {
    const data = JSON.parse(raw);
    const existing = await loadResume(defaultResumeId);
    if (!existing) {
      const record: ResumeRecord = {
        id: defaultResumeId,
        name: data.personalInfo?.name || 'My Resume',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        data,
        versions: [],
      };
      await saveResume(record);
    }
    localStorage.removeItem('resumeData');
    return true;
  } catch {
    return false;
  }
}
