module.exports = ({ env }) => ({
  syntax: 'postcss-scss',

  plugins: [
    require('postcss-import'),
    require('postcss-nested'),
    require('tailwindcss/nesting'),
    require('tailwindcss'),
    require('autoprefixer'),
    require('cssnano')({
      preset: [
        'default',
        {
          discardComments: {
            removeAll: true
          }
        }
      ]
    })
  ]
})
