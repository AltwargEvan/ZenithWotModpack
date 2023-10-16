/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // fonts are linked from google in index.html
      fontFamily: {
        oswald: ["var(--font-oswald)"],
        cinzel: ["var(--font-cinzel)"],
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
