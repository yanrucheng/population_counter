import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';

// Types
export interface DemographicData {
  gender: 'male' | 'female';
  ageGroup: 'young' | 'young_adult' | 'mature';
}

export interface CounterData {
  passingBy: number;
  noticing: number;
  consulting: number;
  buying: number;
}

export interface CounterState {
  counters: {
    total: CounterData;
    demographics: Record<keyof CounterData, DemographicData[]>;
  };
  detailedMode: boolean;
  currentDemographic: DemographicData;
  defaultDemographicIndex: number;
  sessionStartTime: number | null;
  lastActivityTime: number | null;
  history: Array<{
    timestamp: number;
    type: keyof CounterData;
    value: number;
    action: 'increment' | 'decrement';
    demographic?: DemographicData;
  }>;
}

// Action Types
type CounterAction =
  | { type: 'INCREMENT'; counterType: keyof CounterData; demographic?: DemographicData }
  | { type: 'DECREMENT'; counterType: keyof CounterData }
  | { type: 'RESET' }
  | { type: 'TOGGLE_DETAILED_MODE' }
  | { type: 'SET_CURRENT_DEMOGRAPHIC'; demographic: DemographicData }
  | { type: 'SET_DEFAULT_DEMOGRAPHIC_INDEX'; index: number }
  | { type: 'LOAD_FROM_STORAGE'; data: Partial<CounterState> }
  | { type: 'START_SESSION' };

// Constants
const STORAGE_KEY = 'population-counter-data';
const MAX_HISTORY_ENTRIES = 1000;

// Initial State Factory - creates fresh state
const createInitialState = (): CounterState => ({
  counters: {
    total: {
      passingBy: 0,
      noticing: 0,
      consulting: 0,
      buying: 0,
    },
    demographics: {
      passingBy: [],
      noticing: [],
      consulting: [],
      buying: [],
    },
  },
  detailedMode: false,
  currentDemographic: {
    gender: 'female',
    ageGroup: 'young_adult',
  },
  defaultDemographicIndex: 1,
  sessionStartTime: null,
  lastActivityTime: null,
  history: [],
});

// Utility Functions
const calculateRate = (numerator: number, denominator: number): number => {
  if (denominator === 0) return 0;
  return (numerator / denominator) * 100;
};

const limitArraySize = <T,>(array: T[], maxSize: number): T[] => {
  return array.slice(-maxSize);
};

// Counter Reducer
const counterReducer = (state: CounterState, action: CounterAction): CounterState => {
  const now = Date.now();

  switch (action.type) {
    case 'INCREMENT': {
      const incrementMap: Record<keyof CounterData, (keyof CounterData)[]> = {
        passingBy: ['passingBy'],
        noticing: ['passingBy', 'noticing'],
        consulting: ['passingBy', 'noticing', 'consulting'],
        buying: ['passingBy', 'noticing', 'consulting', 'buying'],
      };

      const countersToIncrement = incrementMap[action.counterType];
      const newCounters = { ...state.counters };
      const newDemographics = { ...newCounters.demographics };
      const demographic = action.demographic || state.currentDemographic;

      countersToIncrement.forEach((counterType) => {
        newCounters.total[counterType] += 1;
        newDemographics[counterType] = [
          ...newDemographics[counterType],
          demographic,
        ];
      });

      const newHistoryEntries = countersToIncrement.map((counterType) => ({
        timestamp: now,
        type: counterType,
        value: newCounters.total[counterType],
        action: 'increment' as const,
        demographic,
      }));

      return {
        ...state,
        counters: {
          total: newCounters.total,
          demographics: newDemographics,
        },
        sessionStartTime: state.sessionStartTime || now,
        lastActivityTime: now,
        history: limitArraySize([...state.history, ...newHistoryEntries], MAX_HISTORY_ENTRIES),
      };
    }

    case 'DECREMENT': {
      const newCounters = { ...state.counters };
      const currentCount = newCounters.total[action.counterType];

      if (currentCount > 0) {
        newCounters.total[action.counterType] -= 1;

        const currentDemographics = newCounters.demographics[action.counterType];
        if (currentDemographics.length > 0) {
          newCounters.demographics = {
            ...newCounters.demographics,
            [action.counterType]: currentDemographics.slice(0, -1),
          };
        }
      }

      const newHistoryEntry = {
        timestamp: now,
        type: action.counterType,
        value: Math.max(0, currentCount - 1),
        action: 'decrement' as const,
      };

      return {
        ...state,
        counters: newCounters,
        lastActivityTime: now,
        history: limitArraySize([...state.history, newHistoryEntry], MAX_HISTORY_ENTRIES),
      };
    }

    case 'RESET': {
      // Complete reset - return fresh state
      return createInitialState();
    }

    case 'TOGGLE_DETAILED_MODE': {
      return {
        ...state,
        detailedMode: !state.detailedMode,
      };
    }

    case 'SET_CURRENT_DEMOGRAPHIC': {
      return {
        ...state,
        currentDemographic: action.demographic,
      };
    }

    case 'SET_DEFAULT_DEMOGRAPHIC_INDEX': {
      return {
        ...state,
        defaultDemographicIndex: action.index,
      };
    }

    case 'LOAD_FROM_STORAGE': {
      const loadedData = action.data;
      
      // Handle backward compatibility
      let compatibleCounters = state.counters;
      
      if (loadedData.counters) {
        if (typeof loadedData.counters.passingBy === 'number') {
          // Old format: counters was just CounterData
          compatibleCounters = {
            total: loadedData.counters as CounterData,
            demographics: {
              passingBy: [],
              noticing: [],
              consulting: [],
              buying: [],
            },
          };
        } else {
          // New format
          compatibleCounters = loadedData.counters;
        }
      }

      return {
        ...createInitialState(),
        ...loadedData,
        counters: compatibleCounters,
      };
    }

    case 'START_SESSION': {
      return {
        ...state,
        sessionStartTime: now,
        lastActivityTime: now,
      };
    }

    default:
      return state;
  }
};

