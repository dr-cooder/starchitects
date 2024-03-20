const React = require('react');
const { Component, createRef } = require('react');
const PropTypes = require('prop-types');
const {
  starCanvasWidth,
  starCanvasHeight,
  starMinWidthPercent,
  starMinHeightPercent,
  starMinLeftPercent,
  starMinTopPercent,
  starMaxWidthPercent,
  starMaxHeightPercent,
  starMaxLeftPercent,
  starMaxTopPercent,
} = require('../../common/compositing.js');
const { lerp, percent } = require('../../common/helpers.js');
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
    const { size } = this.state;
    return (
      <canvas
        ref={this.canvasRef}
        className='starCanvas'
        width={starCanvasWidth}
        height={starCanvasHeight}
        style={{
          left: percent(lerp(starMinLeftPercent, starMaxLeftPercent, size)),
          top: percent(lerp(starMinTopPercent, starMaxTopPercent, size)),
          width: percent(lerp(starMinWidthPercent, starMaxWidthPercent, size)),
          height: percent(lerp(starMinHeightPercent, starMaxHeightPercent, size)),
        }}
      />
    );
  }
}

StarCanvas.propTypes = {
  initialSize: PropTypes.number,
};

module.exports = StarCanvas;
