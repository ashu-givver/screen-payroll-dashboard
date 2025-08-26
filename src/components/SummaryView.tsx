import React from 'react';
import { ExecutiveSummary } from './ExecutiveSummary';
import { KeyChangesWidget } from './KeyChangesWidget';
import { QuickActions } from './QuickActions';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface SummaryViewProps {
  onSwitchToDetailed: () => void;
}

export const SummaryView = ({ onSwitchToDetailed }: SummaryViewProps) => {
  return (
    <div className="p-6 space-y-6">
      {/* Executive Summary - Compact */}
      <ExecutiveSummary onSwitchToDetailed={onSwitchToDetailed} />

      {/* Quick Actions - Moved up for better visibility */}
      <QuickActions />

      {/* Key Changes with dedicated sections */}
      <KeyChangesWidget />

    </div>
  );
};