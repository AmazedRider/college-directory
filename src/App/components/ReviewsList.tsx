import React from 'react';
import { Star, MessageCircle, Shield, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../components/AuthContext';
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

interface ReviewsListProps {
  reviews: Review[];
  onReviewDeleted?: () => void;
}

export function ReviewsList({ reviews, onReviewDeleted }: ReviewsListProps) {
  const { user } = useAuth();

  const handleDeleteReview = async (reviewId: string) => {
    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId);

      if (error) throw error;
      toast.success('Review deleted successfully');
      onReviewDeleted?.();
    } catch (error) {
      console.error('Error deleting review:', error);
      toast.error('Failed to delete review');
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Date unavailable';
    }
  };

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review.id} className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium">
                  {review.user?.full_name || 'Anonymous User'}
                </span>
                <span className="text-gray-500">•</span>
                <span className="text-gray-500">
                  {formatDate(review.created_at)}
                </span>
              </div>
              <div className="flex items-center gap-1 text-yellow-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${i < review.rating ? 'fill-current' : ''}`}
                  />
                ))}
              </div>
            </div>
            {(user?.email === 'admin@admin.com' || user?.email === 'superadmin@superadmin.com') && (
              <button
                onClick={() => handleDeleteReview(review.id)}
                className="text-red-600 hover:text-red-800 transition-colors"
                title="Delete Review"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            )}
          </div>
          
          <p className="text-gray-700 mb-4">{review.content}</p>

          {review.response && (
            <div className="ml-8 mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-4 w-4 text-indigo-600" />
                <span className="font-medium">Agency Response</span>
                {review.response.created_at && (
                  <>
                    <span className="text-gray-500">•</span>
                    <span className="text-gray-500">
                      {formatDate(review.response.created_at)}
                    </span>
                  </>
                )}
              </div>
              <p className="text-gray-700">{review.response.content}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}