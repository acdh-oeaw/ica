const colors = require('tailwindcss/colors')

/** @type {import('tailwindcss').Config} */
const config = {
  content: ['./src/**/*.@(css|ts|tsx)'],
  corePlugins: {
    backgroundOpacity: false,
    borderOpacity: false,
    divideOpacity: false,
    placeholderOpacity: false,
    ringOpacity: false,
    textOpacity: false,
  },
  theme: {
    extend: {
      colors: {
        neutral: { 0: colors.white, ...colors.slate, 1000: colors.black },
        primary: colors.sky,
      },
      fontFamily: {
        sans: ['InterVariable', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      screens: {
        xs: '480px',
      },
      zIndex: {
        dialog: 'var(--z-index-dialog)',
        overlay: 'var(--z-index-overlay)',
      },
    },
  },
  plugins: [require('@headlessui/tailwindcss')],
}

module.exports = config
