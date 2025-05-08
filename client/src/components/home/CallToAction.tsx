import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import SmartForm from "@/components/conversion/SmartForm";
import { useState } from "react";

export default function CallToAction() {
  const [showForm, setShowForm] = useState(false);
  
  const handleFormSubmit = (data: { email: string; phone: string }) => {
    console.log('Formulário enviado com sucesso:', data);
    // Em um caso real, enviaríamos para a API e redirecionaríamos o usuário
  };
  
  return (
    <section className="py-20 bg-gradient-to-br from-primary-900 to-primary relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Pronto para revolucionar sua criação de conteúdo?
              </h2>
              
              <p className="text-xl text-white/80 mb-8">
                Junte-se a mais de 2.700 criadores de conteúdo que estão economizando tempo e aumentando seu engajamento com nossa plataforma.
              </p>
              
              {!showForm && (
                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  <Button 
                    className="btn-premium text-lg px-8 py-6 flex items-center"
                    onClick={() => setShowForm(true)}
                  >
                    Começar agora
                    <ArrowRight size={20} className="ml-2" />
                  </Button>
                  
                  <Button 
                    variant="outline"
                    className="bg-white/10 text-lg border-white/20 text-white hover:bg-white/20 px-8 py-6"
                    onClick={() => window.location.href = '#planos'}
                  >
                    Ver planos
                  </Button>
                </div>
              )}
              
              <p className="mt-6 text-sm text-white/60">
                Cancele a qualquer momento. Garantia de 7 dias ou seu dinheiro de volta.
              </p>
            </div>
            
            {showForm ? (
              <div className="md:ml-auto w-full max-w-md">
                <SmartForm 
                  onSubmit={handleFormSubmit} 
                  buttonText="Criar minha conta" 
                />
              </div>
            ) : (
              <div className="hidden md:block bg-white/10 backdrop-blur rounded-xl p-8">
                <div className="flex items-center justify-center">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Seus dados estão seguros</h3>
                    <p className="text-white/70">
                      Utilizamos criptografia de ponta a ponta e nunca compartilhamos seus dados com terceiros.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}