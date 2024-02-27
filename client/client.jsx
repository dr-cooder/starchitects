const React = require('react');
const { createRef } = require('react');
const { createRoot } = require('react-dom/client');
const { AnimatedChangingScreen } = require('./components');
const screens = require('./screens');
const { getStarId, setStarId, unsetStarId } = require('./localStorage.js');
const {
  getWebSocketURL,
  wsHeaders,
  makeWsMsg,
  parseWsMsg,
} = require('../common/webSocket.js');

// Set rejoin to truthy to affix stars to sessions/tabs rather than browsers via local storage
// (optimal for debugging multiple client instances on one device)
const rejoin = false;
const webSocketURL = getWebSocketURL();
const screenRef = createRef();
let webSocket; // = new WebSocket(webSocketURL); // This is just here for autocomplete purposes
let connectionLost;

const uponNextMessage = (callback) => {
  const selfRemovingFirstResponseCallback = (firstMessageEvent) => {
    webSocket.removeEventListener('message', selfRemovingFirstResponseCallback);
    callback(firstMessageEvent);
  };
  webSocket.addEventListener('message', selfRemovingFirstResponseCallback);
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
  uponNextMessage(firstResponseCallback);
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
  unbornStar: (starData) => {
    const unbornStarScreenRef = createRef();
    return setScreen(<screens.unbornStar
      ref={unbornStarScreenRef}
      starData={starData}
      onNewName={() => {
        webSocket.send(makeWsMsg(wsHeaders.webAppToServer.newName));
        uponNextMessage((event) => {
          const { header, data } = parseWsMsg(event.data);
          if (header === wsHeaders.serverToWebApp.errorMsg) {
            setAppState.error(data);
            hangUpWebSocket();
          } else if (header === wsHeaders.serverToWebApp.newName) {
            unbornStarScreenRef.current.applyNewName(data);
          }
        });
      }}
      onSwipeStarUp={(customization) => {
        const bornStarData = starData; // JSON.parse(JSON.stringify(starData));
        Object.assign(bornStarData, customization);
        // Can't edit function parameters as per ESLint rules, but
        // mutating starData via a shallow copy shouldn't be an issue
        webSocket.send(makeWsMsg(wsHeaders.webAppToServer.birthStar, customization));
        setAppState.bornStar(bornStarData);
      }}
    />);
  },
  bornStar: (starData) => {
    const bornStarScreenRef = createRef();
    webSocket.addEventListener('message', (event) => {
      const { header } = parseWsMsg(event.data);
      if (header === wsHeaders.serverToWebApp.animationFinished) {
        bornStarScreenRef.current.animationFinished();
      }
    });
    return setScreen(<screens.bornStar
      ref={bornStarScreenRef}
      starData={starData}
      onSparkle={() => {
        webSocket.send(makeWsMsg(wsHeaders.webAppToServer.animSparkle));
      }}
      onTwirl={() => {
        webSocket.send(makeWsMsg(wsHeaders.webAppToServer.animTwirl));
      }}
      onSupernova={() => {
        webSocket.send(makeWsMsg(wsHeaders.webAppToServer.animSupernova));
      }}
    />);
  },
  error: (message) => setScreen(<screens.error
    message={message}
    onLeave={setAppState.start}
  />),
  roomSim: () => setScreen(<screens.roomSim/>),
};

connectionLost = () => setAppState.error('Connection lost.');

const init = () => {
  const root = createRoot(document.querySelector('#root'));
  root.render(<AnimatedChangingScreen
    ref={screenRef}
    initialScreen={<screens.loading
      onLoad={() => {
        const initialStarId = rejoin ? getStarId() : null;
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
        } else {
          setAppState.start();
        }
      }}
    />}
  />);
};

window.onload = init;
