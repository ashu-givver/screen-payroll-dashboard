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
        className={`cursor-pointer transition-all duration-200 hover:shadow-md border max-w-xs ${
          isActive 
            ? 'border-primary bg-primary/5 shadow-md' 
            : 'border-gray-200 bg-white hover:border-gray-300'
        }`}
        onClick={() => onCardClick(card.id)}
      >
        <CardContent className="p-3">
          <div className="flex items-start justify-between mb-1">
            <div className="flex items-center gap-2">
              <Icon className={`h-3 w-3 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
              <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                {card.title}
              </span>
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="text-xl font-bold text-foreground">
              {card.value}
            </div>
            
            <div className="flex items-center justify-between">
              {formatChange(card.change)}
              <span className="text-sm font-medium text-muted-foreground">vs last month</span>
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
          className={`cursor-pointer transition-all duration-200 hover:shadow-md border max-w-xs ${
            isActive 
              ? 'border-primary bg-primary/5 shadow-md' 
              : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
          onClick={() => onCardClick('custom-view')}
        >
          <CardContent className="p-3">
            <div className="flex items-start justify-between mb-1">
              <div className="flex items-center gap-2">
                <FileEdit className={`h-3 w-3 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  Custom View
                </span>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="sm" className="h-5 w-5 p-0">
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
            
            <div className="space-y-1">
              <div className="text-xl font-bold text-foreground">
                {customView.name}
              </div>
              
              <div className="text-sm font-medium text-muted-foreground">
                {customView.fields.length} field{customView.fields.length !== 1 ? 's' : ''} selected
              </div>
            </div>
          </CardContent>
        </Card>
      );
    } else {
      return (
        <Card 
          className="cursor-pointer transition-all duration-200 hover:shadow-md border border-dashed border-gray-300 bg-gray-50/50 hover:border-primary hover:bg-primary/5 max-w-xs"
          onClick={onCreateCustomView}
        >
          <CardContent className="p-3">
            <div className="flex flex-col items-center justify-center space-y-1 text-center h-full min-h-[70px]">
              <Plus className="h-5 w-5 text-muted-foreground" />
              <div className="text-sm font-medium text-muted-foreground">
                Create Custom View
              </div>
              <div className="text-xs text-gray-500">
                Choose your own columns
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }
  };

  return (
    <div className="px-6 py-3 bg-gray-50/50 border-b border-gray-200">
      {isFiltered && (
        <div className="flex items-center gap-2 mb-4">
          <Badge variant="secondary" className="text-xs">
            Showing {filteredEmployeeCount} of {totalEmployeeCount} employees
          </Badge>
        </div>
      )}
      
      {/* Pay & Cost Metrics + Custom View */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {summaryCards.map(renderCard)}
        {renderCustomViewCard()}
      </div>
    </div>
  );
};