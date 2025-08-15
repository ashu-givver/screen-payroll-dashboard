import { formatCurrency } from '@/lib/formatters';
import { PayrollSummary } from '@/types/payroll';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  UserPlus, 
  UserMinus, 
  PiggyBank, 
  UserX, 
  DollarSign,
  Coins,
  Building,
  UserCheck
} from 'lucide-react';

interface SummaryCard {
  id: string;
  title: string;
  value: string;
  change: number;
  changeType: 'increase' | 'decrease';
  icon: React.ComponentType<{ className?: string }>;
  type: 'headcount' | 'pay';
}

interface PayrollSummaryCardsProps {
  summary: PayrollSummary;
  filteredEmployeeCount: number;
  totalEmployeeCount: number;
  onCardClick: (cardId: string) => void;
  activeCard?: string;
}

export const PayrollSummaryCards = ({ 
  summary, 
  filteredEmployeeCount, 
  totalEmployeeCount,
  onCardClick,
  activeCard
}: PayrollSummaryCardsProps) => {
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

  const summaryCards: SummaryCard[] = [
    // Headcount & Employee Changes
    {
      id: 'total-headcount',
      title: 'Total Headcount',
      value: totalEmployeeCount.toString(),
      change: headcountChange,
      changeType: headcountChange >= 0 ? 'increase' : 'decrease',
      icon: Users,
      type: 'headcount',
    },
    {
      id: 'new-joiners',
      title: 'New Joiners',
      value: '3',
      change: 15.2,
      changeType: 'increase',
      icon: UserPlus,
      type: 'headcount',
    },
    {
      id: 'leavers',
      title: 'Leavers',
      value: '1',
      change: 12.5,
      changeType: 'decrease',
      icon: UserMinus,
      type: 'headcount',
    },
    {
      id: 'pension-enrolled',
      title: 'Pension Enrolled',
      value: '2',
      change: 8.3,
      changeType: 'increase',
      icon: PiggyBank,
      type: 'headcount',
    },
    {
      id: 'pension-opted-out',
      title: 'Pension Opted Out',
      value: '0',
      change: 100,
      changeType: 'decrease',
      icon: UserX,
      type: 'headcount',
    },
    {
      id: 'salary-changes',
      title: 'Salary Changes',
      value: '4',
      change: 25.0,
      changeType: 'increase',
      icon: DollarSign,
      type: 'headcount',
    },
    // Pay & Cost Metrics
    {
      id: 'gross-pay',
      title: 'Gross Pay',
      value: formatCurrency(summary.totalIncome),
      change: grossChange,
      changeType: grossChange >= 0 ? 'increase' : 'decrease',
      icon: DollarSign,
      type: 'pay',
    },
    {
      id: 'deductions',
      title: 'Deductions',
      value: formatCurrency(summary.totalDeductions),
      change: deductionsChange,
      changeType: deductionsChange >= 0 ? 'increase' : 'decrease',
      icon: Coins,
      type: 'pay',
    },
    {
      id: 'take-home-pay',
      title: 'Take Home Pay',
      value: formatCurrency(summary.totalTakeHomePay),
      change: takeHomeChange,
      changeType: takeHomeChange >= 0 ? 'increase' : 'decrease',
      icon: PiggyBank,
      type: 'pay',
    },
    {
      id: 'employer-cost',
      title: 'Employer Cost',
      value: formatCurrency(summary.totalEmployerCost),
      change: employerCostChange,
      changeType: employerCostChange >= 0 ? 'increase' : 'decrease',
      icon: Building,
      type: 'pay',
    },
    {
      id: 'net-differences',
      title: 'Net Differences',
      value: payDifferencesCount.toString(),
      change: payDifferencesChange,
      changeType: payDifferencesChange >= 0 ? 'increase' : 'decrease',
      icon: UserCheck,
      type: 'pay',
    },
  ];

  const headcountCards = summaryCards.filter(card => card.type === 'headcount');
  const payCards = summaryCards.filter(card => card.type === 'pay');

  const renderCard = (card: SummaryCard) => {
    const Icon = card.icon;
    const isActive = activeCard === card.id;
    
    return (
      <Card 
        key={card.id}
        className={`cursor-pointer transition-all duration-200 hover:shadow-md border ${
          isActive 
            ? 'border-primary bg-primary/5 shadow-md' 
            : 'border-gray-200 bg-white hover:border-gray-300'
        }`}
        onClick={() => onCardClick(card.id)}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <Icon className={`h-4 w-4 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
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
  };

  return (
    <div className="px-6 py-4 bg-gray-50/50 border-b border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-sm font-medium text-gray-900">
          Summary for {isFiltered ? `${filteredEmployeeCount} of ${totalEmployeeCount}` : filteredEmployeeCount} employees
        </h3>
        {isFiltered && (
          <Badge variant="secondary" className="text-xs">
            Filtered
          </Badge>
        )}
      </div>
      
      {/* First row: Headcount & Employee Changes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-4">
        {headcountCards.map(renderCard)}
      </div>
      
      {/* Second row: Pay & Cost Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {payCards.map(renderCard)}
      </div>
    </div>
  );
};