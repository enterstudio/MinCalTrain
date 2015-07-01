var keyMirror = require('../util/keyMirror');

var CHANGE_EVENT = 'change';

module.exports = {

  CHANGE_EVENT: CHANGE_EVENT,

  StoreSubscribePrototype: {
    subscribe: function(cb) {
      this.on(CHANGE_EVENT, cb);
    },

    unsubscribe: function(cb) {
      this.removeListener(CHANGE_EVENT, cb);
    }
  },

  ActionTypes: keyMirror({
    SELECT_DEPARTURE: null,
    SELECT_ARRIVAL: null,
    CLEAR_FAVORITES: null,
    SET_FAVORITES_GUARD: null,
    REMOVE_FAVORITE: null,
  }),

  PayloadSources: keyMirror({
    VIEW_ACTION: null,
    SERVER_ACTION: null
  })
};
