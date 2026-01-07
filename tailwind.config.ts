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
          100: '#FBFBF7',  // INSTITUTIONAL BASE (Soft, high-end off-white)
          200: '#F2F0E8',  // Section Fills
          300: '#DEDAC7',  // Borders (Darkened for visibility)
        },
        obsidian: {
          900: '#050505',  // TRUE BLACK (Headings & Primary UI)
          800: '#121212',  // Sub-headings
          600: '#3D3D3D',  // HIGH-VISIBILITY Body Text
          400: '#666666',  // Readable Labels/Placeholders
          300: '#949494',  // Muted secondary text
        },
        gold: {
          50: '#FBF8E7',
          100: '#F1E5AC',
          200: '#E7D271',
          DEFAULT: '#C5A028', // DEEP CHAMPAGNE (Better contrast on white backgrounds)
          400: '#B8860B',
          500: '#996515', 
        },
      },
      fontFamily: {
        // CLEAN TYPOGRAPHY: Montserrat for UI, Cormorant for Luxury Titles
        serif: ['var(--font-serif)', 'Cormorant Garamond', 'serif'],
        sans: ['var(--font-sans)', 'Montserrat', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 1s ease-out forwards',
        'shimmer': 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      },
      backgroundImage: {
        'gold-silk': 'linear-gradient(to right, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771C)',
      },
    },
  },
  plugins: [],
};