import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, Plus, X, Save, FolderOpen, Bookmark } from 'lucide-react';
import { AdvancedFilter, SavedFilterView, PayrollSummary } from '@/types/payroll';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';


interface AdvancedFilterPanelProps {
  filters: AdvancedFilter[];
  onFiltersChange: (filters: AdvancedFilter[]) => void;
  savedViews: SavedFilterView[];
  onSaveView: (view: Omit<SavedFilterView, 'id'>) => void;
  onLoadView: (view: SavedFilterView) => void;
  currentBasicFilters: {
    showChangesOnly: boolean;
    department: string;
    employmentType: string;
  };
}

const PAY_ELEMENTS_GROUPED = {
  'Payments': [
    { value: 'bonus', label: 'Bonus', count: 12 },
    { value: 'commission', label: 'Commission', count: 5 },
    { value: 'overtime', label: 'Overtime', count: 8 },
    { value: 'gifFlex', label: 'Inflex', count: 3 },
    { value: 'onCall', label: 'On Call', count: 2 },
  ],
  'Deductions': [
    { value: 'advance', label: 'Advance', count: 4 },
    { value: 'loan', label: 'Loan', count: 3 },
    { value: 'cycleToWork', label: 'Cycle to Work', count: 1 },
  ],
  'Employer Costs': [
    { value: 'employerNI', label: 'Employer NI', count: 100 },
    { value: 'employerPension', label: 'Employer Pension', count: 95 },
    { value: 'employerCost', label: 'Total Employer Cost', count: 100 },
  ],
  'Net Pay': [
    { value: 'takeHomePay', label: 'Take Home Pay', count: 100 },
  ]
};


const CONDITIONS = [
  { value: 'greater', label: 'greater than' },
  { value: 'less', label: 'less than' },
  { value: 'equal', label: 'equal to' },
];

