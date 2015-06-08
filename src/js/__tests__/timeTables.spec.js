var Directions = require('../constants/Directions');
var Stations = require('../constants/Stations');
var TrainTypes = require('../constants/TrainTypes');
var TimeTables = require('../time_tables/TimeTables');
var Schedules = [
  require('../time_tables/WeekdayNorthbound'),
];

var STATIONS_BY_ID = Stations.__getStationsByID();

var _trainLoop = function(callback) {
  Schedules.forEach(function(schedule) {
    schedule.forEach(function(train) {
      callback(train);
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

var _getDateForDay = function(day) {
  var date = new Date();
  // Hack -- get our desired day by just adding
  // 1 to the date
  while (date.getDay() !== day) {
    date.setDate(date.getDate() + 1);
  }
  return date;
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
              'to be later than ' + currentTime.toString() +
              'for stopID ' + stopID + ' and train ' + train.id
          );
        currentTime = thisStopTime;
      });

    });
  });

  it('has a schedule for all days', function() {
    for (var day = 0; day < 6; day++) {
      var date = _getDateForDay(day);
      if (day === 0 || day === 1) {
        expect(function() {
          TimeTables.getScheduleForDay(date);
        }).toThrow();
        return;
      }

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

});
