const React = require('react');
const { Component, createRef } = require('react');
const PropTypes = require('prop-types');
const { BackgroundImage, ScalingSection } = require('../components');
const { blobFilenames, blobs } = require('../preload.js');

class UnbornStarScreen extends Component {
  constructor(props) {
    super(props);
    const { starData, onNewName, onSwipeStarUp } = props;

    this.state = {
      name: starData.name,
    };

    this.starData = starData;
    this.onNewName = onNewName;
    this.onSwipeStarUp = onSwipeStarUp;
    this.controlsRef = createRef();
    this.applyNewName = (newName) => {
      this.setState({ name: newName });
      this.controlsRef.current.removeAttribute('inert');
    };
  }

  render() {
    return (
      <BackgroundImage
        src={blobs[blobFilenames.tempBG]}
        darkness={0.75}
      >
        <ScalingSection>
          <p>Congratulations! Here is your star! After you&apos;re done adjusting its colors,
            go to (insert our room building+number here) and swipe your star up into the galaxy!</p>
          <p>{JSON.stringify(this.starData)}</p>
          <p>Current name (that seen above is simply the inital one): {this.state.name}</p>
          <p>(Pretend there are circular sliders here, controlling the star&apos;s
            color (hue), size, and glow color (saturation), along with a
            &quot;generate new name&quot; button)</p>
          <div ref={this.controlsRef}>
            <button onClick={() => {
              this.controlsRef.current.setAttribute('inert', '');
              this.onNewName();
            }}>New name</button>
            <button onClick={() => this.onSwipeStarUp({
              color: 0.0,
              size: 0.8,
              shine: 0.5,
              name: this.state.name,
            })}>&quot;Swipe up&quot;</button>
          </div>
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
