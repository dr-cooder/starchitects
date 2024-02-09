const express = require('express');
const bodyParser = require('body-parser');
const { startGameWebSockets } = require('./webSocketServer.js');
const htmlHandler = require('./htmlResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', htmlHandler.getIndex);
app.get('/style.css', htmlHandler.getCSS);
app.get('/bundle.js', htmlHandler.getJS);

// Miscellaneous URL's return index
// https://expressjs.com/en/starter/faq.html
app.use(htmlHandler.getIndex);

app.listen(port, () => {
  console.log(`Server listening on 127.0.0.1:${port}`);
});

startGameWebSockets();
