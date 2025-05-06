
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AppProvider } from "@/contexts/AppContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Dashboard from "@/pages/Dashboard";
import AddTask from "@/pages/AddTask";
import GiveBrowniePoint from "@/pages/GiveBrowniePoint";
import History from "@/pages/History";
import Rewards from "@/pages/Rewards";
import NotFound from "@/pages/NotFound";
import Auth from "@/pages/Auth";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/signin" element={!user ? <Auth /> : <Navigate to="/" />} />
      <Route path="/signup" element={!user ? <Auth /> : <Navigate to="/" />} />
      
      <Route path="/" element={
        <ProtectedRoute>
          <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />
            <main className="flex-1 pb-12">
              <Dashboard />
            </main>
          </div>
        </ProtectedRoute>
      } />
      
      <Route path="/add-task" element={
        <ProtectedRoute>
          <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />
            <main className="flex-1 pb-12">
              <AddTask />
            </main>
          </div>
        </ProtectedRoute>
      } />
      
      <Route path="/give-brownie-point" element={
        <ProtectedRoute>
          <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />
            <main className="flex-1 pb-12">
              <GiveBrowniePoint />
            </main>
          </div>
        </ProtectedRoute>
      } />
      
      <Route path="/history" element={
        <ProtectedRoute>
          <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />
            <main className="flex-1 pb-12">
              <History />
            </main>
          </div>
        </ProtectedRoute>
      } />
      
      <Route path="/rewards" element={
        <ProtectedRoute>
          <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />
            <main className="flex-1 pb-12">
              <Rewards />
            </main>
          </div>
        </ProtectedRoute>
      } />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <AppProvider>
            <Toaster />
            <Sonner />
            <AppRoutes />
          </AppProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
