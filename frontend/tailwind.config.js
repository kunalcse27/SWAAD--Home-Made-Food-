/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF6B2C',
          50:  '#FFF4EF',
          100: '#FFE4D6',
          200: '#FFC4A3',
          300: '#FFA070',
          400: '#FF813E',
          500: '#FF6B2C',
          600: '#E8520F',
          700: '#C2400A',
          800: '#9A3108',
          900: '#7A2706',
        },
        amber: {
          DEFAULT: '#FFB347',
          light: '#FFD580',
        },
        surface: {
          DEFAULT: '#FFFAF5',
          card: '#FFFFFF',
          section: '#F6F0EA',
          muted: '#EDE7E2',
        },
        ink: {
          DEFAULT: '#302E2B',
          secondary: '#5E5B57',
          muted: '#7A7672',
          light: '#B1ACA8',
          tertiary: '#C5BDB8',
        },
        rust: {
          DEFAULT: '#C0602F',
          dark: '#9A501B',
          light: '#D98A52',
        },
        success: '#22C55E',
        error: '#EF4444',
        veg: '#22C55E',
        nonveg: '#EF4444',
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Poppins', 'sans-serif'],
      },
      borderRadius: {
        xl: '16px',
        '2xl': '20px',
        '3xl': '28px',
        full: '9999px',
      },
      boxShadow: {
        card: '0 4px 24px rgba(48, 46, 43, 0.08)',
        'card-hover': '0 8px 32px rgba(255, 107, 44, 0.18)',
        float: '0 20px 40px rgba(48, 46, 43, 0.06)',
        glow: '0 0 20px rgba(255, 107, 44, 0.4)',
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #FF6B2C 0%, #FFB347 60%, #FFD580 100%)',
        'primary-gradient': 'linear-gradient(135deg, #FF6B2C 0%, #FF8C42 100%)',
        'card-overlay': 'linear-gradient(to top, rgba(48,46,43,0.75) 0%, transparent 50%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'shimmer': 'shimmer 1.5s infinite',
        'bounce-soft': 'bounceSoft 0.6s ease',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(20px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        bounceSoft: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-4px)' } },
        scaleIn: { from: { opacity: 0, transform: 'scale(0.95)' }, to: { opacity: 1, transform: 'scale(1)' } },
      },
    },
  },
  plugins: [],
}
