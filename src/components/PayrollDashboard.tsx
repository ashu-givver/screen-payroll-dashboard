import { useState, useMemo } from 'react';
import { TabType, AdvancedFilter } from '@/types/payroll';
import { employees, payrollPeriod, payrollSummary } from '@/data/employees';
import { PayrollHeader } from '@/components/PayrollHeader';
import { PayrollTabs } from '@/components/PayrollTabs';
import { SmartFilterPanel } from '@/components/SmartFilterPanel';
import { AdvancedFilterPanel } from '@/components/AdvancedFilterPanel';
import { TotalsSummaryBar } from '@/components/TotalsSummaryBar';
import { ViewModeToggle } from '@/components/ViewModeToggle';
import { CompactTable } from '@/components/tables/CompactTable';
import { DetailedTable } from '@/components/tables/DetailedTable';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

export const PayrollDashboard = () => {
  const [activeTab, setActiveTab] = useState<TabType>('summary');
  const [searchValue, setSearchValue] = useState('');
  const [showChangesOnly, setShowChangesOnly] = useState(true);
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedEmploymentType, setSelectedEmploymentType] = useState('all');
  const [viewMode, setViewMode] = useState<'compact' | 'detailed'>('compact');
  const [approvedEmployees, setApprovedEmployees] = useState<Set<string>>(new Set());
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilter[]>([]);
  const { toast } = useToast();

  const filteredEmployees = useMemo(() => {
    return employees.filter(employee => {
      // Search filter
      if (searchValue && !employee.name.toLowerCase().includes(searchValue.toLowerCase())) {
        return false;
      }
      
      // Changes only filter
      if (showChangesOnly && !['1', '3', '5', '7'].includes(employee.id)) {
        return false;
      }
      
      // Department filter
      if (selectedDepartment !== 'all' && employee.department !== selectedDepartment) {
        return false;
      }
      
      // Employment type filter
      if (selectedEmploymentType !== 'all' && employee.employmentType !== selectedEmploymentType) {
        return false;
      }
      
      // Advanced filters
      for (const filter of advancedFilters) {
        const currentValue = employee[filter.payElement as keyof typeof employee] as number;
        const compareValue = filter.compareToLastMonth && employee.previousMonth 
          ? employee.previousMonth[filter.payElement as keyof typeof employee.previousMonth] as number
          : 0;
          
        let testValue = currentValue;
        
        if (filter.compareToLastMonth && employee.previousMonth) {
          if (filter.isPercentage) {
            testValue = compareValue > 0 ? ((currentValue - compareValue) / compareValue) * 100 : 0;
          } else {
            testValue = currentValue - compareValue;
          }
        }
        
        const filterValue = filter.isPercentage && !filter.compareToLastMonth 
          ? (filter.value / 100) * testValue 
          : filter.value;
          
        switch (filter.condition) {
          case 'greater':
            if (testValue <= filterValue) return false;
            break;
          case 'less':
            if (testValue >= filterValue) return false;
            break;
          case 'equal':
            if (Math.abs(testValue - filterValue) > 0.01) return false;
            break;
        }
      }
      
      return true;
    });
  }, [searchValue, showChangesOnly, selectedDepartment, selectedEmploymentType, advancedFilters]);

  const handleConfirm = () => {
    toast({
      title: "Payroll Confirmed",
      description: `${payrollPeriod.month} ${payrollPeriod.year} payroll has been confirmed.`,
    });
  };

  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Your payroll data is being exported.",
    });
  };

  const handleImport = () => {
    toast({
      title: "Import",
      description: "Import functionality would open a file dialog.",
    });
  };

  const handleApproveEmployee = (employeeId: string) => {
    setApprovedEmployees(prev => new Set([...prev, employeeId]));
    toast({
      title: "Employee Approved",
      description: "Employee payroll data has been approved.",
    });
  };

  const handleApproveAll = () => {
    const filteredIds = filteredEmployees.map(emp => emp.id);
    setApprovedEmployees(prev => new Set([...prev, ...filteredIds]));
    toast({
      title: "All Approved",
      description: `Approved ${filteredEmployees.length} employee(s).`,
    });
  };

  const renderTabContent = () => {
    const commonProps = {
      employees: filteredEmployees,
      summary: payrollSummary,
      approvedEmployees,
      onApproveEmployee: handleApproveEmployee,
    };

    // For the new view modes, we render different tables regardless of tab
    if (viewMode === 'compact') {
      return <CompactTable {...commonProps} />;
    } else {
      return <DetailedTable {...commonProps} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto">
        <PayrollHeader period={payrollPeriod} onConfirm={handleConfirm} />
        
        <div className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200">
          <PayrollTabs activeTab={activeTab} onTabChange={setActiveTab} />
          <div className="flex items-center gap-3">
            <ViewModeToggle viewMode={viewMode} onViewModeChange={setViewMode} />
            <Button 
              onClick={handleApproveAll}
              disabled={filteredEmployees.length === 0}
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Approve All ({filteredEmployees.length})
            </Button>
          </div>
        </div>

        <SmartFilterPanel
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          showChangesOnly={showChangesOnly}
          onToggleChangesOnly={setShowChangesOnly}
          selectedDepartment={selectedDepartment}
          onDepartmentChange={setSelectedDepartment}
          selectedEmploymentType={selectedEmploymentType}
          onEmploymentTypeChange={setSelectedEmploymentType}
        />

        <AdvancedFilterPanel
          filters={advancedFilters}
          onFiltersChange={setAdvancedFilters}
        />

        <TotalsSummaryBar 
          summary={payrollSummary} 
          filteredEmployeeCount={filteredEmployees.length}
          totalEmployeeCount={employees.length}
        />

        <div className="bg-white">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};