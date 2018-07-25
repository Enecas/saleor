const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebappWebpackPlugin = require('webapp-webpack-plugin');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const PostcssPresetEnv = require('postcss-preset-env')

const sourceDir = path.join(__dirname, './src/');
const distDir = path.join(__dirname, './dist/');
const devMode = process.env.NODE_ENV !== 'production'

module.exports = {
  watchOptions: {
    poll: true,
  },
  node: {
    fs: 'empty',
  },
  entry: {
    app: `${sourceDir}index.js`,
  },
  output: {
    path: distDir,
    filename: 'js/[name].js',
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env', 'react', 'stage-0'],
          },
        },
      },
      {
        test: /\.css$/,
        use: [
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          { loader: 'css-loader', options: { importLoaders: 1 } },
          { loader: 'postcss-loader', options: {
            ident: 'postcss',
            plugins: () => [
              PostcssPresetEnv({
                stage: 3,
                features: {
                  'nesting-rules': true,
                  'color-mod-function': {
                    unresolved: 'warn'
                  }
                }
              })
            ]
          } }
        ]
      },
      {
        test: /\.woff2?$|\.ttf$|\.eot$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/',
            },
          },
        ],
      },
      {
        test: /\.(gif|jpg|png|svg|)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'images/',
            },
          },
        ],
      },
    ]
  },
  plugins: [
    new CleanWebpackPlugin([distDir]),
    new HtmlWebpackPlugin({
      template: `${sourceDir}index.html`,
      filename: `${distDir}index.html`
    }),
    new MiniCssExtractPlugin({
      filename: devMode ? '[name].css' : '[name].[hash].css',
      chunkFilename: devMode ? '[id].css' : '[id].[hash].css'
    }),
    // PWA plugins
    new WebappWebpackPlugin({
      logo: `${sourceDir}images/logo.svg`,
      prefix: 'images/favicons/',
      favicons: {
        appName: 'Get Saleor',
        appDescription: 'Informations about the Saloer ecommerce',
        display: 'standalone',
        developerURL: null, // prevent retrieving from the nearest package.json
        background: '#ddd',
        theme_color: '#333',
        icons: {
          coast: false,
          yandex: false
        }
      }
    }),
    new SWPrecacheWebpackPlugin({
      cacheId: 'get-saleor',
      filename: 'service-worker.js',
      staticFileGlobsIgnorePatterns: [/\.map$/, /asset-manifest\.json$/],
    })
  ]
};