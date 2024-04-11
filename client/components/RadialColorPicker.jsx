const React = require('react');
const { Component, createRef } = require('react');
const PropTypes = require('prop-types');
const {
  unitsHorizontalInnerHalf,
  unitsHorizontalOuter,
  unitsHorizontalOuterHalf,
  unitsPaddingHorizontal,
} = require('../measurements.js');
const {
  ensureNumber,
  clamp01,
  num01ToRadianRange,
  numRadianTo01Range,
  num01ToDegreeRange,
  rgb01ToByteRange,
  colorToRGB,
  applyShadeToRGB,
  colorShadeToRGB,
  vectorLengthNoSqrt,
  commaJoin,
  square,
  isMouseEvent,
} = require('../../common/helpers.js');

const arcAngleRatio = 0.4;

const arcAngleRatioHalf = arcAngleRatio / 2;
const arcAngleDegrees = num01ToDegreeRange(arcAngleRatio);
const arcSemiCircleOffsetRatio = (0.25 - arcAngleRatioHalf);
const arcSemiCircleOffsetDegrees = num01ToDegreeRange(arcSemiCircleOffsetRatio);
const arcAngleRadiansHalf = num01ToRadianRange(arcAngleRatioHalf);

const arcEndDxUnit = Math.cos(arcAngleRadiansHalf);
const arcEndDyUnit = Math.sin(arcAngleRadiansHalf);
const arcEndDyDx = arcEndDyUnit / arcEndDxUnit;
const arcEndDx = arcEndDxUnit * unitsHorizontalInnerHalf;
const arcEndDy = arcEndDyUnit * unitsHorizontalInnerHalf;
const arcEndXMin = unitsHorizontalOuterHalf - arcEndDx;
const arcEndYMin = unitsHorizontalOuterHalf - arcEndDy;
const arcEndXMax = unitsHorizontalOuterHalf + arcEndDx;
const arcEndYMax = unitsHorizontalOuterHalf + arcEndDy;

const gradientStopInfosFunctionGenerator = (isShade) => {
  const granularity = isShade ? 1 : 6;
  const angleStart = (isShade ? 0 : 180) + arcSemiCircleOffsetDegrees;
  const rgbShadeFunctionGenerator = isShade
    ? (t) => (rgb) => [rgb, t]
    : (t) => {
      const rgb = colorToRGB(t);
      return (saturationValue) => [rgb, saturationValue];
    };
  const infoFunctions = [];
  for (let i = 0; i <= granularity; i++) {
    const rgbShadeFunction = rgbShadeFunctionGenerator(1 - i / granularity);
    const cssColorFunction = (cssColorInput) => {
      const [rgb, shade] = rgbShadeFunction(cssColorInput);
      return `rgb(${commaJoin(rgb01ToByteRange(applyShadeToRGB(rgb, shade)))})`;
    };
    const angles = `${!isShade && i === 0 ? '180deg ' : ''}${angleStart + arcAngleDegrees * (i / granularity)}deg${isShade && i === granularity ? ' 180deg' : ''}`;
    infoFunctions[i] = (cssColorInput) => `${cssColorFunction(cssColorInput)} ${angles}`;
  }
  return (cssColorInput) => commaJoin(infoFunctions.map(
    (infoFunction) => infoFunction(cssColorInput),
  ));
};

const colorGradientStopInfos = gradientStopInfosFunctionGenerator(false);

const shadeGradientStopInfos = gradientStopInfosFunctionGenerator(true);

const controllerFilterRadius = 26;
const controllerFilterDiameter = controllerFilterRadius * 2;
const arcEndContactRadius = unitsPaddingHorizontal;
const arcEndContactRadiusSquared = square(arcEndContactRadius);
const arcContactRadiusMinSquared = square(unitsHorizontalInnerHalf - arcEndContactRadius);
const arcContactRadiusMaxSquared = square(unitsHorizontalInnerHalf + arcEndContactRadius);

const controllerMoverTypes = {
  none: 0,
  mouse: 1,
  touch: 2,
};

const svgSpaceCenterToPointer = ({ pointer, svgBoxStart, svgBoxLength }) => (
  ((pointer - svgBoxStart) / svgBoxLength) * unitsHorizontalOuter - unitsHorizontalOuterHalf
);

