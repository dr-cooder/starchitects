const React = require('react');
const { createRef } = require('react');
const { createRoot } = require('react-dom/client');
const { AnimatedChangingScreen } = require('./components');
const screens = require('./screens');
const { getStarId, setStarId, unsetStarId } = require('./localStorage.js');
const {
  wsPort,
  wsHeaders,
  makeWsMsg,
  parseWsMsg,
} = require('../common/webSocket.js');

// Set rejoin to null to affix stars to sessions/tabs rather than browsers via local storage
// (optimal for debugging multiple client instances on one device), otherwise set to non-nullish
const rejoin = null;
const webSocketURL = `ws://${window.location.hostname}:${wsPort}`;
const screenRef = createRef();
let webSocket; // = new WebSocket(webSocketURL); // This is just here for autocomplete purposes
let connectionLost;

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

// Closes webSocket without invoking connectionLost
const hangUpWebSocket = () => {
  webSocket.removeEventListener('close', connectionLost);
  webSocket.close();
};

const setScreen = (screen) => {
  if (screenRef.current) screenRef.current.changeScreen(screen);
  return screen;
};

// Self-referencing set of app states and their behaviors
const setAppState = {
  start: () => setScreen(<screens.start
    onCreateStar={setAppState.personalityQuiz}
    onSimulateRoom={setAppState.roomSim} // TODO: remove this once Unreal app has this functionality
  />),
  personalityQuiz: () => setScreen(<screens.personalityQuiz
    questions='(Pretend there are questions here)'
    onSubmit={(quizAnswers) => {
      setScreen();
      initializeWebSocket(
        wsHeaders.newClientToServer.joinAsNewStar,
        quizAnswers,
        (joinResult) => {
          const { header, data } = parseWsMsg(joinResult.data);
          if (header === wsHeaders.serverToWebApp.errorMsg) {
            setAppState.error(data);
            hangUpWebSocket();
          } else if (header === wsHeaders.serverToWebApp.joinSuccess) {
            setStarId(data.id);
            setAppState.unbornStar(data);
          }
        },
      );
    }}
  />),
  unbornStar: (starData) => setScreen(<screens.unbornStar
    starData={starData}
    onSwipeStarUp={() => {
      webSocket.send(makeWsMsg(wsHeaders.webAppToServer.birthStar));
      setAppState.bornStar(starData);
    }}
  />),
  bornStar: (starData) => setScreen(<screens.bornStar
    starData={starData}
    onSetStarGlow={(value) => {
      webSocket.send(makeWsMsg(wsHeaders.webAppToServer.setStarGlow, value));
    }}
    onSetStarSpinSpeed={(value) => {
      webSocket.send(makeWsMsg(wsHeaders.webAppToServer.setStarSpinSpeed, value));
    }}
  />),
  error: (message) => setScreen(<screens.error
    message={message}
    onLeave={setAppState.start}
  />),
  roomSim: () => setScreen(<screens.roomSim/>),
};

connectionLost = () => setAppState.error('Connection lost.');

const init = () => {
  // Automatically try to join with a previously-existing star ID
  const initialStarId = rejoin && getStarId();
  if (initialStarId !== null) {
    initializeWebSocket(
      wsHeaders.newClientToServer.joinAsExistingStar,
      initialStarId,
      (joinResult) => {
        const { header, data } = parseWsMsg(joinResult.data);
        if (header === wsHeaders.serverToWebApp.errorMsg) {
          // Automatically joining with the stored star ID failed; start as normal
          unsetStarId();
          hangUpWebSocket();
          setAppState.start();
        } else if (header === wsHeaders.serverToWebApp.joinSuccess) {
          if (data.born) {
            setAppState.bornStar(data);
          } else {
            setAppState.unbornStar(data);
          }
        }
      },
    );
  }

  const root = createRoot(document.querySelector('#root'));
  root.render(<AnimatedChangingScreen
    ref={screenRef}
    initialScreen={!initialStarId && setAppState.start()}
  />);
};

window.onload = init;
