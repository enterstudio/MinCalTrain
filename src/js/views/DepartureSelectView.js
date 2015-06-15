var React = require('react-native');
var {
  ScrollView,
  StyleSheet,
  Text,
  Image,
  View,
} = React;

var Emoji = require('../constants/Emoji');
var Colors = require('../constants/Colors');
var Routes = require('../constants/Routes');
var StationSelectView = require('../views/StationSelectView');
var TripActions = require('../actions/TripActions');
var TripStore = require('../stores/TripStore');
var EmojiRowEndView = require('../views/EmojiRowEndView');
var CallToActionRowView = require('../views/CallToActionRowView');

var DepartureSelectView = React.createClass({

  propTypes: {
    navigator: React.PropTypes.object.isRequired,
  },

  render: function() {
    return (
      <View style={styles.metaContainer}>
        <View style={styles.callToAction}>
          <CallToActionRowView
            label="Departing from?">
            <EmojiRowEndView>
              {Emoji.TRAIN}
              {Emoji.RIGHT_ARROW}
            </EmojiRowEndView>
          </CallToActionRowView>
        </View>
        <StationSelectView
          onStationSelect={(stationID) => {
            TripActions.selectDeparture(stationID);
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
  metaContainer: {
    margin: 20,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: Colors.DEEPER,
  },
});

module.exports = DepartureSelectView;
