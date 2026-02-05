import { Download, ArrowLeft, Star, AlertCircle, Award, CheckCircle2 } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import type { OverallEvaluation } from '@/app/services/api';

interface EvaluationReportProps {
  scenarioName: string;
  overallEvaluation?: OverallEvaluation | null;
  competencyScores?: Record<string, number>;
  conversationTurns?: number;
  onStartNew: () => void;
  onBackToScenarios: () => void;
}

interface CompetencyScores {
  Professionalism?: number;
  Relational?: number;
  Science?: number;
  Application?: number;
  Education?: number;
  Systems?: number;
}

// 统一配色 - 青蓝色系
const colors = {
  primary: '#7BC0CD',
  dark: '#4198AC',
  light: '#E8F4F6',
  bg: '#F8FAFC'
};

const competencyDimensions = [
  { key: 'Professionalism', label: '专业素养' },
  { key: 'Relational', label: '关系建立' },
  { key: 'Science', label: '科学知识' },
  { key: 'Application', label: '应用能力' },
  { key: 'Education', label: '教育指导' },
  { key: 'Systems', label: '系统思维' }
];

const prepareRadarData = (scores: CompetencyScores) => {
  return competencyDimensions.map(dim => ({
    dimension: dim.label,
    fullMark: 10,
    value: scores[dim.key as keyof CompetencyScores] || 0
  }));
};

export function EvaluationReport({
  scenarioName,
  overallEvaluation,
  competencyScores = {},
  conversationTurns = 0,
  onStartNew,
  onBackToScenarios
}: EvaluationReportProps) {
  const radarData = prepareRadarData(competencyScores as CompetencyScores);

  const strengths = overallEvaluation?.structured_output?.稳定优势
    ? typeof overallEvaluation.structured_output.稳定优势 === 'string'
      ? overallEvaluation.structured_output.稳定优势.split(/\d+\.\s+/).filter(s => s.trim())
      : overallEvaluation.structured_output.稳定优势
    : [];

  const weaknesses = overallEvaluation?.structured_output?.结构性短板
    ? typeof overallEvaluation.structured_output.结构性短板 === 'string'
      ? overallEvaluation.structured_output.结构性短板.split(/\d+\.\s+/).filter(s => s.trim())
      : overallEvaluation.structured_output.结构性短板
    : [];

  const overallScore = overallEvaluation?.structured_output?.综合得分 || 0;

  const getRank = (score: number) => {
    if (score < 4) return '新手上路';
    if (score <= 7) return '合格咨询师';
    return '资深专家';
  };

  const handleExport = () => {
    const exportData = {
      scenario: scenarioName,
      overallScore: overallScore,
      conversationTurns: conversationTurns,
      competencyScores: competencyScores,
      timestamp: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `咨询报告_${scenarioName}_${new Date().toLocaleDateString('zh-CN')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.bg }}>
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBackToScenarios}
              className="text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              返回
            </Button>
            <div className="h-5 w-px bg-slate-200" />
            <h1 className="text-lg font-semibold text-slate-900">咨询评价报告</h1>
          </div>
          <div className="text-sm text-slate-500">{scenarioName}</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-6 space-y-5">
        {/* 总体评分卡 */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-6">
                {/* 分数 */}
                <div className="text-center">
                  <p className="text-sm text-slate-500 mb-1">综合得分</p>
                  <p className="text-4xl font-bold" style={{ color: colors.dark }}>
                    {overallScore.toFixed(1)}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">/ 10</p>
                </div>

                {/* 段位和轮次 */}
                <div className="flex-1 space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium" style={{ backgroundColor: colors.light }}>
                    <Award className="w-4 h-4" style={{ color: colors.dark }} />
                    <span style={{ color: colors.dark }}>{getRank(overallScore)}</span>
                  </div>
                  <p className="text-sm text-slate-600">
                    完成 <span className="font-semibold">{conversationTurns}</span> 轮对话
                  </p>
                </div>
              </div>
            </div>

            <Button
              onClick={handleExport}
              size="sm"
              className="bg-slate-700 hover:bg-slate-800 text-white"
            >
              <Download className="w-4 h-4 mr-1" />
              导出
            </Button>
          </div>
        </div>

        {/* 总体评价 */}
        {overallEvaluation?.natural_language_feedback && (
          <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
            <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <Star className="w-4 h-4" style={{ color: colors.dark }} />
              总体评价
            </h3>
            <p className="text-slate-700 leading-relaxed text-sm">
              {overallEvaluation.natural_language_feedback}
            </p>
          </div>
        )}

        {/* 优劣势 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 稳定优势 */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <h3 className="text-sm font-semibold text-slate-900">稳定优势</h3>
            </div>
            <ul className="space-y-2">
              {strengths.slice(0, 3).map((strength, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-semibold mt-0.5">
                    {index + 1}
                  </span>
                  <p className="text-sm text-slate-700 leading-relaxed">{strength}</p>
                </li>
              ))}
              {strengths.length === 0 && (
                <li className="text-sm text-slate-400 italic">暂无数据</li>
              )}
            </ul>
          </div>

          {/* 结构性短板 */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-semibold text-slate-900">待提升</h3>
            </div>
            <ul className="space-y-2">
              {weaknesses.slice(0, 3).map((weakness, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-xs font-semibold mt-0.5">
                    {index + 1}
                  </span>
                  <p className="text-sm text-slate-700 leading-relaxed">{weakness}</p>
                </li>
              ))}
              {weaknesses.length === 0 && (
                <li className="text-sm text-slate-400 italic">暂无数据</li>
              )}
            </ul>
          </div>
        </div>

        {/* 胜任力评估 */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
          <h2 className="text-sm font-semibold text-slate-900 mb-4">胜任力评估</h2>
          <div className="flex flex-col lg:flex-row gap-5">
            {/* 雷达图 */}
            <div className="flex-1">
              <ResponsiveContainer width="100%" height={280}>
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="dimension" tick={{ fill: '#64748b', fontSize: 11 }} />
                  <PolarRadiusAxis
                    angle={90}
                    domain={[0, 10]}
                    tick={{ fill: '#94a3b8', fontSize: 9 }}
                    tickCount={6}
                  />
                  <Radar
                    name="胜任力"
                    dataKey="value"
                    stroke={colors.dark}
                    fill={colors.primary}
                    fillOpacity={0.4}
                    strokeWidth={1.5}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* 维度得分 */}
            <div className="flex-1">
              <div className="grid grid-cols-2 gap-2">
                {competencyDimensions.map((dim) => {
                  const score = (competencyScores as CompetencyScores)[dim.key as keyof CompetencyScores] || 0;
                  return (
                    <div key={dim.key} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
                      <span className="text-xs font-medium text-slate-700">{dim.label}</span>
                      <span className="text-sm font-semibold" style={{ color: colors.dark }}>
                        {score.toFixed(1)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex justify-center gap-3 pt-2">
          <Button
            onClick={onStartNew}
            style={{ backgroundColor: colors.primary }}
            className="text-white hover:opacity-90 px-6"
          >
            开始新的练习
          </Button>
          <Button
            onClick={onBackToScenarios}
            variant="outline"
            className="px-6 border-slate-200 text-slate-600 hover:bg-slate-50"
          >
            选择其他场景
          </Button>
        </div>
      </div>
    </div>
  );
}
