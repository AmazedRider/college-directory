import React, { useState, useEffect } from 'react';
import { AgencyCard } from './AgencyCard';
import { FilterOptions } from './SearchSection';
import { supabase } from '../../lib/supabase';
import { ChevronLeft, ChevronRight, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

interface AgencyListingsProps {
  searchQuery: string;
  filters: FilterOptions;
  itemsPerPage?: number;
}

interface Agency {
  id: string;
  name: string;
  slug: string;
  location: string;
  description: string;
  rating: number;
  trust_score: number;
  image_url: string;
  price: number;
  specializations: string[];
  is_verified: boolean;
  photos?: Array<{
    id: string;
    url: string;
    caption: string;
    is_cover: boolean;
  }>;
  total_reviews?: number;
}

export function AgencyListings({ searchQuery, filters, itemsPerPage = 12 }: AgencyListingsProps) {
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    loadAgencies();
  }, []);

  const loadAgencies = async () => {
    try {
      // First fetch basic agency data
      const { data: agenciesData, error: agenciesError } = await supabase
        .from('agencies')
        .select(`
          id,
          name,
          slug,
          location,
          description,
          rating,
          trust_score,
          image_url,
          price,
          is_verified,
          agency_services (
            name
          ),
          agency_photos (
            id,
            url,
            caption,
            is_cover
          ),
          total_reviews
        `)
        .eq('status', 'approved')
        .order('trust_score', { ascending: false });

      if (agenciesError) throw agenciesError;

      // Process the data with photos included in the initial query
      const processedAgencies = agenciesData.map((agency: any) => ({
        ...agency,
        specializations: agency.agency_services?.map((s: any) => s.name) || [],
        photos: agency.agency_photos || [],
        total_reviews: agency.total_reviews || 0
      }));

      setAgencies(processedAgencies);
    } catch (error) {
      console.error('Error loading agencies:', error);
      toast.error('Failed to load agencies. Please try refreshing the page.');
    } finally {
      setLoading(false);
    }
  };

  const filteredAgencies = agencies.filter(agency => {
    // Search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        agency.name.toLowerCase().includes(query) ||
        agency.location.toLowerCase().includes(query) ||
        agency.description.toLowerCase().includes(query) ||
        agency.specializations.some(s => s.toLowerCase().includes(query));
      
      if (!matchesSearch) return false;
    }

    // Location filter
    if (filters.location && filters.location !== '') {
      if (!agency.location.toLowerCase().includes(filters.location.toLowerCase())) {
        return false;
      }
    }

    // Rating filter
    if (filters.minRating > 0 && agency.rating < filters.minRating) {
      return false;
    }

    // Price filter
    if (filters.maxPrice && filters.maxPrice !== '') {
      const maxPrice = parseInt(filters.maxPrice);
      if (!isNaN(maxPrice) && agency.price > maxPrice) {
        return false;
      }
    }

    // Specializations filter
    if (filters.specializations && filters.specializations.length > 0) {
      const hasSpecialization = filters.specializations.some(s => 
        agency.specializations.includes(s)
      );
      if (!hasSpecialization) return false;
    }

    // Verified filter
    if (filters.verifiedOnly && !agency.is_verified) {
      return false;
    }

    return true;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredAgencies.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  
  // Sort agencies based on the selected criterion
  const sortedAgencies = [...filteredAgencies].sort((a: Agency, b: Agency) => {
    // Default sorting by name if no sort option is selected
    if (!filters.sortBy || filters.sortBy === 'name') {
      // Check if name starts with a number
      const aStartsWithNumber = /^\d/.test(a.name);
      const bStartsWithNumber = /^\d/.test(b.name);
      
      // If one starts with a number and the other doesn't, prioritize alphabetic names
      if (aStartsWithNumber && !bStartsWithNumber) return 1;
      if (!aStartsWithNumber && bStartsWithNumber) return -1;
      
      // Otherwise, sort alphabetically
      return a.name.localeCompare(b.name);
    }
    
    // Sort by rating (reviews) - highest first
    if (filters.sortBy === 'rating') {
      return b.rating - a.rating;
    }
    
    // Sort by price - lowest first
    if (filters.sortBy === 'price') {
      return a.price - b.price;
    }
    
    // Sort by trust score - highest first
    if (filters.sortBy === 'trustScore') {
      return b.trust_score - a.trust_score;
    }
    
    // Fallback to name sorting
    return a.name.localeCompare(b.name);
  });
  
  const currentAgencies = sortedAgencies.slice(startIndex, endIndex);

  // Handle page changes
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset to first page when filters or search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filters]);

  // Helper function to get the display image for an agency
  const getAgencyImage = (agency: Agency): string => {
    // First try to find the cover photo
    const coverPhoto = agency.photos?.find(photo => photo.is_cover);
    if (coverPhoto) return coverPhoto.url;

    // Then try the first photo
    if (agency.photos?.[0]) return agency.photos[0].url;

    // Finally fall back to the default image_url or a placeholder
    return agency.image_url || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80';
  };

  // Add this helper function before the return statement
  const getVisiblePageNumbers = (currentPage: number, totalPages: number) => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    
    if (currentPage <= 3) {
      return [1, 2, 3, 4, '...', totalPages];
    }
    
    if (currentPage >= totalPages - 2) {
      return [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Loading Consultants</h3>
          <p className="text-gray-600">Finding the best education consultants for you...</p>
        </div>
        
        {/* Loading Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden animate-pulse">
              <div className="h-48 bg-gray-200"></div>
              <div className="p-6 space-y-4">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-4 w-4 bg-gray-200 rounded"></div>
                  ))}
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
                <div className="flex gap-2">
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                  <div className="h-6 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Results Header */}
      <div className="max-w-7xl mx-auto -mt-4 mb-4">
        <div className="bg-white/30 backdrop-blur-md rounded-2xl shadow-lg border border-white/40 px-6 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">
              {filteredAgencies.length === 0 
                ? 'No Consultants Found' 
                : `${filteredAgencies.length} Consultant${filteredAgencies.length === 1 ? '' : 's'} Found`
              }
            </h3>
            <p className="text-gray-600 text-sm">
              {filteredAgencies.length === 0 
                ? 'Try adjusting your search criteria or filters.'
                : `Showing ${startIndex + 1}-${Math.min(endIndex, filteredAgencies.length)} of ${filteredAgencies.length} consultants.`
              }
            </p>
          </div>
          {filteredAgencies.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>Sorted by:</span>
              <span className="font-medium text-gray-900">
                {filters.sortBy === 'rating' ? 'Rating' : 
                 filters.sortBy === 'price' ? 'Price' : 
                 filters.sortBy === 'trustScore' ? 'Trust Score' : 'Name'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Results Grid or Empty State */}
      {filteredAgencies.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="bg-white/60 backdrop-blur-md rounded-full p-6 mb-6 shadow-lg border border-white/40">
            <svg width="48" height="48" fill="none" viewBox="0 0 24 24"><path d="M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm7 4-4.35-4.35M21 12A9 9 0 1 1 3 12a9 9 0 0 1 18 0Z" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <h4 className="text-xl font-semibold text-gray-900 mb-2">No Consultants Found</h4>
          <p className="text-gray-600 mb-6 text-center max-w-xs">
            We couldn't find any consultants matching your current search criteria. Try adjusting your filters or search terms.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-xl font-medium transition-colors shadow-lg"
          >
            Refresh Page
          </button>
        </div>
      ) : (
        <>
          <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-3xl p-2 md:p-8 flex flex-col gap-8 border border-white/40 shadow-xl">
            {currentAgencies.map((agency) => (
              <AgencyCard
                key={agency.id}
                name={agency.name}
                location={agency.location}
                description={agency.description}
                imageUrl={getAgencyImage(agency)}
                trustScore={agency.trust_score}
                price={agency.price}
                specializations={agency.specializations}
                isVerified={agency.is_verified}
                slug={agency.slug}
              />
            ))}
          </div>

          {/* Pagination Divider */}
          {itemsPerPage !== 3 && totalPages > 1 && (
            <div className="flex flex-col items-center space-y-4 mt-12">
              <div className="w-full flex justify-center mb-2">
                <div className="h-1 w-32 bg-gradient-to-r from-blue-200 via-purple-200 to-blue-200 rounded-full opacity-60"></div>
              </div>
              <div className="flex flex-wrap justify-center items-center gap-1 sm:gap-2 max-w-full px-2 bg-white/30 backdrop-blur-md rounded-xl shadow border border-white/40 py-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-1.5 sm:p-2 rounded-lg hover:bg-primary/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                </button>
                {getVisiblePageNumbers(currentPage, totalPages).map((pageNumber, index) => (
                  <React.Fragment key={index}>
                    {pageNumber === '...' ? (
                      <span className="px-2 py-1 text-gray-500">...</span>
                    ) : (
                      <button
                        onClick={() => handlePageChange(Number(pageNumber))}
                        className={`min-w-[2rem] sm:min-w-[2.5rem] px-2 sm:px-4 py-1 sm:py-2 rounded-lg text-sm sm:text-base transition-colors font-semibold ${
                          currentPage === pageNumber
                            ? 'bg-primary text-white shadow-lg'
                            : 'hover:bg-primary/10 text-primary'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    )}
                  </React.Fragment>
                ))}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-1.5 sm:p-2 rounded-lg hover:bg-primary/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Next page"
                >
                  <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                </button>
              </div>
              <div className="text-center text-sm text-gray-500 px-4">
                Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(endIndex, filteredAgencies.length)}
                </span>{' '}
                of <span className="font-medium">{filteredAgencies.length}</span> consultants
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
