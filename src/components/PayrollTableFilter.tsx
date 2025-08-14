import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface PayrollTableFilterProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
}

export const PayrollTableFilter = ({ 
  searchValue, 
  onSearchChange, 
  placeholder = "Search employees..." 
}: PayrollTableFilterProps) => {
  return (
    <div className="flex items-center justify-between gap-3 mb-3 py-2">
      <div className="relative flex-1 max-w-xs">
        <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder={placeholder}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-8 h-8 text-sm border-gray-200 focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="h-8 text-xs text-gray-600 border-gray-200 hover:bg-gray-50">
          <SlidersHorizontal className="h-3 w-3 mr-1.5" />
          Filters
        </Button>
      </div>
    </div>
  );
};