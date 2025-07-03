import React, { useState } from 'react';
import { AgencyListings } from './AgencyListings';
import { SearchSection } from './SearchSection';
import { FilterOptions } from './SearchSection';
import { Users, Star, Shield, MapPin, Sparkles } from 'lucide-react';

export function AgenciesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({
    location: '',
    minRating: 0,
    maxPrice: '',
    specializations: [],
    verifiedOnly: false,
    sortBy: 'name'
  });

  console.log('AgenciesPage rendered', { searchQuery, filters });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary via-purple-600 to-blue-600 text-white relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-purple-600/20 to-blue-600/20"></div>
        <Sparkles className="absolute top-8 left-8 w-10 h-10 text-yellow-300 animate-pulse" />
        <Sparkles className="absolute top-10 right-1/3 w-8 h-8 text-purple-200 animate-bounce" />
        <Sparkles className="absolute bottom-16 left-1/4 w-8 h-8 text-pink-200 animate-bounce delay-500" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-white/80 mb-6">
            <span className="text-sm">Home</span>
            <span className="text-sm">/</span>
            <span className="text-sm font-medium">Consultancy Directory</span>
          </div>
          
          {/* Main Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 mb-6">
              <Shield className="h-5 w-5" />
              <span className="text-sm font-medium">Verified Consultants</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Find Your Perfect <span className="text-yellow-300">Education Consultant</span>
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Connect with verified education consultants who can guide you through your study abroad journey. 
              Compare ratings, services, and expertise to find the right partner for your success.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20">
              <Users className="w-8 h-8 text-blue-200 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">500+</div>
              <div className="text-white/80 text-sm">Verified Consultants</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20">
              <Star className="w-8 h-8 text-yellow-300 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">4.8</div>
              <div className="text-white/80 text-sm">Average Rating</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20">
              <MapPin className="w-8 h-8 text-green-200 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">50+</div>
              <div className="text-white/80 text-sm">Cities Covered</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20">
              <Shield className="w-8 h-8 text-purple-200 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">100%</div>
              <div className="text-white/80 text-sm">Verified Profiles</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Find Your Consultant</h2>
            <p className="text-gray-600">Use our advanced search and filters to find the perfect education consultant for your needs.</p>
          </div>
          <SearchSection 
            onSearch={(query) => {
              console.log('Search query changed:', query);
              setSearchQuery(query);
            }}
            onFilterChange={(newFilters) => {
              console.log('Filters changed:', newFilters);
              setFilters(newFilters);
            }}
            filters={filters}
          />
        </div>
      </div>

      {/* Agency Listings */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AgencyListings 
          searchQuery={searchQuery}
          filters={filters}
        />
      </div>

      {/* Why Choose Us Section */}
      <div className="bg-gradient-to-br from-gray-50 to-blue-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We've built the most comprehensive directory of verified education consultants to help you make informed decisions.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center">
              <div className="bg-blue-100 rounded-2xl p-4 w-fit mx-auto mb-4">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Verified Consultants</h3>
              <p className="text-gray-600">
                Every consultant on our platform is thoroughly verified and vetted to ensure quality and reliability.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center">
              <div className="bg-green-100 rounded-2xl p-4 w-fit mx-auto mb-4">
                <Star className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Real Reviews</h3>
              <p className="text-gray-600">
                Read authentic reviews from students who have worked with these consultants to make informed decisions.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center">
              <div className="bg-purple-100 rounded-2xl p-4 w-fit mx-auto mb-4">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Expert Guidance</h3>
              <p className="text-gray-600">
                Connect with experienced consultants who specialize in your target country and field of study.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 