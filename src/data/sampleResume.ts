import { v4 as uuidv4 } from 'uuid';
import { ResumeData } from '../types/resume';

/** Demo resume shown when the user chooses “Load sample” on first run. */
export const sampleResumeData: ResumeData = {
  personalInfo: {
    name: 'Ashish Pratap Singh',
    email: 'ashish.singh@email.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    github: 'github.com/ashishps1',
    linkedin: 'linkedin.com/in/ashishps1',
    website: '',
    summary:
      'Senior Software Engineer with 7+ years of experience building scalable distributed systems and data platforms at Adobe, Amazon, and Morgan Stanley. Proven track record of reducing operational costs by $50K+ annually and improving system reliability through automation and cloud-native solutions.',
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
        coursework:
          'Data Structures & Algorithms, Operating Systems, Computer Networks, Machine Learning, Database Systems, Distributed Computing',
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
        technologies:
          'Java, Python, TypeScript, AWS Step Functions, AWS Batch, Lambda, DynamoDB, LightGBM, TensorFlow',
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
        description:
          'Desktop application for English word lookup with efficient Trie-based search, spelling correction via edit distance algorithm, and automated web-scraping for data collection.',
        technologies: 'Python, BeautifulSoup',
        url: '',
      },
      {
        id: uuidv4(),
        title: 'Alternative Routes in Road Networks',
        year: '2016',
        description:
          "Applied Dijkstra's shortest path algorithm with real-time traffic simulation, implementing collision avoidance via dynamic speed adjustment using C++ and OpenGL.",
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
        description:
          'Mentoring 50+ students and working professionals on problem solving, coding, and system design.',
      },
      {
        id: uuidv4(),
        title: 'Data Engineering Nanodegree',
        issuer: 'Udacity',
        date: '2020',
        description:
          'Completed comprehensive program covering ETL pipelines, data warehousing, and big data technologies.',
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

/** Empty structured resume with the same section order and default styling. */
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
