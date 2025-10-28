interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function Logo({ size = "md", className = "" }: LogoProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-16 h-16",
    lg: "w-24 h-24",
  };

  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${sizeClasses[size]} ${className}`}
    >
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00d9ff" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      
      {/* Círculo de fundo com gradiente */}
      <circle 
        cx="50" 
        cy="50" 
        r="45" 
        fill="url(#logoGradient)" 
        opacity="0.2" 
      />
      
      {/* Forma principal - Diamond/Estrela */}
      <path
        d="M50 20 L70 50 L50 80 L30 50 Z"
        fill="url(#logoGradient)"
        className="animate-pulse"
        filter="url(#glow)"
      />
      
      {/* Ponto central */}
      <circle 
        cx="50" 
        cy="50" 
        r="8" 
        fill="#00d9ff"
        filter="url(#glow)"
      />
      
      {/* Linhas decorativas */}
      <line 
        x1="50" 
        y1="20" 
        x2="50" 
        y2="80" 
        stroke="url(#logoGradient)" 
        strokeWidth="1" 
        opacity="0.3"
      />
      <line 
        x1="30" 
        y1="50" 
        x2="70" 
        y2="50" 
        stroke="url(#logoGradient)" 
        strokeWidth="1" 
        opacity="0.3"
      />
    </svg>
  );
}

