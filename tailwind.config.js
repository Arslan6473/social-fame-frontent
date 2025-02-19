/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
      bgColor: "rgb(var(--color-bg) / 1)",
      primary: "rgb(var(--color-primary) / 1)",
      secondary: "rgb(var(--color-secondary) / 1)",
      blue: "rgb(var(--color-blue) / 1)",
      white: "rgb(var(--color-white) / 1)",
      ascent: {
        1: "rgb(var(--color-ascent1) / 1)",
        2: "rgb(var(--color-ascent2) / 1)",
      },
    },
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {},
  },
  plugins: [],
};
