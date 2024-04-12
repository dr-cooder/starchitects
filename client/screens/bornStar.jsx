const React = require('react');
const { Component } = require('react');
const PropTypes = require('prop-types');
const { Inert, ScalingSection, StarCanvas } = require('../components');
const { unitsHorizontalInner, unitsVerticalInner } = require('../measurements.js');
const { preventChildrenFromCalling } = require('../../common/helpers.js');

const starCanvasWidth = 210;
const buttonHeight = 40;
const buttonSpacing = 24;
const controlPanelTop = 218;

const starCanvasLeft = (unitsHorizontalInner - starCanvasWidth) / 2;
const buttonTop = unitsVerticalInner - buttonHeight;
const buttonWidth = (unitsHorizontalInner - buttonSpacing * 2) / 3;
const middleButtonOffset = buttonWidth + buttonSpacing;
const rightButtonOffset = middleButtonOffset * 2;
const controlPaneHeight = unitsVerticalInner - controlPanelTop;

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
      },
      name,
      onSparkle,
      onTwirl,
      onSupernova,
    } = this;
    return (
      <>
        <ScalingSection
          topFreeSpace={0.5}
          leftUnits={starCanvasLeft}
          widthUnits={starCanvasWidth}
          heightUnits={starCanvasWidth}
        >
          <div
            className='bornStarCanvas'
            onAnimationEnd={preventChildrenFromCalling(() => this.setState({
              controlsNotReady: false,
            }))}
          >
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
          </Inert>
        </ScalingSection>
        <ScalingSection
          topUnits={buttonTop}
          topFreeSpace={1}
          widthUnits={buttonWidth}
          heightUnits={buttonHeight}
        >
          <button
            className='outlined'
            onClick={onSparkle}
            disabled={animationInProgress}
          >
            Sparkle
          </button>
        </ScalingSection>
        <ScalingSection
          leftUnits={middleButtonOffset}
          topUnits={buttonTop}
          topFreeSpace={1}
          widthUnits={buttonWidth}
          heightUnits={buttonHeight}
        >
          <button
            className='outlined'
            onClick={onTwirl}
            disabled={animationInProgress}
          >
            Twirl
          </button>
        </ScalingSection>
        <ScalingSection
          leftUnits={rightButtonOffset}
          topUnits={buttonTop}
          topFreeSpace={1}
          widthUnits={buttonWidth}
          heightUnits={buttonHeight}
        >
          <button
            className='outlined'
            onClick={onSupernova}
            disabled={animationInProgress}
          >
            Supernova
          </button>
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
