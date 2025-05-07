import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { MenuIcon } from "lucide-react";

export default function Navbar() {
  const [location] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const isHomePage = location === "/";
  
  const navLinks = [
    { name: "Recursos", href: "/#recursos" },
    { name: "Como Funciona", href: "/#como-funciona" },
    { name: "Preços", href: "/#precos" },
    { name: "Depoimentos", href: "/#depoimentos" },
  ];

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/">
          <a className="flex items-center space-x-2">
            <i className="ri-quill-pen-line text-primary text-2xl"></i>
            <span className="font-poppins font-bold text-xl text-gray-900">ContentPro</span>
          </a>
        </Link>
        
        <div className="hidden md:flex items-center space-x-8">
          {isHomePage && navLinks.map((link) => (
            <a 
              key={link.name}
              href={link.href}
              className="font-medium hover:text-primary transition"
            >
              {link.name}
            </a>
          ))}
          
          {!isHomePage && (
            <Link href="/">
              <a className="font-medium hover:text-primary transition">Início</a>
            </Link>
          )}
        </div>
        
        <div className="flex items-center space-x-3">
          {location === "/" ? (
            <>
              <Link href="/dashboard">
                <a className="hidden md:block font-medium hover:text-primary transition">Entrar</a>
              </Link>
              <Button asChild className="bg-primary hover:bg-primary/90">
                <Link href="/dashboard">
                  <a>Começar Grátis</a>
                </Link>
              </Button>
            </>
          ) : (
            <Button asChild variant="outline">
              <Link href="/">
                <a>Voltar ao site</a>
              </Link>
            </Button>
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
                    className="py-2 text-lg font-medium hover:text-primary transition"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                  </a>
                ))}
                
                {!isHomePage && (
                  <Link href="/">
                    <a 
                      className="py-2 text-lg font-medium hover:text-primary transition"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Início
                    </a>
                  </Link>
                )}
                
                {location === "/" ? (
                  <Link href="/dashboard">
                    <a 
                      className="py-2 text-lg font-medium text-primary hover:text-primary/90 transition"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Começar Grátis
                    </a>
                  </Link>
                ) : (
                  <Link href="/">
                    <a 
                      className="py-2 text-lg font-medium hover:text-primary transition"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Voltar ao site
                    </a>
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
