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
              <div className="logo-container" style={{ cursor: 'pointer' }}>
                {/* Logo circular em dispositivos móveis */}
                <div className="logo-mobile">
                  <LogoSvg width={40} height={40} />
                </div>
                
                {/* Logo completo em dispositivos maiores */}
                <div className="logo-desktop">
                  <LogoSvg showText={true} width={180} height={50} />
                </div>
              </div>
            </Link>
          </div>

          {/* Menu Desktop */}
          <ul className="menu-desktop">
            <li>
              <Link href="/">
                <div style={{ color: 'white', textDecoration: 'none', fontWeight: 500, cursor: 'pointer' }}>
                  Home
                </div>
              </Link>
            </li>
            <li>
              <Link href="/plans">
                <div style={{ color: 'white', textDecoration: 'none', fontWeight: 500, cursor: 'pointer' }}>
                  Planos
                </div>
              </Link>
            </li>
          </ul>

          {/* Botões CTA */}
          <div className="cta-button">
            {isAuthenticated ? (
              <>
                <Link href="/generator">
                  <div className="btn-login">
                    Gerador
                  </div>
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
                  <div className="btn-login">
                    Entrar
                  </div>
                </Link>
                <Link href="/register">
                  <div className="btn-register" style={{ margin: '0 10px', color: 'white', fontWeight: 500, cursor: 'pointer' }}>
                    Criar Conta
                  </div>
                </Link>
                <Link href="/plans">
                  <div className="btn-signup">
                    Assinar Agora
                  </div>
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
              <div 
                style={{ color: 'white', textDecoration: 'none', fontSize: '16px', display: 'block', padding: '8px 0', cursor: 'pointer' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </div>
            </Link>
          </li>
          
          {isAuthenticated && (
            <li>
              <Link href="/generator">
                <div 
                  style={{ color: 'white', textDecoration: 'none', fontSize: '16px', display: 'block', padding: '8px 0', cursor: 'pointer' }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Gerador de Roteiros
                </div>
              </Link>
            </li>
          )}
          
          <li>
            <Link href="/plans">
              <div 
                style={{ color: 'white', textDecoration: 'none', fontSize: '16px', display: 'block', padding: '8px 0', cursor: 'pointer' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Planos
              </div>
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
                  <div 
                    style={{ color: 'white', textDecoration: 'none', fontSize: '16px', display: 'block', padding: '8px 0', cursor: 'pointer' }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Entrar
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/plans">
                  <div 
                    style={{ color: '#FFC107', textDecoration: 'none', fontSize: '16px', display: 'block', padding: '8px 0', fontWeight: 'bold', cursor: 'pointer' }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Assinar Agora
                  </div>
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </header>
  );
}