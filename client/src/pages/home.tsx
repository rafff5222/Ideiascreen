import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import HowItWorks from "@/components/home/HowItWorks";
import Pricing from "@/components/home/Pricing";
import NovoLayoutPrecos from "@/components/home/NovoLayoutPrecos";
import PricingTable from "@/components/home/PricingTable";
import Testimonials from "@/components/home/Testimonials";
import FAQ from "@/components/home/FAQ";
import CallToAction from "@/components/home/CallToAction";
import { useEffect } from "react";
import { Helmet } from 'react-helmet';

// Componentes de conversão avançada
import OfferProgressBar from "@/components/conversion/OfferProgressBar";
import OneClickCheckout from "@/components/conversion/OneClickCheckout";
import TechnicalOptimizations from "@/components/conversion/TechnicalOptimizations";
import SalesAiChatbot from "@/components/conversion/SalesAiChatbot";
import SocialProof from "@/components/conversion/SocialProof";
import SalesChatbot from "@/components/conversion/SalesChatbot";
import MicroInteractions from "@/components/conversion/MicroInteractions";
import NichePersonalization from "@/components/conversion/NichePersonalization";
import AdvancedCheckout from "@/components/conversion/AdvancedCheckout";
import BehavioralPricing from "@/components/conversion/BehavioralPricing";
import ContextualUpsell from "@/components/conversion/ContextualUpsell";
import RealTimeScarcity from "@/components/conversion/RealTimeScarcity";
import Comparador3DPlanos from "@/components/conversion/Comparador3DPlanos";
import VoiceAssistant from "@/components/conversion/VoiceAssistant";
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
import MemoryChatbot from "@/components/conversion/MemoryChatbot";
import SmartPricing from "@/components/conversion/SmartPricing";
import PostInteractionUpsell from "@/components/conversion/PostInteractionUpsell";
import InteractiveComparison from "@/components/conversion/InteractiveComparison";
import PriorityLoading from "@/components/optimization/PriorityLoading";
import VoiceCommandButton from "@/components/conversion/VoiceCommandButton";
import MicroConversionsTracker from "@/components/analytics/MicroConversionsTracker";
export default function Home() {
  // Scroll to top when navigating to home page
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>ContentPro - Crie Vídeos Virais para Instagram e TikTok com IA</title>
        <meta 
          name="description" 
          content="Crie scripts, legendas e ideias virais para Instagram e TikTok usando IA. Economize tempo e aumente seu engajamento com conteúdo otimizado."
        />
        <meta 
          property="og:title" 
          content="ContentPro - Crie conteúdo viral para redes sociais com IA" 
        />
        <meta 
          property="og:description" 
          content="Ferramenta completa de IA para criadores de conteúdo do Instagram e TikTok: scripts, legendas otimizadas e montagem automática de vídeos."
        />
        <meta 
          property="og:image" 
          content="https://contentpro.com.br/social-preview.jpg" 
        />
        <meta name="twitter:card" content="summary_large_image" />
        
        {/* Schema.org markup para melhorar a visualização nos resultados do Google */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "ContentPro",
            "applicationCategory": "SocialMediaApplication",
            "operatingSystem": "Web",
            "offers": {
              "@type": "Offer",
              "price": "59.00",
              "priceCurrency": "BRL"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "ratingCount": "2783"
            }
          })}
        </script>
        
        {/* Preload de recursos críticos */}
        <link 
          rel="preload" 
          href="https://cdn-icons-png.flaticon.com/512/196/196578.png" 
          as="image"
        />
      </Helmet>
      
      {/* Barra de oferta temporária com gatilho FOMO */}
      <OfferProgressBar />
      
      {/* Componentes principais da página */}
      <Hero />
      <Features />
      <HowItWorks />
      <PricingTable />
      <Testimonials />
      <FAQ />
      <CallToAction />
      
      {/* Componentes de Conversão */}
      <OneClickCheckout />
      <SalesAiChatbot />
      <SalesChatbot />
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
      <VoiceAssistant />
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
      <MemoryChatbot />
      <SmartPricing />
      <PostInteractionUpsell />
      <InteractiveComparison />
      <VoiceCommandButton />
      <PriorityLoading />
      <MicroConversionsTracker />
      <MiniMetricsWidget />
      <StagedLoading />
      <TurboLinks />
    </>
  );
}
