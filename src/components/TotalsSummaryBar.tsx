import { formatCurrency } from '@/lib/formatters';
import { PayrollSummary } from '@/types/payroll';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface TotalsSummaryBarProps {
  summary: PayrollSummary;
  filteredEmployeeCount: number;
  totalEmployeeCount: number;
}

export const TotalsSummaryBar = ({ 
  summary, 
  filteredEmployeeCount, 
  totalEmployeeCount 
}: TotalsSummaryBarProps) => {
  const isFiltered = filteredEmployeeCount !== totalEmployeeCount;
  
  // Mock previous month data for comparison
  const previousMonthGross = 84500;
  const previousMonthDeductions = 23100;
  const previousMonthTakeHome = 61400;
  const previousMonthEmployerCost = 97800;

  const grossChange = summary.totalIncome - previousMonthGross;
  const deductionsChange = summary.totalDeductions - previousMonthDeductions;
  const takeHomeChange = summary.totalTakeHomePay - previousMonthTakeHome;
  const employerCostChange = summary.totalEmployerCost - previousMonthEmployerCost;

  const ChangeIndicator = ({ value, isPositive }: { value: number; isPositive?: boolean }) => {
    const isIncrease = value > 0;
    const shouldHighlight = isPositive ? isIncrease : !isIncrease;
    
    return (
      <div className={`flex items-center gap-1 text-xs ${
        shouldHighlight ? 'text-green-600' : 'text-red-600'
      }`}>
        {isIncrease ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
        <span>{isIncrease ? '+' : ''}{formatCurrency(value)}</span>
        <span className="text-gray-500">
          ({isIncrease ? '+' : ''}{((Math.abs(value) / (summary.totalIncome - value)) * 100).toFixed(1)}%)
        </span>
      </div>
    );
  };

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium text-gray-900">
            Totals for {isFiltered ? `${filteredEmployeeCount} of ${totalEmployeeCount}` : filteredEmployeeCount} employees
          </h3>
          {isFiltered && (
            <Badge variant="secondary" className="text-xs">
              Filtered
            </Badge>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-4 gap-6">
        <div className="space-y-1">
          <div className="text-xs text-gray-500 uppercase tracking-wide">Gross Pay</div>
          <div className="text-lg font-semibold text-gray-900">{formatCurrency(summary.totalIncome)}</div>
          <ChangeIndicator value={grossChange} isPositive />
        </div>
        
        <div className="space-y-1">
          <div className="text-xs text-gray-500 uppercase tracking-wide">Deductions</div>
          <div className="text-lg font-semibold text-gray-900">{formatCurrency(summary.totalDeductions)}</div>
          <ChangeIndicator value={deductionsChange} />
        </div>
        
        <div className="space-y-1">
          <div className="text-xs text-gray-500 uppercase tracking-wide">Take Home Pay</div>
          <div className="text-lg font-semibold text-gray-900">{formatCurrency(summary.totalTakeHomePay)}</div>
          <ChangeIndicator value={takeHomeChange} isPositive />
        </div>
        
        <div className="space-y-1">
          <div className="text-xs text-gray-500 uppercase tracking-wide">Employer Cost</div>
          <div className="text-lg font-semibold text-gray-900">{formatCurrency(summary.totalEmployerCost)}</div>
          <ChangeIndicator value={employerCostChange} />
        </div>
      </div>
    </div>
  );
};