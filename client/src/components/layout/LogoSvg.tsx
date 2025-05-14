import React from 'react';

export default function LogoSvg() {
  return (
    <svg className="logo-icon" viewBox="0 0 100 100" width="40" height="40">
      <circle cx="50" cy="50" r="45" fill="#FFC107"/>
      <text x="50" y="65" textAnchor="middle" fill="black" fontSize="40" fontFamily="Arial" fontWeight="bold">IS</text>
    </svg>
  );
}