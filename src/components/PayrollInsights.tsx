import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Users, UserPlus, UserMinus, PiggyBank, UserX, DollarSign } from 'lucide-react';

interface InsightCard {
  id: string;
  title: string;
  value: number;
  change: number;
  changeType: 'increase' | 'decrease';
  icon: React.ComponentType<{ className?: string }>;
}

interface PayrollInsightsProps {
  onInsightClick: (insightId: string) => void;
  activeInsight?: string;
}

export const PayrollInsights = ({ onInsightClick, activeInsight }: PayrollInsightsProps) => {
  const insights: InsightCard[] = [
    {
      id: 'new-joiners',
      title: 'New Joiners',
      value: 3,
      change: 15.2,
      changeType: 'increase',
      icon: UserPlus,
    },
    {
      id: 'leavers',
      title: 'Leavers',
      value: 1,
      change: -12.5,
      changeType: 'decrease',
      icon: UserMinus,
    },
    {
      id: 'pension-enrolled',
      title: 'Pension Enrolled',
      value: 2,
      change: 8.3,
      changeType: 'increase',
      icon: PiggyBank,
    },
    {
      id: 'pension-opted-out',
      title: 'Pension Opted Out',
      value: 0,
      change: -100,
      changeType: 'decrease',
      icon: UserX,
    },
    {
      id: 'salary-changes',
      title: 'Salary Changes',
      value: 4,
      change: 25.0,
      changeType: 'increase',
      icon: DollarSign,
    },
  ];

  const formatChange = (change: number, changeType: 'increase' | 'decrease') => {
    const absChange = Math.abs(change);
    const Icon = changeType === 'increase' ? TrendingUp : TrendingDown;
    const colorClass = changeType === 'increase' ? 'text-green-600' : 'text-red-600';
    
    return (
      <div className={`flex items-center gap-1 ${colorClass}`}>
        <Icon className="h-3 w-3" />
        <span className="text-xs font-medium">{absChange}%</span>
      </div>
    );
  };

  return (
    <div className="px-6 py-4 bg-gray-50/50">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {insights.map((insight) => {
          const Icon = insight.icon;
          const isActive = activeInsight === insight.id;
          
          return (
            <Card 
              key={insight.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-md border ${
                isActive 
                  ? 'border-primary bg-primary/5 shadow-md' 
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
              onClick={() => onInsightClick(insight.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Icon className={`h-4 w-4 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      {insight.title}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-foreground">
                    {insight.value}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    {formatChange(insight.change, insight.changeType)}
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