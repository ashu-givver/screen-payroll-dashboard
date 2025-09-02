import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';  
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Download, Search, Filter, ChevronDown, X, Users, CheckCircle, Building, TrendingUp, Receipt, BarChart3, MinusCircle, ArrowUpDown } from 'lucide-react';
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
import { Employee, FilterGroup } from '@/types/payroll';

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
  employees: Employee[];
}

const filterGroups: FilterGroup[] = [
  {
    id: 'employment',
    label: 'Employment Status',
    icon: Users,
    filters: [
      { id: 'new-joiners', label: 'New joiner', type: 'employment' },
      { id: 'leavers', label: 'Leaver', type: 'employment' },
    ]
  },
  {
    id: 'approval',
    label: 'Approval',
    icon: CheckCircle,
    filters: [
      { id: 'approved', label: 'Approved', type: 'approval' },
      { id: 'pending-approval', label: 'Pending approval', type: 'approval' },
    ]
  },
  {
    id: 'payment',
    label: 'Payment',
    icon: Receipt,
    filters: [
      { id: 'bonus', label: 'Bonus', type: 'payment' },
      { id: 'commission', label: 'Commission', type: 'payment' },
      { id: 'overtime', label: 'Overtime', type: 'payment' },
      { id: 'inflex', label: 'Inflex', type: 'payment' },
      { id: 'on-call', label: 'On call', type: 'payment' },
    ]
  },
  {
    id: 'deductions',
    label: 'Deductions',
    icon: MinusCircle,
    filters: [
      { id: 'loan', label: 'Loan', type: 'deductions' },
      { id: 'advanced-cycle-scheme', label: 'Advanced Cycle Scheme', type: 'deductions' },
    ]
  },
  {
    id: 'salary-changes',
    label: 'Salary Changes',
    icon: ArrowUpDown,
    filters: [
      { id: 'salary-increase', label: 'Salary increase', type: 'salary-changes' },
      { id: 'salary-decrease', label: 'Salary decrease', type: 'salary-changes' },
      { id: 'promotion', label: 'Promotion', type: 'salary-changes' },
      { id: 'role-change', label: 'Role change', type: 'salary-changes' },
    ]
  },
  {
    id: 'gross-pay-difference',
    label: 'Gross Pay Difference',
    icon: BarChart3,
    filters: [
      { id: 'gross-diff-3', label: '< 3%', type: 'gross-pay-difference' },
      { id: 'gross-diff-5', label: '< 5%', type: 'gross-pay-difference' },
      { id: 'gross-diff-7', label: '< 7%', type: 'gross-pay-difference' },
      { id: 'gross-diff-10', label: '< 10%', type: 'gross-pay-difference' },
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
  employees,
}: TableControlBarProps) => {
  const allApproved = approvedCount === totalCount && totalCount > 0;

  // Function to calculate count for each filter option
  const getFilterCount = (filterId: string, filterType: string): number => {
    switch (filterType) {
      case 'employment':
        if (filterId === 'new-joiners') {
          // Mock: 10% of employees are new joiners
          return Math.floor(employees.length * 0.1);
        }
        if (filterId === 'leavers') {
          // Mock: 5% of employees are leavers
          return Math.floor(employees.length * 0.05);
        }
        break;
      case 'approval':
        if (filterId === 'approved') {
          return approvedCount;
        }
        if (filterId === 'pending-approval') {
          return totalCount - approvedCount;
        }
        break;
      case 'payment':
        if (filterId === 'bonus') {
          return employees.filter(emp => emp.bonus > 0).length;
        }
        if (filterId === 'commission') {
          return employees.filter(emp => emp.commission > 0).length;
        }
        if (filterId === 'overtime') {
          return employees.filter(emp => emp.overtime > 0).length;
        }
        if (filterId === 'inflex') {
          return employees.filter(emp => emp.gifFlex > 0).length;
        }
        if (filterId === 'on-call') {
          return employees.filter(emp => emp.onCall > 0).length;
        }
        break;
      case 'deductions':
        if (filterId === 'loan') {
          return employees.filter(emp => emp.studentLoan > 0 || emp.postgradLoan > 0).length;
        }
        if (filterId === 'advanced-cycle-scheme') {
          // Mock: 15% of employees have cycle scheme
          return Math.floor(employees.length * 0.15);
        }
        break;
      case 'salary-changes':
        if (filterId === 'salary-increase') {
          return employees.filter(emp => 
            emp.previousMonth && emp.basePay > emp.previousMonth.basePay
          ).length;
        }
        if (filterId === 'salary-decrease') {
          return employees.filter(emp => 
            emp.previousMonth && emp.basePay < emp.previousMonth.basePay
          ).length;
        }
        if (filterId === 'promotion') {
          // Mock: 3% of employees got promoted
          return Math.floor(employees.length * 0.03);
        }
        if (filterId === 'role-change') {
          // Mock: 2% of employees changed roles
          return Math.floor(employees.length * 0.02);
        }
        break;
      case 'gross-pay-difference':
        const getPercentageDiff = (emp: Employee) => {
          if (!emp.previousMonth) return 0;
          const diff = Math.abs(emp.totalIncome - emp.previousMonth.totalIncome);
          return (diff / emp.previousMonth.totalIncome) * 100;
        };
        
        if (filterId === 'gross-diff-3') {
          return employees.filter(emp => getPercentageDiff(emp) < 3).length;
        }
        if (filterId === 'gross-diff-5') {
          return employees.filter(emp => getPercentageDiff(emp) < 5).length;
        }
        if (filterId === 'gross-diff-7') {
          return employees.filter(emp => getPercentageDiff(emp) < 7).length;
        }
        if (filterId === 'gross-diff-10') {
          return employees.filter(emp => getPercentageDiff(emp) < 10).length;
        }
        break;
    }
    return 0;
  };

  const formatCount = (count: number): string => {
    return count === 1 ? '1 employee' : `${count} employees`;
  };

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
                          {['Engineering', 'Sales', 'Marketing', 'Operations'].map((dept) => (
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
                        {group.icon && <group.icon className="h-4 w-4 mr-2" aria-hidden="true" />}
                        {group.label}
                      </DropdownMenuSubTrigger>
                      <DropdownMenuSubContent>
                        {group.filters.map((filter) => {
                          const count = getFilterCount(filter.id, filter.type);
                          return (
                            <DropdownMenuCheckboxItem
                              key={filter.id}
                              checked={activeFilters.includes(filter.id)}
                              onCheckedChange={(checked) => onFilterChange(filter.id, checked)}
                              className="flex items-center justify-between"
                            >
                              <span>{filter.label}</span>
                              <span className="text-xs text-muted-foreground opacity-60 ml-2">
                                {formatCount(count)}
                              </span>
                            </DropdownMenuCheckboxItem>
                          );
                        })}
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>
                  ))}
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