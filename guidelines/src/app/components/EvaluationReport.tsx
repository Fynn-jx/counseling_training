import { Download, ArrowLeft, Star, TrendingUp, AlertCircle } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

interface EvaluationReportProps {
  scenarioName: string;
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

// 静态数据，后续将从API获取
const staticReportData = {
  overallScore: 3.8,
  strengths: [
    "能够建立良好的咨询关系，来访者表现出一定的开放性",
    "提问技巧运用得当，能有效引导来访者表达",
    "对来访者的情绪变化保持敏感，适时给予回应"
  ],
  weaknesses: [
    "在处理来访者防御机制时可以更加耐心，避免过早深入",
    "可以更多地运用反映性倾听技术，加深情感连接",
    "需要注意咨询节奏，避免在来访者未准备好时推进过快"
  ],
  conversationTurns: 5,
  competencyScores: {
    Professionalism: 6.0,
    Relational: 5.5,
    Science: 0,
    Application: 7.0,
    Education: 0,
    Systems: 0
  } as CompetencyScores
};

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

export function EvaluationReport({ scenarioName, onStartNew, onBackToScenarios }: EvaluationReportProps) {
  const radarData = prepareRadarData(staticReportData.competencyScores);

  const handleExport = () => {
    // 静态导出示例
    const exportData = {
      scenario: scenarioName,
      overallScore: staticReportData.overallScore,
      conversationTurns: staticReportData.conversationTurns,
      competencyScores: staticReportData.competencyScores,
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
        {/* Overall Score Card */}
        <div className={`bg-gradient-to-br ${getScoreBgColor(staticReportData.overallScore)} rounded-2xl p-8 border-2 mb-8 shadow-lg`}>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <Star className="w-8 h-8 text-amber-500" />
                <h2 className="text-2xl font-bold text-slate-900">综合得分</h2>
              </div>
              <div className="flex items-baseline gap-4">
                <span className={`text-6xl font-bold ${getScoreColor(staticReportData.overallScore)}`}>
                  {staticReportData.overallScore}
                </span>
                <span className="text-xl text-slate-600">/ 5.0</span>
              </div>
              <p className="text-slate-700 mt-4 text-lg">
                本次练习共完成 <span className="font-semibold">{staticReportData.conversationTurns}</span> 轮对话
              </p>
            </div>
            <Button
              onClick={handleExport}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Download className="w-5 h-5 mr-2" />
              导出对话记录
            </Button>
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
                  const score = staticReportData.competencyScores[dim.key as keyof CompetencyScores] || 0;
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Strengths */}
          <div className="bg-white rounded-xl p-6 shadow-md border border-slate-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900">主要优点</h3>
            </div>
            <ul className="space-y-4">
              {staticReportData.strengths.map((strength, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-sm font-semibold mt-0.5">
                    {index + 1}
                  </span>
                  <p className="text-slate-700 leading-relaxed">{strength}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Weaknesses */}
          <div className="bg-white rounded-xl p-6 shadow-md border border-slate-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900">主要不足</h3>
            </div>
            <ul className="space-y-4">
              {staticReportData.weaknesses.map((weakness, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-sm font-semibold mt-0.5">
                    {index + 1}
                  </span>
                  <p className="text-slate-700 leading-relaxed">{weakness}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mt-12">
          <Button
            onClick={onStartNew}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 px-8"
          >
            开始新的练习
          </Button>
          <Button
            onClick={onBackToScenarios}
            variant="outline"
            size="lg"
            className="px-8"
          >
            选择其他场景
          </Button>
        </div>
      </div>
    </div>
  );
}
