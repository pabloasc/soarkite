/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'rd-red': '#8b0000',
        'rd-cream': '#f8f3e6',
        'rd-brown': '#8b4513',
      },
      fontFamily: {
        'playfair': ['Playfair Display', 'serif'],
        'source-serif': ['Source Serif Pro', 'serif'],
      },
    },
  },
  plugins: [],
};