// Context
interface CounterContextType {
  state: CounterState;
  increment: (counterType: keyof CounterData, demographic?: DemographicData) => void;
  decrement: (counterType: keyof CounterData) => void;
  reset: () => void;
  toggleDetailedMode: () => void;
  setCurrentDemographic: (demographic: DemographicData) => void;
  setDefaultDemographicIndex: (index: number) => void;
  exportData: () => void;
  exportCSV: () => void;
}

const CounterContext = createContext<CounterContextType | undefined>(undefined);

// Storage Management
const saveToStorage = (state: CounterState): void => {
  try {
    const stateString = JSON.stringify(state);
    
    if (stateString.length > 5 * 1024 * 1024) { // 5MB limit
      console.warn('State too large for localStorage, truncating history...');
      const truncatedState = {
        ...state,
        history: limitArraySize(state.history, 100),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(truncatedState));
    } else {
      localStorage.setItem(STORAGE_KEY, stateString);
    }
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    
    // Fallback: try with minimal state
    try {
      const minimalState = {
        ...state,
        history: [],
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(minimalState));
    } catch (fallbackError) {
      console.error('Failed to save even minimal state:', fallbackError);
    }
  }
};

const loadFromStorage = (): Partial<CounterState> | null => {
  try {
    const savedData = localStorage.getItem(STORAGE_KEY);
    return savedData ? JSON.parse(savedData) : null;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return null;
  }
};

const clearStorage = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
};

