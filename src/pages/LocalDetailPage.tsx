
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getEventsByLocalId, getDrinksByLocalId, getLocalReviews, getLocalOffers } from '../services/api';
import { Local, Event, Drink } from '../types';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useLocalPageTranslations } from '../hooks/useTranslations';

// Import refactored components
import LocalHero from '../components/locals/LocalHero';
import OverviewCard from '../components/locals/OverviewCard';
import ScheduleCard from '../components/locals/ScheduleCard';
import EventsCard from '../components/locals/EventsCard';
import DrinksOffersCard from '../components/locals/DrinksOffersCard';
import ReviewsCard from '../components/locals/ReviewsCard';
import LoadingPlaceholder from '../components/locals/LoadingPlaceholder';
import NotFoundPlaceholder from '../components/locals/NotFoundPlaceholder';

const LocalDetailPage: React.FC = () => {
  const { localSlug } = useParams<{ localSlug: string }>();
  const { state } = useApp();
  const { state: authState } = useAuth();
  const t = useLocalPageTranslations();
  
  const [local, setLocal] = useState<Local | null>(null);
  const [eventsData, setEventsData] = useState<{ content: Event[] } | null>(null);
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [offers, setOffers] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState<{ local: boolean; events: boolean; drinks: boolean; offers: boolean; reviews: boolean }>({
    local: true,
    events: true,
    drinks: true,
    offers: true,
    reviews: true,
  });
  
  useEffect(() => {
    const fetchLocals = async () => {
      try {
        // Fetch all locals without city filter to ensure we find the right one
        const response = await fetch('https://api.grupotangoapp.com/public/locals');
        const data = await response.json();
        const locals = data.content || [];
        
        if (localSlug && locals.length > 0) {
          const foundLocal = locals.find((local: any) => {
            const slug = local.name.toLowerCase().normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
            return slug === localSlug;
          });
          
          if (foundLocal) {
            console.log('Found local with matching slug:', foundLocal);
            setLocal({
              id: foundLocal.localId,
              name: foundLocal.name,
              description: foundLocal.description || '',
              address: foundLocal.address || '',
              city: foundLocal.city || '',
              capacity: foundLocal.capacity || 0,
              rating: foundLocal.rating || 4.5,
              tags: foundLocal.categories || [],
              image: foundLocal.filename || 'https://source.unsplash.com/random/800x600/?club',
              schedule: foundLocal.schedule || []
            });
            
            fetchAdditionalLocalData(foundLocal.localId);
          } else {
            console.error('Local not found with slug:', localSlug);
            setLoading(prev => ({ ...prev, local: false }));
          }
        } else {
          console.error('No locals found or no localSlug provided');
          setLoading(prev => ({ ...prev, local: false }));
        }
      } catch (error) {
        console.error('Error fetching locals:', error);
        setLoading(prev => ({ ...prev, local: false }));
      }
    };
    
    const fetchAdditionalLocalData = (localId: string) => {
      fetchEvents(localId);
      fetchDrinks(localId);
      fetchOffers(localId);
      fetchReviews(localId);
      setLoading(prev => ({ ...prev, local: false }));
    };
    
    fetchLocals();
  }, [localSlug]);
  
  const fetchEvents = async (localId: string) => {
    setLoading(prev => ({ ...prev, events: true }));
    
    try {
      const events = await getEventsByLocalId(localId);
      setEventsData(events);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(prev => ({ ...prev, events: false }));
    }
  };

  const fetchDrinks = async (localId: string) => {
    setLoading(prev => ({ ...prev, drinks: true }));
    
    try {
      const drinksData = await getDrinksByLocalId(localId);
      setDrinks(drinksData);
    } catch (error) {
      console.error('Error fetching drinks:', error);
    } finally {
      setLoading(prev => ({ ...prev, drinks: false }));
    }
  };

  const fetchOffers = async (localId: string) => {
    setLoading(prev => ({ ...prev, offers: true }));
    
    try {
      const offersData = await getLocalOffers(localId);
      setOffers(offersData);
    } catch (error) {
      console.error('Error fetching offers:', error);
    } finally {
      setLoading(prev => ({ ...prev, offers: false }));
    }
  };

  const fetchReviews = async (localId: string) => {
    setLoading(prev => ({ ...prev, reviews: true }));
    
    try {
      const reviewsData = await getLocalReviews(localId);
      setReviews(reviewsData.content);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(prev => ({ ...prev, reviews: false }));
    }
  };

  const upcomingEvents = eventsData?.content || [];
  const viewAllLink = local?.id ? `/events?localId=${local.id}` : '/events';
  const favoriteEvents = authState.isAuthenticated && authState.user?.favorites?.events 
    ? authState.user.favorites.events 
    : [];

  if (loading.local) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-grow">
          <div className="container mx-auto px-4 py-12">
            <LoadingPlaceholder />
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (!loading.local && !local) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-grow">
          <NotFoundPlaceholder />
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow">
        {local && (
          <>
            {/* Hero Section */}
            <LocalHero local={local} />
            
            {/* Content Section */}
            <section className="py-8">
              <div className="container mx-auto px-4 max-w-5xl">
                {/* Overview */}
                <OverviewCard local={local} translations={t} />
                
                {/* Schedule */}
                <ScheduleCard local={local} translations={t} />
                
                {/* Events */}
                <EventsCard 
                  events={upcomingEvents} 
                  loading={loading.events} 
                  viewAllLink={viewAllLink} 
                  translations={t}
                  favorites={favoriteEvents} 
                />
                
                {/* Drinks & Offers */}
                <DrinksOffersCard 
                  drinks={drinks}
                  offers={offers}
                  loadingDrinks={loading.drinks}
                  loadingOffers={loading.offers}
                  translations={t}
                />

                {/* Reviews */}
                <ReviewsCard 
                  reviews={reviews}
                  loading={loading.reviews}
                  translations={t}
                />
              </div>
            </section>
          </>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default LocalDetailPage;
