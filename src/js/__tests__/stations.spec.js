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

  it('has northBound and southBound indexes', function() {

    var currentNorth = Stations.getAllStations().length;
    var currentSouth = -1;
    Stations.getAllStations().forEach(function(station) {
      expect(station.northBoundIndex !== undefined)
        .toBe(true);
      expect(station.southBoundIndex !== undefined)
        .toBe(true);

      expect(station.northBoundIndex < currentNorth)
        .toBe(true);
      currentNorth = station.northBoundIndex;

      expect(station.southBoundIndex > currentSouth)
        .toBe(true);
      currentSouth = station.southBoundIndex;

    });
  });

});
