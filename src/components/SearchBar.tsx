
import { useState } from 'react';
import { Search, Filter, SortAsc, SortDesc } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FilterOptions } from '@/types/gallery';

interface SearchBarProps {
  onFilterChange: (filters: FilterOptions) => void;
  totalResults: number;
}

export const SearchBar = ({ onFilterChange, totalResults }: SearchBarProps) => {
  const [filters, setFilters] = useState<FilterOptions>({
    searchTerm: '',
    sortBy: 'galleryName',
    sortOrder: 'asc'
  });

  const updateFilters = (newFilters: Partial<FilterOptions>) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);
    onFilterChange(updated);
  };

  const toggleSortOrder = () => {
    updateFilters({ sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc' });
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 p-4 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search images by gallery name..."
                value={filters.searchTerm}
                onChange={(e) => updateFilters({ searchTerm: e.target.value })}
                className="pl-10 bg-white/90"
              />
            </div>
          </div>
          
          <div className="flex gap-2 items-center">
            <Filter className="h-4 w-4 text-gray-500" />
            <Select value={filters.sortBy} onValueChange={(value: 'galleryName' | 'url') => updateFilters({ sortBy: value })}>
              <SelectTrigger className="w-40 bg-white/90">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="galleryName">Sort by Gallery</SelectItem>
                <SelectItem value="url">Sort by URL</SelectItem>
              </SelectContent>
            </Select>
            
            <Button
              variant="outline"
              size="sm"
              onClick={toggleSortOrder}
              className="bg-white/90"
            >
              {filters.sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        
        <div className="mt-2 text-sm text-gray-600">
          Showing {totalResults} images
        </div>
      </div>
    </div>
  );
};
