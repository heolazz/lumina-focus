import React from 'react';

interface MascotProps {
  happy?: boolean;
  frozen?: boolean;
  confused?: boolean;
  celebrating?: boolean;
  className?: string;
}

export const PersimmonMascot: React.FC<MascotProps> = ({ happy = false, frozen = false, confused = false, celebrating = false, className = "" }) => (
  <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={`drop-shadow-xl ${className} ${frozen ? 'animate-pulse-slow' : 'animate-bounce-slow'}`}>
    {/* Badan */}
    <circle cx="50" cy="55" r="35" fill={frozen ? "#93C5FD" : "#FB923C"} /> 
    <circle cx="50" cy="55" r="35" stroke={frozen ? "#60A5FA" : "#F97316"} strokeWidth="3" />
    
    {/* Daun */}
    <path d="M50 20C50 20 35 30 35 45H65C65 30 50 20 50 20Z" fill={frozen ? "#A7F3D0" : "#4ADE80"} stroke={frozen ? "#34D399" : "#22C55E"} strokeWidth="3" strokeLinejoin="round"/>
    <path d="M50 20V35" stroke={frozen ? "#065F46" : "#166534"} strokeWidth="3" strokeLinecap="round"/>
    
    {celebrating ? (
      <>
         <path d="M35 55L40 50L45 55" stroke="#7C2D12" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
         <path d="M55 55L60 50L65 55" stroke="#7C2D12" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
         <path d="M45 65C45 65 50 68 55 65" stroke="#7C2D12" strokeWidth="3" strokeLinecap="round"/>
         <circle cx="32" cy="60" r="3" fill="#FECACA" opacity="0.8"/>
         <circle cx="68" cy="60" r="3" fill="#FECACA" opacity="0.8"/>
      </>
    ) : happy ? (
      <>
         <path d="M38 52C38 52 40 50 42 52" stroke="#7C2D12" strokeWidth="3" strokeLinecap="round"/>
         <path d="M58 52C58 52 60 50 62 52" stroke="#7C2D12" strokeWidth="3" strokeLinecap="round"/>
         <path d="M45 62C45 62 50 68 55 62" stroke="#7C2D12" strokeWidth="3" strokeLinecap="round"/>
         <circle cx="35" cy="58" r="4" fill="#FECACA" opacity="0.6"/>
         <circle cx="65" cy="58" r="4" fill="#FECACA" opacity="0.6"/>
      </>
    ) : frozen ? (
      <>
        <path d="M38 52L42 52" stroke="#1E3A8A" strokeWidth="3" strokeLinecap="round"/>
        <path d="M58 52L62 52" stroke="#1E3A8A" strokeWidth="3" strokeLinecap="round"/>
        <path d="M42 65C42 65 50 60 58 65" stroke="#1E3A8A" strokeWidth="3" strokeLinecap="round"/>
        <path d="M20 55L25 55" stroke="#BFDBFE" strokeWidth="2" />
        <path d="M75 55L80 55" stroke="#BFDBFE" strokeWidth="2" />
      </>
    ) : confused ? (
      <>
        <circle cx="38" cy="52" r="3" fill="#7C2D12" />
        <circle cx="62" cy="52" r="3" fill="#7C2D12" />
        <path d="M45 62C45 62 50 60 55 62" stroke="#7C2D12" strokeWidth="3" strokeLinecap="round"/>
        <path d="M35 45C35 45 38 42 42 45" stroke="#7C2D12" strokeWidth="3" strokeLinecap="round"/>
        <path d="M58 45C58 45 62 48 65 45" stroke="#7C2D12" strokeWidth="3" strokeLinecap="round"/>
      </>
    ) : (
      <>
        <circle cx="40" cy="52" r="3" fill="#7C2D12" />
        <circle cx="60" cy="52" r="3" fill="#7C2D12" />
        <path d="M48 60H52" stroke="#7C2D12" strokeWidth="3" strokeLinecap="round"/>
        <circle cx="35" cy="58" r="4" fill="#FECACA" opacity="0.6"/>
        <circle cx="65" cy="58" r="4" fill="#FECACA" opacity="0.6"/>
      </>
    )}
  </svg>
);