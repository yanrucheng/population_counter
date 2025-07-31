/**
 * Statistics display component
 * Shows conversion rates and summary statistics based on counter data
 */
import React from 'react';
import { useCounter } from './counterState';
import { TrendingUp, Percent, Clock, Timer, Users, BarChart3 } from 'lucide-react';

const CounterStatistics: React.FC = () => {
  const { state } = useCounter();
  const { counters } = state;

  // Add defensive checks for data structure
  const safeCounters = counters?.total || {
    passingBy: 0,
    noticing: 0,
    consulting: 0,
    buying: 0,
  };

  const calculateRate = (numerator: number, denominator: number): string => {
    if (denominator === 0) return '0.0';
    return ((numerator / denominator) * 100).toFixed(1);
  };

  const formatDuration = (duration: number): string => {
    const hours = Math.floor(duration / 3600000);
    const minutes = Math.floor((duration % 3600000) / 60000);
    const seconds = Math.floor((duration % 60000) / 1000);
    
    if (hours > 0) {
      return `${hours}小时${minutes}分`;
    } else if (minutes > 0) {
      return `${minutes}分${seconds}秒`;
    } else {
      return `${seconds}秒`;
    }
  };

  const sessionDuration = state.sessionStartTime ? Date.now() - state.sessionStartTime : 0;

  const statistics = [
    {
      label: '注意率',
      value: `${calculateRate(safeCounters.noticing, safeCounters.passingBy)}%`,
      description: '注意到的人数 vs 路过的人数',
      color: 'text-green-600',
    },
    {
      label: '咨询率',
      value: `${calculateRate(safeCounters.consulting, safeCounters.noticing)}%`,
      description: '咨询的人数 vs 注意到的人数',
      color: 'text-yellow-600',
    },
    {
      label: '转化率',
      value: `${calculateRate(safeCounters.buying, safeCounters.consulting)}%`,
      description: '购买的人数 vs 咨询的人数',
      color: 'text-red-600',
    },
    {
      label: '总体转化率',
      value: `${calculateRate(safeCounters.buying, safeCounters.passingBy)}%`,
      description: '购买的人数 vs 路过的人数',
      color: 'text-blue-600',
    },
  ];

  const totalInteractions = Object.values(safeCounters).reduce((sum, count) => sum + count, 0);

  // Calculate demographic statistics for the most active counter type
  const getDemographicStats = (counterType: keyof typeof safeCounters) => {
    const demographics = counters?.demographics?.[counterType] || [];
    if (demographics.length === 0) return null;

    const genderCounts = {
      male: demographics.filter(d => d.gender === 'male').length,
      female: demographics.filter(d => d.gender === 'female').length,
    };

    const ageCounts = {
      young: demographics.filter(d => d.ageGroup === 'young').length,
      young_adult: demographics.filter(d => d.ageGroup === 'young_adult').length,
      mature: demographics.filter(d => d.ageGroup === 'mature').length,
    };

    return { genderCounts, ageCounts, total: demographics.length };
  };

  const passingByDemographics = getDemographicStats('passingBy');
  const hasDemographicData = passingByDemographics && passingByDemographics.total > 0;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">统计与洞察</h2>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-600">总互动数</span>
          </div>
          <div className="text-2xl font-bold text-blue-800">{totalInteractions}</div>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Timer className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-600">会话时长</span>
          </div>
          <div className="text-lg font-bold text-green-800">
            {state.sessionStartTime ? formatDuration(sessionDuration) : '未开始'}
          </div>
        </div>
      </div>

      {/* Demographic Statistics - Always show if data exists */}
      {hasDemographicData && (
        <div className="bg-purple-50 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2 mb-3">
            <BarChart3 className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-800">人口统计 (路过人群)</span>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {/* Gender Distribution */}
            <div>
              <h4 className="text-xs font-medium text-gray-600 mb-2">性别分布</h4>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">👨 男性:</span>
                  <span className="font-medium">{passingByDemographics?.genderCounts.male || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">👩 女性:</span>
                  <span className="font-medium">{passingByDemographics?.genderCounts.female || 0}</span>
                </div>
              </div>
            </div>

            {/* Age Distribution */}
            <div>
              <h4 className="text-xs font-medium text-gray-600 mb-2">年龄分布</h4>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">🧒 青少年及儿童:</span>
                  <span className="font-medium">{passingByDemographics?.ageCounts.young || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">👨‍💼 青年:</span>
                  <span className="font-medium">{passingByDemographics?.ageCounts.young_adult || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">👴 中老年:</span>
                  <span className="font-medium">{passingByDemographics?.ageCounts.mature || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Mode: Show additional analysis */}
      {state.detailedMode && (
        <>
          {/* Timing Information */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2 mb-3">
              <Clock className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-800">时间信息</span>
            </div>
            <div className="grid grid-cols-1 gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">开始时间:</span>
                <span className="font-medium">
                  {state.sessionStartTime 
                    ? new Date(state.sessionStartTime).toLocaleTimeString('zh-CN')
                    : '未开始'
                  }
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">最后活动:</span>
                <span className="font-medium">
                  {state.lastActivityTime 
                    ? new Date(state.lastActivityTime).toLocaleTimeString('zh-CN')
                    : '无活动'
                  }
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">操作次数:</span>
                <span className="font-medium">{state.history?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">模式:</span>
                <span className="font-medium">{state.detailedMode ? '详细界面' : '简化界面'}</span>
              </div>
            </div>
          </div>

          {/* Conversion Rates - Detailed mode only */}
          <div className="space-y-4 mb-6">
            {statistics.map((stat, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Percent className="w-4 h-4 text-gray-500" />
                    <span className="font-medium text-gray-800">{stat.label}</span>
                  </div>
                  <span className={`text-xl font-bold ${stat.color}`}>
                    {stat.value}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{stat.description}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Current Counts Summary - Always show */}
      <div className="pt-6 border-t">
        <h3 className="font-medium text-gray-800 mb-3">当前计数汇总</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">路过:</span>
            <span className="font-medium">{safeCounters.passingBy}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">注意到:</span>
            <span className="font-medium">{safeCounters.noticing}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">咨询:</span>
            <span className="font-medium">{safeCounters.consulting}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">购买:</span>
            <span className="font-medium">{safeCounters.buying}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CounterStatistics;