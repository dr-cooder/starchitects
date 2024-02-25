const React = require('react');
const { useEffect, useState } = require('react');
const {
  getWebSocketURL,
  wsHeaders,
  makeWsMsg,
  parseWsMsg,
} = require('../../common/webSocket.js');
const { BackgroundImage, ScalingSection } = require('../components');
const { blobFilenames, blobs } = require('../preload.js');

const webSocketURL = getWebSocketURL();

const RoomSimScreen = () => {
  const [latestLog, setLatestLog] = useState('Connecting to server as room...');

  useEffect(() => {
    // The following behavior should be replicated by the Unreal project
    // (global variables and helpers from client.jsx are unused here
    // for better readability/translatability to self-contained C++)

    let joinedSuccessfully = false;
    const webSocket = new WebSocket(webSocketURL);
    webSocket.binaryType = 'arraybuffer';

    webSocket.addEventListener('open', () => {
      webSocket.send(makeWsMsg(wsHeaders.newClientToServer.joinAsRoom));
    });

    webSocket.addEventListener('close', () => {
      setLatestLog('Connection to server was lost!');
    });

    webSocket.addEventListener('message', (message) => {
      const { header, data } = parseWsMsg(message.data);
      if (joinedSuccessfully) {
        switch (header) {
          case wsHeaders.serverToRoom.newStar:
            setLatestLog(`Created a new star: ${JSON.stringify(data)}`);
            break;
          case wsHeaders.serverToRoom.setStarGlow:
            setLatestLog(`Star width ID ${data.id} is ${data.glow ? 'now' : 'no longer'} glowing`);
            break;
          case wsHeaders.serverToRoom.setStarSpinSpeed:
            setLatestLog(`Star with ID ${data.id} is now spinning with speed ${data.spinSpeed}`);
            break;
          default:
        }
      } else {
        switch (header) {
          case wsHeaders.serverToRoom.errorMsg:
            setLatestLog(`Error: ${data}`);
            break;
          case wsHeaders.serverToRoom.allStars:
            setLatestLog(`Successfully joined as room; creating the following stars: ${JSON.stringify(data)}`);
            joinedSuccessfully = true;
            break;
          default:
        }
      }
    });
  }, []);

  return (
    <BackgroundImage
      src={blobs[blobFilenames.tempBG]}
      darkness={0.75}
    >
      <ScalingSection>
        <p>{latestLog}</p>
      </ScalingSection>
    </BackgroundImage>
  );
};

module.exports = RoomSimScreen;
