/** @type {import('tailwindcss').Config} */

import defaultConfig from "@zenith/ui/tailwind.config";
export default {
  ...defaultConfig,
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
};
