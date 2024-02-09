const storeName = 'starchitects-id';

const getStarId = () => localStorage.getItem(storeName);

const setStarId = (id) => localStorage.setItem(storeName, id);

const unsetStarId = () => localStorage.removeItem(storeName);

module.exports = { getStarId, setStarId, unsetStarId };