const valueToControllerPosition = ({ value, isShade }) => {
  const radians = (2 * Math.PI) * (arcAngleRatio * value + arcSemiCircleOffsetRatio);
  const sign = (isShade ? 1 : -1);
  const unitX = sign * Math.sin(radians);
  const unitY = sign * Math.cos(radians);
  return {
    x: unitsHorizontalOuterHalf + unitsHorizontalInnerHalf * unitX,
    y: unitsHorizontalOuterHalf + unitsHorizontalInnerHalf * unitY,
  };
};

const arcSpacePointerToValue = ({ x, y, testContact = false }) => {
  const dontTestContact = !testContact;
  let value = null;
  if (dontTestContact && x < 0) {
    value = Math.sign(y) === 1 ? 1 : 0;
  } else {
    const pointerDyDx = y / x;
    const pointerDyDxSign = Math.sign(pointerDyDx);
    const pointerDyDxAbs = pointerDyDx * pointerDyDxSign;
    if (pointerDyDxAbs > arcEndDyDx) {
    // Outside of arc range: test overlap with respective end bevel
    // and determine if the value is min or max accordingly
      if (
        dontTestContact
      || vectorLengthNoSqrt([
        x - arcEndDx,
        y - arcEndDy * pointerDyDxSign,
      ]) < arcEndContactRadiusSquared
      ) {
        value = pointerDyDxSign === 1 ? 1 : 0;
      }
    } else {
    // Within arc range: test overlap with arc and use trigonometry for the value
      let updateValue = true;
      if (testContact) {
        const pointerDistanceNoSqrt = vectorLengthNoSqrt([x, y]);
        updateValue = (
          arcContactRadiusMinSquared <= pointerDistanceNoSqrt
        && pointerDistanceNoSqrt <= arcContactRadiusMaxSquared
        );
      }
      if (updateValue) {
        value = numRadianTo01Range(Math.atan(pointerDyDx)) / arcAngleRatio + 0.5;
      }
    }
  }
  return value;
};

const tryNewControllerMover = ({
  pointerX,
  pointerY,
  svgX,
  svgY,
  svgWidth,
  svgHeight,
  colorAllowed,
  shadeAllowed,
}) => {
  const svgSpaceCenterToPointerX = svgSpaceCenterToPointer({
    pointer: pointerX,
    svgBoxStart: svgX,
    svgBoxLength: svgWidth,
  });
  const svgSpaceCenterToPointerY = svgSpaceCenterToPointer({
    pointer: pointerY,
    svgBoxStart: svgY,
    svgBoxLength: svgHeight,
  });
  const svgSpaceCenterToPointerXSign = Math.sign(svgSpaceCenterToPointerX);
  const isShade = svgSpaceCenterToPointerXSign !== -1;
  let result = null;
  if (isShade ? shadeAllowed : colorAllowed) {
    const value = arcSpacePointerToValue({
      x: svgSpaceCenterToPointerX * svgSpaceCenterToPointerXSign,
      y: -svgSpaceCenterToPointerY * svgSpaceCenterToPointerXSign,
      testContact: true,
    });
    if (value !== null) {
      const { x: controllerX, y: controllerY } = valueToControllerPosition({ value, isShade });
      result = {
        value, isShade, controllerX, controllerY,
      };
    }
  }
  return result;
};

const ControllerFilter = ({
  id, x, y, r, g, b,
}) => (
  <filter
    id={id}
    x={x - controllerFilterRadius}
    y={y - controllerFilterRadius}
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
    <feColorMatrix type='matrix' values={`0 0 0 0 ${r} 0 0 0 0 ${g} 0 0 0 0 ${b} 0 0 0 1 0`}/>
    <feBlend mode='normal' in2='BackgroundImageFix' result='effect1_dropShadow_604_4493'/>
    <feBlend mode='normal' in='SourceGraphic' in2='effect1_dropShadow_604_4493' result='shape'/>
  </filter>
);

ControllerFilter.propTypes = {
  id: PropTypes.string,
  x: PropTypes.number,
  y: PropTypes.number,
  r: PropTypes.number,
  g: PropTypes.number,
  b: PropTypes.number,
};

const Controller = ({ filterId, x, y }) => (
  <>
    <circle className='radial-slider-controller-outer' cx={x} cy={y} r='13.5' strokeWidth='5' filter={`url(#${filterId})`}/>
    <circle className='radial-slider-controller-inner' cx={x} cy={y} r='8'/>
  </>
);

