const React = require('react');
const { createRef } = require('react');
const { createRoot } = require('react-dom/client');
const { ChangingScreen, BackgroundImage } = require('./components');
const screens = require('./screens');
const {
  blobFilenames, blobs, allBlobsFromDoc, assignToBlobsImages,
} = require('./preload.js');
const { getStarId, setStarId /* , unsetStarId */ } = require('./localStorage.js');
const compositeWorkerManager = require('./compositeWorkerManager.js');
const {
  getWebSocketURL, wsHeaders, makeWsMsg, parseWsMsg,
} = require('../common/webSocket.js');
const { preventChildrenFromCalling, starIsBorn } = require('../common/helpers.js');

assignToBlobsImages(allBlobsFromDoc());
compositeWorkerManager.init();

// Set rejoin to truthy to affix stars to sessions/tabs rather than browsers via local storage
// (optimal for debugging multiple client instances on one device)
const rejoin = true;
const webSocketURL = getWebSocketURL();
const screenRef = createRef();
let webSocket; // = new WebSocket(webSocketURL); // This is just here for autocomplete purposes
let connectionLost;

// Ignores pings
const uponNextMessage = (callback) => {
  const selfRemovingFirstResponseCallback = (firstMessageEvent) => {
    if (firstMessageEvent.data.header !== wsHeaders.serverToWebApp.ping) {
      webSocket.removeEventListener('message', selfRemovingFirstResponseCallback);
      callback(firstMessageEvent);
    }
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
  title: () => setScreen(<screens.title
    onAnimationEnd={() => {
      // setAppState.unbornStar({ shape: 0 });
      // return;
      const initialStarId = rejoin ? getStarId() : null;
      if (initialStarId !== null) {
        initializeWebSocket(
          wsHeaders.newClientToServer.joinAsExistingStar,
          initialStarId,
          (joinResult) => {
            const { header, data } = parseWsMsg(joinResult.data);
            if (header === wsHeaders.serverToWebApp.errorMsg) {
              // Automatically joining with the stored star ID failed; start as normal
              // unsetStarId();
              console.warn(`FAILED TO RECONNECT AS STAR OF ID ${initialStarId}: ${data}`);
              hangUpWebSocket();
              setAppState.onboarding();
            } else if (header === wsHeaders.serverToWebApp.joinSuccess) {
              if (starIsBorn(data)) {
                compositeWorkerManager.applyStarData(data);
                setAppState.bornStar(data);
              } else {
                compositeWorkerManager.applyStarData(data);
                setAppState.unbornStar(data);
              }
            }
          },
        );
      } else {
        setAppState.onboarding();
      }
    }}
  ></screens.title>),
  onboarding: () => setScreen(<screens.onboarding
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
            compositeWorkerManager.applyStarData(data);
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
      onNewNameRequest={() => {
        webSocket.send(makeWsMsg(wsHeaders.webAppToServer.newName));
        uponNextMessage((event) => {
          const { header, data } = parseWsMsg(event.data);
          if (header === wsHeaders.serverToWebApp.errorMsg) {
            setAppState.error(data);
            hangUpWebSocket();
          } else if (header === wsHeaders.serverToWebApp.newName) {
            unbornStarScreenRef.current.applyNewName(data);
          } else {
            unbornStarScreenRef.current.applyNewName();
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
  error: (message) => {
    compositeWorkerManager.stopVid();
    return setScreen(<screens.error
      message={message}
      onLeave={setAppState.title}
    />);
  },
  roomSim: () => setScreen(<screens.roomSim/>),
};

connectionLost = () => setAppState.error('Connection lost.');

const App = () => (
  <div className='appFadeIn' onAnimationEnd={preventChildrenFromCalling(() => {
    document.querySelector('#loadingStar').remove();
    document.querySelector('#loadingProgress').remove();
    setAppState.title();
  })}>
    <BackgroundImage src={blobs[blobFilenames.tempBG]}>
      <ChangingScreen ref={screenRef}/>
    </BackgroundImage>
  </div>
);

// window.onload not necessary - event will have already passed during preload script
createRoot(document.querySelector('#root')).render(<App />);
