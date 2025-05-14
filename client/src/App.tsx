import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect, useState } from "react";
import { SubscriptionProvider } from "./contexts/SubscriptionContext";
import { AuthProvider } from "./contexts/AuthContext";
import { initModelPreloader } from "./lib/modelPreloader";
import { plausibleAnalytics } from "./lib/analytics-plausible";
import NotFound from "@/pages/not-found";
import LimitedTimeOffer from "@/components/conversion/LimitedTimeOffer";
import Home from "@/pages/home";
import Dashboard from "@/pages/dashboard";
import Generator from "@/pages/generator";
import ScriptGenerator from "@/pages/script-generator";
import Settings from "@/pages/Settings";
import PlansPage from "@/pages/plans-table";
import Login from "@/pages/login";
import Register from "@/pages/register";
import ForgotPassword from "@/pages/forgot-password";
import ResetPassword from "@/pages/reset-password";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ErrorMonitor from "@/components/ErrorMonitor";

function Router() {
  const [location] = useLocation();
  
  // Monitorar mudanças de rota para analytics
  useEffect(() => {
    plausibleAnalytics.trackPageView(location);
  }, [location]);

  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/generator" component={Generator} />
      <Route path="/roteiros" component={ScriptGenerator} />
      <Route path="/script-generator" component={ScriptGenerator} />
      <Route path="/settings" component={Settings} />
      <Route path="/plans" component={PlansPage} />
      <Route path="/planos" component={PlansPage} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/signup" component={Register} />
      <Route path="/cadastro" component={Register} />
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/reset-password" component={ResetPassword} />
      <Route path="/reset-password/:token" component={ResetPassword} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // Inicializa o pré-carregamento de modelos
  useEffect(() => {
    // Inicializa o pré-carregamento de modelos
    initModelPreloader();
    
    // Inicializa o Plausible Analytics
    plausibleAnalytics.init();
    
    // Não é necessário chamar trackPageView aqui pois o Router já o faz
  }, []);
  
  return (
    <QueryClientProvider client={queryClient}>
      <SubscriptionProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow">
                <Router />
              </main>
              <Footer />
              
              {/* Analytics e Componentes de Conversão */}
              <ErrorMonitor />
              <LimitedTimeOffer />
            </div>
          </TooltipProvider>
        </AuthProvider>
      </SubscriptionProvider>
    </QueryClientProvider>
  );
}

export default App;
