import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { initialSubscriptions, defaultSettings } from '../data/mockData';
import type { Subscription, AppSettings } from '../types';

const LOCAL_STORAGE_KEY = 'financial_rhythm_subscriptions_v1';
const LOCAL_SETTINGS_KEY = 'financial_rhythm_settings_v1';

// Helpers for localStorage fallback
const getLocalSubscriptions = (): Subscription[] => {
  const data = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!data) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialSubscriptions));
    return initialSubscriptions;
  }
  try {
    return JSON.parse(data);
  } catch {
    return initialSubscriptions;
  }
};

const saveLocalSubscriptions = (subs: Subscription[]) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(subs));
};

export const subscriptionService = {
  // Fetch all subscriptions
  async getSubscriptions(): Promise<Subscription[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase fetch error, using local fallback:', error.message);
        return getLocalSubscriptions();
      }

      if (data && data.length > 0) {
        return data.map((item: any) => ({
          id: item.id,
          name: item.name,
          category: item.category,
          cost: parseFloat(item.cost),
          date: item.next_billing_date,
          billingCycle: item.billing_cycle === 'yearly' ? '/ year' : '/ month',
          iconType: item.icon_type || 'custom',
          isPaused: item.is_paused || false,
          notes: item.notes || '',
        }));
      }
    }
    return getLocalSubscriptions();
  },

  // Add new subscription
  async addSubscription(newSub: Omit<Subscription, 'id'>): Promise<Subscription> {
    const item: Subscription = {
      ...newSub,
      id: Date.now().toString(),
    };

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('subscriptions')
        .insert([
          {
            name: newSub.name,
            category: newSub.category,
            cost: newSub.cost,
            next_billing_date: newSub.date,
            billing_cycle: newSub.billingCycle === '/ year' ? 'yearly' : 'monthly',
            icon_type: newSub.iconType,
            is_paused: newSub.isPaused || false,
            notes: newSub.notes || '',
          },
        ])
        .select()
        .single();

      if (!error && data) {
        item.id = data.id;
      }
    }

    const current = getLocalSubscriptions();
    saveLocalSubscriptions([item, ...current]);
    return item;
  },

  // Toggle pause/active
  async togglePause(id: string, isPaused: boolean): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      await supabase
        .from('subscriptions')
        .update({ is_paused: isPaused })
        .eq('id', id);
    }
    const current = getLocalSubscriptions();
    const updated = current.map(s => s.id === id ? { ...s, isPaused } : s);
    saveLocalSubscriptions(updated);
  },

  // Delete subscription
  async deleteSubscription(id: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      await supabase
        .from('subscriptions')
        .delete()
        .eq('id', id);
    }
    const current = getLocalSubscriptions();
    const updated = current.filter(s => s.id !== id);
    saveLocalSubscriptions(updated);
  },

  // Settings
  getSettings(): AppSettings {
    const data = localStorage.getItem(LOCAL_SETTINGS_KEY);
    if (!data) return defaultSettings;
    try {
      return JSON.parse(data);
    } catch {
      return defaultSettings;
    }
  },

  saveSettings(settings: AppSettings): void {
    localStorage.setItem(LOCAL_SETTINGS_KEY, JSON.stringify(settings));
  },
};
