const React = require('react');
const { Component } = require('react');
const PropTypes = require('prop-types');
const {
  AnimationButtonCooldown,
  AnimationButtonIcon,
  Inert,
  ScalingSection,
  ScalingSectionRelative,
  StarCanvas,
} = require('../components');
const { unitsHorizontalInner, unitsVerticalInner } = require('../measurements.js');
const { setTimeoutBetter } = require('../../common/helpers.js');

const bornStarCanvasAnimationDuration = 1000;
const starCanvasWidth = 210;
const buttonWidth = 100;
const buttonHeight = 111;
const buttonUpperTop = 76;
const controlPanelTop = 218;

const starCanvasLeft = (unitsHorizontalInner - starCanvasWidth) / 2;
const controlPaneHeight = unitsVerticalInner - controlPanelTop;
const buttonRightLeft = unitsHorizontalInner - buttonWidth;
const buttonMiddleLeft = buttonRightLeft / 2;
const buttonLowerTop = buttonUpperTop + buttonHeight;

class BornStarScreen extends Component {
  constructor(props) {
    super(props);
    const {
      starData: { name },
      onSparkle,
      onTwirl,
      onSupernova,
    } = props;

    this.state = {
      animationInProgress: false,
      controlsNotReady: true,
      controlsReadyTimeoutNotSet: true,
    };

    const startAnimation = (callback) => () => {
      this.setState({ animationInProgress: true });
      callback();
    };

    this.name = name;
    this.onSparkle = startAnimation(onSparkle);
    this.onTwirl = startAnimation(onTwirl);
    this.onSupernova = startAnimation(onSupernova);
    this.animationFinished = () => {
      this.setState({ animationInProgress: false });
    };
  }

  render() {
    const {
      state: {
        controlsNotReady,
        animationInProgress,
        controlsReadyTimeoutNotSet,
      },
      name,
      onSparkle,
      onTwirl,
      onSupernova,
    } = this;
    if (controlsReadyTimeoutNotSet) {
      setTimeoutBetter(() => this.setState({
        controlsNotReady: false,
      }), bornStarCanvasAnimationDuration);
      this.setState({ controlsReadyTimeoutNotSet: false });
    }
    const animationButtonClassName = animationInProgress ? 'animationButtonDisabled' : 'animationButtonEnabled';
    return (
      <>
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
        <ScalingSection
          topFreeSpace={0.5}
          topUnits={controlPanelTop}
          heightUnits={controlPaneHeight}
        >
          <Inert
            inert={controlsNotReady}
            className='bornStarControlPanel'
          >
            <p className='starName bornStarName'>{name}</p>
            <ScalingSectionRelative
              topUnits={buttonUpperTop}
              widthUnits={buttonWidth}
              heightUnits={buttonHeight}
            >
              <div
                className={animationButtonClassName}
                onClick={animationInProgress ? undefined : onSparkle}
              >
                <AnimationButtonIcon index={0}/>
              </div>
            </ScalingSectionRelative>
            <ScalingSectionRelative
              leftUnits={buttonRightLeft}
              topUnits={buttonUpperTop}
              widthUnits={buttonWidth}
              heightUnits={buttonHeight}
            >
              <div
                className={animationButtonClassName}
                onClick={animationInProgress ? undefined : onTwirl}
              >
                <AnimationButtonIcon index={1}/>
              </div>
            </ScalingSectionRelative>
            <ScalingSectionRelative
              leftUnits={buttonMiddleLeft}
              topUnits={buttonLowerTop}
              widthUnits={buttonWidth}
              heightUnits={buttonHeight}
            >
              <div
                className={animationButtonClassName}
                onClick={animationInProgress ? undefined : onSupernova}
              >
                <AnimationButtonIcon index={2}/>
              </div>
            </ScalingSectionRelative>
          </Inert>
        </ScalingSection>
      </>
    );
  }
}

BornStarScreen.propTypes = {
  starData: PropTypes.object,
  onSparkle: PropTypes.func,
  onTwirl: PropTypes.func,
  onSupernova: PropTypes.func,
};

module.exports = BornStarScreen;
