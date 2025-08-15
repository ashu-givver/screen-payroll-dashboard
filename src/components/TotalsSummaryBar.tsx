import { formatCurrency } from '@/lib/formatters';
import { PayrollSummary } from '@/types/payroll';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign, Coins, PiggyBank, Building, UserCheck } from 'lucide-react';

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
  const previousMonthHeadcount = 8;
  const previousMonthPayDifferences = 3;

  const grossChange = ((summary.totalIncome - previousMonthGross) / previousMonthGross) * 100;
  const deductionsChange = ((summary.totalDeductions - previousMonthDeductions) / previousMonthDeductions) * 100;
  const takeHomeChange = ((summary.totalTakeHomePay - previousMonthTakeHome) / previousMonthTakeHome) * 100;
  const employerCostChange = ((summary.totalEmployerCost - previousMonthEmployerCost) / previousMonthEmployerCost) * 100;
  const headcountChange = ((totalEmployeeCount - previousMonthHeadcount) / previousMonthHeadcount) * 100;
  const payDifferencesCount = 4; // Mock: employees with pay differences
  const payDifferencesChange = ((payDifferencesCount - previousMonthPayDifferences) / previousMonthPayDifferences) * 100;

  const formatChange = (change: number) => {
    const absChange = Math.abs(change);
    const Icon = change >= 0 ? TrendingUp : TrendingDown;
    const colorClass = change >= 0 ? 'text-green-600' : 'text-red-600';
    
    return (
      <div className={`flex items-center gap-1 ${colorClass}`}>
        <Icon className="h-3 w-3" />
        <span className="text-xs font-medium">{absChange.toFixed(1)}%</span>
      </div>
    );
  };

  const summaryCards = [
    {
      title: 'Gross Pay',
      value: formatCurrency(summary.totalIncome),
      change: grossChange,
      icon: DollarSign,
    },
    {
      title: 'Deductions',
      value: formatCurrency(summary.totalDeductions),
      change: deductionsChange,
      icon: Coins,
    },
    {
      title: 'Take Home Pay',
      value: formatCurrency(summary.totalTakeHomePay),
      change: takeHomeChange,
      icon: PiggyBank,
    },
    {
      title: 'Employer Cost',
      value: formatCurrency(summary.totalEmployerCost),
      change: employerCostChange,
      icon: Building,
    },
    {
      title: 'Net Differences',
      value: payDifferencesCount.toString(),
      change: payDifferencesChange,
      icon: UserCheck,
    },
  ];

  return (
    <div className="px-6 py-4 bg-gray-50/50 border-b border-gray-200">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          
          return (
            <Card key={card.title} className="border-gray-200 bg-white hover:border-gray-300 transition-all duration-200">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      {card.title}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-foreground">
                    {card.value}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    {formatChange(card.change)}
                    <span className="text-xs text-muted-foreground">vs last month</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};