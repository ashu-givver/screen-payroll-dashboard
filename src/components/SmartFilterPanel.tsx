import { useState } from 'react';
import { Search, ChevronDown, Users, Building, Clock, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface SmartFilterPanelProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  showChangesOnly: boolean;
  onToggleChangesOnly: (value: boolean) => void;
  selectedDepartment: string;
  onDepartmentChange: (value: string) => void;
  selectedEmploymentType: string;
  onEmploymentTypeChange: (value: string) => void;
}

export const SmartFilterPanel = ({
  searchValue,
  onSearchChange,
  showChangesOnly,
  onToggleChangesOnly,
  selectedDepartment,
  onDepartmentChange,
  selectedEmploymentType,
  onEmploymentTypeChange,
}: SmartFilterPanelProps) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div className="bg-gray-50/50 border-b border-gray-200 px-6 py-3 space-y-3">
      {/* Basic Filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Button
              variant={showChangesOnly ? "default" : "outline"}
              size="sm"
              onClick={() => onToggleChangesOnly(!showChangesOnly)}
              className="h-7 text-xs"
            >
              <Users className="h-3 w-3 mr-1" />
              Only show changes
            </Button>
            <Button
              variant={!showChangesOnly ? "default" : "outline"}
              size="sm"
              onClick={() => onToggleChangesOnly(false)}
              className="h-7 text-xs"
            >
              All employees
            </Button>
          </div>
          {showChangesOnly && (
            <Badge variant="secondary" className="text-xs">
              7 with changes
            </Badge>
          )}
        </div>
        
        <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="h-7 text-xs text-gray-600">
              <Filter className="h-3 w-3 mr-1" />
              Advanced Filters
              <ChevronDown className={`h-3 w-3 ml-1 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>
        </Collapsible>
      </div>

      {/* Standard Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 h-3 w-3" />
          <Input
            placeholder="Search employees..."
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-7 h-7 text-xs border-gray-200 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        
        <Select value={selectedDepartment} onValueChange={onDepartmentChange}>
          <SelectTrigger className="w-32 h-7 text-xs">
            <Building className="h-3 w-3 mr-1" />
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            <SelectItem value="Engineering">Engineering</SelectItem>
            <SelectItem value="Sales">Sales</SelectItem>
            <SelectItem value="Marketing">Marketing</SelectItem>
            <SelectItem value="Finance">Finance</SelectItem>
            <SelectItem value="Operations">Operations</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedEmploymentType} onValueChange={onEmploymentTypeChange}>
          <SelectTrigger className="w-32 h-7 text-xs">
            <Clock className="h-3 w-3 mr-1" />
            <SelectValue placeholder="Employment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="Full-time">Full-time</SelectItem>
            <SelectItem value="Part-time">Part-time</SelectItem>
            <SelectItem value="Contractor">Contractor</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Advanced Filters */}
      <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
        <CollapsibleContent className="space-y-3">
          <div className="flex items-center gap-3 pt-2 border-t border-gray-200">
            <Select>
              <SelectTrigger className="w-40 h-7 text-xs">
                <SelectValue placeholder="Pay Element Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Pay Elements</SelectItem>
                <SelectItem value="base-pay">Base Pay</SelectItem>
                <SelectItem value="bonus">Bonus</SelectItem>
                <SelectItem value="commission">Commission</SelectItem>
                <SelectItem value="overtime">Overtime</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="w-40 h-7 text-xs">
                <SelectValue placeholder="Approval Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="pending">Pending Approval</SelectItem>
                <SelectItem value="changed">Changed Since Review</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm" className="h-7 text-xs">
              Clear Filters
            </Button>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};