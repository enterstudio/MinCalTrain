var assign = require('object-assign');
var React = require('react-native');
var {
  ScrollView,
  StyleSheet,
  Text,
  View,
} = React;

var Colors = require('../constants/Colors');
var Routes = require('../constants/Routes');
var StationSelectView = require('../views/StationSelectView');

var DepartureSelectView = React.createClass({

  propTypes: {
    navigator: React.PropTypes.object.isRequired,
  },

  render: function() {
    return (
      <View>
        <View style={styles.headerSpacer} />
        <View style={styles.callToAction}>
          <Text style={styles.callToActionText}>
            Departing from?
          </Text>
        </View>
        <StationSelectView
          onStationSelect={() => {
            // TODO -- flux dispatch
            this.props.navigator.push(
              Routes.getRouteForID(Routes.SELECT_ARRIVAL)
            );
          }}
        />
      </View>
    );
  },

});

var styles = StyleSheet.create({
  callToAction: {
    backgroundColor: Colors.DEEPER,
    padding: 12,
  },
  callToActionText: {
    color: '#111'
  },
  headerSpacer: {
    backgroundColor: Colors.SHE_DRESSED_ME,
    height: 22,
  },
});


module.exports = DepartureSelectView;
