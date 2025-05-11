import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Dashboard from "@/pages/dashboard";
import Generator from "@/pages/generator";
import Demo from "@/pages/demo";
import GenerationDemo from "@/pages/GenerationDemo";
import VideoDemo from "@/pages/VideoDemo";
import VideoTester from "@/pages/VideoTester";
import VideoLibrary from "@/pages/VideoLibrary";
import VideoPreview from "@/pages/VideoPreview";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ExitPopup from "@/components/ui/exit-popup";
import UnificadorPrecos from "./components/home/UnificadorPrecos";

// Componentes de analytics e conversão
import ClickTracker from "@/components/analytics/ClickTracker";
import RetentionPixel from "@/components/analytics/RetentionPixel";
import UpsellModal from "@/components/upsell/UpsellModal";
import SocialProof from "@/components/conversion/SocialProof";
import OneClickCheckout from "@/components/conversion/OneClickCheckout";
import ErrorMonitor from "@/components/ErrorMonitor";
import DiagnosticTool from "@/components/debug/DiagnosticTool";

// Novos componentes de conversão
import ProgressBarOffer from "@/components/conversion/ProgressBarOffer";
import PurchaseCounter from "@/components/conversion/PurchaseCounter";
import DynamicSocialProof from "@/components/conversion/DynamicSocialProof";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/generator" component={Generator} />
      <Route path="/demo" component={Demo} />
      <Route path="/generation-demo" component={GenerationDemo} />
      <Route path="/video-demo" component={VideoDemo} />
      <Route path="/video-tester" component={VideoTester} />
      <Route path="/video-library" component={VideoLibrary} />
      <Route path="/video-preview" component={VideoPreview} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Router />
          </main>
          <Footer />
          
          {/* Unificador de preços em toda a aplicação */}
          <UnificadorPrecos />
          
          {/* Analytics e Componentes de Conversão */}
          <ClickTracker />
          <RetentionPixel />
          <UpsellModal />
          <SocialProof />
          <OneClickCheckout />
          <ErrorMonitor />
          <DiagnosticTool />
          <PurchaseCounter />
          
          {/* Exibe componentes apenas na página inicial */}
          <Route path="/">
            <ProgressBarOffer />
            <ExitPopup />
            <DynamicSocialProof />
          </Route>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
