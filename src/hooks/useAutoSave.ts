import { useEffect, useRef } from 'react';
import debounce from 'debounce';
import { useAppSelector, useAppDispatch } from './index';
import { setLastSaved, updateResumeListItem } from '../store/resumeSlice';
import { saveResume, loadResume, loadSettings, saveSettings } from '../db/resumeDB';
import { ResumeRecord } from '../types/resume';

export const useAutoSave = () => {
  const dispatch = useAppDispatch();
  const resumeData = useAppSelector(state => state.resume.data);
  const activeResumeId = useAppSelector(state => state.resume.activeResumeId);
  const settings = useAppSelector(state => state.resume.settings);
  const autoSave = settings.autoSave;

  const debouncedSave = useRef(
    debounce(async (id: string, data: typeof resumeData, name: string) => {
      try {
        const now = new Date().toISOString();
        const existing = await loadResume(id);
        const record: ResumeRecord = {
          id,
          name,
          createdAt: existing?.createdAt || now,
          updatedAt: now,
          data,
          versions: existing?.versions || [],
        };
        await saveResume(record);
        dispatch(setLastSaved(now));
      } catch (err) {
        console.error('Auto-save failed:', err);
      }
    }, 1000)
  ).current;

  useEffect(() => {
    if (!autoSave) return;
    const name = resumeData.personalInfo.name || 'My Resume';
    debouncedSave(activeResumeId, resumeData, name);
  }, [resumeData, activeResumeId, autoSave]);

  useEffect(() => {
    saveSettings(settings).catch(console.error);
  }, [settings]);
};
