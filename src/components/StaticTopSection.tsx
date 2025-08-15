import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronDown, ChevronUp, Users, TrendingUp, TrendingDown, 
         Shield, ShieldOff, PoundSterling, Minus, Calculator, 
         Banknote, TrendingUpDown, Clock } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';
import { PayrollSummary, Employee } from '@/types/payroll';

interface StaticTopSectionProps {
  summary: PayrollSummary;
  employees: Employee[];
  filteredEmployeeCount: number;
  totalEmployeeCount: number;
  onCardClick: (cardId: string) => void;
  activeCard?: string;
  approvedEmployees: Set<string>;
}

export const StaticTopSection = ({ 
  summary, 
  employees, 
  filteredEmployeeCount, 
  totalEmployeeCount,
  onCardClick,
  activeCard,
  approvedEmployees
}: StaticTopSectionProps) => {
  const [showMoreInsights, setShowMoreInsights] = useState(false);

  // Calculate additional metrics for "More Insights" cards
  const newJoinersCount = employees.filter(emp => ['1', '2', '3'].includes(emp.id)).length;
  const leaversCount = employees.filter(emp => ['4'].includes(emp.id)).length;
  const pensionEnrolledCount = employees.filter(emp => ['5', '6'].includes(emp.id)).length;
  const pensionOptedOutCount = 0; // Based on mock data
  const salaryChangesCount = employees.filter(emp => ['1', '3', '5', '7'].includes(emp.id)).length;
  const pendingApprovalCount = employees.length - approvedEmployees.size;
  
  // Calculate net differences (simplified - would be based on previous month data)
  const netDifferences = 1250.50; // Mock calculation

  const mainCards = [
    {
      id: 'gross-pay',
      title: 'Gross Pay',
      value: formatCurrency(summary.totalIncome),
      change: '+2.1%',
      icon: PoundSterling,
      type: 'positive' as const
    },
    {
      id: 'deductions',
      title: 'Deductions',
      value: formatCurrency(summary.totalDeductions),
      change: '+1.2%',
      icon: Minus,
      type: 'neutral' as const
    },
    {
      id: 'employer-cost',
      title: 'Employer Cost',
      value: formatCurrency(summary.totalEmployerCost),
      change: '+2.3%',
      icon: Calculator,
      type: 'neutral' as const
    }
  ];

  const moreInsightsCards = [
    {
      id: 'total-headcount',
      title: 'Total Employees',
      value: totalEmployeeCount.toString(),
      change: '+2',
      icon: Users,
      type: 'positive' as const
    },
    {
      id: 'new-joiners',
      title: 'New Joiners',
      value: newJoinersCount.toString(),
      change: '+3',
      icon: TrendingUp,
      type: 'positive' as const
    },
    {
      id: 'leavers',
      title: 'Leavers',
      value: leaversCount.toString(),
      change: '+1',
      icon: TrendingDown,
      type: 'negative' as const
    },
    {
      id: 'pension-enrolled',
      title: 'Pension Enrolled',
      value: pensionEnrolledCount.toString(),
      change: '+2',
      icon: Shield,
      type: 'positive' as const
    },
    {
      id: 'pension-opted-out',
      title: 'Pension Opted Out',
      value: pensionOptedOutCount.toString(),
      change: '0',
      icon: ShieldOff,
      type: 'neutral' as const
    },
    {
      id: 'salary-changes',
      title: 'Salary Changes',
      value: salaryChangesCount.toString(),
      change: '+4',
      icon: Banknote,
      type: 'neutral' as const
    },
    {
      id: 'net-differences',
      title: 'Net Differences',
      value: formatCurrency(netDifferences),
      change: '+5.2%',
      icon: TrendingUpDown,
      type: 'positive' as const
    },
    {
      id: 'pending-approval',
      title: 'Pending Approval',
      value: pendingApprovalCount.toString(),
      change: pendingApprovalCount > 0 ? `-${pendingApprovalCount}` : '0',
      icon: Clock,
      type: pendingApprovalCount > 0 ? 'negative' as const : 'neutral' as const
    }
  ];

  const renderCard = (card: any, isClickable = true) => {
    const IconComponent = card.icon;
    const isActive = activeCard === card.id;
    
    return (
      <Card 
        key={card.id}
        className={`transition-all duration-200 cursor-pointer hover:shadow-md ${
          isActive ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-gray-50'
        } ${!isClickable ? 'cursor-default' : ''}`}
        onClick={() => isClickable && onCardClick(card.id)}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${
                card.type === 'positive' ? 'bg-green-100 text-green-600' :
                card.type === 'negative' ? 'bg-red-100 text-red-600' :
                'bg-blue-100 text-blue-600'
              }`}>
                <IconComponent className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className="text-xl font-semibold text-gray-900">{card.value}</p>
              </div>
            </div>
            <div className="text-right">
              <div className={`text-sm font-medium ${
                card.change.startsWith('+') && card.type === 'positive' ? 'text-green-600' :
                card.change.startsWith('+') && card.type === 'negative' ? 'text-red-600' :
                card.change.startsWith('-') && card.type === 'positive' ? 'text-red-600' :
                card.change.startsWith('-') && card.type === 'negative' ? 'text-green-600' :
                'text-gray-600'
              }`}>
                {card.change}
              </div>
              <div className="text-xs text-gray-500">vs last month</div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="px-6 py-4">
        {/* Main Cards Row */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          {mainCards.map(card => renderCard(card))}
        </div>

        {/* More Insights Button */}
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={() => setShowMoreInsights(!showMoreInsights)}
            className="flex items-center gap-2"
          >
            More Insights
            {showMoreInsights ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* More Insights Cards */}
        {showMoreInsights && (
          <div className="mt-4 grid grid-cols-4 gap-3">
            {moreInsightsCards.map(card => renderCard(card))}
          </div>
        )}

        {/* Filter Info */}
        {filteredEmployeeCount !== totalEmployeeCount && (
          <div className="mt-4 text-center">
            <span className="text-sm text-gray-600">
              Showing {filteredEmployeeCount} of {totalEmployeeCount} employees
            </span>
          </div>
        )}
      </div>
    </div>
  );
};