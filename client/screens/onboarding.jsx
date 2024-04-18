const React = require('react');
const { useState } = require('react');
const PropTypes = require('prop-types');
const { Inert, ScalingSection } = require('../components/index.js');
const { unitsVerticalInner } = require('../measurements.js');
const { setTimeoutBetter } = require('../../common/helpers.js');

const inAnimationDuration = 1500;
const outAnimationDuration = 750;
const textHeight = 190;
const buttonHeight = 40;

const textTop = (unitsVerticalInner - textHeight - buttonHeight) / 2;
const buttonTop = unitsVerticalInner - buttonHeight;

const animationClassNames = {
  goingIn: {
    text: 'onboardingTextIn',
    button: 'outlined onboardingButtonIn',
  },
  idle: {
    text: 'onboardingTextIn',
    button: 'outlined onboardingButtonIn',
  },
  goingOut: {
    text: 'onboardingTextOut',
    button: 'outlined pressed onboardingButtonOut',
  },
};

const OnboardingScreen = ({ onCreateStar/* , onSimulateRoom, onSkipQuiz */ }) => {
  const { goingIn, idle, goingOut } = animationClassNames;
  const [animationClassName, setAnimationClassName] = useState(goingIn);
  const [idleTimeoutNotSet, setIdleTimeoutNotSet] = useState(true);
  const {
    text: textClassName,
    button: buttonClassName,
  } = animationClassName;
  if (idleTimeoutNotSet) {
    setTimeoutBetter(() => setAnimationClassName(idle), inAnimationDuration);
    setIdleTimeoutNotSet(false);
  }
  return (
    <Inert inert={animationClassName !== idle}>
      <ScalingSection
        topUnits={textTop}
        topFreeSpace={0.5}
        heightUnits={textHeight}
      >
        <div className={textClassName}>
          <p className='header showUsYourShine'>Show us <span className='emphasized'>your</span> shine!</p>
          <p>Every atom that makes up your body was created from a star before Earth
            was even born. We are all made up of <span className='emphasized'>stardust</span>.</p>
          <p>But we want to know what makes <span className='emphasized'>you</span> shine.
            To do that, let&apos;s get to know you.</p>
        </div>
      </ScalingSection>
      <ScalingSection
        topUnits={buttonTop}
        topFreeSpace={1}
        heightUnits={buttonHeight}
      >
        <button
          className={buttonClassName}
          onClick={() => {
            setTimeoutBetter(onCreateStar, outAnimationDuration);
            setAnimationClassName(goingOut);
          }}
        >
          Begin Survey
        </button>
      </ScalingSection>
    </Inert>
  );
};

/* <ScalingSection
  heightUnits={buttonHeight}
>
  <button className='outlined' onClick={onSimulateRoom}>(DEBUG) Room Sim</button>
</ScalingSection>
<ScalingSection
  heightUnits={buttonHeight}
  topUnits={buttonHeight}
>
  <button className='outlined' onClick={() => onSkipQuiz('00000')}>
    (DEBUG) Skip Quiz (Thinker)
  </button>
</ScalingSection> */

OnboardingScreen.propTypes = {
  onCreateStar: PropTypes.func,
  onSimulateRoom: PropTypes.func,
  onSkipQuiz: PropTypes.func,
};

module.exports = OnboardingScreen;
