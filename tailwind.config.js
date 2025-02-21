/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        qs: ["Quicksand", "sans-serif"],
      },
    },
  },
  plugins: [],
};
