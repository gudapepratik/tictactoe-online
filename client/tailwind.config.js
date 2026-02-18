/** @type {import('tailwindcss').Config} */

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        luckyGuy: ["Luckiest Guy", "sans serif"],
        lilitaOne: ["Lilita One", "sans serif"],
        slackey: ["Slackey", "sans serif"],
        pixelifySans: ["Pixelify Sans", "sans serif"],
        pressStart2P: ['"Press Start 2P"', "monospace"]
      },
      // add gradients here
      backgroundImage: {
        primaryBG: "linear-gradient(to right, #1e293b, #0f172a)"
      },
      // add colors here
      colors: {
        secondaryBG: "#1e293b"
      }
    },
  },
  plugins: [],
};