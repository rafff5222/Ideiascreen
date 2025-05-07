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

        {/* Selo de Segurança - Importante para conversão */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col items-center">
          <div className="mb-6 bg-gray-800 rounded-lg p-4 max-w-md">
            <h5 className="font-medium text-white flex items-center justify-center gap-2 mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              PAGAMENTO 100% SEGURO
            </h5>
            <div className="flex justify-center space-x-3 mb-2">
              <svg className="h-8" viewBox="0 0 780 500" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M290 170H490V330H290V170Z" fill="#FF5F00"/>
                <path d="M311.18 250C311.18 217.33 326.27 188.14 349.82 170C332.12 156.65 310.15 149 286.31 149C221.24 149 168.43 193.98 168.43 250C168.43 306.02 221.24 351 286.31 351C310.15 351 332.12 343.35 349.82 330C326.27 311.86 311.18 282.67 311.18 250Z" fill="#EB001B"/>
                <path d="M611.56 250C611.56 306.02 558.76 351 493.69 351C469.85 351 447.88 343.35 430.18 330C453.74 311.86 468.82 282.67 468.82 250C468.82 217.33 453.74 188.14 430.18 170C447.88 156.65 469.85 149 493.69 149C558.76 149 611.56 193.98 611.56 250Z" fill="#F79E1B"/>
              </svg>
              <svg className="h-8" viewBox="0 0 780 500" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M293.198 345.009H486.804V155.991H293.198V345.009Z" fill="white"/>
                <path d="M305.5 250.5C305.5 212.261 324.171 178.278 352.401 156.705C335.092 145.191 314.13 138.5 291.502 138.5C228.048 138.5 176.5 188.649 176.5 250.5C176.5 312.35 228.048 362.5 291.502 362.5C314.13 362.5 335.092 355.808 352.401 344.295C324.171 322.723 305.5 288.739 305.5 250.5Z" fill="#1434CB"/>
                <path d="M603.5 250.5C603.5 312.35 551.952 362.5 488.498 362.5C465.87 362.5 444.908 355.808 427.599 344.295C455.829 322.723 474.5 288.739 474.5 250.5C474.5 212.261 455.829 178.278 427.599 156.705C444.908 145.191 465.87 138.5 488.498 138.5C551.952 138.5 603.5 188.649 603.5 250.5Z" fill="#1434CB"/>
              </svg>
              <svg className="h-8" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.5 6.25V18.75" stroke="#5FA52F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8.75 10H16.25" stroke="#5FA52F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22.5 12.5C22.5 18.0228 18.0228 22.5 12.5 22.5C6.97715 22.5 2.5 18.0228 2.5 12.5C2.5 6.97715 6.97715 2.5 12.5 2.5C18.0228 2.5 22.5 6.97715 22.5 12.5Z" stroke="#5FA52F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <p className="text-xs text-center text-gray-400">Seus dados são protegidos com criptografia SSL. Processamos pagamentos com o Stripe, líder mundial em segurança.</p>
          </div>
          <p className="text-center">&copy; 2023 ContentPro. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
