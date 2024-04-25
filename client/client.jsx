const React = require('react');
const { createRef } = require('react');
const { createRoot } = require('react-dom/client');
const { ChangingScreen, Background } = require('./components');
const screens = require('./screens');
const {
  preloadInfoFromDoc, assignPreloadInfoToVideosImagesMisc, createImageVideoEls, misc,
} = require('./preload.js');
const { getStarId, setStarId, unsetStarId } = require('./localStorage.js');
const compositeWorkerManager = require('./compositeWorkerManager.js');
const webSocket = require('./clientWebSocket.js');
const { wsHeaders, makeWsMsg } = require('../common/webSocket.js');
const { setTimeoutBetter, starIsBorn } = require('../common/helpers.js');

// TODO: Centralize these durations in a single js file consistent with animations.css
const appFadeInDuration = 150;

assignPreloadInfoToVideosImagesMisc(preloadInfoFromDoc());
createImageVideoEls().then(() => {
  compositeWorkerManager.init();

  // Set rejoin to truthy to affix stars to sessions/tabs rather than browsers via local storage
  // (optimal for debugging multiple client instances on one device)
  // TODO: REJOIN SHOULD BE TRUE BY THE TIME OF PRESENTATION
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
      onSimulateRoom={setAppState.roomSim} // TODO: remove once Unreal app has this functionality
      onSkipQuiz={(answers) => setAppState.submittingQuizAnswers(answers)}
    />),
    personalityQuiz: () => setScreen(<screens.personalityQuiz
      onSubmit={setAppState.submittingQuizAnswers}
    />),
    submittingQuizAnswers: (quizAnswers) => {
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
    },
    unbornStar: (starData) => {
      const {
        webAppToServer: {
          newName: newNameHeader,
          birthStar: birthStarHeader,
          updateStarColor: updateStarColorHeader,
          updateDustType: updateDustTypeHeader,
          updateDustColor: updateDustColorHeader,
        },
        serverToWebApp: {
          newName: newNameReceivedHeader,
        },
      } = wsHeaders;
      const unbornStarScreenRef = createRef();
      webSocket.onMessage(({ header, data }) => {
        const name = header === newNameReceivedHeader ? data : null;
        Object.assign(starData, { name });
        unbornStarScreenRef.current.applyNewName(
          name,
        );
      });
      return setScreen(<screens.unbornStar
        ref={unbornStarScreenRef}
        starData={starData}
        onStarColorUpdate={({ starColor, starShade }) => {
          Object.assign(starData, { starColor, starShade });
          webSocket.send(makeWsMsg(updateStarColorHeader, { starColor, starShade }));
        }}
        onDustTypeUpdate={(dustType) => {
          Object.assign(starData, { dustType });
          webSocket.send(makeWsMsg(updateDustTypeHeader, dustType));
        }}
        onDustColorUpdate={({ dustColor, dustShade }) => {
          Object.assign(starData, { dustColor, dustShade });
          webSocket.send(makeWsMsg(updateDustColorHeader, { dustColor, dustShade }));
        }}
        onNewNameRequest={() => {
          webSocket.send(makeWsMsg(newNameHeader));
        }}
        onSwipeStarUp={() => {
          webSocket.send(makeWsMsg(birthStarHeader));
        }}
        onWitnessJoinFinished={() => {
          setAppState.bornStar(starData);
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
        onConfirmRestart={() => {
          // webSocket.send(makeWsMsg(wsHeaders.webAppToServer.kill));
          unsetStarId();
          setAppState.title();
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
    roomSim: () => setScreen(<screens.roomSim />),
  };

  webSocket.onError(() => setAppState.error('Connection error.'));

  const App = () => (
    <div className='appFadeIn'>
      <Background background={
        // TODO: DRY class for images; they are all non-draggable and
        // get their src from a misc preloaded item's blob
        <img draggable={false} className='background' src={misc.backgroundImg.blob} />
      }>
        <ChangingScreen ref={screenRef} />
      </Background>
    </div>
  );

  // window.onload not necessary - event will have already passed during preload script
  createRoot(document.querySelector('#root')).render(<App />);
  setTimeoutBetter(() => {
    document.querySelector('#loadingStar').remove();
    document.querySelector('#loadingProgressOuter').remove();
    setAppState.title();
    // setAppState.personalityQuiz();
  }, appFadeInDuration);
});
