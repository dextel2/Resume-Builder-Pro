import React from 'react';
import { FileText, Sparkles, PenLine } from 'lucide-react';

interface Props {
  onChooseBlank: () => void;
  onChooseSample: () => void;
}

const WelcomeModal: React.FC<Props> = ({ onChooseBlank, onChooseSample }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative z-10 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-indigo-600 p-2.5 rounded-xl">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Welcome to ResumeBuilder Pro</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Free · Local-first · ATS-friendly</p>
            </div>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
            How would you like to start? Your data stays in this browser only — no account required.
          </p>

          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={onChooseBlank}
              className="text-left rounded-xl border-2 border-gray-200 dark:border-gray-600 p-4 hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/40 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <PenLine className="h-5 w-5 text-indigo-600 mb-2" />
              <div className="font-semibold text-gray-900 dark:text-white text-sm">Start blank</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Empty sections with sensible defaults. Build your resume from scratch.
              </div>
            </button>

            <button
              type="button"
              onClick={onChooseSample}
              className="text-left rounded-xl border-2 border-gray-200 dark:border-gray-600 p-4 hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/40 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <Sparkles className="h-5 w-5 text-indigo-600 mb-2" />
              <div className="font-semibold text-gray-900 dark:text-white text-sm">Load sample</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Explore templates and ATS tools with a filled-in demo resume.
              </div>
            </button>
          </div>

          <p className="text-xs text-gray-400 dark:text-gray-500 mt-5">
            You can always create more resumes from <span className="font-medium">My Resumes</span>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeModal;
