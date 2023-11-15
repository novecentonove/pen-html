/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // fontFamily: {
      //   'sans': ['var(--app-font)', 'system-ui']
      // }
    },
  },
  plugins: [require('@tailwindcss/typography')],
}

