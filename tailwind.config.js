import formsPlugin from "@tailwindcss/forms";
import typography from "@tailwindcss/typography";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },
      colors: {
        skyBlue: "#4F95FF",
        "light-green": "#E1FBED",
        "dark-green": "#217D4E",
        dark: "#333843",
        "light-dark": "#667085",
        red: "#E46A11",
        "light-red": "#FDF1E8",
        gray: "#E0E2E7",
        "light-gray": "#FAFCFB",
        "medium-gray": "#F9F9FC",
      },
    },
  },
  plugins: [
    formsPlugin({
      strategy: "class",
    }),
    typography,
  ],
};
