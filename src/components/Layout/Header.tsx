import React, { useState } from 'react';
import {
  FileText, Download, Save, Clock, Moon, Sun, Layers,
  ChevronDown, FileCode, AlignLeft, Sparkles
} from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../hooks';
import { toggleDarkMode, setLastSaved, setShowTemplateGallery, setShowCoverLetterBuilder } from '../../store/resumeSlice';
import { saveResume, loadResume } from '../../db/resumeDB';
import { exportDOCX, exportTXT } from '../../utils/exportUtils';
import { exportVisualPDF, exportAtsPDF } from '../../utils/pdfExport';

interface HeaderProps {
  onOpenResumeManager: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenResumeManager }) => {
  const dispatch = useAppDispatch();
  const lastSaved = useAppSelector(state => state.resume.lastSaved);
  const darkMode = useAppSelector(state => state.resume.settings.darkMode);
  const resumeData = useAppSelector(state => state.resume.data);
  const activeResumeId = useAppSelector(state => state.resume.activeResumeId);
  const [exportOpen, setExportOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const formatLastSaved = (ts: string | null) => {
    if (!ts) return 'Not saved';
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleManualSave = async () => {
    setIsSaving(true);
    try {
      const now = new Date().toISOString();
      const existing = await loadResume(activeResumeId);
      await saveResume({
        id: activeResumeId,
        name: resumeData.personalInfo.name || 'My Resume',
        createdAt: existing?.createdAt || now,
        updatedAt: now,
        data: resumeData,
        versions: existing?.versions || [],
      });
      dispatch(setLastSaved(now));
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportVisualPDF = async () => {
    setIsExporting(true);
    setExportOpen(false);
    try {
      await exportVisualPDF(resumeData);
    } catch (err) {
      console.error('Visual PDF export failed:', err);
      alert(err instanceof Error ? err.message : 'PDF export failed.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportAtsPDF = () => {
    setExportOpen(false);
    setIsExporting(true);
    try {
      exportAtsPDF(resumeData);
    } catch (err) {
      console.error('ATS PDF export failed:', err);
      alert(err instanceof Error ? err.message : 'ATS PDF export failed.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportDOCX = async () => {
    setExportOpen(false);
    setIsExporting(true);
    try {
      await exportDOCX(resumeData);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportTXT = () => {
    setExportOpen(false);
    exportTXT(resumeData);
  };

  const base = darkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900';
  const btnBase = darkMode ? 'bg-gray-800 hover:bg-gray-700 text-gray-200' : 'bg-gray-100 hover:bg-gray-200 text-gray-700';
  const menuItem = `w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${darkMode ? 'hover:bg-gray-700 text-gray-200' : 'hover:bg-gray-50 text-gray-700'}`;

  return (
    <header className={`app-chrome border-b px-4 py-3 flex-shrink-0 z-20 ${base}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-tight">ResumeBuilder Pro</h1>
              <p className="text-xs text-gray-400 leading-tight">Free · ATS-Optimized · No Paywall</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-1 ml-4">
            <button
              onClick={onOpenResumeManager}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${btnBase}`}
            >
              <Layers className="h-3.5 w-3.5" />
              My Resumes
            </button>
            <button
              onClick={() => dispatch(setShowTemplateGallery(true))}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${btnBase}`}
            >
              <Sparkles className="h-3.5 w-3.5" />
              Templates
            </button>
            <button
              onClick={() => dispatch(setShowCoverLetterBuilder(true))}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${btnBase}`}
            >
              <AlignLeft className="h-3.5 w-3.5" />
              Cover Letter
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-400">
            <Clock className="h-3.5 w-3.5" />
            <span>{formatLastSaved(lastSaved)}</span>
          </div>

          <button
            onClick={() => dispatch(toggleDarkMode())}
            className={`p-2 rounded-lg transition-colors ${btnBase}`}
            title="Toggle dark mode"
          >
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <button
            onClick={handleManualSave}
            disabled={isSaving}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${btnBase}`}
          >
            <Save className="h-3.5 w-3.5" />
            {isSaving ? 'Saving...' : 'Save'}
          </button>

          <div className="relative">
            <button
              onClick={() => setExportOpen(o => !o)}
              disabled={isExporting}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              {isExporting ? 'Exporting...' : 'Export'}
              <ChevronDown className="h-3 w-3" />
            </button>

            {exportOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setExportOpen(false)} />
                <div className={`absolute right-0 mt-2 w-56 rounded-xl shadow-xl border z-20 overflow-hidden ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                  <button onClick={handleExportAtsPDF} className={menuItem}>
                    <FileText className="h-4 w-4 text-red-500 flex-shrink-0" />
                    <div className="text-left">
                      <div className="font-medium">PDF (ATS)</div>
                      <div className="text-xs text-gray-400">Selectable text · best for applying</div>
                    </div>
                  </button>
                  <button onClick={handleExportVisualPDF} className={menuItem}>
                    <FileText className="h-4 w-4 text-orange-500 flex-shrink-0" />
                    <div className="text-left">
                      <div className="font-medium">PDF (Visual)</div>
                      <div className="text-xs text-gray-400">Looks like preview · multi-page</div>
                    </div>
                  </button>
                  <button onClick={handleExportDOCX} className={menuItem}>
                    <FileCode className="h-4 w-4 text-blue-500 flex-shrink-0" />
                    <div className="text-left">
                      <div className="font-medium">Word (.docx)</div>
                      <div className="text-xs text-gray-400">Editable format</div>
                    </div>
                  </button>
                  <button onClick={handleExportTXT} className={menuItem}>
                    <AlignLeft className="h-4 w-4 text-gray-500 flex-shrink-0" />
                    <div className="text-left">
                      <div className="font-medium">Plain Text</div>
                      <div className="text-xs text-gray-400">ATS safe, no formatting</div>
                    </div>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
