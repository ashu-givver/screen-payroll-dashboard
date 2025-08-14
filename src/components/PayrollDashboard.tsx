import { useState, useMemo } from 'react';
import { TabType } from '@/types/payroll';
import { employees, payrollPeriod, payrollSummary } from '@/data/employees';
import { PayrollHeader } from '@/components/PayrollHeader';
import { PayrollTabs } from '@/components/PayrollTabs';
import { PayrollActions } from '@/components/PayrollActions';
import { SummaryTable } from '@/components/tables/SummaryTable';
import { IncomeTable } from '@/components/tables/IncomeTable';
import { DeductionsTable } from '@/components/tables/DeductionsTable';
import { EmployerCostTable } from '@/components/tables/EmployerCostTable';
import { useToast } from '@/hooks/use-toast';

export const PayrollDashboard = () => {
  const [activeTab, setActiveTab] = useState<TabType>('summary');
  const [searchValue, setSearchValue] = useState('');
  const { toast } = useToast();

  const filteredEmployees = useMemo(() => {
    if (!searchValue) return employees;
    return employees.filter(employee =>
      employee.name.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [searchValue]);

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

  const renderTabContent = () => {
    switch (activeTab) {
      case 'summary':
        return <SummaryTable employees={filteredEmployees} summary={payrollSummary} />;
      case 'income':
        return <IncomeTable employees={filteredEmployees} summary={payrollSummary} />;
      case 'deductions':
        return <DeductionsTable employees={filteredEmployees} summary={payrollSummary} />;
      case 'employer-cost':
        return <EmployerCostTable employees={filteredEmployees} summary={payrollSummary} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto">
        <PayrollHeader period={payrollPeriod} onConfirm={handleConfirm} />
        <PayrollTabs activeTab={activeTab} onTabChange={setActiveTab} />
        <PayrollActions
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          onExport={handleExport}
          onImport={handleImport}
        />
        <div className="border-t border-border">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};