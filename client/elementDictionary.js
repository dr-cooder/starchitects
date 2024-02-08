// Create an object that whose keys point to corresponding document elements
const elementDictionary = (propNames, propNameToElementID) => {
  // If there is no no provided function translating the dictionary key name
  // to its corresponding element id, just use the key name as is
  const propNameToElementIdFinalized = propNameToElementID || ((e) => e);
  const dict = {};

  for (let i = 0; i < propNames.length; i++) {
    const propName = propNames[i];
    dict[propName] = document.querySelector(`#${propNameToElementIdFinalized(propName)}`);
  }

  return dict;
};

// Show only one certain element of an element dict based on its name (key)
const setElDictItemVisible = (dict, visibleClassName, name) => {
  // Avoid hiding all of the elements when there is no such element with the given name
  if (!dict[name]) return;
  // Only the element with the given name should be shown
  // https://stackoverflow.com/questions/33946567/iterate-over-values-of-object
  Object.keys(dict).forEach((key) => {
    dict[key].classList.toggle(visibleClassName, key === name);
  });
};

module.exports = {
  elementDictionary,
  setElDictItemVisible,
};
