const React = require('react');
const PropTypes = require('prop-types');

const GalleryButton = ({
  disabled,
  onClick,
  expectedPreviousGalleryIndex,
  expectedGalleryIndexDelta,
  previousGalleryIndex,
  galleryIndexDelta,
  children,
}) => (
  <button
    className={`outlined${expectedPreviousGalleryIndex === previousGalleryIndex && expectedGalleryIndexDelta === galleryIndexDelta ? ' pressed' : ''}`}
    disabled={disabled}
    onClick={onClick}
  >
    {children}
  </button>
);

GalleryButton.propTypes = {
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  expectedPreviousGalleryIndex: PropTypes.number,
  expectedGalleryIndexDelta: PropTypes.number,
  previousGalleryIndex: PropTypes.number,
  galleryIndexDelta: PropTypes.number,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node.isRequired),
    PropTypes.node,
  ]),
};

module.exports = GalleryButton;
