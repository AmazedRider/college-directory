import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { AgencyDetails } from '../components/AgencyDetails';
import { useAgency } from '../hooks/useAgency';
import { Shield, MapPin, Star, Phone, Mail, Globe, Clock, Download } from 'lucide-react';
import { ReviewForm } from '../components/ReviewForm';
import { ReviewsList } from '../components/ReviewsList';
import { PhotoGalleryModal } from '../components/PhotoGalleryModal';
import { useAuth } from '../../components/AuthContext';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

interface Review {
  id: string;
  rating: number;
  content: string;
  created_at: string;
  user: {
    full_name: string | null;
    email: string;
  } | null;
  response?: {
    content: string;
    created_at: string;
  } | null;
}

export function AgencyPage() {
  const { slug } = useParams<{ slug: string }>();
  const { agency, loading, error } = useAgency(slug);
  const { user } = useAuth();
  const [showGallery, setShowGallery] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  useEffect(() => {
    if (agency) {
      loadReviews();
    }
  }, [agency]);

  const loadReviews = async () => {
    if (!agency) return;
    
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          id,
          rating,
          content,
          created_at,
          user:profiles(full_name, email),
          response:review_responses(content, created_at)
        `)
        .eq('agency_id', agency.id)
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error('Error loading reviews:', error);
      toast.error('Failed to load reviews');
    } finally {
      setReviewsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !agency) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Agency Not Found</h2>
          <p className="text-gray-600">The agency you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  const coverPhoto = agency.photos?.find(photo => photo.is_cover);
  const imageUrl = coverPhoto?.url || agency.image_url || 'https://via.placeholder.com/800x400?text=No+Image';

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Hero Section */}
          <div className="relative h-64 sm:h-96">
            <img
              src={imageUrl}
              alt={agency.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                const img = e.target as HTMLImageElement;
                img.src = 'https://via.placeholder.com/800x400?text=Image+Not+Found';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/30 flex items-center justify-center">
              <div className="text-center text-white px-4">
                <h1 className="text-3xl sm:text-4xl font-bold mb-4 drop-shadow-lg">{agency.name}</h1>
                <div className="flex items-center justify-center gap-2">
                  <MapPin className="h-5 w-5 drop-shadow-lg" />
                  <span className="drop-shadow-lg">{agency.location}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-4 sm:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              {/* Left Column - Agency Info */}
              <div className="lg:col-span-2 space-y-6">
                <div className="flex flex-wrap items-center gap-4">
                  {agency.is_verified && (
                    <div className="flex items-center text-green-600 bg-green-50 px-3 py-1 rounded-full">
                      <Shield className="h-5 w-5 mr-1" />
                      <span className="text-sm font-medium">Verified Agency</span>
                    </div>
                  )}
                  <div className="flex items-center text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full">
                    <Star className="h-5 w-5 mr-1" />
                    <span className="text-sm font-medium">{agency.rating.toFixed(1)} Rating</span>
                  </div>
                </div>

                <div className="prose max-w-none">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">About Us</h2>
                  <p className="text-gray-600 leading-relaxed">{agency.description}</p>
                </div>

                {/* Contact Information */}
                <div className="bg-gray-50 p-4 sm:p-6 rounded-xl shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-white p-2 rounded-lg shadow-sm">
                        <Phone className="h-5 w-5 text-indigo-600" />
                      </div>
                      <a href={`tel:${agency.contact_phone}`} className="text-indigo-600 hover:text-indigo-800 transition-colors">
                        {agency.contact_phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="bg-white p-2 rounded-lg shadow-sm">
                        <Mail className="h-5 w-5 text-indigo-600" />
                      </div>
                      <a href={`mailto:${agency.contact_email}`} className="text-indigo-600 hover:text-indigo-800 transition-colors">
                        {agency.contact_email}
                      </a>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="bg-white p-2 rounded-lg shadow-sm">
                        <Globe className="h-5 w-5 text-indigo-600" />
                      </div>
                      <a href={agency.website} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 transition-colors">
                        {agency.website}
                      </a>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="bg-white p-2 rounded-lg shadow-sm">
                        <Clock className="h-5 w-5 text-indigo-600" />
                      </div>
                      <span className="text-gray-600">{agency.business_hours}</span>
                    </div>
                  </div>
                </div>

                {/* Brochure Download */}
                {agency.brochure_url && (
                  <div className="bg-gray-50 p-4 sm:p-6 rounded-xl shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Agency Brochure</h3>
                    <a
                      href={agency.brochure_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition-all transform hover:scale-105 shadow-sm hover:shadow-md"
                    >
                      <Download className="h-5 w-5" />
                      Download Brochure
                    </a>
                  </div>
                )}

                {/* Photo Gallery */}
                {agency.photos && agency.photos.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Photo Gallery</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {agency.photos.map((photo, index) => (
                        <button
                          key={photo.id}
                          onClick={() => {
                            setSelectedPhotoIndex(index);
                            setShowGallery(true);
                          }}
                          className="relative aspect-square rounded-xl overflow-hidden hover:opacity-90 transition-all transform hover:scale-105 shadow-sm hover:shadow-md"
                        >
                          <img
                            src={photo.url}
                            alt={photo.caption || `Photo ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const img = e.target as HTMLImageElement;
                              img.src = 'https://via.placeholder.com/400x400?text=Image+Not+Found';
                            }}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Reviews Section */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Reviews</h3>
                  <div className="flex flex-wrap items-center gap-4 mb-6">
                    <div className="flex items-center bg-yellow-50 px-4 py-2 rounded-xl">
                      <div className="flex text-yellow-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-6 w-6 ${i < Math.round(agency.rating) ? 'fill-current' : ''}`}
                          />
                        ))}
                      </div>
                      <span className="ml-2 text-lg font-semibold">{agency.rating.toFixed(1)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500">
                      <span>•</span>
                      <span>{reviews.length} reviews</span>
                    </div>
                  </div>
                  {user && (
                    <div className="mb-8">
                      <ReviewForm 
                        agencyId={agency.id} 
                        onReviewSubmitted={loadReviews}
                      />
                    </div>
                  )}
                  {reviewsLoading ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    </div>
                  ) : reviews.length > 0 ? (
                    <ReviewsList 
                      reviews={reviews}
                      onReviewDeleted={loadReviews}
                    />
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-xl">
                      <p className="text-gray-500">No reviews yet. Be the first to review!</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column - Additional Info */}
              <div className="lg:sticky lg:top-24 lg:self-start">
                <div className="bg-gray-50 p-6 rounded-xl shadow-sm space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Trust Score</h3>
                    <div className="flex items-center gap-3">
                      <div className="bg-white p-2 rounded-lg shadow-sm">
                        <Shield className="h-6 w-6 text-indigo-600" />
                      </div>
                      <span className="text-2xl font-bold">{agency.trust_score}%</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Starting Price</h3>
                    <p className="text-2xl font-bold text-indigo-600">
                      ${agency.price.toLocaleString()}
                    </p>
                  </div>

                  <div className="space-y-4 pt-4">
                    <button className="w-full bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition-all transform hover:scale-105 shadow-sm hover:shadow-md font-medium">
                      Schedule Consultation
                    </button>
                    {agency.brochure_url && (
                      <a
                        href={agency.brochure_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full text-center bg-white border-2 border-indigo-600 text-indigo-600 px-6 py-3 rounded-xl hover:bg-indigo-50 transition-all transform hover:scale-105 shadow-sm hover:shadow-md font-medium"
                      >
                        Download Brochure
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Photo Gallery Modal */}
      {showGallery && agency.photos && (
        <PhotoGalleryModal
          photos={agency.photos}
          initialPhotoIndex={selectedPhotoIndex}
          onClose={() => setShowGallery(false)}
        />
      )}
    </div>
  );
}