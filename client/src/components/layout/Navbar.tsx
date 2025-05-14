import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import LogoSvg from "./LogoSvg";
import "./Navbar.css";
import { useAuth } from "@/contexts/AuthContext"; 
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  
  const toggleMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="site-header">
      <div className="container">
        <nav className="navbar">
          {/* Logo */}
          <div className="logo">
            <Link href="/">
              <a className="logo-container">
                {/* Logo circular em dispositivos móveis */}
                <div className="logo-mobile">
                  <LogoSvg width={40} height={40} />
                </div>
                
                {/* Logo completo em dispositivos maiores */}
                <div className="logo-desktop">
                  <LogoSvg showText={true} width={180} height={50} />
                </div>
              </a>
            </Link>
          </div>

          {/* Menu Desktop */}
          <ul className="menu-desktop">
            <li>
              <Link href="/">
                <a style={{ color: 'white', textDecoration: 'none', fontWeight: 500, cursor: 'pointer' }}>
                  Home
                </a>
              </Link>
            </li>
            <li>
              <Link href="/plans">
                <a style={{ color: 'white', textDecoration: 'none', fontWeight: 500, cursor: 'pointer' }}>
                  Planos
                </a>
              </Link>
            </li>
          </ul>

          {/* Botões CTA */}
          <div className="cta-button">
            {isAuthenticated ? (
              <>
                <Link href="/generator">
                  <a className="btn-login">
                    Gerador
                  </a>
                </Link>
                <div 
                  className="btn-signup" 
                  onClick={logout}
                  style={{ cursor: 'pointer' }}
                >
                  Sair
                </div>
              </>
            ) : (
              <>
                <Link href="/login">
                  <a className="btn-login">
                    Entrar
                  </a>
                </Link>
                <Link href="/plans">
                  <a className="btn-signup">
                    Assinar Agora
                  </a>
                </Link>
              </>
            )}
          </div>

          {/* Hamburger para Mobile */}
          <div 
            className="hamburger"
            onClick={toggleMenu}
          >
            ☰
          </div>
        </nav>

        {/* Menu Mobile */}
        <ul 
          id="mobileMenu"
          className={`mobile-menu ${mobileMenuOpen ? 'active' : ''}`}
        >
          <li>
            <Link href="/">
              <a 
                style={{ color: 'white', textDecoration: 'none', fontSize: '16px', display: 'block', padding: '8px 0', cursor: 'pointer' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </a>
            </Link>
          </li>
          
          {isAuthenticated && (
            <li>
              <Link href="/generator">
                <a 
                  style={{ color: 'white', textDecoration: 'none', fontSize: '16px', display: 'block', padding: '8px 0', cursor: 'pointer' }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Gerador de Roteiros
                </a>
              </Link>
            </li>
          )}
          
          <li>
            <Link href="/plans">
              <a 
                style={{ color: 'white', textDecoration: 'none', fontSize: '16px', display: 'block', padding: '8px 0', cursor: 'pointer' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Planos
              </a>
            </Link>
          </li>
          
          {isAuthenticated ? (
            <li>
              <div 
                style={{ color: '#FFC107', textDecoration: 'none', fontSize: '16px', display: 'block', padding: '8px 0', fontWeight: 'bold', cursor: 'pointer' }}
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
              >
                Sair
              </div>
            </li>
          ) : (
            <>
              <li>
                <Link href="/login">
                  <a 
                    style={{ color: 'white', textDecoration: 'none', fontSize: '16px', display: 'block', padding: '8px 0', cursor: 'pointer' }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Entrar
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/plans">
                  <a 
                    style={{ color: '#FFC107', textDecoration: 'none', fontSize: '16px', display: 'block', padding: '8px 0', fontWeight: 'bold', cursor: 'pointer' }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Assinar Agora
                  </a>
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </header>
  );
}