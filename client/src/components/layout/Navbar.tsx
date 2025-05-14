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
  
  // Menu links
  const navLinks = [
    { name: "Home", href: "/", active: location === "/" },
    { name: "Planos", href: "/planos", active: location === "/planos" },
    { name: "Roteiros", href: "/roteiros", active: location === "/roteiros" },
  ];

  return (
    <header>
      <nav className="navbar bg-gray-800 shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          {/* Logo */}
          <Link href="/">
            <div className="logo flex items-center space-x-2 cursor-pointer">
              <span className="text-3xl">🎬</span>
              <span className="font-poppins font-bold text-xl md:text-2xl text-white">IdeiaScreen</span>
            </div>
          </Link>
          
          {/* Menu de navegação */}
          <ul className="menu hidden md:flex space-x-6 items-center">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link 
                  href={link.href}
                  className={`text-gray-200 hover:text-amber-400 transition-colors ${
                    link.active ? 'text-amber-400 font-medium' : ''
                  }`}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
          
          {/* Botão de login */}
          <Link href="/login">
            <Button className="btn-login bg-amber-500 hover:bg-amber-600 text-white">
              Login
            </Button>
          </Link>
          
          {/* Menu mobile */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" className="p-2 text-white">
                  <MenuIcon className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-gray-800 text-white border-gray-700">
                <div className="flex flex-col h-full py-6">
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-amber-400 mb-2">Menu</h3>
                  </div>
                  
                  <ul className="space-y-4 flex-1">
                    {navLinks.map((link) => (
                      <li key={link.name}>
                        <Link 
                          href={link.href}
                          className={`flex items-center py-2 text-lg ${
                            link.active 
                              ? 'text-amber-400 font-medium' 
                              : 'text-gray-200 hover:text-amber-400'
                          }`}
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                    
                    {/* Link para começar grátis */}
                    <li>
                      <Link 
                        href="/roteiros"
                        className="flex items-center py-2 text-lg text-amber-400 font-medium hover:text-amber-300"
                      >
                        Começar Grátis
                      </Link>
                    </li>
                  </ul>
                  
                  <div className="pt-4 mt-auto">
                    <Link href="/login">
                      <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white">
                        Login
                      </Button>
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  );
}