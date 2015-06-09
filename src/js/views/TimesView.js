var assign = require('object-assign');
var React = require('react-native');
var {
  ScrollView,
  StyleSheet,
  Text,
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
    var routes = TimeTables.getRoutesForTrip(
      new Date(1433781124337),
      stopOneID,
      stopTwoID
    );
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

module.exports = TimesView;
