"use strict";

var assign = require('object-assign');

var AppConstants = require('../constants/AppConstants');
var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var Stations = require('../constants/Stations');
var STATIONS_BY_ID = Stations.__getStationsByID();

var ActionTypes = AppConstants.ActionTypes;
var MAX_NUM_FAVORITE_TRIPS = 2;
var FAVORITE_TRIPS_KEY = 'favorite_trips';

var _departureID = null;
var _arrivalID = null;
var _favoriteTrips = [];
var _favoritesGuard = false;

// We have this giant hack since this code needs to
// run in jasmine tests as well
function _getAsyncStorage() {
  var React = require('react-native');
  // cant use ES6 in jasmine
  return React.AsyncStorage;
}

function _isSameTrip(tripA, tripB) {
  return tripA.departureID === tripB.departureID &&
    tripA.arrivalID === tripB.arrivalID;
}

function _hasFavoriteTrip(trip) {
  for (var i = 0; i < _favoriteTrips.length; i++) {
    if (_isSameTrip(trip, _favoriteTrips[i])) {
      return true;
    }
  }
  return false;
}

function _saveTripsToStorage() {
  var AsyncStorage = _getAsyncStorage();
  AsyncStorage.setItem(
    FAVORITE_TRIPS_KEY,
    JSON.stringify(_favoriteTrips)
  );
}

function _removeFavoriteTrip(trip) {
  if (!_hasFavoriteTrip(trip)) {
    throw new Error('bad trip', trip);
  }

  _favoriteTrips = _favoriteTrips.filter(function(thisTrip) {
    return !_isSameTrip(thisTrip, trip);
  });
}

function _loadTripsFromStorage(cb) {
  var AsyncStorage = _getAsyncStorage();
  AsyncStorage.getItem(
    FAVORITE_TRIPS_KEY
  ).then(function(itemString) {
    var trips = JSON.parse(itemString);
    _favoriteTrips = trips.slice(0, MAX_NUM_FAVORITE_TRIPS);
    cb();
  });
}

function _tryToSaveFavoriteTripsImpl() {
  if (_arrivalID === null || _departureID === null) {
    // Have not selected yet
    return;
  }

  var thisTrip = {
    departureID: _departureID,
    arrivalID: _arrivalID
  };

  // Alright both selected -- lets see if we have it...
  if (_hasFavoriteTrip(thisTrip)) {
    // Simply move it to the front
    _removeFavoriteTrip(thisTrip);
    _favoriteTrips.unshift(thisTrip);
  } else {
    // add it at the front and slice
    _favoriteTrips.unshift(thisTrip);
    _favoriteTrips = _favoriteTrips.slice(0, MAX_NUM_FAVORITE_TRIPS);
  }

  // Alright now lets try to save
  _saveTripsToStorage();
}

function _tryToSaveFavoriteTrips() {
  try {
    _tryToSaveFavoriteTripsImpl()
  } catch (error) {
    console.warn('Could not save trips');
    return;
  }
}

function _validateStationID(stationID) {
  if (!STATIONS_BY_ID[stationID]) {
    throw new Error('bad stationID ', stationID);
  }
  return stationID;
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

  getFavoriteTrips: function() {
    return _favoriteTrips.slice(0);
  },

  dispatchToken: AppDispatcher.register(function(payload) {
    var action = payload.action;
    var shouldInform = false;

    switch (action.type) {
      case ActionTypes.CLEAR_FAVORITES:
        _favoriteTrips = [];
        shouldInform = true;
        try {
          _saveTripsToStorage();
        } catch (error) {
        }
        break;
      case ActionTypes.SET_FAVORITES_GUARD:
        _favoritesGuard = action.favoritesGuard;
        break;
      case ActionTypes.SELECT_DEPARTURE:
        _departureID = _validateStationID(action.stationID);
        shouldInform = true;
        break;
      case ActionTypes.REMOVE_FAVORITE:
        _removeFavoriteTrip(action.trip);
        try {
          _saveTripsToStorage();
        } catch (error) {
        }

        shouldInform = true;
        break;
      case ActionTypes.SELECT_ARRIVAL:
        _arrivalID = _validateStationID(action.stationID);
        if (!_favoritesGuard) {
          // Only set favorites when we dont have
          // the guard
          _tryToSaveFavoriteTrips();
        } 
        shouldInform = true;
        break;
    }

    if (shouldInform) {
      TripStore.emit(AppConstants.CHANGE_EVENT);
    }
  })

});

try {
  _loadTripsFromStorage(function() {
    TripStore.emit(AppConstants.CHANGE_EVENT);
  });
} catch (error) {
  console.warn('could not load from storage');
}

module.exports = TripStore;
