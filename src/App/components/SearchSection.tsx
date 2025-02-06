import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';

interface SearchSectionProps {
  onSearch: (query: string) => void;
  onFilterChange: (filters: FilterOptions) => void;
}

export interface FilterOptions {
  minRating: number;
  maxPrice: string;
  specializations: string[];
  verifiedOnly: boolean;
}

export function SearchSection({ onSearch, onFilterChange }: SearchSectionProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({
    minRating: 0,
    maxPrice: '',
    specializations: [],
    verifiedOnly: false
  });

  const specializations = [
    'Ivy League Admissions',
    'International Students',
    'STEM Programs',
    'Liberal Arts',
    'Scholarship Applications',
    'Test Preparation',
    'Essay Writing',
    'Career Counseling'
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleFilterChange = (newFilters: Partial<FilterOptions>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const handleSpecializationToggle = (specialization: string) => {
    const updatedSpecializations = filters.specializations.includes(specialization)
      ? filters.specializations.filter(s => s !== specialization)
      : [...filters.specializations, specialization];
    
    handleFilterChange({ specializations: updatedSpecializations });
  };

  return (
    <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-white text-center mb-8">
          Find Your Perfect College Consultant
        </h2>
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSearchSubmit} className="flex gap-4 bg-white p-2 rounded-lg shadow-lg">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by location or specialization..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 rounded-md focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors flex items-center gap-2"
            >
              <Search className="h-5 w-5" />
              Search
            </button>
          </form>

          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 text-white hover:text-indigo-200 transition-colors"
            >
              {showFilters ? <X className="h-5 w-5" /> : <Filter className="h-5 w-5" />}
              {showFilters ? 'Close Filters' : 'Filter Results'}
            </button>
          </div>

          {showFilters && (
            <div className="mt-6 bg-white rounded-lg p-6 shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Rating
                  </label>
                  <select
                    value={filters.minRating}
                    onChange={(e) => handleFilterChange({ minRating: Number(e.target.value) })}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="0">Any Rating</option>
                    <option value="3">3+ Stars</option>
                    <option value="4">4+ Stars</option>
                    <option value="5">5 Stars Only</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Price Range
                  </label>
                  <select
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange({ maxPrice: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Any Price</option>
                    <option value="1000">Under $1,000</option>
                    <option value="2500">Under $2,500</option>
                    <option value="5000">Under $5,000</option>
                    <option value="10000">Under $10,000</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Specializations
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {specializations.map((specialization) => (
                      <label
                        key={specialization}
                        className="flex items-center space-x-2 text-sm"
                      >
                        <input
                          type="checkbox"
                          checked={filters.specializations.includes(specialization)}
                          onChange={() => handleSpecializationToggle(specialization)}
                          className="rounded text-indigo-600 focus:ring-indigo-500"
                        />
                        <span>{specialization}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={filters.verifiedOnly}
                      onChange={(e) => handleFilterChange({ verifiedOnly: e.target.checked })}
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Show only verified consultants
                    </span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}