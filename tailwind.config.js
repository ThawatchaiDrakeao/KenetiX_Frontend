/** @type { import('tailwindcss').Config } */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        neon: {
          DEFAULT: '#C3FF51',
          hover: '#D3FE51',
        },
        dark: {
          DEFAULT: '#080809',
          card: '#0F0F10',
          elevated: '#141415',
          border: '#1E1E20',
        },
        cyan: '#00E5FF',
      },
      fontFamily: {
        sora: ['"SF Pro Display"', '"SF Pro Text"', '-apple-system', 'BlinkMacSystemFont', '"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
        display: ['"SF Pro Display"', '"SF Pro Text"', '-apple-system', 'BlinkMacSystemFont', '"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
        sans: ['"SF Pro Display"', '"SF Pro Text"', '-apple-system', 'BlinkMacSystemFont', '"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'fade-up': 'fadeUp 0.7s ease-out forwards',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'glow-pulse': 'glowPulse 2.5s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-18px)' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(28px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 16px rgba(195,255,81,0.25)' },
          '50%': { boxShadow: '0 0 40px rgba(195,255,81,0.55)' },
        },
      },
      backgroundImage: {
        'grid-dark':
          'linear-gradient(rgba(195,255,81,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(195,255,81,0.03) 1px, transparent 1px)',
      },
      backgroundSize: {
        grid: '60px 60px',
      },
    },
  },
  plugins: [],
}
