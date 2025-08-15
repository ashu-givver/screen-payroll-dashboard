import { useState, useMemo } from 'react';
import { TabType, AdvancedFilter, SavedFilterView } from '@/types/payroll';
import { employees, payrollPeriod, payrollSummary } from '@/data/employees';
import { PayrollHeader } from '@/components/PayrollHeader';
import { PayrollTabs } from '@/components/PayrollTabs';
import { SmartFilterPanel } from '@/components/SmartFilterPanel';
import { AdvancedFilterPanel } from '@/components/AdvancedFilterPanel';
import { TotalsSummaryBar } from '@/components/TotalsSummaryBar';
import { ViewModeToggle } from '@/components/ViewModeToggle';
import { PayrollInsights } from '@/components/PayrollInsights';
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
  const [savedViews, setSavedViews] = useState<SavedFilterView[]>([]);
  const [employeeData, setEmployeeData] = useState(employees);
  const [activeInsight, setActiveInsight] = useState<string>();
  const { toast } = useToast();

  const filteredEmployees = useMemo(() => {
    return employeeData.filter(employee => {
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
      
      // Insight-based filtering
      if (activeInsight) {
        switch (activeInsight) {
          case 'new-joiners':
            // Filter to show only new joiners (employees 1, 2, 3 based on mock data)
            if (!['1', '2', '3'].includes(employee.id)) return false;
            break;
          case 'leavers':
            // Filter to show only leavers (employee 4 based on mock data)
            if (!['4'].includes(employee.id)) return false;
            break;
          case 'pension-enrolled':
            // Filter to show employees newly enrolled in pension (employees 5, 6 based on mock data)
            if (!['5', '6'].includes(employee.id)) return false;
            break;
          case 'pension-opted-out':
            // Filter to show employees who opted out of pension (none in current mock data)
            return false;
            break;
          case 'salary-changes':
            // Filter to show employees with salary changes (employees 1, 3, 5, 7 based on mock data)
            if (!['1', '3', '5', '7'].includes(employee.id)) return false;
            break;
        }
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
  }, [searchValue, showChangesOnly, selectedDepartment, selectedEmploymentType, advancedFilters, employeeData, activeInsight]);

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

  const handleEmployeeUpdate = (employeeId: string, field: string, value: number) => {
    setEmployeeData(prev => prev.map(employee => {
      if (employee.id === employeeId) {
        const updatedEmployee = { ...employee, [field]: value };
        
        // Recalculate total income when pay elements change
        if (['basePay', 'bonus', 'commission', 'overtime', 'gifFlex', 'onCall'].includes(field)) {
          updatedEmployee.totalIncome = 
            updatedEmployee.basePay + 
            updatedEmployee.bonus + 
            updatedEmployee.commission + 
            updatedEmployee.overtime + 
            updatedEmployee.gifFlex + 
            updatedEmployee.onCall;
          
          // Recalculate take home pay (simplified calculation)
          updatedEmployee.takeHomePay = updatedEmployee.totalIncome - updatedEmployee.deductions;
        }
        
        return updatedEmployee;
      }
      return employee;
    }));
    
    const fieldLabels: Record<string, string> = {
      basePay: 'Base Pay',
      bonus: 'Bonus',
      commission: 'Commission',
      overtime: 'Overtime',
      gifFlex: 'GIF Flex',
      onCall: 'OnCall'
    };
    
    toast({
      title: "Payment Updated",
      description: `${fieldLabels[field] || field} updated for employee.`,
    });
  };

  const handleSaveView = (view: Omit<SavedFilterView, 'id'>) => {
    const newView: SavedFilterView = {
      ...view,
      id: Math.random().toString(36).substr(2, 9)
    };
    setSavedViews(prev => [...prev, newView]);
    toast({
      title: "View Saved",
      description: `Filter view "${view.name}" has been saved.`,
    });
  };

  const handleLoadView = (view: SavedFilterView) => {
    setAdvancedFilters([...view.filters]);
    setShowChangesOnly(view.basicFilters.showChangesOnly);
    setSelectedDepartment(view.basicFilters.department);
    setSelectedEmploymentType(view.basicFilters.employmentType);
    toast({
      title: "View Loaded",
      description: `Applied filter view "${view.name}".`,
    });
  };

  const handleInsightClick = (insightId: string) => {
    if (activeInsight === insightId) {
      // Clicking the same insight deactivates it
      setActiveInsight(undefined);
    } else {
      // Clicking a different insight activates it
      setActiveInsight(insightId);
      // Clear other filters when insight is selected for clarity
      setShowChangesOnly(false);
      setSelectedDepartment('all');
      setSelectedEmploymentType('all');
      setSearchValue('');
    }
  };

  const renderTabContent = () => {
    const commonProps = {
      employees: filteredEmployees,
      summary: payrollSummary,
      approvedEmployees,
      onApproveEmployee: handleApproveEmployee,
      onEmployeeUpdate: handleEmployeeUpdate,
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
          savedViews={savedViews}
          onSaveView={handleSaveView}
          onLoadView={handleLoadView}
          currentBasicFilters={{
            showChangesOnly,
            department: selectedDepartment,
            employmentType: selectedEmploymentType
          }}
        />

        <PayrollInsights 
          onInsightClick={handleInsightClick}
          activeInsight={activeInsight}
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