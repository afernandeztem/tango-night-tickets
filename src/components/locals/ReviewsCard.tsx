import React from 'react';
import { MessageSquare, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface Review {
  id: string;
  userName: string;
  score: number;
  comment: string;
  createdAt?: string;
}

interface ReviewsCardProps {
  reviews: Review[];
  loading: boolean;
  localId?: string;
  localName?: string;
  translations: {
    reviewsTitle: string;
    noReviews: string;
    beFirst?: string;
    writeReview?: string;
  };
}

const ReviewsCard: React.FC<ReviewsCardProps> = ({ reviews, loading, translations: t }) => {
  const hasReviews = reviews.length > 0;

  return (
    <Card className="mb-8 border border-gray-200 shadow-sm overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="bg-tango-primary/10 p-2 rounded-full">
            <MessageSquare className="text-tango-primary h-5 w-5" />
          </div>
          <h2 className="text-2xl font-semibold">{t.reviewsTitle}</h2>
        </div>
        
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-10 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        ) : hasReviews ? (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="border-b border-gray-100 pb-4 mb-4 last:border-0 last:mb-0 last:pb-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium">{review.userName}</div>
                  <div className="flex items-center">
                    <Star size={16} className="text-yellow-400 mr-1" />
                    <span>{review.score}</span>
                  </div>
                </div>
                <p className="text-gray-600">{review.comment}</p>
                {review.createdAt && (
                  <div className="text-xs text-gray-400 mt-1">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 bg-gray-50 rounded-lg">
            <MessageSquare size={32} className="mx-auto mb-2 text-gray-300" />
            <p className="text-gray-500">{t.noReviews}</p>
            {t.beFirst && <p className="text-gray-400 text-sm mt-1">{t.beFirst}</p>}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReviewsCard;
