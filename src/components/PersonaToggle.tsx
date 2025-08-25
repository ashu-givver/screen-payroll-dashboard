import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BarChart3, Users } from 'lucide-react';

type PersonaType = 'summary' | 'detailed';

interface PersonaToggleProps {
  currentPersona: PersonaType;
  onPersonaChange: (persona: PersonaType) => void;
}

export const PersonaToggle = ({ currentPersona, onPersonaChange }: PersonaToggleProps) => {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-payroll-header">Payroll Dashboard</h1>
        <p className="text-muted-foreground">Choose your view based on your role</p>
      </div>

      <div className="flex gap-4">
        <Card 
          className={`p-4 cursor-pointer transition-all border-2 ${
            currentPersona === 'summary' 
              ? 'border-primary bg-primary/5' 
              : 'border-border hover:border-primary/50'
          }`}
          onClick={() => onPersonaChange('summary')}
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${
              currentPersona === 'summary' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted text-muted-foreground'
            }`}>
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold">Summary View</h3>
              <p className="text-sm text-muted-foreground">
                For managers and non-payroll users
              </p>
            </div>
          </div>
        </Card>

        <Card 
          className={`p-4 cursor-pointer transition-all border-2 ${
            currentPersona === 'detailed' 
              ? 'border-primary bg-primary/5' 
              : 'border-border hover:border-primary/50'
          }`}
          onClick={() => onPersonaChange('detailed')}
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${
              currentPersona === 'detailed' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted text-muted-foreground'
            }`}>
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold">Detailed Analysis</h3>
              <p className="text-sm text-muted-foreground">
                For payroll and finance professionals
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};