export default {
  /** @type {import('tailwindcss').Config} */
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#E7F0E9',
          100: '#D4E4D8',
          200: '#B7D3C6',
          300: '#B7D3C6',
          400: '#93BDB0',
          500: '#79A99A',
          600: '#538E80',
          700: '#39786B',
          800: '#2A5E53',
          900: '#1D4840',
          950: '#10221F',
        },
        vital: {
          emerald: '#39786B',
          teal: '#39786B',
          cyan: '#79A99A',
          indigo: '#1D4840',
          violet: '#39786B',
          amber: '#79A99A',
          rose: '#1D4840',
        },
        obsidian: {
          950: '#10221F',
          900: '#10221F',
          850: '#162F2A',
          800: '#1D4840',
          750: '#26584E',
          700: '#39786B',
        },
        hospital: {
          50: '#E7F0E9',
          100: '#D4E4D8',
          200: '#B7D3C6',
          300: '#B7D3C6',
          400: '#93BDB0',
          500: '#79A99A',
          600: '#538E80',
          700: '#39786B',
          800: '#2A5E53',
          900: '#1D4840',
          950: '#10221F',
        }
      },
      fontFamily: {
        display: ['"Be Vietnam Pro"', 'system-ui', '-apple-system', 'sans-serif'],
        sans: ['"Be Vietnam Pro"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ping-slow': 'ping 2.5s cubic-bezier(0, 0, 0.2, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'shimmer': 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 15px rgba(6, 182, 212, 0.3)' },
          '100%': { boxShadow: '0 0 30px rgba(6, 182, 212, 0.8), 0 0 50px rgba(99, 102, 241, 0.4)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    },
  },
  plugins: [],
}

