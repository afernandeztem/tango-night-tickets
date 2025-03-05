
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { getEvents, getLocals } from '../services/api';
import { Local, Event } from '../types';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LocalCard from '../components/LocalCard';
import EventCard from '../components/EventCard';
import { ArrowRight, Calendar, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

const HomePage: React.FC = () => {
  const { state } = useApp();
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [relevantLocals, setRelevantLocals] = useState<Local[]>([]);
  const [relevantEvents, setRelevantEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Redirect to landing page if no city is selected
    if (!state.selectedCity) {
      navigate('/');
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch relevant locals for selected city
        const localsResponse = await getLocals(state.selectedCity.name, true);
        setRelevantLocals(localsResponse.content);

        // Fetch relevant events for selected city
        const eventsResponse = await getEvents(state.selectedCity.name, undefined, true);
        setRelevantEvents(eventsResponse.content);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [state.selectedCity, navigate]);

  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-tango-primary to-purple-600 text-white py-16 md:py-24">
          <div className="container mx-auto px-4">
            <motion.div 
              className="max-w-3xl mx-auto text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-3xl md:text-5xl font-bold mb-4">
                Discover {state.selectedCity?.name}'s Best Nightlife
              </h1>
              <p className="text-lg md:text-xl opacity-90 mb-8">
                Find the hottest events, book tickets instantly, and make your night unforgettable
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => navigate('/events')}
                  className="bg-white text-tango-primary font-medium px-6 py-3 rounded-md hover:bg-opacity-90 transition-colors"
                >
                  Browse Events
                </button>
                <button 
                  onClick={() => navigate('/locals')}
                  className="bg-transparent text-white border border-white font-medium px-6 py-3 rounded-md hover:bg-white/10 transition-colors"
                >
                  Explore Venues
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* City Info Section */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <motion.div 
              className="flex flex-col md:flex-row items-center justify-between"
              variants={fadeInUpVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="mb-6 md:mb-0">
                <div className="flex items-center mb-4">
                  <MapPin className="text-tango-primary h-5 w-5 mr-2" />
                  <h2 className="text-2xl font-medium">Exploring {state.selectedCity?.name}</h2>
                </div>
                <p className="text-gray-600 max-w-2xl">
                  Discover the best nightlife experiences in {state.selectedCity?.name}. From trendy clubs to intimate locals, 
                  we've curated the top spots for an unforgettable night out.
                </p>
              </div>
              <div className="flex items-center">
                <Calendar className="text-tango-primary h-5 w-5 mr-2" />
                <span className="text-gray-600">Today's Date: {new Date().toLocaleDateString()}</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Featured Events Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-medium">Featured Events</h2>
              <button 
                onClick={() => navigate('/events')}
                className="flex items-center text-tango-primary hover:underline"
              >
                View All <ArrowRight className="ml-1 h-4 w-4" />
              </button>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="h-80 bg-gray-100 animate-pulse rounded-lg"></div>
                ))}
              </div>
            ) : relevantEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relevantEvents.slice(0, 3).map((event, index) => (
                  <motion.div
                    key={event.id}
                    variants={fadeInUpVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: index * 0.1 }}
                  >
                    <EventCard event={event} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-600">No events available right now. Check back soon!</p>
              </div>
            )}
          </div>
        </section>

        {/* Featured Locals Section */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-medium">Popular Venues</h2>
              <button 
                onClick={() => navigate('/locals')}
                className="flex items-center text-tango-primary hover:underline"
              >
                View All <ArrowRight className="ml-1 h-4 w-4" />
              </button>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="h-80 bg-gray-100 animate-pulse rounded-lg"></div>
                ))}
              </div>
            ) : relevantLocals.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relevantLocals.slice(0, 3).map((local, index) => (
                  <motion.div
                    key={local.id}
                    variants={fadeInUpVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: index * 0.1 }}
                  >
                    <LocalCard local={local} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg">
                <p className="text-gray-600">No venues available right now. Check back soon!</p>
              </div>
            )}
          </div>
        </section>

        {/* Favorites Section - Only show if logged in */}
        {auth.isAuthenticated && auth.user?.favorites && (
          <section className="py-12">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-medium">Your Favorites</h2>
                <button 
                  onClick={() => navigate('/favorites')}
                  className="flex items-center text-tango-primary hover:underline"
                >
                  View All <ArrowRight className="ml-1 h-4 w-4" />
                </button>
              </div>

              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-600">Your favorite events and venues will appear here.</p>
              </div>
            </div>
          </section>
        )}

        {/* App Download Banner */}
        <section className="bg-tango-primary text-white py-10">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-6 md:mb-0">
                <h2 className="text-xl md:text-2xl font-medium mb-2">Get the Full Experience</h2>
                <p className="opacity-90">
                  Download the TangoApp mobile app for exclusive deals and easier ticket management.
                </p>
              </div>
              <button className="bg-white text-tango-primary font-medium px-6 py-3 rounded-md hover:bg-opacity-90 transition-colors">
                Download App
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
