import React, { useState } from 'react';
import { AgencyListings } from '../components/AgencyListings';
import { SearchSection } from '../components/SearchSection';
import { FilterOptions } from '../components/SearchSection';
import { Users, Star, Shield, MapPin, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ConsultanciesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({
    location: '',
    minRating: 0,
    maxPrice: '',
    specializations: [],
    verifiedOnly: false,
    sortBy: 'name'
  });

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-[#f4f8fb] via-[#f6fbfa] to-[#eaf6fa] relative overflow-hidden py-0 px-2">
      {/* Blurred Gradient Blobs */}
      <div className="absolute left-[-10vw] top-[-10vh] w-[400px] h-[400px] bg-[#e0e7ff] rounded-full blur-3xl opacity-40 z-0" />
      <div className="absolute right-[-8vw] bottom-[-8vh] w-[350px] h-[350px] bg-[#99f6e4] rounded-full blur-3xl opacity-30 z-0" />
      {/* Greenish Tint Blob (left side) */}
      <div className="absolute left-[-15vw] top-1/4 w-[500px] h-[500px] bg-gradient-to-br from-[#6ee7b7] via-[#a7f3d0] to-transparent rounded-full blur-3xl opacity-50 z-0" />
      {/* Hero Section */}
      <div className="w-full flex flex-col items-center justify-center min-h-[80vh] z-10">
        {/* Badge */}
        <div className="flex items-center gap-2 px-6 py-2 bg-white border border-[#e0e7ff] rounded-full shadow text-[#6366f1] font-semibold text-base mb-8 mt-8 max-w-fit mx-auto animate-fade-in">
          <svg className="w-5 h-5 text-[#6366f1]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 17.75l-6.172 3.247 1.179-6.873L2 9.753l6.914-1.004L12 2.25l3.086 6.499L22 9.753l-5.007 4.371 1.179 6.873z" /></svg>
          India's Most Trusted Consultancy Directory
          <svg className="w-4 h-4 text-yellow-400 ml-1" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.385-2.46a1 1 0 00-1.175 0l-3.385 2.46c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118l-3.385-2.46c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.967z" /></svg>
        </div>
        {/* Heading */}
        <h1 className="text-4xl md:text-6xl font-extrabold text-center mb-6 leading-tight text-[#181c2a]">
          Find Your <span className="bg-gradient-to-r from-[#6366f1] via-[#6366f1] to-[#14b8a6] bg-clip-text text-transparent">Perfect Consultant</span>
        </h1>
        {/* Description */}
        <p className="text-[#475569] text-center text-xl md:text-2xl mb-10 max-w-3xl font-medium">
          Connect with verified education consultants who can guide you through your study abroad journey. Compare ratings, services, and expertise to find the right partner for your success.
        </p>
        {/* Details Bar */}
        <div className="flex flex-wrap justify-center gap-4 mb-8 z-10">
          <span className="inline-flex items-center px-5 py-2 rounded-full bg-green-100 text-green-800 font-semibold text-base shadow-sm border border-green-200">Verified Agencies <span className="font-bold ml-1">(20+)</span></span>
          <span className="inline-flex items-center px-5 py-2 rounded-full bg-blue-100 text-blue-800 font-semibold text-base shadow-sm border border-blue-200">Top Rated <span className="font-bold ml-1">(10+)</span></span>
          <span className="inline-flex items-center px-5 py-2 rounded-full bg-yellow-100 text-yellow-800 font-semibold text-base shadow-sm border border-yellow-200">Budget Friendly <span className="font-bold ml-1">(7+)</span></span>
          <span className="inline-flex items-center px-5 py-2 rounded-full bg-pink-100 text-pink-800 font-semibold text-base shadow-sm border border-pink-200">Most Reviewed <span className="font-bold ml-1">(15+)</span></span>
        </div>
        {/* Buttons */}
        {/* Removed CTA buttons as requested */}
      </div>

      {/* Search and Filters Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-8">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Find Your Consultant</h2>
            <p className="text-gray-600">Use our advanced search and filters to find the perfect education consultant for your needs.</p>
          </div>
          <SearchSection 
            onSearch={(query) => {
              setSearchQuery(query);
            }}
            onFilterChange={(newFilters) => {
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