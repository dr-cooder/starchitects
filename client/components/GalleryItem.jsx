const React = require('react');
const { useState } = require('react');
const PropTypes = require('prop-types');
const Inert = require('./Inert.jsx');
const { unitsPerEm } = require('../measurements.js');
const { usePixelsPerUnit } = require('../measurementsReact.js');
const { px } = require('../../common/helpers.js');

const GalleryItem = ({
  currentGalleryIndex,
  galleryIndexDelta,
  itemIndex,
  children,
}) => {
  const { pixelsPerUnit } = usePixelsPerUnit();
  const [inert, setInert] = useState(
    !(itemIndex === currentGalleryIndex && galleryIndexDelta === 0),
  );
  let className = 'hiddenStill';
  let onAnimationEnd;
  if (itemIndex === currentGalleryIndex) {
    if (inert) {
      onAnimationEnd = () => setInert(false);
    }
    switch (galleryIndexDelta) {
      case 1:
        className = 'galleryInFromRight';
        break;
      case -1:
        className = 'galleryInFromLeft';
        break;
      default:
        className = '';
    }
  } else {
    switch (galleryIndexDelta) {
      case 1:
        className = 'galleryOutToLeft';
        break;
      case -1:
        className = 'galleryOutToRight';
        break;
      default:
    }
  }
  return (
    <Inert
      inert={inert}
      style={{
        fontSize: px(pixelsPerUnit * unitsPerEm),
      }}
      className={className}
      onAnimationEnd={onAnimationEnd}
    >
      {children}
    </Inert>
  );
};

GalleryItem.propTypes = {
  currentGalleryIndex: PropTypes.number,
  galleryIndexDelta: PropTypes.number,
  itemIndex: PropTypes.number,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node.isRequired),
    PropTypes.node,
  ]),
};

module.exports = GalleryItem;
