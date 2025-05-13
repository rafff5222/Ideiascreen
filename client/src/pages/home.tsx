import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import HowItWorks from "@/components/home/HowItWorks";
import Pricing from "@/components/home/Pricing";
import NovoLayoutPrecos from "@/components/home/NovoLayoutPrecos";
import PricingTable from "@/components/home/PricingTable";
import SimplifiedPricingTable from "@/components/home/SimplifiedPricingTable";
import UpdatedPricingSection from "@/components/home/UpdatedPricingSection";
import Testimonials from "@/components/home/Testimonials";
import FeaturedTestimonial from "@/components/home/FeaturedTestimonial";
import FAQ from "@/components/home/FAQ";
import CallToAction from "@/components/home/CallToAction";
import Diferenciais from "@/components/home/Diferenciais";
import { useEffect } from "react";
import { Helmet } from 'react-helmet';

// Componentes de conversão avançada
import OneClickCheckout from "@/components/conversion/OneClickCheckout";
import TechnicalOptimizations from "@/components/conversion/TechnicalOptimizations";
import ScriptOfferPopup from "@/components/conversion/ScriptOfferPopup";
// Chatbots removidos a pedido do cliente
// import SalesAiChatbot from "@/components/conversion/SalesAiChatbot";
// import SalesChatbot from "@/components/conversion/SalesChatbot";
// import MemoryChatbot from "@/components/conversion/MemoryChatbot";
import SocialProof from "@/components/conversion/SocialProof";
import MicroInteractions from "@/components/conversion/MicroInteractions";
import NichePersonalization from "@/components/conversion/NichePersonalization";
import AdvancedCheckout from "@/components/conversion/AdvancedCheckout";
import BehavioralPricing from "@/components/conversion/BehavioralPricing";
import ContextualUpsell from "@/components/conversion/ContextualUpsell";
import RealTimeScarcity from "@/components/conversion/RealTimeScarcity";
import Comparador3DPlanos from "@/components/conversion/Comparador3DPlanos";

import EngagementPersonalization from "@/components/conversion/EngagementPersonalization";
import ExpressCheckout from "@/components/conversion/ExpressCheckout";
import MagicButton from "@/components/conversion/MagicButton";
import DynamicSocialProof from "@/components/conversion/DynamicSocialProof";
import CompetitorComparison from "@/components/conversion/CompetitorComparison";
import SmartHelpButton from "@/components/conversion/SmartHelpButton";
import PurchaseCounter from "@/components/conversion/PurchaseCounter";
import ABTestCTA from "@/components/conversion/ABTestCTA";
import SmartFormOptimizer from "@/components/conversion/SmartFormOptimizer";
import StagedLoading from "@/components/optimization/StagedLoading";
import TurboLinks from "@/components/optimization/TurboLinks";
import MiniMetricsWidget from "@/components/admin/MiniMetricsWidget";
import ClickHeatmap from "@/components/analytics/ClickHeatmap";
import Heatmap3D from "@/components/analytics/Heatmap3D";
import PrivateAnalytics from "@/components/analytics/PrivateAnalytics";
import MicroConversionTracker from "@/components/analytics/MicroConversionTracker";
import MetricsPanel from "@/components/admin/MetricsPanel-new";
import TimeBasedOffers from "@/components/conversion/TimeBasedOffers";
import SmartPricing from "@/components/conversion/SmartPricing";
import InteractiveComparison from "@/components/conversion/InteractiveComparison";
import PriorityLoading from "@/components/optimization/PriorityLoading";

import MicroConversionsTracker from "@/components/analytics/MicroConversionsTracker";
export default function Home() {
  // Scroll to top when navigating to home page
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>IdeiaScreen - Crie Roteiros Profissionais e Cinematográficos com IA</title>
        <meta 
          name="description" 
          content="Crie roteiros profissionais para vídeos, podcasts e apresentações em segundos usando IA. Estrutura narrativa profissional e resultados impressionantes."
        />
        <meta 
          name="keywords" 
          content="roteiro, cinema, escritor criativo, IA, narrativa, gerador de roteiros, inteligência artificial"
        />
        <meta 
          property="og:title" 
          content="IdeiaScreen - Roteiros Profissionais Gerados por IA" 
        />
        <meta 
          property="og:description" 
          content="Transforme ideias em roteiros cinematográficos em segundos. IA especializada em narrativa com estrutura profissional."
        />
        <meta 
          property="og:image" 
          content="https://contentpro.com.br/social-preview.jpg" 
        />
        <meta 
          property="og:url" 
          content="https://seusite.com/gerador-roteiros" 
        />
        <meta name="twitter:card" content="summary_large_image" />
        
        {/* Schema.org markup para melhorar a visualização nos resultados do Google */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "IdeiaScreen",
            "applicationCategory": "CreativeWritingApplication",
            "operatingSystem": "Web",
            "description": "IA especializada em geração de roteiros profissionais com estrutura narrativa cinematográfica",
            "offers": [
              {
                "@type": "Offer",
                "name": "Gratuito",
                "price": "0",
                "priceCurrency": "BRL"
              },
              {
                "@type": "Offer",
                "name": "Iniciante",
                "price": "27.90",
                "priceCurrency": "BRL"
              },
              {
                "@type": "Offer",
                "name": "Profissional",
                "price": "79.90",
                "priceCurrency": "BRL"
              },
              {
                "@type": "Offer",
                "name": "Estúdio",
                "price": "249.90",
                "priceCurrency": "BRL"
              }
            ],
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "ratingCount": "2400"
            },
            "featureList": "37 gêneros cinematográficos, Análise de Crítico de Cinema, Modo Diretor, Exportação em múltiplos formatos"
          })}
        </script>
        
        {/* Preload de recursos críticos */}
        <link 
          rel="preload" 
          href="https://cdn-icons-png.flaticon.com/512/196/196578.png" 
          as="image"
        />
      </Helmet>
      
      {/* Componentes principais da página */}
      <Hero />
      <ScriptOfferPopup />
      <Diferenciais />
      <FeaturedTestimonial />
      <UpdatedPricingSection />
      <Features />
      <HowItWorks />
      <FAQ />
      <CallToAction />
      
      {/* Componentes de Conversão */}
      <OneClickCheckout />
      {/* Chatbots removidos a pedido do cliente */}
      <SocialProof />
      <ClickHeatmap />
      <Heatmap3D />
      <MetricsPanel />
      <TechnicalOptimizations />
      <MicroInteractions />
      <NichePersonalization />
      <BehavioralPricing />
      <ContextualUpsell />
      <AdvancedCheckout />
      <PrivateAnalytics />
      <MicroConversionTracker />
      <RealTimeScarcity />
      <Comparador3DPlanos />

      <EngagementPersonalization />
      <ExpressCheckout />
      <MagicButton />
      <DynamicSocialProof />
      <CompetitorComparison />
      <SmartHelpButton />
      <PurchaseCounter />
      <ABTestCTA />
      <SmartFormOptimizer />
      <TimeBasedOffers />
      {/* MemoryChatbot também removido */}
      <SmartPricing />
      {/* <InteractiveComparison /> - Removido a pedido do cliente */}

      <PriorityLoading />
      <MicroConversionsTracker />
      <MiniMetricsWidget />
      <StagedLoading />
      <TurboLinks />
    </>
  );
}
