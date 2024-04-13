const React = require('react');
const { Component, createRef } = require('react');
const PropTypes = require('prop-types');
const { prepareVideo, hideAndRewindVideo, removeAndRewindVideo } = require('../preload.js');
// const { videos } = require('../preload.js');

class VideoSequence extends Component {
  constructor(props) {
    super(props);

    this.divRef = createRef();

    const { videos } = props;
    // this.onReady = () => {
    //   this.ready = true;
    //   onReady();
    // };
    this.videos = videos;
    const videoCount = videos.length;
    this.videoCount = videoCount;
    // let videoEls = [];
    this.ready = true;
    let started = false;
    let currentVideoIndex = -1;
    // Promise.all(videos.map(videoToEl)).then((videoElsReady) => {
    //   videoEls = videoElsReady;
    //   ready = true;
    //   onReady();
    // });
    this.next = () => {
      if (this.ready) {
        // const divRefCurrent = this.divRef.current;
        const previousVideoIndex = currentVideoIndex;
        if (started) {
          hideAndRewindVideo(videos[previousVideoIndex]);
        } else {
          started = true;
        }
        currentVideoIndex++;
        if (currentVideoIndex < videoCount) {
          prepareVideo(videos[currentVideoIndex]);
        } else {
          this.ready = false;
        }
      }
    };
  }

  componentDidMount() {
    const {
      divRef: { current: divRefCurrent }, videoCount, videos,
    } = this;
    for (let i = 0; i < videoCount; i++) {
      const { el } = videos[i];
      divRefCurrent.appendChild(el);
      el.load();
    }
  }

  componentWillUnmount() {
    const { videoCount, videos } = this;
    for (let i = 0; i < videoCount; i++) {
      removeAndRewindVideo(videos[i]);
    }
  }

  render() {
    return <div className='videoSequence' ref={this.divRef}></div>;
  }
}

VideoSequence.propTypes = {
  // onReady: PropTypes.func,
  videos: PropTypes.arrayOf(PropTypes.object.isRequired),
};

module.exports = VideoSequence;
