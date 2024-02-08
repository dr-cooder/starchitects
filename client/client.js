const { elementDictionary, setElDictItemVisible } = require('./elementDictionary.js');
const {
  wsPort,
  wsHeaders,
  makeWsMsg,
  parseWsMsg,
} = require('../common/webSocket.js');

const webSocketURL = `ws://${window.location.hostname}:${wsPort}`;
let screens = {};
let els = {};

const setScreen = (name) => {
  setElDictItemVisible(screens, 'activeScreen', name);
};

const init = () => {
  // List of screens that will be seen during gameplay (entering game code, drawing, waiting, etc.)
  screens = elementDictionary([
    'start',
    'personalityQuiz',
    'star',
    'error',
  ], (e) => `${e}Screen`);

  // List of elements that will be interfaced with
  els = elementDictionary([
    'createStarBtn',
    'simulateRoomBtn',
    'placeholderStarDisplay',
    'errorMessage',
    'exitErrorScreenBtn',
  ]);

  // setScreen('personalityQuiz'); // Uncomment this line to debug a specific screen

  const setStartControlsDisabled = (value) => {
    els.createStarBtn.disabled = value;
    els.simulateRoomBtn.disabled = value;
  };

  const connectionLost = () => {
    setStartControlsDisabled(false);
    els.errorMessage.innerHTML = 'Connection lost.';
    setScreen('error');
  };

  const submitQuizResults = () => {
    setStartControlsDisabled(true);

    const webSocket = new WebSocket(webSocketURL);
    webSocket.binaryType = 'arraybuffer';
    webSocket.addEventListener('open', () => {
      webSocket.send(makeWsMsg(wsHeaders.newClient.joinAsNewStar, {
        sampleQuestion: 'Sample Answer',
      }));
    });
    webSocket.addEventListener('close', connectionLost);

    const gotJoinResult = (joinResult) => {
      const { header, data } = parseWsMsg(joinResult.data);
      webSocket.removeEventListener('message', gotJoinResult);
      if (header === wsHeaders.serverToWebApp.errorMsg) {
        setStartControlsDisabled(false);
        els.errorMessage.innerText = data;
        setScreen('error');
        webSocket.removeEventListener('close', connectionLost);
        webSocket.close();
      } else if (header === wsHeaders.serverToWebApp.joinSuccess) {
        els.placeholderStarDisplay.innerText = JSON.stringify(data);
        setScreen('star');
      }
    };
    webSocket.addEventListener('message', gotJoinResult);
  };
  els.createStarBtn.onclick = submitQuizResults; // Final product won't act like this, obviously

  els.exitErrorScreenBtn.onclick = () => setScreen('start');
};

window.onload = init;
