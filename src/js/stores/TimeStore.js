"use strict";

var assign = require('object-assign');

var AppConstants = require('../constants/AppConstants');
var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;

var ActionTypes = AppConstants.ActionTypes;

/**
 * The store that holds what time we want to depart at.
 * For v1 this is always now -- consolidating codepaths
 * here both helps with both testing and future proofs
 * us for when you can modify your departure time.
 */
var TimeStore = assign(
{},
EventEmitter.prototype,
AppConstants.StoreSubscribePrototype,
{
  
  getDesiredDepartureDate: function() {
    return new Date();
  },

  dispatchToken: AppDispatcher.register(function(payload) {
    var action = payload.action;
    var shouldInform = false;

    switch (action.type) {
      // Nothing so far
    }

    if (shouldInform) {
      TimeStore.emit(AppConstants.CHANGE_EVENT);
    }
  })

});

module.exports = TimeStore;
