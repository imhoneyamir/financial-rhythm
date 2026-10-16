export type IconType = 'netflix' | 'figma' | 'spotify' | 'dropbox' | 'notion' | 'custom' | 'apple' | 'google' | 'chatgpt';

export type CategoryType = 'All' | 'Entertainment' | 'Design Tool' | 'Cloud Storage' | 'Productivity' | 'AI & Tech' | 'Utilities';

export interface Subscription {
  id: string;
  name: string;
  category: CategoryType;
  cost: number;
  date: string;
  billingCycle: '/ month' | '/ year';
  iconType: IconType;
  color?: string;
  isPaused?: boolean;
  notes?: string;
}

export interface MonthlySpendPoint {
  month: string;
  year: string;
  amount: number;
  secondaryAmount: number;
  budget: number;
}

export interface AppSettings {
  userName: string;
  userEmail: string;
  currency: '$' | '€' | '£' | '¥';
  monthlyBudget: number;
  notificationsEnabled: boolean;
  alertDaysBefore: number;
}
