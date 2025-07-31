/**
 * Counter control buttons component
 * Renders individual counter buttons with increment/decrement functionality
 */
import React from 'react';
import { useCounter } from './counterState';
import { Users, Eye, MessageCircle, ShoppingCart, RotateCcw, Download, FileSpreadsheet, Settings, Zap } from 'lucide-react';
import DraggableCounterButton from './DraggableCounterButton';
import DefaultDemographicSelector from './DefaultDemographicSelector';

const CounterControls: React.FC = () => {
  const { state, decrement, reset, exportData, exportCSV, toggleDetailedMode } = useCounter();

  // Detect mobile device
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;

  const counterConfigs = [
    {
      key: 'passingBy' as const,
      label: '路过',
      icon: Users,
      color: 'bg-blue-500 hover:bg-blue-600',
      shortcut: '1',
    },
    {
      key: 'noticing' as const,
      label: '注意到店铺',
      icon: Eye,
      color: 'bg-green-500 hover:bg-green-600',
      shortcut: '2',
    },
    {
      key: 'consulting' as const,
      label: '咨询',
      icon: MessageCircle,
      color: 'bg-yellow-500 hover:bg-yellow-600',
      shortcut: '3',
    },
    {
      key: 'buying' as const,
      label: '购买',
      icon: ShoppingCart,
      color: 'bg-red-500 hover:bg-red-600',
      shortcut: '4',
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">快速计数</h2>
        <button
          onClick={toggleDetailedMode}
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
            state.detailedMode 
              ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {state.detailedMode ? <Zap className="w-4 h-4" /> : <Settings className="w-4 h-4" />}
          <span className="hidden sm:inline">
            {state.detailedMode ? '切换到简化界面' : '切换到详细界面'}
          </span>
          <span className="sm:hidden">
            {state.detailedMode ? '简化' : '详细'}
          </span>
        </button>
      </div>

      {/* Description moved to top */}
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
        <h3 className="font-medium text-gray-800 mb-2">快速输入说明</h3>
        <div className="space-y-1 text-sm text-gray-600">
          <div>• <strong>按住按钮</strong>：显示人群选择界面</div>
          <div>• <strong>单击按钮</strong>：使用默认人群</div>
          {!isMobile && (
            <>
              <div>• <strong>数字键 1-4</strong>：女性青年快捷键</div>
              <div>• <strong>字母键 Q/W/E/R</strong>：男性青年快捷键</div>
            </>
          )}
        </div>
      </div>

      {/* Default Demographic Selector moved next to counter buttons */}
      <DefaultDemographicSelector />
      
      {/* Reduced vertical spacing for mobile - responsive spacing */}
      <div className={`${isMobile ? 'space-y-2' : 'space-y-4'}`}>
        {counterConfigs.map((config) => {
          const count = state.counters.total[config.key];
          
          return (
            <DraggableCounterButton
              key={config.key}
              counterKey={config.key}
              label={config.label}
              icon={config.icon}
              color={config.color}
              shortcut={config.shortcut}
              count={count}
              onDecrement={() => decrement(config.key)}
            />
          );
        })}
      </div>

      {/* Export and Reset Section */}
      <div className="mt-6 space-y-3">
        <div className={`flex ${isMobile ? 'flex-col space-y-2' : 'space-x-2'}`}>
          <button
            onClick={exportData}
            className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>导出 JSON</span>
          </button>
          <button
            onClick={exportCSV}
            className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>导出 CSV</span>
          </button>
        </div>
        
        <button
          onClick={reset}
          className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>重置所有计数器</span>
        </button>
      </div>
    </div>
  );
};

export default CounterControls;