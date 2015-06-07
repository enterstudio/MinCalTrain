var Stations = require('../constants/Stations');
var TrainTypes = require('../constants/TrainTypes');
var TimeTables = require('../time_tables/TimeTables');
var Schedules = [
  require('../time_tables/WeekdayNorthbound'),
];

var STATIONS_BY_ID = Stations.__getStationsByID();

var trainLoop = function(callback) {
  Schedules.forEach(function(schedule) {
    schedule.forEach(function(train) {
      callback(train);
    });
  });
};

var stopLoop = function(callback) {
  trainLoop(function(train) {
    Object.keys(train.stops).forEach(function(stationID) {
      callback(stationID, train.stops[stationID]);
    });
  });
};

describe('time tables', function() {
  it('each has an ID and type', function() {
    trainLoop(function(train) {

      expect(train.id)
        .toBeTruthy();
      expect(train.type)
        .toBeTruthy();
      expect(TrainTypes[train.type])
        .toBeTruthy();

    }.bind(this));;
  });

  it('each stop is a valid station', function() {
    stopLoop(function(stationID, time) {
      expect(STATIONS_BY_ID[stationID])
        .toBeTruthy('StationID ' + stationID + ' should exist');
    });
  });

  it('has a schedule for all days', function() {
    var date = new Date();
    for (var day = 0; day < 6; day++) {
      // Hack -- get our desired day by just adding
      // 1 to the date
      while (date.getDay() !== day) {
        date.setDate(date.getDate() + 1);
      }

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

});
