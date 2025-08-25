import React, { useState } from 'react';
import { PersonaToggle } from './PersonaToggle';
import { SummaryView } from './SummaryView';
import { DetailedAnalysisView } from './DetailedAnalysisView';

type PersonaType = 'summary' | 'detailed';

export const PersonaBasedDashboard = () => {
  const [currentPersona, setCurrentPersona] = useState<PersonaType>('summary');

  return (
    <div className="min-h-screen bg-background">
      {/* Persona Toggle */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto p-6">
          <PersonaToggle 
            currentPersona={currentPersona}
            onPersonaChange={setCurrentPersona}
          />
        </div>
      </div>

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