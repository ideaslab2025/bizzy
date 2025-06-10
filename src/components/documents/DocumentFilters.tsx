
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Building2, Calculator, Users, Scale, Banknote, Shield, X } from 'lucide-react';

interface DocumentFiltersProps {
  searchQuery: string;
  selectedCategory: string | null;
  onSearchChange: (query: string) => void;
  onCategoryChange: (category: string | null) => void;
  documentCount: number;
}

export const DocumentFilters: React.FC<DocumentFiltersProps> = ({
  searchQuery,
  selectedCategory,
  onSearchChange,
  onCategoryChange,
  documentCount
}) => {
  const categories = [
    { id: 'company-setup', label: 'Company Set-Up', icon: Building2 },
    { id: 'tax-vat', label: 'Tax and VAT', icon: Calculator },
    { id: 'employment', label: 'Employment', icon: Users },
    { id: 'legal-compliance', label: 'Legal Compliance', icon: Scale },
    { id: 'finance', label: 'Finance', icon: Banknote },
    { id: 'data-protection', label: 'Data Protection', icon: Shield }
  ];

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          type="text"
          placeholder="Search documents..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSearchChange('')}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 h-6 w-6"
          >
            <X className="w-3 h-3" />
          </Button>
        )}
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2 lg:gap-3">
        <Button
          variant={selectedCategory === null ? "default" : "outline"}
          size="sm"
          onClick={() => onCategoryChange(null)}
          className="flex items-center gap-2 px-3 py-2"
        >
          All Categories
        </Button>
        
        {categories.map((category) => {
          const IconComponent = category.icon;
          return (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => onCategoryChange(category.id)}
              className="flex items-center gap-2 px-3 py-2"
            >
              <IconComponent className="w-6 h-6" strokeWidth={2} />
              <span className="text-sm font-medium">{category.label}</span>
            </Button>
          );
        })}
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">
            Showing {documentCount} documents
          </span>
          {selectedCategory && (
            <Badge variant="secondary" className="text-xs">
              {categories.find(cat => cat.id === selectedCategory)?.label}
            </Badge>
          )}
        </div>
        
        {(searchQuery || selectedCategory) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              onSearchChange('');
              onCategoryChange(null);
            }}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Clear filters
          </Button>
        )}
      </div>
    </div>
  );
};
