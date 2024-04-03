const React = require('react');
const { createRef } = require('react');
const { createRoot } = require('react-dom/client');
const { ChangingScreen, Background } = require('./components');
const screens = require('./screens');
const {
  allBlobsFromDoc, assignBlobsToVideosMisc, createImageVideoEls, misc,
} = require('./preload.js');
const { getStarId, setStarId /* , unsetStarId */ } = require('./localStorage.js');
const compositeWorkerManager = require('./compositeWorkerManager.js');
const webSocket = require('./clientWebSocket.js');
const { wsHeaders, makeWsMsg } = require('../common/webSocket.js');
const { preventChildrenFromCalling, starIsBorn } = require('../common/helpers.js');

assignBlobsToVideosMisc(allBlobsFromDoc());
createImageVideoEls();
compositeWorkerManager.init();

// Set rejoin to truthy to affix stars to sessions/tabs rather than browsers via local storage
// (optimal for debugging multiple client instances on one device)
const rejoin = true;
const screenRef = createRef();

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
        webSocket.send(makeWsMsg(
          wsHeaders.newClientToServer.joinAsExistingStar,
          initialStarId,
        ));
        webSocket.onMessage(({ header, data }) => {
          if (header === wsHeaders.serverToWebApp.joinSuccess) {
            if (starIsBorn(data)) {
              compositeWorkerManager.applyStarData(data);
              setAppState.bornStar(data);
            } else {
              compositeWorkerManager.applyStarData(data);
              setAppState.unbornStar(data);
            }
          } else {
            // Automatically joining with the stored star ID failed; start as normal
            // unsetStarId();
            console.warn(`FAILED TO RECONNECT AS STAR OF ID ${initialStarId}: ${data}`);
            webSocket.hangUp();
            setAppState.onboarding();
          }
        });
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
    onSubmit={(quizAnswers) => {
      setScreen();
      webSocket.send(makeWsMsg(
        wsHeaders.newClientToServer.joinAsNewStar,
        quizAnswers,
      ));
      webSocket.onMessage(({ header, data }) => {
        if (header === wsHeaders.serverToWebApp.errorMsg) {
          setAppState.error(data);
          webSocket.hangUp();
        } else if (header === wsHeaders.serverToWebApp.joinSuccess) {
          setStarId(data.id);
          compositeWorkerManager.applyStarData(data);
          setAppState.unbornStar(data);
        }
      });
    }}
  />),
  unbornStar: (starData) => {
    const unbornStarScreenRef = createRef();
    webSocket.onMessage(({ header, data }) => {
      unbornStarScreenRef.current.applyNewName(
        header === wsHeaders.serverToWebApp.newName ? data : null,
      );
    });
    return setScreen(<screens.unbornStar
      ref={unbornStarScreenRef}
      starData={starData}
      onNewNameRequest={() => {
        webSocket.send(makeWsMsg(wsHeaders.webAppToServer.newName));
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
    webSocket.onMessage(({ header }) => {
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
    compositeWorkerManager.stopCompositing();
    return setScreen(<screens.error
      message={message}
      onLeave={setAppState.title}
    />);
  },
  roomSim: () => setScreen(<screens.roomSim/>),
};

webSocket.onError(() => setAppState.error('Connection error.'));

const App = () => (
  <div className='appFadeIn' onAnimationEnd={preventChildrenFromCalling(() => {
    document.querySelector('#loadingStar').remove();
    document.querySelector('#loadingProgress').remove();
    setAppState.title();
    // setAppState.personalityQuiz();
  })}>
    <Background background={
      <img className='background' src={misc.backgroundImg.blob}/>
    }>
      <ChangingScreen ref={screenRef}/>
    </Background>
  </div>
);

// window.onload not necessary - event will have already passed during preload script
createRoot(document.querySelector('#root')).render(<App />);
