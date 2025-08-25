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
  approvedCount,
  totalCount,
  onApproveAll,
  currentView,
  selectedDepartment = 'all',
  onDepartmentChange,
}: TableControlBarProps) => {
  const allApproved = approvedCount === totalCount && totalCount > 0;

  return (
    <div className="bg-card border-b border-border px-6 py-3">
      <div className="flex items-center justify-between">
        {/* Left side: Approval status and action */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Approvals:</span>
            <span className="font-medium">{approvedCount}/{totalCount}</span>
          </div>
          {!allApproved && (
            <Button
              variant="outline"
              size="sm"
              onClick={onApproveAll}
              className="h-8 text-xs gap-2"
            >
              <CheckCircle className="h-3 w-3" />
              Approve All
            </Button>
          )}
        </div>

        {/* Right side: Search bar with integrated filters */}
        <div className="flex items-center gap-2">
          <div className="relative flex items-center">
            <Input
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search employees or filter by tag"
              className="w-80 h-8 text-sm pr-10"
            />
            <div className="absolute right-2 flex items-center gap-1">
              {searchValue && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onSearchChange('')}
                  className="h-6 w-6 p-0 hover:bg-muted"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground">
                    <Filter className="h-3 w-3" />
                    {activeFilters.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full text-xs w-4 h-4 flex items-center justify-center">
                        {activeFilters.length}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-background border z-50">
                  <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  
                  {/* Department Filter */}
                  {onDepartmentChange && (
                    <>
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                          <Building className="h-4 w-4 mr-2" />
                          Department
                        </DropdownMenuSubTrigger>
                        <DropdownMenuSubContent>
                          <DropdownMenuCheckboxItem
                            checked={selectedDepartment === 'all'}
                            onCheckedChange={() => onDepartmentChange('all')}
                          >
                            All Departments
                          </DropdownMenuCheckboxItem>
                          {['Engineering', 'Sales', 'Marketing', 'Finance', 'Operations', 'HR'].map((dept) => (
                            <DropdownMenuCheckboxItem
                              key={dept}
                              checked={selectedDepartment === dept}
                              onCheckedChange={() => onDepartmentChange(dept)}
                            >
                              {dept}
                            </DropdownMenuCheckboxItem>
                          ))}
                        </DropdownMenuSubContent>
                      </DropdownMenuSub>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  
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
            </div>
          </div>

          {/* Active Filter Tags */}
          {activeFilters.length > 0 && (
            <div className="flex items-center gap-1 flex-wrap max-w-xs">
              {activeFilters.slice(0, 2).map((filterId) => {
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
              {activeFilters.length > 2 && (
                <Badge variant="secondary" className="text-xs bg-muted">
                  +{activeFilters.length - 2}
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};