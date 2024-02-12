const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

const wsPort = 443;

const wsHeaders = {
  newClientToServer: {
    joinAsRoom: 0,
    joinAsNewStar: 1,
    joinAsExistingStar: 2,
  },
  webAppToServer: {
    birthStar: 0,
    setStarGlow: 1,
    setStarSpinSpeed: 2,
  },
  serverToWebApp: {
    errorMsg: 0,
    joinSuccess: 1,
  },
  serverToRoom: {
    errorMsg: 0,
    allStars: 1,
    newStar: 2,
    setStarGlow: 3,
    setStarSpinSpeed: 4,
  },
};

const makeWsMsg = (header, data) => textEncoder.encode(JSON.stringify({ header, data }));

const parseWsMsg = (arrayBuffer) => JSON.parse(textDecoder.decode(arrayBuffer));

module.exports = {
  wsPort,
  wsHeaders,
  makeWsMsg,
  parseWsMsg,
};
