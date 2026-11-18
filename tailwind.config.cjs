module.exports = {
  content: ['./MUSICA.HTML', './assets/js/piano-engine.js'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#060a17',
          900: '#160b2d',
          800: '#1c2541',
          700: '#543b72',
          600: '#5bc0be',
        },
        silver: {
          100: '#f8f9fa',
          200: '#e9ecef',
          300: '#dee2e6',
          400: '#ced4da',
          500: '#adb5bd',
          600: '#868e96',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Inter', 'sans-serif'],
        script: ['Great Vibes', 'cursive'],
      },
    },
  },
  plugins: [],
};
