import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { MenuIcon, Sparkles } from "lucide-react";
import { SubscriptionBadge } from "@/components/subscription/SubscriptionBadge";

export default function Navbar() {
  const [location] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const isHomePage = location === "/";
  
  const navLinks = [
    { name: "Recursos", href: "/#recursos" },
    { name: "Como Funciona", href: "/#como-funciona" },
    { name: "Preços", href: "/#precos" },
    { name: "Depoimentos", href: "/#depoimentos" },
    { name: "Gerador de Roteiros", href: "/roteiros", highlight: true },
    { name: "Dashboard", href: "/dashboard" },
  ];

  // Fixed DOM nesting by using div instead of a when using Link component
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/">
          <div className="flex items-center space-x-2 cursor-pointer">
            <i className="ri-quill-pen-line text-primary text-2xl"></i>
            <span className="font-poppins font-bold text-xl text-gray-900 gradient-text">ContentPro</span>
          </div>
        </Link>
        
        <div className="hidden md:flex items-center space-x-8">
          {isHomePage && navLinks.map((link) => (
            <a 
              key={link.name}
              href={link.href}
              className={`font-medium hover:text-primary transition ${link.highlight ? 'text-purple-600 font-semibold' : ''}`}
            >
              {link.name}
            </a>
          ))}
          
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
        
        <div className="flex items-center space-x-3">
          {location === "/" ? (
            <>
              <Link href="/dashboard">
                <div className="hidden md:block font-medium hover:text-primary transition cursor-pointer">Entrar</div>
              </Link>
              <Link href="/dashboard">
                <div className="bg-gradient-to-r from-accent to-primary text-white font-medium px-5 py-2 rounded-lg shadow-md hover:opacity-90 transition flex items-center gap-2 cursor-pointer">
                  <Sparkles className="h-4 w-4" />
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
              <div className="flex flex-col space-y-4 mt-8">
                {isHomePage && navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className={`py-2 text-lg font-medium hover:text-primary transition ${link.highlight ? 'text-purple-600 font-semibold' : ''}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                  </a>
                ))}
                
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
                  <Link href="/dashboard">
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
