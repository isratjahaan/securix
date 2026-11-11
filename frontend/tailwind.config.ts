import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        navy: {
          950: "#0A111C",
          900: "#101C2C", // Deep Navy
          800: "#17283B", // Midnight Blue
          700: "#202B36", // Charcoal
          600: "#293745",
        },
        teal: {
          DEFAULT: "#20BFA9", // Security Teal
          400: "#2FE0C7",
          500: "#20BFA9",
          600: "#179B89",
        },
        cyan: {
          DEFAULT: "#32C5DD", // Cyan Accent
          400: "#4FD5EB",
          500: "#32C5DD",
          600: "#219EB3",
        },
        surface: {
          base: "#101C2C",
          card: "#17283B",
          cardHover: "#1E334B",
          elevated: "#202B36",
          border: "#2A3C4F",
          borderFocus: "#32C5DD",
        },
        text: {
          primary: "#F5F7FA", // Soft White
          secondary: "#94A3B8", // Muted Gray
          muted: "#64748B",
        },
        status: {
          critical: "#EF4444",
          high: "#F97316",
          medium: "#F59E0B",
          low: "#3B82F6",
          info: "#06B6D4",
          healthy: "#10B981",
          active: "#20BFA9",
          disabled: "#64748B",
          maintenance: "#8B5CF6",
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
