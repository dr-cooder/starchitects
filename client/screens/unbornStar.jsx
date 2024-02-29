const React = require('react');
const { Component } = require('react');
const PropTypes = require('prop-types');
const { BackgroundImage, ScalingSection } = require('../components');
const { blobFilenames, blobs } = require('../preload.js');
const { unitsHorizontalInnerHalf, unitsVerticalInner } = require('../scalingMeasurements.js');

const buttonHeight = 40;
const buttonSpacing = 24;

const buttonTop = unitsVerticalInner - buttonHeight;
const buttonWidth = unitsHorizontalInnerHalf - buttonSpacing / 2;
const rightButtonOffset = buttonWidth + buttonSpacing;

class UnbornStarScreen extends Component {
  constructor(props) {
    super(props);
    const { starData, onNewName, onSwipeStarUp } = props;

    this.state = {
      name: starData.name,
      waitingForNewName: false,
    };

    this.starData = starData;
    this.onSwipeStarUp = onSwipeStarUp;
    this.onNewName = () => {
      this.setState({ waitingForNewName: true });
      onNewName();
    };
    this.applyNewName = (newName) => {
      this.setState({ name: newName, waitingForNewName: false });
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
          <p>Congratulations! Here is your star! After you&apos;re done adjusting its colors,
            go to (insert our room building+number here) and swipe your star up into the galaxy!</p>
          <p>{JSON.stringify(this.starData)}</p>
          <p>Current name (that seen above is simply the inital one): {this.state.name}</p>
          <p>(Pretend there are circular sliders here, controlling the star&apos;s
            color (hue), size, and glow color (saturation), along with a
            &quot;generate new name&quot; button)</p>
        </ScalingSection>
        <ScalingSection
          topUnits={buttonTop}
          topFreeSpace={1}
          widthUnits={buttonWidth}
          heightUnits={buttonHeight}
        >
          <button
            className='outlined'
            disabled={this.state.waitingForNewName}
            onClick={this.onNewName}
          >New name</button>
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
            disabled={this.state.waitingForNewName}
            onClick={() => this.onSwipeStarUp({
              color: 0.0,
              size: 0.8,
              shade: 0.5,
              name: this.state.name,
            })}
          >&quot;Swipe up&quot;</button>
        </ScalingSection>
      </BackgroundImage>
    );
  }
}

UnbornStarScreen.propTypes = {
  starData: PropTypes.object,
  onNewName: PropTypes.func,
  onSwipeStarUp: PropTypes.func,
};

module.exports = UnbornStarScreen;
