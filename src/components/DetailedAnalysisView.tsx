import React from 'react';
import { PayrollDashboard } from './PayrollDashboard';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface DetailedAnalysisViewProps {
  onSwitchToSummary: () => void;
}

export const DetailedAnalysisView = ({ onSwitchToSummary }: DetailedAnalysisViewProps) => {
  return (
    <div>
      {/* Full PayrollDashboard */}
      <PayrollDashboard />
    </div>
  );
};