Controller.propTypes = {
  filterId: PropTypes.string,
  x: PropTypes.number,
  y: PropTypes.number,
};

class RadialColorPicker extends Component {
  constructor(props) {
    super(props);

    const {
      id, disabled, initialColorValue, initialShadeValue, onChange,
    } = props;
    this.onChange = onChange ?? (() => {});
    this.id = id;

    const colorValue = clamp01(ensureNumber(initialColorValue));
    const { x: colorX, y: colorY } = valueToControllerPosition({
      value: colorValue,
      isShade: false,
    });
    const shadeValue = clamp01(ensureNumber(initialShadeValue));
    const { x: shadeX, y: shadeY } = valueToControllerPosition({
      value: shadeValue,
      isShade: true,
    });
    const [rValue, gValue, bValue] = colorShadeToRGB(colorValue, shadeValue);
    this.state = {
      disabled,
      awaitingListenerUpdate: false,
      rValue,
      gValue,
      bValue,
      colorValue,
      colorX,
      colorY,
      colorMoverType: controllerMoverTypes.none,
      colorMoverTouchIdentifier: undefined,
      shadeValue,
      shadeX,
      shadeY,
      shadeMoverType: controllerMoverTypes.none,
      shadeMoverTouchIdentifier: undefined,
    };

    this.svgRef = createRef();

    const handlePointerDown = (event) => {
      const {
        none: noMoverType, mouse: mouseMoverType, touch: touchMoverType,
      } = controllerMoverTypes;
      const { colorMoverType, shadeMoverType } = this.state;
      let noColorMover = colorMoverType === noMoverType;
      let noShadeMover = shadeMoverType === noMoverType;
      if (noColorMover || noShadeMover) {
        const { onChange: onChangeCurrent } = this;
        const {
          x: svgX,
          y: svgY,
          width: svgWidth,
          height: svgHeight,
        } = this.svgRef.current.getBoundingClientRect();
        let {
          colorValue: newColorValue,
          colorX: newColorX,
          colorY: newColorY,
          colorMoverType: newColorMoverType,
          colorMoverTouchIdentifier: newColorMoverTouchIdentifier,
          shadeValue: newShadeValue,
          shadeX: newShadeX,
          shadeY: newShadeY,
          shadeMoverType: newShadeMoverType,
          shadeMoverTouchIdentifier: newShadeMoverTouchIdentifier,
        } = this.state;
        if (isMouseEvent(event)) {
          const {
            clientX: pointerX,
            clientY: pointerY,
          } = event;
          const newMouseMover = tryNewControllerMover({
            pointerX,
            pointerY,
            svgX,
            svgY,
            svgWidth,
            svgHeight,
            colorAllowed: noColorMover,
            shadeAllowed: noShadeMover,
          });
          if (newMouseMover !== null) {
            const {
              value, isShade, controllerX, controllerY,
            } = newMouseMover;
            if (isShade) {
              newShadeValue = value;
              newShadeX = controllerX;
              newShadeY = controllerY;
              newShadeMoverType = mouseMoverType;
            } else {
              newColorValue = value;
              newColorX = controllerX;
              newColorY = controllerY;
              newColorMoverType = mouseMoverType;
            }
          }
        } else {
          const { changedTouches } = event;
          for (let i = 0; i < changedTouches.length; i++) {
            const {
              identifier: touchIdentifier,
              clientX: pointerX,
              clientY: pointerY,
            } = changedTouches[i];
            const newTouchMover = tryNewControllerMover({
              pointerX,
              pointerY,
              svgX,
              svgY,
              svgWidth,
              svgHeight,
              colorAllowed: noColorMover,
              shadeAllowed: noShadeMover,
            });
            if (newTouchMover !== null) {
              const {
                value, isShade, controllerX, controllerY,
              } = newTouchMover;
              if (isShade) {
                newShadeValue = value;
                newShadeX = controllerX;
                newShadeY = controllerY;
                newShadeMoverType = touchMoverType;
                newShadeMoverTouchIdentifier = touchIdentifier;
                noShadeMover = false;
              } else {
                newColorValue = value;
                newColorX = controllerX;
                newColorY = controllerY;
                newColorMoverType = touchMoverType;
                newColorMoverTouchIdentifier = touchIdentifier;
                noColorMover = false;
              }
              if (!(noColorMover || noShadeMover)) break;
            }
          }
        }
        const [newRValue, newGValue, newBValue] = colorShadeToRGB(
          newColorValue,
          newShadeValue,
        );
        this.setState({
          rValue: newRValue,
          gValue: newGValue,
          bValue: newBValue,
          colorValue: newColorValue,
          colorX: newColorX,
          colorY: newColorY,
          colorMoverType: newColorMoverType,
          colorMoverTouchIdentifier: newColorMoverTouchIdentifier,
          shadeValue: newShadeValue,
          shadeX: newShadeX,
          shadeY: newShadeY,
          shadeMoverType: newShadeMoverType,
          shadeMoverTouchIdentifier: newShadeMoverTouchIdentifier,
        });
        onChangeCurrent({
          rgb: [newRValue, newGValue, newBValue],
          color: newColorValue,
          shade: newShadeValue,
        });
      }
    };

    const handlePointerMove = (event) => {
      const { mouse: mouseMoverType, touch: touchMoverType } = controllerMoverTypes;
      const { colorMoverType, shadeMoverType } = this.state;
      const eventIsMouseEvent = isMouseEvent(event);
      const expectedMoverType = eventIsMouseEvent ? mouseMoverType : touchMoverType;
      const colorMoverTypeMatchesExpected = colorMoverType === expectedMoverType;
      const shadeMoverTypeMatchesExpected = shadeMoverType === expectedMoverType;
      if (colorMoverTypeMatchesExpected || shadeMoverTypeMatchesExpected) {
        const { onChange: onChangeCurrent } = this;
        const {
          x: svgX,
          y: svgY,
          width: svgWidth,
          height: svgHeight,
        } = this.svgRef.current.getBoundingClientRect();
        let {
          colorValue: newColorValue,
          colorX: newColorX,
          colorY: newColorY,
          shadeValue: newShadeValue,
          shadeX: newShadeX,
          shadeY: newShadeY,
        } = this.state;
        if (eventIsMouseEvent) {
          const {
            clientX: pointerX,
            clientY: pointerY,
          } = event;
          const svgSpaceCenterToPointerX = svgSpaceCenterToPointer({
            pointer: pointerX,
            svgBoxStart: svgX,
            svgBoxLength: svgWidth,
          });
          const svgSpaceCenterToPointerY = svgSpaceCenterToPointer({
            pointer: pointerY,
            svgBoxStart: svgY,
            svgBoxLength: svgHeight,
          });
          if (colorMoverTypeMatchesExpected) {
            newColorValue = arcSpacePointerToValue({
              x: -svgSpaceCenterToPointerX,
              y: svgSpaceCenterToPointerY,
              testContact: false,
            });
            const { x, y } = valueToControllerPosition({
              value: newColorValue,
              isShade: false,
            });
            newColorX = x;
            newColorY = y;
          }
          if (shadeMoverTypeMatchesExpected) {
            newShadeValue = arcSpacePointerToValue({
              x: svgSpaceCenterToPointerX,
              y: -svgSpaceCenterToPointerY,
              testContact: false,
            });
            const { x, y } = valueToControllerPosition({
              value: newShadeValue,
              isShade: true,
            });
            newShadeX = x;
            newShadeY = y;
          }
        } else {
          const changedTouchArray = [...event.changedTouches];
          if (colorMoverTypeMatchesExpected) {
            const { colorMoverTouchIdentifier } = this.state;
            const colorMoverTouch = changedTouchArray.find(
              (touch) => touch.identifier === colorMoverTouchIdentifier,
            );
            if (colorMoverTouch !== undefined) {
              const {
                clientX: pointerX,
                clientY: pointerY,
              } = colorMoverTouch;
              newColorValue = arcSpacePointerToValue({
                x: -svgSpaceCenterToPointer({
                  pointer: pointerX,
                  svgBoxStart: svgX,
                  svgBoxLength: svgWidth,
                }),
                y: svgSpaceCenterToPointer({
                  pointer: pointerY,
                  svgBoxStart: svgY,
                  svgBoxLength: svgHeight,
                }),
                testContact: false,
              });
              const { x, y } = valueToControllerPosition({
                value: newColorValue,
                isShade: false,
              });
              newColorX = x;
              newColorY = y;
            }
          }
          if (shadeMoverTypeMatchesExpected) {
            const { shadeMoverTouchIdentifier } = this.state;
            const shadeMoverTouch = changedTouchArray.find(
              (touch) => touch.identifier === shadeMoverTouchIdentifier,
            );
            if (shadeMoverTouch !== undefined) {
              const {
                clientX: pointerX,
                clientY: pointerY,
              } = shadeMoverTouch;
              newShadeValue = arcSpacePointerToValue({
                x: svgSpaceCenterToPointer({
                  pointer: pointerX,
                  svgBoxStart: svgX,
                  svgBoxLength: svgWidth,
                }),
                y: -svgSpaceCenterToPointer({
                  pointer: pointerY,
                  svgBoxStart: svgY,
                  svgBoxLength: svgHeight,
                }),
                testContact: false,
              });
              const { x, y } = valueToControllerPosition({
                value: newShadeValue,
                isShade: true,
              });
              newShadeX = x;
              newShadeY = y;
            }
          }
        }
        const [newRValue, newGValue, newBValue] = colorShadeToRGB(
          newColorValue,
          newShadeValue,
        );
        this.setState({
          rValue: newRValue,
          gValue: newGValue,
          bValue: newBValue,
          colorValue: newColorValue,
          colorX: newColorX,
          colorY: newColorY,
          shadeValue: newShadeValue,
          shadeX: newShadeX,
          shadeY: newShadeY,
        });
        onChangeCurrent({
          rgb: [newRValue, newGValue, newBValue],
          color: newColorValue,
          shade: newShadeValue,
        });
      }
    };

    const handlePointerUp = (event) => {
      const {
        none: noMoverType, mouse: mouseMoverType, touch: touchMoverType,
      } = controllerMoverTypes;
      const { colorMoverType, shadeMoverType } = this.state;
      const eventIsMouseEvent = isMouseEvent(event);
      const expectedMoverType = eventIsMouseEvent ? mouseMoverType : touchMoverType;
      const colorMoverTypeMatchesExpected = colorMoverType === expectedMoverType;
      const shadeMoverTypeMatchesExpected = shadeMoverType === expectedMoverType;
      if (colorMoverTypeMatchesExpected || shadeMoverTypeMatchesExpected) {
        let {
          colorMoverType: newColorMoverType,
          colorMoverTouchIdentifier: newColorMoverTouchIdentifier,
          shadeMoverType: newShadeMoverType,
          shadeMoverTouchIdentifier: newShadeMoverTouchIdentifier,
        } = this.state;
        if (isMouseEvent(event)) {
          if (colorMoverTypeMatchesExpected) {
            newColorMoverType = noMoverType;
          }
          if (shadeMoverTypeMatchesExpected) {
            newShadeMoverType = noMoverType;
          }
        } else {
          const changedTouchArray = [...event.changedTouches];
          if (colorMoverTypeMatchesExpected) {
            const { colorMoverTouchIdentifier } = this.state;
            const colorMoverTouch = changedTouchArray.find(
              (touch) => touch.identifier === colorMoverTouchIdentifier,
            );
            if (colorMoverTouch !== undefined) {
              newColorMoverType = noMoverType;
              newColorMoverTouchIdentifier = undefined;
            }
          }
          if (shadeMoverTypeMatchesExpected) {
            const { shadeMoverTouchIdentifier } = this.state;
            const shadeMoverTouch = changedTouchArray.find(
              (touch) => touch.identifier === shadeMoverTouchIdentifier,
            );
            if (shadeMoverTouch !== undefined) {
              newShadeMoverType = noMoverType;
              newShadeMoverTouchIdentifier = undefined;
            }
          }
        }
        this.setState({
          colorMoverType: newColorMoverType,
          colorMoverTouchIdentifier: newColorMoverTouchIdentifier,
          shadeMoverType: newShadeMoverType,
          shadeMoverTouchIdentifier: newShadeMoverTouchIdentifier,
        });
      }
    };

    this.updateListeners = () => {
      // console.log('updating listeners');

      const { addEventListener, removeEventListener } = document;
      const eventListenerMutator = this.state.disabled ? removeEventListener : addEventListener;

      eventListenerMutator('mousedown', handlePointerDown);
      eventListenerMutator('touchstart', handlePointerDown);

      eventListenerMutator('mousemove', handlePointerMove);
      eventListenerMutator('touchmove', handlePointerMove);

      eventListenerMutator('mouseleave', handlePointerUp);
      eventListenerMutator('mouseup', handlePointerUp);
      eventListenerMutator('touchcancel', handlePointerUp);
      eventListenerMutator('touchend', handlePointerUp);

      this.setState({ awaitingListenerUpdate: false });
    };

    this.getValue = () => {
      const {
        onChange: onChangeCurrent,
        state: {
          rValue: rValueCurrent,
          gValue: gValueCurrent,
          bValue: bValueCurrent,
          colorValue: colorValueCurrent,
          shadeValue: shadeValueCurrent,
        },
      } = this;
      onChangeCurrent({
        rgb: [rValueCurrent, gValueCurrent, bValueCurrent],
        color: colorValueCurrent,
        shade: shadeValueCurrent,
      });
    };
  }

