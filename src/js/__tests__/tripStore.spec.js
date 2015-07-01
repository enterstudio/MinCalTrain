var TripActions = require('../actions/TripActions');
var TripStore = require('../stores/TripStore');

describe('TripStore', function() {

  it('handles station updates', function() {
    TripActions.selectDeparture('palo-alto');
    TripActions.selectArrival('redwood-city');

    expect(TripStore.getDepartureStationID())
      .toBe('palo-alto');

    expect(TripStore.getArrivalStationID())
      .toBe('redwood-city');

    // and the favorite trip is set
    var favoriteTrips = TripStore.getFavoriteTrips();
    expect(favoriteTrips.length).toBe(1);
    expect(JSON.stringify(favoriteTrips))
      .toBe(JSON.stringify([
        {
          departureID: 'palo-alto',
          arrivalID: 'redwood-city'
        }
      ]));
  });

  it('respects the guard', function() {
    TripActions.setFavoritesGuard(true);
    TripActions.clearFavoriteTrips();

    TripActions.selectDeparture('palo-alto');
    TripActions.selectArrival('redwood-city');

    expect(JSON.stringify(TripStore.getFavoriteTrips()))
      .toBe(JSON.stringify([]));
    TripActions.setFavoritesGuard(false);

    TripActions.selectDeparture('palo-alto');
    TripActions.selectArrival('redwood-city');

    expect(JSON.stringify(TripStore.getFavoriteTrips()))
      .toBe(JSON.stringify([
        {
          departureID: 'palo-alto',
          arrivalID: 'redwood-city'
        }
      ]));
    TripActions.clearFavoriteTrips();
  });

  it('handles multiple fav trips', function() {
    TripActions.selectDeparture('palo-alto');
    TripActions.selectArrival('redwood-city');

    expect(JSON.stringify(TripStore.getFavoriteTrips()))
      .toBe(JSON.stringify([
        {
          departureID: 'palo-alto',
          arrivalID: 'redwood-city'
        }
      ]));

    TripActions.selectDeparture('san-francisco');
    TripActions.selectArrival('palo-alto');

    expect(JSON.stringify(TripStore.getFavoriteTrips()))
      .toBe(JSON.stringify([
        {
          departureID: 'san-francisco',
          arrivalID: 'palo-alto'
        }, {
          departureID: 'palo-alto',
          arrivalID: 'redwood-city'
        }
      ]));

    TripActions.selectDeparture('palo-alto');
    TripActions.selectArrival('redwood-city');

    // simply shuffles
    expect(JSON.stringify(TripStore.getFavoriteTrips()))
      .toBe(JSON.stringify([
        {
          departureID: 'palo-alto',
          arrivalID: 'redwood-city'
        }, {
          departureID: 'san-francisco',
          arrivalID: 'palo-alto'
        }
      ]));

    TripActions.selectDeparture('palo-alto');
    TripActions.selectArrival('redwood-city');

    // no change
    expect(JSON.stringify(TripStore.getFavoriteTrips()))
      .toBe(JSON.stringify([
        {
          departureID: 'palo-alto',
          arrivalID: 'redwood-city'
        }, {
          departureID: 'san-francisco',
          arrivalID: 'palo-alto'
        }
      ]));

    TripActions.selectDeparture('san-francisco');
    TripActions.selectArrival('california-ave');

    expect(JSON.stringify(TripStore.getFavoriteTrips()))
      .toBe(JSON.stringify([
        {
          departureID: 'san-francisco',
          arrivalID: 'california-ave'
        }, {
          departureID: 'palo-alto',
          arrivalID: 'redwood-city'
        }
      ]));

    TripActions.selectDeparture('san-francisco');
    TripActions.selectArrival('22nd-street');

    // only 3
    expect(JSON.stringify(TripStore.getFavoriteTrips()))
      .toBe(JSON.stringify([
        {
          departureID: 'san-francisco',
          arrivalID: '22nd-street'
        }, {
          departureID: 'san-francisco',
          arrivalID: 'california-ave'
        }
      ]));

    TripActions.clearFavoriteTrips();
    expect(JSON.stringify(TripStore.getFavoriteTrips()))
      .toBe(JSON.stringify([]));
  });

  it('prevents bad station IDs', function() {
    expect(function() {
      TripActions.selectDeparture('foobarbaz');
    }).toThrow();
  });
});
