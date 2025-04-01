
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Search, Store, ChevronLeft, ChevronRight } from 'lucide-react';
import { Local } from '../types';
import { getLocals } from '../services/api';
import { useApp } from '../context/AppContext';
import LocalCard from '../components/LocalCard';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';

const LocalsPage: React.FC = () => {
  const { state } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  
  // Use originalName for API calls if available, otherwise fallback to name
  const cityName = state.selectedCity?.originalName || state.selectedCity?.name || '';
  
  const { data: localsData, isLoading } = useQuery({
    queryKey: ['locals', cityName, searchTerm, currentPage],
    queryFn: () => getLocals({ 
      city: cityName,
      search: searchTerm || undefined,
      page: currentPage,
      size: 12
    }),
    placeholderData: (prev) => prev
  });
  
  const translations = {
    en: {
      title: 'Locals',
      subtitle: 'Discover venues in',
      search: 'Search locals...',
      noLocals: 'No locals found with the current filters',
      loading: 'Loading locals...',
      page: 'Page',
      of: 'of',
      previous: 'Previous',
      next: 'Next'
    },
    es: {
      title: 'Locales',
      subtitle: 'Descubre lugares en',
      search: 'Buscar locales...',
      noLocals: 'No se encontraron locales con los filtros actuales',
      loading: 'Cargando locales...',
      page: 'Página',
      of: 'de',
      previous: 'Anterior',
      next: 'Siguiente'
    }
  };
  
  const t = translations[state.language];
  
  const locals = localsData?.content || [];
  const totalPages = localsData?.pageable?.totalPages || 0;
  
  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(0, prev - 1));
    window.scrollTo(0, 0);
  };
  
  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  };
  
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-center">{t.title}</h1>
          <p className="text-xl text-gray-600 mb-8 text-center">
            {t.subtitle} {state.selectedCity?.displayName || state.selectedCity?.name || ''}
          </p>
          
          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(0); // Reset to first page on search
                }}
                placeholder={t.search}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-tango-primary focus:border-tango-primary"
              />
            </div>
          </div>
          
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-tango-primary mb-4"></div>
              <p>{t.loading}</p>
            </div>
          ) : locals.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {locals.map((local: Local) => (
                  <LocalCard key={local.id} local={local} />
                ))}
              </div>
              
              {totalPages > 1 && (
                <div className="mt-10">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={handlePreviousPage}
                          className={currentPage === 0 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                      
                      {/* Display page numbers */}
                      {[...Array(totalPages)].map((_, index) => {
                        // Show current page, first, last, and one page before and after current
                        if (
                          index === 0 || 
                          index === totalPages - 1 ||
                          index === currentPage ||
                          index === currentPage - 1 ||
                          index === currentPage + 1
                        ) {
                          return (
                            <PaginationItem key={index}>
                              <PaginationLink 
                                onClick={() => {
                                  setCurrentPage(index);
                                  window.scrollTo(0, 0);
                                }}
                                isActive={currentPage === index}
                                className="cursor-pointer"
                              >
                                {index + 1}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        }
                        // Show ellipsis for gaps
                        if (
                          (index === 1 && currentPage > 2) ||
                          (index === totalPages - 2 && currentPage < totalPages - 3)
                        ) {
                          return (
                            <PaginationItem key={index}>
                              <span className="flex h-9 w-9 items-center justify-center">...</span>
                            </PaginationItem>
                          );
                        }
                        return null;
                      })}
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={handleNextPage}
                          className={currentPage >= totalPages - 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Store size={48} className="mx-auto mb-4 text-gray-300" />
              <p>{t.noLocals}</p>
            </div>
          )}
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default LocalsPage;
