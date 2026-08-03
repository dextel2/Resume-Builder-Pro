import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  ResumeState,
  ResumeData,
  PersonalInfo,
  EducationEntry,
  ExperienceEntry,
  ProjectEntry,
  SkillEntry,
  AwardEntry,
  CertificationEntry,
  CustomSection,
  CustomSectionEntry,
  SectionOrder,
  AppSettings,
  JDMatchResult,
} from '../types/resume';
import { v4 as uuidv4 } from 'uuid';

export const DEFAULT_RESUME_ID = 'default-resume';

export const initialResumeData: ResumeData = {
  personalInfo: {
    name: 'Ashish Pratap Singh',
    email: 'ashish.singh@email.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    github: 'github.com/ashishps1',
    linkedin: 'linkedin.com/in/ashishps1',
    website: '',
    summary: 'Senior Software Engineer with 7+ years of experience building scalable distributed systems and data platforms at Adobe, Amazon, and Morgan Stanley. Proven track record of reducing operational costs by $50K+ annually and improving system reliability through automation and cloud-native solutions.',
  },
  sections: {
    education: [
      {
        id: uuidv4(),
        institution: 'BITS Pilani Hyderabad Campus',
        degree: 'Bachelor of Engineering',
        field: 'Computer Science and Engineering',
        startDate: '2013-08',
        endDate: '2017-06',
        gpa: '7.96/10',
        coursework: 'Data Structures & Algorithms, Operating Systems, Computer Networks, Machine Learning, Database Systems, Distributed Computing',
        honors: '',
      },
    ],
    experience: [
      {
        id: uuidv4(),
        company: 'Adobe',
        position: 'Computer Scientist',
        location: 'Bangalore, India',
        startDate: '2021-03',
        endDate: '',
        current: true,
        achievements: [
          'Led migration of Hive and Presto jobs from Qubole to AWS EMR, improving availability by 40% and reducing operational costs by 35%.',
          'Reduced custom reports service cost by 80%+ by building automated system to identify and disable unused reports.',
          'Identified unused AWS resources and established S3 bucket expiration policies, cutting annual AWS expenditure by $50,000+.',
        ],
        technologies: 'AWS, EC2, S3, EMR, Hive, Presto, Kafka, Druid, Kubernetes, Docker',
      },
      {
        id: uuidv4(),
        company: 'Amazon',
        position: 'Software Development Engineer',
        location: 'Bangalore, India',
        startDate: '2019-09',
        endDate: '2021-03',
        current: false,
        achievements: [
          'Migrated ML workflows to native AWS, enabling auto-scaling and improving logging/troubleshooting capabilities.',
          'Built customized batch workflow plugin saving external team $6MM in human labelling cost via ML-based auto-labelling.',
        ],
        technologies: 'Java, Python, TypeScript, AWS Step Functions, AWS Batch, Lambda, DynamoDB, LightGBM, TensorFlow',
      },
      {
        id: uuidv4(),
        company: 'Morgan Stanley',
        position: 'Technology Associate',
        location: 'Bangalore, India',
        startDate: '2017-08',
        endDate: '2019-08',
        current: false,
        achievements: [
          'Built infrastructure alert visualization tool using graph algorithms (BFS, Union-Find) to reduce Mean Time to Resolution by 60%.',
          'Developed ML-powered solution predicting production deployment failures with 85% accuracy, preventing emergency reversions.',
        ],
        technologies: 'Python, Flask, ReactJS, Redux, Angular, d3, Kafka, DB2, scikit-learn',
      },
    ],
    skills: [
      {
        id: uuidv4(),
        category: 'Languages',
        skills: 'C/C++, Java, Python, JavaScript, TypeScript, SQL',
      },
      {
        id: uuidv4(),
        category: 'Cloud & Infrastructure',
        skills: 'AWS (EC2, S3, Lambda, DynamoDB, EMR, Athena), Kubernetes, Docker',
      },
      {
        id: uuidv4(),
        category: 'Data & ML',
        skills: 'Spark, Hive, Presto, Kafka, Elasticsearch, TensorFlow, LightGBM, scikit-learn',
      },
    ],
    projects: [
      {
        id: uuidv4(),
        title: 'Word Lookup Dictionary',
        year: '2015',
        description: 'Desktop application for English word lookup with efficient Trie-based search, spelling correction via edit distance algorithm, and automated web-scraping for data collection.',
        technologies: 'Python, BeautifulSoup',
        url: '',
      },
      {
        id: uuidv4(),
        title: 'Alternative Routes in Road Networks',
        year: '2016',
        description: "Applied Dijkstra's shortest path algorithm with real-time traffic simulation, implementing collision avoidance via dynamic speed adjustment using C++ and OpenGL.",
        technologies: 'C++, OpenGL',
        url: '',
      },
    ],
    awards: [
      {
        id: uuidv4(),
        title: 'Mentor at Scaler Academy',
        issuer: 'Scaler Academy',
        date: '2021',
        description: 'Mentoring 50+ students and working professionals on problem solving, coding, and system design.',
      },
      {
        id: uuidv4(),
        title: 'Data Engineering Nanodegree',
        issuer: 'Udacity',
        date: '2020',
        description: 'Completed comprehensive program covering ETL pipelines, data warehousing, and big data technologies.',
      },
    ],
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

const defaultSettings: AppSettings = {
  ai: {
    provider: 'none',
    apiKey: '',
    model: '',
  },
  darkMode: false,
  autoSave: true,
};

const initialState: ResumeState = {
  resumeList: [{ id: DEFAULT_RESUME_ID, name: 'My Resume', updatedAt: new Date().toISOString() }],
  activeResumeId: DEFAULT_RESUME_ID,
  data: initialResumeData,
  activeSection: 'personal',
  isLoading: false,
  lastSaved: null,
  jobDescription: '',
  jdMatchResult: null,
  settings: defaultSettings,
  showTemplateGallery: false,
  showCoverLetterBuilder: false,
};

const resumeSlice = createSlice({
  name: 'resume',
  initialState,
  reducers: {
    // ── Multi-resume management ──────────────────────────────────────────────
    setResumeList: (state, action: PayloadAction<typeof initialState.resumeList>) => {
      state.resumeList = action.payload;
    },
    setActiveResumeId: (state, action: PayloadAction<string>) => {
      state.activeResumeId = action.payload;
    },
    addResumeToList: (state, action: PayloadAction<{ id: string; name: string; targetJob?: string }>) => {
      state.resumeList.push({
        id: action.payload.id,
        name: action.payload.name,
        updatedAt: new Date().toISOString(),
        targetJob: action.payload.targetJob,
      });
    },
    removeResumeFromList: (state, action: PayloadAction<string>) => {
      state.resumeList = state.resumeList.filter(r => r.id !== action.payload);
    },
    updateResumeListItem: (state, action: PayloadAction<{ id: string; name?: string; targetJob?: string }>) => {
      const idx = state.resumeList.findIndex(r => r.id === action.payload.id);
      if (idx !== -1) {
        if (action.payload.name !== undefined) state.resumeList[idx].name = action.payload.name;
        if (action.payload.targetJob !== undefined) state.resumeList[idx].targetJob = action.payload.targetJob;
        state.resumeList[idx].updatedAt = new Date().toISOString();
      }
    },

    // ── Personal Info ────────────────────────────────────────────────────────
    updatePersonalInfo: (state, action: PayloadAction<Partial<PersonalInfo>>) => {
      state.data.personalInfo = { ...state.data.personalInfo, ...action.payload };
    },

    // ── Education ────────────────────────────────────────────────────────────
    addEducation: (state) => {
      state.data.sections.education.push({
        id: uuidv4(),
        institution: '',
        degree: '',
        field: '',
        startDate: '',
        endDate: '',
        gpa: '',
        coursework: '',
        honors: '',
      });
    },
    updateEducation: (state, action: PayloadAction<{ id: string; data: Partial<EducationEntry> }>) => {
      const idx = state.data.sections.education.findIndex(e => e.id === action.payload.id);
      if (idx !== -1) state.data.sections.education[idx] = { ...state.data.sections.education[idx], ...action.payload.data };
    },
    removeEducation: (state, action: PayloadAction<string>) => {
      state.data.sections.education = state.data.sections.education.filter(e => e.id !== action.payload);
    },

    // ── Experience ───────────────────────────────────────────────────────────
    addExperience: (state) => {
      state.data.sections.experience.push({
        id: uuidv4(),
        company: '',
        position: '',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        achievements: [''],
        technologies: '',
      });
    },
    updateExperience: (state, action: PayloadAction<{ id: string; data: Partial<ExperienceEntry> }>) => {
      const idx = state.data.sections.experience.findIndex(e => e.id === action.payload.id);
      if (idx !== -1) state.data.sections.experience[idx] = { ...state.data.sections.experience[idx], ...action.payload.data };
    },
    removeExperience: (state, action: PayloadAction<string>) => {
      state.data.sections.experience = state.data.sections.experience.filter(e => e.id !== action.payload);
    },

    // ── Projects ─────────────────────────────────────────────────────────────
    addProject: (state) => {
      state.data.sections.projects.push({
        id: uuidv4(),
        title: '',
        year: '',
        description: '',
        technologies: '',
        url: '',
      });
    },
    updateProject: (state, action: PayloadAction<{ id: string; data: Partial<ProjectEntry> }>) => {
      const idx = state.data.sections.projects.findIndex(p => p.id === action.payload.id);
      if (idx !== -1) state.data.sections.projects[idx] = { ...state.data.sections.projects[idx], ...action.payload.data };
    },
    removeProject: (state, action: PayloadAction<string>) => {
      state.data.sections.projects = state.data.sections.projects.filter(p => p.id !== action.payload);
    },

    // ── Skills ───────────────────────────────────────────────────────────────
    addSkill: (state) => {
      state.data.sections.skills.push({ id: uuidv4(), category: '', skills: '' });
    },
    updateSkill: (state, action: PayloadAction<{ id: string; data: Partial<SkillEntry> }>) => {
      const idx = state.data.sections.skills.findIndex(s => s.id === action.payload.id);
      if (idx !== -1) state.data.sections.skills[idx] = { ...state.data.sections.skills[idx], ...action.payload.data };
    },
    removeSkill: (state, action: PayloadAction<string>) => {
      state.data.sections.skills = state.data.sections.skills.filter(s => s.id !== action.payload);
    },

    // ── Awards ───────────────────────────────────────────────────────────────
    addAward: (state) => {
      state.data.sections.awards.push({ id: uuidv4(), title: '', issuer: '', date: '', description: '' });
    },
    updateAward: (state, action: PayloadAction<{ id: string; data: Partial<AwardEntry> }>) => {
      const idx = state.data.sections.awards.findIndex(a => a.id === action.payload.id);
      if (idx !== -1) state.data.sections.awards[idx] = { ...state.data.sections.awards[idx], ...action.payload.data };
    },
    removeAward: (state, action: PayloadAction<string>) => {
      state.data.sections.awards = state.data.sections.awards.filter(a => a.id !== action.payload);
    },

    // ── Certifications ────────────────────────────────────────────────────────
    addCertification: (state) => {
      state.data.sections.certifications.push({
        id: uuidv4(),
        name: '',
        issuer: '',
        date: '',
        expiryDate: '',
        credentialId: '',
      });
    },
    updateCertification: (state, action: PayloadAction<{ id: string; data: Partial<CertificationEntry> }>) => {
      const idx = state.data.sections.certifications.findIndex(c => c.id === action.payload.id);
      if (idx !== -1) state.data.sections.certifications[idx] = { ...state.data.sections.certifications[idx], ...action.payload.data };
    },
    removeCertification: (state, action: PayloadAction<string>) => {
      state.data.sections.certifications = state.data.sections.certifications.filter(c => c.id !== action.payload);
    },

    // ── Custom Sections ───────────────────────────────────────────────────────
    addCustomSection: (state, action: PayloadAction<string>) => {
      const id = uuidv4();
      const newSection: CustomSection = { id, name: action.payload, entries: [] };
      state.data.sections.custom.push(newSection);
      state.data.sectionOrder.push({ id, type: 'custom', name: action.payload, visible: true });
    },
    updateCustomSection: (state, action: PayloadAction<{ id: string; name: string }>) => {
      const idx = state.data.sections.custom.findIndex(s => s.id === action.payload.id);
      if (idx !== -1) state.data.sections.custom[idx].name = action.payload.name;
      const orderIdx = state.data.sectionOrder.findIndex(s => s.id === action.payload.id);
      if (orderIdx !== -1) state.data.sectionOrder[orderIdx].name = action.payload.name;
    },
    removeCustomSection: (state, action: PayloadAction<string>) => {
      state.data.sections.custom = state.data.sections.custom.filter(s => s.id !== action.payload);
      state.data.sectionOrder = state.data.sectionOrder.filter(s => s.id !== action.payload);
    },
    addCustomSectionEntry: (state, action: PayloadAction<string>) => {
      const idx = state.data.sections.custom.findIndex(s => s.id === action.payload);
      if (idx !== -1) state.data.sections.custom[idx].entries.push({ id: uuidv4(), title: '', content: '' });
    },
    updateCustomSectionEntry: (state, action: PayloadAction<{ sectionId: string; entryId: string; data: Partial<CustomSectionEntry> }>) => {
      const sIdx = state.data.sections.custom.findIndex(s => s.id === action.payload.sectionId);
      if (sIdx !== -1) {
        const eIdx = state.data.sections.custom[sIdx].entries.findIndex(e => e.id === action.payload.entryId);
        if (eIdx !== -1) state.data.sections.custom[sIdx].entries[eIdx] = { ...state.data.sections.custom[sIdx].entries[eIdx], ...action.payload.data };
      }
    },
    removeCustomSectionEntry: (state, action: PayloadAction<{ sectionId: string; entryId: string }>) => {
      const idx = state.data.sections.custom.findIndex(s => s.id === action.payload.sectionId);
      if (idx !== -1) {
        state.data.sections.custom[idx].entries = state.data.sections.custom[idx].entries.filter(e => e.id !== action.payload.entryId);
      }
    },

    // ── Section Order ─────────────────────────────────────────────────────────
    updateSectionOrder: (state, action: PayloadAction<SectionOrder[]>) => {
      state.data.sectionOrder = action.payload;
    },
    toggleSectionVisibility: (state, action: PayloadAction<string>) => {
      const idx = state.data.sectionOrder.findIndex(s => s.id === action.payload);
      if (idx !== -1) state.data.sectionOrder[idx].visible = !state.data.sectionOrder[idx].visible;
    },

    // ── UI State ─────────────────────────────────────────────────────────────
    setActiveSection: (state, action: PayloadAction<string>) => {
      state.activeSection = action.payload;
    },
    setShowTemplateGallery: (state, action: PayloadAction<boolean>) => {
      state.showTemplateGallery = action.payload;
    },
    setShowCoverLetterBuilder: (state, action: PayloadAction<boolean>) => {
      state.showCoverLetterBuilder = action.payload;
    },

    // ── Styling ───────────────────────────────────────────────────────────────
    updateStyling: (state, action: PayloadAction<Partial<ResumeData['styling']>>) => {
      state.data.styling = { ...state.data.styling, ...action.payload };
    },

    // ── Persistence ───────────────────────────────────────────────────────────
    setLastSaved: (state, action: PayloadAction<string>) => {
      state.lastSaved = action.payload;
    },
    loadResumeData: (state, action: PayloadAction<ResumeData>) => {
      const loaded = action.payload;
      state.data = {
        personalInfo: { ...initialResumeData.personalInfo, ...loaded.personalInfo },
        sections: {
          education: loaded.sections?.education || [],
          experience: loaded.sections?.experience || [],
          skills: loaded.sections?.skills || [],
          projects: loaded.sections?.projects || [],
          awards: loaded.sections?.awards || [],
          certifications: loaded.sections?.certifications || [],
          custom: loaded.sections?.custom || [],
        },
        sectionOrder: loaded.sectionOrder || initialResumeData.sectionOrder,
        styling: {
          ...initialResumeData.styling,
          ...loaded.styling,
          colors: { ...initialResumeData.styling.colors, ...loaded.styling?.colors },
        },
      };
    },

    // ── JD Matching ───────────────────────────────────────────────────────────
    setJobDescription: (state, action: PayloadAction<string>) => {
      state.jobDescription = action.payload;
    },
    setJDMatchResult: (state, action: PayloadAction<JDMatchResult | null>) => {
      state.jdMatchResult = action.payload;
    },
    insertMissingKeyword: (state, action: PayloadAction<string>) => {
      // Add missing keyword to the first skill entry or create a new one
      const kw = action.payload;
      if (state.data.sections.skills.length > 0) {
        const last = state.data.sections.skills[state.data.sections.skills.length - 1];
        const existing = last.skills ? last.skills + ', ' + kw : kw;
        state.data.sections.skills[state.data.sections.skills.length - 1].skills = existing;
      } else {
        state.data.sections.skills.push({ id: uuidv4(), category: 'Additional Skills', skills: kw });
      }
    },

    // ── Settings ─────────────────────────────────────────────────────────────
    updateSettings: (state, action: PayloadAction<Partial<AppSettings>>) => {
      state.settings = { ...state.settings, ...action.payload };
    },
    updateAISettings: (state, action: PayloadAction<Partial<AppSettings['ai']>>) => {
      state.settings.ai = { ...state.settings.ai, ...action.payload };
    },
    toggleDarkMode: (state) => {
      state.settings.darkMode = !state.settings.darkMode;
    },
  },
});

export const {
  setResumeList,
  setActiveResumeId,
  addResumeToList,
  removeResumeFromList,
  updateResumeListItem,
  updatePersonalInfo,
  addEducation, updateEducation, removeEducation,
  addExperience, updateExperience, removeExperience,
  addProject, updateProject, removeProject,
  addSkill, updateSkill, removeSkill,
  addAward, updateAward, removeAward,
  addCertification, updateCertification, removeCertification,
  addCustomSection, updateCustomSection, removeCustomSection,
  addCustomSectionEntry, updateCustomSectionEntry, removeCustomSectionEntry,
  updateSectionOrder, toggleSectionVisibility,
  setActiveSection,
  setShowTemplateGallery,
  setShowCoverLetterBuilder,
  updateStyling,
  setLastSaved,
  loadResumeData,
  setJobDescription,
  setJDMatchResult,
  insertMissingKeyword,
  updateSettings,
  updateAISettings,
  toggleDarkMode,
} = resumeSlice.actions;

export default resumeSlice.reducer;
