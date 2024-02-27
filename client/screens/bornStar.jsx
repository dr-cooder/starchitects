const React = require('react');
const { Component } = require('react');
const PropTypes = require('prop-types');
const { BackgroundImage, ScalingSection } = require('../components');
const { blobFilenames, blobs } = require('../preload.js');

class BornStarScreen extends Component {
  constructor(props) {
    super(props);
    const {
      starData,
      onSparkle,
      onTwirl,
      onSupernova,
    } = props;

    this.state = {
      animationInProgress: false,
    };

    const startAnimation = (callback) => () => {
      this.setState({ animationInProgress: true });
      callback();
    };

    this.starData = starData;
    this.onSparkle = startAnimation(onSparkle);
    this.onTwirl = startAnimation(onTwirl);
    this.onSupernova = startAnimation(onSupernova);
    this.animationFinished = () => {
      this.setState({ animationInProgress: false });
    };
  }

  render() {
    return (
    <BackgroundImage
      src={blobs[blobFilenames.tempBG]}
      darkness={0.75}
    >
      <ScalingSection>
        <p>{JSON.stringify(this.starData)}</p>
        <button onClick={this.onSparkle} disabled={this.state.animationInProgress}>
          Sparkle
        </button>
        <button onClick={this.onTwirl} disabled={this.state.animationInProgress}>
          Twirl
        </button>
        <button onClick={this.onSupernova} disabled={this.state.animationInProgress}>
          Supernova
        </button>
      </ScalingSection>
    </BackgroundImage>
    );
  }
}

BornStarScreen.propTypes = {
  starData: PropTypes.object,
  onSparkle: PropTypes.func,
  onTwirl: PropTypes.func,
  onSupernova: PropTypes.func,
};

module.exports = BornStarScreen;
