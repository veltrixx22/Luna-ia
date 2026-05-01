export type CycleRegularity = 'regular' | 'irregular' | 'unknown';
export type UsageGoal = 'track' | 'symptoms' | 'pregnancy' | 'avoid' | 'other';
export type FlowIntensity = 'none' | 'light' | 'medium' | 'heavy';
export type CrampsLevel = 'none' | 'light' | 'medium' | 'strong';
export type Mood = 'happy' | 'sad' | 'irritated' | 'anxious' | 'calm' | 'tired';
export type ThemePreference = 'system' | 'light' | 'dark';

export interface Profile {
  id: string;
  name?: string;
  averageCycleLength: number;
  averagePeriodDuration: number;
  cycleRegularity: CycleRegularity;
  usageGoal: UsageGoal;
  createdAt: string;
  updatedAt: string;
}

export interface Cycle {
  id: string;
  periodStartDate: string;
  periodEndDate?: string;
  cycleLength?: number;
  periodDuration?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SymptomLog {
  id: string;
  date: string;
  flowIntensity: FlowIntensity;
  crampsLevel: CrampsLevel;
  mood: Mood;
  symptoms: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AiMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

export interface Settings {
  id: string;
  theme: ThemePreference;
  onboardingCompleted: boolean;
  installPromptDismissed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LunaBackup {
  app: 'Luna AI';
  version: 1;
  exportedAt: string;
  profile?: Profile | null;
  cycles: Cycle[];
  symptomLogs: SymptomLog[];
  aiMessages: AiMessage[];
  settings?: Settings | null;
}

export interface Prediction {
  currentCycleDay: number;
  nextPeriodDate: string;
  daysUntilNextPeriod: number;
  ovulationDate: string;
  fertileWindowStart: string;
  fertileWindowEnd: string;
}
