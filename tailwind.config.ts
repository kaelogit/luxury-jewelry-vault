/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}", 
  ],
  theme: {
    extend: {
      colors: {
        // THE OPULENT PALETTE
        // Main Background: 'Ivory/Pearl'
        // Primary Text: 'Deep Obsidian'
        // Accent: 'Sovereign Gold'
        ivory: {
          50: '#FFFFFF',
          100: '#FDFCFB',  // THE MAIN BACKGROUND (Creamy White)
          200: '#F7F5F0',  // Section Fills
          300: '#E8E4D9',  // Borders & Dividers
        },
        obsidian: {
          900: '#0A0A0A',  // MAIN TEXT (Headings)
          800: '#1A1A1A',  // Sub-headings
          600: '#4A4A4A',  // Body Text
          400: '#7A7A7A',  // Muted Labels
        },
        gold: {
          50: '#FBF8E7',
          100: '#F1E5AC',
          200: '#E7D271',
          DEFAULT: '#D4AF37', // CHAMPAGNE GOLD (Signature Color)
          400: '#B8860B',
          500: '#996515', // Darker Gold for hover states
        },
        // We keep zinc but shift it to support a light theme logic
        zinc: {
          50: '#050505',   // Now Zinc 50 is Black (inverted logic)
          950: '#FDFCFB',  // Now Zinc 950 is the light base
        },
      },
      fontFamily: {
        // We use Geist but add a Serif fallback for that 'Jewelry Magazine' feel
        sans: ['var(--font-geist-sans)', 'Inter', 'serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 1.2s ease-out forwards',
        'scan': 'scan 3s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(15px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        // 'Flashy' Gold Gradient
        'gold-silk': 'linear-gradient(to right, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771C)',
        'vault-noise': "url('https://grainy-gradients.vercel.app/noise.svg')",
      },
    },
  },
  plugins: [],
};