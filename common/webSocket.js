// const textEncoder = new TextEncoder();
// const textDecoder = new TextDecoder();

// https://stackoverflow.com/questions/19754922/why-wont-my-app-establish-websocket-connection-on-heroku
const getWebSocketURL = () => window.origin.replace(/^http/, 'ws');

const wsHeaders = {
  newClientToServer: {
    joinAsRoom: 0,
    joinAsNewStar: 1,
    joinAsExistingStar: 2,
  },
  webAppToServer: {
    newName: 0,
    birthStar: 1,
    animSparkle: 2,
    animTwirl: 3,
    animSupernova: 4,
  },
  serverToWebApp: {
    errorMsg: 0,
    newName: 1,
    joinSuccess: 2,
    animationFinished: 3,
  },
  serverToRoom: {
    errorMsg: 0,
    allStars: 1,
    newStar: 2,
    animSparkle: 3,
    animTwirl: 4,
    animSupernova: 5,
  },
  roomToServer: {
    animationFinished: 0,
  },
};

const makeWsMsg = (header, data) => JSON.stringify({ header, data });

// TODO: Catch parsing errors!
const parseWsMsg = (arrayBuffer) => JSON.parse(arrayBuffer);

module.exports = {
  getWebSocketURL,
  wsHeaders,
  makeWsMsg,
  parseWsMsg,
};
