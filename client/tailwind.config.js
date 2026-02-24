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
      backgroundImage: {
        primaryBG: "linear-gradient(135deg, #0a0a1a 0%, #080818 50%, #0d0d24 100%)"
      },
      colors: {
        primaryBG: "#0a0a1a",
        secondaryBG: "#111128",
        neonCyan: "#22d3ee",
        neonPink: "#ff2bd6",
        neonYellow: "#facc15",
        neonGreen: "#4ade80",
      },
      keyframes: {
        flicker: {
          "0%,18%,22%,25%,53%,57%,100%": { opacity: "1" },
          "20%,24%,55%": { opacity: "0.35" }
        },
        turnPulse: {
          "0%, 100%": { boxShadow: "0 0 5px #22d3ee, 0 0 10px #22d3ee" },
          "50%":      { boxShadow: "0 0 24px #22d3ee, 0 0 48px #22d3ee" }
        },
        turnPulsePink: {
          "0%, 100%": { boxShadow: "0 0 5px #ff2bd6, 0 0 10px #ff2bd6" },
          "50%":      { boxShadow: "0 0 24px #ff2bd6, 0 0 48px #ff2bd6" }
        },
        cellPop: {
          "0%":   { transform: "scale(0.4)", opacity: "0" },
          "70%":  { transform: "scale(1.25)", opacity: "1" },
          "100%": { transform: "scale(1)" }
        },
        retroPopIn: {
          "0%":   { transform: "scale(0.2)", opacity: "0" },
          "60%":  { transform: "scale(1.1)", opacity: "1" },
          "80%":  { transform: "scale(0.97)" },
          "100%": { transform: "scale(1)", opacity: "1" }
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%":      { opacity: "0" }
        },
        winFlash: {
          "0%, 100%": { backgroundColor: "#22d3ee" },
          "50%":      { backgroundColor: "#0e7490" }
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "25%":      { transform: "translateX(-6px)" },
          "75%":      { transform: "translateX(6px)" }
        },
        boardWin: {
          "0%":   { transform: "scale(1)" },
          "50%":  { transform: "scale(1.07)" },
          "100%": { transform: "scale(1)" }
        },
        neonPulse: {
          "0%, 100%": { boxShadow: "0 0 4px currentColor, 0 0 8px currentColor" },
          "50%":      { boxShadow: "0 0 16px currentColor, 0 0 32px currentColor" }
        },
        slideDown: {
          "0%":   { transform: "translateY(-20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" }
        }
      },
      animation: {
        flicker:       "flicker 4s infinite",
        turnPulse:     "turnPulse 1.2s ease-in-out infinite alternate",
        turnPulsePink: "turnPulsePink 1.2s ease-in-out infinite alternate",
        cellPop:       "cellPop 0.3s ease-out",
        retroPopIn:    "retroPopIn 0.45s cubic-bezier(0.22,1,0.36,1) forwards",
        blink:         "blink 1s step-start infinite",
        winFlash:      "winFlash 0.5s ease-in-out infinite",
        shake:         "shake 0.2s linear 2",
        boardWin:      "boardWin 0.4s ease-in-out 2",
        neonPulse:     "neonPulse 1.5s ease-in-out infinite",
        slideDown:     "slideDown 0.3s ease-out"
      }
    },
  },
  plugins: [],
};