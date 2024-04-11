const React = require('react');
const { Component, createRef } = require('react');
const PropTypes = require('prop-types');
const {
  Background,
  GalleryButton,
  GalleryItem,
  Inert,
  RadialColorPicker,
  ScalingSection,
  StarCanvas,
  VideoSequence,
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

const revealVideoDelay = 250;
const yourStarDescendsOuterHeight = 56;
const revealOuterHeight = 96;
const buttonHeight = 40;
const whyDoYouResembleOuterHeight = 200;

const yourStarDescendsOuterTop = (unitsVerticalInner - yourStarDescendsOuterHeight) / 2;
const starCanvasTop = (unitsVerticalInner - unitsHorizontalInner) / 2;
const revealOuterTop = starCanvasTop - revealOuterHeight;
const buttonTop = unitsVerticalInner - buttonHeight;
const whyDoYouResembleOuterTop = buttonTop - whyDoYouResembleOuterHeight;
const slidersHeight = unitsVerticalInner - unitsHorizontalInner;
const sliderGranularity = 1000;
const translateSliderValue = (e) => e.target.value / sliderGranularity;

const animationClassNames = {
  waitingForBackground: {
    yourStarDescendsOuter: 'hiddenStill',
    revealOuter: 'hiddenStill',
    starCanvasTransition: 'hiddenStill',
    whyDoYouResembleOuter: 'hiddenStill',
  },
  yourStarDescends: {
    yourStarDescendsOuter: 'yourStarDescendsOuter',
    revealOuter: 'hiddenStill',
    starCanvasTransition: 'hiddenStill',
    whyDoYouResembleOuter: 'hiddenStill',
  },
  reveal: {
    yourStarDescendsOuter: 'hiddenStill',
    revealOuter: 'revealOuter',
    starCanvasAnimation: 'unbornStarCanvasAnimation',
    starCanvasTransition: 'unbornStarCanvasTransition unbornStarCanvasTransitionReveal',
    whyDoYouResembleOuter: 'hiddenStill',
  },
  whyDoYouResemble: {
    yourStarDescendsOuter: 'hiddenStill',
    revealOuter: 'hiddenStill',
    starCanvasTransition: 'unbornStarCanvasTransition unbornStarCanvasTransitionWhyDoYouResemble',
    whyDoYouResembleOuter: 'whyDoYouResembleOuter',
  },
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

    this.starchetype = starchetypes[shape];
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
      whyDoYouResembleAnimationNotFinishedYet: true,
      currentGalleryIndex: 0,
      previousGalleryIndex: 0,
      galleryIndexDelta: 0,
    };
    this.animationClassNameSetter = (animationClassName) => () => this.setState({
      animationClassName,
    });
    this.whyDoYouResembleAnimationHasFinished = () => this.setState({
      whyDoYouResembleAnimationNotFinishedYet: false,
    });

    const galleryMover = (next) => {
      const galleryIndexDelta = next ? 1 : -1;
      return () => {
        const { currentGalleryIndex: previousGalleryIndex } = this.state;
        const currentGalleryIndex = previousGalleryIndex + galleryIndexDelta;
        this.setState({
          galleryIndexDelta,
          previousGalleryIndex,
          currentGalleryIndex,
        });
      };
    };
    this.galleryNext = galleryMover(true);
    this.galleryPrev = galleryMover(false);

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
      whyDoYouResemble,
    } = animationClassNames;
    const {
      starchetype: {
        name: starchetypeName,
        tagline: starchetypeTagline,
        description: starchetypeDescription,
      },
      state: {
        name,
        waitingForNewName,
        animationClassName: {
          yourStarDescendsOuter: yourStarDescendsOuterClassName,
          revealOuter: revealOuterClassName,
          starCanvasAnimation: starCanvasAnimationClassName,
          starCanvasTransition: starCanvasTransitionClassName,
          whyDoYouResembleOuter: whyDoYouResembleOuterClassName,
        },
        backgroundVideoPlaying,
        whyDoYouResembleAnimationNotFinishedYet,
        currentGalleryIndex,
        previousGalleryIndex,
        galleryIndexDelta,
      },
      playBackgroundVideo,
      backgroundVideoEnded,
      backgroundVideoRef,
      animationClassNameSetter,
      whyDoYouResembleAnimationHasFinished,
      galleryNext,
      galleryPrev,
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
                  setTimeout(playBackgroundVideo, revealVideoDelay);
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
        <GalleryItem
          itemIndex={0}
          currentGalleryIndex={currentGalleryIndex}
          galleryIndexDelta={galleryIndexDelta}
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
            topUnits={revealOuterTop}
            heightUnits={revealOuterHeight}
          >
            <div
              className={revealOuterClassName}
              onAnimationEnd={preventChildrenFromCalling(
                animationClassNameSetter(whyDoYouResemble),
              )}
            >
              <p className='revealName'>{starchetypeName}</p>
              <div className='revealSeparator'></div>
              <p className='revealTagline'>{starchetypeTagline}</p>
            </div>
          </ScalingSection>
          <Inert
            inert={whyDoYouResembleAnimationNotFinishedYet}
            className={whyDoYouResembleOuterClassName}
            onAnimationEnd={preventChildrenFromCalling(whyDoYouResembleAnimationHasFinished)}
          >
            <ScalingSection
              topFreeSpace={1}
              topUnits={whyDoYouResembleOuterTop}
              heightUnits={whyDoYouResembleOuterHeight}
            >
              <p className='header whyDoYouResemble'>Why do you resemble <span className='emphasized'>this</span> star?</p>
              <p>{starchetypeDescription}</p>
            </ScalingSection>
            <ScalingSection
              topFreeSpace={1}
              topUnits={buttonTop}
              heightUnits={buttonHeight}
            >
              <GalleryButton
                onClick={galleryNext}
                expectedPreviousGalleryIndex={0}
                expectedGalleryIndexDelta={1}
                previousGalleryIndex={previousGalleryIndex}
                galleryIndexDelta={galleryIndexDelta}
              >
                Customize Star
              </GalleryButton>
            </ScalingSection>
          </Inert>
        </GalleryItem>
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
        <GalleryItem
          itemIndex={1}
          currentGalleryIndex={currentGalleryIndex}
          galleryIndexDelta={galleryIndexDelta}
        >
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
        </GalleryItem>
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
