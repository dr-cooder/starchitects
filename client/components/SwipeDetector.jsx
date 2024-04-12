const React = require('react');
const { Component, createRef } = require('react');
const PropTypes = require('prop-types');
const {
  unitsHorizontalInnerHalf,
  unitsVerticalInnerHalf,
} = require('../measurements.js');
const {
  isWithin01,
  isMouseEvent,
} = require('../../common/helpers.js');
const {
  misc: {
    progressStar,
  },
  getBlob,
} = require('../preload.js');
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

class SwipeDetector extends Component {
  constructor(props) {
    super(props);

    const { none: noPointerType, mouse: mousePointerType, touch: touchPointerType } = pointerTypes;

    const { disabled, onSwipe } = props;
    this.onSwipe = onSwipe;
    this.state = {
      disabled,
      awaitingListenerUpdate: false,
      pointerType: noPointerType,
      pointerTouchIdentifier: undefined,
      pointerInitialY: 0,
    };
    this.boundsRef = createRef();

    const handlePointerDown = (event) => {
      const {
        state: { pointerType },
        boundsRef: { current: boundsRefCurrent },
      } = this;
      if (pointerType === noPointerType) {
        const {
          x: boundsX,
          y: boundsY,
          width: boundsWidth,
          height: boundsHeight,
        } = boundsRefCurrent.getBoundingClientRect();
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
            this.setState({
              pointerType: mousePointerType,
              pointerInitialY: boundsSpacePointerY,
            });
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
              this.setState({
                pointerType: touchPointerType,
                pointerTouchIdentifier: touchIdentifier,
                pointerInitialY: boundsSpacePointerY,
              });
              break;
            }
          }
        }
      }
    };

    const handlePointerUp = (event) => {
      const {
        state: {
          pointerType,
          pointerTouchIdentifier,
          pointerInitialY,
        },
        boundsRef: { current: boundsRefCurrent },
      } = this;
      const eventIsMouseEvent = isMouseEvent(event);
      const expectedPointerType = eventIsMouseEvent ? mousePointerType : touchPointerType;
      if (pointerType === expectedPointerType) {
        const {
          y: boundsY,
          height: boundsHeight,
        } = boundsRefCurrent.getBoundingClientRect();
        if (eventIsMouseEvent) {
          const { clientY: pointerY } = event;
          const boundsSpacePointerY = boundsSpacePointer({
            pointer: pointerY,
            boundsStart: boundsY,
            boundsLength: boundsHeight,
          });
          if (boundsSpacePointerY < pointerInitialY) onSwipe();
          this.setState({
            pointerType: noPointerType,
          });
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
            this.setState({
              pointerType: noPointerType,
              pointerTouchIdentifier: undefined,
            });
          }
        }
      }
    };

    this.updateListeners = () => {
      const { addEventListener, removeEventListener } = document;
      const { disabled: disabledState } = this.state;
      const eventListenerMutator = disabledState ? removeEventListener : addEventListener;

      eventListenerMutator('mousedown', handlePointerDown);
      eventListenerMutator('touchstart', handlePointerDown);

      eventListenerMutator('mouseleave', handlePointerUp);
      eventListenerMutator('mouseup', handlePointerUp);
      eventListenerMutator('touchcancel', handlePointerUp);
      eventListenerMutator('touchend', handlePointerUp);

      this.setState({
        ...(disabled ? {
          pointerType: noPointerType,
          pointerTouchIdentifier: undefined,
        } : {}),
        awaitingListenerUpdate: false,
      });

      // console.log(
      //   `${disabledState ? 'Removed' : 'Added'} event listeners for swipe detector`,
      // );
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
      state: { awaitingListenerUpdate, pointerType },
      updateListeners,
      boundsRef,
    } = this;
    if (awaitingListenerUpdate) updateListeners();

    const { none: noPointerType } = pointerTypes;
    return (
      <ScalingSection
        leftUnits={detectorLeft}
        topFreeSpace={0.5}
        topUnits={detectorTop}
        widthUnits={detectorDiameter}
        heightUnits={detectorDiameter}
      >
        <div ref={boundsRef} className='swipeTwinkleContainer'>
          <img
            className={`swipeTwinkle ${pointerType === noPointerType ? 'swipeTwinkleInactive' : 'swipeTwinkleActive'}`}
            src={getBlob(progressStar)}
            alt='Twinkle'
          />
        </div>
      </ScalingSection>
    );
  }
}

SwipeDetector.propTypes = {
  disabled: PropTypes.bool,
  onSwipe: PropTypes.func,
};

module.exports = SwipeDetector;
