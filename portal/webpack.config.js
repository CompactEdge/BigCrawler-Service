const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const devMode = process.env.NODE_ENV !== 'production';
const plugins = [];
if (devMode) {
  // enable in development only
  plugins.push(
    new MiniCssExtractPlugin({
      filename: '[name].min.css',
      chunkFilename: '[id].min.css',
      ignoreOrder: false, // Enable to remove warnings about conflicting order
    })
  );
}

module.exports = {
  entry: [
    './src/main/resources/static/js/portal/index.js',
    './src/main/resources/static/scss/material-dashboard.scss',
    './src/main/resources/static/scss/portal.scss',
  ],
  // entry: {
  //   main: './src/main/resources/static/js/portal/index.js',
  //   portal: './src/main/resources/static/scss/portal.scss',
  //   dashboard: './src/main/resources/static/scss/material-dashboard.scss',
  // },
  target: 'node', // node_modules
  output: {
    path: __dirname + '/src/main/resources/static/dist',
    filename: '[name].min.js'
  },
  mode: "development",
  plugins,
  module: {
    rules: [
      // https://webpack.js.org/loaders/babel-loader/
      {
        test: /\.js$/i,
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
        // https://github.com/webpack-contrib/sass-loader/
        // https://webpack.js.org/plugins/mini-css-extract-plugin/
        test: /\.s[ac]ss$/i,
        // test: /\.(sa|sc|c)ss$/i,
        use: [
          // devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          // {
          //   loader: 'style-loader',
          //   options: {
          //     sourceMap: true,
          //   }
          // },
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: "/src/main/resources/static/"
            },
          },
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
                includePaths: [
                  // 'src/main/resources/static/scss/',
                  // 'src/main/resources/static/scss/portal.scss',
                  // 'src/main/resources/static/scss/material-dashboard.scss',
                ],
              },
            },
          },
        ]
      }
    ]
  },
  optimization: {
    minimizer: [
      new OptimizeCssAssetsPlugin({
        cssProcessorOptions: {
          map: {
            inline: false,
            annotation: true,
          },
        },
      }),
      // new TerserPlugin({
      //   // Use multi-process parallel running to improve the build speed
      //   // Default number of concurrent runs: os.cpus().length - 1
      //   parallel: true,
      //   // Enable file caching
      //   cache: true,
      //   sourceMap: true,
      // }),
    ],
  },
}
