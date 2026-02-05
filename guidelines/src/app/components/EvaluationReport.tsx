import { Download, ArrowLeft, Star, TrendingUp, AlertCircle, Award, CheckCircle2 } from 'lucide-react';
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

// 六个维度的配置

// 六个维度的配置
const competencyDimensions = [
  { key: 'Professionalism', label: '专业素养', color: '#BFDFD2' },
  { key: 'Relational', label: '关系建立', color: '#51999F' },
  { key: 'Science', label: '科学知识', color: '#4198AC' },
  { key: 'Application', label: '应用能力', color: '#7BC0CD' },
  { key: 'Education', label: '教育指导', color: '#DBCB92' },
  { key: 'Systems', label: '系统思维', color: '#ECB66C' }
];

// 准备雷达图数据
const prepareRadarData = (scores: CompetencyScores) => {
  return competencyDimensions.map(dim => ({
    dimension: dim.label,
    fullMark: 10,
    [dim.key]: (scores[dim.key as keyof CompetencyScores] || 0),
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

  // 获取综合得分
  const overallScore = overallEvaluation?.structured_output?.综合得分 || 0;

  // 获取段位
  const getRank = (score: number) => {
    if (score < 4) return '新手上路';
    if (score <= 7) return '合格咨询师';
    return '资深专家';
  };

  // 获取段位颜色
  const getRankColor = (rank: string) => {
    if (rank === '新手上路') return 'from-amber-50 to-orange-50 border-amber-200 text-amber-700';
    if (rank === '合格咨询师') return 'from-blue-50 to-cyan-50 border-blue-200 text-blue-700';
    return 'from-purple-50 to-pink-50 border-purple-200 text-purple-700';
  };

  const handleExport = () => {
    // 导出数据
    const exportData = {
      scenario: scenarioName,
      overallScore: overallScore,
      conversationTurns: conversationTurns,
      competencyScores: competencyScores,
      conversation: [
        {
          role: "visitor",
          content: "（示例）我今天来是因为..."
        },
        {
          role: "counselor",
          content: "（示例）我理解你今天来..."
        },
        {
          role: "supervisor",
          content: "（示例）总体来说..."
        }
      ],
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

  const getScoreColor = (score: number) => {
    if (score >= 4) return 'text-green-600';
    if (score >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 4) return 'from-green-50 to-emerald-50 border-green-200';
    if (score >= 3) return 'from-yellow-50 to-amber-50 border-yellow-200';
    return 'from-red-50 to-orange-50 border-red-200';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBackToScenarios}
              className="text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回场景选择
            </Button>
            <div className="h-6 w-px bg-slate-200" />
            <h1 className="text-xl font-semibold text-slate-900">咨询评价报告</h1>
          </div>
          <div className="text-sm text-slate-500">{scenarioName}</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* 🏅 总体评分卡 */}
        <div className={`bg-gradient-to-br ${getRankColor(getRank(overallScore))} rounded-2xl p-8 border-2 mb-8 shadow-lg`}>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {/* 标题和段位 */}
              <div className="flex items-center gap-3 mb-6">
                <Award className="w-8 h-8" />
                <div>
                  <h2 className="text-2xl font-bold">综合得分</h2>
                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mt-1 ${getRankColor(getRank(overallScore))}`}>
                    {getRank(overallScore)}
                  </div>
                </div>
              </div>

              {/* 大数字分数 */}
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-7xl font-bold">
                  {overallScore.toFixed(1)}
                </span>
                <span className="text-2xl opacity-70">/ 10</span>
              </div>

              {/* 对话轮次 */}
              <p className="opacity-80 text-lg">
                本次练习共完成 <span className="font-semibold">{conversationTurns}</span> 轮对话
              </p>
            </div>

            {/* 导出按钮 */}
            <Button
              onClick={handleExport}
              size="lg"
              className="bg-slate-800 hover:bg-slate-900 text-white"
            >
              <Download className="w-5 h-5 mr-2" />
              导出报告
            </Button>
          </div>
        </div>

        {/* 总体简单点评 */}
        {overallEvaluation?.natural_language_feedback && (
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200 mb-8">
            <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Star className="w-6 h-6 text-amber-500" />
              总体评价
            </h3>
            <p className="text-slate-700 leading-relaxed text-lg">
              {overallEvaluation.natural_language_feedback}
            </p>
          </div>
        )}

        {/* 稳定优势和结构性短板 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* 稳定优势 */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 shadow-md border border-green-200">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
              <h3 className="text-xl font-bold text-green-900">稳定优势</h3>
            </div>
            <ul className="space-y-3">
              {overallEvaluation?.structured_output?.稳定优势?.slice(0, 3).map((strength, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-200 text-green-700 flex items-center justify-center text-sm font-semibold mt-0.5">
                    {index + 1}
                  </span>
                  <p className="text-green-800 leading-relaxed">{strength}</p>
                </li>
              )) || (
                <li className="text-green-700 italic">暂无数据</li>
              )}
            </ul>
          </div>

          {/* 结构性短板 */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 shadow-md border border-amber-200">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-amber-600" />
              <h3 className="text-xl font-bold text-amber-900">结构性短板</h3>
            </div>
            <ul className="space-y-3">
              {overallEvaluation?.structured_output?.结构性短板?.slice(0, 3).map((weakness, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-200 text-amber-700 flex items-center justify-center text-sm font-semibold mt-0.5">
                    {index + 1}
                  </span>
                  <p className="text-amber-800 leading-relaxed">{weakness}</p>
                </li>
              )) || (
                <li className="text-amber-700 italic">暂无数据</li>
              )}
            </ul>
          </div>
        </div>

        {/* Competency Radar Chart */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">胜任力评估</h2>
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Radar Chart */}
            <div className="flex-1">
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="dimension" tick={{ fill: '#64748b', fontSize: 12 }} />
                  <PolarRadiusAxis
                    angle={90}
                    domain={[0, 10]}
                    tick={{ fill: '#64748b', fontSize: 10 }}
                    tickCount={6}
                  />
                  <Radar
                    name="胜任力"
                    dataKey="value"
                    stroke="#4198AC"
                    fill="#4198AC"
                    fillOpacity={0.5}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
              <p className="text-xs text-slate-500 mt-3 text-center">
                注：零分并不意味着能力差，而是咨询过程中没有涉及到该维度
              </p>
            </div>

            {/* Legend */}
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">维度得分</h3>
              <div className="space-y-3">
                {competencyDimensions.map((dim) => {
                  const score = (competencyScores as CompetencyScores)[dim.key as keyof CompetencyScores] || 0;
                  return (
                    <div key={dim.key} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: dim.color }}
                        />
                        <span className="text-sm font-medium text-slate-900">{dim.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-lg font-bold ${getScoreColor(score / 2)}`}>
                          {score.toFixed(1)}
                        </span>
                        <span className="text-xs text-slate-500">/ 10</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mt-12">
          <Button
            onClick={onStartNew}
            size="lg"
            className="hover:opacity-90 px-8"
            style={{ backgroundColor: '#7BC0CD' }}
          >
            开始新的练习
          </Button>
          <Button
            onClick={onBackToScenarios}
            variant="outline"
            size="lg"
            className="px-8 border-slate-300 text-slate-700 hover:bg-slate-50"
          >
            选择其他场景
          </Button>
        </div>
      </div>
    </div>
  );
}
