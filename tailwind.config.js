module.exports = {
  purge: [
      './dist/**/*.html',
      './src/**/*.ts'
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {
      gradientColorStops: ['active', 'group-hover']
    },
  },
  plugins: [
    require('@tailwindcss/forms')
  ],
}
