/**
 * Draggable counter button with demographic selection
 * Supports fast demographic input via drag gestures
 */
import React, { useState, useRef, useCallback } from 'react';
import { useCounter, type DemographicData } from './counterState';
import DemographicSelectionModal from './DemographicSelectionModal';

interface DraggableCounterButtonProps {
  counterKey: 'passingBy' | 'noticing' | 'consulting' | 'buying';
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  shortcut: string;
  count: number;
  onDecrement: () => void;
}

const DraggableCounterButton: React.FC<DraggableCounterButtonProps> = ({
  counterKey,
  label,
  icon: Icon,
  color,
  shortcut,
  count,
  onDecrement
}) => {
  const { state, increment } = useCounter();
  const [showSelection, setShowSelection] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isPressed = useRef(false);
  const hasTouch = useRef(false);
  const lastEventTime = useRef(0);

  // Detect mobile device
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;

  // All 6 demographic combinations in logical order
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
    const age = option.ageGroup === 'young' ? '少' :  
                option.ageGroup === 'young_adult' ? '青' : '老'; 
    return { gender, age };
  };

  // Get the currently selected default demographic
  const getDefaultOption = (): DemographicData => {
    return demographicOptions[state.defaultDemographicIndex] || demographicOptions[1];
  };

  const getDefaultOptionText = (): string => {
    const { gender, age } = getOptionText(getDefaultOption());
    return `${gender}${age}`;
  };

  // Get coordinates from either mouse or touch event
  const getEventCoordinates = (e: MouseEvent | TouchEvent) => {
    if ('touches' in e && e.touches.length > 0) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    } else if ('clientX' in e) {
      return { x: e.clientX, y: e.clientY };
    }
    return { x: 0, y: 0 };
  };

  const handleStart = useCallback((e: React.MouseEvent | React.TouchEvent, eventType: 'mouse' | 'touch') => {
    const now = Date.now();
    
    // Prevent duplicate events within 100ms
    if (now - lastEventTime.current < 100) {
      return;
    }
    
    // If we've detected touch, ignore subsequent mouse events
    if (eventType === 'touch') {
      hasTouch.current = true;
    } else if (hasTouch.current && eventType === 'mouse') {
      return;
    }
    
    e.preventDefault();
    lastEventTime.current = now;
    isPressed.current = true;
    
    // Show selection interface immediately on press
    setShowSelection(true);
    setSelectedOption(state.defaultDemographicIndex); // Use configurable default
  }, [state.defaultDemographicIndex]);

  const handleMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isPressed.current || !showSelection) return;

    const coords = getEventCoordinates(e);
    
    // Updated selector for the new modal structure
    const overlayElement = document.querySelector('[data-demographic-selector]');
    if (overlayElement) {
      const rect = overlayElement.getBoundingClientRect();
      const relativeX = coords.x - rect.left;
      const relativeY = coords.y - rect.top;
      
      // Check if cursor/finger is within the overlay bounds
      if (relativeX >= 0 && relativeX <= rect.width && relativeY >= 0 && relativeY <= rect.height) {
        // Divide the width into 6 equal sections for horizontal selection
        const sectionWidth = rect.width / 6;
        const selectedIndex = Math.floor(relativeX / sectionWidth);
        
        // Ensure selection is within bounds
        setSelectedOption(Math.max(0, Math.min(5, selectedIndex)));
      }
    }
  }, [showSelection]);

  const handleEnd = useCallback(() => {
    if (isPressed.current && showSelection) {
      const optionToUse = selectedOption !== null ? selectedOption : state.defaultDemographicIndex;
      increment(counterKey, demographicOptions[optionToUse]);
      
      // Clean up state
      setShowSelection(false);
      setSelectedOption(null);
      isPressed.current = false;
      
      // Reset touch detection after a delay
      setTimeout(() => {
        hasTouch.current = false;
      }, 500);
    }
  }, [showSelection, selectedOption, increment, counterKey, state.defaultDemographicIndex]);

  const handleSelectionUpdate = useCallback((index: number) => {
    setSelectedOption(index);
  }, []);

  const handleModalClose = useCallback(() => {
    setShowSelection(false);
    setSelectedOption(null);
    isPressed.current = false;
    setTimeout(() => {
      hasTouch.current = false;
    }, 500);
  }, []);

  // Touch event handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    handleStart(e, 'touch');
  }, [handleStart]);

  // Mouse event handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!hasTouch.current) {
      handleStart(e, 'mouse');
    }
  }, [handleStart]);

  React.useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => handleMove(e);
    const handleGlobalMouseUp = () => handleEnd();
    const handleGlobalTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      handleMove(e);
    };
    const handleGlobalTouchEnd = () => handleEnd();

    if (isPressed.current) {
      if (!hasTouch.current) {
        document.addEventListener('mousemove', handleGlobalMouseMove);
        document.addEventListener('mouseup', handleGlobalMouseUp);
      }
      
      document.addEventListener('touchmove', handleGlobalTouchMove, { passive: false });
      document.addEventListener('touchend', handleGlobalTouchEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.removeEventListener('touchmove', handleGlobalTouchMove);
      document.removeEventListener('touchend', handleGlobalTouchEnd);
    };
  }, [handleMove, handleEnd]);

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      setShowSelection(false);
      setSelectedOption(null);
      isPressed.current = false;
      hasTouch.current = false;
    };
  }, []);

  return (
    <>
      <div className="relative">
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <Icon className="w-5 h-5 text-gray-600" />
              <div className="min-w-0 flex-1">
                <span className="font-medium text-gray-800 block truncate">{label}</span>
                {!isMobile && (
                  <span className="text-xs text-gray-500">
                    按住=选择人群 | 默认: {getDefaultOptionText()}
                  </span>
                )}
              </div>
              {!isMobile && (
                <span className="text-xs bg-gray-100 px-2 py-1 rounded whitespace-nowrap">
                  按键: {shortcut}
                </span>
              )}
            </div>
            <div className="text-2xl font-bold text-gray-800 ml-2">
              {count}
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button
              ref={buttonRef}
              onTouchStart={handleTouchStart}
              onMouseDown={handleMouseDown}
              className={`flex-1 ${color} text-white px-4 py-3 rounded-lg font-medium transition-colors duration-200 shadow-md hover:shadow-lg active:scale-95 select-none cursor-pointer touch-manipulation`}
              style={{ 
                userSelect: 'none',
                WebkitUserSelect: 'none',
                touchAction: 'none'
              }}
            >
              +1
            </button>
            <button
              onClick={onDecrement}
              className="px-4 py-3 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg font-medium transition-colors duration-200"
              disabled={count === 0}
            >
              -1
            </button>
          </div>
        </div>
      </div>

      {/* Modern Full-Page Demographics Selection Modal */}
      <DemographicSelectionModal
        isOpen={showSelection}
        onClose={handleModalClose}
        selectedOption={selectedOption}
        onSelectionUpdate={handleSelectionUpdate}
        demographicOptions={demographicOptions}
        getOptionText={getOptionText}
        defaultDemographicIndex={state.defaultDemographicIndex}
        isMobile={isMobile}
      />
    </>
  );
};

export default DraggableCounterButton;