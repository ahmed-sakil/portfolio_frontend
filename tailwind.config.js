// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "rgba(var(--color-primary), <alpha-value>)", 
        bg: "#0b111e",
        glass: "rgba(255, 255, 255, 0.05)",
        text: "#f0f2f5",
        "text-muted": "#8b9da6"
      },
      fontFamily: {
        // SETTING DEFAULTS HERE:
        // 1. 'sans' updates the default font for the whole site
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        // 2. 'heading' is our special font for titles
        heading: ['"Space Grotesk"', 'sans-serif'],
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(145deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)',
      }
    },
  },
  plugins: [],
}