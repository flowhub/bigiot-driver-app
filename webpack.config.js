const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './webpack.entry.js',
  output: {
    path: __dirname,
    filename: 'dist/app.js',
  },
  mode: 'development',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /noflo([\\]+|\/)lib([\\]+|\/)loader([\\]+|\/)register.js$/,
        use: [
          {
            loader: 'noflo-component-loader',
            options: {
              graph: null,
              debug: true,
              baseDir: __dirname,
              manifest: {
                runtimes: ['noflo'],
                discover: true,
              },
              runtimes: [
                'noflo',
                'noflo-browser',
              ],
            },
          },
        ],
      },
      {
        test: /\.s$/,
        // exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.coffee$/,
        use: [
          {
            loader: 'coffee-loader',
            options: {
              transpile: {
                presets: ['@babel/preset-env'],
              },
            },
          },
        ],
      },
      {
        test: /\.fbp$/,
        use: [
          {
            loader: 'fbp-loader',
          },
        ],
      },
    ],
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: 'assets/*.html',
        to: 'dist/',
        flatten: true,
      },
    ]),
  ],
  resolve: {
    extensions: ['.coffee', '.js'],
  },
  node: {
    child_process: 'empty',
    fs: 'empty',
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    host: process.env.HOST || 'localhost',
    port: 8080,
  },
};
