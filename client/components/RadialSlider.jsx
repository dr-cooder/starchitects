/*
TODO: Implement this pseudocode (all these events should be on the entire document)
(THESE ASSUME THE CANVAS IS NOT MOVING RELATIVE TO THE DOCUMENT DURING THE SLIDER SECTIONS)
(THIS SHOULD PROBABLY BE SEPARATE FROM AND OVER THE STARCANVAS BASED ON THE COMPS)
On touch down:
 If there is no active touch:
  If the event is touchdown:
   Find the first e.changedTouches within the circle handle
   If found, set the active touch to its identifier prop
   and offset to the offset from the current handle center
  Else if the event is mousedown:
   If the mouse is within the circle handle, set the active touch to mouse
   and offset to the offset from the current handle center
On touch move:
 If active touch is touchscreen and e.type is touchdown or touchmove and
 one of e.changedTouches has an identifier prop matching the active touch:
  Get rawX and rawY from e.changedTouches of index corresponding to active touch
 Else if active touch is mouse and e.type is mousedown or mousemove:
  Get rawX and rawY from e itself
 If rawX and rawY were determined:
  Use them and the offset to determine the new handle position
On touch up:
 Basically the same as touch move but instead of setting rawX and rawY
 we unset active touch and handle offset
*/

/*
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
*/

const React = require('react');
const { Component } = require('react');
const PropTypes = require('prop-types');
const {
  unitsHorizontalInnerHalf,
  unitsHorizontalOuter,
  unitsHorizontalOuterHalf,
  unitsPaddingHorizontal,
} = require('../measurements.js');

const controllerFilterRadius = 26;
const controllerFilterDiameter = controllerFilterRadius * 2;

class RadialSlider extends Component {
  constructor(props) {
    super(props);

    const { clamp, initialValue, onChange } = props;
    this.clamp = !!clamp;
    this.onChange = onChange ?? (() => {});

    let initialValueFinal = Number(initialValue) || 0;
    if (initialValueFinal !== 0) {
      const initialValueMod1 = initialValueFinal % 1;
      const initialValueWrapped = initialValueMod1 < 0 ? 1 + initialValueMod1 : initialValueMod1;
      initialValueFinal = clamp && initialValueWrapped === 0 ? 1 : initialValueWrapped;
    }
    const initialValueFinalRadians = initialValueFinal * 2 * Math.PI;
    this.state = {
      value: initialValueFinal,
      valueGtHalf: initialValueFinal > 0.5,
      controllerX: (
        unitsHorizontalOuterHalf + unitsHorizontalInnerHalf * Math.sin(initialValueFinalRadians)
      ),
      controllerY: (
        unitsHorizontalOuterHalf - unitsHorizontalInnerHalf * Math.cos(initialValueFinalRadians)
      ),
    };
  }

  componentDidMount() {
    // Pseudocode implementation goes here
  }

  render() {
    const {
      clamp,
      state: {
        value,
        valueGtHalf,
        controllerX,
        controllerY,
      },
    } = this;
    // https://stackoverflow.com/questions/5736398/how-to-calculate-the-svg-path-for-an-arc-of-a-circle
    // https://css-tricks.com/my-struggle-to-use-and-animate-a-conic-gradient-in-svg/
    return (
      <svg
        viewBox={`0 0 ${unitsHorizontalOuter} ${unitsHorizontalOuter}`}
        xmlns='http://www.w3.org/2000/svg'
      >
        <defs>
          {clamp && <mask id='mask'>
            <rect x='0' y='0' width={unitsHorizontalOuter} height={unitsHorizontalOuter} fill='black'/>
            {value === 1
              ? <circle cx={unitsHorizontalOuterHalf} cy={unitsHorizontalOuterHalf} r={unitsHorizontalInnerHalf} stroke='white' strokeWidth='4' fill='none'/>
              : <path d={`M ${controllerX} ${controllerY} A ${unitsHorizontalInnerHalf} ${unitsHorizontalInnerHalf} 0 ${Number(valueGtHalf)} 0 ${unitsHorizontalOuterHalf} ${unitsPaddingHorizontal}`} stroke='white' strokeWidth='4' fill='none'/>
            }
          </mask>}
          <filter
            id='filter'
            x={controllerX - controllerFilterRadius}
            y={controllerY - controllerFilterRadius}
            width={controllerFilterDiameter}
            height={controllerFilterDiameter}
            filterUnits='userSpaceOnUse'
            colorInterpolationFilters='sRGB'
          >
            <feFlood floodOpacity='0' result='BackgroundImageFix'/>
            <feColorMatrix in='SourceAlpha' type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0' result='hardAlpha'/>
            <feOffset/>
            <feGaussianBlur stdDeviation='5'/>
            <feComposite in2='hardAlpha' operator='out'/>
            <feColorMatrix type='matrix' values='0 0 0 0 1 0 0 0 0 0.4 0 0 0 0 0 0 0 0 1 0'/>
            <feBlend mode='normal' in2='BackgroundImageFix' result='effect1_dropShadow_604_4493'/>
            <feBlend mode='normal' in='SourceGraphic' in2='effect1_dropShadow_604_4493' result='shape'/>
          </filter>
        </defs>
        <circle
          id='radial-slider-circle'
          cx={unitsHorizontalOuterHalf}
          cy={unitsHorizontalOuterHalf}
          r={unitsHorizontalInnerHalf}
          strokeWidth='2' fill='none'
        />
        {clamp && <foreignObject x='0' y='0' width={unitsHorizontalOuter} height={unitsHorizontalOuter} mask='url(#mask)'>
          <div style={{ width: '100%', height: '100%' }} id='radial-slider-amount-color' xmlns='http://www.w3.org/1999/xhtml'/>
        </foreignObject>}
        <circle id='radial-slider-controller-outer' cx={controllerX} cy={controllerY} r='13.5' strokeWidth='5' filter='url(#filter)'/>
        <circle id='radial-slider-controller-inner' cx={controllerX} cy={controllerY} r='8'/>
      </svg>
    );
  }
}

RadialSlider.propTypes = {
  clamp: PropTypes.bool,
  initialValue: PropTypes.number,
  onChange: PropTypes.func,
};

module.exports = RadialSlider;
