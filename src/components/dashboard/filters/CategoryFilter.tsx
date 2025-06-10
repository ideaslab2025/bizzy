
import React from 'react';
import { Button } from '@/components/ui/button';
import { Building2, Calculator, Users, Scale, Banknote, Shield } from 'lucide-react';

interface CategoryFilterProps {
  value: string;
  onChange: (category: string) => void;
  categories: string[];
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({ value, onChange, categories }) => {
  const categoryData = [
    { id: 'all', label: 'All Categories', icon: null },
    { id: 'company-setup', label: 'Company Set-Up', icon: Building2 },
    { id: 'tax-vat', label: 'Tax and VAT', icon: Calculator },
    { id: 'employment', label: 'Employment', icon: Users },
    { id: 'legal-compliance', label: 'Legal Compliance', icon: Scale },
    { id: 'finance', label: 'Finance', icon: Banknote },
    { id: 'data-protection', label: 'Data Protection', icon: Shield }
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {categoryData.map((category) => {
        const IconComponent = category.icon;
        return (
          <Button
            key={category.id}
            variant={value === category.id ? "default" : "outline"}
            size="sm"
            onClick={() => onChange(category.id)}
            className="flex items-center gap-2 px-3 py-2"
          >
            {IconComponent && <IconComponent className="w-6 h-6" strokeWidth={2} />}
            <span className="text-sm font-medium">{category.label}</span>
          </Button>
        );
      })}
    </div>
  );
};
