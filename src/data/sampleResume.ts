import { ResumeData } from '../types/resume';

/** Empty structured resume used as import/parser baseline. */
export const blankResumeData: ResumeData = {
  personalInfo: {
    name: '',
    email: '',
    phone: '',
    location: '',
    github: '',
    linkedin: '',
    website: '',
    summary: '',
  },
  sections: {
    education: [],
    experience: [],
    skills: [],
    projects: [],
    awards: [],
    certifications: [],
    custom: [],
  },
  sectionOrder: [
    { id: 'skills', type: 'skills', name: 'Skills', visible: true },
    { id: 'experience', type: 'experience', name: 'Work Experience', visible: true },
    { id: 'education', type: 'education', name: 'Education', visible: true },
    { id: 'projects', type: 'projects', name: 'Projects', visible: true },
    { id: 'awards', type: 'awards', name: 'Awards & Recognition', visible: true },
    { id: 'certifications', type: 'certifications', name: 'Certifications', visible: false },
  ],
  styling: {
    template: 'professional',
    fontSize: 11,
    fontFamily: 'Arial',
    spacing: 1.2,
    colors: {
      primary: '#1C033C',
      secondary: '#371e77',
      accent: '#6d28d9',
    },
  },
};
