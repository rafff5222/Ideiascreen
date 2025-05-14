import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { Spinner } from "@/components/ui/spinner";

/**
 * Página de Redirecionamento para /script-generator
 * Esta página existe apenas para redirecionar acessos do antigo link "/roteiros"
 * para a nova página correta "/script-generator"
 */
export default function RoteirosRedirect() {
  const [, setLocation] = useLocation();
  
  // Redireciona para a página correta
  useEffect(() => {
    // Pequeno delay para garantir que o usuário veja a mensagem
    const redirectTimer = setTimeout(() => {
      setLocation('/script-generator');
    }, 1500);
    
    return () => clearTimeout(redirectTimer);
  }, [setLocation]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
      <div className="text-center max-w-md">
        <div className="mb-6">
          <Spinner className="w-12 h-12 text-amber-400" />
        </div>
        
        <h1 className="text-2xl md:text-3xl font-bold mb-4">
          Redirecionando...
        </h1>
        
        <p className="text-gray-300 mb-8">
          Estamos direcionando você para nosso <span className="text-amber-400 font-medium">Gerador de Roteiros</span> renovado.
        </p>
        
        <div className="bg-gray-800 p-4 rounded-lg text-left">
          <p className="text-sm text-gray-400">
            <span className="text-amber-400 font-bold">Nota:</span> Atualizamos nosso sistema para melhorar sua experiência.
            Em breve você será redirecionado automaticamente.
          </p>
        </div>
      </div>
    </div>
  );
}