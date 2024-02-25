const path = require('path');
const express = require('express');
const compression = require('compression');
const helmet = require('helmet');
const { startWebSocketServer } = require('./webSocketServer.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;
const staticPath = 'hosted';

const app = express();
// app.disable('etag');

if (process.env.NODE_ENV === 'production') {
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: [
          "'self'",
          'blob:',
        ],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
        ],
        styleSrc: [
          "'self'",
          'https://cdn.jsdelivr.net/',
        ],
        imgSrc: [
          "'self'",
          'blob:',
        ],
        connectSrc: ["'self'"],
        frameSrc: ["'self'"],
      },
    },
  }));
}
app.use('/', express.static(path.resolve(staticPath)));
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
const server = app.listen(port, () => {
  console.log(`Server listening on 127.0.0.1:${port}`);
});

startWebSocketServer(server);
