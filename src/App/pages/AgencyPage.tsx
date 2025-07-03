import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAgency } from '../hooks/useAgency';
import { Shield, MapPin, Star, Phone, Mail, Globe, Clock, Download, MessageSquare, X, CheckCircle, Sparkles, Image as ImageIcon, Info, ListChecks } from 'lucide-react';
import { ReviewForm } from '../components/ReviewForm';
import { ReviewsList } from '../components/ReviewsList';
import { PhotoGalleryModal } from '../components/PhotoGalleryModal';
import { useAuth } from '../../components/AuthContext';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import Cal, { getCalApi } from "@calcom/embed-react";
import { SEO } from '../components/SEO';

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
  const [isAddingReview, setIsAddingReview] = useState(false);
  const [showBooking, setShowBooking] = useState(false);

  useEffect(() => {
    if (agency) {
      loadReviews();
    }
  }, [agency]);

  useEffect(() => {
    (async function () {
      const cal = await getCalApi();
      cal("ui", {
        styles: {
          branding: { brandColor: "#1e40af" }
        },
        hideEventTypeDetails: false,
        layout: "month_view"
      });
    })();
  }, []);

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
      
      // Process the data to match the Review interface
      const formattedReviews: Review[] = (data || []).map((review: any) => ({
        id: review.id,
        rating: review.rating,
        content: review.content,
        created_at: review.created_at,
        user: review.user?.[0] || null,
        response: review.response?.[0] || null
      }));
      
      setReviews(formattedReviews);
    } catch (error) {
      console.error('Error loading reviews:', error);
      toast.error('Failed to load reviews');
    } finally {
      setReviewsLoading(false);
    }
  };

  // Get the main image URL for the agency
  const getMainImageUrl = (agency: any): string => {
    const coverPhoto = agency.photos?.find((photo: any) => photo.is_cover);
    if (coverPhoto) return coverPhoto.url;
    if (agency.photos?.[0]) return agency.photos[0].url;
    return agency.image_url || 'https://via.placeholder.com/800x400?text=No+Image';
  };

  // Generate schema for the agency page
  const generateAgencySchema = (agency: any) => {
    const imageUrl = getMainImageUrl(agency);
    
    return {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      '@id': `https://admissions.app/agency/${agency.slug}`,
      name: agency.name,
      image: imageUrl,
      description: agency.description,
      url: `https://admissions.app/agency/${agency.slug}`,
      telephone: agency.contact_phone,
      email: agency.contact_email,
      address: {
        '@type': 'PostalAddress',
        addressLocality: agency.location
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: agency.latitude || undefined,
        longitude: agency.longitude || undefined
      },
      priceRange: agency.price ? `₹${agency.price}` : undefined,
      openingHours: agency.business_hours || undefined,
      isVerified: agency.is_verified || false,
      aggregateRating: agency.rating ? {
        '@type': 'AggregateRating',
        ratingValue: agency.rating,
        reviewCount: reviews.length,
        bestRating: '5',
        worstRating: '1'
      } : undefined,
      review: reviews.map((review: any) => ({
        '@type': 'Review',
        reviewRating: {
          '@type': 'Rating',
          ratingValue: review.rating,
          bestRating: '5',
          worstRating: '1'
        },
        author: {
          '@type': 'Person',
          name: review.user?.full_name || 'Anonymous'
        },
        reviewBody: review.content,
        datePublished: review.created_at
      })),
      makesOffer: agency.services ? agency.services.map((service: any) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: service.name,
          description: service.description || undefined
        }
      })) : undefined
    };
  };

  // Key services (mock, as on card)
  const keyServices = [
    "Visa Assistance",
    "Scholarship Guidance",
    "Personalized Counseling",
    "Application Process",
    "IELTS/TOEFL Prep",
    "Predeparture Support",
    "University Selection",
    "Financial Aid Help",
    "Career Counseling",
    "SOP/Essay Review",
    "Accommodation Help",
    "Mock Interviews",
    "End-to-End Support",
    "Trusted by 1000+ Students",
    "24/7 Chat Support"
  ];

  // Mock specializations if none exist
  const mockSpecializations = [
    "Visa Filing Assistance",
    "IELTS/TOEFL Coaching",
    "University Shortlisting"
  ];

  // Mock stars and review count (like on main page)
  function getMockRating() {
    return (Math.random() * 1.2 + 3.8).toFixed(1); // 3.8–5.0
  }
  function getMockReviews() {
    return Math.floor(Math.random() * 109) + 12; // 12–120
  }
  const mockRating = parseFloat(getMockRating());
  const mockReviews = getMockReviews();

  // Use agency.rating if available and > 0, otherwise use mockRating
  const displayRating = agency && agency.rating && agency.rating > 0 ? agency.rating : mockRating;
  // Use actual reviews if available, otherwise mockReviews
  const displayReviewCount = (typeof reviews !== 'undefined' && reviews.length > 0) ? reviews.length : mockReviews;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
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

  const imageUrl = getMainImageUrl(agency);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 py-6 sm:py-12">
      <SEO
        title={`${agency.name} | College Admissions Consultant`}
        description={agency.description.substring(0, 160)}
        canonicalUrl={`/agency/${agency.slug}`}
        ogImage={imageUrl}
        ogType="profile"
        keywords={[
          'college consultant', 
          'admissions consultant', 
          'education services', 
          agency.location, 
          ...agency.specializations || []
        ]}
        schema={generateAgencySchema(agency)}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section with crisp image and elevated glassy card */}
        <div className="flex flex-col md:flex-row items-center justify-between bg-gradient-to-br from-blue-50 via-white to-pink-50 rounded-3xl overflow-hidden mb-12 shadow-2xl p-8 md:p-12">
          {/* Left: Name and details */}
          <div className="flex-1 flex flex-col justify-center items-start md:items-start mb-6 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-3 flex items-center gap-2">
              <Sparkles className="h-7 w-7 text-pink-400 animate-bounce-slow" />
              {agency.name}
            </h1>
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <span className="flex items-center gap-1 bg-white/80 px-3 py-1.5 rounded-full shadow text-gray-800 text-sm font-medium">
                <MapPin className="h-4 w-4 text-blue-500" />
                {agency.location}
              </span>
              <span className="flex items-center gap-2 bg-yellow-50 px-3 py-1.5 rounded-full shadow text-yellow-700 text-sm font-medium">
                {/* Stars */}
                <span className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => {
                    const filled = i < Math.floor(displayRating);
                    const half = i === Math.floor(displayRating) && displayRating % 1 >= 0.5;
                    return (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${filled ? 'text-yellow-500 fill-yellow-500' : half ? 'text-yellow-400 fill-yellow-200' : 'text-gray-300'}`}
                        style={{ color: filled ? '#FFD700' : half ? '#FFD700' : undefined, opacity: half ? 0.5 : 1 }}
                      />
                    );
                  })}
                </span>
                <span className="ml-1 font-semibold">{displayRating.toFixed(1)}</span>
                <span className="ml-2 text-xs text-gray-500">({displayReviewCount} review{displayReviewCount > 1 ? 's' : ''})</span>
              </span>
              {agency.is_verified && (
                <span className="flex items-center gap-1 bg-green-100 px-3 py-1.5 rounded-full shadow text-green-800 text-sm font-medium animate-pulse-slow">
                  <Shield className="h-4 w-4" />
                  Verified
                </span>
              )}
            </div>
          </div>
          {/* Right: Image */}
          <div className="flex-shrink-0 flex items-center justify-center md:justify-end w-full md:w-80 h-48 md:h-64">
            <img
              src={agency.photos?.[0]?.url || 'https://via.placeholder.com/800x400?text=No+Image'}
              alt={agency.name}
              className="rounded-2xl border-4 border-white shadow-lg object-cover w-full h-full max-w-xs max-h-64 cursor-pointer"
              onClick={() => {
                setSelectedPhotoIndex(0);
                setShowGallery(true);
              }}
              onError={(e) => {
                const img = e.target as HTMLImageElement;
                img.src = 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80';
              }}
            />
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left/Main Column */}
          <div className="col-span-2 space-y-12">
            {/* About Section - glassy pink card with icon and divider */}
            <div className="rounded-2xl bg-gradient-to-br from-pink-50 via-white to-pink-100/80 backdrop-blur-md border border-pink-100 shadow-lg p-8 group hover:scale-[1.02] hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-3">
                <Info className="h-6 w-6 text-pink-400 animate-fade-in" />
                <h2 className="text-2xl font-bold text-pink-700">About {agency.name}</h2>
              </div>
              <div className="text-pink-600 text-base leading-relaxed space-y-3">
                {agency.description.split(/\n|\r|\.|\!|\?/).filter(Boolean).map((line, idx) => (
                  <p key={idx} className="mb-1">{line.trim()}</p>
                ))}
              </div>
              {/* Wavy divider */}
              <svg className="w-full h-6 mt-6" viewBox="0 0 1440 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill="#fbcfe8" fillOpacity=".3" d="M0,32L48,26.7C96,21,192,11,288,21.3C384,32,480,64,576,69.3C672,75,768,53,864,48C960,43,1056,53,1152,58.7C1248,64,1344,64,1392,64L1440,64L1440,160L1392,160C1344,160,1248,160,1152,160C1056,160,960,160,864,160C768,160,672,160,576,160C480,160,384,160,288,160C192,160,96,160,48,160L0,160Z"></path></svg>
            </div>

            {/* Key Services - green ticks, glassy card with icon and divider */}
            <div className="rounded-2xl bg-gradient-to-br from-green-50 via-white to-green-100/80 backdrop-blur-md border border-green-100 shadow-lg p-8 group hover:scale-[1.02] hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-3">
                <ListChecks className="h-6 w-6 text-green-400 animate-fade-in" />
                <h3 className="text-xl font-semibold text-green-700">Key Services</h3>
              </div>
              <ul className="space-y-2">
                {keyServices.slice(0, 5).map((service, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-green-700 text-base font-medium group-hover:translate-x-1 transition-transform duration-200">
                    <CheckCircle className="h-5 w-5 text-green-400 group-hover:scale-110 transition-transform" />
                    {service}
                  </li>
                ))}
              </ul>
              <svg className="w-full h-6 mt-6" viewBox="0 0 1440 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill="#bbf7d0" fillOpacity=".3" d="M0,32L48,26.7C96,21,192,11,288,21.3C384,32,480,64,576,69.3C672,75,768,53,864,48C960,43,1056,53,1152,58.7C1248,64,1344,64,1392,64L1440,64L1440,160L1392,160C1344,160,1248,160,1152,160C1056,160,960,160,864,160C768,160,672,160,576,160C480,160,384,160,288,160C192,160,96,160,48,160L0,160Z"></path></svg>
            </div>

            {/* Specializations - pink bullets, glassy card with icon and divider */}
            <div className="rounded-2xl bg-gradient-to-br from-pink-50 via-white to-pink-100/80 backdrop-blur-md border border-pink-100 shadow-lg p-8 group hover:scale-[1.02] hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-3">
                <Sparkles className="h-6 w-6 text-pink-400 animate-fade-in" />
                <h3 className="text-xl font-semibold text-pink-700">Our Specializations</h3>
              </div>
              {/* Mock stars and review count */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-5 w-5 md:h-6 md:w-6 ${i < Math.round(mockRating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                      style={{ color: i < Math.round(mockRating) ? '#FFD700' : undefined }}
                    />
                  ))}
                </div>
                <span className="text-base font-semibold text-gray-700">{mockRating.toFixed(1)}</span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700 border border-purple-200 flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" />
                  {mockReviews} review{mockReviews > 1 ? 's' : ''}
                </span>
              </div>
              <ul className="space-y-2">
                {(agency.specializations && agency.specializations.length > 0
                  ? agency.specializations
                  : mockSpecializations
                ).map((spec, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-pink-600 text-base font-medium group-hover:translate-x-1 transition-transform duration-200">
                    <span className="h-3 w-3 bg-pink-400 rounded-full inline-block group-hover:scale-110 transition-transform"></span>
                    {spec}
                  </li>
                ))}
              </ul>
              <svg className="w-full h-6 mt-6" viewBox="0 0 1440 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill="#fbcfe8" fillOpacity=".3" d="M0,32L48,26.7C96,21,192,11,288,21.3C384,32,480,64,576,69.3C672,75,768,53,864,48C960,43,1056,53,1152,58.7C1248,64,1344,64,1392,64L1440,64L1440,160L1392,160C1344,160,1248,160,1152,160C1056,160,960,160,864,160C768,160,672,160,576,160C480,160,384,160,288,160C192,160,96,160,48,160L0,160Z"></path></svg>
            </div>

            {/* Gallery - glassy card with icon and carousel on mobile */}
            {agency.photos && agency.photos.length > 0 && (
              <div className="rounded-2xl bg-gradient-to-br from-blue-50 via-white to-purple-100/80 backdrop-blur-md border border-blue-100 shadow-lg p-8 group hover:scale-[1.02] hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <ImageIcon className="h-6 w-6 text-blue-400 animate-fade-in" />
                  <h3 className="text-xl font-bold text-blue-700">Photo Gallery</h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {agency.photos.map((photo, index) => (
                    <button
                      key={photo.id}
                      className="relative overflow-hidden rounded-lg cursor-pointer aspect-square group hover:scale-105 transition-transform duration-300"
                      onClick={() => {
                        setSelectedPhotoIndex(index);
                        setShowGallery(true);
                      }}
                    >
                      <img
                        src={photo.url}
                        alt={photo.caption || `${agency.name} photo`}
                        className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                        <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-medium">View</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews - glassy card with icon and divider */}
            <div className="rounded-2xl bg-gradient-to-br from-purple-50 via-white to-blue-100/80 backdrop-blur-md border border-purple-100 shadow-lg p-8 group hover:scale-[1.02] hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-3">
                <Star className="h-6 w-6 text-yellow-400 animate-fade-in" />
                <h3 className="text-xl font-bold text-purple-700">Reviews</h3>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 border-b border-gray-100 pb-2">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex text-yellow-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 sm:h-6 sm:w-6 ${i < Math.round(agency.rating) ? 'fill-current' : ''}`}
                      />
                    ))}
                  </div>
                  <span className="text-lg font-semibold">{agency.rating.toFixed(1)}</span>
                  <div className="hidden sm:flex items-center gap-2 text-gray-500">
                    <span>•</span>
                    <span>{reviews.length} reviews</span>
                  </div>
                </div>
                <button
                  onClick={() => setIsAddingReview(true)}
                  className="w-full sm:w-auto flex justify-center items-center gap-2 bg-gradient-to-r from-blue-800 to-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 text-sm font-medium shadow-lg mt-4 sm:mt-0"
                >
                  <MessageSquare className="h-4 w-4" />
                  Add Review
                </button>
              </div>
              {isAddingReview && (
                <div className="mb-8">
                  <ReviewForm agencyId={agency.id} onReviewSubmitted={() => {
                    setIsAddingReview(false);
                    loadReviews();
                  }} />
                </div>
              )}
              {reviewsLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : reviews.length > 0 ? (
                <ReviewsList reviews={reviews} onReviewDeleted={loadReviews} />
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-xl">
                  <p className="text-gray-500">No reviews yet. Be the first to review!</p>
                </div>
              )}
              <svg className="w-full h-6 mt-6" viewBox="0 0 1440 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill="#a5b4fc" fillOpacity=".2" d="M0,32L48,26.7C96,21,192,11,288,21.3C384,32,480,64,576,69.3C672,75,768,53,864,48C960,43,1056,53,1152,58.7C1248,64,1344,64,1392,64L1440,64L1440,160L1392,160C1344,160,1248,160,1152,160C1056,160,960,160,864,160C768,160,672,160,576,160C480,160,384,160,288,160C192,160,96,160,48,160L0,160Z"></path></svg>
            </div>
          </div>

          {/* Right/Sidebar Column */}
          <div className="space-y-8">
            {/* Contact & Info - glassy card (phone, email, website removed) */}
            <div className="rounded-2xl bg-gradient-to-br from-blue-50 via-white to-green-100/80 backdrop-blur-md border border-blue-100 shadow-lg p-8 group hover:scale-[1.02] hover:shadow-2xl transition-all duration-300">
              <h2 className="text-xl font-bold text-blue-700 mb-4 border-b border-blue-100 pb-2 flex items-center gap-2"><Phone className="h-5 w-5 text-blue-400" />Contact & Info</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <span className="font-semibold text-gray-800 whitespace-pre-line">{agency.business_hours || 'Not available'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <span className="font-semibold text-gray-800">{agency.location || 'Not available'}</span>
                </div>
                {agency.brochure_url && (
                  <a
                    href={agency.brochure_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-800 to-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-lg font-medium mt-2"
                  >
                    <Download className="h-4 w-4" />
                    Download Brochure
                  </a>
                )}
              </div>
              <div className="mt-8">
                <h3 className="text-lg font-bold mb-2 text-green-700 flex items-center gap-2"><Shield className="h-5 w-5 text-green-400" />Trust Score</h3>
                <div className="flex items-center gap-4">
                  <Shield className="h-7 w-7 text-green-600" />
                  <span className="text-3xl font-bold text-gray-900">{agency.trust_score}%</span>
                </div>
              </div>
              <div className="mt-6">
                <h3 className="text-lg font-bold mb-2 text-blue-700 flex items-center gap-2"><Sparkles className="h-5 w-5 text-blue-400" />Starting Price</h3>
                <p className="text-3xl font-bold text-blue-600">
                  ₹{agency.price.toLocaleString()}
                </p>
              </div>
              <div className="space-y-4 pt-4">
                <button
                  onClick={() => setShowBooking(true)}
                  className="w-full bg-gradient-to-r from-blue-800 to-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all transform hover:scale-[1.02] shadow-lg font-medium animate-fade-in"
                >
                  Schedule Consultation
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Modal */}
        {showBooking && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-hidden">
            <div className="h-full w-full flex flex-col">
              <div className="bg-white w-full flex-1 flex flex-col">
                <div className="flex-shrink-0 border-b border-gray-100 flex items-center justify-between p-4">
                  <h3 className="text-lg font-semibold text-gray-900">Schedule a Consultation</h3>
                  <button
                    onClick={() => setShowBooking(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    aria-label="Close booking modal"
                  >
                    <X className="h-6 w-6 text-gray-500" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto -webkit-overflow-scrolling-touch">
                  <Cal
                    calLink="forge/consultation"
                    style={{
                      width: "100%",
                      height: "100vh",
                      overflow: "auto"
                    }}
                    config={{
                      layout: "month_view",
                      hideEventTypeDetails: "false"
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Photo Gallery Modal */}
        {showGallery && agency.photos && (
          <PhotoGalleryModal
            photos={agency.photos}
            initialPhotoIndex={selectedPhotoIndex}
            onClose={() => setShowGallery(false)}
          />
        )}
      </div>
    </div>
  );
}