export const AdvancedFilterPanel = ({ 
  filters, 
  onFiltersChange, 
  savedViews, 
  onSaveView, 
  onLoadView, 
  currentBasicFilters
}: AdvancedFilterPanelProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [viewName, setViewName] = useState('');

  const addFilter = (preset?: Partial<AdvancedFilter>) => {
    const newFilter: AdvancedFilter = {
      id: Math.random().toString(36).substr(2, 9),
      payElement: preset?.payElement || 'bonus',
      condition: preset?.condition || 'greater',
      value: preset?.value || 0,
      isPercentage: preset?.isPercentage || false,
      compareToLastMonth: preset?.compareToLastMonth || false,
    };
    onFiltersChange([...filters, newFilter]);
  };


  const getFilterDescription = (filter: AdvancedFilter) => {
    const payElement = Object.values(PAY_ELEMENTS_GROUPED)
      .flat()
      .find(el => el.value === filter.payElement)?.label || filter.payElement;
    const condition = CONDITIONS.find(c => c.value === filter.condition)?.label || filter.condition;
    const valueStr = filter.isPercentage ? `${filter.value}%` : `£${filter.value}`;
    const comparison = filter.compareToLastMonth ? ' vs last month' : '';
    
    return `${payElement} ${condition} ${valueStr}${comparison}`;
  };

  const updateFilter = (id: string, updates: Partial<AdvancedFilter>) => {
    onFiltersChange(filters.map(filter => 
      filter.id === id ? { ...filter, ...updates } : filter
    ));
  };

  const removeFilter = (id: string) => {
    onFiltersChange(filters.filter(filter => filter.id !== id));
  };

  const clearAllFilters = () => {
    onFiltersChange([]);
  };

  const handleSaveView = () => {
    if (viewName.trim()) {
      onSaveView({
        name: viewName.trim(),
        filters: [...filters],
        basicFilters: { ...currentBasicFilters },
        createdAt: new Date().toISOString()
      });
      setViewName('');
      setSaveDialogOpen(false);
    }
  };

  return (
    <div className="bg-white border-b border-border space-y-3">
      {/* Active Filters Pills */}
      {filters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 px-6">
          <span className="text-sm font-medium text-muted-foreground">Active filters:</span>
          {filters.map((filter) => (
            <Badge 
              key={filter.id} 
              variant="secondary" 
              className="flex items-center gap-1 pr-1"
            >
              {getFilterDescription(filter)}
              <Button
                size="sm"
                variant="ghost"
                onClick={() => removeFilter(filter.id)}
                className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground rounded-full"
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}

      <div className="px-6 pb-3">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <div className="flex items-center justify-between">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 p-0 h-auto font-medium text-foreground">
                <Plus className="h-4 w-4" />
                Add Custom Conditions
                {filters.length > 0 && (
                  <Badge variant="outline" className="ml-2">
                    {filters.length}
                  </Badge>
                )}
                <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </Button>
            </CollapsibleTrigger>
            
            {/* Removed Save Current View CTA as requested */}
            <div className="flex items-center gap-2">
              {filters.length > 0 && (
                <Button
                  onClick={clearAllFilters}
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground"
                >
                  Clear All Filters
                </Button>
              )}
            </div>
          </div>

          {/* Saved Views - Quick Access */}
          {savedViews.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="text-sm text-muted-foreground">Quick views:</span>
              {savedViews.map((view) => (
                <Button
                  key={view.id}
                  variant="outline"
                  size="sm"
                  onClick={() => onLoadView(view)}
                  className="h-7 text-xs"
                >
                  <FolderOpen className="h-3 w-3 mr-1" />
                  {view.name}
                </Button>
              ))}
            </div>
          )}
          
          <CollapsibleContent className="space-y-4 mt-4">
            {/* Custom Filters */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Custom Conditions</span>
              </div>
              {filters.map((filter) => (
                <div key={filter.id} className="p-4 bg-muted/50 rounded-lg border border-border">
                  <div className="flex items-center gap-2 text-sm mb-2">
                    <span className="text-muted-foreground">Show employees where</span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Select
                      value={filter.payElement}
                      onValueChange={(value) => updateFilter(filter.id, { payElement: value })}
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border border-border">
                        {Object.entries(PAY_ELEMENTS_GROUPED).map(([group, elements]) => (
                          <div key={group}>
                            <div className="px-2 py-1 text-sm font-medium text-foreground border-b border-border">
                              {group}
                            </div>
                            {elements.map((element) => (
                              <SelectItem key={element.value} value={element.value} className="pl-6">
                                <div className="flex items-center justify-between w-full">
                                  <span>{element.label}</span>
                                  <span className="text-xs text-muted-foreground ml-2">({element.count})</span>
                                </div>
                              </SelectItem>
                            ))}
                          </div>
                        ))}
                      </SelectContent>
                    </Select>

                    <span className="text-muted-foreground">is</span>

                    <Select
                      value={filter.condition}
                      onValueChange={(value: 'greater' | 'less' | 'equal') => 
                        updateFilter(filter.id, { condition: value })
                      }
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border border-border">
                        {CONDITIONS.map((condition) => (
                          <SelectItem key={condition.value} value={condition.value}>
                            {condition.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <div className="flex items-center gap-1">
                      <Input
                        type="number"
                        value={filter.value}
                        onChange={(e) => updateFilter(filter.id, { value: Number(e.target.value) })}
                        className="w-24"
                        placeholder="0"
                      />
                      <Select
                        value={filter.isPercentage ? 'percentage' : 'currency'}
                        onValueChange={(value) => 
                          updateFilter(filter.id, { isPercentage: value === 'percentage' })
                        }
                      >
                        <SelectTrigger className="w-16">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border border-border">
                          <SelectItem value="currency">£</SelectItem>
                          <SelectItem value="percentage">%</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {filter.compareToLastMonth && (
                      <span className="text-muted-foreground">vs last month</span>
                    )}

                    <Label className="flex items-center gap-2 text-sm whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={filter.compareToLastMonth}
                        onChange={(e) => updateFilter(filter.id, { compareToLastMonth: e.target.checked })}
                        className="rounded"
                      />
                      vs Last Month
                    </Label>

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeFilter(filter.id)}
                      className="p-1 h-auto ml-2"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="mt-2 p-2 bg-background rounded text-sm text-muted-foreground border border-border">
                    Filter reads: "{getFilterDescription(filter)}"
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3 pt-2 border-t border-border">
              <Button
                onClick={() => addFilter()}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Custom Condition
              </Button>

              {filters.length > 0 && (
                <Button
                  onClick={clearAllFilters}
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground"
                >
                  Clear All Filters
                </Button>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};