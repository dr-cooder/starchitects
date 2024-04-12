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
  SwipeDetector,
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
const { preventChildrenFromCalling } = require('../../common/helpers.js');
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
const customizationHeaderTop = 42;
const customizationHeaderHeight = 30;
const wintessJoinHeight = 60;
const starNameHeight = 40;
const starNameNameTopFromCenter = 108;
const starNameConfirmationTopFromCenter = 156;

const yourStarDescendsOuterTop = (unitsVerticalInner - yourStarDescendsOuterHeight) / 2;
const starCanvasTop = (unitsVerticalInner - unitsHorizontalInner) / 2;
const revealOuterTop = starCanvasTop - revealOuterHeight;
const buttonTop = unitsVerticalInner - buttonHeight;
const buttonHalfWidth = (unitsHorizontalInner - buttonSpacing) / 2;
const buttonHalfRightLeft = buttonHalfWidth + buttonSpacing;
const whyDoYouResembleOuterTop = buttonTop - whyDoYouResembleOuterHeight;
const radialColorPickerTop = unitsVerticalInnerHalf - unitsHorizontalOuterHalf;
const starNameNameTop = unitsVerticalInnerHalf + starNameNameTopFromCenter;
const starNameConfirmationTop = unitsVerticalInnerHalf + starNameConfirmationTopFromCenter;
const witnessJoinTop = (unitsVerticalInner - wintessJoinHeight) / 2;

const waitingForBackgroundClassNames = {
  yourStarDescendsOuter: 'hiddenStill',
  revealOuter: 'hiddenStill',
  starCanvasTransition: 'hiddenStill',
  whyDoYouResembleOuter: 'hiddenStill',
  progress: 'hiddenStill',
  swipeYourStarUp: 'hiddenStill',
  witnessJoin: 'hiddenStill',
};
const yourStarDescendsClassNames = {
  yourStarDescendsOuter: 'yourStarDescendsOuter',
  revealOuter: 'hiddenStill',
  starCanvasTransition: 'hiddenStill',
  whyDoYouResembleOuter: 'hiddenStill',
  progress: 'hiddenStill',
  swipeYourStarUp: 'hiddenStill',
  witnessJoin: 'hiddenStill',
};
const revealClassNames = {
  yourStarDescendsOuter: 'hiddenStill',
  revealOuter: 'revealOuter',
  starCanvasAnimation: 'unbornStarCanvasAnimation',
  starCanvasTransition: 'unbornStarCanvasTransition unbornStarCanvasTransitionReveal',
  whyDoYouResembleOuter: 'hiddenStill',
  progress: 'hiddenStill',
  swipeYourStarUp: 'hiddenStill',
  witnessJoin: 'hiddenStill',
};
const whyDoYouResembleClassNames = {
  yourStarDescendsOuter: 'hiddenStill',
  revealOuter: 'hiddenStill',
  starCanvasTransition: 'unbornStarCanvasTransition unbornStarCanvasTransitionWhyDoYouResemble',
  whyDoYouResembleOuter: 'whyDoYouResembleOuter',
  progress: 'hiddenStill',
  swipeYourStarUp: 'hiddenStill',
  witnessJoin: 'hiddenStill',
};
const starColorClassNames = {
  yourStarDescendsOuter: 'hiddenStill',
  revealOuter: 'hiddenStill',
  starCanvasTransition: 'unbornStarCanvasTransition unbornStarCanvasTransitionStarColor',
  progress: 'quizProgress quizProgressIn',
  progressPercent: 'quizProgressPercent unbornProgressStarColor',
  swipeYourStarUp: 'hiddenStill',
  witnessJoin: 'hiddenStill',
};
// const dustTypeClassNames = {};
// const dustColorClassNames = {};
const nameClassNames = {
  yourStarDescendsOuter: 'hiddenStill',
  revealOuter: 'hiddenStill',
  starCanvasTransition: 'unbornStarCanvasTransition unbornStarCanvasTransitionName',
  progress: 'quizProgress quizProgressIn',
  progressPercent: 'quizProgressPercent unbornProgressName',
  swipeYourStarUp: 'hiddenStill',
  witnessJoin: 'hiddenStill',
};
const confirmationClassNames = {
  yourStarDescendsOuter: 'hiddenStill',
  revealOuter: 'hiddenStill',
  starCanvasTransition: 'unbornStarCanvasTransition unbornStarCanvasTransitionConfirmation',
  progress: 'quizProgress quizProgressIn',
  progressPercent: 'quizProgressPercent unbornProgressConfirmation',
  swipeYourStarUp: 'hiddenStill',
  witnessJoin: 'hiddenStill',
};
const sendoffClassNames = {
  yourStarDescendsOuter: 'hiddenStill',
  revealOuter: 'hiddenStill',
  starCanvasTransition: 'unbornStarCanvasTransition unbornStarCanvasTransitionSendoff',
  progress: 'quizProgress unbornProgressOut',
  progressPercent: 'quizProgressPercent unbornProgressConfirmation',
  confirmationOuter: 'unbornConfirmationOuterOut',
  swipeYourStarUp: 'header customizationHeader swipeYourStarUp',
  witnessJoin: 'hiddenStill',
};
const sendoffPlayingClassNames = {
  yourStarDescendsOuter: 'hiddenStill',
  revealOuter: 'hiddenStill',
  starCanvasTransition: 'hiddenStill',
  progress: 'hiddenStill',
  progressPercent: 'hiddenStill',
  confirmationOuter: 'hiddenStill',
  swipeYourStarUp: 'hiddenStill',
  witnessJoin: 'hiddenStill',
};
const witnessJoinClassNames = {
  yourStarDescendsOuter: 'hiddenStill',
  revealOuter: 'hiddenStill',
  starCanvasTransition: 'hiddenStill',
  progress: 'hiddenStill',
  progressPercent: 'hiddenStill',
  confirmationOuter: 'hiddenStill',
  swipeYourStarUp: 'hiddenStill',
  witnessJoin: 'header witnessJoin',
};

