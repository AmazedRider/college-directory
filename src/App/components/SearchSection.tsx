import React, { useState, forwardRef, useEffect } from 'react';
import { Search, Filter, X, Globe, BookOpen, GraduationCap, MapPin, Star, DollarSign, Shield, Check } from 'lucide-react';

interface SearchSectionProps {
  onSearch: (query: string) => void;
  onFilterChange: (filters: FilterOptions) => void;
  searchInputRef?: React.RefObject<HTMLInputElement>;
}

export interface FilterOptions {
  minRating: number;
  maxPrice: string;
  specializations: string[];
  verifiedOnly: boolean;
  location: string;
}

interface SearchSuggestion {
  type: 'country' | 'course' | 'specialization' | 'location';
  value: string;
  icon: React.ReactNode;
}

export function SearchSection({ onSearch, onFilterChange, searchInputRef }: SearchSectionProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<SearchSuggestion[]>([]);

  const [filters, setFilters] = useState<FilterOptions>({
    minRating: 0,
    maxPrice: '',
    specializations: [],
    verifiedOnly: false,
    location: ''
  });

  // Define searchable items
  const searchSuggestions: SearchSuggestion[] = [
    // Countries
    { type: 'country', value: 'United States', icon: <Globe className="h-4 w-4" /> },
    { type: 'country', value: 'United Kingdom', icon: <Globe className="h-4 w-4" /> },
    { type: 'country', value: 'Canada', icon: <Globe className="h-4 w-4" /> },
    { type: 'country', value: 'Australia', icon: <Globe className="h-4 w-4" /> },
    { type: 'country', value: 'Germany', icon: <Globe className="h-4 w-4" /> },
    { type: 'country', value: 'France', icon: <Globe className="h-4 w-4" /> },
    { type: 'country', value: 'India', icon: <Globe className="h-4 w-4" /> },
    
    // Cities/Locations
    { type: 'location', value: 'Hyderabad, India', icon: <MapPin className="h-4 w-4" /> },
    // Hyderabad Areas
    { type: 'location', value: 'Mehdipatnam, Hyderabad', icon: <MapPin className="h-4 w-4" /> },
    { type: 'location', value: 'Malakpet, Hyderabad', icon: <MapPin className="h-4 w-4" /> },
    { type: 'location', value: 'Santosh Nagar, Hyderabad', icon: <MapPin className="h-4 w-4" /> },
    { type: 'location', value: 'Banjara Hills, Hyderabad', icon: <MapPin className="h-4 w-4" /> },
    { type: 'location', value: 'Jubilee Hills, Hyderabad', icon: <MapPin className="h-4 w-4" /> },
    { type: 'location', value: 'HITEC City, Hyderabad', icon: <MapPin className="h-4 w-4" /> },
    { type: 'location', value: 'Gachibowli, Hyderabad', icon: <MapPin className="h-4 w-4" /> },
    { type: 'location', value: 'Secunderabad, Hyderabad', icon: <MapPin className="h-4 w-4" /> },
    { type: 'location', value: 'Kukatpally, Hyderabad', icon: <MapPin className="h-4 w-4" /> },
    { type: 'location', value: 'Ameerpet, Hyderabad', icon: <MapPin className="h-4 w-4" /> },
    { type: 'location', value: 'Dilsukhnagar, Hyderabad', icon: <MapPin className="h-4 w-4" /> },
    { type: 'location', value: 'LB Nagar, Hyderabad', icon: <MapPin className="h-4 w-4" /> },
    { type: 'location', value: 'Madhapur, Hyderabad', icon: <MapPin className="h-4 w-4" /> },
    { type: 'location', value: 'Begumpet, Hyderabad', icon: <MapPin className="h-4 w-4" /> },
    { type: 'location', value: 'Charminar, Hyderabad', icon: <MapPin className="h-4 w-4" /> },
    { type: 'location', value: 'Abids, Hyderabad', icon: <MapPin className="h-4 w-4" /> },
    { type: 'location', value: 'Koti, Hyderabad', icon: <MapPin className="h-4 w-4" /> },
    { type: 'location', value: 'Uppal, Hyderabad', icon: <MapPin className="h-4 w-4" /> },
    { type: 'location', value: 'ECIL, Hyderabad', icon: <MapPin className="h-4 w-4" /> },
    // Other Cities
    { type: 'location', value: 'Bangalore, India', icon: <MapPin className="h-4 w-4" /> },
    
    // Courses
    { type: 'course', value: 'Computer Science', icon: <BookOpen className="h-4 w-4" /> },
    { type: 'course', value: 'Business Administration', icon: <BookOpen className="h-4 w-4" /> },
    { type: 'course', value: 'Engineering', icon: <BookOpen className="h-4 w-4" /> },
    { type: 'course', value: 'Medicine', icon: <BookOpen className="h-4 w-4" /> },
    { type: 'course', value: 'Law', icon: <BookOpen className="h-4 w-4" /> },
    { type: 'course', value: 'Psychology', icon: <BookOpen className="h-4 w-4" /> },
    { type: 'course', value: 'Data Science', icon: <BookOpen className="h-4 w-4" /> },
    
    // Specializations
    { type: 'specialization', value: 'Ivy League Admissions', icon: <GraduationCap className="h-4 w-4" /> },
    { type: 'specialization', value: 'International Students', icon: <GraduationCap className="h-4 w-4" /> },
    { type: 'specialization', value: 'STEM Programs', icon: <GraduationCap className="h-4 w-4" /> },
    { type: 'specialization', value: 'Liberal Arts', icon: <GraduationCap className="h-4 w-4" /> },
    { type: 'specialization', value: 'Scholarship Applications', icon: <GraduationCap className="h-4 w-4" /> },
    { type: 'specialization', value: 'Test Preparation', icon: <GraduationCap className="h-4 w-4" /> },
    { type: 'specialization', value: 'Essay Writing', icon: <GraduationCap className="h-4 w-4" /> },
    { type: 'specialization', value: 'Career Counseling', icon: <GraduationCap className="h-4 w-4" /> }
  ];

  useEffect(() => {
    if (searchQuery.length > 0) {
      const filtered = searchSuggestions.filter(suggestion =>
        suggestion.value.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (suggestion.type === 'location' && 
         suggestion.value.split(',')[0].toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  const groupedSuggestions = filteredSuggestions.reduce((acc, suggestion) => {
    if (!acc[suggestion.type]) {
      acc[suggestion.type] = [];
    }
    acc[suggestion.type].push(suggestion);
    return acc;
  }, {} as Record<string, SearchSuggestion[]>);

  const handleClickOutside = () => {
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    onSearch(searchQuery.trim());
    if (showFilters) {
      setShowFilters(false);
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setSearchQuery(suggestion.value);
    onSearch(suggestion.value);
    setShowSuggestions(false);
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

  // Handle keyboard navigation for suggestions
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearchSubmit(e as any);
    }
  };

  return (
    <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-white text-center mb-8">
          Find Your Perfect College Consultant
        </h2>
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSearchSubmit} className="relative">
            <div className="flex gap-4 bg-white p-2 rounded-lg shadow-lg">
              <div className="flex-1 relative">
                <div className="flex items-center">
                  <Search className="h-5 w-5 text-gray-400 absolute left-3" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search by country, course, or specialization..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowSuggestions(true);
                    }}
                    className="w-full pl-10 pr-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 border border-gray-200"
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={handleClickOutside}
                    onKeyDown={handleKeyDown}
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setShowSuggestions(false);
                        onSearch('');
                      }}
                      className="absolute right-3 text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>
              <button
                type="submit"
                className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-md hover:shadow-lg"
              >
                <Search className="h-5 w-5" />
                Search
              </button>
            </div>

            {/* Enhanced Search Suggestions */}
            {showSuggestions && Object.keys(groupedSuggestions).length > 0 && (
              <div className="absolute z-50 w-full mt-2 bg-white rounded-lg shadow-lg max-h-[70vh] overflow-y-auto divide-y divide-gray-100">
                {Object.entries(groupedSuggestions).map(([type, suggestions]) => (
                  <div key={type} className="p-2">
                    <div className="px-3 py-2 text-sm font-semibold text-gray-500 capitalize">
                      {type}s
                    </div>
                    <div className="divide-y divide-gray-50">
                      {suggestions.map((suggestion, index) => (
                        <button
                          key={`${suggestion.type}-${index}`}
                          type="button"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            handleSuggestionClick(suggestion);
                          }}
                          className="w-full px-4 py-3 text-left hover:bg-indigo-50 flex items-center gap-3 rounded-md transition-colors duration-150 focus:outline-none focus:bg-indigo-50"
                        >
                          <span className="text-indigo-600 flex-shrink-0">{suggestion.icon}</span>
                          <div className="flex-1 truncate">
                            <span className="text-gray-900">{suggestion.value}</span>
                          </div>
                          <span className="text-xs text-gray-400 flex-shrink-0 bg-gray-50 px-2 py-1 rounded">
                            Click to search
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

                {searchQuery.length >= 2 && filteredSuggestions.length === 0 && (
                  <div className="p-4 text-center text-gray-500">
                    No matches found for "{searchQuery}"
                  </div>
                )}
              </div>
            )}
          </form>

          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 text-white hover:text-indigo-200 transition-colors bg-indigo-700 hover:bg-indigo-800 px-4 py-2 rounded-lg shadow-md"
            >
              {showFilters ? <X className="h-5 w-5" /> : <Filter className="h-5 w-5" />}
              {showFilters ? 'Close Filters' : 'Filter'}
            </button>
          </div>

          {showFilters && (
            <div className="mt-6 bg-white rounded-xl p-8 shadow-xl border border-indigo-50">
              <div className="space-y-8">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <h3 className="text-lg font-semibold text-indigo-900">Filter Options</h3>
                  <button
                    onClick={() => {
                      setFilters({
                        minRating: 0,
                        maxPrice: '',
                        specializations: [],
                        verifiedOnly: false,
                        location: ''
                      });
                    }}
                    className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    Reset Filters
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="block">
                      <span className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-red-500" />
                        Location
                      </span>
                      <select
                        value={filters.location}
                        onChange={(e) => handleFilterChange({ location: e.target.value })}
                        className="mt-1 block w-full pl-3 pr-10 py-3 text-base border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 rounded-lg shadow-sm transition-shadow hover:shadow-md"
                      >
                        <option value="">Any Location</option>
                        <optgroup label="Cities">
                          <option value="Hyderabad, India">Hyderabad, India</option>
                          <option value="Bangalore, India">Bangalore, India</option>
                        </optgroup>
                        <optgroup label="Hyderabad Areas">
                          <option value="Mehdipatnam, Hyderabad">Mehdipatnam</option>
                          <option value="Malakpet, Hyderabad">Malakpet</option>
                          <option value="Banjara Hills, Hyderabad">Banjara Hills</option>
                          <option value="Jubilee Hills, Hyderabad">Jubilee Hills</option>
                          <option value="HITEC City, Hyderabad">HITEC City</option>
                          <option value="Gachibowli, Hyderabad">Gachibowli</option>
                          <option value="Secunderabad, Hyderabad">Secunderabad</option>
                          <option value="Kukatpally, Hyderabad">Kukatpally</option>
                          <option value="Ameerpet, Hyderabad">Ameerpet</option>
                          <option value="Dilsukhnagar, Hyderabad">Dilsukhnagar</option>
                        </optgroup>
                      </select>
                    </label>

                    <label className="block">
                      <span className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-400" />
                        Minimum Rating
                      </span>
                      <select
                        value={filters.minRating}
                        onChange={(e) => handleFilterChange({ minRating: Number(e.target.value) })}
                        className="mt-1 block w-full pl-3 pr-10 py-3 text-base border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 rounded-lg shadow-sm transition-shadow hover:shadow-md"
                      >
                        <option value="0">Any Rating</option>
                        <option value="3">3+ Stars</option>
                        <option value="4">4+ Stars</option>
                        <option value="5">5 Stars Only</option>
                      </select>
                    </label>

                    <label className="block">
                      <span className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-green-500" />
                        Price Range
                      </span>
                      <select
                        value={filters.maxPrice}
                        onChange={(e) => handleFilterChange({ maxPrice: e.target.value })}
                        className="mt-1 block w-full pl-3 pr-10 py-3 text-base border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 rounded-lg shadow-sm transition-shadow hover:shadow-md"
                      >
                        <option value="">Any Price</option>
                        <option value="1000">Under $1,000</option>
                        <option value="2500">Under $2,500</option>
                        <option value="5000">Under $5,000</option>
                        <option value="10000">Under $10,000</option>
                      </select>
                    </label>

                    <label className="flex items-center gap-3 p-4 bg-indigo-50 rounded-lg cursor-pointer hover:bg-indigo-100 transition-colors">
                      <input
                        type="checkbox"
                        checked={filters.verifiedOnly}
                        onChange={(e) => handleFilterChange({ verifiedOnly: e.target.checked })}
                        className="rounded text-indigo-600 focus:ring-indigo-500 h-5 w-5"
                      />
                      <div>
                        <span className="text-sm font-medium text-gray-900 flex items-center gap-2">
                          <Shield className="h-4 w-4 text-indigo-600" />
                          Verified Consultants Only
                        </span>
                        <p className="text-xs text-gray-500 mt-1">
                          Show only consultants that have been verified by our team
                        </p>
                      </div>
                    </label>
                  </div>

                  <div className="space-y-4">
                    <span className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-blue-500" />
                      Specializations
                    </span>
                    <div className="grid grid-cols-1 gap-3 mt-2">
                      {searchSuggestions
                        .filter(suggestion => suggestion.type === 'specialization')
                        .map((suggestion) => (
                          <label
                            key={suggestion.value}
                            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={filters.specializations.includes(suggestion.value)}
                              onChange={() => handleSpecializationToggle(suggestion.value)}
                              className="rounded text-indigo-600 focus:ring-indigo-500 h-5 w-5"
                            />
                            <span className="text-sm text-gray-900">{suggestion.value}</span>
                          </label>
                        ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-gray-100">
                  <button
                    onClick={() => setShowFilters(false)}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-md hover:shadow-lg"
                  >
                    <Check className="h-5 w-5" />
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}