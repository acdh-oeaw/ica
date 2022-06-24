/** @typedef {import('tailwindcss').Config} TailwindConfig */

/** @type {TailwindConfig} */
const config = {
  content: ['./src/**/*.@(css|tsx)'],
  corePlugins: {
    textOpacity: false,
    backgroundOpacity: false,
    borderOpacity: false,
    divideOpacity: false,
    placeholderOpacity: false,
    ringOpacity: false,
  },
  plugins: [],
  theme: {
    extend: {},
  },
}

module.exports = config
