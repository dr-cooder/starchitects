const React = require('react');
const { useState, useEffect } = require('react');
const PropTypes = require('prop-types');
const Inert = require('./Inert.jsx');
const { unitsPerEm } = require('../measurements.js');
const { usePixelsPerUnit } = require('../measurementsReact.js');
const { px } = require('../../common/helpers.js');

const animationDuration = 1000;

const GalleryItem = ({
  currentGalleryIndex,
  previousGalleryIndex,
  galleryIndexDelta,
  itemIndex,
  onInAnimationFinished,
  children,
}) => {
  const onInAnimationFinishedFinal = onInAnimationFinished ?? (() => {});
  const { pixelsPerUnit } = usePixelsPerUnit();
  const [inert, setInert] = useState(true);
  const [className, setClassName] = useState('hiddenStill');
  useEffect(() => {
    if (itemIndex === currentGalleryIndex) {
      let newInert;
      switch (galleryIndexDelta) {
        case 1:
          setClassName('galleryInFromRight');
          newInert = true;
          break;
        case -1:
          setClassName('galleryInFromLeft');
          newInert = true;
          break;
        default:
          setClassName('');
          newInert = false;
      }
      if (newInert) {
        setTimeout(() => {
          setInert(false);
          onInAnimationFinishedFinal();
        }, animationDuration);
      }
      setInert(newInert);
    } else if (itemIndex === previousGalleryIndex) {
      setInert(true);
      switch (galleryIndexDelta) {
        case 1:
          setClassName('galleryOutToLeft');
          break;
        case -1:
          setClassName('galleryOutToRight');
          break;
        default:
          setClassName('hiddenStill');
      }
    }
  }, [currentGalleryIndex, previousGalleryIndex, galleryIndexDelta]);
  return (
    <Inert
      inert={inert}
      style={{
        fontSize: px(pixelsPerUnit * unitsPerEm),
      }}
      className={className}
    >
      {children}
    </Inert>
  );
};

GalleryItem.propTypes = {
  currentGalleryIndex: PropTypes.number,
  previousGalleryIndex: PropTypes.number,
  galleryIndexDelta: PropTypes.number,
  itemIndex: PropTypes.number,
  onInAnimationFinished: PropTypes.func,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node.isRequired),
    PropTypes.node,
  ]),
};

module.exports = GalleryItem;
