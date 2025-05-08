import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

type SmartFormProps = {
  onSubmit?: (data: { email: string; phone: string }) => void;
  buttonText?: string;
  className?: string;
};

/**
 * Formulário inteligente com microinterações que aumentam a taxa de conversão
 * - Labels flutuantes que animam ao digitar
 * - Validação em tempo real com feedback visual
 * - Layout otimizado para reduzir atrito
 */
export default function SmartForm({
  onSubmit,
  buttonText = "Quero começar agora",
  className = ""
}: SmartFormProps) {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+55');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [phoneFocused, setPhoneFocused] = useState(false);
  const { toast } = useToast();
  
  // Determine se os labels devem estar ativos (elevados)
  const emailLabelActive = emailFocused || email.length > 0;
  const phoneLabelActive = phoneFocused || phone.length > 0;
  
  // Validação básica de email
  const isEmailValid = email.length > 0 && email.includes('@') && email.includes('.');
  
  // Validação básica de telefone
  const isPhoneValid = phone.length >= 8;
  
  // Verifica validade do formulário
  const isFormValid = isEmailValid && isPhoneValid;
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid) {
      // Feedback visual se o formulário for inválido
      if (!isEmailValid) {
        toast({
          title: "Email inválido",
          description: "Por favor, forneça um email válido",
          variant: "destructive",
        });
      } else if (!isPhoneValid) {
        toast({
          title: "Telefone inválido",
          description: "Por favor, forneça um número de telefone válido",
          variant: "destructive",
        });
      }
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Em um caso real, enviaríamos para uma API
      console.log('Formulário enviado:', { email, phone: `${countryCode}${phone}` });
      
      // Simula sucesso após 1 segundo
      setTimeout(() => {
        setIsSubmitting(false);
        
        toast({
          title: "Solicitação recebida!",
          description: "Em breve entraremos em contato.",
        });
        
        // Callback para componente pai
        if (onSubmit) {
          onSubmit({ email, phone: `${countryCode}${phone}` });
        }
        
        // Reset do formulário
        setEmail('');
        setPhone('');
      }, 1000);
    } catch (error) {
      setIsSubmitting(false);
      console.error('Erro ao enviar formulário:', error);
      
      toast({
        title: "Erro ao enviar",
        description: "Ocorreu um erro. Tente novamente mais tarde.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className={`smart-form-container ${className}`}>
      <form 
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-md p-6 border border-gray-100"
      >
        <h3 className="text-xl font-bold mb-4">
          Impulsione seu conteúdo agora
        </h3>
        
        {/* Campo de Email com label flutuante */}
        <div className="relative mb-6">
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setEmailFocused(true)}
            onBlur={() => setEmailFocused(false)}
            className={`
              w-full p-3 rounded-lg border border-gray-200 
              transition-all duration-300 focus:outline-none focus:ring-2
              ${isEmailValid ? 'focus:ring-green-200 border-green-200' : 'focus:ring-primary/20'}
              ${emailLabelActive ? 'pt-6 pb-2' : 'py-3'}
            `}
            placeholder=" "
            autoComplete="email"
          />
          <label 
            htmlFor="email"
            className={`
              absolute left-3 text-gray-500 transition-all duration-200
              pointer-events-none
              ${emailLabelActive ? 'transform -translate-y-3 text-xs font-medium text-primary' : 'top-3'}
            `}
          >
            Seu melhor email
          </label>
          {email.length > 0 && isEmailValid && (
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="absolute right-3 top-3.5 text-green-500"
            >
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          )}
        </div>
        
        {/* Campo de Telefone com seletor de país */}
        <div className="relative mb-6">
          <div className="phone-input flex gap-2">
            <select
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              className="w-20 p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 bg-gray-50"
            >
              <option value="+55">+55</option>
              <option value="+1">+1</option>
              <option value="+351">+351</option>
              <option value="+44">+44</option>
            </select>
            
            <div className="relative flex-1">
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                onFocus={() => setPhoneFocused(true)}
                onBlur={() => setPhoneFocused(false)}
                className={`
                  w-full p-3 rounded-lg border border-gray-200 
                  transition-all duration-300 focus:outline-none focus:ring-2
                  ${isPhoneValid ? 'focus:ring-green-200 border-green-200' : 'focus:ring-primary/20'}
                  ${phoneLabelActive ? 'pt-6 pb-2' : 'py-3'}
                `}
                placeholder=" "
                autoComplete="tel"
              />
              <label 
                htmlFor="phone"
                className={`
                  absolute left-3 text-gray-500 transition-all duration-200
                  pointer-events-none
                  ${phoneLabelActive ? 'transform -translate-y-3 text-xs font-medium text-primary' : 'top-3'}
                `}
              >
                Celular (WhatsApp)
              </label>
              
              {phone.length > 0 && isPhoneValid && (
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="absolute right-3 top-3.5 text-green-500"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              )}
            </div>
          </div>
        </div>
        
        {/* Botão de envio com microinteração */}
        <Button
          type="submit"
          disabled={isSubmitting || !isFormValid}
          className="btn-premium w-full py-6 font-semibold text-lg transition-all duration-400 
          hover:scale-105 hover:rotate-1 hover:shadow-lg hover:shadow-primary/20"
        >
          {isSubmitting ? "Processando..." : buttonText}
        </Button>
        
        <p className="text-xs text-gray-500 mt-3 text-center">
          Ao continuar, você concorda com nossos <a href="#" className="text-primary hover:underline">Termos de Uso</a> e <a href="#" className="text-primary hover:underline">Política de Privacidade</a>.
        </p>
      </form>
    </div>
  );
}