"use strict";

var AppConstants = require('../constants/AppConstants');
var AppDispatcher = require('../dispatcher/AppDispatcher');

var ActionTypes = AppConstants.ActionTypes;

var TripActions = {
  selectDeparture: function(stationID) {
    AppDispatcher.handleViewAction({
      type: ActionTypes.SELECT_DEPARTURE,
      stationID: stationID
    });
  },

  clearFavoriteTrips: function() {
    AppDispatcher.handleViewAction({
      type: ActionTypes.CLEAR_FAVORITES
    });
  },

  selectArrival: function(stationID) {
    AppDispatcher.handleViewAction({
      type: ActionTypes.SELECT_ARRIVAL,
      stationID: stationID
    });
  },
};

module.exports = TripActions;
