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

  const handleBrochureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedAgency) return;

    // Validate file type
    if (!file.type.startsWith('application/pdf')) {
      toast.error('Please upload a PDF file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    try {
      // Create a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload file to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from('agency-brochures')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('agency-brochures')
        .getPublicUrl(filePath);

      // Update agency with brochure URL
      const { error: updateError } = await supabase
        .from('agencies')
        .update({ brochure_url: publicUrl })
        .eq('id', selectedAgency.id);

      if (updateError) throw updateError;

      // Update local state
      setSelectedAgency({ ...selectedAgency, brochure_url: publicUrl });
      toast.success('Brochure uploaded successfully');
    } catch (error) {
      console.error('Error uploading brochure:', error);
      toast.error('Failed to upload brochure');
    }
  };

  const handleDeleteBrochure = async () => {
    if (!selectedAgency?.brochure_url) return;

    try {
      // Extract file name from URL
      const fileName = selectedAgency.brochure_url.split('/').pop();
      if (!fileName) throw new Error('Invalid file name');

      // Delete file from storage
      const { error: deleteError } = await supabase.storage
        .from('agency-brochures')
        .remove([fileName]);

      if (deleteError) throw deleteError;

      // Update agency to remove brochure URL
      const { error: updateError } = await supabase
        .from('agencies')
        .update({ brochure_url: null })
        .eq('id', selectedAgency.id);

      if (updateError) throw updateError;

      // Update local state
      setSelectedAgency({ ...selectedAgency, brochure_url: undefined });
      toast.success('Brochure deleted successfully');
    } catch (error) {
      console.error('Error deleting brochure:', error);
      toast.error('Failed to delete brochure');
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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Agency Dashboard</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Create New Agency
        </button>
      </div>

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

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Brochure</h2>
                <div className="space-y-4">
                  {selectedAgency.brochure_url ? (
                    <div className="flex items-center justify-between">
                      <a
                        href={selectedAgency.brochure_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-700"
                      >
                        View Current Brochure
                      </a>
                      <button
                        onClick={handleDeleteBrochure}
                        className="text-red-600 hover:text-red-700"
                      >
                        Delete Brochure
                      </button>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Upload Brochure (PDF, Max 10MB)
                      </label>
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={handleBrochureUpload}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                      />
                    </div>
                  )}
                </div>
              </div>

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