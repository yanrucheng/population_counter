/**
 * Main counter application component
 * Manages the overall layout and coordinates between counter controls and statistics
 */
import React from 'react';
import { CounterProvider } from './counterState';
import CounterControls from './CounterControls';
import CounterStatistics from './CounterStatistics';
import KeyboardShortcuts from './KeyboardShortcuts';

const CounterApp: React.FC = () => {
  return (
    <CounterProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto">
          <header className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              人流量统计器
            </h1>
            <p className="text-gray-600">
              高效追踪客户互动和人流量
            </p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CounterControls />
            <CounterStatistics />
          </div>

          <KeyboardShortcuts />
        </div>
      </div>
    </CounterProvider>
  );
};

export default CounterApp;