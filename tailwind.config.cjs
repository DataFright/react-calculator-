const windmill = require('windmill-react-ui/config')

module.exports = windmill({
  purge: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
    './node_modules/windmill-react-ui/dist/**/*.js',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
})
