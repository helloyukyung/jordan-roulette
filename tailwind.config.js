/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Helvetica Neue"', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 40px rgba(255, 255, 255, 0.18)',
      },
    },
  },
  plugins: [],
}

