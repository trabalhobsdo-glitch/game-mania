import type { Config } from 'tailwindcss';

/**
 * Tokens de design: a cor neon vive em app/globals.css (--accent).
 * Trocar a cor da loja inteira = mudar UMA linha lá.
 */
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        accent: 'rgb(var(--accent) / <alpha-value>)',
      },
      fontFamily: {
        display: ['"Chakra Petch"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['Manrope', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 0 1px rgb(var(--accent) / 0.55), 0 10px 40px -10px rgb(var(--accent) / 0.55)',
        card: '0 24px 60px -28px rgb(0 0 0 / 0.9), 0 0 0 1px rgb(var(--accent) / 0.35)',
        soft: '0 18px 50px -30px rgb(0 0 0 / 0.9)',
      },
      borderRadius: {
        card: '1.25rem',
        control: '0.85rem',
      },
      keyframes: {
        rise: {
          '0%': { opacity: '0', transform: 'translateY(18px)' },
          '100%': { opacity: '1', transform: 'none' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        bump: {
          '0%, 100%': { transform: 'scale(1)' },
          '40%': { transform: 'scale(1.35)' },
        },
        slideInRight: {
          from: { transform: 'translateX(100%)' },
          to: { transform: 'none' },
        },
        slideInLeft: {
          from: { transform: 'translateX(-100%)' },
          to: { transform: 'none' },
        },
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        pop: {
          from: { opacity: '0', transform: 'scale(.97) translateY(8px)' },
          to: { opacity: '1', transform: 'none' },
        },
      },
      animation: {
        rise: 'rise .8s cubic-bezier(.2,.7,.2,1) both',
        shimmer: 'shimmer 1.6s linear infinite',
        bump: 'bump .45s ease-out',
        'slide-right': 'slideInRight .3s cubic-bezier(.2,.7,.2,1) both',
        'slide-left': 'slideInLeft .3s cubic-bezier(.2,.7,.2,1) both',
        'fade-in': 'fadeIn .2s ease-out both',
        pop: 'pop .22s ease-out both',
      },
    },
  },
  plugins: [],
};

export default config;
