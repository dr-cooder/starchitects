const React = require('react');
const { Component, createRef } = require('react');
const PropTypes = require('prop-types');
const { AnimatePresence, motion } = require('framer-motion');

class AnimatedChangingScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      timesScreenWasChanged: 0,
    };

    this.activeScreen = props.initialScreen;
    this.motionDivRef = createRef();
    this.changeScreen = (newScreen) => {
      this.setState({ timesScreenWasChanged: this.state.timesScreenWasChanged + 1 });
      this.activeScreen = newScreen;
    };
  }

  render() {
    return (
      <AnimatePresence mode='wait'>
        <motion.div
          key={this.state.timesScreenWasChanged}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5 }}
          // Screens shouldn't be interactible during fade in/out
          // https://stackblitz.com/edit/react-inert-demo
          ref={this.motionDivRef}
          onAnimationStart={() => this.motionDivRef.current.setAttribute('inert', '')}
          onAnimationComplete={() => this.motionDivRef.current.removeAttribute('inert')}
        >
          {this.activeScreen}
        </motion.div>
      </AnimatePresence>
    );
  }
}

AnimatedChangingScreen.propTypes = {
  initialScreen: PropTypes.element,
};

module.exports = AnimatedChangingScreen;
