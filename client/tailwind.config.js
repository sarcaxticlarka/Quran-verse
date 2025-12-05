/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f6f8f3', // lightest
          100: '#e9f5e1',
          200: '#d0eac7',
          300: '#b2d8a6',
          400: '#8fc47c',
          500: '#6fa44a', // main green
          600: '#4e7c2c',
          700: '#355a1a',
          800: '#223a0e',
          900: '#16240a', // darkest
        },
        gold: {
          100: '#fff9e5',
          300: '#ffe9a7',
          500: '#ffd700', // gold
          700: '#bfa100',
        },
        accent: {
          100: '#f3f0ff',
          500: '#a78bfa', // purple accent
        },
      },
      fontFamily: {
        arabic: ['Amiri', 'Noto Naskh Arabic', 'serif'],
        display: ['"Scheherazade New"', 'serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [],
}
