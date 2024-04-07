const React = require('react');
const { Component, createRef } = require('react');
const PropTypes = require('prop-types');
const { starCanvasWidth, starCanvasHeight } = require('../../common/compositing.js');
const compositeWorkerManager = require('../compositeWorkerManager.js');

class StarCanvas extends Component {
  constructor(props) {
    super(props);

    this.canvasRef = createRef();
  }

  componentDidMount() {
    const canvasEl = this.canvasRef.current;
    const ctx = canvasEl.getContext('2d');
    const mainLoop = () => {
      requestAnimationFrame(() => mainLoop());
      ctx.clearRect(0, 0, starCanvasWidth, starCanvasHeight);
      ctx.drawImage(
        compositeWorkerManager.compositeCanvas,
        0,
        0,
        starCanvasWidth,
        starCanvasHeight,
      );
    };
    mainLoop();
  }

  render() {
    return (
      <canvas
        ref={this.canvasRef}
        className='starCanvas'
        width={starCanvasWidth}
        height={starCanvasHeight}
      />
    );
  }
}

StarCanvas.propTypes = {
  initialSize: PropTypes.number,
};

module.exports = StarCanvas;
