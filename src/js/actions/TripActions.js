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

  selectArrival: function(stationID) {
    AppDispatcher.handleViewAction({
      type: ActionTypes.SELECT_ARRIVAL,
      stationID: stationID
    });
  },

  setFavoritesGuard: function(guardValue) {
    AppDispatcher.handleViewAction({
      type: ActionTypes.SET_FAVORITES_GUARD,
      favoritesGuard: guardValue
    });
  },

  clearFavoriteTrips: function() {
    AppDispatcher.handleViewAction({
      type: ActionTypes.CLEAR_FAVORITES
    });
  },
};

module.exports = TripActions;
