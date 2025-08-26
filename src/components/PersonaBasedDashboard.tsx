import React, { useState } from 'react';
import { SummaryView } from './SummaryView';
import { DetailedAnalysisView } from './DetailedAnalysisView';

type PersonaType = 'summary' | 'detailed';

export const PersonaBasedDashboard = () => {
  const [currentPersona, setCurrentPersona] = useState<PersonaType>('summary');

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        {currentPersona === 'summary' ? (
          <SummaryView onSwitchToDetailed={() => setCurrentPersona('detailed')} />
        ) : (
          <DetailedAnalysisView onSwitchToSummary={() => setCurrentPersona('summary')} />
        )}
      </div>
    </div>
  );
};