var assign = require('object-assign');
var React = require('react-native');
var {
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} = React;

var Colors = require('../constants/Colors');
var Emoji = require('../constants/Emoji');
var TripStore = require('../stores/TripStore');
var TimeTables = require('../time_tables/TimeTables');

var TimesView = React.createClass({

  propTypes: {
    navigator: React.PropTypes.object.isRequired,
  },

  render: function() {
    var stopOneID = TripStore.getDepartureStationID();
    var stopTwoID = TripStore.getArrivalStationID();
    var key = stopOneID + stopTwoID;

    return (
      <View key={key}>
        {this.renderImpl()}
      </View>
    );
  },

  renderImpl: function() {
    var stopOneID = TripStore.getDepartureStationID();
    var stopTwoID = TripStore.getArrivalStationID();
    var routes = TimeTables.getRoutesForTrip(
      new Date(1433781124337), // TODO -- not monday
      stopOneID,
      stopTwoID
    );

    if (!routes) {
      return (
        <View>
          <Text>
            Oh no! We didn{"'"}t find any
            routes for the stations you selected.
            This usually doesn{"'"}t happen --
            are you sure CalTrain stops at those
            stations?
          </Text>
        </View>
      );
    }

    // TODO -- some kind of: header like
    // Heading FROM xx TO xx
    // List of times
    // Details view that expands
    // Make sure to key by maybe the routeInfo?

    return (
      <View>
        <Text>
          {routes[0].timeLeaving.toString()}
          {routes[0].timeArriving.toString()}
        </Text>
      </View>
    );
  },
  
});

var styles = StyleSheet.create({
  omitStation: {
    opacity: 0.5,
    backgroundColor: '#111'
  },
  callToAction: {
    backgroundColor: Colors.DEEPER,
    padding: 12,
  },
  callToActionText: {
    color: '#111'
  },
  divider: {
    height: 1,
    backgroundColor: Colors.DEEPER,
  },
  textContainer: {
    padding: 16,
  },
  stationName: {
    color: '#EEE'
  },
  container: {
    backgroundColor: Colors.GREY,
  },
});

module.exports = TimesView;
