let path = require('path');
let source_dir = path.join(__dirname, '/client/src');
let public_dir = path.join(__dirname, '/public');
var BrotliPlugin = require('brotli-webpack-plugin');

module.exports = {
  entry: `${source_dir}/index.jsx`,
  output: {
    filename: `bundle.js`,
    path: `${public_dir}`,
  },
  plugins: [
    new BrotliPlugin({
      asset: '[path].br[query]',
      test: /\.(js|css|html|svg)$/,
      threshold: 10240,
      minRatio: 0.8,
    }),
  ],
  module: {
    rules: [
      {
        test: /\.jsx?/,
        include: source_dir,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react', '@babel/preset-env'],
          },
        },
      },
    ],
  },
  node: {
    fs: 'empty',
  },
};
