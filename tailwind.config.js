/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./router/**/*.{js,ts,jsx,tsx}",
    "./*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        // Warm off-white / cream surfaces (cards, drawers, page backgrounds)
        background: {
          50: '#FEFDFB',
          100: '#FAF7F1',
          200: '#F2EBDD',
          300: '#E5D9C3',
        },
        // Warm charcoal text scale
        foreground: {
          50: '#FAF9F7',
          100: '#F1EFEA',
          150: '#E8E4DC',
          200: '#DDD7CB',
          300: '#C7BEAC',
          400: '#A89C86',
          500: '#8A7C64',
          600: '#6E624E',
          700: '#564C3C',
          800: '#3E362A',
          900: '#2B251C',
          950: '#1A160F',
        },
        // Amber/terracotta brand color — primary buttons, links
        primary: {
          100: '#FBEBD9',
          200: '#F4D2AA',
          400: '#DE9F5C',
          500: '#C17F3E',
          600: '#A3652F',
          700: '#854F26',
          800: '#6B3F21',
        },
        // Sage green — success states (e.g. free shipping unlocked)
        secondary: {
          100: '#E7EEE0',
          200: '#CBDCBB',
          400: '#96B579',
          500: '#78985D',
          600: '#5D7C46',
          700: '#4A6338',
          800: '#3C4F2E',
        },
        // Warm gold/rust — decorative highlights, hero accents
        accent: {
          100: '#F6E7C9',
          200: '#EBCE93',
          300: '#DCAC5A',
          500: '#B5731F',
          600: '#935C19',
          700: '#754815',
          800: '#5C3812',
          900: '#4A2D0F',
        },
      },
    },
  },
  plugins: [],
}
