// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/app/**/*.{js,jsx,ts,tsx,mdx}",
      "./src/components/**/*.{js,jsx,ts,tsx,mdx}"
    ],
    theme: {
      extend: {
        colors: {
          gold: "var(--gold)",
        },
      },
    },
    plugins: [
      require("@tailwindcss/typography"),
    ],
  }
  