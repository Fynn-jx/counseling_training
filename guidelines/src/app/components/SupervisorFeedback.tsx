import { AlertCircle, CheckCircle, Lightbulb } from 'lucide-react';
import type { SupervisorEvaluation } from '@/app/services/api';

interface SupervisorEvaluationWithTurn extends SupervisorEvaluation {
  turn: number;
}

interface SupervisorFeedbackProps {
  evaluations: SupervisorEvaluationWithTurn[];
}

export function SupervisorFeedback({ evaluations }: SupervisorFeedbackProps) {
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
      <div className="p-6 border-b border-slate-200 flex-shrink-0">
        <h2 className="text-lg font-semibold text-slate-900 mb-1">
          督导反馈
        </h2>
        <p className="text-sm text-slate-500">
          历史评价与建议 ({evaluations.length} 轮)
        </p>
      </div>

      {/* Scrollable Content - 使用原生滚动 */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          {evaluations.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <AlertCircle className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                <p className="text-slate-400 text-sm">
                  开始对话后将显示督导评价
                </p>
              </div>
            </div>
          ) : (
            evaluations.slice().reverse().map((evaluation, index) => {
              const isLatest = index === 0;
              return (
                <div key={evaluation.turn} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <AlertCircle className={`w-4 h-4 ${isLatest ? 'text-blue-600' : 'text-slate-400'}`} />
                    <h3 className={`font-medium ${isLatest ? 'text-slate-900' : 'text-slate-600'}`}>
                      第 {evaluation.turn} 轮{isLatest && ' (当前)'}
                    </h3>
                  </div>

                  <div className={`bg-gradient-to-br ${getScoreBgClass(evaluation.综合得分)} rounded-xl p-5 border ${isLatest ? 'shadow-sm' : 'shadow-inner opacity-75'} ${!isLatest && 'bg-slate-50'}`}>
                    {/* Score */}
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm text-slate-700">综合得分</span>
                        <span className={`text-2xl font-bold ${getScoreClass(evaluation.综合得分)}`}>
                          {evaluation.综合得分}
                        </span>
                      </div>
                    </div>

                    {/* Summary */}
                    <div className="mb-4">
                      <p className="text-sm text-slate-700 leading-relaxed">
                        {evaluation.总体评价}
                      </p>
                    </div>

                    {/* Suggestion */}
                    {evaluation.建议 && (
                      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg p-4 mb-4 border border-emerald-100">
                        <div className="flex items-start gap-2 mb-2">
                          <Lightbulb className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm font-medium text-emerald-900">建议:</span>
                        </div>
                        <p className="text-sm text-emerald-800 leading-relaxed ml-6">
                          {evaluation.建议}
                        </p>
                      </div>
                    )}

                    {/* Warning */}
                    {evaluation.跳步判断?.是否跳步 && (
                      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-4 border border-amber-100">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <span className="text-sm font-medium text-amber-900 block mb-1">
                              跳步判断: {evaluation.跳步判断.跳步类型}
                            </span>
                            <p className="text-xs text-amber-700 leading-relaxed">
                              {evaluation.跳步判断.督导建议}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Success message if no skip step */}
                    {!evaluation.跳步判断?.是否跳步 && evaluation.跳步判断?.督导建议 !== "无跳步问题" && (
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
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
