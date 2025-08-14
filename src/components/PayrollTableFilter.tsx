import { Search, Filter } from 'lucide-react';
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
    <div className="flex items-center gap-3 mb-4">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder={placeholder}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
      <Button variant="outline" size="sm" className="text-gray-600 border-gray-200 hover:bg-gray-50">
        <Filter className="h-4 w-4 mr-2" />
        Filter
      </Button>
    </div>
  );
};