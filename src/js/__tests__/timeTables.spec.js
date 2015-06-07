var Stations = require('../constants/Stations');
var TrainTypes = require('../constants/TrainTypes');
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

});
