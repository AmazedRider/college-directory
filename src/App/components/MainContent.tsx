import React, { useState } from 'react';
import { SearchSection, FilterOptions } from './SearchSection';
import { AgencyListings } from './AgencyListings';

export function MainContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({
    minRating: 0,
    maxPrice: '',
    specializations: [],
    verifiedOnly: false,
    location: ''
  });

  return (
    <div className="flex-1">
      <SearchSection
        onSearch={setSearchQuery}
        onFilterChange={setFilters}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Consultants</h2>
        <AgencyListings searchQuery={searchQuery} filters={filters} />
      </div>
    </div>
  );
}