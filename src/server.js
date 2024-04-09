const path = require('path');
const express = require('express');
const compression = require('compression');
const helmet = require('helmet');
const favicon = require('serve-favicon');
const mongoose = require('mongoose');
const { startWebSocketServer } = require('./webSocketServer.js');

mongoose.set('debug', false);

const config = require('./config.js');

const staticPath = 'hosted';
const faviconPath = 'client/favicon.png';

mongoose.connect(config.connections.mongo)
  .then(() => {
    console.log('Connected to mongoDB database!');
  }).catch((err) => {
    if (err) {
      console.log('Could not connect to mongoDB database');
      throw err;
    }
  });

const app = express();
// app.disable('etag');

if (config.useHelmet) {
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: [
          "'self'",
          'blob:',
          'https://storage.googleapis.com/',
        ],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          'blob:',
        ],
        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          'blob:',
        ],
        imgSrc: [
          "'self'",
          'blob:',
          'https://storage.googleapis.com/',
        ],
        connectSrc: [
          "'self'",
          'https://cdn.jsdelivr.net/',
          'https://storage.googleapis.com/',
        ],
        frameSrc: ["'self'"],
        fontSrc: [
          "'self'",
          'blob:',
        ],
      },
    },
  }));
}
app.use('/', express.static(path.resolve(staticPath)));
app.use(favicon(path.resolve(faviconPath)));
app.get('/video-folder', (req, res) => {
  res.status(200).type('txt').send(config.connections.videoFolder);
});
// https://stackoverflow.com/questions/6528876/how-to-redirect-404-errors-to-a-page-in-expressjs
app.get('*', (req, res) => {
  res.status(404);
  if (req.accepts('html')) {
    res.sendFile(path.resolve('hosted/index.html'));
  } else {
    const { url } = req;
    if (req.accepts('json')) {
      res.json({ error: `${url} was not found` });
    } else {
      res.type('txt').send(`${url} was not found`);
    }
  }
});
app.use(compression);

// https://stackoverflow.com/questions/42472726/websockets-express-js-and-can-t-establish-a-connection-to-the-server
const server = app.listen(config.connections.http.port, () => {
  console.log(`Server listening on 127.0.0.1:${config.connections.http.port}`);
});

startWebSocketServer(server);
