/**
 * Keyboard shortcuts handler component
 * Manages global keyboard event listeners for quick counter increments
 */
import React, { useEffect } from 'react';
import { useCounter } from './counterState';
import { Keyboard } from 'lucide-react';

const KeyboardShortcuts: React.FC = () => {
  const { increment } = useCounter();

  // Detect mobile device
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Only trigger if not typing in an input field
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Default demographic combinations
      const femaleYoungAdult = { gender: 'female' as const, ageGroup: 'young_adult' as const };
      const maleYoungAdult = { gender: 'male' as const, ageGroup: 'young_adult' as const };

      switch (event.key) {
        // Numbers 1-4: Female Young Adult
        case '1':
          event.preventDefault();
          increment('passingBy', femaleYoungAdult);
          break;
        case '2':
          event.preventDefault();
          increment('noticing', femaleYoungAdult);
          break;
        case '3':
          event.preventDefault();
          increment('consulting', femaleYoungAdult);
          break;
        case '4':
          event.preventDefault();
          increment('buying', femaleYoungAdult);
          break;
        
        // Letters Q/W/E/R: Male Young Adult
        case 'q':
        case 'Q':
          event.preventDefault();
          increment('passingBy', maleYoungAdult);
          break;
        case 'w':
        case 'W':
          event.preventDefault();
          increment('noticing', maleYoungAdult);
          break;
        case 'e':
        case 'E':
          event.preventDefault();
          increment('consulting', maleYoungAdult);
          break;
        case 'r':
        case 'R':
          event.preventDefault();
          increment('buying', maleYoungAdult);
          break;
        
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [increment]);

  // Hide keyboard shortcuts component completely on mobile
  if (isMobile) {
    return null;
  }

  return (
    <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Keyboard className="w-5 h-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-800">键盘快捷键</h3>
      </div>
      
      <div className="space-y-4">
        {/* Female Young Adult Shortcuts */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">女性青年快捷键</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-lg font-bold text-blue-600 mb-1">1</div>
              <div className="text-sm text-gray-600">路过</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-lg font-bold text-green-600 mb-1">2</div>
              <div className="text-sm text-gray-600">注意到</div>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <div className="text-lg font-bold text-yellow-600 mb-1">3</div>
              <div className="text-sm text-gray-600">咨询</div>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <div className="text-lg font-bold text-red-600 mb-1">4</div>
              <div className="text-sm text-gray-600">购买</div>
            </div>
          </div>
        </div>

        {/* Male Young Adult Shortcuts */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">男性青年快捷键</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-lg font-bold text-blue-600 mb-1">Q</div>
              <div className="text-sm text-gray-600">路过</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-lg font-bold text-green-600 mb-1">W</div>
              <div className="text-sm text-gray-600">注意到</div>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <div className="text-lg font-bold text-yellow-600 mb-1">E</div>
              <div className="text-sm text-gray-600">咨询</div>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <div className="text-lg font-bold text-red-600 mb-1">R</div>
              <div className="text-sm text-gray-600">购买</div>
            </div>
          </div>
        </div>
      </div>
      
      <p className="text-sm text-gray-600 mt-4 text-center">
        使用快捷键快速记录，或按住拖拽按钮选择其他人群组合
      </p>
    </div>
  );
};

export default KeyboardShortcuts;