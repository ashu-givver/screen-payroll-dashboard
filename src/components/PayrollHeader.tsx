import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Download, Upload, MoreHorizontal, Search, Settings, Filter, ChevronDown, X } from 'lucide-react';
import { PayrollPeriod } from '@/types/payroll';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';

interface PayrollHeaderProps {
  period: PayrollPeriod;
  onConfirm: () => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  viewMode: 'compact' | 'detailed';
  onViewModeChange: (mode: 'compact' | 'detailed') => void;
  activeFilters: string[];
  onFilterChange: (filterId: string, active: boolean) => void;
  onAdvancedFilters: () => void;
}

const filterOptions = [
  { id: 'total-headcount', label: 'Total Headcount' },
  { id: 'new-joiners', label: 'New Joiners' },
  { id: 'leavers', label: 'Leavers' },
  { id: 'pension-enrolled', label: 'Pension Enrolled' },
  { id: 'pension-opted-out', label: 'Pension Opted Out' },
  { id: 'salary-changes', label: 'Salary Changes' },
];

export const PayrollHeader = ({ 
  period, 
  onConfirm, 
  searchValue,
  onSearchChange,
  viewMode,
  onViewModeChange,
  activeFilters,
  onFilterChange,
  onAdvancedFilters,
}: PayrollHeaderProps) => {
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
    <div className="bg-card border-b border-border">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-semibold text-payroll-header">
              {period.month} {period.year}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge 
                variant={period.status === 'Draft' ? 'secondary' : 'default'}
                className={period.status === 'Draft' ? 'bg-payroll-draft text-payroll-header' : ''}
              >
                {period.status}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Download className="h-3 w-3" />
                Sync Data
              </Button>
              <span className="text-xs text-muted-foreground mt-1">Last updated: 2 min ago</span>
            </div>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
            <Button 
              variant="default" 
              size="sm"
              className="bg-payroll-confirm text-white hover:bg-payroll-confirm/90"
              onClick={onConfirm}
            >
              Confirm
            </Button>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            <span className="font-medium text-payroll-header">{period.companyName}</span>
            <span className="mx-2">•</span>
            <span>{period.startDate} - {period.endDate}</span>
            <span className="mx-2">•</span>
            <span>{period.employeeCount} employees</span>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Filters Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 text-sm text-muted-foreground hover:text-foreground">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                  {activeFilters.length > 0 && (
                    <span className="ml-1 bg-primary text-primary-foreground rounded-full text-xs px-1.5 py-0.5">
                      {activeFilters.length}
                    </span>
                  )}
                  <ChevronDown className="h-3 w-3 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {filterOptions.map((filter) => (
                  <DropdownMenuCheckboxItem
                    key={filter.id}
                    checked={activeFilters.includes(filter.id)}
                    onCheckedChange={(checked) => onFilterChange(filter.id, checked)}
                  >
                    {filter.label}
                  </DropdownMenuCheckboxItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onAdvancedFilters}>
                  <Settings className="h-4 w-4 mr-2" />
                  Advanced Filters
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

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
      </div>
    </div>
  );
};