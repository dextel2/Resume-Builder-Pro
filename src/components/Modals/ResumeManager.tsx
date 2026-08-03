import React, { useEffect, useState } from 'react';
import { X, Plus, Trash2, FileText, Copy, Clock } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { setActiveResumeId, loadResumeData, addResumeToList, removeResumeFromList, setResumeList } from '../../store/resumeSlice';
import { DEFAULT_RESUME_ID, initialResumeData } from '../../store/resumeSlice';
import { listResumes, saveResume, deleteResume } from '../../db/resumeDB';
import { ResumeRecord } from '../../types/resume';
import { v4 as uuidv4 } from 'uuid';

interface Props { onClose: () => void; }

const ResumeManager: React.FC<Props> = ({ onClose }) => {
  const dispatch = useAppDispatch();
  const activeResumeId = useAppSelector(state => state.resume.activeResumeId);
  const currentData = useAppSelector(state => state.resume.data);
  const darkMode = useAppSelector(state => state.resume.settings.darkMode);
  const [resumes, setResumes] = useState<ResumeRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const dm = darkMode;

  useEffect(() => {
    listResumes().then(list => {
      setResumes(list.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()));
      setLoading(false);
    });
  }, []);

  const handleNewResume = async () => {
    const id = uuidv4();
    const now = new Date().toISOString();
    const record: ResumeRecord = {
      id,
      name: 'New Resume',
      createdAt: now,
      updatedAt: now,
      data: { ...initialResumeData, personalInfo: { ...initialResumeData.personalInfo, name: '', email: '', phone: '' } },
      versions: [],
    };
    await saveResume(record);
    dispatch(addResumeToList({ id, name: 'New Resume' }));
    dispatch(setActiveResumeId(id));
    dispatch(loadResumeData(record.data));
    onClose();
  };

  const handleDuplicate = async (record: ResumeRecord) => {
    const id = uuidv4();
    const now = new Date().toISOString();
    const dup: ResumeRecord = { ...record, id, name: `${record.name} (copy)`, createdAt: now, updatedAt: now, versions: [] };
    await saveResume(dup);
    setResumes(prev => [dup, ...prev]);
    dispatch(addResumeToList({ id, name: dup.name }));
  };

  const handleSwitch = async (record: ResumeRecord) => {
    // Save current first
    const existing = resumes.find(r => r.id === activeResumeId);
    if (existing) {
      await saveResume({ ...existing, data: currentData, updatedAt: new Date().toISOString() });
    }
    dispatch(setActiveResumeId(record.id));
    dispatch(loadResumeData(record.data));
    onClose();
  };

  const handleDelete = async (id: string) => {
    if (resumes.length === 1) return; // can't delete last
    await deleteResume(id);
    setResumes(prev => prev.filter(r => r.id !== id));
    dispatch(removeResumeFromList(id));
    if (id === activeResumeId) {
      const remaining = resumes.filter(r => r.id !== id);
      if (remaining.length > 0) {
        dispatch(setActiveResumeId(remaining[0].id));
        dispatch(loadResumeData(remaining[0].data));
      }
    }
  };

  const cardCls = `rounded-xl border p-4 ${dm ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative z-10 w-full max-w-2xl max-h-[85vh] rounded-2xl shadow-2xl overflow-hidden ${dm ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className={`flex items-center justify-between p-5 border-b ${dm ? 'border-gray-700' : 'border-gray-200'}`}>
          <div>
            <h2 className={`text-lg font-bold ${dm ? 'text-white' : 'text-gray-900'}`}>My Resumes</h2>
            <p className={`text-sm ${dm ? 'text-gray-400' : 'text-gray-500'}`}>Switch between resumes or create tailored versions per job</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleNewResume} className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition-colors">
              <Plus className="h-3.5 w-3.5" /> New Resume
            </button>
            <button onClick={onClose} className={`p-2 rounded-xl ${dm ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}><X className="h-4 w-4" /></button>
          </div>
        </div>

        <div className="p-5 overflow-y-auto max-h-[calc(85vh-70px)] space-y-3">
          {loading ? (
            <div className="text-center py-10 text-gray-400">Loading...</div>
          ) : resumes.map(r => (
            <div key={r.id} className={`${cardCls} flex items-center gap-4 ${r.id === activeResumeId ? (dm ? 'border-indigo-600 ring-1 ring-indigo-600' : 'border-indigo-400 ring-1 ring-indigo-400') : ''}`}>
              <div className={`p-2.5 rounded-xl ${dm ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <FileText className={`h-5 w-5 ${r.id === activeResumeId ? 'text-indigo-500' : (dm ? 'text-gray-400' : 'text-gray-600')}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className={`font-semibold text-sm ${dm ? 'text-white' : 'text-gray-900'}`}>
                  {r.name}
                  {r.id === activeResumeId && <span className="ml-2 text-xs text-indigo-500 font-medium">Active</span>}
                </div>
                {r.targetJob && <div className={`text-xs ${dm ? 'text-gray-400' : 'text-gray-500'}`}>Target: {r.targetJob}</div>}
                <div className={`flex items-center gap-1 text-xs ${dm ? 'text-gray-500' : 'text-gray-400'} mt-0.5`}>
                  <Clock className="h-3 w-3" />
                  {new Date(r.updatedAt).toLocaleDateString()} {new Date(r.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                {r.id !== activeResumeId && (
                  <button onClick={() => handleSwitch(r)} className="px-3 py-1.5 text-xs font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                    Open
                  </button>
                )}
                <button onClick={() => handleDuplicate(r)} className={`p-1.5 rounded-lg transition-colors ${dm ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`} title="Duplicate">
                  <Copy className="h-3.5 w-3.5" />
                </button>
                <button onClick={() => handleDelete(r.id)} disabled={resumes.length === 1} className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-colors disabled:opacity-30" title="Delete">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResumeManager;