  static getDerivedStateFromProps({ disabled }, { disabled: previousDisabled }) {
    return {
      disabled,
      awaitingListenerUpdate: disabled !== previousDisabled,
    };
  }

  componentDidMount() {
    const { state: { disabled }, updateListeners } = this;
    if (!disabled) updateListeners();
  }

  componentWillUnmount() {
    const { state: { disabled }, updateListeners } = this;
    if (disabled) updateListeners();
  }

  render() {
    const {
      id,
      state: {
        awaitingListenerUpdate,
        rValue,
        gValue,
        bValue,
        colorValue,
        colorX,
        colorY,
        shadeValue,
        shadeX,
        shadeY,
      },
      updateListeners,
    } = this;
    if (awaitingListenerUpdate) updateListeners();
    const rgb = colorToRGB(colorValue);

    const colorFilterId = `${id}ColorFilter`;
    const shadeFilterId = `${id}ShadeFilter`;
    // https://stackoverflow.com/questions/5736398/how-to-calculate-the-svg-path-for-an-arc-of-a-circle
    // https://css-tricks.com/my-struggle-to-use-and-animate-a-conic-gradient-in-svg/
    return (
      <svg
        viewBox={`0 0 ${unitsHorizontalOuter} ${unitsHorizontalOuter}`}
        ref={this.svgRef} xmlns='http://www.w3.org/2000/svg'
      >
        <defs>
          <mask id='mask'>
            <rect x='0' y='0' width={unitsHorizontalOuter} height={unitsHorizontalOuter} fill='black'/>
            <path d={`M ${arcEndXMin} ${arcEndYMin} A ${unitsHorizontalInnerHalf} ${unitsHorizontalInnerHalf} 0 0 0 ${arcEndXMin} ${arcEndYMax}`} stroke='white' strokeWidth='4' fill='none'/>
            <path d={`M ${arcEndXMax} ${arcEndYMax} A ${unitsHorizontalInnerHalf} ${unitsHorizontalInnerHalf} 0 0 0 ${arcEndXMax} ${arcEndYMin}`} stroke='white' strokeWidth='4' fill='none'/>
          </mask>
          <ControllerFilter
            id={colorFilterId}
            x={colorX}
            y={colorY}
            r={rValue}
            g={gValue}
            b={bValue}
          />
          <ControllerFilter
            id={shadeFilterId}
            x={shadeX}
            y={shadeY}
            r={rValue}
            g={gValue}
            b={bValue}
          />
        </defs>
        <foreignObject x='0' y='0' width={unitsHorizontalOuter} height={unitsHorizontalOuter} mask='url(#mask)'>
          <div style={{
            width: '100%',
            height: '100%',
            background: `conic-gradient(from 0deg, ${shadeGradientStopInfos(rgb)}, ${colorGradientStopInfos(shadeValue)})`,
          }} xmlns='http://www.w3.org/1999/xhtml'/>
        </foreignObject>
        <Controller filterId={colorFilterId} x={colorX} y={colorY} />
        <Controller filterId={shadeFilterId} x={shadeX} y={shadeY }/>
      </svg>
    );
  }
}

RadialColorPicker.propTypes = {
  id: PropTypes.string,
  disabled: PropTypes.bool,
  initialColorValue: PropTypes.number,
  initialShadeValue: PropTypes.number,
  onChange: PropTypes.func,
};

module.exports = RadialColorPicker;
