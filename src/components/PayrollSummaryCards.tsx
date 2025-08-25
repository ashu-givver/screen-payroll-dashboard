import { formatCurrency } from '@/lib/formatters';
import { PayrollSummary, CustomView } from '@/types/payroll';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  Coins,
  Building,
  PiggyBank,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  FileEdit
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface SummaryCard {
  id: string;
  title: string;
  value: string;
  change: number;
  changeType: 'increase' | 'decrease';
  icon: React.ComponentType<{ className?: string }>;
}

interface PayrollSummaryCardsProps {
  summary: PayrollSummary;
  filteredEmployeeCount: number;
  totalEmployeeCount: number;
  onCardClick: (cardId: string) => void;
  activeCard?: string;
  customView?: CustomView;
  onCreateCustomView: () => void;
  onEditCustomView: () => void;
  onDeleteCustomView: () => void;
}

export const PayrollSummaryCards = ({ 
  summary, 
  filteredEmployeeCount, 
  totalEmployeeCount,
  onCardClick,
  activeCard,
  customView,
  onCreateCustomView,
  onEditCustomView,
  onDeleteCustomView
}: PayrollSummaryCardsProps) => {
  const isFiltered = filteredEmployeeCount !== totalEmployeeCount;
  
  // Mock previous month data for comparison
  const previousMonthGross = 84500;
  const previousMonthDeductions = 23100;
  const previousMonthTakeHome = 61400;
  const previousMonthEmployerCost = 97800;

  const grossChange = ((summary.totalIncome - previousMonthGross) / previousMonthGross) * 100;
  const deductionsChange = ((summary.totalDeductions - previousMonthDeductions) / previousMonthDeductions) * 100;
  const takeHomeChange = ((summary.totalTakeHomePay - previousMonthTakeHome) / previousMonthTakeHome) * 100;
  const employerCostChange = ((summary.totalEmployerCost - previousMonthEmployerCost) / previousMonthEmployerCost) * 100;

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
    {
      id: 'gross-pay',
      title: 'Gross Pay',
      value: formatCurrency(summary.totalIncome),
      change: grossChange,
      changeType: grossChange >= 0 ? 'increase' : 'decrease',
      icon: DollarSign,
    },
    {
      id: 'deductions',
      title: 'Deductions',
      value: formatCurrency(summary.totalDeductions),
      change: deductionsChange,
      changeType: deductionsChange >= 0 ? 'increase' : 'decrease',
      icon: Coins,
    },
    {
      id: 'take-home-pay',
      title: 'Take Home Pay',
      value: formatCurrency(summary.totalTakeHomePay),
      change: takeHomeChange,
      changeType: takeHomeChange >= 0 ? 'increase' : 'decrease',
      icon: PiggyBank,
    },
    {
      id: 'employer-cost',
      title: 'Employer Cost',
      value: formatCurrency(summary.totalEmployerCost),
      change: employerCostChange,
      changeType: employerCostChange >= 0 ? 'increase' : 'decrease',
      icon: Building,
    },
  ];

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

  const renderCustomViewCard = () => {
    if (customView) {
      const isActive = activeCard === 'custom-view';
      
      return (
        <Card 
          className={`cursor-pointer transition-all duration-200 hover:shadow-md border ${
            isActive 
              ? 'border-primary bg-primary/5 shadow-md' 
              : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
          onClick={() => onCardClick('custom-view')}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <FileEdit className={`h-4 w-4 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Custom View
                </span>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <MoreVertical className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEditCustomView(); }}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit fields
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEditCustomView(); }}>
                    <FileEdit className="h-4 w-4 mr-2" />
                    Rename view
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={(e) => { e.stopPropagation(); onDeleteCustomView(); }}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete view
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <div className="space-y-2">
              <div className="text-lg font-bold text-foreground">
                {customView.name}
              </div>
              
              <div className="text-xs text-muted-foreground">
                {customView.fields.length} field{customView.fields.length !== 1 ? 's' : ''} selected
              </div>
            </div>
          </CardContent>
        </Card>
      );
    } else {
      return (
        <Card 
          className="cursor-pointer transition-all duration-200 hover:shadow-md border border-dashed border-gray-300 bg-gray-50/50 hover:border-primary hover:bg-primary/5"
          onClick={onCreateCustomView}
        >
          <CardContent className="p-4">
            <div className="flex flex-col items-center justify-center space-y-2 text-center h-full min-h-[100px]">
              <Plus className="h-6 w-6 text-muted-foreground" />
              <div className="text-sm font-medium text-muted-foreground">
                Create Custom View
              </div>
              <div className="text-xs text-muted-foreground">
                Choose your own columns
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }
  };

  return (
    <div className="px-6 py-4 bg-gray-50/50 border-b border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-sm font-medium text-gray-900">
          Pay Summary for {isFiltered ? `${filteredEmployeeCount} of ${totalEmployeeCount}` : filteredEmployeeCount} employees
        </h3>
        {isFiltered && (
          <Badge variant="secondary" className="text-xs">
            Filtered
          </Badge>
        )}
      </div>
      
      {/* Pay & Cost Metrics + Custom View */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {summaryCards.map(renderCard)}
        {renderCustomViewCard()}
      </div>
    </div>
  );
};