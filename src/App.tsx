
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./contexts/AppContext";
import { AuthProvider } from "./contexts/AuthContext";
import MainLayout from "./layouts/MainLayout";
import Index from "./pages/Index";
import LandingPage from "./pages/LandingPage";
import HomePage from "./pages/HomePage";
import LocalsPage from "./pages/LocalsPage";
import LocalDetailPage from "./pages/LocalDetailPage";
import EventsPage from "./pages/EventsPage";
import EventDetailPage from "./pages/EventDetailPage";
import CheckoutPage from "./pages/CheckoutPage";
import AuthPage from "./pages/AuthPage";
import ProfilePage from "./pages/ProfilePage";
import FavoritesPage from "./pages/FavoritesPage";
import NotFound from "./pages/NotFound";
import { ROUTES } from "./config/routes";

const queryClient = new QueryClient();

const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <AppProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path={ROUTES.INDEX} element={<Index />} />
              <Route path={ROUTES.LANDING} element={<LandingPage />} />
              
              {/* Routes that use MainLayout (with header) */}
              <Route element={<MainLayout />}>
                <Route path={ROUTES.HOME} element={<HomePage />} />
                <Route path={ROUTES.LOCALS} element={<LocalsPage />} />
                <Route path={ROUTES.LOCAL_DETAIL} element={<LocalDetailPage />} />
                <Route path={ROUTES.EVENTS} element={<EventsPage />} />
                <Route path={ROUTES.EVENT_DETAIL} element={<EventDetailPage />} />
                <Route path={ROUTES.CHECKOUT} element={<CheckoutPage />} />
                <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
                <Route path={ROUTES.FAVORITES} element={<FavoritesPage />} />
              </Route>
              
              <Route path={ROUTES.AUTH} element={<AuthPage />} />
              
              {/* Catch all routes */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AppProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
