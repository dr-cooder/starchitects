const React = require('react');
const { Component, createRef } = require('react');
const PropTypes = require('prop-types');
const { videoToEl } = require('../preload.js');

class ChangingVideo extends Component {
  constructor(props) {
    super(props);

    let currentVideoEl = document.createElement('video');

    this.divRef = createRef();

    this.changeVideo = ({
      video, className, onEnd,
    }) => new Promise((resolve, reject) => {
      const oldVideoEl = currentVideoEl;
      videoToEl({
        video,
        className,
        onEnd,
      }).then((newVideoEl) => {
        oldVideoEl.remove();
        this.divRef.current.appendChild(newVideoEl);
        currentVideoEl = newVideoEl;
        resolve();
      }).catch(reject);
    });
  }

  render() {
    return <div className='changingVideo' ref={this.divRef}></div>;
  }
}

ChangingVideo.propTypes = {
  sources: PropTypes.arrayOf(PropTypes.object.isRequired),
  loop: PropTypes.bool,
};

module.exports = ChangingVideo;
