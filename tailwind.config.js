const colors = require("tailwindcss/colors")

module.exports = {
  purge: ["./index.html", "./src/**/*.{ vue, js, jsx, html }"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        'primary-light': '#F7F8FC',
        'secondary-light': '#FFFFFF',
        'ternary-light': '#f6f7f8',

        'orange': '#e3680a',
        'orange-light': '#fffbf3',
        'orange-pale': '#fcf8ee',

        'primary-dark': '#0D2438',
        'secondary-dark': '#102D44',
        'ternary-dark': '#1E3851',
      },
      container: {
        padding: {
          // DEFAULT: '1rem',
          // sm: '2rem',
          // lg: '5rem',
          // xl: '6rem',
          // '2xl': '8rem',
        },
      },
    },
  },
  variants: {
    extend: { opacity: ["disabled"] },
  },
  plugins: [ require("@tailwindcss/forms") ],
}
