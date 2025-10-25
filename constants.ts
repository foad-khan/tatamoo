import { Question, OrganizationType, Category } from './types';

export const ORGANIZATION_TYPES: OrganizationType[] = [
  'Large Hospital (>500 beds)',
  'Regional Medical Center (100-500 beds)',
  'Community Hospital (<100 beds)',
  'Specialty Clinic',
  'Research Institution',
  'Health Tech Provider',
];

export const CATEGORY_DESCRIPTIONS: Record<Category, string> = {
  'Awareness & Pilots': 'Assessing your organization\'s initial exposure to AI and early-stage experimentation.',
  'Infrastructure': 'Evaluating the readiness of your technical backbone, including hardware and cloud capabilities.',
  'Data Access': 'Gauging how effectively your organization can access, manage, and utilize data for AI initiatives.',
  'Governance': 'Reviewing the policies, ethics, and oversight mechanisms you have in place for AI.',
  'Training': 'Measuring the level of AI literacy and technical skills within your workforce.',
  'Workflow Integration': 'Analyzing how seamlessly AI tools are incorporated into daily clinical and operational workflows.',
  'Scaling': 'Determining your ability to expand successful AI pilots across multiple departments and functions.',
  'Compliance': 'Checking adherence to healthcare regulations like HIPAA and ensuring robust data security.',
  'Innovation': 'Assessing the culture of experimentation and the adoption of cutting-edge AI technologies.',
  'Ecosystem Impact': 'Evaluating how your AI initiatives affect patient outcomes, partnerships, and community health.',
};

export const QUESTIONS: Question[] = [
  {
    id: 1,
    text: 'Have you conducted any AI pilot projects in the last year?',
    category: 'Awareness & Pilots',
    options: ['Yes', 'No'],
    elaboration: 'A pilot project is a small-scale, preliminary study to evaluate the feasibility, cost, and potential challenges of a full-scale AI project before a major commitment.',
  },
  {
    id: 2,
    text: 'Do you have dedicated AI infrastructure (e.g., servers, cloud) in place?',
    category: 'Infrastructure',
    options: ['Yes', 'No'],
    elaboration: 'This includes specialized hardware like GPUs, scalable cloud computing resources (e.g., AWS, GCP, Azure), and data storage solutions designed for large datasets.',
  },
  {
    id: 3,
    text: 'Is your healthcare data organized and accessible for AI use?',
    category: 'Data Access',
    options: ['Yes', 'No', 'Partially'],
    elaboration: 'Consider if your data is centralized, de-identified where necessary, and available in standardized formats (e.g., FHIR, OMOP) for analytics teams.',
  },
  {
    id: 4,
    text: 'Do you have an AI governance policy or team?',
    category: 'Governance',
    options: ['Yes', 'No', 'In Development'],
    elaboration: 'This refers to a formal framework or committee responsible for the ethical, legal, and operational oversight of AI initiatives within your organization.',
  },
  {
    id: 5,
    text: 'Have staff received AI literacy or technical training?',
    category: 'Training',
    options: ['Yes', 'No', 'Planned'],
    elaboration: 'This includes any formal or informal training, from basic \'What is AI?\' workshops for clinicians to advanced technical training for IT staff.',
  },
  {
    id: 6,
    text: 'Is AI currently used in daily operations (e.g., diagnostics)?',
    category: 'Workflow Integration',
    options: ['Yes', 'No', 'Occasionally'],
    elaboration: 'Consider any AI tool that is part of a regular, established workflow, such as AI-assisted medical imaging analysis or administrative task automation.',
  },
  {
    id: 7,
    text: 'Have you scaled AI solutions across multiple departments?',
    category: 'Scaling',
    options: ['Yes', 'No', 'Partially'],
    elaboration: '\'Scaling\' means taking a successful AI pilot from one area (e.g., radiology) and successfully deploying it in other departments or for broader use cases.',
  },
  {
    id: 8,
    text: 'Are your AI systems compliant with HIPAA or similar regulations?',
    category: 'Compliance',
    options: ['Yes', 'No', 'In Progress'],
    elaboration: 'This includes ensuring patient data privacy, security of AI models, and auditable trails for AI-driven decisions in clinical settings.',
  },
  {
    id: 9,
    text: 'Do you experiment with new AI technologies (e.g., chatbots)?',
    category: 'Innovation',
    options: ['Yes', 'No', 'Rarely'],
    elaboration: 'This refers to exploring emerging AI technologies, even if they don\'t have an immediate project. Examples include generative AI for note-taking or patient-facing chatbots.',
  },
  {
    id: 10,
    text: 'Does your AI improve patient outcomes or partnerships?',
    category: 'Ecosystem Impact',
    options: ['Yes', 'No', 'Somewhat'],
    elaboration: 'Consider if you have measured the impact of your AI. This could be through improved diagnostic accuracy, reduced wait times, or new collaborations with tech partners.',
  },
];
