const { WebSocketServer } = require('ws');
const {
  wsHeaders,
  makeWsMsg,
  parseWsMsg,
} = require('../common/webSocket.js');
const { starPrefix, starSuffix } = require('../common/starNames.js');
const { starIsBorn } = require('../common/helpers.js');
const { StarModel } = require('./starModel.js');

const pingFrequency = 5000;

// let nextStarId = 0;
const getNextStarId = Date.now; // () => nextStarId++;

const generateName = () => `${starPrefix[Math.floor(Math.random() * starPrefix.length)]}-${starSuffix[Math.floor(Math.random() * starSuffix.length)]}`;

const stars = {};
const starSockets = {};
let roomSocket;

// TODO: JSON format validating, alongside handling of errors met while parsing
const applyBornStarBehavior = (id) => {
  const socket = starSockets[id];
  // const star = stars[id];
  // socket.removeAllListeners('message');
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
  const unbornListener = async (rawData) => {
    const { header, data } = parseWsMsg(rawData);
    if (header === wsHeaders.webAppToServer.newName) {
      const newName = generateName();
      // update mongoDB
      const result = await StarModel.findByIdAndUpdate(id, { name: newName }, { new: true, runValidators: true });
      star.name = StarModel.toAPI(result).name;
      socket.send(makeWsMsg(
        wsHeaders.serverToWebApp.newName,
        newName,
      ));
    } else if (header === wsHeaders.webAppToServer.birthStar) {
      // TODO: send these whenever the respective customization screen is left

      const update = {
        starColor: data.starColor,
        starShade: data.starShade,
        dustColor: data.dustColor,
        dustShade: data.dustShade,
        birthDate: Date.now(),
        born: true,
      }
      // update mongoDB
      const result = await StarModel.findByIdAndUpdate(id, update, { new: true, runValidators: true });

      Object.assign(star, StarModel.toAPI(result));

      if (roomSocket) {
        roomSocket.send(makeWsMsg(
          wsHeaders.serverToRoom.newStar,
          star,
        ));
      }
      socket.removeListener('message', unbornListener);
      applyBornStarBehavior(id);
    } else {
      socket.send(makeWsMsg(wsHeaders.serverToWebApp.errorMsg, 'Expected "birth star" header.'));
    }
  };
  socket.on('message', unbornListener);
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
      Object.values(stars).filter((star) => { return star.born }),
    ));
    socket.on('message', (rawData) => {
      const { header, data } = parseWsMsg(rawData);
      if (header === wsHeaders.roomToServer.animationFinished) {
        const starSocket = starSockets[data];
        if (starSocket) {
          starSocket.send(makeWsMsg(wsHeaders.serverToWebApp.animationFinished));
        }
      }
    });
    console.log('Room joined');
  }
};

const joinAsExistingStar = (socket, id) => {
  const existingStar = stars[id];
  if (!existingStar || existingStar.dead) {
    socket.send(makeWsMsg(wsHeaders.serverToWebApp.errorMsg, `No star with ID ${id} exists.`));
  } else if (starSockets[id]) {
    socket.send(makeWsMsg(wsHeaders.serverToWebApp.errorMsg, `The star with ID ${id} is already under the control of another web app instance.`));
  } else {
    starSockets[id] = socket;
    socket.send(makeWsMsg(wsHeaders.serverToWebApp.joinSuccess, existingStar));
    socket.on('close', () => {
      starSockets[id] = undefined;
      console.log(`Client of star with ID ${id} disconnected`);
    });
    if (existingStar.born) {
      //if (starIsBorn(existingStar)) {
      applyBornStarBehavior(id);
    } else {
      applyUnbornStarBehavior(id);
    }
    console.log(`Client of star with ID ${id} rejoined`);
  }
};

const joinAsNewStar = async (socket/* , quizAnswers */) => {
  // TODO: Make data (quizAnswers) actually impact the star

  // Parameters initialized in the unborn state
  const newStarData = {
    name: generateName(), // String
    shape: 0, // "Shape ID" - int ranging from 0 to 7 inclusive
    // (see "Objects" section of "Show your shine" FigJam)
    starColor: Math.random(),
    starShade: Math.random(),
    dustColor: Math.random(),
    dustShade: Math.random(),
    dustType: 0, // "Dust Type ID" - nonnegative int like shape,
    // but otherwise not fully decided upon as per my current knowledge
    // TO BE INITIALIZED AFTER BIRTH AND SENT TO ROOM ALONGSIDE OTHER PARAMETERS:
    // birthDate (Unix timestamp (miliseconds))
  };

  // Store star in database
  const newStar = new StarModel(newStarData);
  await newStar.save();
  const starObj = StarModel.toAPI(newStar);
  // console.log(starObj);

  const id = starObj.id;

  stars[id] = newStar;
  joinAsExistingStar(socket, id);
  console.log(`Client of new star with ID ${id} joined`);
};

// Circumvention of Heroku automatically closing any web socket
// that has seen no activity for 55 seconds
const pingAllSockets = () => {
  const webAppPingMsg = makeWsMsg(wsHeaders.serverToWebApp.ping);
  Object.values(starSockets).forEach((socket) => {
    if (socket) {
      socket.send(webAppPingMsg);
    }
  });
  if (roomSocket) {
    roomSocket.send(makeWsMsg(wsHeaders.serverToRoom.ping));
  }
  setTimeout(pingAllSockets, pingFrequency);
};

const startWebSocketServer = async (server) => {
  // TODO: load pre-existing stars
  const preBornStars = await StarModel.getBornStars();
  preBornStars.map((star) => {
    stars[star.id] = star;
  });

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
          break;
        case newClientHeaders.joinAsNewStar:
          socket.removeListener('message', handleInitialMessage);
          joinAsNewStar(socket, data);
          break;
        case newClientHeaders.joinAsExistingStar:
          socket.removeListener('message', handleInitialMessage);
          joinAsExistingStar(socket, data);
          break;
        default:
          // Send error but don't disconnect (leave that up to the client)
          socket.send(makeWsMsg(wsHeaders.serverToWebApp.errorMsg, 'Invalid join header.'));
      }
    };
    socket.on('message', handleInitialMessage);
  });
  pingAllSockets();
};

module.exports = { startWebSocketServer };
