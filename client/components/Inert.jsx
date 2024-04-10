const React = require('react');
const { useEffect, useRef } = require('react');
const PropTypes = require('prop-types');
const { preventChildrenFromCalling } = require('../../common/helpers.js');

const Inert = ({
  inert,
  style,
  className,
  onAnimationEnd,
  onClick,
  children,
}) => {
  const divRef = useRef();
  useEffect(() => {
    const divRefCurrent = divRef.current;
    if (inert) {
      divRefCurrent.setAttribute('inert', '');
    } else {
      divRefCurrent.removeAttribute('inert');
    }
  }, [inert]);
  return (
    <div
      ref={divRef}
      style={style}
      className={className}
      onAnimationEnd={preventChildrenFromCalling(onAnimationEnd)}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

Inert.propTypes = {
  inert: PropTypes.bool,
  style: PropTypes.object,
  className: PropTypes.string,
  onAnimationEnd: PropTypes.func,
  onClick: PropTypes.func,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node.isRequired),
    PropTypes.node,
  ]),
};

module.exports = Inert;
