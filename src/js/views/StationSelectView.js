var React = require('react-native');
var {
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
var BorderedScrollView = require('../views/BorderedScrollView');

var StationSelectView = React.createClass({

  propTypes: {
    onStationSelect: React.PropTypes.func.isRequired,
    omitStation: React.PropTypes.string,
    withAbout: React.PropTypes.bool,
    onAboutPress: React.PropTypes.func,
  },

  render: function() {
    var todayStations = TimeTables.getStationsForDay(
      new Date()
    );
    return (
      <BorderedScrollView 
        style={styles.container}>
        <View style={styles.stationContainer}>
          {todayStations.map(
            (station) => this.renderStationSelector(station),
          )}
          {this.renderAbout()}
        </View>
      </BorderedScrollView>
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

  renderAbout: function() {
    if (!this.props.withAbout) {
      return null;
    }
    return (
      <TouchableHighlight
        style={styles.aboutContainer}
        onPress={this.props.onAboutPress}
        underlayColor={Colors.AQUA_BURST}>
        <Text>
          About
        </Text>
      </TouchableHighlight>
    );
  },

});

var styles = StyleSheet.create({
  aboutContainer: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    color: '#EEE',
    backgroundColor: Colors.SHE_DRESSED_ME
  },
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
  textContainer: {
    padding: 16,
  },
  container: {
    backgroundColor: Colors.GREY,
    flex: 1,
  },
});

module.exports = StationSelectView;
