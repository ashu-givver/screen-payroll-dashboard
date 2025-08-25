import React from 'react';
import { PayrollDashboard } from './PayrollDashboard';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface DetailedAnalysisViewProps {
  onSwitchToSummary: () => void;
}

export const DetailedAnalysisView = ({ onSwitchToSummary }: DetailedAnalysisViewProps) => {
  return (
    <div className="space-y-4">
      {/* Breadcrumb Navigation */}
      <div className="p-6 pb-0">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onSwitchToSummary} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Summary
          </Button>
          <div className="text-sm text-muted-foreground">
            Dashboard / Detailed Analysis
          </div>
        </div>
      </div>

      {/* Full PayrollDashboard */}
      <div className="px-6">
        <PayrollDashboard />
      </div>
    </div>
  );
};