/**
 * Demographic selection component for detailed counting mode
 * Allows users to select gender and age group for tracking
 */
import React from 'react';
import { useCounter, type DemographicData } from './counterState';
import { User, Users2 } from 'lucide-react';

const DemographicSelector: React.FC = () => {
  const { state, setCurrentDemographic } = useCounter();

  const genderOptions = [
    { value: 'male' as const, label: '男性', icon: '👨' },
    { value: 'female' as const, label: '女性', icon: '👩' },
  ];

  const ageGroupOptions = [
    { value: 'young' as const, label: '青少年及儿童', subLabel: '0-19岁', icon: '🧒' },
    { value: 'young_adult' as const, label: '青年', subLabel: '20-35岁', icon: '👨‍💼' },
    { value: 'mature' as const, label: '中老年', subLabel: '36+岁', icon: '👴' },
  ];

  const handleGenderChange = (gender: DemographicData['gender']) => {
    setCurrentDemographic({
      ...state.currentDemographic,
      gender,
    });
  };

  const handleAgeGroupChange = (ageGroup: DemographicData['ageGroup']) => {
    setCurrentDemographic({
      ...state.currentDemographic,
      ageGroup,
    });
  };

  return (
    <div className="border rounded-lg p-4 bg-gradient-to-r from-blue-50 to-indigo-50">
      <div className="flex items-center space-x-2 mb-4">
        <Users2 className="w-5 h-5 text-indigo-600" />
        <h3 className="font-medium text-gray-800">人口统计选择</h3>
      </div>

      {/* Gender Selection */}
      <div className="mb-4">
        <label className="text-sm font-medium text-gray-700 mb-2 block">性别</label>
        <div className="grid grid-cols-2 gap-2">
          {genderOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleGenderChange(option.value)}
              className={`p-3 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-2 ${
                state.currentDemographic.gender === option.value
                  ? 'bg-indigo-500 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border'
              }`}
            >
              <span className="text-lg">{option.icon}</span>
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Age Group Selection */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">年龄组</label>
        <div className="grid grid-cols-3 gap-2">
          {ageGroupOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleAgeGroupChange(option.value)}
              className={`p-3 rounded-lg text-sm font-medium transition-colors duration-200 ${
                state.currentDemographic.ageGroup === option.value
                  ? 'bg-indigo-500 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border'
              }`}
            >
              <div className="flex flex-col items-center">
                <div className="flex items-center space-x-1 mb-1">
                  <span className="text-lg">{option.icon}</span>
                  <span className="text-xs">{option.label}</span>
                </div>
                <div className="text-xs opacity-75">{option.subLabel}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Current Selection Display */}
      <div className="mt-4 p-3 bg-white rounded-lg border">
        <div className="flex items-center space-x-2">
          <User className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">当前选择:</span>
          <span className="text-sm font-medium text-gray-800">
            {genderOptions.find(g => g.value === state.currentDemographic.gender)?.label} - {' '}
            {ageGroupOptions.find(a => a.value === state.currentDemographic.ageGroup)?.label}
          </span>
        </div>
      </div>
    </div>
  );
};

export default DemographicSelector;