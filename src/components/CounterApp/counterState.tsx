/**
 * State management for counter data
 * Handles counter values, localStorage persistence, and provides counter operations
 */
import React, { createContext, useContext, useReducer, useEffect } from 'react';

export interface CounterData {
  passingBy: number;
  noticing: number;
  consulting: number;
  buying: number;
}

export interface DemographicData {
  gender: 'male' | 'female';
  ageGroup: 'young' | 'young_adult' | 'mature';
}

export interface DetailedCounterData {
  total: CounterData;
  demographics: {
    [key in keyof CounterData]: Array<DemographicData>;
  };
}

interface CounterState {
  counters: DetailedCounterData;
  sessionStartTime: number | null;
  lastActivityTime: number | null;
  detailedMode: boolean;
  currentDemographic: DemographicData;
  defaultDemographicIndex: number; // 0-5 for the 6 demographic combinations
  history: Array<{
    timestamp: number;
    type: keyof CounterData;
    value: number;
    action: 'increment' | 'decrement';
    demographic?: DemographicData;
  }>;
}

type CounterAction = 
  | { type: 'INCREMENT'; counterType: keyof CounterData; demographic?: DemographicData }
  | { type: 'DECREMENT'; counterType: keyof CounterData }
  | { type: 'TOGGLE_DETAILED_MODE' }
  | { type: 'SET_CURRENT_DEMOGRAPHIC'; demographic: DemographicData }
  | { type: 'SET_DEFAULT_DEMOGRAPHIC_INDEX'; index: number }
  | { type: 'RESET' }
  | { type: 'LOAD_FROM_STORAGE'; data: CounterState }
  | { type: 'START_SESSION' };

const initialState: CounterState = {
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
    }
  },
  sessionStartTime: null,
  lastActivityTime: null,
  detailedMode: false,
  currentDemographic: {
    gender: 'female',
    ageGroup: 'young_adult'
  },
  defaultDemographicIndex: 1, // Default to female young_adult (index 1)
  history: [],
};

const STORAGE_KEY = 'population-flow-counter';

function counterReducer(state: CounterState, action: CounterAction): CounterState {
  const now = Date.now();
  
  switch (action.type) {
    case 'START_SESSION':
      return {
        ...state,
        sessionStartTime: state.sessionStartTime || now,
        lastActivityTime: now,
      };

    case 'TOGGLE_DETAILED_MODE':
      return {
        ...state,
        detailedMode: !state.detailedMode,
      };

    case 'SET_CURRENT_DEMOGRAPHIC':
      return {
        ...state,
        currentDemographic: action.demographic,
      };
      
    case 'SET_DEFAULT_DEMOGRAPHIC_INDEX':
      return {
        ...state,
        defaultDemographicIndex: action.index,
      };

    case 'INCREMENT':
      const incrementMap = {
        passingBy: ['passingBy'],
        noticing: ['passingBy', 'noticing'],
        consulting: ['passingBy', 'noticing', 'consulting'],
        buying: ['passingBy', 'noticing', 'consulting', 'buying']
      };
      
      const countersToIncrement = incrementMap[action.counterType];
      const newCounters = { ...state.counters };
      
      // Always use demographic data for tracking - both modes now record demographics
      const useDemographic = action.demographic || state.currentDemographic;
      
      // Deep copy the demographics to avoid mutation
      const newDemographics = { ...newCounters.demographics };
      
      // Increment total counters
      countersToIncrement.forEach(counterType => {
        newCounters.total[counterType as keyof CounterData] = newCounters.total[counterType as keyof CounterData] + 1;
        
        // Always add demographic data with proper immutable update
        newDemographics[counterType as keyof CounterData] = [
          ...newDemographics[counterType as keyof CounterData],
          useDemographic
        ];
      });
      
      newCounters.demographics = newDemographics;
      
      const newHistoryEntries = countersToIncrement.map(counterType => ({
        timestamp: now,
        type: counterType as keyof CounterData,
        value: newCounters.total[counterType as keyof CounterData],
        action: 'increment' as const,
        demographic: useDemographic,
      }));
      
      return {
        ...state,
        counters: newCounters,
        sessionStartTime: state.sessionStartTime || now,
        lastActivityTime: now,
        history: [
          ...state.history,
          ...newHistoryEntries,
        ],
      };
    
    case 'DECREMENT':
      const newDecrementCounters = { ...state.counters };
      const currentCount = newDecrementCounters.total[action.counterType];
      
      if (currentCount > 0) {
        newDecrementCounters.total[action.counterType] = currentCount - 1;
        
        // Properly handle demographic array removal with immutable update
        const currentDemographics = newDecrementCounters.demographics[action.counterType];
        if (currentDemographics.length > 0) {
          // Create new array without the last element (immutable)
          newDecrementCounters.demographics = {
            ...newDecrementCounters.demographics,
            [action.counterType]: currentDemographics.slice(0, -1)
          };
        }
      }
      
      return {
        ...state,
        counters: newDecrementCounters,
        lastActivityTime: now,
        history: [
          ...state.history,
          {
            timestamp: now,
            type: action.counterType,
            value: Math.max(0, currentCount - 1),
            action: 'decrement',
          },
        ],
      };
    
    case 'RESET':
      // Create a completely fresh state to ensure clean reset
      const resetState = {
        ...initialState,
        detailedMode: state.detailedMode,
        currentDemographic: state.currentDemographic,
        defaultDemographicIndex: state.defaultDemographicIndex,
        sessionStartTime: null, // Reset session time as well
        lastActivityTime: null,
      };
      
      return resetState;
    
    case 'LOAD_FROM_STORAGE':
      // Enhanced backward compatibility handling
      const loadedData = action.data;
      
      // Handle old data format (before demographic tracking)
      let compatibleCounters;
      if (loadedData.counters && typeof loadedData.counters.passingBy === 'number') {
        // Old format: counters was just CounterData
        compatibleCounters = {
          total: loadedData.counters,
          demographics: {
            passingBy: [],
            noticing: [],
            consulting: [],
            buying: [],
          }
        };
      } else {
        // New format or fallback
        compatibleCounters = loadedData.counters || {
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
          }
        };
      }

      return {
        ...loadedData,
        counters: compatibleCounters,
        detailedMode: loadedData.detailedMode || false,
        currentDemographic: loadedData.currentDemographic || {
          gender: 'female',
          ageGroup: 'young_adult'
        },
        defaultDemographicIndex: loadedData.defaultDemographicIndex || 1,
        history: loadedData.history || [],
      };

    default:
      return state;
  }
}

