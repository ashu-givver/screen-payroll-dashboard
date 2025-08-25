import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle } from 'lucide-react';

interface PayrollInsightsProps {
  onInsightClick: (insightId: string) => void;
  activeInsight?: string;
}

export const PayrollInsights = ({ onInsightClick, activeInsight }: PayrollInsightsProps) => {
  return (
    <div className="px-6 py-4 bg-gray-50/50">
      <Card className="border-l-4 border-l-primary">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-primary" />
            <div>
              <h3 className="font-medium text-foreground">Insights Now Available as Filters</h3>
              <p className="text-sm text-muted-foreground">
                All insights have been moved to the Filter dropdown above for better data analysis. 
                Use the filters to focus on specific employee groups or payroll changes.
              </p>
            </div>
            <Badge variant="secondary" className="ml-auto">
              Updated
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};