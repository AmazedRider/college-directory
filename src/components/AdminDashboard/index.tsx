import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import { Agency, Service, Review, ReviewResponse, TrustScoreMetrics as TrustScoreMetricsType, Photo } from './types';
import { AgencyList } from './components/AgencyList';
import { AgencyDetails } from './components/AgencyDetails';
import { ServicesList } from './components/ServicesList';
import { PhotosList } from './components/PhotosList';
import { TrustScoreMetrics } from './components/TrustScoreMetrics';
import { ReviewsList } from './components/ReviewsList';
import { CreateAgencyModal } from './components/CreateAgencyModal';
import { retryableQuery, handleSupabaseError } from '../../lib/supabase';

export function AdminDashboard() {
  const { user } = useAuth();
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [selectedAgency, setSelectedAgency] = useState<Agency | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [responses, setResponses] = useState<Record<string, ReviewResponse>>({});
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [trustScoreMetrics, setTrustScoreMetrics] = useState<TrustScoreMetricsType>({
    averageRating: 0,
    totalReviews: 0,
    verifiedServices: 0,
    isVerified: false
  });

  useEffect(() => {
    if (user) {
      loadAgencies();
    }
  }, [user]);

  useEffect(() => {
    if (selectedAgency) {
      loadServices();
      loadPhotos();
      loadReviews();
      loadResponses();
      calculateTrustScore();
    }
  }, [selectedAgency]);

  const loadAgencies = async () => {
    try {
      const { data, error } = await retryableQuery(() => 
        supabase
          .from('agencies')
          .select('*')
          .eq('owner_id', user?.id)
      );
      
      if (error) throw error;
      setAgencies(data || []);
    } catch (error) {
      console.error('Failed to load agencies:', error);
      const errorMessage = handleSupabaseError(error);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const loadServices = async () => {
    if (!selectedAgency) return;
    
    try {
      const { data, error } = await retryableQuery(() =>
        supabase
          .from('agency_services')
          .select('*')
          .eq('agency_id', selectedAgency.id)
      );
      
      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Failed to load services:', error);
      const errorMessage = handleSupabaseError(error);
      toast.error(errorMessage);
    }
  };

  const loadPhotos = async () => {
    if (!selectedAgency) return;
    
    try {
      const { data, error } = await retryableQuery(() =>
        supabase
          .from('agency_photos')
          .select('*')
          .eq('agency_id', selectedAgency.id)
      );
      
      if (error) throw error;
      setPhotos(data || []);
    } catch (error) {
      console.error('Failed to load photos:', error);
      const errorMessage = handleSupabaseError(error);
      toast.error(errorMessage);
    }
  };

  const loadReviews = async () => {
    if (!selectedAgency) return;
    
    try {
      const { data, error } = await retryableQuery(() =>
        supabase
          .from('reviews')
          .select('*, profiles(email)')
          .eq('agency_id', selectedAgency.id)
          .order('created_at', { ascending: false })
      );
      
      if (error) throw error;
      
      setReviews(data.map(review => ({
        ...review,
        user_email: review.profiles?.email
      })));
    } catch (error) {
      console.error('Failed to load reviews:', error);
      const errorMessage = handleSupabaseError(error);
      toast.error(errorMessage);
    } finally {
      setReviewsLoading(false);
    }
  };

  const loadResponses = async () => {
    if (!selectedAgency) return;
    
    try {
      const { data, error } = await retryableQuery(() =>
        supabase
          .from('review_responses')
          .select('*')
          .in('review_id', reviews.map(r => r.id))
      );
      
      if (error) throw error;
      
      const responseMap = data.reduce((acc, response) => {
        acc[response.review_id] = response;
        return acc;
      }, {} as Record<string, ReviewResponse>);
      
      setResponses(responseMap);
    } catch (error) {
      console.error('Failed to load responses:', error);
      const errorMessage = handleSupabaseError(error);
      toast.error(errorMessage);
    }
  };

  const calculateTrustScore = async () => {
    if (!selectedAgency) return;

    try {
      const approvedReviews = reviews.filter(r => r.status === 'approved');
      const averageRating = approvedReviews.length > 0
        ? approvedReviews.reduce((acc, r) => acc + r.rating, 0) / approvedReviews.length
        : 0;

      const verifiedServices = services.length;

      setTrustScoreMetrics({
        averageRating,
        totalReviews: approvedReviews.length,
        verifiedServices,
        isVerified: selectedAgency.is_verified || false
      });

      const ratingScore = (averageRating / 5) * 50;
      const servicesScore = Math.min(verifiedServices * 5, 30);
      const verificationScore = selectedAgency.is_verified ? 20 : 0;

      const totalScore = Math.round(ratingScore + servicesScore + verificationScore);

      const { error } = await supabase
        .from('agencies')
        .update({ trust_score: totalScore })
        .eq('id', selectedAgency.id);

      if (error) throw error;

      setSelectedAgency(prev => prev ? { ...prev, trust_score: totalScore } : null);
    } catch (error) {
      console.error('Failed to calculate trust score:', error);
    }
  };

  const handleAddPhoto = async (photo: Omit<Photo, 'id'>) => {
    if (!selectedAgency) return;

    try {
      const { error } = await supabase
        .from('agency_photos')
        .insert([{ ...photo, agency_id: selectedAgency.id }]);

      if (error) throw error;
      loadPhotos();
      toast.success('Photo added successfully');
    } catch (error) {
      toast.error('Failed to add photo');
    }
  };

  const handleDeletePhoto = async (photoId: string) => {
    try {
      const { error } = await supabase
        .from('agency_photos')
        .delete()
        .eq('id', photoId);

      if (error) throw error;
      loadPhotos();
      toast.success('Photo deleted successfully');
    } catch (error) {
      toast.error('Failed to delete photo');
    }
  };

  const handleSetCoverPhoto = async (photoId: string) => {
    if (!selectedAgency) return;

    try {
      // First, remove cover status from all photos
      await supabase
        .from('agency_photos')
        .update({ is_cover: false })
        .eq('agency_id', selectedAgency.id);

      // Then set the new cover photo
      const { error } = await supabase
        .from('agency_photos')
        .update({ is_cover: true })
        .eq('id', photoId);

      if (error) throw error;
      loadPhotos();
      toast.success('Cover photo updated');
    } catch (error) {
      toast.error('Failed to update cover photo');
    }
  };

  const handleAgencyUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAgency) return;

    try {
      const { error } = await supabase
        .from('agencies')
        .update(selectedAgency)
        .eq('id', selectedAgency.id);

      if (error) throw error;
      toast.success('Agency updated successfully');
      loadAgencies();
    } catch (error) {
      toast.error('Failed to update agency');
    }
  };

  const handleAddService = async (service: Omit<Service, 'id'>) => {
    if (!selectedAgency) return;

    try {
      const { error } = await supabase
        .from('agency_services')
        .insert([{ ...service, agency_id: selectedAgency.id }]);

      if (error) throw error;
      loadServices();
      toast.success('Service added successfully');
    } catch (error) {
      toast.error('Failed to add service');
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    try {
      const { error } = await supabase
        .from('agency_services')
        .delete()
        .eq('id', serviceId);

      if (error) throw error;
      loadServices();
      toast.success('Service deleted successfully');
    } catch (error) {
      toast.error('Failed to delete service');
    }
  };

  const handleReviewAction = async (reviewId: string, status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('reviews')
        .update({ status })
        .eq('id', reviewId);

      if (error) throw error;
      loadReviews();
      toast.success(`Review ${status}`);
    } catch (error) {
      toast.error('Failed to update review status');
    }
  };

  const handleResponseSubmit = async (reviewId: string, content: string) => {
    try {
      const { error } = await supabase
        .from('review_responses')
        .insert([{ review_id: reviewId, content }]);

      if (error) throw error;
      loadResponses();
      toast.success('Response submitted');
    } catch (error) {
      toast.error('Failed to submit response');
    }
  };

  const handleCreateAgency = async (agency: Partial<Agency>) => {
    try {
      const { error } = await supabase
        .from('agencies')
        .insert([{ ...agency, owner_id: user?.id }]);

      if (error) throw error;
      loadAgencies();
      setShowCreateModal(false);
      toast.success('Agency created successfully');
    } catch (error) {
      toast.error('Failed to create agency');
    }
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  if (!user) {
    return <div className="p-8">Please log in to access the admin dashboard.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Agency Dashboard</h1>

      {agencies.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-gray-600 mb-4">You haven't created any agencies yet.</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            Create Agency
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <AgencyList
              agencies={agencies}
              selectedAgency={selectedAgency}
              onSelectAgency={setSelectedAgency}
            />
          </div>

          {selectedAgency && (
            <div className="lg:col-span-3 space-y-6">
              <AgencyDetails
                agency={selectedAgency}
                onUpdate={setSelectedAgency}
                onSubmit={handleAgencyUpdate}
              />

              <TrustScoreMetrics
                metrics={trustScoreMetrics}
                trustScore={selectedAgency.trust_score || 0}
              />

              <PhotosList
                photos={photos}
                onAddPhoto={handleAddPhoto}
                onDeletePhoto={handleDeletePhoto}
                onSetCover={handleSetCoverPhoto}
              />

              <ServicesList
                services={services}
                onAddService={handleAddService}
                onDeleteService={handleDeleteService}
              />

              <ReviewsList
                reviews={reviews}
                responses={responses}
                loading={reviewsLoading}
                onReviewAction={handleReviewAction}
                onResponseSubmit={handleResponseSubmit}
              />
            </div>
          )}
        </div>
      )}

      {showCreateModal && (
        <CreateAgencyModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateAgency}
        />
      )}
    </div>
  );
}