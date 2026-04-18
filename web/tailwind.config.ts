import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        swiss: {
          accent: "#FF3000",
          muted: "#F2F2F2",
          black: "#000000",
          white: "#FFFFFF"
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
      },
      borderWidth: {
        '4': '4px',
      },
    },
  },
  plugins: [],
};
export default config;
