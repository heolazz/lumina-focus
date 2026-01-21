export enum TimerMode {
  POMODORO = 'POMODORO',
  SHORT_BREAK = 'SHORT_BREAK',
  LONG_BREAK = 'LONG_BREAK'
}

export type TabView = 'TIMER' | 'TASKS' | 'STATS' | 'SETTINGS';

// UPDATE INI: Sesuaikan dengan kategori di TaskList.tsx
export type TaskTag = 'Work' | 'Study' | 'Personal' | 'Creative';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  estimatedPomos: number;
  completedPomos: number;
  tag: TaskTag; // Pastikan ini menggunakan tipe TaskTag di atas
}

export interface DailyStat {
  date: string; // YYYY-MM-DD
  minutes: number;
  sessions: number;
}

export interface AppSettings {
  durations: {
    [TimerMode.POMODORO]: number;
    [TimerMode.SHORT_BREAK]: number;
    [TimerMode.LONG_BREAK]: number;
  };
  autoStartBreaks: boolean;
  autoStartPomos: boolean;
  whiteNoise: 'NONE' | 'RAIN' | 'BROWN';
  volume: number;
}