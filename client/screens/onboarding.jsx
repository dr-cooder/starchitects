const React = require('react');
const { useState } = require('react');
const PropTypes = require('prop-types');
const { Inert, ScalingSection } = require('../components/index.js');
const { unitsVerticalInner } = require('../measurements.js');
const { preventChildrenFromCalling } = require('../../common/helpers.js');

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

const OnboardingScreen = ({ onCreateStar, onSimulateRoom }) => {
  const { goingIn, idle, goingOut } = animationClassNames;
  const [animationClassName, setAnimationClassName] = useState(goingIn);
  const {
    text: textClassName,
    button: buttonClassName,
  } = animationClassName;
  return (
    <Inert inert={animationClassName !== idle}>
      <ScalingSection
        topUnits={textTop}
        topFreeSpace={0.5}
        heightUnits={textHeight}
      >
        <div
          className={textClassName}
          onAnimationEnd={preventChildrenFromCalling(() => {
            if (animationClassName === goingIn) {
              setAnimationClassName(idle);
            } else {
              onCreateStar();
            }
          })}
        >
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
            setAnimationClassName(goingOut);
          }}
        >
          Begin Survey
        </button>
      </ScalingSection>
      <ScalingSection
        heightUnits={buttonHeight}
      >
        <button className='outlined' onClick={onSimulateRoom}>(DEBUG) Room Sim</button>
      </ScalingSection>
    </Inert>
  );
};

OnboardingScreen.propTypes = {
  onCreateStar: PropTypes.func,
  onSimulateRoom: PropTypes.func,
};

module.exports = OnboardingScreen;
