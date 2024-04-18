const React = require('react');
const {
  Component,
  createRef,
  useEffect,
  useState,
} = require('react');
const PropTypes = require('prop-types');
const { webSocketURL } = require('../clientWebSocket.js');
const { wsHeaders, makeWsMsg, parseWsMsg } = require('../../common/webSocket.js');
const { ScalingSection } = require('../components');
const { setTimeoutBetter } = require('../../common/helpers.js');

// This Star class would be somewhat analogous to the Star blueprint
class Star extends Component {
  constructor(props) {
    super(props);
    const { animateAppearing, starData, onAnimationFinished } = props;

    this.state = {
      currentAnimation: animateAppearing ? 'Appearing' : 'Idle',
      inAnimation: false,
    };

    this.starData = starData;
    this.onAnimationFinished = onAnimationFinished;

    const playAnimation = (name, duration) => () => {
      if (!this.state.inAnimation) {
        setTimeoutBetter(() => {
          this.setState({ currentAnimation: 'Idle', inAnimation: false });
          this.onAnimationFinished();
        }, duration);
        this.setState({ currentAnimation: name, inAnimation: true });
      }
    };

    this.sparkle = playAnimation('Sparkling', 1000);
    this.twirl = playAnimation('Twirling', 2000);
    this.supernova = playAnimation('Going Supernova!', 5000);

    if (animateAppearing) {
      playAnimation('Appearing', 2000)();
    }
  }

  render() {
    return (
      <div>
        <div>{JSON.stringify(this.starData, undefined, 1)}</div>
        <div>{this.state.currentAnimation}</div>
      </div>
    );
  }
}

Star.propTypes = {
  animateAppearing: PropTypes.bool,
  starData: PropTypes.object,
  onAnimationFinished: PropTypes.func,
};

// The useEffect code here would be somewhat analogous to the main manager script
const RoomSimScreen = () => {
  const [latestLog, setLatestLog] = useState('Connecting to server as room...');
  const starRefs = {};
  const [stars, setStars] = useState([]);

  useEffect(() => {
    let joinedSuccessfully = false;
    const webSocket = new WebSocket(webSocketURL);
    webSocket.binaryType = 'arraybuffer';

    const makeNewStar = (starData, animateAppearing = true) => {
      const { id } = starData;
      const starRef = createRef();
      starRefs[id] = starRef;
      const finishedMsg = makeWsMsg(wsHeaders.roomToServer.animationFinished, id);
      const star = <Star
        ref={starRef}
        animateAppearing={animateAppearing}
        starData={starData}
        onAnimationFinished={() => {
          webSocket.send(finishedMsg);
        }
      } />;
      setStars([...stars, star]);
    };

    webSocket.addEventListener('open', () => {
      webSocket.send(makeWsMsg(wsHeaders.newClientToServer.joinAsRoom));
    });

    webSocket.addEventListener('close', () => {
      setLatestLog('Connection to server was lost!');
    });

    webSocket.addEventListener('message', (message) => {
      const { header, data } = parseWsMsg(message.data);
      console.log(header, data);
      if (joinedSuccessfully) {
        switch (header) {
          case wsHeaders.serverToRoom.newStar:
            makeNewStar(data);
            break;
          case wsHeaders.serverToRoom.animSparkle:
            starRefs[data].current.sparkle();
            break;
          case wsHeaders.serverToRoom.animTwirl:
            starRefs[data].current.twirl();
            break;
          case wsHeaders.serverToRoom.animSupernova:
            starRefs[data].current.supernova();
            break;
          default:
        }
      } else {
        switch (header) {
          case wsHeaders.serverToRoom.errorMsg:
            setLatestLog(`Error: ${data}`);
            break;
          case wsHeaders.serverToRoom.allStars:
            setLatestLog('Successfully joined as room');
            for (let i = 0; i < data.length; i++) {
              makeNewStar(data[i], false);
            }
            joinedSuccessfully = true;
            break;
          default:
        }
      }
    });
  }, []);

  return (
    <ScalingSection>
      <div>{latestLog}</div>
      {stars}
    </ScalingSection>
  );
};

module.exports = RoomSimScreen;
