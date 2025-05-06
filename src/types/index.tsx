export type HabitFrequency = 'daily' | 'weekly' | 'custom';

export const HabitCategory = {
  Health: 'Health',
  Mind: 'Mind',
  Study: 'Study',
  Work: 'Work',
  Social: 'Social',
  Other: 'Other'
} as const;

export type HabitCategory = typeof HabitCategory[keyof typeof HabitCategory];

export interface HabitCompletionData {
  completed: boolean;
  note?: string;
  timestamp: string;
}

export interface HabitStreak {
  current: number;
  longest: number;
  lastCompletedDate?: string;
}

export interface Habit {
  id: string;
  name: string;
  category: HabitCategory;
  frequency: {
    type: HabitFrequency;
    customDays?: number; // for "every X days"
    weeklyDays?: number[]; // 0-6 for weekly schedule (0 = Sunday)
  };
  completions: {
    [date: string]: HabitCompletionData;
  };
  streak: HabitStreak;
  createdAt: string;
}

export interface HabitTemplate {
  name: string;
  category: HabitCategory;
  frequency: {
    type: HabitFrequency;
    customDays?: number;
    weeklyDays?: number[];
  };
}

export const DEFAULT_TEMPLATES: HabitTemplate[] = [
  {
    name: "Drink 2L water",
    category: "Health",
    frequency: { type: "daily" }
  },
  {
    name: "Sleep by 11 PM",
    category: "Health",
    frequency: { type: "daily" }
  },
  {
    name: "Read 10 pages",
    category: "Mind",
    frequency: { type: "daily" }
  },
  {
    name: "Study 1 hour",
    category: "Study",
    frequency: { 
      type: "weekly",
      weeklyDays: [1, 3, 5] // Mon/Wed/Fri
    }
  }
] as const;
