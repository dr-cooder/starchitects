const React = require('react');
const { Component } = require('react');
const PropTypes = require('prop-types');
const {
  AnimationButtonIcon,
  Inert,
  ScalingSection,
  ScalingSectionRelative,
  StarCanvas,
} = require('../components');
const { unitsHorizontalInner, unitsVerticalInner } = require('../measurements.js');
const { misc: { addButton }, getBlob } = require('../preload.js');
const { setTimeoutBetter, preventChildrenFromCalling } = require('../../common/helpers.js');

const bornStarCanvasAnimationDuration = 1000;
const restartBecomingActiveAnimationDuration = 500;
const restartBecomingInactiveAnimationDuration = 500;
const fadingOutToRestartAnimationDuration = 500;
const starCanvasWidth = 210;
const animationButtonWidth = 100;
const animationButtonHeight = 111;
const buttonUpperTop = 76;
const controlPanelTop = 218;
const newStarButtonDiameter = 32;
const restartConfirmationHeight = 188;
const restartConfirmationPadding = 24;
const restartConfirmationMessageHeight = 76;
const restartConfirmationButtonHeight = 40;
const restartConfirmationButtonSpacing = 24;

const starCanvasLeft = (unitsHorizontalInner - starCanvasWidth) / 2;
const controlPaneHeight = unitsVerticalInner - controlPanelTop;
const buttonRightLeft = unitsHorizontalInner - animationButtonWidth;
const buttonMiddleLeft = buttonRightLeft / 2;
const buttonLowerTop = buttonUpperTop + animationButtonHeight;
const newStarButtonLeft = unitsHorizontalInner - newStarButtonDiameter;
const restartConfirmationTop = (unitsVerticalInner - restartConfirmationHeight) / 2;
const restartConfirmationInnerWidth = unitsHorizontalInner - 2 * restartConfirmationPadding;
const restartConfirmationButtonTop = (
  restartConfirmationHeight - restartConfirmationPadding - restartConfirmationButtonHeight
);
const restartConfirmationButtonWidth = (
  (restartConfirmationInnerWidth - restartConfirmationButtonSpacing) / 2
);
const restartConfirmationButtonRightLeft = (
  restartConfirmationPadding + restartConfirmationButtonWidth + restartConfirmationButtonSpacing
);

const restartInactiveClassNames = {
  restartConfirmation: 'hiddenStill',
};
const restartBecomingActiveClassNames = {
  restartConfirmation: 'restartConfirmation restartConfirmationIn',
};
const restartActiveClassNames = {
  restartConfirmation: 'restartConfirmation',
};
const restartBecomingInactiveClassNames = {
  restartConfirmation: 'restartConfirmation restartConfirmationOut',
};
const fadingOutToRestartClassNames = {
  restartConfirmation: 'restartConfirmation',
  outer: 'bornStarFadeOut',
};

const animationButtonClassNameGenerator = (expectedAnimationId) => ({
  animationInProgress, currentAnimationId,
}) => {
  let animationButtonClassName = 'animationButtonEnabled';
  if (animationInProgress) {
    animationButtonClassName = currentAnimationId === expectedAnimationId ? 'animationButtonPressed' : 'animationButtonDisabled';
  }
  return animationButtonClassName;
};
const sparkleButtonClassName = animationButtonClassNameGenerator(0);
const twirlButtonClassName = animationButtonClassNameGenerator(1);
const supernovaButtonClassName = animationButtonClassNameGenerator(2);

class BornStarScreen extends Component {
  constructor(props) {
    super(props);
    const {
      starData: { name },
      onSparkle,
      onTwirl,
      onSupernova,
      onConfirmRestart,
    } = props;

    this.state = {
      currentAnimationId: null,
      controlsNotReady: true,
      controlsReadyTimeoutNotSet: true,
      classNames: restartInactiveClassNames,
    };

    const startAnimation = ({ callback, animationId }) => () => {
      this.setState({ currentAnimationId: animationId });
      callback();
    };

    this.name = name;
    this.onSparkle = startAnimation({ callback: onSparkle, animationId: 0 });
    this.onTwirl = startAnimation({ callback: onTwirl, animationId: 1 });
    this.onSupernova = startAnimation({ callback: onSupernova, animationId: 2 });
    this.animationFinished = () => {
      this.setState({ currentAnimationId: null });
    };

    const restartConfirmationActiveSetter = (active) => () => {
      if (active) {
        this.setState({ classNames: restartBecomingActiveClassNames });
        setTimeoutBetter(() => {
          this.setState({ classNames: restartActiveClassNames });
        }, restartBecomingActiveAnimationDuration);
      } else {
        this.setState({ classNames: restartBecomingInactiveClassNames });
        setTimeoutBetter(() => {
          this.setState({ classNames: restartInactiveClassNames });
        }, restartBecomingInactiveAnimationDuration);
      }
    };
    this.setRestartConfirmationActive = restartConfirmationActiveSetter(true);
    this.setRestartConfirmationInactive = restartConfirmationActiveSetter(false);
    this.confirmRestart = () => {
      this.setState({ classNames: fadingOutToRestartClassNames });
      setTimeoutBetter(onConfirmRestart, fadingOutToRestartAnimationDuration);
    };
  }

