import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronRight, Users, Calendar, DollarSign } from 'lucide-react';
import { payrollCycles, PayrollCycle } from '@/data/payrollCycles';
import { useNavigate } from 'react-router-dom';

const PayrollCycles = () => {
  const navigate = useNavigate();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(amount);
  };

  const getStatusVariant = (status: PayrollCycle['status']) => {
    switch (status) {
      case 'Current':
        return 'default';
      case 'Submitted':
        return 'secondary';
      case 'Completed':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const handleCycleClick = (cycle: PayrollCycle) => {
    if (cycle.status === 'Current') {
      navigate('/preview');
    }
  };

  const currentCycles = payrollCycles.filter(cycle => cycle.status === 'Current');
  const submittedCycles = payrollCycles.filter(cycle => cycle.status === 'Submitted');
  const completedCycles = payrollCycles.filter(cycle => cycle.status === 'Completed');

  const CycleCard = ({ cycle }: { cycle: PayrollCycle }) => (
    <Card 
      className={`transition-all hover:shadow-sm ${cycle.status === 'Current' ? 'cursor-pointer hover:border-primary/50' : ''}`}
      onClick={() => handleCycleClick(cycle)}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <h3 className="font-semibold text-card-foreground">{cycle.period}</h3>
              <Badge variant={getStatusVariant(cycle.status)}>
                {cycle.status}
              </Badge>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{cycle.startDate} - {cycle.endDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>{cycle.employeeCount} employees</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                <span>{formatCurrency(cycle.totalPay)}</span>
              </div>
            </div>

            {cycle.status === 'Submitted' && cycle.submittedDate && (
              <div className="text-sm text-muted-foreground">
                Submitted: {cycle.submittedDate}
              </div>
            )}

            {cycle.status === 'Completed' && cycle.completedDate && (
              <div className="text-sm text-muted-foreground">
                Completed: {cycle.completedDate}
              </div>
            )}
          </div>

          {cycle.status === 'Current' && (
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto p-6">
          <div>
            <h1 className="text-2xl font-semibold text-card-foreground">Payroll Cycles</h1>
            <p className="text-muted-foreground mt-1">
              Manage and review your payroll cycles across different stages
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Current Section */}
        {currentCycles.length > 0 && (
          <section>
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-foreground">Current</h2>
              <p className="text-sm text-muted-foreground">Active payroll cycle currently being processed</p>
            </div>
            <div className="space-y-3">
              {currentCycles.map(cycle => (
                <CycleCard key={cycle.id} cycle={cycle} />
              ))}
            </div>
          </section>
        )}

        {/* Submitted Section */}
        {submittedCycles.length > 0 && (
          <section>
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-foreground">Submitted</h2>
              <p className="text-sm text-muted-foreground">Payroll cycles submitted for approval</p>
            </div>
            <div className="space-y-3">
              {submittedCycles.map(cycle => (
                <CycleCard key={cycle.id} cycle={cycle} />
              ))}
            </div>
          </section>
        )}

        {/* Completed Section */}
        {completedCycles.length > 0 && (
          <section>
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-foreground">Completed</h2>
              <p className="text-sm text-muted-foreground">Finalized payroll cycles</p>
            </div>
            <div className="space-y-3">
              {completedCycles.map(cycle => (
                <CycleCard key={cycle.id} cycle={cycle} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default PayrollCycles;