const { WebSocketServer } = require('ws');
const {
  wsPort,
  wsHeaders,
  makeWsMsg,
  parseWsMsg,
} = require('../common/webSocket.js');

let nextStarId = 0;
const getNextStarId = () => nextStarId++;

const stars = {};
const starSockets = {};
// let roomSocket;

const applyBornStarBehavior = (id) => {
  const socket = starSockets[id];
  // const star = stars[id];
  socket.removeAllListeners('message');
  socket.on('message', (rawData) => {
    const { header/* , data */ } = parseWsMsg(rawData);
    const webAppToServerHeaders = wsHeaders.webAppToServer;
    switch (header) {
      case webAppToServerHeaders.setStarGlow:
        // Tell the server
        break;
      case webAppToServerHeaders.setStarSpinSpeed:
        // Tell the server
        break;
      default:
        socket.send(makeWsMsg(wsHeaders.serverToWebApp.errorMsg, 'Unexpected star action header.'));
    }
  });
};

const applyUnbornStarBehavior = (id) => {
  const socket = starSockets[id];
  const star = stars[id];
  socket.removeAllListeners('message');
  socket.on('message', (rawData) => {
    const { header } = parseWsMsg(rawData);
    if (header === wsHeaders.webAppToServer.birthStar) {
      star.born = true;
      // TODO: Send star to room
      applyBornStarBehavior(id);
    } else {
      socket.send(makeWsMsg(wsHeaders.serverToWebApp.errorMsg, 'Expected "birth star" header.'));
    }
  });
};

const joinAsExistingStar = (socket, id) => {
  const existingStar = stars[id];
  if (existingStar === undefined || existingStar.dead) {
    socket.send(makeWsMsg(wsHeaders.serverToWebApp.errorMsg, `No star with ID ${id} exists.`));
  } else if (starSockets[id] !== undefined) {
    socket.send(makeWsMsg(wsHeaders.serverToWebApp.errorMsg, `The star with ID ${id} is already under the control of another web app instance.`));
  } else {
    starSockets[id] = socket;
    socket.send(makeWsMsg(wsHeaders.serverToWebApp.joinSuccess, existingStar));
    socket.on('close', () => { starSockets[id] = undefined; });
    if (existingStar.born) {
      applyBornStarBehavior(id);
    } else {
      applyUnbornStarBehavior(id);
    }
  }
};

const joinAsNewStar = (socket/* , quizAnswers */) => {
  // TODO: Make data (quiz answers) actually impact the star
  // TODO: Store star in database
  const id = getNextStarId();
  const newStar = {
    name: 'Starry',
    id,
    color: 'Red',
    object: 'Toaster',
    shineShape: 'Pentagon',
    born: false,
    position: [0, 0, 0],
  };
  stars[id] = newStar;
  joinAsExistingStar(socket, id);
};

const startGameWebSockets = () => {
  const socketServer = new WebSocketServer({ port: wsPort });
  socketServer.on('connection', (socket) => {
    // Initial message establishes client type, and determines what to do with this new socket
    socket.on('message', (rawData) => {
      const { header, data } = parseWsMsg(rawData);
      const newClientHeaders = wsHeaders.newClientToServer;
      switch (header) {
        case newClientHeaders.joinAsRoom:
          // TODO: This socket will be the room if there is not one already
          break;
        case newClientHeaders.joinAsNewStar:
          joinAsNewStar(socket, data);
          break;
        case newClientHeaders.joinAsExistingStar:
          joinAsExistingStar(socket, data);
          break;
        default:
          // Send error but don't disconnect (leave that up to the client)
          socket.send(makeWsMsg(wsHeaders.serverToWebApp.errorMsg, 'Invalid join header.'));
      }
    });
  });
};

module.exports = { startGameWebSockets };
