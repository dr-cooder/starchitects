const { WebSocketServer } = require('ws');
const {
  wsPort,
  wsHeaders,
  makeWsMsg,
  parseWsMsg,
} = require('../common/webSocket.js');

// const stars = {};
// let roomSocket;

const startGameWebSockets = () => {
  const socketServer = new WebSocketServer({ port: wsPort });
  socketServer.on('connection', (socket) => {
    // Initial message establishes client type, and determines what to do with this new socket
    const establishClientType = (rawData) => {
      const { header, data } = parseWsMsg(rawData);
      console.log(data);
      const newClientHeaders = wsHeaders.newClient;
      switch (header) {
        case newClientHeaders.joinAsRoom:
          // This socket will be the room if there is not one already
          break;
        case newClientHeaders.joinAsNewStar:
          // Do the make star thing
          socket.send(makeWsMsg(wsHeaders.serverToWebApp.joinSuccess, {
            name: 'Starry',
            id: 0,
            color: 'Red',
            object: 'Toaster',
            shineShape: 'Pentagon',
          }));
          break;
        case newClientHeaders.joinAsReturningStar:
          // Do the re-attach-socket-to-star thing
          break;
        default:
          // Send error but don't disconnect (leave that up to the client)
          socket.send(makeWsMsg(wsHeaders.serverToWebApp.errorMsg, 'Invalid join header.'));
      }
    };
    socket.on('message', establishClientType);
    socket.on('close', () => console.log('Socket closed'));
  });
};

module.exports = { startGameWebSockets };
