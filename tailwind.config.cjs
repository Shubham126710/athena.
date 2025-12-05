module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['"Playfair Display"', 'serif'],
      },
      colors: {
        brand: {
          yellow: '#FFB321'
        }
      },
      backgroundImage: {
        'hero-glow': 'radial-gradient(circle at 80% 20%, rgba(120,90,255,0.55), transparent 60%), radial-gradient(circle at 15% 70%, rgba(255,120,60,0.55), transparent 55%)'
      },
      boxShadow: {
        'inner-grid': 'inset 0 0 0 1px rgba(255,255,255,0.04)'
      }
    },
  },
  plugins: [],
};
