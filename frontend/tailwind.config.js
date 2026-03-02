/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        parchment: "#e8d5b7",
        gold: "#c9a84c",
        mahogany: "#1a0e08",
        bark: "#2a1a10",
        walnut: "#5c3d2a",
        crimson: "#7a1a24",
        slate: "#4a6785",
      },
      fontFamily: {
        display: ["'Playfair Display'", "serif"],
        body: ["'Crimson Text'", "serif"],
      },
    },
  },
  plugins: [],
};