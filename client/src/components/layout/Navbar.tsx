import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { MenuIcon, Sparkles, Home, Settings, LayoutDashboard } from "lucide-react";
import { SubscriptionBadge } from "@/components/subscription/SubscriptionBadge";
import { smoothScrollToElement } from "@/lib/scroll-utils";

export default function Navbar() {
  const [location] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const isHomePage = location === "/";
  
  // Função para verificar se um link está ativo com base na localização atual
  const isLinkActive = (href: string) => {
    if (href === '/') {
      return location === '/';
    }
    return location.startsWith(href);
  };
  
  // Efeito para rolar para um elemento se houver um hash na URL ao carregar a página
  useEffect(() => {
    if (isHomePage && window.location.hash) {
      const targetId = window.location.hash.substring(1);
      
      // Pequeno atraso para garantir que a página já está totalmente carregada
      setTimeout(() => {
        smoothScrollToElement(targetId, { offsetY: 80 });
      }, 500);
    }
  }, [isHomePage, location]);
  
  // Links principais do menu
  const navLinks = [
    { name: "Início", href: "/", icon: <Home size={20} /> },
    { 
      name: "Gerador de Roteiros", 
      href: "/generator", 
      icon: <Sparkles size={22} className="text-white" />,
      highlight: true
    },
    { 
      name: "Dashboard", 
      href: "/dashboard", 
      icon: <LayoutDashboard size={20} />,
      badge: { count: 3, color: "bg-amber-500" } 
    },
    { name: "Configurações", href: "/settings", icon: <Settings size={20} /> },
    
    // Links secundários
    { name: "Recursos", href: "#recursos", icon: "📋", secondary: true },
    { name: "Como Funciona", href: "#como-funciona", icon: "🔄", secondary: true },
    { name: "Preços", href: "/plans", icon: "💰", secondary: true },
    { name: "Depoimentos", href: "#depoimentos", icon: "💬", secondary: true },
  ];

  // Fixed DOM nesting by using div instead of a when using Link component
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center relative">
        <Link href="/">
          <div className="flex items-center space-x-2 cursor-pointer mr-16">
            <span className="text-3xl">🎬</span>
            <span className="font-poppins font-bold text-2xl text-gray-900 gradient-text">IdeiaScreen</span>
          </div>
        </Link>
        
        <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2">
          <span className="text-xs text-gray-500">Assistente IA de Roteiros Profissionais</span>
        </div>
        
        <div className="hidden md:flex items-center space-x-1">
          <div className="flex bg-gray-100 rounded-xl shadow-inner">
            {navLinks.filter(link => !link.secondary).map((link) => (
              <Link 
                key={link.name}
                href={link.href}
                className={`relative font-medium text-base transition flex items-center space-x-1 mx-0.5 px-3 py-2.5 ${
                  link.highlight 
                    ? 'bg-amber-600 text-white rounded-lg shadow-lg hover:bg-amber-700'
                    : isLinkActive(link.href) 
                      ? 'bg-white text-gray-800 rounded-lg shadow-sm' 
                      : 'text-gray-700 hover:bg-white hover:text-gray-800 hover:rounded-lg hover:shadow-sm'
                }`}
              >
                <div className="relative flex items-center justify-center">
                  {link.icon}
                  
                  {link.badge && (
                    <span className={`absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center rounded-full text-xs text-white ${link.badge.color}`}>
                      {link.badge.count}
                    </span>
                  )}
                </div>
                <span className="ml-1.5">{link.name}</span>
                
                {link.highlight && (
                  <span className="absolute top-0 right-0 w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
                )}
              </Link>
            ))}
          </div>
          
          {isHomePage && (
            <div className="flex items-center ml-8 space-x-2">
              {navLinks.filter(link => link.secondary).map((link) => (
                <a 
                  key={link.name}
                  href={link.href}
                  onClick={(e) => {
                    // Se for um link de âncora, faça a rolagem suave
                    if (link.href.startsWith('#')) {
                      e.preventDefault();
                      const targetId = link.href.substring(1);
                      smoothScrollToElement(targetId, { offsetY: 80 }); // Compensa altura do cabeçalho
                    }
                  }}
                  className="font-medium text-sm px-3 py-2 text-gray-600 hover:text-amber-700 transition border-b-2 border-transparent hover:border-amber-500"
                >
                  {link.icon} {link.name}
                </a>
              ))}
            </div>
          )}
          
          {!isHomePage && (
            <>
              <Link href="/">
                <div className="font-medium hover:text-primary transition cursor-pointer">Início</div>
              </Link>
              <Link href="/roteiros">
                <div className="font-medium text-purple-600 font-semibold hover:text-primary transition cursor-pointer">Gerador de Roteiros</div>
              </Link>
              <Link href="/dashboard">
                <div className="font-medium hover:text-primary transition cursor-pointer">Dashboard</div>
              </Link>
              <Link href="/settings">
                <div className="font-medium hover:text-primary transition cursor-pointer">Configurações</div>
              </Link>
            </>
          )}
        </div>
        
        <div className="flex items-center space-x-6">
          {location === "/" ? (
            <>
              <Link href="/dashboard">
                <div className="hidden md:block font-semibold text-lg hover:text-primary transition cursor-pointer">Entrar</div>
              </Link>
              <Link href="/roteiros">
                <div className="bg-gradient-to-r from-amber-500 to-amber-700 text-white font-bold px-6 py-3 rounded-lg shadow-md hover:opacity-90 transition flex items-center gap-2 cursor-pointer">
                  <Sparkles className="h-5 w-5" />
                  <span>Começar Grátis</span>
                </div>
              </Link>
            </>
          ) : (
            <>
              <SubscriptionBadge />
              <Link href="/">
                <div className="border border-gray-200 text-gray-800 font-medium px-4 py-2 rounded-lg hover:bg-gray-50 transition cursor-pointer">
                  Voltar ao site
                </div>
              </Link>
            </>
          )}
          
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <MenuIcon className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col space-y-2 mt-8">
                <div className="bg-gray-100 rounded-xl p-4 shadow-inner mb-6">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3 ml-2">Menu Principal</h3>
                  <div className="space-y-2">
                    {navLinks.filter(link => !link.secondary).map((link, index) => (
                      <Link
                        key={link.name}
                        href={link.href}
                        className={`py-3 px-4 rounded-lg text-lg font-medium transition flex items-center relative ${
                          link.highlight 
                            ? 'bg-amber-600 text-white shadow-md hover:bg-amber-700'
                            : isLinkActive(link.href)
                              ? 'bg-white text-gray-800 shadow-md'
                              : 'text-gray-700 hover:text-gray-800 hover:bg-white'
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <div className="relative mr-4 flex items-center justify-center">
                          {link.icon}
                          
                          {link.badge && (
                            <span className={`absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center rounded-full text-xs text-white ${link.badge.color}`}>
                              {link.badge.count}
                            </span>
                          )}
                        </div>
                        {link.name}
                        
                        {link.highlight && (
                          <span className="absolute top-0 right-0 w-2 h-2 bg-amber-300 rounded-full animate-pulse"></span>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
                
                {isHomePage && (
                  <div className="bg-gray-100 rounded-xl p-4 shadow-inner">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3 ml-2">Informações</h3>
                    <div className="space-y-2">
                      {navLinks.filter(link => link.secondary).map((link, index) => (
                        <a
                          key={link.name}
                          href={link.href}
                          className="py-2 px-4 rounded-lg text-lg font-medium text-gray-700 hover:text-amber-700 hover:bg-white transition flex items-center"
                          onClick={(e) => {
                            // Fechar o menu
                            setIsMenuOpen(false);
                            
                            // Se for um link de âncora, faça a rolagem suave
                            if (link.href.startsWith('#')) {
                              e.preventDefault();
                              const targetId = link.href.substring(1);
                              smoothScrollToElement(targetId, { offsetY: 80 }); // Compensa altura do cabeçalho
                            }
                          }}
                        >
                          <span className="mr-3 bg-gray-200 text-gray-700 rounded-full w-8 h-8 flex items-center justify-center">{link.icon}</span>
                          {link.name}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
                
                {!isHomePage && (
                  <>
                    <Link href="/">
                      <div 
                        className="py-2 text-lg font-medium hover:text-primary transition cursor-pointer"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Início
                      </div>
                    </Link>
                    <Link href="/roteiros">
                      <div 
                        className="py-2 text-lg font-medium text-purple-600 hover:text-primary font-semibold transition cursor-pointer"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Gerador de Roteiros
                      </div>
                    </Link>
                    <Link href="/dashboard">
                      <div 
                        className="py-2 text-lg font-medium hover:text-primary transition cursor-pointer"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Dashboard
                      </div>
                    </Link>
                    <Link href="/settings">
                      <div 
                        className="py-2 text-lg font-medium hover:text-primary transition cursor-pointer"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Configurações
                      </div>
                    </Link>
                  </>
                )}
                
                {location === "/" ? (
                  <Link href="/roteiros">
                    <div 
                      className="py-2 text-lg font-medium text-primary hover:text-primary/90 transition cursor-pointer"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Começar Grátis
                    </div>
                  </Link>
                ) : (
                  <Link href="/">
                    <div 
                      className="py-2 text-lg font-medium hover:text-primary transition cursor-pointer"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Voltar ao site
                    </div>
                  </Link>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
