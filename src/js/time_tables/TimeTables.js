var Stations = require('../constants/Stations');
var Directions = require('../constants/Directions');

var STATIONS_BY_ID = Stations.__getStationsByID();

var WeekdayNorthBound =
  require('../time_tables/WeekdayNorthBound');
var WeekdaySouthBound =
  require('../time_tables/WeekdaySouthBound');

function _stripNonDigits(string) {
  return string.replace(/[^0-9]/g, '');
}

function _parseInt(string) {
  return parseInt(string, 10);
}

function _strContains(haystack, needle) {
  return haystack.indexOf(needle) !== -1;
}

function _getDateForTimeString(date, timeString) {
  var parts = timeString.split(':');
  var hoursRaw = parts[0];
  var minutesRaw = parts[1];

  var hours = _parseInt(_stripNonDigits(hoursRaw));
  var minutes = _parseInt(_stripNonDigits(minutesRaw));

  if (_strContains(hoursRaw, '+') &&
      _strContains(minutesRaw, 'pm')) {
    throw new Error('cant use + and pm');
  }

  if (_strContains(minutesRaw, 'am') &&
      hours === 12) {
    // this is considered 0-hour in our land
    hours = 0;
  }

  if (_strContains(minutesRaw, 'pm') &&
      hours !== 12) {
    // handle the am/pm split, but of course 12pm
    // does not need the +12 hours
    hours += 12;
  } else if (_strContains(hoursRaw, '+')) {
    // its actually the NEXT day if we have the +
    hours += 24;
  }
  var result = new Date(date.getTime());

  result.setHours(hours);
  result.setMinutes(minutes);
  result.setSeconds(0);
  result.setMilliseconds(0);
  return result;
}

function _getDirectionForStops(stopOneID, stopTwoID) {
  if (stopOneID === stopTwoID) {
    throw new Error('Cant use same stop IDs');
  }
  if (
    STATIONS_BY_ID[stopTwoID].northBoundIndex >
    STATIONS_BY_ID[stopOneID].northBoundIndex
  ) {
    return Directions.NORTH_BOUND;
  }
  return Directions.SOUTH_BOUND;
}

function _getOptionsForTrip(date, schedule, stopOneID, stopTwoID) {
  var options = [];
  schedule.forEach(function(train) {
    if (train.stops[stopOneID] === undefined ||
        train.stops[stopTwoID] === undefined) {
      // Train doesnt stop at both of these stops
      return;
    }

    var timeLeaving = _getDateForTimeString(
      date,
      train.stops[stopOneID]
    );
    var timeArriving = _getDateForTimeString(
      date,
      train.stops[stopTwoID]
    );
    if (timeLeaving.getTime() <= date.getTime()) {
      // Already left
      return;
    }

    // Should be an option!
    options.push({
      timeLeaving: timeLeaving,
      timeArriving: timeArriving,
      train: train,
    });
  });
  return options;
}

var TimeTables = {
  getScheduleForDay: function(date) {
    var day = date.getDay();
    if (day === 0) {
      throw new Error('Sunday not done yet');
    } else if (day === 6) {
      throw new Error('Saturday not done yet');
    }

    return {
      northBound: WeekdayNorthBound,
      southBound: WeekdaySouthBound,
    };
  },

  getRoutesForTrip: function(date, stopOneID, stopTwoID) {
    var daySchedule = this.getScheduleForDay(date);
    var direction = _getDirectionForStops(stopOneID, stopTwoID);
    var schedule = null;
    if (direction === Directions.NORTH_BOUND) {
      schedule = daySchedule.northBound;
    } else if (direction === Directions.SOUTH_BOUND) {
      schedule = daySchedule.southBound;
    } else {
      throw new Error('unexpected dir ' + direction);
    }

    return _getOptionsForTrip(
      date,
      schedule,
      stopOneID,
      stopTwoID
    );
  },

  /**
   * Not really public, only for testing
   */
  _getDateForTimeString: _getDateForTimeString,
  _getDirectionForStops: _getDirectionForStops,
  _getOptionsForTrip: _getOptionsForTrip,

};

module.exports = TimeTables;
