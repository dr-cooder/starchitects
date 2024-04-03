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
    ctx.font = '30px Arial';
    ctx.fillStyle = 'red';
    const mainLoop = () => {
      requestAnimationFrame(() => mainLoop());
      ctx.clearRect(0, 0, starCanvasWidth, starCanvasHeight);
      ctx.drawImage(
        compositeWorkerManager.starCompositeCanvas,
        0,
        0,
        starCanvasWidth,
        starCanvasHeight,
      );
      ctx.fillText(compositeWorkerManager.getCompositeFPS(), 10, 50);
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
