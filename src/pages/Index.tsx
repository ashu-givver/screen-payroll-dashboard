import { PayrollDashboard } from '@/components/PayrollDashboard';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Preview Banner */}
      <div className="bg-primary/5 border-b border-border p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Current Payroll Dashboard
              </h2>
              <p className="text-sm text-muted-foreground">
                Full-featured payroll management interface
              </p>
            </div>
          </div>
          <Link to="/preview">
            <Button variant="outline" className="gap-2">
              <Sparkles className="h-4 w-4" />
              Try New Persona-Based Design
            </Button>
          </Link>
        </div>
      </div>

      <PayrollDashboard />
    </div>
  );
};

export default Index;