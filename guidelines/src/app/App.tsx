import { useState } from 'react';
import { LoginPage } from '@/app/components/LoginPage';
import { ScenarioSelection } from '@/app/components/ScenarioSelection';
import { ChatInterface } from '@/app/components/ChatInterface';
import { EvaluationReport } from '@/app/components/EvaluationReport';
import type { Scenario } from '@/app/components/ScenarioSelection';
import type { OverallEvaluation } from '@/app/services/api';
import type { CompetencyScores } from '@/app/services/api';

type AppState = 'login' | 'scenario-selection' | 'chat' | 'report';

export default function App() {
  const [appState, setAppState] = useState<AppState>('login');
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [overallEvaluation, setOverallEvaluation] = useState<OverallEvaluation | null>(null);
  const [competencyScores, setCompetencyScores] = useState<CompetencyScores>({});
  const [conversationTurns, setConversationTurns] = useState(0);

  const handleLogin = () => {
    setAppState('scenario-selection');
  };

  const handleLogout = () => {
    setAppState('login');
    setSelectedScenario(null);
  };

  const handleSelectScenario = (scenario: Scenario) => {
    setSelectedScenario(scenario);
    setAppState('chat');
  };

  const handleBackToScenarios = () => {
    setSelectedScenario(null);
    setAppState('scenario-selection');
  };

  const handleFinishPractice = (evaluation?: OverallEvaluation, scores?: CompetencyScores, turns?: number) => {
    if (evaluation) setOverallEvaluation(evaluation);
    if (scores) setCompetencyScores(scores);
    if (turns) setConversationTurns(turns);
    setAppState('report');
  };

  const handleStartNew = () => {
    setSelectedScenario(null);
    setAppState('chat');
  };

  return (
    <div className="size-full">
      {appState === 'login' && (
        <LoginPage onLogin={handleLogin} />
      )}

      {appState === 'scenario-selection' && (
        <ScenarioSelection
          onSelectScenario={handleSelectScenario}
          onLogout={handleLogout}
        />
      )}

      {appState === 'chat' && selectedScenario && (
        <ChatInterface
          scenario={selectedScenario}
          onBack={handleBackToScenarios}
          onFinish={handleFinishPractice}
        />
      )}

      {appState === 'report' && selectedScenario && (
        <EvaluationReport
          scenarioName={selectedScenario.title}
          overallEvaluation={overallEvaluation}
          competencyScores={competencyScores}
          conversationTurns={conversationTurns}
          onStartNew={handleStartNew}
          onBackToScenarios={handleBackToScenarios}
        />
      )}
    </div>
  );
}
