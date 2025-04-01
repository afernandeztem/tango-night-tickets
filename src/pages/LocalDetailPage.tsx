
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getLocalById, getEventsByLocalId, getDrinksByLocalId, getLocalOffers, getLocalReviews } from '../services/api';
import { Local, Event } from '../types';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LocalHero from '../components/locals/LocalHero';
import OverviewCard from '../components/locals/OverviewCard';
import ScheduleCard from '../components/locals/ScheduleCard';
import EventsCard from '../components/locals/EventsCard';
import DrinksOffersCard from '../components/locals/DrinksOffersCard';
import ReviewsCard from '../components/locals/ReviewsCard';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

const LocalDetailPage: React.FC = () => {
  const { state } = useApp();
  const { state: authState } = useAuth();
  const navigate = useNavigate();
  const { localSlug } = useParams<{ localSlug: string }>();
  const [localId, setLocalId] = useState<string | null>(null);

  // If localSlug is a valid ID, use it directly
  useEffect(() => {
    if (!localSlug) return;
    
    // Check if localSlug is already an ID (numeric)
    if (/^\d+$/.test(localSlug)) {
      setLocalId(localSlug);
    } else {
      // Otherwise, fetch the ID from the API using the slug
      fetchLocalIdFromSlug(localSlug);
    }
  }, [localSlug]);

  const fetchLocalIdFromSlug = async (slug: string) => {
    try {
      // Convert the slug to a local name format
      const localName = slug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      console.log(`Fetching locals to find matching slug: ${slug}`);
      
      // Try to get the local ID by searching all locals
      // First try without city to get all locals
      let foundLocal = null;
      
      // We need to try each city since the API requires a city parameter
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

  // Helper function to create slug - must match the one in LocalCard
  const createSlug = (name: string) => {
    return name.toLowerCase().normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
  };

  // Import the getLocals function at the top of your file
  const getLocals = async (params: { city?: string; page?: number; size?: number }) => {
    // If you have access to the imported function, use that
    const { getLocals } = await import('../services/api');
    return getLocals(params);
  };

  // Queries - will only run when localId is available
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

  const translations = {
    en: {
      overview: 'Overview',
      schedule: 'Schedule',
      upcomingEvents: 'Upcoming Events at',
      viewAll: 'View All',
      noEvents: 'No upcoming events',
      drinks: 'Drinks',
      offers: 'Offers',
      noDrinksAvailable: 'No drinks available',
      noOffersAvailable: 'No offers available',
      reviews: 'Reviews',
      writeReview: 'Write a Review',
      noReviews: 'No reviews yet',
      beFirst: 'Be the first to leave a review',
      scheduleFor: 'Schedule for',
      closed: 'Closed',
      today: 'Today',
    },
    es: {
      overview: 'Descripción',
      schedule: 'Horario',
      upcomingEvents: 'Próximos Eventos en',
      viewAll: 'Ver Todos',
      noEvents: 'No hay eventos próximos',
      drinks: 'Bebidas',
      offers: 'Ofertas',
      noDrinksAvailable: 'No hay bebidas disponibles',
      noOffersAvailable: 'No hay ofertas disponibles',
      reviews: 'Reseñas',
      writeReview: 'Escribir Reseña',
      noReviews: 'Aún no hay reseñas',
      beFirst: 'Sé el primero en dejar una reseña',
      scheduleFor: 'Horario para',
      closed: 'Cerrado',
      today: 'Hoy',
    }
  };

  const t = translations[state.language];

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

  // Get favorite events for the user
  const favoriteEvents = authState.isAuthenticated && authState.user?.favorites?.events
    ? authState.user.favorites.events
    : [];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <LocalHero local={local} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <OverviewCard local={local} translations={{ overview: t.overview }} />
            
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
            
            <ReviewsCard
              reviews={reviews?.content || []}
              loading={isLoadingReviews}
              localId={local.id}
              localName={local.name}
              translations={{
                reviewsTitle: t.reviews,
                writeReview: t.writeReview,
                noReviews: t.noReviews,
                beFirst: t.beFirst
              }}
            />
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <ScheduleCard
              local={local}
              translations={{
                scheduleFor: t.scheduleFor,
                closed: t.closed,
                today: t.today
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
