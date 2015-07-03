var Directions = require('../constants/Directions');
var Stations = require('../constants/Stations');
var TrainTypes = require('../constants/TrainTypes');
var TimeTables = require('../time_tables/TimeTables');
var Schedules = {
  WeekdayNorthBound: require('../time_tables/WeekdayNorthBound'),
  WeekdaySouthBound: require('../time_tables/WeekdaySouthBound'),
  SundayNorthBound: require('../time_tables/SundayNorthBound'),
  SundaySouthBound: require('../time_tables/SundaySouthBound'),
  SaturdayNorthBound: require('../time_tables/SaturdayNorthBound'),
  SaturdaySouthBound: require('../time_tables/SaturdaySouthBound'),
};

var STATIONS_BY_ID = Stations.__getStationsByID();

var MONDAY_MORNING = 1433781124337;
var TUESDAY_MORNING = 1433867524337;
var THURSDAY_AFTER_MIDNIGHT = 1435820401398;

function _jsonStringify(elem) {
  // formatting
  return JSON.stringify(elem, null, 2);
}

var _trainLoop = function(callback) {
  Object.keys(Schedules).forEach(function(scheduleKey) {
    var schedule = Schedules[scheduleKey];
    schedule.forEach(function(train) {
      callback(train, scheduleKey);
    });
  });
};

var _stopLoop = function(callback) {
  _trainLoop(function(train) {
    Object.keys(train.stops).forEach(function(stationID) {
      callback(stationID, train.stops[stationID]);
    });
  });
};

