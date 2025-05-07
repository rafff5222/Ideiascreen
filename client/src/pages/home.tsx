import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import HowItWorks from "@/components/home/HowItWorks";
import Pricing from "@/components/home/Pricing";
import Testimonials from "@/components/home/Testimonials";
import CallToAction from "@/components/home/CallToAction";
import { useEffect } from "react";
import { Helmet } from 'react-helmet';

// Componentes de conversão avançada
import OfferProgressBar from "@/components/conversion/OfferProgressBar";
import OneClickCheckout from "@/components/conversion/OneClickCheckout";
import TechnicalOptimizations from "@/components/conversion/TechnicalOptimizations";

export default function Home() {
  // Scroll to top when navigating to home page
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>ContentAI - Crie conteúdo viral para Instagram e TikTok com IA</title>
        <meta 
          name="description" 
          content="Crie scripts, legendas e ideias virais para Instagram e TikTok usando IA. Economize tempo e aumente seu engajamento com conteúdo otimizado."
        />
        <meta 
          property="og:title" 
          content="ContentAI - Crie conteúdo viral para redes sociais com IA" 
        />
        <meta 
          property="og:description" 
          content="Ferramenta completa de IA para criadores de conteúdo do Instagram e TikTok: scripts, legendas otimizadas e montagem automática de vídeos."
        />
        <meta 
          property="og:image" 
          content="https://contentai.com.br/social-preview.jpg" 
        />
        <meta name="twitter:card" content="summary_large_image" />
        
        {/* Schema.org markup para melhorar a visualização nos resultados do Google */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "ContentAI",
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
      <Pricing />
      <Testimonials />
      <CallToAction />
      
      {/* Componentes de Conversão */}
      <OneClickCheckout />
      <TechnicalOptimizations />
    </>
  );
}
