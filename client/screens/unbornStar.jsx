const React = require('react');
const { Component, createRef } = require('react');
const PropTypes = require('prop-types');
const {
  Background, RadialColorPicker, ScalingSection, StarCanvas, VideoSequence,
} = require('../components');
const compositeWorkerManager = require('../compositeWorkerManager.js');
const {
  unitsPaddingHorizontal, unitsHorizontalOuter, unitsHorizontalInner, unitsVerticalInner,
} = require('../measurements.js');
const { colorShadeToRGB, preventChildrenFromCalling } = require('../../common/helpers.js');
const { starchetypes } = require('../starchetypes.js');
const {
  videos: {
    preReveal: preRevealVideo,
    reveal: revealVideo,
    sendoff: sendoffVideo,
  },
  getEl,
} = require('../preload.js');

const yourStarDescendsOuterHeight = 56;

const yourStarDescendsOuterTop = (unitsVerticalInner - yourStarDescendsOuterHeight) / 2;
const starCanvasTop = (unitsVerticalInner - unitsHorizontalInner) / 2;
const slidersHeight = unitsVerticalInner - unitsHorizontalInner;
const sliderGranularity = 1000;
const translateSliderValue = (e) => e.target.value / sliderGranularity;

const animationClassNames = {
  waitingForBackground: {
    yourStarDescendsOuter: 'hiddenStill',
    starCanvasTransition: 'hiddenStill',
  },
  yourStarDescends: {
    yourStarDescendsOuter: 'yourStarDescendsOuter',
    starCanvasTransition: 'hiddenStill',
  },
  reveal: {
    yourStarDescendsOuter: 'hiddenStill',
    starCanvasAnimation: 'unbornStarCanvasAnimation',
    starCanvasTransition: 'unbornStarCanvasTransition unbornStarCanvasTransitionReveal',
  },
  whyDoYouResemble: {},
  starColor: {},
  dustType: {},
  dustColor: {},
  name: {},
  confirmation: {},
  sendoff: {},
  witnessJoin: {},
};

class UnbornStarScreen extends Component {
  constructor(props) {
    super(props);
    const {
      starData: {
        name,
        shape,
        starColor,
        starShade,
        dustColor,
        dustShade,
        dustType,
      },
      onStarColorUpdate,
      onDustTypeUpdate,
      onDustColorUpdate,
      onNewNameRequest,
      onSwipeStarUp,
    } = props;

    console.log(props.starData);
    const { name: starchetypeName, tagline, description } = starchetypes[shape];
    console.log(`${starchetypeName}\n${tagline}\n\nWhy do you resemble this star?\n${description}`);

    this.initialStarColor = starColor;
    this.initialStarShade = starShade;
    this.initialDustColor = dustColor;
    this.initialDustShade = dustShade;
    this.initialDustType = dustType;

    this.state = {
      name,
      starColor,
      starShade,
      dustColor,
      dustShade,
      dustType,
      waitingForNewName: false,
      animationClassName: animationClassNames.waitingForBackground,
      backgroundVideoPlaying: false,
    };
    this.animationClassNameSetter = (animationClassName) => () => this.setState({
      animationClassName,
    });

    this.backgroundVideoRef = createRef();
    this.playBackgroundVideo = () => {
      this.backgroundVideoRef.current.next();
      this.setState({ backgroundVideoPlaying: true });
    };
    this.backgroundVideoEnded = () => {
      this.setState({ backgroundVideoPlaying: false });
    };
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
    this.setDustType = (e) => {
      const newDustType = e.target.value;
      compositeWorkerManager.setDustType(newDustType);
      this.setState({ dustType: newDustType });
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
    const {
      yourStarDescends,
      reveal,
    } = animationClassNames;
    const {
      state: {
        name,
        waitingForNewName,
        animationClassName: {
          yourStarDescendsOuter: yourStarDescendsOuterClassName,
          starCanvasAnimation: starCanvasAnimationClassName,
          starCanvasTransition: starCanvasTransitionClassName,
        },
        backgroundVideoPlaying,
      },
      playBackgroundVideo,
      backgroundVideoEnded,
      backgroundVideoRef,
      animationClassNameSetter,
    } = this;
    return (
      <Background
        visible={backgroundVideoPlaying}
        background={
          <VideoSequence
            ref={backgroundVideoRef}
            videos={[
              {
                el: getEl(preRevealVideo),
                className: 'background',
                onEnd: () => {
                  backgroundVideoEnded();
                  animationClassNameSetter(reveal)();
                },
              },
              {
                el: getEl(revealVideo),
                className: 'background',
                onEnd: backgroundVideoEnded,
              },
              {
                el: getEl(sendoffVideo),
                className: 'background',
                onEnd: backgroundVideoEnded,
              },
            ]}
            onReady={animationClassNameSetter(yourStarDescends)}
          />
        }
      >
        <ScalingSection
          topFreeSpace={0.5}
          topUnits={yourStarDescendsOuterTop}
          heightUnits={yourStarDescendsOuterHeight}
        >
          <div
            className={yourStarDescendsOuterClassName}
            onAnimationEnd={preventChildrenFromCalling(playBackgroundVideo)}
          >
            <p className='yourStarDescends'>Your star descends</p>
            <div className='yourStarDescendsSeparator'></div>
            <p className='theGreatCosmosDeemsYou'>The Great Cosmos deems you…</p>
          </div>
        </ScalingSection>
        <ScalingSection
          topFreeSpace={0.5}
          topUnits={starCanvasTop}
          heightUnits={unitsHorizontalInner}
        >
          <div className={starCanvasTransitionClassName}>
            <div className={starCanvasAnimationClassName}>
              <StarCanvas/>
            </div>
          </div>
        </ScalingSection>
        <ScalingSection
          topUnits={unitsHorizontalInner}
          topFreeSpace={0.5}
          heightUnits={slidersHeight}
          heightFreeSpace={0.5}
        >
          <p>
            Here is your star! (swipe it up when you are done customizing it)<br/>
            Shine Type: <select onChange={this.setDustType} value={this.initialDustType}>
              <option value={0}>Plasmo</option>
              <option value={1}>Electro</option>
              <option value={2}>Nucleo</option>
            </select><br/>
            Shine Color: <input type='range' defaultValue={this.initialDustColor * sliderGranularity} max={sliderGranularity} onChange={this.setDustColor}/><br/>
            Shine Shade: <input type='range' defaultValue={this.initialDustShade * sliderGranularity} max={sliderGranularity} onChange={this.setDustShade}/><br/>
            Name: {name}
          </p>
          <button
            disabled={waitingForNewName}
            onClick={this.onNewNameRequest}
          >New name</button>
          <button
            disabled={waitingForNewName}
            onClick={() => {
              const {
                // name,
                starColor,
                starShade,
                dustColor,
                dustShade,
                dustType,
              } = this.state;
              this.onSwipeStarUp({
                // name,
                starColor,
                starShade,
                dustColor,
                dustShade,
                dustType,
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
      </Background>
    );
  }
}

UnbornStarScreen.propTypes = {
  starData: PropTypes.object,
  onNewNameRequest: PropTypes.func,
  onSwipeStarUp: PropTypes.func,
};

module.exports = UnbornStarScreen;
