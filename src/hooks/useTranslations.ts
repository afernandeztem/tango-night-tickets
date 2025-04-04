
import { useApp } from '../context/AppContext';

export const useLocalPageTranslations = () => {
  const { state } = useApp();
  const language = state.language as 'en' | 'es';
  
  const translations = {
    en: {
      address: 'Address',
      upcomingEvents: 'Upcoming Events',
      noEvents: 'No upcoming events at this venue.',
      addToFavorites: 'Add to Favorites',
      removeFromFavorites: 'Remove from Favorites',
      goBack: 'Go Back',
      ageRestriction: 'Age Restriction',
      capacity: 'Capacity',
      price: 'Price',
      buyTickets: 'Buy Tickets',
      noDescription: 'No description available.',
      viewAll: 'View All',
      overview: 'Overview',
      schedule: 'Schedule',
      events: 'Events',
      directions: 'Directions',
      drinkOffers: 'Drinks & Offers',
      information: 'Information',
      venue: 'Venue',
      scheduleFor: 'Schedule',
      closed: 'Closed',
      capacityInfo: 'Capacity',
      drinks: 'Drinks',
      offers: 'Offers',
      noDrinksAvailable: 'No drinks information available for this venue.',
      noOffersAvailable: 'No special offers available at this venue.',
      from: 'From',
      getDirections: 'Get Directions',
      upcomingEventsAt: 'Upcoming Events',
      category: 'Category',
      reviews: 'Reviews',
      noReviews: 'No reviews available for this venue.',
      reviewsTitle: 'Customer Reviews',
      reviewsSubtitle: 'See what others are saying',
      today: 'Today',
      writeReview: 'Write a Review',
      beFirst: 'Be the first to leave a review',
      // Index page translations
      yourNightYourWay: 'Your Night, Your Way',
      selectYourCity: 'Select Your City',
      language: 'Language'
    },
    es: {
      address: 'Dirección',
      upcomingEvents: 'Próximos Eventos',
      noEvents: 'No hay próximos eventos en este local.',
      addToFavorites: 'Agregar a Favoritos',
      removeFromFavorites: 'Eliminar de Favoritos',
      goBack: 'Volver',
      ageRestriction: 'Restricción de Edad',
      capacity: 'Capacidad',
      price: 'Precio',
      buyTickets: 'Comprar Entradas',
      noDescription: 'No hay descripción disponible.',
      viewAll: 'Ver Todos',
      overview: 'Resumen',
      schedule: 'Horario',
      events: 'Eventos',
      directions: 'Dirección',
      drinkOffers: 'Bebidas y Ofertas',
      information: 'Información',
      venue: 'Local',
      scheduleFor: 'Horario',
      closed: 'Cerrado',
      capacityInfo: 'Capacidad',
      drinks: 'Bebidas',
      offers: 'Ofertas',
      noDrinksAvailable: 'No hay información de bebidas disponible para este local.',
      noOffersAvailable: 'No hay ofertas especiales disponibles en este local.',
      from: 'Desde',
      getDirections: 'Obtener Direcciones',
      upcomingEventsAt: 'Próximos Eventos',
      category: 'Categoría',
      reviews: 'Reseñas',
      noReviews: 'No hay reseñas disponibles para este local.',
      reviewsTitle: 'Reseñas de Clientes',
      reviewsSubtitle: 'Mira lo que otros están diciendo',
      today: 'Hoy',
      writeReview: 'Escribir una Reseña',
      beFirst: 'Sé el primero en dejar una reseña',
      // Index page translations
      yourNightYourWay: 'Tu Noche, A Tu Manera',
      selectYourCity: 'Elige Tu Ciudad',
      language: 'Idioma'
    }
  };
  
  return translations[language];
};
