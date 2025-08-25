import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ChevronRight, Search, Calendar } from 'lucide-react';
import { payrollCycles, PayrollCycle } from '@/data/payrollCycles';
import { useNavigate } from 'react-router-dom';

const PayrollCycles = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

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

  const getStatusColor = (status: PayrollCycle['status']) => {
    switch (status) {
      case 'Current':
        return 'text-muted-foreground bg-muted';
      case 'Submitted':
        return 'text-warning-foreground bg-warning';
      case 'Completed':
        return 'text-success-foreground bg-success';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  const handleCycleClick = (cycle: PayrollCycle) => {
    if (cycle.status === 'Current') {
      navigate('/preview');
    }
  };

  const filteredCycles = payrollCycles.filter(cycle =>
    cycle.period.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cycle.month.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cycle.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentCycles = filteredCycles.filter(cycle => cycle.status === 'Current');
  const submittedCycles = filteredCycles.filter(cycle => cycle.status === 'Submitted');
  const completedCycles = filteredCycles.filter(cycle => cycle.status === 'Completed');

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto p-6">
          <h1 className="text-2xl font-semibold text-card-foreground">Payroll</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Pay run section with search */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Pay run</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by date, month or status"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-64"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="space-y-6">
          {/* Current Section */}
          {currentCycles.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-3">Current</h3>
              <div className="space-y-1">
                {currentCycles.map(cycle => (
                  <div
                    key={cycle.id}
                    className={`flex items-center justify-between p-4 rounded-lg border bg-card transition-all ${
                      cycle.status === 'Current' ? 'cursor-pointer hover:shadow-sm hover:border-primary/50' : ''
                    }`}
                    onClick={() => handleCycleClick(cycle)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <div className="font-medium text-card-foreground">{cycle.month} {cycle.year}</div>
                        <div className="text-sm text-muted-foreground">Monthly pay</div>
                      </div>
                    </div>
                    
                    <div className="text-sm text-muted-foreground">
                      {cycle.endDate}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(cycle.status)}>
                        {cycle.status.toUpperCase()}
                      </Badge>
                      {cycle.status === 'Current' && (
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Submitted Section */}
          {submittedCycles.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-3">Submitted</h3>
              <div className="space-y-1">
                {submittedCycles.map(cycle => (
                  <div
                    key={cycle.id}
                    className="flex items-center justify-between p-4 rounded-lg border bg-card"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-warning/20">
                        <Calendar className="h-4 w-4 text-warning" />
                      </div>
                      <div>
                        <div className="font-medium text-card-foreground">{cycle.month} {cycle.year}</div>
                        <div className="text-sm text-muted-foreground">Monthly pay</div>
                      </div>
                    </div>
                    
                    <div className="text-sm text-muted-foreground">
                      {cycle.endDate}
                    </div>
                    
                    <Badge className={getStatusColor(cycle.status)}>
                      {cycle.status.toUpperCase()}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Completed Section */}
          {completedCycles.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-3">Completed</h3>
              <div className="space-y-1">
                {completedCycles.map(cycle => (
                  <div
                    key={cycle.id}
                    className="flex items-center justify-between p-4 rounded-lg border bg-card"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-success/20">
                        <Calendar className="h-4 w-4 text-success" />
                      </div>
                      <div>
                        <div className="font-medium text-card-foreground">{cycle.month} {cycle.year}</div>
                        <div className="text-sm text-muted-foreground">Monthly pay</div>
                      </div>
                    </div>
                    
                    <div className="text-sm text-muted-foreground">
                      {cycle.endDate}
                    </div>
                    
                    <Badge className={getStatusColor(cycle.status)}>
                      {cycle.status.toUpperCase()}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PayrollCycles;