import React, { useState, useEffect } from 'react';
import { AgencyCard } from './AgencyCard';
import { FilterOptions } from './SearchSection';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

interface AgencyListingsProps {
  searchQuery: string;
  filters: FilterOptions;
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
}

export function AgencyListings({ searchQuery, filters }: AgencyListingsProps) {
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAgencies();
  }, []);

  const loadAgencies = async () => {
    try {
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
          )
        `)
        .eq('status', 'approved')
        .order('trust_score', { ascending: false });

      if (agenciesError) throw agenciesError;

      // Fetch photos for each agency
      const agenciesWithPhotos = await Promise.all(
        agenciesData.map(async (agency) => {
          const { data: photos } = await supabase
            .from('agency_photos')
            .select('*')
            .eq('agency_id', agency.id)
            .order('is_cover', { ascending: false }) // Cover photos first
            .order('created_at', { ascending: true });

          return {
            ...agency,
            specializations: agency.agency_services?.map((s: any) => s.name) || [],
            photos: photos || []
          };
        })
      );

      setAgencies(agenciesWithPhotos);
    } catch (error) {
      console.error('Error loading agencies:', error);
      toast.error('Failed to load agencies');
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

    // Rating filter
    if (filters.minRating > 0 && agency.rating < filters.minRating) {
      return false;
    }

    // Price filter
    if (filters.maxPrice && agency.price > parseInt(filters.maxPrice)) {
      return false;
    }

    // Specializations filter
    if (filters.specializations.length > 0) {
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

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {filteredAgencies.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No consultants found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAgencies.map((agency) => (
            <AgencyCard
              key={agency.id}
              name={agency.name}
              location={agency.location}
              description={agency.description}
              rating={agency.rating}
              imageUrl={getAgencyImage(agency)}
              trustScore={agency.trust_score}
              price={agency.price}
              specializations={agency.specializations}
              isVerified={agency.is_verified}
              slug={agency.slug}
            />
          ))}
        </div>
      )}
    </div>
  );
}