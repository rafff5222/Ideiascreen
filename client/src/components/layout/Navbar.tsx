import { useState } from "react";
import { Link, useLocation } from "wouter";

export default function Navbar() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const toggleMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="site-header bg-gray-800 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <nav className="navbar flex justify-between items-center py-4">
          {/* Logo */}
          <div className="logo">
            <Link href="/">
              <div className="flex items-center cursor-pointer">
                <span className="text-white text-xl md:text-2xl font-medium">Ideia</span>
                <strong className="text-amber-400 text-xl md:text-2xl font-bold">Screen</strong>
              </div>
            </Link>
          </div>

          {/* Menu Desktop */}
          <ul className="menu-desktop hidden md:flex space-x-6">
            <li>
              <Link href="/">
                <div className={`text-gray-200 hover:text-amber-400 transition-colors cursor-pointer ${
                  location === "/" ? "text-amber-400 font-medium" : ""
                }`}>
                  Home
                </div>
              </Link>
            </li>
            <li>
              <Link href="/plans">
                <div className={`text-gray-200 hover:text-amber-400 transition-colors cursor-pointer ${
                  location === "/plans" ? "text-amber-400 font-medium" : ""
                }`}>
                  Planos
                </div>
              </Link>
            </li>
            {/* Link Roteiros removido por enquanto conforme solicitado */}
          </ul>

          {/* Botões CTA */}
          <div className="cta-button hidden md:flex space-x-2">
            <Link href="/login">
              <div className="btn-login bg-transparent hover:bg-gray-700 text-white border border-gray-600 px-4 py-2 rounded-md transition-all duration-300 cursor-pointer">
                Entrar
              </div>
            </Link>
            <Link href="/plans">
              <div className="btn-signup bg-amber-400 hover:bg-amber-300 text-black font-bold px-4 py-2 rounded-md transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/30 cursor-pointer">
                Assinar Agora
              </div>
            </Link>
          </div>

          {/* Hamburger para Mobile */}
          <div 
            className="hamburger md:hidden text-white text-2xl cursor-pointer"
            onClick={toggleMenu}
          >
            ☰
          </div>
        </nav>

        {/* Menu Mobile */}
        <ul 
          className={`mobile-menu bg-gray-700 md:hidden py-3 space-y-2 rounded-b-lg ${
            mobileMenuOpen ? "block" : "hidden"
          }`}
        >
          <li>
            <Link href="/">
              <div 
                className="block px-4 py-2 text-gray-200 hover:bg-gray-600 hover:text-white cursor-pointer"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </div>
            </Link>
          </li>
          <li>
            <Link href="/plans">
              <div 
                className="block px-4 py-2 text-gray-200 hover:bg-gray-600 hover:text-white cursor-pointer"
                onClick={() => setMobileMenuOpen(false)}
              >
                Planos
              </div>
            </Link>
          </li>
          <li>
            <Link href="/login">
              <div 
                className="block px-4 py-2 text-gray-200 hover:bg-gray-600 hover:text-white cursor-pointer"
                onClick={() => setMobileMenuOpen(false)}
              >
                Entrar
              </div>
            </Link>
          </li>
          <li>
            <Link href="/plans">
              <div 
                className="block px-4 py-2 text-amber-400 font-medium hover:bg-gray-600 hover:text-amber-300 cursor-pointer"
                onClick={() => setMobileMenuOpen(false)}
              >
                Assinar Agora
              </div>
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}