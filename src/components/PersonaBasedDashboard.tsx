import React, { useState } from 'react';
import { SummaryView } from './SummaryView';
import { DetailedAnalysisView } from './DetailedAnalysisView';

type PersonaType = 'summary' | 'detailed';

interface PersonaBasedDashboardProps {
  onViewChange?: (view: PersonaType) => void;
}

export const PersonaBasedDashboard = ({ onViewChange }: PersonaBasedDashboardProps) => {
  const [currentPersona, setCurrentPersona] = useState<PersonaType>('detailed');

  const handlePersonaChange = (newPersona: PersonaType) => {
    setCurrentPersona(newPersona);
    onViewChange?.(newPersona);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        {currentPersona === 'summary' ? (
          <SummaryView onSwitchToDetailed={() => handlePersonaChange('detailed')} />
        ) : (
          <DetailedAnalysisView onSwitchToSummary={() => handlePersonaChange('summary')} />
        )}
      </div>
    </div>
  );
};