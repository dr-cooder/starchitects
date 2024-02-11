const path = require('path');

module.exports = {
  entry: './client/client.jsx',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            sourceType: 'unambiguous',
            presets: [
              '@babel/preset-env',
              ['@babel/preset-react', { runtime: 'automatic' }],
            ],
          },
        },
      },
    ],
  },
  mode: 'production',
  watchOptions: {
    aggregateTimeout: 200,
  },
  output: {
    path: path.resolve(__dirname, 'hosted'),
    filename: 'bundle.js',
  },
};
