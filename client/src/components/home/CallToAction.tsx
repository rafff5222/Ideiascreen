import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function CallToAction() {
  return (
    <section className="py-20 bg-gradient-to-br from-primary-900 to-primary relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Pronto para revolucionar sua criação de conteúdo?
          </h2>
          
          <p className="text-xl text-white/80 mb-8">
            Junte-se a mais de 2.700 criadores de conteúdo que estão economizando tempo e aumentando seu engajamento com nossa plataforma.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              className="btn-premium text-lg px-8 py-6 flex items-center"
              onClick={() => window.location.href = '#planos'}
            >
              Começar agora
              <ArrowRight size={20} className="ml-2" />
            </Button>
            
            <Button 
              variant="outline"
              className="bg-white/10 text-lg border-white/20 text-white hover:bg-white/20 px-8 py-6"
            >
              Ver demonstração
            </Button>
          </div>
          
          <p className="mt-6 text-sm text-white/60">
            Cancele a qualquer momento. Garantia de 7 dias ou seu dinheiro de volta.
          </p>
        </div>
      </div>
    </section>
  );
}