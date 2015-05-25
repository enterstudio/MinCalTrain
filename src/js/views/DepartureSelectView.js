var assign = require('object-assign');
var React = require('react-native');
var {
  ScrollView,
  StyleSheet,
  Text,
  View,
} = React;

var AppViews = require('../views/AppViews');
var Emoji = require('../constants/Emoji');
var {
  HeaderSpacer,
} = AppViews;
var Colors = require('../constants/Colors');
var Routes = require('../constants/Routes');
var StationSelectView = require('../views/StationSelectView');
var TripActions = require('../actions/TripActions');
var TripStore = require('../stores/TripStore');

var AppStyles = require('../constants/AppStyles');

var DepartureSelectView = React.createClass({

  propTypes: {
    navigator: React.PropTypes.object.isRequired,
  },

  render: function() {
    return (
      <View>
        <HeaderSpacer />
        <View style={styles.callToAction}>
          <Text style={styles.callToActionText}>
            Departing from?
          </Text>
          <Text style={AppStyles.stationSelectEmojiText}>
            {Emoji.TRAIN}
            {Emoji.RIGHT_ARROW}
          </Text>
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
  callToAction: {
    backgroundColor: Colors.DEEPER,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  callToActionText: {
    color: '#111'
  },
});

module.exports = DepartureSelectView;
