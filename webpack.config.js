let path = require('path');
let source_dir = path.join(__dirname, '/client/src');
let public_dir = path.join(__dirname, '/public');

module.exports = {
  entry: `${source_dir}/index.jsx`,
  output: {
    filename: `bundle.js`,
    path: `${public_dir}`
  },
  module: {
    rules: [
      {
        test: /\.jsx?/,
        include: source_dir,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ["@babel/preset-react", "@babel/preset-env"]
          }
        }
      }
    ]
  }
};