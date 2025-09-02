import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/formatters';
import { 
  Users, 
  UserPlus, 
  UserMinus,
  DollarSign,
  Coins,
  Calendar,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

interface PayrollInsightsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PayrollInsightsPanel = ({ isOpen, onClose }: PayrollInsightsPanelProps) => {
  if (!isOpen) return null;

  // Mock data - in real app this would come from props or API
  const headcountData = {
    totalEmployees: 100,
    newJoiners: { current: 5, previous: 3, change: 66.7 },
    leavers: { current: 2, previous: 4, change: -50.0 }
  };

  const paymentsData = [
    { name: 'Bonus', employees: 45, amount: 18750, previousAmount: 16200, change: 15.7 },
    { name: 'Commission', employees: 28, amount: 12400, previousAmount: 11800, change: 5.1 },
    { name: 'Overtime', employees: 32, amount: 8960, previousAmount: 9200, change: -2.6 },
    { name: 'Inflex', employees: 15, amount: 4500, previousAmount: 4200, change: 7.1 },
    { name: 'On Call', employees: 8, amount: 2400, previousAmount: 2600, change: -7.7 }
  ];

  const deductionsData = [
    { name: 'Advance', employees: 12, amount: 3600, previousAmount: 2800, change: 28.6 },
    { name: 'Loan', employees: 8, amount: 2400, previousAmount: 2400, change: 0 },
    { name: 'Cycle to Work', employees: 5, amount: 1250, previousAmount: 1100, change: 13.6 }
  ];

  const absencesData = [
    { name: 'SSP', employees: 3, amount: 900, previousAmount: 1200, change: -25.0 },
    { name: 'SMP', employees: 2, amount: 2800, previousAmount: 1400, change: 100.0 },
    { name: 'SPP', employees: 1, amount: 700, previousAmount: 0, change: null },
    { name: 'ShPP', employees: 0, amount: 0, previousAmount: 0, change: null },
    { name: 'SAP', employees: 1, amount: 350, previousAmount: 700, change: -50.0 }
  ];

  const renderChangeIndicator = (change: number | null) => {
    if (change === null) return <span className="text-xs text-muted-foreground">New</span>;
    
    const Icon = change >= 0 ? TrendingUp : TrendingDown;
    const colorClass = change >= 0 ? 'text-green-600' : 'text-red-600';
    
    return (
      <div className={`flex items-center gap-1 ${colorClass}`}>
        <Icon className="h-3 w-3" />
        <span className="text-xs font-medium">{Math.abs(change).toFixed(1)}%</span>
      </div>
    );
  };

  const renderMetricCard = (title: string, data: any[], icon: React.ComponentType<{ className?: string }>) => {
    const Icon = icon;
    
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            <Icon className="h-4 w-4" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{item.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {item.employees} emp
                  </Badge>
                </div>
                <div className="text-lg font-bold">{formatCurrency(item.amount)}</div>
              </div>
              <div className="text-right">
                {renderChangeIndicator(item.change)}
                <div className="text-xs text-muted-foreground">vs last month</div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Payroll Insights</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            ×
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Headcount Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Headcount Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{headcountData.totalEmployees}</div>
                  <div className="text-sm text-muted-foreground">Total Employees</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    <UserPlus className="h-4 w-4 text-green-600" />
                    <span className="text-2xl font-bold">{headcountData.newJoiners.current}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">New Joiners</div>
                  {renderChangeIndicator(headcountData.newJoiners.change)}
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    <UserMinus className="h-4 w-4 text-red-600" />
                    <span className="text-2xl font-bold">{headcountData.leavers.current}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">Leavers</div>
                  {renderChangeIndicator(headcountData.leavers.change)}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Payments */}
            {renderMetricCard('Payments', paymentsData, DollarSign)}
            
            {/* Deductions */}
            {renderMetricCard('Deductions', deductionsData, Coins)}
          </div>

          {/* Absences & Statutory Pay */}
          {renderMetricCard('Absences & Statutory Pay', absencesData, Calendar)}
        </div>
      </div>
    </div>
  );
};