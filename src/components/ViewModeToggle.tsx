import { Button } from '@/components/ui/button';
import { List, Grid } from 'lucide-react';

interface ViewModeToggleProps {
  viewMode: 'compact' | 'detailed' | 'simple';
  onViewModeChange: (mode: 'compact' | 'detailed' | 'simple') => void;
}

export const ViewModeToggle = ({ viewMode, onViewModeChange }: ViewModeToggleProps) => {
  return (
    <div className="flex items-center gap-1 bg-muted rounded-lg p-1 border">
      <Button
        variant={viewMode === 'simple' ? 'default' : 'ghost'}
        size="default"
        onClick={() => onViewModeChange('simple')}
        className="h-9 px-3 text-sm font-medium"
      >
        <List className="h-4 w-4 mr-1" />
        Simple
      </Button>
      <Button
        variant={viewMode === 'compact' ? 'default' : 'ghost'}
        size="default"
        onClick={() => onViewModeChange('compact')}
        className="h-9 px-3 text-sm font-medium"
      >
        <List className="h-4 w-4 mr-1" />
        Compact
        <span className="ml-1 text-xs text-muted-foreground">(Founders)</span>
      </Button>
      <Button
        variant={viewMode === 'detailed' ? 'default' : 'ghost'}
        size="default"
        onClick={() => onViewModeChange('detailed')}
        className="h-9 px-3 text-sm font-medium"
      >
        <Grid className="h-4 w-4 mr-1" />
        Detailed
        <span className="ml-1 text-xs text-muted-foreground">(Finance)</span>
      </Button>
    </div>
  );
};