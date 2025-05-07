import { Link } from "wouter";
import { Zap } from "lucide-react";

export default function CallToAction() {
  return (
    <section className="section bg-gradient-to-br from-primary to-accent relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl"></div>
      
      <div className="container text-center relative z-10">
        <h2 className="text-3xl md:text-5xl text-white font-bold mb-6">Pronto para revolucionar seu conteúdo?</h2>
        <p className="text-white/90 max-w-2xl mx-auto mb-10 text-lg">Junte-se a milhares de criadores que economizam tempo e aumentam seu engajamento com o ContentPro.</p>
        <Link href="/dashboard">
          <div className="inline-flex items-center justify-center gap-2 bg-white text-primary font-medium px-8 py-4 rounded-xl hover:bg-gray-100 transition shadow-xl cursor-pointer">
            <Zap className="h-5 w-5 text-primary" />
            <span>Começar Grátis por 7 Dias</span>
          </div>
        </Link>
        <p className="text-white/80 mt-6 font-medium">Sem necessidade de cartão de crédito • Apenas R$59/mês após o período de teste</p>
      </div>
    </section>
  );
}
