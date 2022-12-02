import path, { dirname } from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { fileURLToPath } from 'url';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

const filename = fileURLToPath(import.meta.url);
const dirName = dirname(filename);

const isProduction = process.env.NODE_ENV === 'production';

const config = {
  entry: './src/index.js',
  output: {
    path: path.resolve(dirName, 'dist'),
  },
  devServer: {
    open: true,
    host: 'localhost',
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      template: 'index.html',
    }),

  ],
  module: {
    rules: [{
      test: /\.(js|jsx)$/i,
      loader: 'babel-loader',
    }, {
      test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
      type: 'asset',
    }, {
      test: /\.(scss)$/,
      use: [MiniCssExtractPlugin.loader,
        {
          loader: 'css-loader', // translates CSS into CommonJS modules
        }, {
          loader: 'postcss-loader', // Run post css actions
        }, {
          loader: 'sass-loader', // compiles Sass to CSS
        }],
    },
    ],
  },
};

export default () => {
  if (isProduction) {
    config.mode = 'production';
  } else {
    config.mode = 'development';
  }
  return config;
};
