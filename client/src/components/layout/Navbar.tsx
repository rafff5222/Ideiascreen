import { useState } from "react";
import { Link, useLocation } from "wouter";
import LogoSvg from "./LogoSvg";
import "./Navbar.css";

export default function Navbar() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', fontSize: '1.5rem', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>
                <LogoSvg />
                <span style={{ color: '#FFC107' }}>Ideia</span><strong>Screen</strong>
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
            <Link href="/login">
              <div className="btn-login">
                Entrar
              </div>
            </Link>
            <Link href="/plans">
              <div className="btn-signup">
                Assinar Agora
              </div>
            </Link>
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
        </ul>
      </div>
    </header>
  );
}