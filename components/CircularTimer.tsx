import React from 'react';

interface CircularTimerProps {
  size?: number;
  strokeWidth?: number;
  progress: number; // 0 to 100
  children?: React.ReactNode;
  isInverted?: boolean;
}

export const CircularTimer: React.FC<CircularTimerProps> = ({
  size = 300,
  strokeWidth = 3, // Thinner default stroke
  progress,
  children,
  isInverted = false
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  
  // FIXED: Typo diperbaiki dari constZW ke const offset
  const offset = circumference - (progress / 100) * circumference;

  const trackColor = isInverted ? "text-white/10" : "text-slate-100";
  const progressColor = isInverted ? "text-white" : "text-nature-500";

  return (
    <div className="relative flex items-center justify-center mx-auto max-w-full" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90 absolute w-full h-full"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className={trackColor}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset} // Menggunakan variabel offset yang benar
          strokeLinecap="round"
          className={`transition-all duration-1000 ease-linear ${progressColor}`}
        />
      </svg>
      <div className={`absolute flex flex-col items-center justify-center z-10 w-full px-8 text-center ${isInverted ? 'text-white' : 'text-slate-800'}`}>
        {children}
      </div>
    </div>
  );
};