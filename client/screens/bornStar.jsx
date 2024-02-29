const React = require('react');
const { Component } = require('react');
const PropTypes = require('prop-types');
const { BackgroundImage, ScalingSection } = require('../components');
const { blobFilenames, blobs } = require('../preload.js');
const { unitsHorizontalInner, unitsVerticalInner } = require('../scalingMeasurements.js');

const buttonHeight = 40;
const buttonSpacing = 24;

const buttonTop = unitsVerticalInner - buttonHeight;
const buttonWidth = (unitsHorizontalInner - buttonSpacing * 2) / 3;
const middleButtonOffset = buttonWidth + buttonSpacing;
const rightButtonOffset = middleButtonOffset * 2;

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
      <ScalingSection
        heightUnits={buttonTop}
        heightFreeSpace={1}
      >
        <p>{JSON.stringify(this.starData)}</p>
      </ScalingSection>
      <ScalingSection
        topUnits={buttonTop}
        topFreeSpace={1}
        widthUnits={buttonWidth}
        heightUnits={buttonHeight}
      >
        <button
          className='outlined'
          onClick={this.onSparkle}
          disabled={this.state.animationInProgress}
        >
          Sparkle
        </button>
      </ScalingSection>
      <ScalingSection
        leftUnits={middleButtonOffset}
        topUnits={buttonTop}
        topFreeSpace={1}
        widthUnits={buttonWidth}
        heightUnits={buttonHeight}
      >
        <button
          className='outlined'
          onClick={this.onTwirl}
          disabled={this.state.animationInProgress}
        >
          Twirl
        </button>
      </ScalingSection>
      <ScalingSection
        leftUnits={rightButtonOffset}
        topUnits={buttonTop}
        topFreeSpace={1}
        widthUnits={buttonWidth}
        heightUnits={buttonHeight}
      >
        <button
          className='outlined'
          onClick={this.onSupernova}
          disabled={this.state.animationInProgress}
        >
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
