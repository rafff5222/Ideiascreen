import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white/80 py-12 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <i className="ri-quill-pen-line text-primary text-2xl"></i>
              <span className="font-poppins font-bold text-xl text-white">ContentPro</span>
            </div>
            <p className="mb-4">Transforme suas redes sociais com conteúdo gerado por IA que engaja e converte.</p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-primary transition"><i className="ri-instagram-line text-xl"></i></a>
              <a href="#" className="hover:text-primary transition"><i className="ri-tiktok-line text-xl"></i></a>
              <a href="#" className="hover:text-primary transition"><i className="ri-facebook-circle-line text-xl"></i></a>
              <a href="#" className="hover:text-primary transition"><i className="ri-twitter-line text-xl"></i></a>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-white mb-4">Produto</h4>
            <ul className="space-y-2">
              <li><a href="#recursos" className="hover:text-primary transition">Recursos</a></li>
              <li><a href="#precos" className="hover:text-primary transition">Preços</a></li>
              <li><a href="#depoimentos" className="hover:text-primary transition">Depoimentos</a></li>
              <li><Link href="/dashboard" className="hover:text-primary transition">Começar Grátis</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-white mb-4">Empresa</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-primary transition">Sobre nós</a></li>
              <li><a href="#" className="hover:text-primary transition">Blog</a></li>
              <li><a href="#" className="hover:text-primary transition">Carreiras</a></li>
              <li><a href="#" className="hover:text-primary transition">Contato</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-white mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-primary transition">Termos de Serviço</a></li>
              <li><a href="#" className="hover:text-primary transition">Política de Privacidade</a></li>
              <li><a href="#" className="hover:text-primary transition">Cookies</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p>&copy; 2023 ContentPro. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
