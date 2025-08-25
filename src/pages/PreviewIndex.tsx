import { PersonaBasedDashboard } from '@/components/PersonaBasedDashboard';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const PreviewIndex = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Preview Banner */}
      <div className="bg-primary/10 border-b border-border p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="outline" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Payroll Cycles
              </Button>
            </Link>
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Preview: Persona-Based Design
              </h2>
              <p className="text-sm text-muted-foreground">
                Optimized for both summary viewers and detailed analysts
              </p>
            </div>
          </div>
          <div className="text-sm text-muted-foreground bg-card px-3 py-1 rounded-lg border">
            Preview Mode
          </div>
        </div>
      </div>

      <PersonaBasedDashboard />
    </div>
  );
};

export default PreviewIndex;