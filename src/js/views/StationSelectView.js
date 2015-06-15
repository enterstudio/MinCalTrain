var React = require('react-native');
var {
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} = React;

var Colors = require('../constants/Colors');
var Routes = require('../constants/Routes');
var Stations = require('../constants/Stations');
var TimeTables = require('../time_tables/TimeTables');
var ListRowView = require('../views/ListRowView');

var StationSelectView = React.createClass({

  propTypes: {
    onStationSelect: React.PropTypes.func.isRequired,
    omitStation: React.PropTypes.string,
  },

  render: function() {
    // TODO -- not monday morning
    var todayStations = TimeTables.getStationsForDay(
      new Date(1433781124337)
    );
    return (
      <ScrollView 
        style={styles.container}>
        <View style={styles.stationContainer}>
          {todayStations.map(
            (station) => this.renderStationSelector(station),
          )}
        </View>
      </ScrollView>
    );
  },

  renderStationSelector: function(station) {
    var stationView = (
      <ListRowView>
        {station.name}
      </ListRowView>
    );

    if (this.props.omitStation &&
        station.id === this.props.omitStation) {
      return (
        <View 
          key={station.id}
          style={styles.omitStation}>
          {stationView}
        </View>
      );
    }

    return (
      <TouchableHighlight
        key={station.id}
        onPress={this.props.onStationSelect.bind(this, station.id)}
        underlayColor={Colors.LIOHUA}>
        <View>
          {stationView}
        </View>
      </TouchableHighlight>
    );
  },

});

var styles = StyleSheet.create({
  omitStation: {
    opacity: 0.5,
    backgroundColor: '#111'
  },
  stationContainer: {
    flex: 1,
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

module.exports = StationSelectView;
