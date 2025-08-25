import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';  
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Download, Search, Filter, ChevronDown, X, Users, CheckCircle, Settings, Building } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FilterGroup } from '@/types/payroll';

interface TableControlBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  activeFilters: string[];      
  onFilterChange: (filterId: string, active: boolean) => void;
  onAdvancedFilters: () => void;
  onDownload?: () => void;
  approvedCount: number;
  totalCount: number;
  onApproveAll: () => void;
  currentView: string;
  selectedDepartment?: string;
  onDepartmentChange?: (value: string) => void;
}

const filterGroups: FilterGroup[] = [
  {
    id: 'employment',
    label: 'Employment Status Changes',
    filters: [
      { id: 'new-joiners', label: 'New Joiners', type: 'employment' },
      { id: 'leavers', label: 'Leavers', type: 'employment' },
      { id: 'pending-approval', label: 'Pending Approval', type: 'employment' },
    ]
  },
  {
    id: 'compensation',
    label: 'Compensation Changes',
    filters: [
      { id: 'salary-changes', label: 'Salary Changes', type: 'compensation' },
      { id: 'bonus', label: 'Bonus', type: 'compensation' },
      { id: 'commission', label: 'Commission', type: 'compensation' },
      { id: 'overtime', label: 'Overtime', type: 'compensation' },
    ]
  },
  {
    id: 'statutory',
    label: 'Statutory Changes',
    filters: [
      { id: 'tax-code-change', label: 'Tax Code Change', type: 'statutory' },
      { id: 'student-loan', label: 'Student Loan', type: 'statutory' },
      { id: 'pension-enrolled', label: 'Pension Enrolled', type: 'statutory' },
      { id: 'pension-opted-out', label: 'Pension Opted Out', type: 'statutory' },
      { id: 'maternity', label: 'Maternity', type: 'statutory' },
      { id: 'sickness', label: 'Sickness', type: 'statutory' },
    ]
  },
  {
    id: 'other',
    label: 'Other',
    filters: [
      { id: 'net-differences', label: 'Net Differences', type: 'other' },
    ]
  }
];

export const TableControlBar = ({ 
  searchValue,
  onSearchChange,
  activeFilters,
  onFilterChange,
  onAdvancedFilters,
  onDownload,
  approvedCount,
  totalCount,
  onApproveAll,
  currentView,
  selectedDepartment = 'all',
  onDepartmentChange,
}: TableControlBarProps) => {
  const [searchExpanded, setSearchExpanded] = useState(false);
  
  const approvalProgress = totalCount > 0 ? (approvedCount / totalCount) * 100 : 0;
  const allApproved = approvedCount === totalCount && totalCount > 0;

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

  const getViewTitle = () => {
    switch (currentView) {
      case 'deductions':
        return 'Deductions Breakdown';
      case 'employer-cost':
        return 'Employer Cost Breakdown';
      case 'total':
        return 'Total View - All Details';
      case 'custom-view':
        return 'Custom View - All Details';
      case 'gross-pay':
      default:
        return 'Income Details';
    }
  };

  return (
    <div className="bg-card border-b border-border px-6 py-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-foreground">
            {getViewTitle()}
          </h2>
          
          {/* Approval Progress */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle className="h-4 w-4" />
              <span>{approvedCount}/{totalCount} approved</span>
            </div>
            <div className="flex items-center gap-2">
              <Progress value={approvalProgress} className="w-20 h-2" />
              <Badge variant={allApproved ? "default" : "secondary"} className="text-xs">
                {Math.round(approvalProgress)}%
              </Badge>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        <div className="flex items-center gap-2">
          {!allApproved && (
            <Button
              variant="outline"
              size="sm"
              onClick={onApproveAll}
              className="h-8 text-xs"
            >
              <Users className="h-3 w-3 mr-1.5" />
              Approve All ({totalCount - approvedCount})
            </Button>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Department Filter */}
          {onDepartmentChange && (
            <Select value={selectedDepartment} onValueChange={onDepartmentChange}>
              <SelectTrigger className="w-36 h-8 text-sm">
                <Building className="h-3 w-3 mr-1" />
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent className="bg-background border z-50">
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="Engineering">Engineering</SelectItem>
                <SelectItem value="Sales">Sales</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
                <SelectItem value="Finance">Finance</SelectItem>
                <SelectItem value="Operations">Operations</SelectItem>
                <SelectItem value="HR">HR</SelectItem>
              </SelectContent>
            </Select>
          )}

          {/* Grouped Filters Dropdown */}
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
            <DropdownMenuContent align="start" className="w-56 bg-background border z-50">
              <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              {filterGroups.map((group) => (
                <DropdownMenuSub key={group.id}>
                  <DropdownMenuSubTrigger>
                    {group.label}
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    {group.filters.map((filter) => (
                      <DropdownMenuCheckboxItem
                        key={filter.id}
                        checked={activeFilters.includes(filter.id)}
                        onCheckedChange={(checked) => onFilterChange(filter.id, checked)}
                      >
                        {filter.label}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              ))}
              
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onAdvancedFilters}>
                <Settings className="h-4 w-4 mr-2" />
                Advanced Filters
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Active Filter Tags */}
          {activeFilters.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              {activeFilters.map((filterId) => {
                // Find the filter across all groups
                const filter = filterGroups.flatMap(g => g.filters).find(f => f.id === filterId);
                return (
                  <Badge 
                    key={filterId}
                    variant="secondary" 
                    className="text-xs flex items-center gap-1 bg-primary/10 text-primary border-primary/20"
                  >
                    {filter?.label}
                    <X 
                      className="h-3 w-3 cursor-pointer hover:text-destructive" 
                      onClick={() => onFilterChange(filterId, false)}
                    />
                  </Badge>
                );
              })}
            </div>
          )}

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
        </div>

        <div className="flex items-center gap-2">
          {/* Download */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onDownload}
            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
            title="Download Excel Report"
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};