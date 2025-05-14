import React from 'react';

interface LogoSvgProps {
  showText?: boolean;
  width?: number;
  height?: number;
  className?: string;
}

export default function LogoSvg({ showText = false, width = 40, height = 40, className = "" }: LogoSvgProps) {
  // Mostra apenas o ícone circular por padrão
  if (!showText) {
    return (
      <svg className={`logo-icon ${className}`} viewBox="0 0 100 100" width={width} height={height}>
        {/* Base circular gradient */}
        <defs>
          <linearGradient id="circleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFC107" />
            <stop offset="100%" stopColor="#FF9800" />
          </linearGradient>
          
          {/* Shadow effect */}
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="3" stdDeviation="2" floodColor="#00000044" />
          </filter>
          
          {/* Text styling */}
          <linearGradient id="textGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#222222" />
            <stop offset="100%" stopColor="#000000" />
          </linearGradient>
        </defs>
        
        {/* Main circle with gradient */}
        <circle 
          cx="50" 
          cy="50" 
          r="42" 
          fill="url(#circleGradient)" 
          filter="url(#shadow)"
        />
        
        {/* Inner circle (film reel style) */}
        <circle cx="50" cy="50" r="36" fill="rgba(255,255,255,0.15)" />
        
        {/* Decorative elements - film frame markers */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, index) => (
          <rect 
            key={index}
            x="48" 
            y="20" 
            width="4" 
            height="6" 
            rx="1"
            fill="#00000033"
            transform={`rotate(${angle}, 50, 50)`}
          />
        ))}
        
        {/* Stylized "IS" text */}
        <text 
          x="50" 
          y="63" 
          textAnchor="middle" 
          fill="url(#textGradient)" 
          fontSize="34" 
          fontFamily="Arial, sans-serif" 
          fontWeight="bold"
          letterSpacing="-1"
          style={{ textShadow: '0px 1px 2px rgba(0,0,0,0.3)' }}
        >IS</text>
        
        {/* Camera aperture accent mark */}
        <circle cx="50" cy="50" r="8" fill="none" stroke="#00000033" strokeWidth="2" />
      </svg>
    );
  }
  
  // Mostrar logo completo com texto
  return (
    <svg className={`logo-full ${className}`} viewBox="0 0 260 80" width={width} height={height * 0.6}>
      <defs>
        <linearGradient id="circleGradientFull" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFC107" />
          <stop offset="100%" stopColor="#FF9800" />
        </linearGradient>
        
        <filter id="shadowFull" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="2" floodColor="#00000044" />
        </filter>
        
        <linearGradient id="textGradientFull" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#222222" />
          <stop offset="100%" stopColor="#000000" />
        </linearGradient>
        
        <linearGradient id="brandTextGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#EEEEEE" />
        </linearGradient>
        
        <linearGradient id="highlightTextGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFC107" />
          <stop offset="100%" stopColor="#FF9800" />
        </linearGradient>
      </defs>
      
      {/* Logo icon part */}
      <g transform="translate(20, 10) scale(0.6)">
        <circle 
          cx="50" 
          cy="50" 
          r="42" 
          fill="url(#circleGradientFull)" 
          filter="url(#shadowFull)"
        />
        
        <circle cx="50" cy="50" r="36" fill="rgba(255,255,255,0.15)" />
        
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, index) => (
          <rect 
            key={index}
            x="48" 
            y="20" 
            width="4" 
            height="6" 
            rx="1"
            fill="#00000033"
            transform={`rotate(${angle}, 50, 50)`}
          />
        ))}
        
        <text 
          x="50" 
          y="63" 
          textAnchor="middle" 
          fill="url(#textGradientFull)" 
          fontSize="34" 
          fontFamily="Arial, sans-serif" 
          fontWeight="bold"
          letterSpacing="-1"
          style={{ textShadow: '0px 1px 2px rgba(0,0,0,0.3)' }}
        >IS</text>
        
        <circle cx="50" cy="50" r="8" fill="none" stroke="#00000033" strokeWidth="2" />
      </g>
      
      {/* Text part */}
      <g>
        <text
          x="85"
          y="42"
          fontFamily="Arial, sans-serif"
          fontWeight="bold"
          fontSize="26"
          fill="url(#brandTextGradient)"
          letterSpacing="-0.5"
        >
          IDEIA
        </text>
        <text
          x="155"
          y="42"
          fontFamily="Arial, sans-serif"
          fontWeight="bold"
          fontSize="26"
          fill="url(#highlightTextGradient)"
          letterSpacing="-0.5"
        >
          SCREEN
        </text>
        <text
          x="85"
          y="58"
          fontFamily="Arial, sans-serif"
          fontSize="12"
          fill="white"
          opacity="0.8"
        >
          Roteiros profissionais com IA
        </text>
      </g>
    </svg>
  );
}