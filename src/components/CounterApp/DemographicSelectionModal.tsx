/**
 * Modern demographic selection modal
 * Full-page modal maintaining original horizontal layout and drag interaction
 */
import React from 'react';
import { type DemographicData } from './counterState';

interface DemographicSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedOption: number | null;
  onSelectionUpdate: (index: number) => void;
  demographicOptions: DemographicData[];
  getOptionText: (option: DemographicData) => { gender: string; age: string };
  defaultDemographicIndex: number;
  isMobile: boolean;
}

const DemographicSelectionModal: React.FC<DemographicSelectionModalProps> = ({
  isOpen,
  onClose,
  selectedOption,
  onSelectionUpdate,
  demographicOptions,
  getOptionText,
  defaultDemographicIndex,
  isMobile
}) => {
  const getOptionColors = (index: number): { bg: string; selectedBg: string } => {
    const isFemale = index < 3;
    if (isFemale) {
      return {
        bg: 'bg-pink-400',
        selectedBg: 'bg-pink-600'
      };
    } else {
      return {
        bg: 'bg-blue-400', 
        selectedBg: 'bg-blue-600'
      };
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative h-full flex items-center justify-center p-4">
        {/* Central Selection Area - Maintaining original position and size */}
        <div 
          className="bg-white rounded-2xl shadow-2xl p-4 transition-all duration-300 transform"
          style={{
            width: isMobile ? 380 : 520,
            minHeight: isMobile ? 180 : 200
          }}
        >
          {/* Simple Title */}
          <div className="text-center mb-4">
            <h2 className={`font-bold text-gray-800 ${isMobile ? 'text-lg' : 'text-xl'}`}>
              选择人群
            </h2>
          </div>
          
          {/* Horizontal Selection Row - Exactly like original */}
          <div 
            className={`flex space-x-1 ${isMobile ? 'h-20' : 'h-24'}`}
            data-demographic-selector
          >
            {demographicOptions.map((option, index) => {
              const colors = getOptionColors(index);
              const isSelected = selectedOption === index;
              const isDefault = index === defaultDemographicIndex;
              const { gender, age } = getOptionText(option);
              
              return (
                <div
                  key={index}
                  className={`flex-1 ${isSelected ? colors.selectedBg : colors.bg} text-white rounded-lg font-bold transition-all duration-200 flex flex-col items-center justify-center text-center cursor-pointer ${
                    isSelected ? 'scale-105 shadow-lg transform' : 'hover:scale-102'
                  }`}
                  onClick={() => onSelectionUpdate(index)}
                >
                  <div className={`leading-none ${isMobile ? 'text-base' : 'text-lg'} font-black`}>
                    {gender}
                  </div>
                  <div className={`leading-none ${isMobile ? 'text-base' : 'text-lg'} font-black mt-0.5`}>
                    {age}
                  </div>
                  {isDefault && (
                    <div className="text-xs opacity-75 mt-1 leading-none">默认</div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Gender Labels - Maintained exactly */}
          <div className="flex mt-3 px-1">
            <div className="flex-1 text-center">
              <div className="text-xs text-pink-400 font-medium">女性</div>
            </div>
            <div className="flex-1 text-center">
              <div className="text-xs text-blue-400 font-medium">男性</div>
            </div>
          </div>

          {/* Simple instruction */}
          <div className="text-center mt-4">
            <div className="text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-lg">
              {isMobile ? '点击选择或滑动到选项' : '移动鼠标或点击选择人群'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemographicSelectionModal;