const galleryClassNames = [
  whyDoYouResembleClassNames,
  starColorClassNames,
  // dustTypeClassNames,
  // dustColorClassNames,
  nameClassNames,
  confirmationClassNames,
];

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
      onWitnessJoinFinished,
    } = props;

    this.starchetype = starchetypes[shape];
    this.initialStarColor = starColor;
    this.initialStarShade = starShade;
    this.initialDustColor = dustColor;
    this.initialDustShade = dustShade;
    this.initialDustType = dustType;

    this.onStarColorUpdate = onStarColorUpdate;
    this.onDustTypeUpdate = onDustTypeUpdate;
    this.onDustColorUpdate = onDustColorUpdate;
    this.onNewNameRequest = () => {
      this.setState({ waitingForNewName: true });
      onNewNameRequest();
    };
    this.onSwipeStarUp = onSwipeStarUp;
    this.onWitnessJoinFinished = onWitnessJoinFinished;

    this.state = {
      name,
      starColor,
      starShade,
      dustColor,
      dustShade,
      dustType,
      waitingForNewName: false,
      classNames: waitingForBackgroundClassNames,
      backgroundVideoPlaying: false,
      whyDoYouResembleAnimationNotFinishedYet: true,
      currentGalleryIndex: 0,
      previousGalleryIndex: 0,
      galleryIndexDelta: 0,
      galleryMoving: false,
      notReadyToSwipe: true,
    };
    this.classNamesSetter = (classNames) => () => this.setState({
      classNames,
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
          classNames: galleryClassNames[currentGalleryIndex],
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
    this.setDustType = (e) => {
      const newDustType = e.target.value;
      compositeWorkerManager.setDustType(newDustType);
      this.setState({ dustType: newDustType });
    };
    this.applyNewName = (newName) => {
      this.setState({ ...(newName != null && { name: newName }), waitingForNewName: false });
    };
  }

  render() {
    const {
      starchetype: {
        name: starchetypeName,
        tagline: starchetypeTagline,
        description: starchetypeDescription,
      },
      state: {
        starColor,
        starShade,
        // dustType,
        // dustColor,
        // dustShade,
        name,
        waitingForNewName,
        classNames: {
          yourStarDescendsOuter: yourStarDescendsOuterClassName,
          revealOuter: revealOuterClassName,
          starCanvasAnimation: starCanvasAnimationClassName,
          starCanvasTransition: starCanvasTransitionClassName,
          whyDoYouResembleOuter: whyDoYouResembleOuterClassName,
          progress: progressClassName,
          progressPercent: progressPercentClassName,
          confirmationOuter: confirmationOuterClassName,
          swipeYourStarUp: swipeYourStarUpClassName,
          witnessJoin: witnessJoinClassName,
        },
        backgroundVideoPlaying,
        whyDoYouResembleAnimationNotFinishedYet,
        currentGalleryIndex,
        previousGalleryIndex,
        galleryIndexDelta,
        galleryMoving,
        notReadyToSwipe,
      },
      playBackgroundVideo,
      backgroundVideoEnded,
      backgroundVideoRef,
      classNamesSetter,
      whyDoYouResembleAnimationHasFinished,
      galleryNext,
      galleryPrev,
      galleryStoppedMoving,
      onStarColorUpdate,
      onSwipeStarUp,
      onWitnessJoinFinished,
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
                  classNamesSetter(revealClassNames)();
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
                onEnd: () => {
                  backgroundVideoEnded();
                  classNamesSetter(witnessJoinClassNames)();
                },
              },
            ]}
            onReady={classNamesSetter(yourStarDescendsClassNames)}
          />
        }
      >
        <GalleryItem
          itemIndex={0}
          currentGalleryIndex={currentGalleryIndex}
          previousGalleryIndex={previousGalleryIndex}
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
                classNamesSetter(whyDoYouResembleClassNames),
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
              <StarCanvas />
            </div>
          </div>
        </ScalingSection>
        <ScalingSection heightUnits={0}>
          <div className={progressClassName}>
            <div className={progressPercentClassName}>
              <div className='quizProgressBar'></div>
              <img src={getBlob(progressStar)} alt='Progress star' className='quizProgressStar' />
            </div>
          </div>
        </ScalingSection>
        <GalleryItem
          itemIndex={1}
          currentGalleryIndex={currentGalleryIndex}
          previousGalleryIndex={previousGalleryIndex}
          galleryIndexDelta={galleryIndexDelta}
          onInAnimationFinished={galleryStoppedMoving}
        >
          <ScalingSection
            topUnits={customizationHeaderTop}
            heightUnits={customizationHeaderHeight}
          >
            <p className='header customizationHeader'>What <span className='emphasized'>color</span> is your star?</p>
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
          <ScalingSection
            topFreeSpace={1}
            topUnits={buttonTop}
            heightUnits={buttonHeight}
          >
            <GalleryButton
              onClick={() => {
                onStarColorUpdate({ starColor, starShade });
                galleryNext();
              }}
              expectedPreviousGalleryIndex={1}
              expectedGalleryIndexDelta={1}
              previousGalleryIndex={previousGalleryIndex}
              galleryIndexDelta={galleryIndexDelta}
            >
              Next
            </GalleryButton>
          </ScalingSection>
        </GalleryItem>
        <GalleryItem
          itemIndex={2}
          currentGalleryIndex={currentGalleryIndex}
          previousGalleryIndex={previousGalleryIndex}
          galleryIndexDelta={galleryIndexDelta}
          onInAnimationFinished={galleryStoppedMoving}
        >
          <ScalingSection
            topUnits={customizationHeaderTop}
            heightUnits={customizationHeaderHeight}
          >
            <p className='header customizationHeader'>What will you <span className='emphasized'>name</span> your star?</p>
          </ScalingSection>
          <ScalingSection
            topFreeSpace={0.5}
            topUnits={starNameNameTop}
            heightUnits={starNameHeight}
          >
            <p className='starName'>{name}</p>
          </ScalingSection>
          <ScalingSection
            topFreeSpace={1}
            topUnits={buttonTop}
            widthUnits={buttonHalfWidth}
            heightUnits={buttonHeight}
          >
            <GalleryButton
              disabled={waitingForNewName}
              onClick={galleryPrev}
              expectedPreviousGalleryIndex={2}
              expectedGalleryIndexDelta={-1}
              previousGalleryIndex={previousGalleryIndex}
              galleryIndexDelta={galleryIndexDelta}
            >
              Color
            </GalleryButton>
          </ScalingSection>
          <ScalingSection
            leftUnits={buttonHalfRightLeft}
            topFreeSpace={1}
            topUnits={buttonTop}
            widthUnits={buttonHalfWidth}
            heightUnits={buttonHeight}
          >
            <GalleryButton
              disabled={waitingForNewName}
              onClick={galleryNext}
              expectedPreviousGalleryIndex={2}
              expectedGalleryIndexDelta={1}
              previousGalleryIndex={previousGalleryIndex}
              galleryIndexDelta={galleryIndexDelta}
            >
              Finalize
            </GalleryButton>
          </ScalingSection>
        </GalleryItem>
        <GalleryItem
          itemIndex={3}
          currentGalleryIndex={currentGalleryIndex}
          previousGalleryIndex={previousGalleryIndex}
          galleryIndexDelta={galleryIndexDelta}
          onInAnimationFinished={galleryStoppedMoving}
        >
          <Inert
            inert={!!confirmationOuterClassName}
            className={confirmationOuterClassName}
            onAnimationEnd={preventChildrenFromCalling(() => this.setState({
              notReadyToSwipe: false,
            }))}
          >
            <ScalingSection
              topUnits={customizationHeaderTop}
              heightUnits={customizationHeaderHeight}
            >
              <p className='header customizationHeader'>Does <span className='emphasized'>this star</span> show your shine?</p>
            </ScalingSection>
            <ScalingSection
              topFreeSpace={0.5}
              topUnits={starNameConfirmationTop}
              heightUnits={starNameHeight}
            >
              <p className='starName'>{name}</p>
            </ScalingSection>
            <ScalingSection
              topFreeSpace={1}
              topUnits={buttonTop}
              widthUnits={buttonHalfWidth}
              heightUnits={buttonHeight}
            >
              <GalleryButton
                disabled={waitingForNewName}
                onClick={galleryPrev}
                expectedPreviousGalleryIndex={3}
                expectedGalleryIndexDelta={-1}
                previousGalleryIndex={previousGalleryIndex}
                galleryIndexDelta={galleryIndexDelta}
              >
                Not Yet!
              </GalleryButton>
            </ScalingSection>
            <ScalingSection
              leftUnits={buttonHalfRightLeft}
              topFreeSpace={1}
              topUnits={buttonTop}
              widthUnits={buttonHalfWidth}
              heightUnits={buttonHeight}
            >
              <GalleryButton
                disabled={waitingForNewName}
                onClick={classNamesSetter(sendoffClassNames)}
                expectedPreviousGalleryIndex={3}
                expectedGalleryIndexDelta={1}
                previousGalleryIndex={previousGalleryIndex}
                galleryIndexDelta={galleryIndexDelta}
              >
                Yes!
              </GalleryButton>
            </ScalingSection>
          </Inert>
          <ScalingSection
            topUnits={customizationHeaderTop}
            heightUnits={customizationHeaderHeight}
          >
            <p className={swipeYourStarUpClassName}>Swipe your <span className='emphasized'>star</span> up into space!</p>
          </ScalingSection>
          <SwipeDetector
            disabled={notReadyToSwipe}
            onSwipe={() => {
              this.setState({
                notReadyToSwipe: true,
                classNames: sendoffPlayingClassNames,
              });
              playBackgroundVideo();
              onSwipeStarUp();
            }}
          ></SwipeDetector>
          <ScalingSection
            topUnits={witnessJoinTop}
            topFreeSpace={0.5}
            heightUnits={wintessJoinHeight}
          >
            <p
              className={witnessJoinClassName}
              onAnimationEnd={preventChildrenFromCalling(onWitnessJoinFinished)}
            >
              Now witness your star<br/><span className='emphasized'>join the galaxy.</span>
            </p>
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
  onStarColorUpdate: PropTypes.func,
  onDustTypeUpdate: PropTypes.func,
  onDustColorUpdate: PropTypes.func,
  onWitnessJoinFinished: PropTypes.func,
};

module.exports = UnbornStarScreen;
