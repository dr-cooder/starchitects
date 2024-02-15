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
let roomSocket;

// TODO: JSON format validating, alongside parse error handling
const applyBornStarBehavior = (id) => {
  const socket = starSockets[id];
  // const star = stars[id];
  socket.removeAllListeners('message');
  socket.on('message', (rawData) => {
    const { header, data } = parseWsMsg(rawData);
    const webAppToServerHeaders = wsHeaders.webAppToServer;
    switch (header) {
      case webAppToServerHeaders.setStarGlow:
        if (roomSocket) {
          roomSocket.send(makeWsMsg(
            wsHeaders.serverToRoom.setStarGlow,
            { id, glow: data },
          ));
        }
        break;
      case webAppToServerHeaders.setStarSpinSpeed:
        if (roomSocket) {
          roomSocket.send(makeWsMsg(
            wsHeaders.serverToRoom.setStarSpinSpeed,
            { id, spinSpeed: data },
          ));
        }
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
    const { header, data } = parseWsMsg(rawData);
    if (header === wsHeaders.webAppToServer.birthStar) {
      const { primary, secondary, glow } = data;
      star.colors = { primary, secondary, glow };
      if (roomSocket) {
        roomSocket.send(makeWsMsg(
          wsHeaders.serverToRoom.newStar,
          star,
        ));
      }
      applyBornStarBehavior(id);
    } else {
      socket.send(makeWsMsg(wsHeaders.serverToWebApp.errorMsg, 'Expected "birth star" header.'));
    }
  });
};

const joinAsRoom = (socket) => {
  if (roomSocket) {
    socket.send(makeWsMsg(wsHeaders.serverToRoom.errorMsg, 'There is already an active room.'));
  } else {
    roomSocket = socket;
    socket.on('close', () => { roomSocket = undefined; });
    socket.send(makeWsMsg(
      wsHeaders.serverToRoom.allStars,
      Object.values(stars).filter((e) => e.colors),
    ));
    // socket.on('message', ???);
  }
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
    if (existingStar.colors) {
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
    object: 'Toaster',
    shineShape: 'Pentagon',
    position: [0, 0, 0],
  };
  stars[id] = newStar;
  joinAsExistingStar(socket, id);
};

const startGameWebSockets = () => {
  const socketServer = new WebSocketServer({ port: wsPort });
  socketServer.on('connection', (socket) => {
    // Initial message establishes client type, and determines what to do with this new socket
    const handleInitialMessage = (rawData) => {
      const { header, data } = parseWsMsg(rawData);
      const newClientHeaders = wsHeaders.newClientToServer;
      switch (header) {
        case newClientHeaders.joinAsRoom:
          socket.removeEventListener('message', handleInitialMessage);
          joinAsRoom(socket);
          break;
        case newClientHeaders.joinAsNewStar:
          socket.removeEventListener('message', handleInitialMessage);
          joinAsNewStar(socket, data);
          break;
        case newClientHeaders.joinAsExistingStar:
          socket.removeEventListener('message', handleInitialMessage);
          joinAsExistingStar(socket, data);
          break;
        default:
          // Send error but don't disconnect (leave that up to the client)
          socket.send(makeWsMsg(wsHeaders.serverToWebApp.errorMsg, 'Invalid join header.'));
      }
    };
    socket.on('message', handleInitialMessage);
  });
};

module.exports = { startGameWebSockets };
