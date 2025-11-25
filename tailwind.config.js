/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src//*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        marquee: "marquee 20s linear infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(-100%)" },
        },
      },
      fontSize: {
        xs: "1.125rem", // 18px
        sm: "1.375rem", // 22px
        base: "1.5rem", // 24px
        lg: "1.875rem", // 30px
        xl: "2.25rem", // 36px
        "2xl": "3rem", // 48px
        "3xl": "3.75rem", // 60px
        "4xl": "4.5rem", // 72px
        "5xl": "6rem", // 96px
      },
    },
  },
  plugins: [],
};