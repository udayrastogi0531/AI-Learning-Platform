/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./src/app/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  darkMode: 'class',
  future: {
    hoverOnlyWhenSupported: true, // Improves mobile performance
  },
  theme: {
    screens: {
      'xs': '475px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
      '3xl': '1920px',
    },
    extend: {
      colors: {
        primary: {
          50: '#f4f1ff',
          100: '#e6ddff',
          200: '#d1c2ff',
          300: '#b29bff',
          400: '#9a7bff',
          500: '#7C5CFF',
          600: '#6c4ef5',
          700: '#5b3fe0',
          800: '#4a33c2',
          900: '#3b2899',
        },
        secondary: {
          50: '#e7fbff',
          100: '#c2f3ff',
          200: '#8fe9ff',
          300: '#5fdfff',
          400: '#2bd6ff',
          500: '#00D4FF',
          600: '#00b6db',
          700: '#0091ad',
          800: '#006b80',
          900: '#004656',
        },
        background: {
          DEFAULT: 'rgb(var(--brand-bg))',
          secondary: 'rgb(var(--brand-bg))',
          muted: 'rgb(var(--brand-bg))',
        },
        foreground: {
          DEFAULT: 'rgb(var(--brand-text))',
          secondary: 'rgb(var(--brand-muted))',
          muted: 'rgb(var(--brand-muted))',
        },
        card: {
          DEFAULT: 'rgba(255,255,255,0.05)',
          border: 'rgba(255,255,255,0.12)',
        },
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'heading': ['Poppins', 'system-ui', 'sans-serif'],
        'body': ['Source Sans Pro', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Responsive typography with clamp for WCAG compliance
        'xs': ['clamp(0.75rem, 0.7vw + 0.6rem, 0.875rem)', { lineHeight: '1.5' }],
        'sm': ['clamp(0.875rem, 0.8vw + 0.7rem, 1rem)', { lineHeight: '1.5' }],
        'base': ['clamp(1rem, 0.9vw + 0.8rem, 1.125rem)', { lineHeight: '1.6' }], // 16px mobile base
        'lg': ['clamp(1.125rem, 1vw + 0.9rem, 1.25rem)', { lineHeight: '1.6' }],
        'xl': ['clamp(1.25rem, 1.2vw + 1rem, 1.5rem)', { lineHeight: '1.5' }],
        '2xl': ['clamp(1.5rem, 1.5vw + 1.2rem, 2rem)', { lineHeight: '1.4' }],
        '3xl': ['clamp(1.875rem, 2vw + 1.5rem, 2.5rem)', { lineHeight: '1.3' }],
        '4xl': ['clamp(2.25rem, 2.5vw + 1.8rem, 3rem)', { lineHeight: '1.2' }],
        '5xl': ['clamp(3rem, 3vw + 2.4rem, 4rem)', { lineHeight: '1.1' }],
        '6xl': ['clamp(3.75rem, 4vw + 3rem, 5rem)', { lineHeight: '1' }],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 3s infinite',
        'spin-slow': 'spin 3s linear infinite',
        'fade-in': 'fade-in 0.3s ease-out',
        'fade-out': 'fade-out 0.3s ease-in',
        'slide-down': 'slide-down 0.3s ease-out',
        'slide-up': 'slide-up 0.3s ease-out',
        'shake': 'shake 0.5s ease-in-out',
        'glow': 'glow 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite linear',
        'card-reveal': 'card-reveal 0.5s ease-out',
        'progress': 'progress-bar 0.8s ease-out',
        'badge-pulse': 'badge-pulse 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'fade-in': {
          'from': { opacity: '0' },
          'to': { opacity: '1' },
        },
        'fade-out': {
          'from': { opacity: '1' },
          'to': { opacity: '0' },
        },
        'slide-down': {
          'from': { transform: 'translateY(-10px)', opacity: '0' },
          'to': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-up': {
          'from': { transform: 'translateY(10px)', opacity: '0' },
          'to': { transform: 'translateY(0)', opacity: '1' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-5px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(5px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(59, 130, 246, 0.5)' },
          '50%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.8)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        'card-reveal': {
          'from': { opacity: '0', transform: 'translateY(20px) scale(0.95)' },
          'to': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'progress-bar': {
          'from': { transform: 'scaleX(0)', transformOrigin: 'left' },
          'to': { transform: 'scaleX(1)', transformOrigin: 'left' },
        },
        'badge-pulse': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
}
