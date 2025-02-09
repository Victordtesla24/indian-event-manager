import { Category } from '../stores/eventStore';

export const EVENT_CATEGORIES: Record<string, Category> = {
  NATAK: 'natak',
  CINEMA: 'cinema',
  MUSICAL: 'musical',
  FOLK: 'folk',
  FUN: 'fun',
  EVENT: 'event',
} as const;

export const CATEGORY_LABELS: Record<Category, string> = {
  natak: 'Natak',
  cinema: 'Cinema',
  musical: 'Musical',
  folk: 'Folk',
  fun: 'Fun',
  event: 'Events',
};

export const CATEGORY_LIST: (Category | 'all')[] = ['all', ...Object.values(EVENT_CATEGORIES)];
