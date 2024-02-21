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
    newName: 0,
    birthStar: 1,
    setStarGlow: 2,
    setStarSpinSpeed: 3,
  },
  serverToWebApp: {
    errorMsg: 0,
    newName: 1,
    joinSuccess: 2,
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

// TODO: Catch parsing errors!
const parseWsMsg = (arrayBuffer) => JSON.parse(textDecoder.decode(arrayBuffer));

module.exports = {
  wsPort,
  wsHeaders,
  makeWsMsg,
  parseWsMsg,
};
