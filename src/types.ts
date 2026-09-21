export type QuestionType = 'single' | 'multi' | 'text';

export interface QuestionOption {
  label: string;
  tag?: string;
  description?: string;
  icon?: string;
}

export interface QuestionConfig {
  id: string; // e.g. 'q1' to 'q14'
  stepNumber: number;
  type: QuestionType;
  label: string;
  category: string;
  categoryTag?: string;
  subtitle?: string;
  options?: QuestionOption[];
  required: boolean;
  maxSelect?: number;
  allowOther?: boolean;
  otherKey?: 'q3Other' | 'q4Other' | 'q12Other';
  otherPlaceholder?: string;
  maxCharacters?: number;
}

export interface SurveyState {
  district: string;
  college: string;
  collegeIsCustom: boolean;
  customCollegeText: string;
  studyYear: string;
  answers: Record<string, string | string[]>;
  otherInputs: {
    q3Other: string;
    q4Other: string;
    q12Other: string;
  };
  q11Text: string;
  sessionId: string;
  startTime: number;
  honeypot: string;
}

export interface SubmissionPayload {
  timestamp: string;
  sessionId: string;
  district: string;
  college: string;
  collegeIsCustom: boolean;
  studyYear: string;
  q1: string;
  q2: string;
  q3: string;
  q4: string;
  q5: string;
  q6: string;
  q7: string;
  q8: string;
  q9: string;
  q10: string;
  q11Text: string;
  q12: string;
  q13: string;
  q14: string;
  q3Other: string;
  q4Other: string;
  q12Other: string;
  deviceType: 'mobile' | 'desktop';
  userAgent: string;
  honeypot: string;
}

export interface DistrictData {
  name: string;
  zone: 'Upper Assam' | 'Lower Assam' | 'Central & Hills' | 'Barak Valley';
  hq: string;
  totalCollegesSample: number;
}
