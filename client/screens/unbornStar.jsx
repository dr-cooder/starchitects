const React = require('react');
const { Component, createRef } = require('react');
const PropTypes = require('prop-types');
const { RadialColorPicker, ScalingSection, StarCanvas } = require('../components');
const compositeWorkerManager = require('../compositeWorkerManager.js');
const {
  unitsPaddingHorizontal, unitsHorizontalOuter, unitsHorizontalInner, unitsVerticalInner,
} = require('../measurements.js');
const { colorShadeToRGB } = require('../../common/helpers.js');

const slidersHeight = unitsVerticalInner - unitsHorizontalInner;
const sliderGranularity = 1000;
const translateSliderValue = (e) => e.target.value / sliderGranularity;

class UnbornStarScreen extends Component {
  constructor(props) {
    super(props);
    const {
      starData: {
        name,
        starColor,
        starShade,
        dustColor,
        dustShade,
      },
      onNewNameRequest,
      onSwipeStarUp,
    } = props;

    this.initialStarColor = starColor;
    this.initialStarShade = starShade;
    this.initialDustColor = dustColor;
    this.initialDustShade = dustShade;

    this.state = {
      name,
      starColor,
      starShade,
      dustColor,
      dustShade,
      waitingForNewName: false,
    };

    this.starCanvasRef = createRef();
    this.setDustColor = (e) => {
      const newDustColor = translateSliderValue(e);
      compositeWorkerManager.setDustRGB(colorShadeToRGB(newDustColor, this.state.dustShade));
      this.setState({ dustColor: newDustColor });
    };
    this.setDustShade = (e) => {
      const newDustShade = translateSliderValue(e);
      compositeWorkerManager.setDustRGB(colorShadeToRGB(this.state.dustColor, newDustShade));
      this.setState({ dustShade: newDustShade });
    };
    this.onSwipeStarUp = onSwipeStarUp;
    this.onNewNameRequest = () => {
      this.setState({ waitingForNewName: true });
      onNewNameRequest();
    };
    this.applyNewName = (newName) => {
      this.setState({ ...(newName != null && { name: newName }), waitingForNewName: false });
    };
  }

  render() {
    return (
      <>
        <ScalingSection
          topFreeSpace={0.5}
          heightUnits={unitsHorizontalInner}
        >
          <StarCanvas ref={this.starCanvasRef}/>
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
            Stardust Color: <input type='range' defaultValue={this.initialDustColor * sliderGranularity} max={sliderGranularity} onChange={this.setDustColor}/><br/>
            Stardust Shade: <input type='range' defaultValue={this.initialDustShade * sliderGranularity} max={sliderGranularity} onChange={this.setDustShade}/>
          </p>
          <button
            disabled={this.state.waitingForNewName}
            onClick={this.onNewNameRequest}
          >New name</button>
          <button
            disabled={this.state.waitingForNewName}
            onClick={() => {
              const {
                // name,
                starColor,
                starShade,
                dustColor,
                dustShade,
              } = this.state;
              this.onSwipeStarUp({
                // name,
                starColor,
                starShade,
                dustColor,
                dustShade,
              });
            }}
          >&quot;Swipe up&quot;</button>
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
            <RadialColorPicker
              initialColorValue={this.initialStarColor}
              initialShadeValue={this.initialStarShade}
              onChange={({ rgb, color, shade }) => {
                this.setState({
                  starColor: color,
                  starShade: shade,
                });
                compositeWorkerManager.setStarRGB(rgb);
              }}
            />
          </div>
        </ScalingSection>
      </>
    );
  }
}

UnbornStarScreen.propTypes = {
  starData: PropTypes.object,
  onNewNameRequest: PropTypes.func,
  onSwipeStarUp: PropTypes.func,
};

module.exports = UnbornStarScreen;
