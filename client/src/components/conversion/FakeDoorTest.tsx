import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

type FakeDoorTestProps = {
  featureName: string;
  featureDescription?: string;
  buttonText?: string;
  className?: string;
};

/**
 * Componente "Fake Door" para testar interesse em funcionalidades antes de desenvolvê-las
 * Coleta emails para lista de espera e mede a demanda real
 */
export default function FakeDoorTest({
  featureName,
  featureDescription,
  buttonText = "Quero experimentar",
  className = ""
}: FakeDoorTestProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleOpenModal = () => {
    setIsModalOpen(true);
    
    // Registra o interesse na feature (para analytics)
    try {
      // Simula envio para API
      console.log(`Interesse registrado na feature: ${featureName}`);
    } catch (error) {
      console.error("Erro ao registrar interesse:", error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.includes('@')) {
      toast({
        title: "Email inválido",
        description: "Por favor, insira um email válido",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simula envio para API
    setTimeout(() => {
      setIsSubmitting(false);
      setIsModalOpen(false);
      
      toast({
        title: "Você está na lista!",
        description: "Iremos avisá-lo assim que liberarmos acesso a este recurso.",
      });
      
      setEmail('');
    }, 1000);
  };

  return (
    <div className={`bg-gradient-to-r from-yellow-50 to-amber-50 border border-amber-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-start space-x-2">
        <div className="bg-amber-100 rounded-full p-2 flex-shrink-0">
          <span className="text-amber-600 text-xl">🔥</span>
        </div>
        <div>
          <h3 className="font-bold text-lg text-amber-800">{featureName} (Em Breve)</h3>
          {featureDescription && (
            <p className="text-amber-700 text-sm mt-1">{featureDescription}</p>
          )}
          <Button 
            onClick={handleOpenModal}
            variant="outline"
            className="mt-3 bg-amber-500 hover:bg-amber-600 text-white border-none hover:text-white"
          >
            {buttonText}
          </Button>
        </div>
      </div>
      
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl">
            <h3 className="text-xl font-bold mb-2">Lista de espera cheia!</h3>
            <p className="text-gray-600 mb-4">
              Este recurso está em fase beta fechado. Deixe seu email para avisarmos assim que liberar mais vagas!
            </p>
            
            <form onSubmit={handleSubmit}>
              <Input
                type="email"
                placeholder="Seu melhor email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mb-4"
              />
              
              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancelar
                </Button>
                
                <Button 
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Enviando..." : "Entrar na lista"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}