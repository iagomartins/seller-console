// Local storage utilities with error handling

export const storage = {
  get: <T>(key: string, defaultValue: T | null = null): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.warn(`Error reading from localStorage key "${key}":`, error);
      return defaultValue;
    }
  },

  set: (key: string, value: unknown): boolean => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn(`Error writing to localStorage key "${key}":`, error);
      return false;
    }
  },

  remove: (key: string): boolean => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
      return false;
    }
  },

  clear: (): boolean => {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.warn("Error clearing localStorage:", error);
      return false;
    }
  },
};

// Storage keys
export const STORAGE_KEYS = {
  SEARCH_QUERY: "mini-seller-search-query",
  FILTERS: "mini-seller-filters",
  SORT_OPTIONS: "mini-seller-sort-options",
  SELECTED_LEAD: "mini-seller-selected-lead",
} as const;
