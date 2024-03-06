const React = require('react');
const { Component, createRef } = require('react');
const PropTypes = require('prop-types');
const { BackgroundImage, ScalingSection, StarCanvas } = require('../components');
const compositeWorkerManager = require('../compositeWorkerManager.js');
const { blobFilenames, blobs } = require('../preload.js');
const { unitsHorizontalInner, unitsVerticalInner } = require('../scalingMeasurements.js');

const swipeUpAnimDuration = 1500;

const slidersHeight = unitsVerticalInner - unitsHorizontalInner;
const sliderGranularity = 1000;
const translateSliderValue = (e) => e.target.value / sliderGranularity;

class UnbornStarScreen extends Component {
  constructor(props) {
    super(props);
    const { starData: { name, size }, onNewName, onSwipeStarUp } = props;

    this.state = {
      name,
      waitingForNewName: false,
      swipingUp: false,
      swipeUpAnimProgress: 0,
    };

    this.initialSize = size;
    this.starCanvasRef = createRef();
    this.setStarCanvasColor = (e) => compositeWorkerManager.setColor(translateSliderValue(e));
    this.setStarCanvasSize = (e) => this
      .starCanvasRef.current.setSize(translateSliderValue(e));
    this.setStarCanvasShade = (e) => compositeWorkerManager.setShade(translateSliderValue(e));
    this.onSwipeStarUp = onSwipeStarUp;
    this.onNewName = () => {
      this.setState({ waitingForNewName: true });
      onNewName();
    };
    this.applyNewName = (newName) => {
      this.setState({ name: newName, waitingForNewName: false });
    };
    this.startSwipeUpAnim = () => {
      if (this.state.swipingUp) return;
      this.setState({ swipingUp: true });
      const swipeUpAnimStartTime = Date.now();
      const updateSwipeUpAnimProgress = () => {
        const swipeUpAnimProgress = (Date.now()
          - swipeUpAnimStartTime) / swipeUpAnimDuration;
        if (swipeUpAnimProgress < 1) {
          requestAnimationFrame(updateSwipeUpAnimProgress);
          this.setState({ swipeUpAnimProgress });
        } else {
          this.setState({ swipeUpAnimProgress: 1 });
          this.onSwipeStarUp(Object.assign(
            this.starCanvasRef.current.getCustomization(),
            { name: this.state.name },
          ));
        }
      };
      updateSwipeUpAnimProgress();
    };
  }

  render() {
    return (
      <BackgroundImage
        src={blobs[blobFilenames.tempBG]}
        darkness={0.75}
      >
        <ScalingSection
          heightUnits={unitsHorizontalInner}
          topUnits={
            this.state.swipeUpAnimProgress * this.state.swipeUpAnimProgress * -unitsVerticalInner
          }
        >
          <div
            onMouseDown={this.startSwipeUpAnim}
            onTouchStart={this.startSwipeUpAnim}
          >
            <StarCanvas initialSize={this.initialSize} ref={this.starCanvasRef}/>
          </div>
        </ScalingSection>
        <ScalingSection
          topUnits={unitsHorizontalInner}
          heightUnits={slidersHeight}
          heightFreeSpace={1}
        >
          <p>Here is your star! (Swipe up when you are done customizing)</p>
          <p>{this.state.name}</p>
          <p>
            Color: <input type='range' defaultValue={0} max={sliderGranularity} onChange={this.setStarCanvasColor} disabled={this.state.swipingUp}/><br/>
            Size: <input type='range' defaultValue={0} max={sliderGranularity} onChange={this.setStarCanvasSize} disabled={this.state.swipingUp}/><br/>
            Shade: <input type='range' defaultValue={0} max={sliderGranularity} onChange={this.setStarCanvasShade} disabled={this.state.swipingUp}/>
          </p>
          <button
            disabled={this.state.waitingForNewName || this.state.swipingUp}
            onClick={this.onNewName}
          >New name</button>
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
