import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Pricing() {
  return (
    <section id="precos" className="section bg-gradient-to-br from-primary/5 to-accent/5">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl mb-4">Preços simples e transparentes</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Sem surpresas, sem taxas ocultas. Apenas valor incrível para impulsionar sua presença nas redes sociais.</p>
        </div>

        <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          <div className="bg-primary/10 p-8 text-center">
            <h3 className="font-poppins font-bold text-2xl mb-2">Assinatura ContentPro</h3>
            <div className="flex items-center justify-center mb-4">
              <span className="text-4xl font-bold text-primary">R$ 59</span>
              <span className="text-gray-600 ml-2">/mês</span>
            </div>
            <p className="text-gray-600">Tudo o que você precisa para criar conteúdo envolvente</p>
          </div>
          <div className="p-8">
            <ul className="space-y-4">
              <li className="flex items-start">
                <i className="ri-check-line text-green-500 text-xl mr-3 mt-0.5"></i>
                <span>Geração ilimitada de roteiros, legendas e ideias</span>
              </li>
              <li className="flex items-start">
                <i className="ri-check-line text-green-500 text-xl mr-3 mt-0.5"></i>
                <span>Acesso a todos os formatos (Instagram, TikTok, Reels)</span>
              </li>
              <li className="flex items-start">
                <i className="ri-check-line text-green-500 text-xl mr-3 mt-0.5"></i>
                <span>Biblioteca com histórico de conteúdo gerado</span>
              </li>
              <li className="flex items-start">
                <i className="ri-check-line text-green-500 text-xl mr-3 mt-0.5"></i>
                <span>Personalização avançada para sua marca</span>
              </li>
              <li className="flex items-start">
                <i className="ri-check-line text-green-500 text-xl mr-3 mt-0.5"></i>
                <span>Exportação em diversos formatos</span>
              </li>
            </ul>

            <Button asChild className="w-full bg-primary hover:bg-opacity-90 mt-8">
              <Link href="/dashboard">
                <a>Começar Agora</a>
              </Link>
            </Button>
            <p className="text-center text-sm text-gray-500 mt-4">7 dias de garantia de devolução do dinheiro</p>
          </div>
        </div>
      </div>
    </section>
  );
}
