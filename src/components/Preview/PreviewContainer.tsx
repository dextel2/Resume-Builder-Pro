import React, { useState } from 'react';
import { ZoomIn, ZoomOut, Maximize2, FileText } from 'lucide-react';
import ResumePreview from './ResumePreview';
import { useAppSelector } from '../../hooks';

const PreviewContainer: React.FC = () => {
  const [zoom, setZoom] = useState(75);
  const darkMode = useAppSelector(state => state.resume.settings.darkMode);
  const dm = darkMode;

  return (
    <div className={`flex flex-col h-full ${dm ? 'bg-gray-900' : 'bg-gray-100'}`}>
      {/* Toolbar */}
      <div className={`flex items-center justify-between px-4 py-2.5 border-b flex-shrink-0 ${dm ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <FileText className={`h-4 w-4 ${dm ? 'text-gray-400' : 'text-gray-500'}`} />
            <span className={`text-sm font-semibold ${dm ? 'text-gray-200' : 'text-gray-700'}`}>Preview</span>
          </div>
          <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${dm ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <button
              onClick={() => setZoom(z => Math.max(z - 10, 40))}
              disabled={zoom <= 40}
              className={`p-1 rounded transition-colors ${dm ? 'hover:bg-gray-600 text-gray-300 disabled:text-gray-600' : 'hover:bg-gray-200 text-gray-600 disabled:text-gray-300'}`}
            >
              <ZoomOut className="h-3.5 w-3.5" />
            </button>
            <span className={`text-xs font-mono min-w-[38px] text-center ${dm ? 'text-gray-300' : 'text-gray-600'}`}>{zoom}%</span>
            <button
              onClick={() => setZoom(z => Math.min(z + 10, 150))}
              disabled={zoom >= 150}
              className={`p-1 rounded transition-colors ${dm ? 'hover:bg-gray-600 text-gray-300 disabled:text-gray-600' : 'hover:bg-gray-200 text-gray-600 disabled:text-gray-300'}`}
            >
              <ZoomIn className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoom(75)}
            className={`text-xs px-2 py-1 rounded-lg transition-colors ${dm ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100'}`}
          >
            Fit
          </button>
          <button
            onClick={() => setZoom(100)}
            className={`text-xs px-2 py-1 rounded-lg transition-colors ${dm ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100'}`}
          >
            100%
          </button>
        </div>
      </div>

      {/* Scrollable canvas */}
      <div className="flex-1 overflow-auto p-6 min-h-0">
        <div
          style={{
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'top center',
            width: `${(100 / zoom) * 100}%`,
            marginLeft: `${((zoom - 100) / 2 / zoom) * 100}%`,
          }}
        >
          <ResumePreview />
        </div>
      </div>
    </div>
  );
};

export default PreviewContainer;
