import preline from 'preline/plugin.js'

export default {
  content: [
    './index.html', 
    './src/**/*.{html,vue,js}', 
    'node_modules/preline/dist/*.js'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji'
        ]
      }
    }
  },
  plugins: [
    preline
  ]
}