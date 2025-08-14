import { Button } from '@/components/ui/button';
import { List, Grid } from 'lucide-react';

interface ViewModeToggleProps {
  viewMode: 'compact' | 'detailed';
  onViewModeChange: (mode: 'compact' | 'detailed') => void;
}

export const ViewModeToggle = ({ viewMode, onViewModeChange }: ViewModeToggleProps) => {
  return (
    <div className="flex items-center gap-1 bg-gray-100 rounded-md p-1">
      <Button
        variant={viewMode === 'compact' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewModeChange('compact')}
        className="h-6 px-2 text-xs"
      >
        <List className="h-3 w-3 mr-1" />
        Compact
      </Button>
      <Button
        variant={viewMode === 'detailed' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewModeChange('detailed')}
        className="h-6 px-2 text-xs"
      >
        <Grid className="h-3 w-3 mr-1" />
        Detailed
      </Button>
    </div>
  );
};