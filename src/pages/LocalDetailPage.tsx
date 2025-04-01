import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getLocalById, getEventsByLocalId, getDrinksByLocalId, getLocalOffers, getLocalReviews } from '../services/api';
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
      address: 'Address',
      venue: 'Venue',
      information: 'Information',
      capacity: 'People',
      capacityInfo: 'Capacity',
      getDirections: 'Get Directions',
      noDescription: 'No description available for this venue.',
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
      address: 'Dirección',
      venue: 'Local',
      information: 'Información',
      capacity: 'Personas',
      capacityInfo: 'Capacidad',
      getDirections: 'Obtener Direcciones',
      noDescription: 'No hay descripción disponible para este local.',
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

  const favoriteEvents = authState.isAuthenticated && authState.user?.favorites?.events
    ? authState.user.favorites.events
    : [];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <LocalHero local={local} />
      
      <div className="container mx-auto px-4 py-8">
        <OverviewCard 
          local={local} 
          translations={{
            address: t.address,
            venue: t.venue,
            information: t.information,
            capacity: t.capacity,
            capacityInfo: t.capacityInfo,
            getDirections: t.getDirections,
            noDescription: t.noDescription
          }} 
        />
        
        <ScheduleCard
          local={local}
          translations={{
            scheduleFor: t.scheduleFor,
            closed: t.closed,
            today: t.today,
            address: t.address,
            venue: t.venue,
            information: t.information,
            capacity: t.capacity,
            capacityInfo: t.capacityInfo,
            getDirections: t.getDirections
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
                reviewsTitle: t.reviews,
                writeReview: t.writeReview,
                noReviews: t.noReviews,
                beFirst: t.beFirst
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
