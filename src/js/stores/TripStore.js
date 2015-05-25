"use strict";

var assign = require('object-assign');

var AppConstants = require('../constants/AppConstants');
var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var Stations = require('../constants/Stations');

var ActionTypes = AppConstants.ActionTypes;

var TRAIN_REQUEST_URI = 'http://caltrain-api.thejsj.com/v1/train';

var _departureID = null;
var _arrivalID = null;

var TripStore = assign(
{},
EventEmitter.prototype,
AppConstants.StoreSubscribePrototype,
{

  getDepartureStationID: function() {
    return _departureID;
  },

  getArrivalStationID: function() {
    return _arrivalID;
  },

  dispatchToken: AppDispatcher.register(function(payload) {
    var action = payload.action;
    var shouldInform = false;

    switch (action.type) {
      case ActionTypes.SELECT_DEPARTURE:
        _departureID = action.stationID;
        shouldInform = true;
        break;
      case ActionTypes.SELECT_ARRIVAL:
        _arrivalID = action.stationID;
        shouldInform = true;
        break;
    }

    if (shouldInform) {
      TripStore.emit(AppConstants.CHANGE_EVENT);
    }
  })

});

module.exports = TripStore;