  render() {
    const {
      state: {
        controlsNotReady,
        currentAnimationId,
        controlsReadyTimeoutNotSet,
        classNames: {
          restartConfirmation: restartConfirmationClassName,
          outer: outerClassName,
        },
      },
      name,
      onSparkle,
      onTwirl,
      onSupernova,
      setRestartConfirmationActive,
      setRestartConfirmationInactive,
      confirmRestart,
    } = this;
    if (controlsReadyTimeoutNotSet) {
      setTimeoutBetter(() => this.setState({
        controlsNotReady: false,
      }), bornStarCanvasAnimationDuration);
      this.setState({ controlsReadyTimeoutNotSet: false });
    }
    const animationInProgress = currentAnimationId != null;
    return (
      <div className={outerClassName}>
        <Inert inert={restartConfirmationClassName !== 'hiddenStill'}>
          <ScalingSection
            topFreeSpace={0.5}
            leftUnits={starCanvasLeft}
            widthUnits={starCanvasWidth}
            heightUnits={starCanvasWidth}
          >
            <div className='bornStarCanvas'>
              <StarCanvas/>
            </div>
          </ScalingSection>
          <Inert inert={controlsNotReady}>
            <ScalingSection
              topFreeSpace={0.5}
              leftUnits={newStarButtonLeft}
              widthUnits={newStarButtonDiameter}
              heightUnits={newStarButtonDiameter}
            >
              <img
                draggable={false}
                src={getBlob(addButton)}
                alt='New star'
                className='newStarButton'
                onClick={setRestartConfirmationActive}
              />
            </ScalingSection>
            <ScalingSection
              topFreeSpace={0.5}
              topUnits={controlPanelTop}
              heightUnits={controlPaneHeight}
            >
              <div className='bornStarControlPanel'>
                <p className='starName bornStarName'>{name}</p>
                <ScalingSectionRelative
                  topUnits={buttonUpperTop}
                  widthUnits={animationButtonWidth}
                  heightUnits={animationButtonHeight}
                >
                  <div
                    className={sparkleButtonClassName({ animationInProgress, currentAnimationId })}
                    onClick={animationInProgress ? undefined : onSparkle}
                  >
                    <AnimationButtonIcon index={0}/>
                  </div>
                </ScalingSectionRelative>
                <ScalingSectionRelative
                  leftUnits={buttonRightLeft}
                  topUnits={buttonUpperTop}
                  widthUnits={animationButtonWidth}
                  heightUnits={animationButtonHeight}
                >
                  <div
                    className={twirlButtonClassName({ animationInProgress, currentAnimationId })}
                    onClick={animationInProgress ? undefined : onTwirl}
                  >
                    <AnimationButtonIcon index={1}/>
                  </div>
                </ScalingSectionRelative>
                <ScalingSectionRelative
                  leftUnits={buttonMiddleLeft}
                  topUnits={buttonLowerTop}
                  widthUnits={animationButtonWidth}
                  heightUnits={animationButtonHeight}
                >
                  <div
                    className={
                      supernovaButtonClassName({ animationInProgress, currentAnimationId })
                    }
                    onClick={animationInProgress ? undefined : onSupernova}
                  >
                    <AnimationButtonIcon index={2}/>
                  </div>
                </ScalingSectionRelative>
              </div>
            </ScalingSection>
          </Inert>
        </Inert>
        <Inert
          className={restartConfirmationClassName}
          inert={restartConfirmationClassName !== 'restartConfirmation'}
          onClick={preventChildrenFromCalling(setRestartConfirmationInactive)}
        >
          <ScalingSection
            topFreeSpace={0.5}
            topUnits={restartConfirmationTop}
            widthUnits={unitsHorizontalInner}
            heightUnits={restartConfirmationHeight}
          >
            <div className='restartConfirmationFrame'>
              <ScalingSectionRelative
                leftUnits={restartConfirmationPadding}
                topUnits={restartConfirmationPadding}
                widthUnits={restartConfirmationInnerWidth}
                heightUnits={restartConfirmationMessageHeight}
              >
                <p className='wouldYouLikeToMakeANewStar'>Would you like to make a new star?</p>
                <p>You would lose the ability to interact with your current star!</p>
              </ScalingSectionRelative>
              <ScalingSectionRelative
                leftUnits={restartConfirmationPadding}
                topUnits={restartConfirmationButtonTop}
                widthUnits={restartConfirmationButtonWidth}
                heightUnits={restartConfirmationButtonHeight}
              >
                <button className='outlined' onClick={confirmRestart}>Yes</button>
              </ScalingSectionRelative>
              <ScalingSectionRelative
                leftUnits={restartConfirmationButtonRightLeft}
                topUnits={restartConfirmationButtonTop}
                widthUnits={restartConfirmationButtonWidth}
                heightUnits={restartConfirmationButtonHeight}
              >
                <button className='outlined' onClick={setRestartConfirmationInactive}>Cancel</button>
              </ScalingSectionRelative>
            </div>
          </ScalingSection>
        </Inert>
      </div>
    );
  }
}

BornStarScreen.propTypes = {
  starData: PropTypes.object,
  onSparkle: PropTypes.func,
  onTwirl: PropTypes.func,
  onSupernova: PropTypes.func,
  onConfirmRestart: PropTypes.func,
};

module.exports = BornStarScreen;
