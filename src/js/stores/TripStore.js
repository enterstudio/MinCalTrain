"use strict";

var AppConstants = require('../constants/AppConstants');
var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;

var assign = require('object-assign');

var ActionTypes = AppConstants.ActionTypes;

var TripStore = assign(
{},
EventEmitter.prototype,
AppConstants.StoreSubscribePrototype,
{

  dispatchToken: AppDispatcher.register(function(payload) {
    var action = payload.action;
    var shouldInform = false;

    switch (action.type) {
      case ActionTypes.SELECT_DEPARTURE:
        break;
      case ActionTypes.SELECT_ARRIVAL:
        break;
    }

    if (shouldInform) {
      TripStore.emit(AppConstants.CHANGE_EVENT);
    }
  })

});

module.exports = TripStore;
