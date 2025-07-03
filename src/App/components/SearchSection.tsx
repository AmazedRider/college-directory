import React, { useState } from 'react';
import { Search, Filter, MapPin, Star, Shield } from 'lucide-react';

interface SearchSectionProps {
  onSearch: (query: string) => void;
  onFilterChange: (filters: FilterOptions) => void;
  searchInputRef?: React.RefObject<HTMLInputElement>;
  filters: FilterOptions;
}

export interface FilterOptions {
  location: string;
  minRating: number;
  maxPrice: string;
  specializations: string[];
  verifiedOnly: boolean;
  sortBy?: 'name' | 'rating' | 'price' | 'trustScore';
}

export function SearchSection({
  onSearch,
  onFilterChange,
  searchInputRef,
  filters,
}: SearchSectionProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleFilterChange = (newFilters: Partial<FilterOptions>) => {
    onFilterChange({ ...filters, ...newFilters });
  };

  const resetFilters = () => {
    const resetFilters = {
      location: '',
      minRating: 0,
      maxPrice: '',
      verifiedOnly: false,
      specializations: [],
      sortBy: 'name' as const
    };
    onFilterChange(resetFilters);
  };

  return (
    <div className="space-y-6">
      {/* Main Search Bar */}
      <form onSubmit={handleSearchSubmit} className="relative">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search consultants by name, location, or specialization..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all duration-200 bg-white shadow-sm"
            />
          </div>
          <button
            type="submit"
            className="px-8 py-4 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Search
          </button>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`px-6 py-4 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 ${
              showFilters 
                ? 'bg-gray-100 text-gray-700 border-2 border-gray-200' 
                : 'bg-white text-primary border-2 border-primary hover:bg-primary hover:text-white'
            }`}
          >
            <Filter className="h-5 w-5" />
            Filters
          </button>
        </div>
      </form>

      {/* Simple Filters */}
      {showFilters && (
        <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/30 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white/90">Quick Filters</h3>
            <button
              onClick={resetFilters}
              className="text-sm text-primary hover:text-primary/80 font-medium bg-white/20 px-4 py-1.5 rounded-full"
            >
              Reset All
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Location Filter */}
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                Location
              </label>
              <input
                type="text"
                placeholder="Enter city or country"
                value={filters.location}
                onChange={(e) => handleFilterChange({ location: e.target.value })}
                className="w-full px-4 py-3 border-0 rounded-xl focus:outline-none focus:ring-4 focus:ring-white/20 bg-white/90 backdrop-blur-sm transition-all duration-200 text-gray-900"
              />
            </div>
            {/* Rating Filter */}
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                Minimum Rating
              </label>
              <select
                value={filters.minRating}
                onChange={(e) => handleFilterChange({ minRating: parseInt(e.target.value) })}
                className="w-full px-4 py-3 text-base rounded-xl border border-pink-100 bg-pink-50 text-gray-900 shadow focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-300 transition-all duration-200 hover:border-pink-300"
              >
                <option value={0}>Any Rating</option>
                <option value={3}>3+ Stars</option>
                <option value={4}>4+ Stars</option>
                <option value={5}>5 Stars</option>
              </select>
            </div>
            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                Sort By
              </label>
              <select
                value={filters.sortBy || 'name'}
                onChange={(e) => handleFilterChange({ sortBy: e.target.value as any })}
                className="w-full px-4 py-3 text-base rounded-xl border border-pink-100 bg-pink-50 text-gray-900 shadow focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-300 transition-all duration-200 hover:border-pink-300"
              >
                <option value="name">Name</option>
                <option value="rating">Rating</option>
                <option value="trustScore">Trust Score</option>
                <option value="price">Price</option>
              </select>
            </div>
          </div>
          {/* Verified Only Toggle */}
          <div className="mt-4 flex items-center">
            <input
              id="verified-only"
              type="checkbox"
              checked={filters.verifiedOnly}
              onChange={(e) => handleFilterChange({ verifiedOnly: e.target.checked })}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label htmlFor="verified-only" className="ml-2 flex items-center gap-2 text-sm text-white/90">
              <Shield className="h-4 w-4 text-primary" />
              Show verified consultants only
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
