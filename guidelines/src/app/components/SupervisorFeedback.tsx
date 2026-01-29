import { AlertCircle, CheckCircle, Lightbulb, TrendingUp, Clock } from 'lucide-react';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import type { SupervisorEvaluation } from '@/app/services/api';

interface SupervisorFeedbackProps {
  evaluation: SupervisorEvaluation | null;
}

export function SupervisorFeedback({ evaluation }: SupervisorFeedbackProps) {
  if (!evaluation) {
    return (
      <div className="h-full bg-white border-l border-slate-200 flex flex-col overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900 mb-1">
            督导反馈
          </h2>
          <p className="text-sm text-slate-500">
            实时指导与建议
          </p>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 mx-auto mb-4 text-slate-300" />
            <p className="text-slate-400 text-sm">
              开始对话后将显示督导评价
            </p>
          </div>
        </div>
      </div>
    );
  }

  const currentFeedback = evaluation;

  const getScoreClass = (score: number) => {
    if (score >= 4) return 'text-green-600';
    if (score >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgClass = (score: number) => {
    if (score >= 4) return 'from-green-50 to-emerald-50 border-green-100';
    if (score >= 3) return 'from-yellow-50 to-amber-50 border-yellow-100';
    return 'from-red-50 to-orange-50 border-red-100';
  };
  return (
    <div className="h-full bg-white border-l border-slate-200 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900 mb-1">
          督导反馈
        </h2>
        <p className="text-sm text-slate-500">
          实时指导与建议
        </p>
      </div>

      {/* Scrollable Content */}
      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6">
          {/* Current Feedback Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-blue-600" />
              <h3 className="font-medium text-slate-900">当前评价</h3>
            </div>

            <div className={`bg-gradient-to-br ${getScoreBgClass(currentFeedback.综合得分)} rounded-xl p-5 border shadow-sm`}>
              {/* Score */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm text-slate-700">综合得分</span>
                  <span className={`text-2xl font-bold ${getScoreClass(currentFeedback.综合得分)}`}>
                    {currentFeedback.综合得分}
                  </span>
                </div>
              </div>

              {/* Summary */}
              <div className="mb-4">
                <p className="text-sm text-slate-700 leading-relaxed">
                  {currentFeedback.总体评价}
                </p>
              </div>

              {/* Suggestion */}
              {currentFeedback.建议 && (
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg p-4 mb-4 border border-emerald-100">
                  <div className="flex items-start gap-2 mb-2">
                    <Lightbulb className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm font-medium text-emerald-900">建议:</span>
                  </div>
                  <p className="text-sm text-emerald-800 leading-relaxed ml-6">
                    {currentFeedback.建议}
                  </p>
                </div>
              )}

              {/* Warning */}
              {currentFeedback.跳步判断?.是否跳步 && (
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-4 border border-amber-100">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-sm font-medium text-amber-900 block mb-1">
                        跳步判断: {currentFeedback.跳步判断.跳步类型}
                      </span>
                      <p className="text-xs text-amber-700 leading-relaxed">
                        {currentFeedback.跳步判断.督导建议}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Success message if no skip step */}
              {!currentFeedback.跳步判断?.是否跳步 && currentFeedback.跳步判断?.督导建议 !== "无跳步问题" && (
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-100">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-900">
                      节奏合适：未发现跳步问题
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Performance Indicators */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-violet-600" />
              <h3 className="font-medium text-slate-900">表现指标</h3>
            </div>

            <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl p-5 border border-violet-100">
              <div className="space-y-4">
                {/* Empathy */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-700">共情能力</span>
                    <span className="text-sm font-semibold text-violet-900">{Math.round(currentFeedback.综合得分 / 5 * 100)}%</span>
                  </div>
                  <div className="w-full bg-white rounded-full h-2 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full transition-all duration-500"
                      style={{ width: `${currentFeedback.综合得分 / 5 * 100}%` }}
                    />
                  </div>
                </div>

                {/* Active Listening */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-700">积极倾听</span>
                    <span className="text-sm font-semibold text-violet-900">{Math.round(currentFeedback.综合得分 / 5 * 100)}%</span>
                  </div>
                  <div className="w-full bg-white rounded-full h-2 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full transition-all duration-500"
                      style={{ width: `${currentFeedback.综合得分 / 5 * 100}%` }}
                    />
                  </div>
                </div>

                {/* Questioning Skills */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-700">提问技巧</span>
                    <span className="text-sm font-semibold text-violet-900">{Math.round(currentFeedback.综合得分 / 5 * 100)}%</span>
                  </div>
                  <div className="w-full bg-white rounded-full h-2 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full transition-all duration-500"
                      style={{ width: `${currentFeedback.综合得分 / 5 * 100}%` }}
                    />
                  </div>
                </div>

                {/* Rapport Building */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-700">关系建立</span>
                    <span className="text-sm font-semibold text-violet-900">{Math.round(currentFeedback.综合得分 / 5 * 100)}%</span>
                  </div>
                  <div className="w-full bg-white rounded-full h-2 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full transition-all duration-500"
                      style={{ width: `${currentFeedback.综合得分 / 5 * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}