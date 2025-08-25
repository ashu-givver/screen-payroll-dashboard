import { PersonaBasedDashboard } from '@/components/PersonaBasedDashboard';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { payrollCycles } from '@/data/payrollCycles';

const PreviewIndex = () => {
  // Get the current payroll cycle (assuming it's the first "Current" one)
  const currentCycle = payrollCycles.find(cycle => cycle.status === 'Current');
  
  return (
    <div className="min-h-screen bg-background">
      {/* Clean Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-foreground hover:text-foreground/80">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-xl font-medium text-foreground">
              {currentCycle?.period || 'July 2025 Payroll'} Dashboard
            </h1>
            <Badge 
              variant={currentCycle?.status === 'Current' ? 'secondary' : 'default'}
              className="ml-2"
            >
              {currentCycle?.status === 'Current' ? 'In Progress' : currentCycle?.status || 'In Progress'}
            </Badge>
          </div>
        </div>
      </div>

      <PersonaBasedDashboard />
    </div>
  );
};

export default PreviewIndex;