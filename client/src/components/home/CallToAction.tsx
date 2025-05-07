import { useState } from "react";
import { Link } from "wouter";
import { Zap, Rocket, Shield } from "lucide-react";

export default function CallToAction() {
  // Variação A/B test para o botão CTA
  // Versão 1: "Experimente grátis por 7 dias"
  // Versão 2: "Quero viralizar - Começar agora"
  const [buttonVersion] = useState(Math.random() > 0.5 ? 1 : 2);

  return (
    <section className="section py-24 relative overflow-hidden">
      {/* Background gradiente */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-purple-700 to-pink-500"></div>
      
      {/* Padrão de grade (grid pattern) */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzBoLTJ2LTJoMnYyem0tMjAgMGgtMnYtMmgydjJ6bTIwLTIwaC0ydi0yaDJ2MnptLTIwIDBoLTJ2LTJoMnYyen0iLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-pink-500/20 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600/20 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl"></div>
      
      <div className="container text-center relative z-10">
        <h2 className="text-3xl md:text-5xl text-white font-bold mb-6 drop-shadow-sm">Pronto para revolucionar seu conteúdo?</h2>
        <p className="text-white/90 max-w-2xl mx-auto mb-10 text-lg shadow-sm">
          Junte-se a milhares de criadores que economizam tempo e <span className="font-bold text-white">aumentam seu engajamento</span> com o ContentPro.
        </p>
        
        <div className="flex flex-col items-center">
          <Link href="/dashboard">
            {buttonVersion === 1 ? (
              <div className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:brightness-110 text-white font-bold px-10 py-4 rounded-xl transition shadow-xl cursor-pointer transform hover:scale-105 duration-300">
                <Zap className="h-5 w-5 text-white" />
                <span>Experimente Grátis por 7 Dias</span>
              </div>
            ) : (
              <div className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-600 hover:brightness-110 text-white font-bold px-10 py-4 rounded-xl transition shadow-xl cursor-pointer transform hover:scale-105 duration-300">
                <Rocket className="h-5 w-5 text-white" />
                <span>Quero Viralizar - Começar Agora</span>
              </div>
            )}
          </Link>
          
          <div className="max-w-lg mx-auto bg-white/10 rounded-lg p-4 mt-8 backdrop-blur-sm border border-white/20 shadow-lg">
            <div className="flex items-center justify-center gap-3">
              <Shield className="h-5 w-5 text-white" />
              <p className="text-white font-medium text-base">
                Sem necessidade de cartão de crédito • <span className="font-bold underline">Garantia de 7 dias</span> ou seu dinheiro de volta
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
