var Stations = require('../constants/Stations');
var Directions = require('../constants/Directions');

var STATIONS_BY_ID = Stations.__getStationsByID();

var WeekdayNorthBound =
  require('../time_tables/WeekdayNorthBound');
var WeekdaySouthBound =
  require('../time_tables/WeekdaySouthBound');

var SaturdayNorthBound =
  require('../time_tables/SaturdayNorthBound');
var SaturdaySouthBound =
  require('../time_tables/SaturdaySouthBound');

var SundayNorthBound =
  require('../time_tables/SundayNorthBound');
var SundaySouthBound =
  require('../time_tables/SundaySouthBound');

var _stopsForDay = {};
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
    // this is considered 0-hour in date land
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
      return {
        northBound: SundayNorthBound,
        southBound: SundaySouthBound,
      };
    } else if (day === 6) {
      return {
        northBound: SaturdayNorthBound,
        southBound: SaturdaySouthBound,
      };
    }

    return {
      northBound: WeekdayNorthBound,
      southBound: WeekdaySouthBound,
    };
  },

  getStationsForDay: function(date) {
    var day = date.getDay();
    if (_stopsForDay[day]) {
      // Memoize since this isnt exactly cheap...
      return _stopsForDay[day];
    }

    // not all stations are stopped at for all days,
    // so here we loop through and figure out which
    // stations can actually be selected.
    //
    // We omit the trickiness that might arise if
    // a station is only stopped at in one direction.
    var seenStations = {};
    var daySchedule = this.getScheduleForDay(date);
    // Triple loop so we memoize this
    Object.keys(daySchedule).forEach(function(scheduleDir) {
      var schedule = daySchedule[scheduleDir];
      schedule.forEach(function(train) {
        Object.keys(train.stops).forEach(function(stationID) {
          seenStations[stationID] = true;
        });
      });
    });

    var STATIONS = Stations.getAllStations();
    var result = [];
    STATIONS.forEach(function(station) {
      if (seenStations[station.id]) {
        result.push(station);
      }
    });

    _stopsForDay[day] = result;
    return result;
  },

  getSortedRouteTimes: function(options) {
    var seenTimes = {};
    options.forEach(function(route) {
      seenTimes[this.getMinutesForRoute(route)] = true;
    }.bind(this));

    return Object.keys(seenTimes).sort(function(a, b) {
      return a - b;
    }).map(function(a) { return +a; }); // convert to int
  },

  getMinutesForRoute: function(route) {
    if (!route.timeLeaving || !route.timeArriving) {
      throw new Error('bad route given');
    }
    if (route.timeLeaving.getTime() > route.timeArriving.getTime()) {
      throw new Error('times backwards');
    }
    var msDuration = route.timeArriving.getTime() -
      route.timeLeaving.getTime();
    return Math.round(msDuration / (1000 * 60));
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
