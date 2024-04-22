require('dotenv').config();

const {
  MONGODB_URI, NODE_ENV, NODE_PORT, PORT, VIDEO_FOLDER,
} = process.env;

const connections = {
  development: {
    http: {
      port: 3000,
    },
    mongo: MONGODB_URI ? `${MONGODB_URI}/Development?retryWrites=true&w=majority&appName=Cluster0` : 'mongodb://127.0.0.1:27017/Starchitects',
    videoFolder: VIDEO_FOLDER || '/videos/',
  },
  production: {
    http: {
      port: PORT || NODE_PORT || 3000,
    },
    mongo: `${MONGODB_URI}/Production?retryWrites=true&w=majority&appName=Cluster0`,
    videoFolder: VIDEO_FOLDER,
  },
};

module.exports = {
  connections: connections[NODE_ENV],
  useHelmet: false, // NODE_ENV === 'production',
  secret: process.env.SECRET,
};
