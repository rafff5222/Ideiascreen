import { Link } from "wouter";
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Youtube, 
  Mail, 
  Lock, 
  CreditCard,
  ShieldCheck
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">IdeiaScreen</h3>
            <p className="mb-4 text-gray-400">
              Ferramentas de IA para criadores de conteúdo que desejam criar roteiros profissionais para seus vídeos.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Youtube size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">Features</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Geração de Scripts</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Ideias para Reels</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Edição com IA</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Hashtags Otimizadas</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Legendas para Engajamento</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">Empresa</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Sobre nós</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Depoimentos</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contato</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">Fale conosco</h3>
            <p className="flex items-center mb-4 text-gray-400">
              <Mail size={16} className="mr-2" />
              suporte@ideiascreen.com.br
            </p>
            
            <div className="bg-gray-800 p-4 rounded-lg">
              <h4 className="font-bold text-white mb-2">Newsletter</h4>
              <p className="text-gray-400 text-sm mb-3">Receba dicas semanais para crescer suas redes sociais</p>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Seu e-mail" 
                  className="px-3 py-2 bg-gray-700 text-white rounded-l-md flex-grow text-sm"
                />
                <button className="bg-primary px-3 py-2 rounded-r-md text-white text-sm font-medium">
                  Inscrever
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Selos de segurança e pagamento */}
        <div className="py-6 border-t border-gray-800 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center bg-gray-800 px-5 py-3 rounded-lg">
              <Lock size={18} className="text-green-400 mr-2" />
              <span className="text-white font-medium">Pagamento 100% Seguro</span>
              <span className="mx-3 text-gray-500">|</span>
              <div className="flex space-x-3">
                <img src="https://cdn-icons-png.flaticon.com/512/196/196578.png" alt="Visa" className="h-6 w-auto" />
                <img src="https://cdn-icons-png.flaticon.com/512/196/196561.png" alt="Mastercard" className="h-6 w-auto" />
                <img src="https://cdn-icons-png.flaticon.com/512/5968/5968299.png" alt="PayPal" className="h-6 w-auto" />
                <img src="https://cdn-icons-png.flaticon.com/512/217/217425.png" alt="Pix" className="h-6 w-auto" />
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center bg-gray-800 px-4 py-2 rounded-lg">
                <ShieldCheck size={16} className="text-green-400 mr-2" />
                <span className="text-white text-sm">SSL Secure</span>
              </div>
              
              <div className="flex items-center bg-gray-800 px-4 py-2 rounded-lg">
                <CreditCard size={16} className="text-green-400 mr-2" />
                <span className="text-white text-sm">Ambiente Seguro</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500 mb-4 md:mb-0">
            &copy; {currentYear} IdeiaScreen. Todos os direitos reservados.
          </p>
          
          <div className="flex space-x-6">
            <a href="#" className="text-sm text-gray-500 hover:text-gray-400 transition-colors">Termos de Uso</a>
            <a href="#" className="text-sm text-gray-500 hover:text-gray-400 transition-colors">Política de Privacidade</a>
            <a href="#" className="text-sm text-gray-500 hover:text-gray-400 transition-colors">FAQ</a>
          </div>
        </div>
      </div>
    </footer>
  );
}