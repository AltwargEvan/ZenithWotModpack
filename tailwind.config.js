/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // color theme generated with https://colorffy.com/dark-theme-generator
      // primary - #673ab7
      // secondary - #121212
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
          100: "#908e94",
          200: "#77747b",
          300: "#5e5b63",
          400: "#46434c",
          500: "#302c36",
          600: "#1b1721",
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
