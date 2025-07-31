/**
 * Compact default demographic selector
 * Allows users to set the default demographic for quick counting
 */
import React from 'react';
import { useCounter, type DemographicData } from './counterState';

const DefaultDemographicSelector: React.FC = () => {
  const { state, setDefaultDemographicIndex } = useCounter();

  // All 6 demographic combinations in logical order (same as DraggableCounterButton)
  const demographicOptions: DemographicData[] = [
    { gender: 'female', ageGroup: 'young' },      // 0 - 女青少年
    { gender: 'female', ageGroup: 'young_adult' }, // 1 - 女青年 (default)
    { gender: 'female', ageGroup: 'mature' },     // 2 - 女中老年
    { gender: 'male', ageGroup: 'young' },        // 3 - 男青少年
    { gender: 'male', ageGroup: 'young_adult' },  // 4 - 男青年
    { gender: 'male', ageGroup: 'mature' },       // 5 - 男中老年
  ];

  const getOptionText = (option: DemographicData): { gender: string; age: string } => {
    const gender = option.gender === 'male' ? '男' : '女';
    const age = option.ageGroup === 'young' ? '少' :  // Changed from '青少' to '少' for clarity
                option.ageGroup === 'young_adult' ? '青' : '老'; // Changed from '青年' to '青', '中老' to '老'
    return { gender, age };
  };

  const getOptionColors = (index: number): { bg: string; selectedBg: string; textColor: string } => {
    // Pink for female (0,1,2), Blue for male (3,4,5)
    const isFemale = index < 3;
    if (isFemale) {
      return {
        bg: 'bg-pink-100',
        selectedBg: 'bg-pink-500',
        textColor: 'text-pink-700'
      };
    } else {
      return {
        bg: 'bg-blue-100',
        selectedBg: 'bg-blue-500',
        textColor: 'text-blue-700'
      };
    }
  };

  return (
    <div className="mb-4 p-3 bg-gradient-to-r from-slate-50 to-gray-50 rounded-lg border">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">默认人群:</span>
          <span className="text-xs text-gray-500">点击设置快速计数默认选项</span>
        </div>
      </div>
      
      <div className="grid grid-cols-6 gap-1">
        {demographicOptions.map((option, index) => {
          const colors = getOptionColors(index);
          const isSelected = state.defaultDemographicIndex === index;
          const { gender, age } = getOptionText(option);
          
          return (
            <button
              key={index}
              onClick={() => setDefaultDemographicIndex(index)}
              className={`
                px-1 py-1 rounded-lg text-sm font-bold transition-all duration-200 text-center border h-14 flex flex-col items-center justify-center
                ${isSelected 
                  ? `${colors.selectedBg} text-white border-transparent shadow-md scale-105` 
                  : `${colors.bg} ${colors.textColor} border-gray-200 hover:border-gray-300 hover:scale-102`
                }
              `}
            >
              <div className="leading-none text-sm">{gender}</div>
              <div className="leading-none text-sm">{age}</div>
              {isSelected && (
                <div className="text-xs opacity-90 mt-0.5 leading-none">默认</div>
              )}
            </button>
          );
        })}
      </div>

      {/* Gender labels */}
      <div className="flex mt-2">
        <div className="flex-1 text-center">
          <div className="text-xs text-pink-400 font-medium">女性</div>
        </div>
        <div className="flex-1 text-center">
          <div className="text-xs text-blue-400 font-medium">男性</div>
        </div>
      </div>
    </div>
  );
};

export default DefaultDemographicSelector;