import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Download, Upload, Search } from 'lucide-react';

interface PayrollActionsProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onExport: () => void;
  onImport: () => void;
}

export const PayrollActions = ({ 
  searchValue, 
  onSearchChange, 
  onExport, 
  onImport 
}: PayrollActionsProps) => {
  return (
    <div className="flex items-center justify-between p-6 bg-card">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 w-64"
        />
      </div>
      
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onExport}>
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
        <Button variant="outline" size="sm" onClick={onImport}>
          <Upload className="h-4 w-4 mr-2" />
          Import
        </Button>
      </div>
    </div>
  );
};