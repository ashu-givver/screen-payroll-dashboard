import { useState } from 'react';
import { Search, Settings, Filter, ChevronDown, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';

interface TableToolbarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  viewMode: 'compact' | 'detailed';
  onViewModeChange: (mode: 'compact' | 'detailed') => void;
  activeFilters: string[];
  onFilterChange: (filterId: string, active: boolean) => void;
  onAdvancedFilters: () => void;
}

const filterOptions = [
  { id: 'new-joiners', label: 'New Joiners', count: 7 },
  { id: 'leavers', label: 'Leavers', count: 3 },
  { id: 'pension-enrolled', label: 'Pension Enrolled', count: 95 },
  { id: 'pension-opted-out', label: 'Pension Opted Out', count: 5 },
  { id: 'salary-changes', label: 'Salary Changes', count: 14 },
  { id: 'net-differences', label: 'Net Differences', count: 6 },
  { id: 'pending-approval', label: 'Pending Approval', count: 12 },
];

export const TableToolbar = ({
  searchValue,
  onSearchChange,
  viewMode,
  onViewModeChange,
  activeFilters,
  onFilterChange,
  onAdvancedFilters,
}: TableToolbarProps) => {
  const [searchExpanded, setSearchExpanded] = useState(false);

  const handleSearchIconClick = () => {
    setSearchExpanded(true);
  };

  const handleSearchBlur = () => {
    if (!searchValue) {
      setSearchExpanded(false);
    }
  };

  const clearSearch = () => {
    onSearchChange('');
    setSearchExpanded(false);
  };

  return (
    <div className="flex items-center justify-between px-6 py-3 bg-background border-b border-border">
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-medium text-foreground">Income Details</h2>
        
        {/* Filters Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 text-sm text-foreground border-border">
              <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
              Filters
              {activeFilters.length > 0 && (
                <span className="ml-1 bg-muted text-foreground rounded-full text-xs px-1.5 py-0.5 border">
                  {activeFilters.length}
                </span>
              )}
              <ChevronDown className="h-3 w-3 ml-1 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 bg-background border z-50">
              <DropdownMenuLabel>Filter by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {filterOptions.map((filter) => (
                <DropdownMenuCheckboxItem
                  key={filter.id}
                  checked={activeFilters.includes(filter.id)}
                  onCheckedChange={(checked) => onFilterChange(filter.id, checked)}
                >
                  <div className="flex items-center justify-between w-full">
                    <span>{filter.label}</span>
                    <span className="text-xs text-muted-foreground ml-2">({filter.count})</span>
                  </div>
                </DropdownMenuCheckboxItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onAdvancedFilters}>
                <Settings className="h-4 w-4 mr-2" />
                Advanced Filters
              </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="relative">
          {searchExpanded ? (
            <div className="flex items-center">
              <Input
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                onBlur={handleSearchBlur}
                placeholder="Search employees..."
                className="w-64 h-8 text-sm pr-8"
                autoFocus
              />
              {searchValue && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearSearch}
                  className="absolute right-1 h-6 w-6 p-0 hover:bg-muted"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSearchIconClick}
              className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
            >
              <Search className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Settings Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>View Options</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => onViewModeChange('compact')}
              className={viewMode === 'compact' ? 'bg-accent' : ''}
            >
              <div className="flex items-center justify-between w-full">
                <span>Compact View</span>
                <span className="text-xs text-muted-foreground">(Founder)</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onViewModeChange('detailed')}
              className={viewMode === 'detailed' ? 'bg-accent' : ''}
            >
              <div className="flex items-center justify-between w-full">
                <span>Detailed View</span>
                <span className="text-xs text-muted-foreground">(Finance)</span>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};