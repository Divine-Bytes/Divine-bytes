export const colors = {
  deepNavy: '#1B2A4A',
  warmWhite: '#FAF8F5',
  luxuryGold: '#C9A84C',
  chocolateBrown: '#3E1F00',
  darkGray: '#2D2D2D',
} as const;

export const fonts = {
  heading: 'var(--font-playfair), serif',
  body: 'var(--font-inter), sans-serif',
} as const;

export const animation = {
  fast: '150ms ease-out',
  normal: '250ms ease-out',
  slow: '400ms ease-out',
} as const;

export const breakpoints = {
  mobile: '320px',
  tablet: '768px',
  desktop: '1024px',
} as const;
