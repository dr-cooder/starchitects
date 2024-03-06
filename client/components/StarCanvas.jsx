const React = require('react');
const { Component, createRef } = require('react');
const PropTypes = require('prop-types');
const {
  starCanvasWidth,
  starCanvasHeight,
  starCanvasWidthHalf,
  starCanvasHeightHalf,
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
    // TODO: The Star canvas should be able to set the customization parameters
    // on its own via its on touch events
    this.setSize = (newSize) => this.setState({ size: newSize });
    // This method should remain, though
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

    // TODO: Implement this pseudocode (all these events should be on the entire document)
    // (THESE ASSUME THE CANVAS IS NOT MOVING RELATIVE TO THE DOCUMENT DURING THE SLIDER SECTIONS)
    // On touch down:
    //  If there is no active touch:
    //   If the event is touchdown:
    //    Find the first e.changedTouches within the circle handle
    //    If found, set the active touch to its identifier prop
    //    and offset to the offset from the current handle center
    //   Else if the event is mousedown:
    //    If the mouse is within the circle handle, set the active touch to mouse
    //    and offset to the offset from the current handle center
    // On touch move:
    //  If active touch is touchscreen and e.type is touchdown or touchmove and
    //  one of e.changedTouches has an identifier prop matching the active touch:
    //   Get rawX and rawY from e.changedTouches of index corresponding to active touch
    //  Else if active touch is mouse and e.type is mousedown or mousemove:
    //   Get rawX and rawY from e itself
    //  If rawX and rawY were determined:
    //   Use them and the offset to determine the new handle position
    // On touch up:
    //  Basically the same as touch move but instead of setting rawX and rawY
    //  we unset active touch and handle offset

    const getMouse = (e) => {
      const mouse = {};
      let rawX;
      let rawY;

      switch (e.type) {
        case 'touchdown':
        case 'touchmove':
          rawX = e.touches[0].pageX;
          rawY = e.touches[0].pageY;
          break;
        case 'mousedown':
        case 'mousemove':
        default:
          rawX = e.pageX;
          rawY = e.pageY;
          break;
      }

      mouse.x = (rawX - canvasEl.offsetLeft)
        * (starCanvasWidth / canvasEl.offsetWidth) - starCanvasWidthHalf;
      mouse.y = (rawY - canvasEl.offsetTop)
        * (starCanvasHeight / canvasEl.offsetHeight) - starCanvasHeightHalf;

      return mouse;
    };
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
