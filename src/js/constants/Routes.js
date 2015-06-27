var assign = require('object-assign');
var keyMirror = require('../util/keyMirror');

module.exports = keyMirror({
  SELECT_DEPARTURE: null,
  SELECT_ARRIVAL: null,
  TIMES: null,
  ABOUT: null,
});

module.exports.getRouteWithParams = function(id, params) {
  return assign({id: id}, params);
};

module.exports.getRouteForID = function(id) {
  return {
    id: id,
  };
};
