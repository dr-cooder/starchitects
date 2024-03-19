const React = require('react');
const { Component, createRef } = require('react');
const PropTypes = require('prop-types');
const {
  starCanvasWidth,
  starCanvasHeight,
  starMinWidth,
  starMinHeight,
  starMinX,
  starMinY,
  starMaxWidth,
  starMaxHeight,
  starMaxX,
  starMaxY,
} = require('../../common/compositing.js');
const { lerp } = require('../../common/helpers.js');
const compositeWorkerManager = require('../compositeWorkerManager.js');

class StarCanvas extends Component {
  constructor(props) {
    super(props);

    this.state = {
      size: props.initialSize ?? 0,
    };

    this.canvasRef = createRef();
    this.setSize = (newSize) => this.setState({ size: newSize });
    this.getCustomization = () => ({
      color: compositeWorkerManager.getColor(),
      size: this.state.size,
      shade: compositeWorkerManager.getShade(),
    });
  }

  componentDidMount() {
    const canvasEl = this.canvasRef.current;
    // Checks for the ability to use canvas (and video within canvas)
    // are to be done during the initial load
    const ctx = canvasEl.getContext('2d');

    const mainLoop = () => {
      requestAnimationFrame(() => mainLoop());
      const { size } = this.state;
      ctx.clearRect(0, 0, starCanvasWidth, starCanvasHeight);
      ctx.drawImage(
        compositeWorkerManager.compositeCanvas,
        lerp(starMinX, starMaxX, size),
        lerp(starMinY, starMaxY, size),
        lerp(starMinWidth, starMaxWidth, size),
        lerp(starMinHeight, starMaxHeight, size),
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
