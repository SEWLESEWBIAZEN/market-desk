
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { PrivateRoute } from "@/components/auth/PrivateRoute";

import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import { PlatformPage } from "./pages/PlatformPages";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";
import SignUPPage from "./pages/SignUpPage";
import UserPage from "./pages/UserPage";
import MFAPage from "./pages/MFAPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster/>
        <Sonner position="top-right" richColors/>
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/sign-up" element={<SignUPPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/user" element={<UserPage />} />
            {/* Redirect root to dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route
              path="/mfa"
              element={<MFAPage />} />

            {/* Protected routes */}

            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <DashboardPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard/:platform"
              element={
                <PrivateRoute>
                  <PlatformPage />
                </PrivateRoute>
              }
            />

            <Route
              path="/dashboard/settings"
              element={
                <PrivateRoute>
                  <SettingsPage />
                </PrivateRoute>
              }
            />

            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
