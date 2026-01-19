/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Colors are already available via Tailwind's default color palette
      // We use blue-600, gray-500, etc. which match our theme colors
      // For custom colors, extend here:
      colors: {
        // Custom semantic colors if needed
        // These match our theme/colors.js values
      },
      // Font families match system fonts (already default in Tailwind)
      // Font sizes, weights, spacing use Tailwind defaults which match our theme
      // Breakpoints match Tailwind defaults
    },
  },
  plugins: [],
}
