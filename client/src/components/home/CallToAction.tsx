import { useState } from "react";
import { Link } from "wouter";
import { Zap, Rocket } from "lucide-react";

export default function CallToAction() {
  // Variação A/B test para o botão CTA
  // Versão 1: "Experimente grátis por 7 dias"
  // Versão 2: "Quero viralizar - Começar agora"
  const [buttonVersion] = useState(Math.random() > 0.5 ? 1 : 2);

  return (
    <section className="section bg-gradient-to-br from-primary to-accent relative overflow-hidden py-20">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl"></div>
      
      <div className="container text-center relative z-10">
        <h2 className="text-3xl md:text-5xl text-white font-bold mb-6">Pronto para revolucionar seu conteúdo?</h2>
        <p className="text-white/90 max-w-2xl mx-auto mb-10 text-lg">Junte-se a milhares de criadores que economizam tempo e aumentam seu engajamento com o ContentPro.</p>
        
        <Link href="/dashboard">
          {buttonVersion === 1 ? (
            <div className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold px-8 py-4 rounded-xl transition shadow-xl cursor-pointer">
              <Zap className="h-5 w-5 text-white" />
              <span>Experimente Grátis por 7 Dias</span>
            </div>
          ) : (
            <div className="inline-flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold px-8 py-4 rounded-xl transition shadow-xl cursor-pointer">
              <Rocket className="h-5 w-5 text-white" />
              <span>Quero Viralizar - Começar Agora</span>
            </div>
          )}
        </Link>
        
        <div className="max-w-lg mx-auto bg-white/10 rounded-lg p-3 mt-8 backdrop-blur-sm">
          <p className="text-white font-medium flex items-center justify-center gap-2 text-sm">
            <span className="text-lg">🛡️</span>
            Sem necessidade de cartão de crédito • Garantia de 7 dias ou seu dinheiro de volta
          </p>
        </div>
      </div>
    </section>
  );
}
