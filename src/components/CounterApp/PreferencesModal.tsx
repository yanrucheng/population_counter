/**
 * Preferences modal component
 * Allows users to configure counter behavior preferences
 */
import React from 'react';
import { Settings, X, Link2, Unlink2 } from 'lucide-react';
import { useCounter } from './counterState';

interface PreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PreferencesModal: React.FC<PreferencesModalProps> = ({ isOpen, onClose }) => {
  const { state, dispatch } = useCounter();

  if (!isOpen) return null;

  const { toggleCorrelateCounters } = useCounter();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            偏好设置
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Counter Correlation Setting */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-medium text-gray-800 mb-1">计数器关联</h3>
                <p className="text-sm text-gray-600">
                  {state.preferences.correlateCounters 
                    ? '当前：计数器关联模式（购买包含咨询、注意、路过）' 
                    : '当前：计数器独立模式（每个计数器单独计数）'}
                </p>
              </div>
              <button
                onClick={toggleCorrelateCounters}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  state.preferences.correlateCounters 
                    ? 'bg-indigo-600' 
                    : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    state.preferences.correlateCounters 
                      ? 'translate-x-6' 
                      : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex items-center text-sm">
                {state.preferences.correlateCounters ? (
                  <Link2 className="w-4 h-4 mr-2 text-indigo-600" />
                ) : (
                  <Unlink2 className="w-4 h-4 mr-2 text-gray-500" />
                )}
                <span className={state.preferences.correlateCounters ? 'text-indigo-600' : 'text-gray-500'}>
                  {state.preferences.correlateCounters ? '已启用关联' : '已禁用关联'}
                </span>
              </div>
              
              <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
                <strong>关联模式：</strong>点击"购买"会同时增加路过、注意、咨询、购买四个计数器
                <br />
                <strong>独立模式：</strong>每个计数器只增加对应的数值
              </div>
            </div>
          </div>

          {/* Additional settings can be added here */}
          <div className="text-center">
            <button
              onClick={onClose}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              完成
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreferencesModal;