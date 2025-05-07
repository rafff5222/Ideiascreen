import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import HowItWorks from "@/components/home/HowItWorks";
import Pricing from "@/components/home/Pricing";
import Testimonials from "@/components/home/Testimonials";
import CallToAction from "@/components/home/CallToAction";
import { useEffect } from "react";

export default function Home() {
  // Scroll to top when navigating to home page
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Hero />
      <Features />
      <HowItWorks />
      <section className="section bg-white">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <img 
                src="https://images.unsplash.com/photo-1587614382346-4ec70e388b28?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=450&q=80" 
                alt="Trabalhando em roteiros de vídeo" 
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
            <div className="md:w-1/2">
              <h2 className="text-3xl md:text-4xl mb-6">Veja nosso gerador de conteúdo em ação</h2>
              <p className="text-gray-600 mb-8">Nossa plataforma intuitiva torna a criação de conteúdo para redes sociais mais rápida e eficiente do que nunca.</p>
              <div className="flex flex-col space-y-4">
                <a 
                  href="/dashboard" 
                  className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 rounded-lg transition text-center"
                >
                  Experimentar Agora
                </a>
                <a 
                  href="#como-funciona" 
                  className="w-full flex items-center justify-center gap-2 font-medium text-gray-700 hover:text-primary transition text-center"
                >
                  <i className="ri-play-circle-line text-xl"></i>
                  Ver como funciona
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Pricing />
      <Testimonials />
      <CallToAction />
    </>
  );
}
