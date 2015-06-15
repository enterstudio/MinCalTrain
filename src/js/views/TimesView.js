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
    // Key by stops so this will refresh in case we change.
    // Another thing to keep in mind is if we have departure
    // time offsets.
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

    // TODO -- scared emoji
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
      <ScrollView>
        {routes.map(route => this.renderRoute(route))}
      </ScrollView>
    );
  },

  renderRoute: function(route) {
    return (
      <View 
        style={styles.route}
        key={route.timeLeaving.getTime()}>
        <Text>
          Train leaving at
          {route.timeLeaving.toString()}
          arriving at
          {route.timeLeaving.toString()}
          taking
          X
          minutes
        </Text>
      </View>
    );
  },
  
});

var styles = StyleSheet.create({
  route: {
    height: 100,
  }
});

module.exports = TimesView;
