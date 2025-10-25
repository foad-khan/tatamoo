export type AnswerValue =
  | 'Yes'
  | 'No'
  | 'Partially'
  | 'In Development'
  | 'Planned'
  | 'Occasionally'
  | 'In Progress'
  | 'Rarely'
  | 'Somewhat';

export type Answers = Record<number, AnswerValue>;

export type OrganizationType =
  | 'Large Hospital (>500 beds)'
  | 'Regional Medical Center (100-500 beds)'
  | 'Community Hospital (<100 beds)'
  | 'Specialty Clinic'
  | 'Research Institution'
  | 'Health Tech Provider';

export interface Question {
  id: number;
  text: string;
  category: Category;
  options: AnswerValue[];
  elaboration?: string;
}

export type Category =
  | 'Awareness & Pilots'
  | 'Infrastructure'
  | 'Data Access'
  | 'Governance'
  | 'Training'
  | 'Workflow Integration'
  | 'Scaling'
  | 'Compliance'
  | 'Innovation'
  | 'Ecosystem Impact';

export const CATEGORIES: Category[] = [
  'Awareness & Pilots',
  'Infrastructure',
  'Data Access',
  'Governance',
  'Training',
  'Workflow Integration',
  'Scaling',
  'Compliance',
  'Innovation',
  'Ecosystem Impact',
];

export interface CategoryScore {
  category: Category;
  score: number; // Score from 0 to 100
  summary: string;
}

export interface AssessmentResult {
  overallScore: number; // Score from 0 to 100
  summary: string;
  categoryScores: CategoryScore[];
  recommendations: {
    priority: 'High' | 'Medium' | 'Low';
    description: string;
  }[];
}