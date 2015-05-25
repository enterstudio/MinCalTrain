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

function formatTrainFetchRequest() {
  var fromSlug = Stations.getStationSlugFromID(_departureID);
  var toSlug = Stations.getStationSlugFromID(_arrivalID);
  // TODO -- better uri encoding
  return TRAIN_REQUEST_URI + '?' +
      'from=' + fromSlug +
    '&' +
      'to=' + toSlug +
    '&' +
      'departure=' + Date.now();
}

function fetchTrainData() {
  fetch(formatTrainFetchRequest())
    .then((response) => response.json())
    .then((responseData) => {
      console.log('got this bakc', responseData);
    })
    .done()
}

function checkForFetching() {
  if (_departureID && _arrivalID) {
    fetchTrainData();
  }
}

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
        checkForFetching();
        break;
      case ActionTypes.SELECT_ARRIVAL:
        _arrivalID = action.stationID;
        shouldInform = true;
        checkForFetching();
        break;
    }

    if (shouldInform) {
      TripStore.emit(AppConstants.CHANGE_EVENT);
    }
  })

});

module.exports = TripStore;
