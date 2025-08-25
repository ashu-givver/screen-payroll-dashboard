import { PayrollSummaryCards } from '@/components/PayrollSummaryCards';
import { PayrollSummary, Employee, CustomView } from '@/types/payroll';

interface StaticTopSectionProps {
  summary: PayrollSummary;
  employees: Employee[];
  filteredEmployeeCount: number;
  totalEmployeeCount: number;
  onCardClick: (cardId: string) => void;
  activeCard?: string;
  approvedEmployees: Set<string>;
  currentView: 'gross-pay' | 'deductions' | 'employer-cost' | 'total' | 'custom-view';
  customView?: CustomView;
  onCreateCustomView: () => void;
  onEditCustomView: () => void;
  onDeleteCustomView: () => void;
}

export const StaticTopSection = ({ 
  summary, 
  employees, 
  filteredEmployeeCount, 
  totalEmployeeCount,
  onCardClick,
  activeCard,
  approvedEmployees,
  currentView,
  customView,
  onCreateCustomView,
  onEditCustomView,
  onDeleteCustomView
}: StaticTopSectionProps) => {
  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <PayrollSummaryCards
        summary={summary}
        filteredEmployeeCount={filteredEmployeeCount}
        totalEmployeeCount={totalEmployeeCount}
        onCardClick={onCardClick}
        activeCard={currentView}
        customView={customView}
        onCreateCustomView={onCreateCustomView}
        onEditCustomView={onEditCustomView}
        onDeleteCustomView={onDeleteCustomView}
      />
    </div>
  );
};