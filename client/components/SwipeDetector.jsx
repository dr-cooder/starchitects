const React = require('react');
const { useEffect, useRef, useState } = require('react');
const PropTypes = require('prop-types');
const {
  unitsHorizontalInnerHalf,
  unitsVerticalInnerHalf,
} = require('../measurements.js');
const {
  isWithin01,
  isMouseEvent,
} = require('../../common/helpers.js');
const ScalingSection = require('./ScalingSection.jsx');

const pointerTypes = {
  none: 0,
  mouse: 1,
  touch: 2,
};

const detectorRadius = 100;

const detectorLeft = unitsHorizontalInnerHalf - detectorRadius;
const detectorTop = unitsVerticalInnerHalf - detectorRadius;
const detectorDiameter = detectorRadius * 2;

const boundsSpacePointer = ({ pointer, boundsStart, boundsLength }) => (
  (pointer - boundsStart) / boundsLength
);

const SwipeDetector = ({ disabled, onSwipe }) => {
  const boundsRef = useRef();
  const { none: noPointerType, mouse: mousePointerType, touch: touchPointerType } = pointerTypes;
  const [pointerType, setPointerType] = useState(noPointerType);
  const [pointerTouchIdentifier, setPointerTouchIdentifier] = useState(undefined);
  const [pointerInitialY, setPointerInitialY] = useState(0);
  const handlePointerDown = (event) => {
    if (pointerType === noPointerType) {
      const {
        x: boundsX,
        y: boundsY,
        width: boundsWidth,
        height: boundsHeight,
      } = boundsRef.current.getBoundingClientRect();
      if (isMouseEvent(event)) {
        const {
          clientX: pointerX,
          clientY: pointerY,
        } = event;
        const boundsSpacePointerX = boundsSpacePointer({
          pointer: pointerX,
          boundsStart: boundsX,
          boundsLength: boundsWidth,
        });
        const boundsSpacePointerY = boundsSpacePointer({
          pointer: pointerY,
          boundsStart: boundsY,
          boundsLength: boundsHeight,
        });
        if (isWithin01(boundsSpacePointerX) && isWithin01(boundsSpacePointerY)) {
          setPointerType(mousePointerType);
          setPointerInitialY(boundsSpacePointerY);
        }
      } else {
        const { changedTouches } = event;
        for (let i = 0; i < changedTouches.length; i++) {
          const {
            identifier: touchIdentifier,
            clientX: pointerX,
            clientY: pointerY,
          } = changedTouches[i];
          const boundsSpacePointerX = boundsSpacePointer({
            pointer: pointerX,
            boundsStart: boundsX,
            boundsLength: boundsWidth,
          });
          const boundsSpacePointerY = boundsSpacePointer({
            pointer: pointerY,
            boundsStart: boundsY,
            boundsLength: boundsHeight,
          });
          if (isWithin01(boundsSpacePointerX) && isWithin01(boundsSpacePointerY)) {
            setPointerType(touchPointerType);
            setPointerTouchIdentifier(touchIdentifier);
            setPointerInitialY(boundsSpacePointerY);
            break;
          }
        }
      }
    }
  };
  const handlePointerUp = (event) => {
    const eventIsMouseEvent = isMouseEvent(event);
    const expectedPointerType = eventIsMouseEvent ? mousePointerType : touchPointerType;
    if (pointerType === expectedPointerType) {
      const {
        y: boundsY,
        height: boundsHeight,
      } = boundsRef.current.getBoundingClientRect();
      if (eventIsMouseEvent) {
        const { clientY: pointerY } = event;
        const boundsSpacePointerY = boundsSpacePointer({
          pointer: pointerY,
          boundsStart: boundsY,
          boundsLength: boundsHeight,
        });
        if (boundsSpacePointerY < pointerInitialY) onSwipe();
        setPointerType(noPointerType);
      } else {
        const changedTouchArray = [...event.changedTouches];
        const pointerTouch = changedTouchArray.find(
          (touch) => touch.identifier === pointerTouchIdentifier,
        );
        if (pointerTouch !== undefined) {
          const { clientY: pointerY } = pointerTouch;
          const boundsSpacePointerY = boundsSpacePointer({
            pointer: pointerY,
            boundsStart: boundsY,
            boundsLength: boundsHeight,
          });
          if (boundsSpacePointerY < pointerInitialY) onSwipe();
          setPointerType(noPointerType);
          setPointerTouchIdentifier(undefined);
        }
      }
    }
  };
  const updateListeners = (add) => {
    const { addEventListener, removeEventListener } = document;
    const eventListenerMutator = add ? addEventListener : removeEventListener;

    eventListenerMutator('mousedown', handlePointerDown);
    eventListenerMutator('touchstart', handlePointerDown);

    eventListenerMutator('mouseleave', handlePointerUp);
    eventListenerMutator('mouseup', handlePointerUp);
    eventListenerMutator('touchcancel', handlePointerUp);
    eventListenerMutator('touchend', handlePointerUp);

    console.log(
      `${add ? 'Added' : 'Removed'} event listeners for swipe detector`,
    );
  };
  useEffect(() => {
    if (disabled) return undefined;
    updateListeners(true);
    return () => updateListeners(false);
  }, [disabled]);
  return (
    <ScalingSection
      ref={boundsRef}
      leftUnits={detectorLeft}
      topFreeSpace={0.5}
      topUnits={detectorTop}
      widthUnits={detectorDiameter}
      heightUnits={detectorDiameter}
    ></ScalingSection>
  );
};

SwipeDetector.propTypes = {
  disabled: PropTypes.bool,
  onSwipe: PropTypes.func,
};

module.exports = SwipeDetector;
