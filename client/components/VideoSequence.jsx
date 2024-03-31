const React = require('react');
const { Component, createRef } = require('react');
const PropTypes = require('prop-types');
const { prepareVideo, removeAndRewindVideo } = require('../preload.js');
// const { videos } = require('../preload.js');

class VideoSequence extends Component {
  constructor(props) {
    super(props);

    this.divRef = createRef();

    const { videos } = props;
    this.videos = videos;
    const videoCount = videos.length;
    this.videoCount = videoCount;
    // let videoEls = [];
    let ready = true;
    let started = false;
    let currentVideoIndex = -1;
    // Promise.all(videos.map(videoToEl)).then((videoElsReady) => {
    //   videoEls = videoElsReady;
    //   ready = true;
    //   onReady();
    // });
    this.next = () => {
      if (ready) {
        const divRefCurrent = this.divRef.current;
        if (started) {
          removeAndRewindVideo(videos[currentVideoIndex]);
        } else {
          started = true;
        }
        currentVideoIndex++;
        if (currentVideoIndex < videoCount) {
          divRefCurrent.appendChild(prepareVideo(videos[currentVideoIndex]));
        } else {
          ready = false;
        }
      }
    };
  }

  componentWillUnmount() {
    const { videos, videoCount } = this;
    for (let i = 0; i < videoCount; i++) {
      removeAndRewindVideo(videos[i]);
    }
  }

  render() {
    return <div className='videoSequence' ref={this.divRef}></div>;
  }
}

VideoSequence.propTypes = {
  videos: PropTypes.arrayOf(PropTypes.object.isRequired),
  onReady: PropTypes.func,
};

module.exports = VideoSequence;
