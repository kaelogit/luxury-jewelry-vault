import type { Config } from 'tailwindcss';

/** * MAISON DESIGN SYSTEM 
 * Balanced for high-readability and elite "Boutique" aesthetics.
 */
const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}", 
  ],
  theme: {
    screens: {
      'xs': '375px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },

    extend: {
      colors: {
        // Maison Color Palette
        ivory: {
          50: '#FFFFFF',
          100: '#FBFBF7',  // Main Background
          200: '#F2F0E8',  // Soft Silk
          300: '#DEDAC7',  // Aged Parchment
        },
        obsidian: {
          900: '#050505',  // Pure Onyx
          800: '#121212',  
          600: '#3D3D3D',  
          400: '#666666',  
          300: '#949494',  
        },
        gold: {
          50: '#FBF8E7',
          100: '#F1E5AC',
          200: '#E7D271',
          DEFAULT: '#C5A028', // Signature Gold
          400: '#B8860B',
          500: '#996515', 
        },
      },
      fontFamily: {
        // Simple and clean fonts
        sans: ['Arial', 'Helvetica', 'Inter', 'sans-serif'],
        serif: ['Georgia', 'Times New Roman', 'serif'], 
      },
      letterSpacing: {
        'boutique': '0.25em',
        'elite': '0.45em',
      },
      transitionDuration: {
        'luxury': '500ms',
        'slow-reveal': '1200ms',
      },
      animation: {
        'pulse-slow': 'pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 1s ease-out forwards',
        'shimmer': 'shimmer 2.5s linear infinite',
        'marquee': 'marquee 50s linear infinite', 
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      },
      backgroundImage: {
        'gold-silk': 'linear-gradient(to right, #C5A028, #E7D271, #C5A028)',
      },
    },
  },
  plugins: [],
};

export default config;