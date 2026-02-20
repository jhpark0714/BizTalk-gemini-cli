/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./js/*.js"],
  theme: {
    extend: {
      boxShadow: {
        'retro-hard': '8px 8px 0px 0px rgba(0, 0, 0, 1)',
      }
    },
  },
  plugins: [],
}

