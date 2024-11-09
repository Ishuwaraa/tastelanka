/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    // "./src/App.jsx",
    // "./src/pages/**.jsx",
    // "./src/components/**/**.jsx"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#CE3030',
      },
      fontFamily: {
        'montserrat': ['Montserrat', 'sand-serif'],
      }
    },
  },
  plugins: [],
}