interface CounterContextType {
  state: CounterState;
  increment: (counterType: keyof CounterData, demographic?: DemographicData) => void;
  decrement: (counterType: keyof CounterData) => void;
  toggleDetailedMode: () => void;
  setCurrentDemographic: (demographic: DemographicData) => void;
  setDefaultDemographicIndex: (index: number) => void;
  reset: () => void;
  exportData: () => void;
  exportCSV: () => void;
}

const CounterContext = createContext<CounterContextType | undefined>(undefined);

export const CounterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(counterReducer, initialState);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        dispatch({ type: 'LOAD_FROM_STORAGE', data: parsedData });
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
    dispatch({ type: 'START_SESSION' });
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const increment = (counterType: keyof CounterData, demographic?: DemographicData) => {
    dispatch({ type: 'INCREMENT', counterType, demographic });
  };

  const decrement = (counterType: keyof CounterData) => {
    dispatch({ type: 'DECREMENT', counterType });
  };

  const toggleDetailedMode = () => {
    dispatch({ type: 'TOGGLE_DETAILED_MODE' });
  };

  const setCurrentDemographic = (demographic: DemographicData) => {
    dispatch({ type: 'SET_CURRENT_DEMOGRAPHIC', demographic });
  };

  const setDefaultDemographicIndex = (index: number) => {
    dispatch({ type: 'SET_DEFAULT_DEMOGRAPHIC_INDEX', index });
  };

  const reset = () => {
    dispatch({ type: 'RESET' });
  };

  const calculateRate = (numerator: number, denominator: number): number => {
    if (denominator === 0) return 0;
    return (numerator / denominator) * 100;
  };

  const exportData = () => {
    const now = Date.now();
    const sessionDuration = state.sessionStartTime ? now - state.sessionStartTime : 0;
    
    // Calculate demographic statistics
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
        }
      };
      
      return acc;
    }, {} as any);
    
    const exportObject = {
      exportTimestamp: now,
      exportDate: new Date(now).toLocaleString('zh-CN'),
      sessionInfo: {
        startTime: state.sessionStartTime,
        startDate: state.sessionStartTime ? new Date(state.sessionStartTime).toLocaleString('zh-CN') : null,
        lastActivityTime: state.lastActivityTime,
        lastActivityDate: state.lastActivityTime ? new Date(state.lastActivityTime).toLocaleString('zh-CN') : null,
        sessionDuration: sessionDuration,
        sessionDurationFormatted: `${Math.floor(sessionDuration / 60000)}分${Math.floor((sessionDuration % 60000) / 1000)}秒`,
        detailedModeUsed: state.detailedMode,
      },
      counters: state.counters.total,
      demographics: demographicStats,
      statistics: {
        noticeRate: calculateRate(state.counters.total.noticing, state.counters.total.passingBy),
        consultationRate: calculateRate(state.counters.total.consulting, state.counters.total.noticing),
        conversionRate: calculateRate(state.counters.total.buying, state.counters.total.consulting),
        overallConversion: calculateRate(state.counters.total.buying, state.counters.total.passingBy),
        totalInteractions: Object.values(state.counters.total).reduce((sum, count) => sum + count, 0),
      },
      history: state.history.map(item => ({
        ...item,
        date: new Date(item.timestamp).toLocaleString('zh-CN'),
      })),
      rawData: state,
    };

    const blob = new Blob([JSON.stringify(exportObject, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `人流量统计_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportCSV = () => {
    const headers = [
      '时间戳',
      '日期时间',
      '操作类型',
      '计数器类型',
      '计数值',
      '操作',
      '性别',
      '年龄组'
    ];

    const rows = state.history.map(item => [
      item.timestamp,
      new Date(item.timestamp).toLocaleString('zh-CN'),
      item.type,
      item.type === 'passingBy' ? '路过' : 
       item.type === 'noticing' ? '注意到店铺' : 
       item.type === 'consulting' ? '咨询' : '购买',
      item.value,
      item.action === 'increment' ? '增加' : '减少',
      item.demographic?.gender === 'male' ? '男性' :
       item.demographic?.gender === 'female' ? '女性' : '未记录',
      item.demographic?.ageGroup === 'young' ? '青少年及儿童(0-19)' :
       item.demographic?.ageGroup === 'young_adult' ? '青年(20-35)' :
       item.demographic?.ageGroup === 'mature' ? '中老年(36+)' : '未记录'
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `人流量统计_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <CounterContext.Provider value={{ 
      state, 
      increment, 
      decrement, 
      toggleDetailedMode, 
      setCurrentDemographic, 
      setDefaultDemographicIndex,
      reset, 
      exportData, 
      exportCSV 
    }}>
      {children}
    </CounterContext.Provider>
  );
};

export const useCounter = () => {
  const context = useContext(CounterContext);
  if (context === undefined) {
    throw new Error('useCounter must be used within a CounterProvider');
  }
  return context;
};