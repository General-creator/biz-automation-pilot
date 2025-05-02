
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

// Dashboard pages
import Dashboard from "./pages/Dashboard";
import Automations from "./pages/Automations";

// Settings pages
import Account from "./pages/settings/Account";
import Integrations from "./pages/settings/Integrations";
import Analytics from "./pages/settings/Analytics";
import Help from "./pages/settings/Help";
import Billing from "./pages/settings/Billing";
import Profile from "./pages/settings/Profile";
import Settings from "./pages/settings/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/automations" element={<Automations />} />
              
              {/* Settings routes */}
              <Route path="/settings" element={<Settings />} />
              <Route path="/settings/account" element={<Account />} />
              <Route path="/settings/profile" element={<Profile />} />
              <Route path="/settings/integrations" element={<Integrations />} />
              <Route path="/settings/analytics" element={<Analytics />} />
              <Route path="/settings/help" element={<Help />} />
              <Route path="/settings/billing" element={<Billing />} />
            </Route>
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
