const { elementDictionary, setElDictItemVisible } = require('./elementDictionary.js');
const { getStarId, setStarId, unsetStarId } = require('./localStorage.js');
const {
  wsPort,
  wsHeaders,
  makeWsMsg,
  parseWsMsg,
} = require('../common/webSocket.js');

const webSocketURL = `ws://${window.location.hostname}:${wsPort}`;
let screens = {};
let els = {};
let webSocket; // = new WebSocket(webSocketURL); // This is just here for autocomplete purposes

const setScreen = (name) => {
  setElDictItemVisible(screens, 'activeScreen', name);
};

const setStartControlsDisabled = (value) => {
  els.createStarBtn.disabled = value;
  els.simulateRoomBtn.disabled = value;
};

// Resets UI elements' behaviors and displays error message
const displayError = (errorMessage) => {
  setStartControlsDisabled(false);
  els.errorMessage.innerHTML = errorMessage;
  els.placeholderBirthStarBtn.onclick = undefined;
  // hangUpWebSocket();
  setScreen('error');
};

const connectionLost = () => displayError('Connection lost.');

// Closes webSocket without invoking connectionLost
const hangUpWebSocket = () => {
  webSocket.removeEventListener('close', connectionLost);
  webSocket.close();
};

// Freshly initializes webSocket to automatically connect to the server
// and send firstMsgHeader and firstMsgData after doing so, invoking
// firstResponseCallback after receiving its first message back from the server,
// a callback which takes that first message as its argument. Also sets connectionLost
// to be invoked upon webSocket being closed unexpectedly.
const initializeWebSocket = (firstMsgHeader, firstMsgData, firstResponseCallback) => {
  webSocket = new WebSocket(webSocketURL);
  webSocket.binaryType = 'arraybuffer';
  webSocket.addEventListener('open', () => {
    webSocket.send(makeWsMsg(firstMsgHeader, firstMsgData));
  });
  webSocket.addEventListener('close', connectionLost);
  const selfRemovingFirstResponseCallback = (firstMessageEvent) => {
    webSocket.removeEventListener('message', selfRemovingFirstResponseCallback);
    firstResponseCallback(firstMessageEvent);
  };
  webSocket.addEventListener('message', selfRemovingFirstResponseCallback);
};

const displayStar = (starData) => {
  els.placeholderUnbornStarDisplay.innerText = JSON.stringify(starData);
  els.placeholderBornStarDisplay.innerText = JSON.stringify(starData);
};

const startBornBehavior = () => {
  setScreen('bornStar');
};

const startUnbornBehavior = () => {
  els.placeholderBirthStarBtn.onclick = () => {
    webSocket.send(makeWsMsg(wsHeaders.webAppToServer.birthStar));
    startBornBehavior();
  };
  setScreen('unbornStar');
};

const init = () => {
  // List of screens that will be seen during gameplay (entering game code, drawing, waiting, etc.)
  screens = elementDictionary([
    'start',
    'personalityQuiz',
    'unbornStar',
    'bornStar',
    'error',
  ], (e) => `${e}Screen`);

  // List of elements that will be interfaced with
  els = elementDictionary([
    'createStarBtn',
    'simulateRoomBtn',
    'placeholderUnbornStarDisplay',
    'placeholderBirthStarBtn',
    'placeholderBornStarDisplay',
    'glowBtn',
    'spinSpeedRange',
    'errorMessage',
    'exitErrorScreenBtn',
  ]);

  // setScreen('personalityQuiz'); // Uncomment this line to debug a specific screen

  const submitQuizResults = () => {
    setStartControlsDisabled(true);
    initializeWebSocket(
      wsHeaders.newClientToServer.joinAsNewStar,
      {
        sampleQuestion: 'Sample Answer',
      },
      (joinResult) => {
        const { header, data } = parseWsMsg(joinResult.data);
        if (header === wsHeaders.serverToWebApp.errorMsg) {
          displayError(data);
          hangUpWebSocket();
        } else if (header === wsHeaders.serverToWebApp.joinSuccess) {
          setStarId(data.id);
          displayStar(data);
          startUnbornBehavior();
        }
      },
    );
  };
  // Final product won't act like this, of course; there will actually be a quiz
  els.createStarBtn.onclick = submitQuizResults;

  els.exitErrorScreenBtn.onclick = () => setScreen('start');

  // Automatically try to join with a previously-existing star ID
  const initialStarId = getStarId();
  if (initialStarId !== null) {
    setStartControlsDisabled(true);
    initializeWebSocket(
      wsHeaders.newClientToServer.joinAsExistingStar,
      initialStarId,
      (joinResult) => {
        const { header, data } = parseWsMsg(joinResult.data);
        if (header === wsHeaders.serverToWebApp.errorMsg) {
          // Automatically joining with the stored star ID failed; start as normal
          unsetStarId();
          setStartControlsDisabled(false);
          hangUpWebSocket();
        } else if (header === wsHeaders.serverToWebApp.joinSuccess) {
          displayStar(data);
          if (data.born) {
            startBornBehavior();
          } else {
            startUnbornBehavior();
          }
        }
      },
    );
  }
};

window.onload = init;
