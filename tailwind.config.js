/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // color theme generated with https://colorffy.com/dark-theme-generator
      // primary - #673ab7
      // secondary - #121212
      // mix intensity 0.3
      // numbers 100-600 are backwards from site because it fits how tailwind does shit
      colors: {
        primary: {
          100: "#bfa5e0",
          200: "#ae8fd8",
          300: "#9d79d0",
          400: "#8c64c8",
          500: "#7a4fbf",
          600: "#673ab7",
        },
        secondary: {
          100: "#8b8b8b",
          200: "#717171",
          300: "#575757",
          400: "#3f3f3f",
          500: "#282828",
          600: "#121212",
        },
        tertiary: {
          100: "#9b93a4",
          200: "#837a8e",
          300: "#6c6279",
          400: "#564a65",
          500: "#413451",
          600: "#2c1f3e",
        },
      },
      // fonts are linked from google in index.html
      fontFamily: {
        oswald: ["Oswald", "sans-serif"],
        cinzel: ["Cinzel Decorative", "cursive"],
      },
    },
  },
  plugins: [],
};
