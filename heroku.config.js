const path = require('path');

module.exports = {
  entry: './client/client.jsx',
  mode: 'production',
  output: {
    path: path.resolve(__dirname, 'hosted'),
    filename: 'bundle.js',
  },
};
