const { Queue } = require('../common/helpers.js');
const {
  wsHeaders: { serverToWebApp: { ping: pingHeader } },
  parseWsMsg,
} = require('../common/webSocket.js');

const webSocketStates = {
  closed: 0,
  connecting: 1,
  open: 2,
};

// https://stackoverflow.com/questions/19754922/why-wont-my-app-establish-websocket-connection-on-heroku
const webSocketURL = window.origin.replace(/^http/, 'ws');
let webSocket;
let webSocketState = webSocketStates.closed;
const messageQueue = new Queue();

const hangUp = () => {
  const { closed } = webSocketStates;
  if (webSocketState !== closed) {
    messageQueue.empty();
    webSocket.onopen = undefined;
    webSocket.onmessage = undefined;
    webSocket.onclose = undefined;
    webSocket = undefined;
    webSocketState = closed;
  }
};

let onErrorCurrent;
const onError = (callback) => {
  onErrorCurrent = callback || (() => {});
};
onError();

const send = (message) => {
  const { closed, connecting, open } = webSocketStates;
  if (webSocketState === open) {
    webSocket.send(message);
  } else {
    messageQueue.enqueue(message);
    if (webSocketState === closed) {
      webSocketState = connecting;
      webSocket = new WebSocket(webSocketURL);
      webSocket.binaryType = 'arraybuffer';
      webSocket.onopen = () => {
        webSocket.onopen = undefined;
        webSocketState = open;
        while (messageQueue.isNotEmpty) {
          webSocket.send(messageQueue.dequeue());
        }
      };
      webSocket.onclose = () => {
        onErrorCurrent();
        hangUp();
      };
    }
  }
};

const onMessage = (callback) => {
  if (webSocketState !== webSocketStates.closed) {
    webSocket.onmessage = (event) => {
      const { header, data } = parseWsMsg(event.data);
      if (header !== pingHeader) {
        callback({ header, data });
      }
    };
  }
};

module.exports = {
  webSocketURL, onMessage, onError, send, hangUp,
};
