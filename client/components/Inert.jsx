const React = require('react');
const { createRef, useEffect } = require('react');
const PropTypes = require('prop-types');

const Inert = ({ inert, children }) => {
  const divRef = createRef();
  useEffect(() => {
    const divRefCurrent = divRef.current;
    if (inert) {
      divRefCurrent.setAttribute('inert', '');
    } else {
      divRefCurrent.removeAttribute('inert');
    }
  }, [inert]);
  return (
    <div ref={divRef}>
      {children}
    </div>
  );
};

Inert.propTypes = {
  inert: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node.isRequired),
    PropTypes.node,
  ]),
};

module.exports = Inert;
