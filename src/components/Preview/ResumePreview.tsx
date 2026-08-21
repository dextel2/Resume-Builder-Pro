import React from 'react';
import { useAppSelector } from '../../hooks';
import ProfessionalTemplate from './templates/ProfessionalTemplate';
import ModernTemplate from './templates/ModernTemplate';
import ClassicTemplate from './templates/ClassicTemplate';
import CompactTemplate from './templates/CompactTemplate';
import ExecutiveTemplate from './templates/ExecutiveTemplate';

const ResumePreview: React.FC = () => {
  const resumeData = useAppSelector(state => state.resume.data);
  const template = resumeData.styling.template;

  const renderTemplate = () => {
    switch (template) {
      case 'modern':    return <ModernTemplate data={resumeData} />;
      case 'classic':   return <ClassicTemplate data={resumeData} />;
      case 'compact':   return <CompactTemplate data={resumeData} />;
      case 'executive': return <ExecutiveTemplate data={resumeData} />;
      default:          return <ProfessionalTemplate data={resumeData} />;
    }
  };

  return (
    <div
      id="resume-preview"
      className="bg-white shadow-lg mx-auto"
      style={{
        width: '210mm',
        minHeight: '297mm',
        padding: template === 'compact' ? 0 : '20mm 18mm',
        boxSizing: 'border-box',
      }}
    >
      {renderTemplate()}
    </div>
  );
};

export default ResumePreview;
