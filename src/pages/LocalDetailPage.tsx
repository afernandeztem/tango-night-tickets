
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getLocalById, getEventsByLocalId, getDrinksByLocalId, getLocalOffers, getLocalReviews } from '../services/api';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LocalHero from '../components/locals/LocalHero';
import OverviewCard from '../components/locals/OverviewCard';
import EventsCard from '../components/locals/EventsCard';
import DrinksOffersCard from '../components/locals/DrinksOffersCard';
import ReviewsCard from '../components/locals/ReviewsCard';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { useLocalPageTranslations } from '../hooks/useTranslations';

const LocalDetailPage: React.FC = () => {
  const { state } = useApp();
  const { state: authState } = useAuth();
  const navigate = useNavigate();
  const { localSlug } = useParams<{ localSlug: string }>();
  const [localId, setLocalId] = useState<string | null>(null);
  
  // Use the translation hook
  const t = useLocalPageTranslations();

  useEffect(() => {
    if (!localSlug) return;
    
    if (/^\d+$/.test(localSlug)) {
      setLocalId(localSlug);
    } else {
      fetchLocalIdFromSlug(localSlug);
    }
  }, [localSlug]);

  const fetchLocalIdFromSlug = async (slug: string) => {
    try {
      const localName = slug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      console.log(`Fetching locals to find matching slug: ${slug}`);
      
      let foundLocal = null;
      
      const cities = ['Valencia', 'Madrid', 'Málaga', 'Mallorca'];
      
      for (const city of cities) {
        console.log(`Trying to find local in city: ${city}`);
        const result = await getLocals({ city, size: 100 });
        
        foundLocal = result.content.find(local => 
          createSlug(local.name) === slug || local.id === slug
        );
        
        if (foundLocal) {
          setLocalId(foundLocal.id);
          return;
        }
      }
      
      if (!foundLocal) {
        console.error('Local not found in any city');
        navigate('/locals');
      }
    } catch (error) {
      console.error('Error fetching local ID:', error);
      navigate('/locals');
    }
  };

  const createSlug = (name: string) => {
    return name.toLowerCase().normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
  };

  const getLocals = async (params: { city?: string; page?: number; size?: number }) => {
    const { getLocals } = await import('../services/api');
    return getLocals(params);
  };

  const { data: local, isLoading: isLoadingLocal } = useQuery({
    queryKey: ['local', localId],
    queryFn: () => localId ? getLocalById(localId) : Promise.reject('No local ID'),
    enabled: !!localId,
  });

  const { data: events, isLoading: isLoadingEvents } = useQuery({
    queryKey: ['events', localId],
    queryFn: () => localId ? getEventsByLocalId(localId) : Promise.reject('No local ID'),
    enabled: !!localId,
  });

  const { data: drinks, isLoading: isLoadingDrinks } = useQuery({
    queryKey: ['drinks', localId],
    queryFn: () => localId ? getDrinksByLocalId(localId) : Promise.reject('No local ID'),
    enabled: !!localId,
  });

  const { data: offers, isLoading: isLoadingOffers } = useQuery({
    queryKey: ['offers', localId],
    queryFn: () => localId ? getLocalOffers(localId) : Promise.reject('No local ID'),
    enabled: !!localId,
  });

  const { data: reviews, isLoading: isLoadingReviews } = useQuery({
    queryKey: ['reviews', localId],
    queryFn: () => localId ? getLocalReviews(localId) : Promise.reject('No local ID'),
    enabled: !!localId,
  });

  if (isLoadingLocal) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-tango-primary mb-4"></div>
            <p className="text-gray-600">Loading local information...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!local) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Local not found</h2>
            <p className="text-gray-600 mb-6">The local you're looking for doesn't exist or has been removed.</p>
            <button
              onClick={() => navigate('/locals')}
              className="px-6 py-2 bg-tango-primary text-white rounded-md hover:bg-tango-primary/90"
            >
              Back to Locals
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const favoriteEvents = authState.isAuthenticated && authState.user?.favorites?.events
    ? authState.user.favorites.events
    : [];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <LocalHero local={local} />
      
      <div className="container mx-auto px-4 py-6">
        <OverviewCard 
          local={local} 
          translations={{
            address: t.address,
            venue: t.venue,
            information: t.information,
            capacity: t.capacity,
            capacityInfo: t.capacityInfo,
            getDirections: t.getDirections,
            noDescription: t.noDescription,
            today: t.today,
            closed: t.closed,
            scheduleFor: t.scheduleFor
          }} 
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <EventsCard
              events={events?.content || []}
              loading={isLoadingEvents}
              viewAllLink={`/events?localId=${local.id}`}
              translations={{
                upcomingEventsAt: `${t.upcomingEvents} ${local.name}`,
                viewAll: t.viewAll,
                noEvents: t.noEvents
              }}
              favorites={favoriteEvents}
            />
            
            <DrinksOffersCard
              drinks={drinks || []}
              offers={offers || []}
              loadingDrinks={isLoadingDrinks}
              loadingOffers={isLoadingOffers}
              translations={{
                drinks: t.drinks,
                offers: t.offers,
                noDrinksAvailable: t.noDrinksAvailable,
                noOffersAvailable: t.noOffersAvailable
              }}
            />
          </div>
          
          <div className="lg:col-span-1">
            <ReviewsCard
              reviews={reviews?.content || []}
              loading={isLoadingReviews}
              localId={local.id}
              localName={local.name}
              translations={{
                reviewsTitle: t.reviewsTitle,
                writeReview: t.writeReview || 'Write a Review',
                noReviews: t.noReviews,
                beFirst: t.beFirst || 'Be the first to leave a review'
              }}
            />
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default LocalDetailPage;
