/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}", 
  ],
  theme: {
    // FORCE READABLE SCREEN SIZES FOR MOBILE-FIRST DESIGN
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
        // THE REFINED AUVERE-INSPIRED PALETTE
        ivory: {
          50: '#FFFFFF',
          100: '#FBFBF7',  // INSTITUTIONAL BASE
          200: '#F2F0E8',  
          300: '#DEDAC7',  
        },
        obsidian: {
          900: '#050505',  // TRUE BLACK
          800: '#121212',  
          600: '#3D3D3D',  
          400: '#666666',  
          300: '#949494',  
        },
        gold: {
          50: '#FBF8E7',
          100: '#F1E5AC',
          200: '#E7D271',
          DEFAULT: '#C5A028', // DEEP CHAMPAGNE
          400: '#B8860B',
          500: '#996515', 
        },
      },
      fontFamily: {
        // Headings & Luxury Labels
        serif: ['var(--font-serif)', 'serif'], 
        // Prices, Weights, SKUs, and Buttons
        sans: ['var(--font-sans)', 'sans-serif'], 
      },
      animation: {
        'pulse-slow': 'pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 1s ease-out forwards',
        'shimmer': 'shimmer 2.5s linear infinite',
        // --- NEW CONTINUOUS TICKER ANIMATION ---
        'marquee': 'marquee 40s linear infinite', 
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        // --- NEW KEYFRAMES FOR SEAMLESS LOOP ---
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      },
      backgroundImage: {
        'gold-silk': 'linear-gradient(to right, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771C)',
      },
    },
  },
  plugins: [],
};