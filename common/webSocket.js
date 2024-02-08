const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

const wsPort = 443;

const wsHeaders = {
  newClient: {
    joinAsRoom: 0,
    joinAsNewStar: 1,
    joinAsReturningStar: 2,
  },
  serverToWebApp: {
    errorMsg: 0,
    joinSuccess: 1,
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
