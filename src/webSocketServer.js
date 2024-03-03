const { WebSocketServer } = require('ws');
const {
  wsHeaders,
  makeWsMsg,
  parseWsMsg,
} = require('../common/webSocket.js');

let nextStarId = 0;
const getNextStarId = () => nextStarId++;

// TODO: We obviosuly shouldn't name every star "Starry"
const generateName = () => `Starry ${Math.random()}`;

const stars = {};
const starSockets = {};
let roomSocket;

// TODO: JSON format validating, alongside parse error handling
const applyBornStarBehavior = (id) => {
  const socket = starSockets[id];
  // const star = stars[id];
  socket.removeAllListeners('message');
  socket.on('message', (rawData) => {
    const { header/* , data */ } = parseWsMsg(rawData);
    const webAppToServerHeaders = wsHeaders.webAppToServer;
    const serverToRoomHeaders = wsHeaders.serverToRoom;
    const sendAnimMessage = (serverToRoomHeader, timeoutIfNoRoom) => {
      if (roomSocket) {
        roomSocket.send(makeWsMsg(
          serverToRoomHeader,
          id,
        ));
      } else {
        setTimeout(() => {
          socket.send(makeWsMsg(
            wsHeaders.serverToWebApp.animationFinished,
          ));
        }, timeoutIfNoRoom);
      }
    };
    switch (header) {
      case webAppToServerHeaders.animSparkle:
        sendAnimMessage(serverToRoomHeaders.animSparkle, 1000);
        break;
      case webAppToServerHeaders.animTwirl:
        sendAnimMessage(serverToRoomHeaders.animTwirl, 2000);
        break;
      case webAppToServerHeaders.animSupernova:
        sendAnimMessage(serverToRoomHeaders.animSupernova, 5000);
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
    if (header === wsHeaders.webAppToServer.newName) {
      const newName = generateName();
      star.name = newName;
      socket.send(makeWsMsg(
        wsHeaders.serverToWebApp.newName,
        newName,
      ));
    } else if (header === wsHeaders.webAppToServer.birthStar) {
      const {
        color,
        size,
        shade,
        name,
      } = data;
      Object.assign(star, {
        color,
        size,
        shade,
        name,
      });
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
    socket.on('close', () => {
      roomSocket = undefined;
      console.log('Room disconnected');
    });
    socket.send(makeWsMsg(
      wsHeaders.serverToRoom.allStars,
      // TODO: This assumes color is nullish if and only if the star is unborn;
      // This may change
      Object.values(stars).filter((e) => e.color != null),
    ));
    socket.on('message', (rawData) => {
      const { header, data } = parseWsMsg(rawData);
      if (header === wsHeaders.roomToServer.animationFinished) {
        const starSocket = starSockets[data];
        if (starSocket !== undefined) {
          starSocket.send(makeWsMsg(wsHeaders.serverToWebApp.animationFinished));
        }
      }
    });
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
    socket.on('close', () => {
      starSockets[id] = undefined;
      console.log(`Client of star with ID ${id} disconnected`);
    });
    // TODO: This assumes color is nullish if and only if the star is unborn;
    // This may change
    if (existingStar.color == null) {
      applyUnbornStarBehavior(id);
    } else {
      applyBornStarBehavior(id);
    }
  }
};

const joinAsNewStar = (socket/* , quizAnswers */) => {
  // TODO: Make data (quizAnswers) actually impact the star
  // TODO: Store star in database
  const id = getNextStarId();
  // Parameters initialized in the unborn state
  const newStar = {
    name: generateName(), // String
    id, // Nonnegative int
    shape: 0, // This will be a "Shape ID", a 0-based int (we can agree upon these later)
    // position: [0, 0, 0], // [x, y, z] // DISUSED; UNREAL APP WILL DETERMINE THIS STATEFULLY
    // TO BE INITIALIZED AFTER BIRTH AND SENT TO ROOM ALONGSIDE OTHER PARAMETERS:
    // color, size, shade (floats ranging from 0 to 1)
  };
  stars[id] = newStar;
  joinAsExistingStar(socket, id);
  console.log(`Client of new star with ID ${id} joined`);
};

const startWebSocketServer = (server) => {
  const socketServer = new WebSocketServer({ server });
  socketServer.on('connection', (socket) => {
    // Initial message establishes client type, and determines what to do with this new socket
    const handleInitialMessage = (rawData) => {
      const { header, data } = parseWsMsg(rawData);
      const newClientHeaders = wsHeaders.newClientToServer;
      switch (header) {
        case newClientHeaders.joinAsRoom:
          socket.removeListener('message', handleInitialMessage);
          joinAsRoom(socket);
          console.log('Room joined');
          break;
        case newClientHeaders.joinAsNewStar:
          socket.removeListener('message', handleInitialMessage);
          joinAsNewStar(socket, data);
          break;
        case newClientHeaders.joinAsExistingStar:
          socket.removeListener('message', handleInitialMessage);
          joinAsExistingStar(socket, data);
          console.log(`Client of star with ID ${data} rejoined`);
          break;
        default:
          // Send error but don't disconnect (leave that up to the client)
          socket.send(makeWsMsg(wsHeaders.serverToWebApp.errorMsg, 'Invalid join header.'));
      }
    };
    socket.on('message', handleInitialMessage);
  });
};

module.exports = { startWebSocketServer };
