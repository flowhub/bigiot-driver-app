const path = require('path');

const CopyWebpackPlugin = require('copy-webpack-plugin');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');

const PUBLIC_PATH = 'https://flowhub.github.io/bigiot-driver-app/';

module.exports = {
  entry: {
    app: './app.js',
    test: './node_modules/noflo-runtime-headless/spec/build/webpack.entry.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: PUBLIC_PATH,
    filename: '[name].js',
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
        flatten: true,
      },
      {
        from: 'assets/*.css',
        flatten: true,
      },
      {
        from: 'node_modules/leaflet/dist/*.css',
        to: 'vendor/leaflet/',
        flatten: true,
      },
    ]),
    new SWPrecacheWebpackPlugin({
      cacheId: 'flowhub-bigiot-driver-app-cache-id',
      dontCacheBustUrlsMatching: /\.\w{8}\./,
      filename: 'service-worker.js',
      minify: true,
      navigateFallback: `${PUBLIC_PATH}index.html`,
      staticFileGlobsIgnorePatterns: [/\.map$/, /manifest\.json$/],
    }),
    new WebpackPwaManifest({
      name: 'Park My Car',
      short_name: 'ParkMyCar',
      description: 'Find a parking spot nearby',
      background_color: '#0275E8',
      theme_color: '#0275E8',
      start_url: '/',
      icons: [
        {
          src: path.resolve('assets/appicon.png'),
          sizes: [96, 128, 192, 256, 384, 512],
          destination: path.join('icons'),
        },
      ],
      inject: false,
      fingerprints: false,
    }),
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
    inline: true,
  },
};
