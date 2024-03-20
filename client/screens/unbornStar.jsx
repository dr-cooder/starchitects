const React = require('react');
const { Component, createRef } = require('react');
const PropTypes = require('prop-types');
const {
  BackgroundImage, RadialSlider, ScalingSection, StarCanvas,
} = require('../components');
const compositeWorkerManager = require('../compositeWorkerManager.js');
const { blobFilenames, blobs } = require('../preload.js');
const {
  unitsPaddingHorizontal, unitsHorizontalOuter, unitsHorizontalInner, unitsVerticalInner,
} = require('../measurements.js');

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
      this.setState({ ...(newName != null && { name: newName }), waitingForNewName: false });
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
      >
        <ScalingSection
          topUnits={
            this.state.swipeUpAnimProgress * this.state.swipeUpAnimProgress * -unitsVerticalInner
          }
          topFreeSpace={0.5}
          heightUnits={unitsHorizontalInner}
        >
          <StarCanvas initialSize={this.initialSize} ref={this.starCanvasRef}/>
        </ScalingSection>
        <ScalingSection
          topUnits={unitsHorizontalInner}
          topFreeSpace={0.5}
          heightUnits={slidersHeight}
          heightFreeSpace={0.5}
        >
          <p>Here is your star! (Swipe it up when you are done customizing it)</p>
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
        <ScalingSection
          leftUnits={-unitsPaddingHorizontal}
          topUnits={-unitsPaddingHorizontal}
          topFreeSpace={0.5}
          widthUnits={unitsHorizontalOuter}
          heightUnits={unitsHorizontalOuter}
        >
          <div
            onMouseDown={this.startSwipeUpAnim}
            onTouchStart={this.startSwipeUpAnim}
          >
            <RadialSlider clamp={true} initialValue="-0.1"/>
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
