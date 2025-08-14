import { useState, useMemo } from 'react';
import { TabType } from '@/types/payroll';
import { employees, payrollPeriod, payrollSummary } from '@/data/employees';
import { PayrollHeader } from '@/components/PayrollHeader';
import { PayrollTabs } from '@/components/PayrollTabs';
import { SmartFilterPanel } from '@/components/SmartFilterPanel';
import { TotalsSummaryBar } from '@/components/TotalsSummaryBar';
import { ViewModeToggle } from '@/components/ViewModeToggle';
import { SummaryTable } from '@/components/tables/SummaryTable';
import { IncomeTable } from '@/components/tables/IncomeTable';
import { DeductionsTable } from '@/components/tables/DeductionsTable';
import { EmployerCostTable } from '@/components/tables/EmployerCostTable';
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
  const { toast } = useToast();

  const filteredEmployees = useMemo(() => {
    return employees.filter(employee => {
      // Search filter
      if (searchValue && !employee.name.toLowerCase().includes(searchValue.toLowerCase())) {
        return false;
      }
      
      // Changes only filter (mock: employees with ID 1,3,5,7 have changes)
      if (showChangesOnly && !['1', '3', '5', '7'].includes(employee.id)) {
        return false;
      }
      
      // Department filter (mock logic)
      if (selectedDepartment !== 'all') {
        return true; // In real app, would check employee.department
      }
      
      // Employment type filter (mock logic)
      if (selectedEmploymentType !== 'all') {
        return true; // In real app, would check employee.employmentType
      }
      
      return true;
    });
  }, [searchValue, showChangesOnly, selectedDepartment, selectedEmploymentType]);

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
      viewMode,
      approvedEmployees,
      onApproveEmployee: handleApproveEmployee,
    };

    switch (activeTab) {
      case 'summary':
        return <SummaryTable {...commonProps} />;
      case 'income':
        return <IncomeTable {...commonProps} />;
      case 'deductions':
        return <DeductionsTable {...commonProps} />;
      case 'employer-cost':
        return <EmployerCostTable {...commonProps} />;
      default:
        return null;
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