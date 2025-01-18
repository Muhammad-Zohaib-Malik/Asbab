/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")], // If you're using NativeWind

  theme: {
    extend: {},
  },
  plugins: [],
}

