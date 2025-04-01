
import React from 'react';
import { Local, Event, Drink } from '../../types';
import LocalHero from './LocalHero';
import OverviewCard from './OverviewCard';
import ScheduleCard from './ScheduleCard';
import EventsCard from './EventsCard';
import DrinksOffersCard from './DrinksOffersCard';
import ReviewsCard from './ReviewsCard';

interface LocalDetailContentProps {
  local: Local;
  upcomingEvents: Event[];
  loading: {
    local: boolean;
    events: boolean;
    drinks: boolean;
    offers: boolean;
    reviews: boolean;
  };
  viewAllLink: string;
  translations: any;
  favoriteEvents: string[];
  drinks: Drink[];
  offers: any[];
  reviews: any[];
}

const LocalDetailContent: React.FC<LocalDetailContentProps> = ({
  local,
  upcomingEvents,
  loading,
  viewAllLink,
  translations,
  favoriteEvents,
  drinks,
  offers,
  reviews
}) => {
  return (
    <>
      {/* Hero Section */}
      <LocalHero local={local} />
      
      {/* Content Section */}
      <section className="py-8">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Overview */}
          <OverviewCard local={local} translations={translations} />
          
          {/* Schedule */}
          <ScheduleCard local={local} translations={translations} />
          
          {/* Events */}
          <EventsCard 
            events={upcomingEvents} 
            loading={loading.events} 
            viewAllLink={viewAllLink} 
            translations={translations}
            favorites={favoriteEvents} 
          />
          
          {/* Drinks & Offers */}
          <DrinksOffersCard 
            drinks={drinks}
            offers={offers}
            loadingDrinks={loading.drinks}
            loadingOffers={loading.offers}
            translations={translations}
          />

          {/* Reviews */}
          <ReviewsCard 
            reviews={reviews}
            loading={loading.reviews}
            translations={translations}
          />
        </div>
      </section>
    </>
  );
};

export default LocalDetailContent;
