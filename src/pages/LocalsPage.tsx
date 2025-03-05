
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getLocals } from '../services/api';
import { Local } from '../types';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LocalCard from '../components/LocalCard';
import { Search, Filter, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

const LocalsPage: React.FC = () => {
  const { state } = useApp();
  const navigate = useNavigate();
  const [locals, setLocals] = useState<Local[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredLocals, setFilteredLocals] = useState<Local[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    // Redirect to landing page if no city is selected
    if (!state.selectedCity) {
      navigate('/');
      return;
    }

    const fetchLocals = async () => {
      setLoading(true);
      try {
        const response = await getLocals(state.selectedCity.name, false, currentPage);
        setLocals(response.content);
        setFilteredLocals(response.content);
        setTotalPages(response.pageable.totalPages);
      } catch (error) {
        console.error('Error fetching locals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLocals();
  }, [state.selectedCity, navigate, currentPage]);

  // Filter locals based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredLocals(locals);
    } else {
      const filtered = locals.filter(local => 
        local.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        local.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredLocals(filtered);
    }
  }, [searchTerm, locals]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is already handled by the useEffect above
  };

  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-tango-primary to-purple-600 text-white py-12">
          <div className="container mx-auto px-4">
            <motion.div 
              className="max-w-3xl mx-auto text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Explore Venues in {state.selectedCity?.name}
              </h1>
              <p className="text-lg opacity-90 mb-8">
                Discover the best clubs, bars and dance halls for your perfect night out
              </p>
              
              <form onSubmit={handleSearch} className="max-w-xl mx-auto">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by name, type, or features..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-3 pl-12 bg-white bg-opacity-90 rounded-md focus:outline-none focus:ring-2 focus:ring-white text-gray-800"
                  />
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                </div>
              </form>
            </motion.div>
          </div>
        </section>

        {/* City Info */}
        <section className="py-6 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center">
              <MapPin className="text-tango-primary h-5 w-5 mr-2" />
              <h2 className="text-xl font-medium">Venues in {state.selectedCity?.name}</h2>
            </div>
          </div>
        </section>

        {/* Locals Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {/* Filters (simplified) */}
            <div className="mb-8 flex justify-end">
              <button className="flex items-center text-gray-600 hover:text-tango-primary">
                <Filter className="h-5 w-5 mr-2" />
                Filter
              </button>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="h-80 bg-gray-100 animate-pulse rounded-lg"></div>
                ))}
              </div>
            ) : filteredLocals.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredLocals.map((local, index) => (
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
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-600">No venues match your search. Try different keywords.</p>
              </div>
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div className="mt-10 flex justify-center">
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                    disabled={currentPage === 0}
                    className={`px-4 py-2 rounded-md ${
                      currentPage === 0
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Previous
                  </button>
                  
                  <div className="flex space-x-1">
                    {[...Array(Math.min(5, totalPages))].map((_, index) => {
                      // Logic to display page numbers around current page
                      let pageNum = currentPage;
                      if (totalPages <= 5) {
                        pageNum = index;
                      } else if (currentPage < 3) {
                        pageNum = index;
                      } else if (currentPage > totalPages - 3) {
                        pageNum = totalPages - 5 + index;
                      } else {
                        pageNum = currentPage - 2 + index;
                      }
                      
                      return (
                        <button
                          key={index}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-10 h-10 flex items-center justify-center rounded-md ${
                            currentPage === pageNum
                              ? 'bg-tango-primary text-white'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          {pageNum + 1}
                        </button>
                      );
                    })}
                  </div>
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                    disabled={currentPage === totalPages - 1}
                    className={`px-4 py-2 rounded-md ${
                      currentPage === totalPages - 1
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default LocalsPage;