describe('time tables', function() {
  it('each has an ID and type', function() {
    _trainLoop(function(train) {

      expect(train.id)
        .toBeTruthy();
      expect(train.type)
        .toBeTruthy();
      expect(TrainTypes[train.type])
        .toBeTruthy();

    }.bind(this));;
  });

  it('each stop is a valid station', function() {
    _stopLoop(function(stationID, timeString) {
      expect(STATIONS_BY_ID[stationID])
        .toBeTruthy('StationID ' + stationID + ' should exist');
    });
  });

  it('the times progress monotonically', function() {
    _trainLoop(function(train) {
      var firstStopID = Object.keys(train.stops)[0];
      var now = new Date();
      var currentTime = TimeTables._getDateForTimeString(
        now,
        train.stops[firstStopID]
      );
      currentTime.setSeconds(-1); // decrement for loop

      Object.keys(train.stops).forEach(function(stopID) {
        var thisStopTime = TimeTables._getDateForTimeString(
          now,
          train.stops[stopID]
        );
        expect(thisStopTime.getTime())
          .toBeGreaterThan(
            currentTime.getTime(),
            'Expected ' + thisStopTime.toString() +
              ' to be later than ' + currentTime.toString() +
              ' for stopID ' + stopID + ' and train ' + train.id
          );
        currentTime = thisStopTime;
      });
    });
  });

  it('the direction of the stops matches that of the schedule', function() {
    _trainLoop(function(train, scheduleKey) {
      var firstStopID = Object.keys(train.stops)[0];

      Object.keys(train.stops).forEach(function(stopID) {
        if (stopID === firstStopID) {
          return;
        }

        var direction = TimeTables._getDirectionForStops(
          firstStopID,
          stopID
        );
        var expectedDirection = scheduleKey.indexOf('South') !== -1 ?
          Directions.SOUTH_BOUND :
          Directions.NORTH_BOUND;

        expect(direction).toBe(expectedDirection, 'Direction should be ' +
           expectedDirection + ' for schedule key ' + scheduleKey + ' and stops ' +
           firstStopID + ' ' + stopID);
        firstStopID = stopID;
      });
    });
  });

  it('can parse timestrings', function() {
    var time = TimeTables._getDateForTimeString(
      new Date(TUESDAY_MORNING),
      '+12:59am'
    );
    expect(time.toString())
      .toEqual('Wed Jun 10 2015 00:59:00 GMT-0700 (PDT)');

    time = TimeTables._getDateForTimeString(
      new Date(TUESDAY_MORNING),
      '+1:10am'
    );
    expect(time.toString())
      .toEqual('Wed Jun 10 2015 01:10:00 GMT-0700 (PDT)');

    time = TimeTables._getDateForTimeString(
      new Date(TUESDAY_MORNING),
      '-11:10pm'
    );
    expect(time.toString())
      .toEqual('Mon Jun 08 2015 23:10:00 GMT-0700 (PDT)');
  });

  it('has a schedule for all days', function() {
    // This assures we have cached the results on require
    TimeTables.getStationsForDayImpl = function() {
      throw new Error('uncached');
    };

    for (var day = 0; day < 6; day++) {
      var date = TimeTables._getDateForDay(day);
      expect(TimeTables.getScheduleForDay(date))
        .toBeTruthy();
    }
  });

  it('can get directions successfully', function() {
    var dir1 = TimeTables._getDirectionForStops(
      'palo-alto',
      '22nd-street'
    );

    expect(dir1).toEqual(Directions.NORTH_BOUND);

    var dir2 = TimeTables._getDirectionForStops(
      'sunnyvale',
      'gilroy'
    );
    expect(dir2).toEqual(Directions.SOUTH_BOUND);
    expect(
      function() {
        TimeTables._getDirectionForStops('gilroy', 'gilroy');
      }
    ).toThrow();
  });

  it('can calculate options for a route', function() {
    var mondayMorning = new Date(MONDAY_MORNING);
    var routes = TimeTables.getRoutesForTrip(
      mondayMorning,
      'palo-alto',
      'san-francisco'
    );

    expect(routes.length).toBe(29);
    expect(routes[0].timeLeaving.getTime())
      .toEqual(Date.parse('Mon Jun 08 2015 09:46:00 GMT-0700 (PDT)'));
    expect(routes[0].timeLeaving.toString())
      .toEqual('Mon Jun 08 2015 09:46:00 GMT-0700 (PDT)');

    expect(routes[0].timeArriving.toString())
      .toEqual('Mon Jun 08 2015 10:48:00 GMT-0700 (PDT)');

    lastTrip = routes[routes.length - 1];
    expect(lastTrip.timeLeaving.toString())
      .toEqual('Mon Jun 08 2015 23:01:00 GMT-0700 (PDT)');
    // note that this respects midnight and the next day.
    // It also converts the 12:xxam to 00:xxam
    expect(lastTrip.timeArriving.toString())
      .toEqual('Tue Jun 09 2015 00:03:00 GMT-0700 (PDT)');
  });

  it('can calculate minutes length for routes', function() {
    var mondayMorning = new Date(MONDAY_MORNING);
    var routes = TimeTables.getRoutesForTrip(
      mondayMorning,
      'palo-alto',
      'san-francisco'
    );

    expect(routes.length).toBe(29);
    var firstRoute = routes[0];
    expect(TimeTables.getMinutesForRoute(firstRoute)).toBe(62);
    expect(TimeTables.getMinutesForRoute(routes[7])).toBe(53);

    expect(
      function() {
        TimeTables.getMinutesForRoute({});
      }
    ).toThrow();
  });

  it('can sort route times', function() {
    var mondayMorning = new Date(TUESDAY_MORNING);
    var routes = TimeTables.getRoutesForTrip(
      mondayMorning,
      'palo-alto',
      'san-francisco'
    );

    expect(routes.length).toBe(29);
    var routeTimes = TimeTables.getSortedRouteTimes(routes);
    expect(routeTimes[0]).toBe(40);
    expect(routeTimes[1]).toBe(41);
    expect(routeTimes[routeTimes.length - 1]).toBe(67);
  });

  it('can clone routes to previous day', function() {
    var pretendRoute = {
      id: 123,
      type: 'LOCAL',
      stops: {
        'palo-alto': '11:30pm',
        'san-francisco': '+1:10am'
      }
    };

    var prevDayRoute = TimeTables._cloneRouteToPreviousDay(pretendRoute);

    expect(_jsonStringify(prevDayRoute)).toBe(_jsonStringify({
      id: 123,
      type: 'LOCAL',
      stops: {
        'palo-alto': '-11:30pm',
        'san-francisco': '1:10am'
      }
    }));
  });

  it('can merge schedule directions', function() {
    var thisDayDir = [{
      id: 123,
      type: 'LOCAL',
      stops: {
        'palo-alto': '4:00am',
        'san-francisco': '5:00am',
      }
    }];
    var previousDayDir = [{
      id: 124,
      type: 'LOCAL',
      stops: {
        'palo-alto': '5:00pm',
        'san-francisco': '6:00pm',
      }
    }, {
      id: 125,
      type: 'LOCAL',
      stops: {
        'palo-alto': '9:00pm',
        'san-francisco': '+1:00am',
      }
    }];

    var result = TimeTables._mergeScheduleDirection(previousDayDir, thisDayDir);
    expect(_jsonStringify(result)).toBe(_jsonStringify([{
      id: 125,
      type: 'LOCAL',
      stops: {
        'palo-alto': '-9:00pm',
        'san-francisco': '1:00am',
      }
    }, {
      id: 123,
      type: 'LOCAL',
      stops: {
        'palo-alto': '4:00am',
        'san-francisco': '5:00am',
      }
    }]));

    var thisDayDir = [{
      id: 123,
      type: 'LOCAL',
      stops: {
        'palo-alto': '4:00am',
        'san-francisco': '5:00am',
      }
    }, {
      id: 1,
      type: 'BABY_BULLET',
      stops: {
        'palo-alto': '6:00am',
        'san-francisco': '7:00am',
      }
    }];

    var previousDayDir = [{
      id: 124,
      type: 'LOCAL',
      stops: {
        'palo-alto': '5:00pm',
        'san-francisco': '6:00pm',
      }
    }, {
      id: 125,
      type: 'LOCAL',
      stops: {
        'palo-alto': '9:00pm',
        '22nd-street': '+12:10am',
        'san-francisco': '+1:00am',
      }
    }, {
      id: 126,
      type: 'LOCAL',
      stops: {
        'palo-alto': '+1:00am',
        '22nd-street': '+2:10am',
        'san-francisco': '+3:00am',
      }
    }];

    var result = TimeTables._mergeScheduleDirection(previousDayDir, thisDayDir);
    expect(_jsonStringify(result)).toBe(_jsonStringify([{
      id: 125,
      type: 'LOCAL',
      stops: {
        'palo-alto': '-9:00pm',
        '22nd-street': '12:10am',
        'san-francisco': '1:00am',
      }
    }, {
      id: 126,
      type: 'LOCAL',
      stops: {
        'palo-alto': '1:00am',
        '22nd-street': '2:10am',
        'san-francisco': '3:00am',
      }
    }, {
      id: 123,
      type: 'LOCAL',
      stops: {
        'palo-alto': '4:00am',
        'san-francisco': '5:00am',
      }
    }, {
      id: 1,
      type: 'BABY_BULLET',
      stops: {
        'palo-alto': '6:00am',
        'san-francisco': '7:00am',
      }
    }]));
  });

  it('can merge in the previou day', function() {
    var schedule = TimeTables.getScheduleForDay(new Date(THURSDAY_AFTER_MIDNIGHT));
  });

  it('can filter stations based on the day', function() {
    var allStations = Stations.getAllStations();

    var weekdayStations = TimeTables.getStationsForDay(
      new Date(TUESDAY_MORNING)
    );
    expect(weekdayStations.length)
      .toBeLessThan(allStations.length, 'weekday has less stations');

    expect(weekdayStations.length)
      .toBe(29, 'it has 29 stations');
  });
});
