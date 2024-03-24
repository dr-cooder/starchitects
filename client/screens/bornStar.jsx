const React = require('react');
const { Component } = require('react');
const PropTypes = require('prop-types');
const { ScalingSection, StarCanvas } = require('../components');
const { unitsHorizontalInner, unitsVerticalInner } = require('../measurements.js');

const buttonHeight = 40;
const buttonSpacing = 24;

const buttonTop = unitsVerticalInner - buttonHeight;
const buttonWidth = (unitsHorizontalInner - buttonSpacing * 2) / 3;
const middleButtonOffset = buttonWidth + buttonSpacing;
const rightButtonOffset = middleButtonOffset * 2;

const nameplateHeight = 24;
const canvasTop = (buttonTop - unitsHorizontalInner - nameplateHeight) / 2;
const namePlateTop = canvasTop + unitsHorizontalInner;

class BornStarScreen extends Component {
  constructor(props) {
    super(props);
    const {
      starData: { name, size },
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

    this.name = name;
    this.size = size;
    this.onSparkle = startAnimation(onSparkle);
    this.onTwirl = startAnimation(onTwirl);
    this.onSupernova = startAnimation(onSupernova);
    this.animationFinished = () => {
      this.setState({ animationInProgress: false });
    };
  }

  render() {
    return (
      <>
        <ScalingSection
          topUnits={canvasTop}
          topFreeSpace={0.5}
          heightUnits={unitsHorizontalInner}
        >
          <StarCanvas initialSize={this.size}/>
        </ScalingSection>
        <ScalingSection
          topUnits={namePlateTop}
          topFreeSpace={0.5}
          heightUnits={nameplateHeight}
        >
          <p>{this.name}</p>
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
      </>
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
