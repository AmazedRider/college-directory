import React from 'react';
import { Star, Trash2, MessageSquare } from 'lucide-react';
import { useAuth } from '../../components/AuthContext';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';

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

  const handleDelete = async (reviewId: string) => {
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

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review.id} className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-gray-100 rounded-full h-10 w-10 flex items-center justify-center">
                <span className="text-gray-600 font-medium">
                  {review.user?.full_name?.[0]?.toUpperCase() || review.user?.email[0]?.toUpperCase() || '?'}
                </span>
              </div>
              <div>
                <div className="font-medium text-gray-900">
                  {review.user?.full_name || review.user?.email}
                </div>
                <div className="text-sm text-gray-500">
                  {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex text-yellow-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${i < review.rating ? 'fill-current' : ''}`}
                  />
                ))}
              </div>
              {user?.email === review.user?.email && (
                <button
                  onClick={() => handleDelete(review.id)}
                  className="text-red-500 hover:text-red-600 transition-colors p-1 hover:bg-red-50 rounded-lg"
                  title="Delete review"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>

          <p className="text-gray-600 leading-relaxed">{review.content}</p>

          {review.response && (
            <div className="mt-4 bg-indigo-50 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-indigo-600">
                <MessageSquare className="h-5 w-5" />
                <span className="font-medium">Agency Response</span>
                <span className="text-sm text-indigo-400">
                  • {formatDistanceToNow(new Date(review.response.created_at), { addSuffix: true })}
                </span>
              </div>
              <p className="text-gray-600">{review.response.content}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}