/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        abyss: "#091413",
        glow: "#8b5cf6",
        teal: "#2dd4bf",
        ember: "#f97316",
      },
      boxShadow: {
        softglow: "0 0 70px rgba(139, 92, 246, 0.18)",
        clay: "0 14px 36px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.08)",
      },
    },
  },
  plugins: [],
};
