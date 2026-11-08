import type { Config } from 'tailwindcss';
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        vinho: { DEFAULT: '#4F242F', 950: '#1E0C10', 900: '#2E1419', 800: '#3F1C24', 700: '#4F242F', 600: '#63303C', 500: '#7A3F4C' },
        ouro: { DEFAULT: '#D3B293', 300: '#EBDAC7', 400: '#DEC3A8', 500: '#D3B293', 600: '#B8916F', 700: '#8F6B4E' },
        creme: { DEFAULT: '#FAF6F0', 100: '#FDFBF7', 200: '#F4ECE0', 300: '#E9DCC8' },
        tinta: '#1C1215',
      },
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        serif: ['var(--font-serif)', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      letterSpacing: { luxo: '0.28em' },
      keyframes: {
        fadeUp: { '0%': { opacity: '0', transform: 'translateY(16px)' }, '100%': { opacity: '1', transform: 'none' } },
        marquee: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
      },
      animation: {
        fadeUp: 'fadeUp .8s cubic-bezier(.2,.7,.2,1) both',
        marquee: 'marquee 40s linear infinite',
        shimmer: 'shimmer 6s linear infinite',
      },
    },
  },
  plugins: [],
};
export default config;
