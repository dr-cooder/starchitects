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
    updateStarColor: 5,
    updateDustType: 6,
    updateDustColor: 7,
  },
  serverToWebApp: {
    errorMsg: 0,
    newName: 1,
    joinSuccess: 2,
    animationFinished: 3,
    ping: 4,
  },
  serverToRoom: {
    errorMsg: 0,
    allStars: 1,
    newStar: 2,
    animSparkle: 3,
    animTwirl: 4,
    animSupernova: 5,
    ping: 6,
  },
  roomToServer: {
    animationFinished: 0,
  },
};

const makeWsMsg = (header, data) => JSON.stringify({ header, data });

// TODO: Catch parsing errors!
const parseWsMsg = (arrayBuffer) => JSON.parse(arrayBuffer);

module.exports = {
  wsHeaders,
  makeWsMsg,
  parseWsMsg,
};
