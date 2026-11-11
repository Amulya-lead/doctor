import React from 'react';

interface BrandLogoProps {
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  showWordmark?: boolean;
  subtitle?: string;
  className?: string;
}

const SIZE_MAP = {
  sm: { icon: 'w-7 h-7', text: 'text-base', sub: 'text-[10px]' },
  md: { icon: 'w-9 h-9', text: 'text-lg', sub: 'text-[11px]' },
  lg: { icon: 'w-11 h-11', text: 'text-xl', sub: 'text-xs' },
};

/**
 * HospitalOS stacked isometric brand mark + Be Vietnam Pro wordmark.
 * Renders cleanly across both light (#E7F0E9/#FFFFFF) and dark (#10221F/#1D4840) surfaces.
 */
export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'light',
  size = 'md',
  showWordmark = true,
  subtitle,
  className = '',
}) => {
  const s = SIZE_MAP[size];
  const topPlate = variant === 'dark' ? '#39786B' : '#1D4840';
  const midPlate = variant === 'dark' ? '#79A99A' : '#39786B';
  const bottomPlate = variant === 'dark' ? '#E7F0E9' : '#B7D3C6';

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${s.icon} flex-shrink-0`}
        aria-hidden="true"
      >
        <path
          d="M32 6.5 L53 16 L32 25.5 L11 16 Z"
          fill={topPlate}
          stroke={topPlate}
          strokeWidth="5"
          strokeLinejoin="round"
        />
        <path
          d="M11 29.5 L32 39 L53 29.5"
          stroke={midPlate}
          strokeWidth="7.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M11 43.5 L32 53 L53 43.5"
          stroke={bottomPlate}
          strokeWidth="7.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {showWordmark && (
        <div className="flex items-baseline gap-2.5">
          <span
            className={`font-display font-extrabold tracking-tight leading-none ${s.text} ${
              variant === 'dark' ? 'text-white' : 'text-[#10221F]'
            }`}
          >
            Hospital<span className={variant === 'dark' ? 'text-[#B7D3C6]' : 'text-[#39786B]'}>OS</span>
          </span>
          {subtitle && (
            <span
              className={`hidden sm:inline-block font-semibold border-l pl-2.5 ${s.sub} ${
                variant === 'dark'
                  ? 'text-[#B7D3C6]/85 border-[#79A99A]/30'
                  : 'text-[#1D4840]/75 border-[#B7D3C6]'
              }`}
            >
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
