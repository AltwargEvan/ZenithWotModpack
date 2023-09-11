/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // fonts are linked from google in index.html
      fontFamily: {
        oswald: ["Oswald", "sans-serif"],
        cinzel: ["Cinzel Decorative", "cursive"],
      },
      colors: {
        neutral: {
          850: "#2C2C2C",
        },
      },
    },
  },
  plugins: [],
};
