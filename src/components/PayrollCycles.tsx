import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ChevronRight, Search, Calendar, MoreHorizontal, CheckCircle, Clock, Play, Eye } from 'lucide-react';
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
        return 'bg-[#2563EB] text-white border-[#2563EB]';
      case 'Submitted':
        return 'bg-[#FBBF24] text-[#111827] border-[#FBBF24]';
      case 'Completed':
        return 'bg-[#16A34A] text-white border-[#16A34A]';
      default:
        return 'bg-[#2563EB] text-white border-[#2563EB]';
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
        {/* Search section */}
        <div className="mb-6">
          <div className="flex items-center justify-end mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search payrolls by date, month or status"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-64"
              />
            </div>
          </div>

          {/* Table Headers */}
          <div className="grid grid-cols-4 gap-4 px-4 py-3 text-sm font-medium text-muted-foreground border-b border-border">
            <div>Current</div>
            <div>Pay Date</div>
            <div>Status</div>
            <div>Action</div>
          </div>
        </div>

        {/* Table Content */}
        <div className="space-y-8">
          {/* Current Section */}
          {currentCycles.length > 0 && (
            <div>
              <div className="space-y-1">
                {currentCycles.map(cycle => (
                  <div
                    key={cycle.id}
                    className="grid grid-cols-4 gap-4 p-4 transition-all border-b border-border last:border-b-0"
                  >
                    <div 
                      className={`flex items-center gap-3 ${
                        cycle.status === 'Current' ? 'cursor-pointer hover:text-primary' : ''
                      }`}
                      onClick={() => handleCycleClick(cycle)}
                    >
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <div className="font-medium text-card-foreground">{cycle.month} {cycle.year}</div>
                        <div className="text-sm text-muted-foreground">Monthly pay</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-sm text-muted-foreground">
                      {cycle.endDate}
                    </div>
                    
                    <div className="flex items-center">
                      <Badge 
                        className={getStatusColor(cycle.status)}
                        aria-label="Payroll in progress"
                      >
                        <Play className="h-3 w-3 mr-1" />
                        IN PROGRESS
                      </Badge>
                    </div>
                    
                    <div className="flex items-center">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        aria-label={`View payroll details for ${cycle.month} ${cycle.year}`}
                        onClick={() => handleCycleClick(cycle)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Submitted Section */}
          {submittedCycles.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-4 px-4">Submitted</h3>
              <div className="space-y-1">
                {submittedCycles.map(cycle => (
                  <div
                    key={cycle.id}
                    className="grid grid-cols-4 gap-4 p-4 border-b border-border last:border-b-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-warning/20">
                        <Calendar className="h-4 w-4 text-warning" />
                      </div>
                      <div>
                        <div className="font-medium text-card-foreground">{cycle.month} {cycle.year}</div>
                        <div className="text-sm text-muted-foreground">Monthly pay</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-sm text-muted-foreground">
                      {cycle.endDate}
                    </div>
                    
                    <div className="flex items-center">
                      <Badge 
                        className={getStatusColor(cycle.status)}
                        aria-label="Payroll submitted"
                      >
                        <Clock className="h-3 w-3 mr-1" />
                        SUBMITTED
                      </Badge>
                    </div>
                    
                    <div className="flex items-center">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        aria-label={`View payroll details for ${cycle.month} ${cycle.year}`}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Completed Section */}
          {completedCycles.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-4 px-4">Completed</h3>
              <div className="space-y-1">
                {completedCycles.map(cycle => (
                  <div
                    key={cycle.id}
                    className="grid grid-cols-4 gap-4 p-4 border-b border-border last:border-b-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-success/20">
                        <Calendar className="h-4 w-4 text-success" />
                      </div>
                      <div>
                        <div className="font-medium text-card-foreground">{cycle.month} {cycle.year}</div>
                        <div className="text-sm text-muted-foreground">Monthly pay</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-sm text-muted-foreground">
                      {cycle.endDate}
                    </div>
                    
                    <div className="flex items-center">
                      <Badge 
                        className={getStatusColor(cycle.status)}
                        aria-label="Payroll completed"
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        COMPLETED
                      </Badge>
                    </div>
                    
                    <div className="flex items-center">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        aria-label={`View payroll details for ${cycle.month} ${cycle.year}`}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
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