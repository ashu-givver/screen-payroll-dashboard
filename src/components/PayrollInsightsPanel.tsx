import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/formatters';
import { 
  Users, 
  UserPlus, 
  UserMinus,
  CreditCard,
  MinusCircle,
  Calendar,
  TrendingUp,
  TrendingDown,
  ArrowUp,
  ArrowDown,
  Minus,
  X,
  PiggyBank
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

  const pensionsData = [
    { name: 'Opt-out', employees: 15, amount: 0, previousAmount: 0, change: -12.5 },
    { name: 'Qualifying', employees: 85, amount: 12750, previousAmount: 0, change: null }
  ];

  const absencesData = [
    { name: 'SSP', employees: 3, amount: 900, previousAmount: 1200, change: -25.0 },
    { name: 'SMP', employees: 2, amount: 2800, previousAmount: 1400, change: 100.0 },
    { name: 'SPP', employees: 1, amount: 700, previousAmount: 0, change: null },
    { name: 'ShPP', employees: 0, amount: 0, previousAmount: 0, change: null },
    { name: 'SAP', employees: 1, amount: 350, previousAmount: 700, change: -50.0 }
  ];

  const renderChangeIndicator = (change: number | null) => {
    if (change === null) {
      return <span className="text-xs text-muted-foreground">New</span>;
    }
    
    if (change === 0) {
      return (
        <div className="flex items-center gap-1 text-muted-foreground">
          <Minus className="h-3 w-3" />
          <span className="text-xs font-medium">0%</span>
        </div>
      );
    }

    const Icon = change >= 0 ? TrendingUp : TrendingDown;
    const colorClass = change >= 0 ? 'text-green-600' : 'text-red-600';
    
    return (
      <div className={`flex items-center gap-1 ${colorClass}`}>
        <Icon className="h-3 w-3" />
        <span className="text-xs font-medium">{Math.abs(change).toFixed(1)}%</span>
      </div>
    );
  };

  const renderMetricRow = (item: any, index: number) => (
    <div key={index} className="flex items-start justify-between mb-1">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          {item.name}
        </span>
        <span className="text-xs text-muted-foreground">({item.employees} emp)</span>
      </div>
    </div>
  );

  const renderMetricCard = (title: string, data: any[], icon: React.ComponentType<{ className?: string }>) => {
    const Icon = icon;
    
    return (
      <Card className="border border-gray-200 bg-white transition-all duration-200 hover:shadow-md hover:border-gray-300">
        <CardContent className="p-3">
          <div className="flex items-start justify-between mb-1">
            <div className="flex items-center gap-2">
              <Icon className="h-3 w-3 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                {title}
              </span>
            </div>
          </div>
          
          <div className="space-y-1">
            {data.map((item, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted-foreground">{item.name}</span>
                  <span className="text-xs text-muted-foreground">{item.employees} emp</span>
                </div>
                <div className="text-xl font-bold text-foreground mb-1">
                  {formatCurrency(item.amount)}
                </div>
                <div className="flex items-center justify-between">
                  {renderChangeIndicator(item.change)}
                  <span className="text-xs font-medium text-muted-foreground">vs last month</span>
                </div>
                {index < data.length - 1 && <div className="border-b border-gray-100 my-2" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-lg">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Payroll Insights</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          {/* 1. Headcount Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Total Employees */}
            <Card className="border border-gray-200 bg-white transition-all duration-200 hover:shadow-md hover:border-gray-300">
              <CardContent className="p-3">
                <div className="flex items-start justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Users className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                      Total Employees
                    </span>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="text-xl font-bold text-foreground">
                    {headcountData.totalEmployees}
                  </div>
                  <div className="text-xs font-medium text-muted-foreground">Active this month</div>
                </div>
              </CardContent>
            </Card>

            {/* New Joiners */}
            <Card className="border border-gray-200 bg-white transition-all duration-200 hover:shadow-md hover:border-gray-300">
              <CardContent className="p-3">
                <div className="flex items-start justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <UserPlus className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                      New Joiners
                    </span>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="text-xl font-bold text-foreground">
                    {headcountData.newJoiners.current}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    {renderChangeIndicator(headcountData.newJoiners.change)}
                    <span className="text-xs font-medium text-muted-foreground">vs last month</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Leavers */}
            <Card className="border border-gray-200 bg-white transition-all duration-200 hover:shadow-md hover:border-gray-300">
              <CardContent className="p-3">
                <div className="flex items-start justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <UserMinus className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                      Leavers
                    </span>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="text-xl font-bold text-foreground">
                    {headcountData.leavers.current}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    {renderChangeIndicator(headcountData.leavers.change)}
                    <span className="text-xs font-medium text-muted-foreground">vs last month</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 2. Payments, Deductions & Pensions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            {renderMetricCard('Payments', paymentsData, CreditCard)}
            {renderMetricCard('Deductions', deductionsData, MinusCircle)}
            {renderMetricCard('Pensions', pensionsData, PiggyBank)}
          </div>

          {/* 3. Absences & Statutory Pay */}
          {renderMetricCard('Absences & Statutory Pay', absencesData, Calendar)}
        </div>
      </div>
    </div>
  );
};