// Provider Component
export const CounterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(counterReducer, createInitialState());

  // Load data on mount
  useEffect(() => {
    const savedData = loadFromStorage();
    if (savedData) {
      dispatch({ type: 'LOAD_FROM_STORAGE', data: savedData });
    }
    dispatch({ type: 'START_SESSION' });
  }, []);

  // Save data on changes
  useEffect(() => {
    saveToStorage(state);
  }, [state]);

  // Action creators
  const increment = useCallback((counterType: keyof CounterData, demographic?: DemographicData) => {
    dispatch({ type: 'INCREMENT', counterType, demographic });
  }, []);

  const decrement = useCallback((counterType: keyof CounterData) => {
    dispatch({ type: 'DECREMENT', counterType });
  }, []);

  const reset = useCallback(() => {
    clearStorage();
    dispatch({ type: 'RESET' });
  }, []);

  const toggleDetailedMode = useCallback(() => {
    dispatch({ type: 'TOGGLE_DETAILED_MODE' });
  }, []);

  const setCurrentDemographic = useCallback((demographic: DemographicData) => {
    dispatch({ type: 'SET_CURRENT_DEMOGRAPHIC', demographic });
  }, []);

  const setDefaultDemographicIndex = useCallback((index: number) => {
    dispatch({ type: 'SET_DEFAULT_DEMOGRAPHIC_INDEX', index });
  }, []);

  // Export functions
  const exportData = useCallback(() => {
    const now = Date.now();
    const sessionDuration = state.sessionStartTime ? now - state.sessionStartTime : 0;

    const demographicStats = Object.keys(state.counters.total).reduce((acc, key) => {
      const counterType = key as keyof CounterData;
      const demographics = state.counters.demographics[counterType];

      acc[counterType] = {
        total: state.counters.total[counterType],
        byGender: {
          male: demographics.filter(d => d.gender === 'male').length,
          female: demographics.filter(d => d.gender === 'female').length,
        },
        byAge: {
          young: demographics.filter(d => d.ageGroup === 'young').length,
          young_adult: demographics.filter(d => d.ageGroup === 'young_adult').length,
          mature: demographics.filter(d => d.ageGroup === 'mature').length,
        },
      };

      return acc;
    }, {} as Record<string, any>);

    const exportObject = {
      exportTimestamp: now,
      exportDate: new Date(now).toLocaleString('zh-CN'),
      sessionInfo: {
        startTime: state.sessionStartTime,
        startDate: state.sessionStartTime ? new Date(state.sessionStartTime).toLocaleString('zh-CN') : null,
        lastActivityTime: state.lastActivityTime,
        lastActivityDate: state.lastActivityTime ? new Date(state.lastActivityTime).toLocaleString('zh-CN') : null,
        sessionDuration,
        sessionDurationFormatted: `${Math.floor(sessionDuration / 60000)}分${Math.floor((sessionDuration % 60000) / 1000)}秒`,
        detailedModeUsed: state.detailedMode,
      },
      counters: state.counters.total,
      demographics: demographicStats,
      statistics: {
        noticeRate: calculateRate(state.counters.total.noticing, state.counters.total.passingBy),
        consultRate: calculateRate(state.counters.total.consulting, state.counters.total.noticing),
        buyRate: calculateRate(state.counters.total.buying, state.counters.total.consulting),
        overallConversion: calculateRate(state.counters.total.buying, state.counters.total.passingBy),
      },
    };

    const blob = new Blob([JSON.stringify(exportObject, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `人口统计导出_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [state]);

  const exportCSV = useCallback(() => {
    const headers = ['阶段', '总数', '男性', '女性', '年轻人', '青年', '成熟', '转化率'];
    const rows = Object.keys(state.counters.total).map((key) => {
      const counterType = key as keyof CounterData;
      const demographics = state.counters.demographics[counterType];
      const total = state.counters.total[counterType];
      
      const male = demographics.filter(d => d.gender === 'male').length;
      const female = demographics.filter(d => d.gender === 'female').length;
      const young = demographics.filter(d => d.ageGroup === 'young').length;
      const youngAdult = demographics.filter(d => d.ageGroup === 'young_adult').length;
      const mature = demographics.filter(d => d.ageGroup === 'mature').length;

      let conversionRate = '';
      if (counterType === 'noticing') {
        conversionRate = `${calculateRate(total, state.counters.total.passingBy).toFixed(1)}%`;
      } else if (counterType === 'consulting') {
        conversionRate = `${calculateRate(total, state.counters.total.noticing).toFixed(1)}%`;
      } else if (counterType === 'buying') {
        conversionRate = `${calculateRate(total, state.counters.total.consulting).toFixed(1)}%`;
      }

      return [
        counterType === 'passingBy' ? '路过' :
        counterType === 'noticing' ? '注意' :
        counterType === 'consulting' ? '咨询' : '购买',
        total,
        male,
        female,
        young,
        youngAdult,
        mature,
        conversionRate,
      ];
    });

    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `人口统计_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [state]);

  const contextValue: CounterContextType = {
    state,
    increment,
    decrement,
    reset,
    toggleDetailedMode,
    setCurrentDemographic,
    setDefaultDemographicIndex,
    exportData,
    exportCSV,
  };

  return <CounterContext.Provider value={contextValue}>{children}</CounterContext.Provider>;
};

// Custom hook for using counter context
export const useCounter = (): CounterContextType => {
  const context = useContext(CounterContext);
  if (!context) {
    throw new Error('useCounter must be used within CounterProvider');
  }
  return context;
};