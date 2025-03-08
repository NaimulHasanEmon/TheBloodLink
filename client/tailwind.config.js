/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#E53E3E",
        secondary: "#FC8181",
        accent: "#FED7D7",
        neutral: "#2D3748",
        "base-100": "#FFFFFF",
        "blood-dark": "#B91C1C",
        "blood-light": "#FEB2B2",
        "donor-blue": "#3182CE",
        "donor-light": "#BEE3F8",
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(229, 62, 62, 0.1), 0 2px 4px -1px rgba(229, 62, 62, 0.06)',
        'card-hover': '0 10px 15px -3px rgba(229, 62, 62, 0.2), 0 4px 6px -2px rgba(229, 62, 62, 0.1)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'float': 'float 6s ease-in-out infinite',
        'beat': 'beat 1.5s ease-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        beat: {
          '0%, 100%': { transform: 'scale(1)' },
          '25%': { transform: 'scale(1.1)' },
          '40%': { transform: 'scale(1)' },
          '60%': { transform: 'scale(1.1)' },
        }
      },
      backgroundImage: {
        'hero-pattern': "url('/images/blood-cells-bg.svg')",
        'donor-pattern': "url('/images/donor-bg.svg')",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        bloodlink: {
          primary: "#E53E3E",
          secondary: "#FC8181",
          accent: "#FED7D7",
          neutral: "#2D3748",
          "base-100": "#FFFFFF",
          "info": "#3182CE",
          "success": "#38A169",
          "warning": "#ECC94B",
          "error": "#E53E3E",
        },
      },
      "light",
    ],
  },
} 