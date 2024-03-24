// const React = require('react');
const { Component } = require('react');
const PropTypes = require('prop-types');

class ChangingScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeScreen: props.initialScreen,
    };

    this.changeScreen = (newScreen) => {
      this.setState({ activeScreen: newScreen });
    };
  }

  render() {
    return this.state.activeScreen;
  }
}

ChangingScreen.propTypes = {
  initialScreen: PropTypes.node,
};

module.exports = ChangingScreen;
