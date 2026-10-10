import React from 'react';

interface LogoProps {
  size?: 'sm' | 'lg';
}

export default function Logo({ size = 'sm' }: LogoProps) {
  const iconSize = size === 'lg' ? 56 : 34;
  const fontSize = size === 'lg' ? 32 : 17;

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: size === 'lg' ? 14 : 10 }}>
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0, filter: 'drop-shadow(0 0 14px rgba(16, 185, 129, 0.45))' }}
      >
        <rect width="48" height="48" rx="14" fill="url(#emerald-logo-gradient)" />
        <path
          d="M33 24L19 32.083V15.917L33 24Z"
          fill="#FFFFFF"
        />
        <defs>
          <linearGradient id="emerald-logo-gradient" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop stopColor="#34d399" />
            <stop offset="1" stopColor="#059669" />
          </linearGradient>
        </defs>
      </svg>
      <span
        style={{
          fontWeight: 800,
          fontSize: `${fontSize}px`,
          letterSpacing: '-0.025em',
          background: 'linear-gradient(135deg, #ffffff 40%, #a7f3d0)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          lineHeight: 1.1,
        }}
      >
        Watch Party
      </span>
    </div>
  );
}
