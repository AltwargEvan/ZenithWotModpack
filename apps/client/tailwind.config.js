// /** @type {import('tailwindcss').Config} */
// import baseCfg from "@zenith/ui/tailwind.config";
// console.log(baseCfg);
// export default {
//   ...baseCfg,
//   content: ["./src/**/*.{js,tx,jsx,tsx}"],
// };

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
