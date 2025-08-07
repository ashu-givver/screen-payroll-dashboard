import { cn } from '@/lib/utils';
import { TabType } from '@/types/payroll';

interface PayrollTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const tabs: { id: TabType; label: string }[] = [
  { id: 'summary', label: 'Summary' },
  { id: 'income', label: 'Income' },
  { id: 'deductions', label: 'Deductions' },
  { id: 'employer-cost', label: 'Employer cost' }
];

export const PayrollTabs = ({ activeTab, onTabChange }: PayrollTabsProps) => {
  return (
    <div className="border-b border-border bg-card">
      <div className="px-6">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "py-4 px-1 text-sm font-medium border-b-2 transition-colors",
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted"
              )}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};