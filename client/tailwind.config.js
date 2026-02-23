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
      },
      keyframes: {
        turnPulse: {
          '0%, 100%': {
            boxShadow: '0 0 5px #22d3ee, 0 0 10px #22d3ee'
          },
          '50%': {
            boxShadow: '0 0 20px #22d3ee, 0 0 40px #22d3ee'
          }
        },
        cellPop: {
          '0%': { transform: 'scale(0.5)', opacity: '0' },
          '70%': { transform: 'scale(1.2)', opacity: '1' },
          '100%': { transform: 'scale(1)' }
        },
        winFlash: {
          '0%, 100%': { backgroundColor: '#22d3ee' },
          '50%': { backgroundColor: '#0e7490' }
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-6px)' },
          '75%': { transform: 'translateX(6px)' }
        },
        boardWin: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)' }
        },
        scanline: {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '0 100%' }
        },
        roundStart: {
          '0%': {
            transform: 'scale(0.3)',
            opacity: '0'
          },
          '60%': {
            transform: 'scale(1.2)',
            opacity: '1'
          },
          '100%': {
            transform: 'scale(1)'
          }
        },


      },
      animation: {
        turnPulse: 'turnPulse 1.2s ease-in-out infinite alternate',
        cellPop: 'cellPop 0.3s ease-out',
        winFlash: 'winFlash 0.5s ease-in-out infinite',
        shake: 'shake 0.2s linear 2',
        boardWin: 'boardWin 0.4s ease-in-out 2',
        scanline: 'scanline 8s linear infinite',
        roundStart: 'roundStart 0.5s ease-out'
      }
    },
  },
  plugins: [],
};