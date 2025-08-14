import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, Plus, X } from 'lucide-react';
import { AdvancedFilter } from '@/types/payroll';

interface AdvancedFilterPanelProps {
  filters: AdvancedFilter[];
  onFiltersChange: (filters: AdvancedFilter[]) => void;
}

const PAY_ELEMENTS = [
  { value: 'basePay', label: 'Base Pay' },
  { value: 'bonus', label: 'Bonus' },
  { value: 'commission', label: 'Commission' },
  { value: 'overtime', label: 'Overtime' },
  { value: 'gifFlex', label: 'GIF Flex' },
  { value: 'onCall', label: 'OnCall' },
  { value: 'totalIncome', label: 'Gross Pay' },
  { value: 'deductions', label: 'Total Deductions' },
  { value: 'takeHomePay', label: 'Take Home Pay' },
  { value: 'employerCost', label: 'Employer Cost' },
];

const CONDITIONS = [
  { value: 'greater', label: '>' },
  { value: 'less', label: '<' },
  { value: 'equal', label: '=' },
];

export const AdvancedFilterPanel = ({ filters, onFiltersChange }: AdvancedFilterPanelProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const addFilter = () => {
    const newFilter: AdvancedFilter = {
      id: Math.random().toString(36).substr(2, 9),
      payElement: 'basePay',
      condition: 'greater',
      value: 0,
      isPercentage: false,
      compareToLastMonth: false,
    };
    onFiltersChange([...filters, newFilter]);
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

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-2 p-0 h-auto font-medium text-gray-700">
            <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            Advanced Filters
            {filters.length > 0 && (
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                {filters.length}
              </span>
            )}
          </Button>
        </CollapsibleTrigger>
        
        <CollapsibleContent className="space-y-4 mt-4">
          <div className="space-y-3">
            {filters.map((filter) => (
              <div key={filter.id} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <Select
                  value={filter.payElement}
                  onValueChange={(value) => updateFilter(filter.id, { payElement: value })}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PAY_ELEMENTS.map((element) => (
                      <SelectItem key={element.value} value={element.value}>
                        {element.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={filter.condition}
                  onValueChange={(value: 'greater' | 'less' | 'equal') => 
                    updateFilter(filter.id, { condition: value })
                  }
                >
                  <SelectTrigger className="w-16">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
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
                    <SelectContent>
                      <SelectItem value="currency">£</SelectItem>
                      <SelectItem value="percentage">%</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

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
                  className="p-1 h-auto"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={addFilter}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Condition
            </Button>

            {filters.length > 0 && (
              <Button
                onClick={clearAllFilters}
                variant="ghost"
                size="sm"
                className="text-gray-600"
              >
                Clear All Filters
              </Button>
            )}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};