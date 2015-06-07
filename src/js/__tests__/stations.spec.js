var Stations = require('../constants/Stations');

describe('Stations', function() {

  it('has every station in the order list', function() {
    var stationsByID = Stations.__getStationsByID();
    var allStations = Stations.getAllStations();

    var seenStations = {};
    allStations.forEach(function(station) {
      seenStations[station.id] = true;
    });

    expect(Object.keys(seenStations).length)
      .toBe(Object.keys(stationsByID).length);
  });

});
