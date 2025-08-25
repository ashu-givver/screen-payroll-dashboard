import { Card, CardContent } from '@/components/ui/card';
import { PoundSterling, Minus, Calculator, TrendingUpDown } from 'lucide-react';
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
  currentView: 'gross-pay' | 'deductions' | 'employer-cost' | 'total';
  viewMode: 'compact' | 'detailed';
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
  viewMode
}: StaticTopSectionProps) => {

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


  const renderCard = (card: any, isClickable = true, isMainCard = false) => {
    const IconComponent = card.icon;
    const isActive = activeCard === card.id;
    const isCurrentView = isMainCard && currentView === card.id;
    
    const isCardClickable = isClickable;
    
    return (
      <Card 
        key={card.id}
        className={`transition-all duration-200 ${
          isCardClickable ? 'cursor-pointer hover:shadow-md' : 'cursor-default'
        } ${
          isActive || isCurrentView ? 'ring-2 ring-primary bg-primary/5' : 
          isCardClickable ? 'hover:bg-gray-50' : ''
        }`}
        onClick={() => isCardClickable && onCardClick(card.id)}
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
            {card.change && (
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
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="px-6 py-4">
        {/* Main Cards Row */}
        {viewMode === 'detailed' ? (
          // Detailed View: Show 4 cards including Total View
          <div className="grid grid-cols-4 gap-4 mb-4">
            {mainCards.map(card => renderCard(card, true, true))}
            {/* Add Total View card */}
            {renderCard({
              id: 'total',
              title: 'Total View',
              value: 'All Details',
              change: '',
              icon: TrendingUpDown,
              type: 'neutral' as const
            }, true, true)}
          </div>
        ) : (
          // Compact View: Show original 3 cards
          <div className="grid grid-cols-3 gap-4 mb-4">
            {mainCards.map(card => renderCard(card, true, true))}
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