/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Neon pink theme
        neon: {
          pink: '#ff00cc',
          blue: '#00ffff',
          purple: '#cc00ff',
          green: '#00ff88',
        },
        primary: {
          50: '#fff0f9',
          100: '#ffe3f7',
          200: '#ffc6f0',
          300: '#ff99e6',
          400: '#ff66dd',
          500: '#ff00cc', // Main neon pink
          600: '#e600b8',
          700: '#cc00a3',
          800: '#99007a',
          900: '#660052',
        },
        accent: {
          50: '#f0ffff',
          100: '#e0ffff',
          200: '#c0ffff',
          300: '#80ffff',
          400: '#40ffff',
          500: '#00ffff', // Main neon blue
          600: '#00e6e6',
          700: '#00cccc',
          800: '#009999',
          900: '#006666',
        },
        dark: {
          50: '#2a2a2a',
          100: '#242424',
          200: '#1f1f1f',
          300: '#1a1a1a',
          400: '#151515',
          500: '#121212',
          600: '#0f0f0f', // Main dark background
          700: '#0a0a0a',
          800: '#050505',
          900: '#000000',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'glow-sm': '0 0 5px currentColor',
        'glow': '0 0 10px currentColor',
        'glow-lg': '0 0 20px currentColor',
        'glow-xl': '0 0 30px currentColor',
        'neon-pink': '0 0 10px #ff00cc, 0 0 20px #ff00cc, 0 0 30px #ff00cc',
        'neon-blue': '0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 30px #00ffff',
        'neon-purple': '0 0 10px #cc00ff, 0 0 20px #cc00ff, 0 0 30px #cc00ff',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px currentColor' },
          '100%': { boxShadow: '0 0 20px currentColor' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
} 