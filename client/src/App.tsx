import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect } from "react";
import { SubscriptionProvider } from "./contexts/SubscriptionContext";
import { initModelPreloader } from "./lib/modelPreloader";
import { plausibleAnalytics } from "./lib/analytics-plausible";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Dashboard from "@/pages/dashboard";
import Generator from "@/pages/generator";
import ScriptGenerator from "@/pages/script-generator";
import Settings from "@/pages/Settings";
import PlansPage from "@/pages/plans-table";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ErrorMonitor from "@/components/ErrorMonitor";

function Router() {
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
    plausibleAnalytics.trackPageView();
    
    // Monitorar mudanças de rota para analytics
    const handleRouteChange = () => {
      plausibleAnalytics.trackPageView();
    };
    
    // Cleanup
    return () => {
      // Cleanup se necessário
    };
  }, []);
  
  return (
    <QueryClientProvider client={queryClient}>
      <SubscriptionProvider>
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
          </div>
        </TooltipProvider>
      </SubscriptionProvider>
    </QueryClientProvider>
  );
}

export default App;
