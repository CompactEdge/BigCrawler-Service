// npm run build
// const webpack = require('webpack');

// entry: [ __dirname + '/index.js' ],
module.exports = {
  entry: [ './src/main/resources/static/js/portal/index.js' ],
  target: 'node', // node_modules
  output: {
    path: __dirname + '/src/main/resources/static/dist',
    filename: 'portal.bundle.js'
  },
  mode: "development",
  module:{
    rules: [
      // https://webpack.js.org/loaders/babel-loader/
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/, // Uncaught TypeError: Cannot set property 'wrap' of undefined
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env'
            ], // babel 7
            // presets: ['@babel/preset-es2015'] // old babel
            plugins: [
              ["@babel/plugin-transform-runtime", {
                "regenerator": true
              }]
            ],
          }
        }
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          'style-loader',
          // Translates CSS into CommonJS
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          },
          // Compiles Sass to CSS
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
              sassOptions: {
                minimize: true,
                outputStyle: 'compressed',
                indentWidth: 2,
                includePaths: [ './src/main/resources/static/scss/' ],
              },
            },
          },
        ]
      }
    ]
  },
}