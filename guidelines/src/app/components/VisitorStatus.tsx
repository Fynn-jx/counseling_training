import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Activity, Brain, Gauge, TrendingUp } from 'lucide-react';
import type { ChartData } from '@/app/services/api';

interface VisitorStatusProps {
  chartData: ChartData | null;
}

const stageColors = {
  '愤怒': '#ef4444',
  '怀疑': '#f97316', 
  '压抑': '#eab308',
  '开放': '#22c55e',
  '平和': '#3b82f6',
  '欣喜': '#a855f7',
  '低迷': '#64748b',
  '失眠': '#8b5cf6',
  '焦虑': '#f59e0b',
  '悲伤': '#3b82f6',
  '平静': '#10b981'
};

const generateColorForLabel = (label: string): string => {
  if (stageColors[label as keyof typeof stageColors]) {
    return stageColors[label as keyof typeof stageColors];
  }
  
  const hash = label.split('').reduce((acc, char) => {
    return acc + char.charCodeAt(0);
  }, 0);
  
  const hue = hash % 360;
  const saturation = 70;
  const lightness = 50;
  
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

export function VisitorStatus({ chartData }: VisitorStatusProps) {
  if (!chartData) {
    return (
      <div className="h-full bg-white border-r border-slate-200 flex flex-col overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900 mb-1">
            来访者状态监控
          </h2>
          <p className="text-sm text-slate-500">
            实时追踪来访者心理状态
          </p>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Activity className="w-16 h-16 mx-auto mb-4 text-slate-300" />
            <p className="text-slate-400 text-sm">
              开始对话后将显示来访者状态
            </p>
          </div>
        </div>
      </div>
    );
  }

  const emotionTimelineData = chartData?.conversation_stage_curve?.map(item => ({
    turn: `第${item.dialogue_count}轮`,
    value: item.stage
  })) || [];

  const stressData = chartData?.stress_curve?.map(item => ({
    turn: `第${item.turn}轮`,
    value: item.value
  })) || [];

  const emotionIntensityData = chartData?.emotion_curve?.map(item => ({
    turn: `第${item.turn}轮`,
    value: item.value
  })) || [];

  const emotionTimeline = chartData?.session_emotion_timeline || [];
  const currentEmotionLabel = emotionTimeline.length > 0
    ? emotionTimeline[emotionTimeline.length - 1].label
    : '未知';

  const allEmotionLabels = Array.from(new Set(emotionTimeline.map(item => item.label)));
  const currentStages = allEmotionLabels.map(stage => ({
    name: stage,
    active: stage === currentEmotionLabel,
    color: generateColorForLabel(stage)
  }));
  return (
    <div className="h-full bg-white border-r border-slate-200 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900 mb-1">
          来访者状态监控
        </h2>
        <p className="text-sm text-slate-500">
          实时追踪来访者心理状态
        </p>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* 情绪流变 Timeline */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-600" />
            <h3 className="font-medium text-slate-900">情绪流变 (Timeline)</h3>
          </div>
          <div className="bg-slate-50 rounded-xl p-4">
            <ResponsiveContainer width="100%" height={120}>
              <AreaChart data={emotionTimelineData}>
                <defs>
                  <linearGradient id="colorEmotion" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="turn" 
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  axisLine={{ stroke: '#cbd5e1' }}
                />
                <YAxis 
                  domain={[1, 10]} 
                  ticks={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  axisLine={{ stroke: '#cbd5e1' }}
                  label={{ value: '阶段', angle: -90, position: 'insideLeft', style: { fontSize: 11, fill: '#64748b' } }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  fill="url(#colorEmotion)" 
                />
              </AreaChart>
            </ResponsiveContainer>
            <p className="text-xs text-slate-500 mt-2">阶段 (1-10)</p>
          </div>
        </div>

        {/* 对话阶段 */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-purple-600" />
            <h3 className="font-medium text-slate-900">对话阶段 (Timeline)</h3>
          </div>
          <div className="bg-slate-50 rounded-xl p-4">
            {/* Legend */}
            <div className="flex flex-wrap gap-x-3 gap-y-2 mb-3">
              {currentStages.map((stage) => (
                <div key={stage.name} className="flex items-center gap-1.5">
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: stage.color }}
                  />
                  <span className="text-xs text-slate-600">{stage.name}</span>
                </div>
              ))}
            </div>
            
            {/* Timeline Bar */}
            <div className="relative h-10 rounded-full overflow-hidden flex">
              {currentStages.map((stage, index) => {
                const color = stage.color;
                const nextColor = index < currentStages.length - 1 
                  ? currentStages[index + 1].color
                  : color;
                
                return (
                  <div
                    key={stage.name}
                    className="flex-1 relative"
                    style={{
                      background: index < currentStages.length - 1
                        ? `linear-gradient(to right, ${color} 0%, ${color} 70%, ${nextColor} 100%)`
                        : color
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* 压力水平 */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Gauge className="w-4 h-4 text-red-600" />
            <h3 className="font-medium text-slate-900">压力水平</h3>
          </div>
          <div className="bg-slate-50 rounded-xl p-4">
            <ResponsiveContainer width="100%" height={120}>
              <AreaChart data={stressData}>
                <defs>
                  <linearGradient id="colorStress" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="turn" 
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  axisLine={{ stroke: '#cbd5e1' }}
                />
                <YAxis 
                  domain={[0, 1]} 
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  axisLine={{ stroke: '#cbd5e1' }}
                  label={{ value: '压力值', angle: -90, position: 'insideLeft', style: { fontSize: 11, fill: '#64748b' } }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  fill="url(#colorStress)" 
                />
              </AreaChart>
            </ResponsiveContainer>
            <p className="text-xs text-slate-500 mt-2">压力值 (0-1)</p>
          </div>
        </div>

        {/* 情绪强度 */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-amber-600" />
            <h3 className="font-medium text-slate-900">情绪强度</h3>
          </div>
          <div className="bg-slate-50 rounded-xl p-4">
            <ResponsiveContainer width="100%" height={120}>
              <AreaChart data={emotionIntensityData}>
                <defs>
                  <linearGradient id="colorIntensity" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="turn" 
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  axisLine={{ stroke: '#cbd5e1' }}
                />
                <YAxis 
                  domain={[-1, 1]} 
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  axisLine={{ stroke: '#cbd5e1' }}
                  label={{ value: '情绪度', angle: -90, position: 'insideLeft', style: { fontSize: 11, fill: '#64748b' } }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#f59e0b" 
                  strokeWidth={2}
                  fill="url(#colorIntensity)" 
                />
              </AreaChart>
            </ResponsiveContainer>
            <p className="text-xs text-slate-500 mt-2">情绪强度 (-1～1)</p>
          </div>
        </div>
      </div>
    </div>
  );
}