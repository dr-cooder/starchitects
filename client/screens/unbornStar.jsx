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
  unitsPaddingHorizontal,
  unitsHorizontalOuter,
  unitsHorizontalInner,
  unitsVerticalInner,
  unitsVerticalInnerHalf,
  unitsHorizontalOuterHalf,
} = require('../measurements.js');
const { colorShadeToRGB, preventChildrenFromCalling } = require('../../common/helpers.js');
const { starchetypes } = require('../starchetypes.js');
const {
  misc: {
    progressStar,
  },
  videos: {
    preReveal: preRevealVideo,
    reveal: revealVideo,
    sendoff: sendoffVideo,
  },
  getEl,
  getBlob,
} = require('../preload.js');

const revealVideoDelay = 250;
const yourStarDescendsOuterHeight = 56;
const revealOuterHeight = 96;
const buttonHeight = 40;
const buttonSpacing = 24;
const whyDoYouResembleOuterHeight = 200;

const yourStarDescendsOuterTop = (unitsVerticalInner - yourStarDescendsOuterHeight) / 2;
const starCanvasTop = (unitsVerticalInner - unitsHorizontalInner) / 2;
const revealOuterTop = starCanvasTop - revealOuterHeight;
const buttonTop = unitsVerticalInner - buttonHeight;
const buttonHalfWidth = (unitsHorizontalInner - buttonSpacing) / 2;
const buttonHalfRightLeft = buttonHalfWidth + buttonSpacing;
const whyDoYouResembleOuterTop = buttonTop - whyDoYouResembleOuterHeight;
const radialColorPickerTop = unitsVerticalInnerHalf - unitsHorizontalOuterHalf;
const slidersHeight = unitsVerticalInner - unitsHorizontalInner;
const sliderGranularity = 1000;
const translateSliderValue = (e) => e.target.value / sliderGranularity;

const animationClassNames = {
  waitingForBackground: {
    yourStarDescendsOuter: 'hiddenStill',
    revealOuter: 'hiddenStill',
    starCanvasTransition: 'hiddenStill',
    whyDoYouResembleOuter: 'hiddenStill',
    progress: 'hiddenStill',
  },
  yourStarDescends: {
    yourStarDescendsOuter: 'yourStarDescendsOuter',
    revealOuter: 'hiddenStill',
    starCanvasTransition: 'hiddenStill',
    whyDoYouResembleOuter: 'hiddenStill',
    progress: 'hiddenStill',
  },
  reveal: {
    yourStarDescendsOuter: 'hiddenStill',
    revealOuter: 'revealOuter',
    starCanvasAnimation: 'unbornStarCanvasAnimation',
    starCanvasTransition: 'unbornStarCanvasTransition unbornStarCanvasTransitionReveal',
    whyDoYouResembleOuter: 'hiddenStill',
    progress: 'hiddenStill',
  },
  whyDoYouResemble: {
    yourStarDescendsOuter: 'hiddenStill',
    revealOuter: 'hiddenStill',
    starCanvasTransition: 'unbornStarCanvasTransition unbornStarCanvasTransitionWhyDoYouResemble',
    whyDoYouResembleOuter: 'whyDoYouResembleOuter',
    progress: 'hiddenStill',
  },
  starColor: {
    progress: 'quizProgress quizProgressIn',
    progressPercent: 'quizProgressPercent unbornProgressStarColor',
  },
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
      galleryMoving: false,
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
          galleryMoving: true,
        });
      };
    };
    this.galleryNext = galleryMover(true);
    this.galleryPrev = galleryMover(false);
    this.galleryStoppedMoving = () => this.setState({ galleryMoving: false });

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
          progress: progressClassName,
          progressPercent: progressPercentClassName,
        },
        backgroundVideoPlaying,
        whyDoYouResembleAnimationNotFinishedYet,
        currentGalleryIndex,
        previousGalleryIndex,
        galleryIndexDelta,
        galleryMoving,
      },
      playBackgroundVideo,
      backgroundVideoEnded,
      backgroundVideoRef,
      animationClassNameSetter,
      whyDoYouResembleAnimationHasFinished,
      galleryNext,
      galleryPrev,
      galleryStoppedMoving,
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
          onInAnimationFinished={galleryStoppedMoving}
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
        <ScalingSection heightUnits={0}>
          <div className={progressClassName}>
            <div className={progressPercentClassName}>
              <div className='quizProgressBar'></div>
              <img src={getBlob(progressStar)} alt='Progress star' className='quizProgressStar'/>
            </div>
          </div>
        </ScalingSection>
        <GalleryItem
          itemIndex={1}
          currentGalleryIndex={currentGalleryIndex}
          galleryIndexDelta={galleryIndexDelta}
          onInAnimationFinished={galleryStoppedMoving}
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
            topUnits={radialColorPickerTop}
            topFreeSpace={0.5}
            widthUnits={unitsHorizontalOuter}
            heightUnits={unitsHorizontalOuter}
          >
            <RadialColorPicker
              id='star'
              disabled={galleryMoving || currentGalleryIndex !== 1}
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
