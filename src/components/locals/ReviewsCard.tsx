
import React from 'react';
import { MessageSquare, Star, ChevronRight } from 'lucide-react';
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

  const renderStars = (score: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            size={14} 
            className={`${i < score ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
          />
        ))}
      </div>
    );
  };

  return (
    <Card className="mb-8 border-none shadow-lg overflow-hidden bg-white">
      <CardContent className="p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            <span className="text-tango-primary">Guest </span>{t.reviewsTitle}
          </h2>
          
          {hasReviews && (
            <button className="text-tango-primary hover:text-tango-secondary flex items-center text-sm font-medium">
              View All <ChevronRight size={16} />
            </button>
          )}
        </div>
        
        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="flex justify-between mb-2">
                  <div className="h-5 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                </div>
                <div className="h-16 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        ) : hasReviews ? (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="p-5 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="font-medium text-gray-800">{review.userName}</div>
                  <div className="flex items-center">
                    {renderStars(review.score)}
                  </div>
                </div>
                <p className="text-gray-600 leading-relaxed">{review.comment}</p>
                {review.createdAt && (
                  <div className="text-xs text-gray-400 mt-3">
                    {new Date(review.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-14 bg-gray-50 rounded-xl">
            <div className="bg-white/80 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <MessageSquare size={24} className="text-tango-primary" />
            </div>
            <p className="text-gray-700 font-medium">{t.noReviews}</p>
            {t.beFirst && <p className="text-gray-500 text-sm mt-2">{t.beFirst}</p>}
            
            {t.writeReview && (
              <button className="mt-5 bg-tango-primary/10 text-tango-primary px-5 py-2 rounded-full font-medium hover:bg-tango-primary/20 transition-colors">
                {t.writeReview}
              </button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReviewsCard;
