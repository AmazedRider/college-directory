import { useState, useEffect } from 'react';
import { supabase, retryableQuery, handleSupabaseError } from '../../lib/supabase';
import toast from 'react-hot-toast';

interface Agency {
  id: string;
  name: string;
  slug: string;
  location: string;
  description: string;
  rating: number;
  trust_score: number;
  price: number;
  specializations: string[];
  is_verified: boolean;
  contact_phone: string;
  contact_email: string;
  website: string;
  business_hours: string;
  brochure_url?: string;
  photos?: Array<{
    id: string;
    url: string;
    caption: string;
    is_cover: boolean;
  }>;
  services?: Array<{
    name: string;
    description: string;
  }>;
}

export function useAgency(slug: string | undefined) {
  const [agency, setAgency] = useState<Agency | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetchAgency() {
      if (!slug) {
        setLoading(false);
        return;
      }

      try {
        // First fetch agency data
        const { data: agencyData, error: agencyError } = await retryableQuery(() =>
          supabase
            .from('agencies')
            .select(`
              *,
              agency_services (
                name,
                description
              )
            `)
            .eq('slug', slug)
            .single()
        );

        if (agencyError) {
          if (agencyError.code === 'PGRST116') {
            throw new Error('Agency not found');
          }
          throw agencyError;
        }

        // Then fetch photos, ordering by cover photo first, then creation date
        const { data: photosData, error: photosError } = await retryableQuery(() =>
          supabase
            .from('agency_photos')
            .select('*')
            .eq('agency_id', agencyData.id)
            .order('is_cover', { ascending: false }) // Cover photos first
            .order('created_at', { ascending: true })
        );

        if (photosError) throw photosError;

        if (mounted && agencyData) {
          setAgency({
            id: agencyData.id,
            name: agencyData.name,
            slug: agencyData.slug || '',
            location: agencyData.location,
            description: agencyData.description,
            rating: agencyData.rating || 0,
            trust_score: agencyData.trust_score || 0,
            price: agencyData.price || 0,
            specializations: agencyData.specializations || [],
            is_verified: agencyData.is_verified || false,
            contact_phone: agencyData.contact_phone || '',
            contact_email: agencyData.contact_email || '',
            website: agencyData.website || '',
            business_hours: agencyData.business_hours || '',
            brochure_url: agencyData.brochure_url || undefined,
            photos: photosData || [],
            services: agencyData.agency_services || []
          });
          setError(null);
        }
      } catch (err) {
        console.error('Error fetching agency:', err);
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Failed to fetch agency'));
          if (err instanceof Error && err.message !== 'Agency not found') {
            const errorMessage = handleSupabaseError(err);
            toast.error(errorMessage);
          }
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchAgency();

    return () => {
      mounted = false;
    };
  }, [slug]);

  return { agency, loading, error };
}