import { Toaster } from "@/components/ui/toaster";
import { supabase } from "@/lib/supabase";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { DataProvider } from "@/contexts/DataContext";
import { Layout } from "@/components/Layout";
import { PageTransition } from "@/components/PageTransition";
import { InstallPrompt } from "@/components/InstallPrompt";
import Index from "./pages/Index";
import { RulesPage } from "./pages/RulesPage";
import { AwardsPage } from "./pages/AwardsPage";
import { LoginPage } from "./pages/LoginPage";
import { AdminPage } from "./pages/AdminPage";
import NotFound from "./pages/NotFound";
import { registerServiceWorker } from "@/lib/pwa";
import { useEffect } from "react";

const queryClient = new QueryClient();

function AppRoutes() {
  const location = useLocation();

  return (
    <Layout>
      <PageTransition>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Index />} />
          <Route path="/regras" element={<RulesPage />} />
          <Route path="/premiacoes" element={<AwardsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </PageTransition>
    </Layout>
  );
}

const App = () => {
  useEffect(() => {
    registerServiceWorker();

    // Track visit
    const trackVisit = async () => {
      const hasVisited = sessionStorage.getItem('visited');
      if (!hasVisited) {
        try {
          const { error } = await supabase.rpc('increment_visits');
          if (!error) {
            sessionStorage.setItem('visited', 'true');
          }
        } catch (err) {
          console.error('Error tracking visit:', err);
        }
      }
    };
    trackVisit();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <DataProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AppRoutes />
              <InstallPrompt />
            </BrowserRouter>
          </DataProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
