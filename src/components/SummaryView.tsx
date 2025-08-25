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
      <ExecutiveSummary />

      {/* Quick Actions - Moved up for better visibility */}
      <QuickActions />

      {/* Key Changes with dedicated sections */}
      <KeyChangesWidget />

      {/* Dive Deeper Section */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-card-foreground">
              Need More Details?
            </h3>
            <p className="text-muted-foreground">
              Switch to detailed analysis for full payroll management capabilities
            </p>
          </div>
          <Button onClick={onSwitchToDetailed} className="gap-2">
            Detailed Analysis
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};