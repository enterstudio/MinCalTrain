var assign = require('object-assign');
var React = require('react-native');
var {
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} = React;

var Routes = require('../constants/Routes');
var Stations = require('../constants/Stations');

var DepartureSelectView = React.createClass({

  propTypes: {
    navigator: React.PropTypes.object.isRequired,
  },

  render: function() {
    return (
      <View style={styles.background}>
        <ScrollView style={styles.container}>
          <View style={styles.headerSpacer} />
          <View style={styles.stationContainer}>
            {Stations.map(
              (station) => this.renderStationSelector(station),
            )}
          </View>
        </ScrollView>
      </View>
    );
  },

  renderStationSelector: function(station) {
    return (
      <TouchableHighlight
        key={station.id}
        onPress={() => {
          // TODO -- flux dispatch
          this.props.navigator.push(
            Routes.getRouteForID(Routes.SELECT_ARRIVAL)
          );
        }}
        underlayColor="#6E6E6E">
        <View>
          <View style={styles.textContainer}>
            <Text>
              {station.name}
            </Text>
          </View>
          <View style={styles.divider} />
        </View>
      </TouchableHighlight>
    );
  },

});

var styles = StyleSheet.create({
  divider: {
    height: 1,
    marginBottom: 8,
    backgroundColor: '#FFF'
  },
  terminalContainer: {
    paddingTop: 8,
    paddingBottom: 8,
  },
  textContainer: {
    paddingLeft: 8,
    paddingRight: 8,
  },
  container: {
    padding: 8,
  },
  headerSpacer: {
    height: 24,
  },
});

module.exports = DepartureSelectView;
