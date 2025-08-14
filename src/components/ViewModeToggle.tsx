import { Button } from '@/components/ui/button';
import { List, Grid } from 'lucide-react';

interface ViewModeToggleProps {
  viewMode: 'compact' | 'detailed';
  onViewModeChange: (mode: 'compact' | 'detailed') => void;
}

export const ViewModeToggle = ({ viewMode, onViewModeChange }: ViewModeToggleProps) => {
  return (
    <div className="flex items-center gap-1 bg-muted rounded-md p-1">
      <Button
        variant={viewMode === 'compact' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewModeChange('compact')}
        className="h-7 px-3 text-xs font-medium"
      >
        <List className="h-3 w-3 mr-1.5" />
        Compact
        <span className="ml-1.5 text-xs text-muted-foreground">(Founders)</span>
      </Button>
      <Button
        variant={viewMode === 'detailed' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewModeChange('detailed')}
        className="h-7 px-3 text-xs font-medium"
      >
        <Grid className="h-3 w-3 mr-1.5" />
        Detailed
        <span className="ml-1.5 text-xs text-muted-foreground">(Finance)</span>
      </Button>
    </div>
  );
};