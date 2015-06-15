var React = require('react-native');
var {
  ScrollView,
  StyleSheet,
  Text,
  View,
} = React;

var Colors = require('../constants/Colors');
var Emoji = require('../constants/Emoji');
var Routes = require('../constants/Routes');
var StationSelectView = require('../views/StationSelectView');
var TripActions = require('../actions/TripActions');
var TripStore = require('../stores/TripStore');
var Stations = require('../constants/Stations');
var EmojiRowEndView = require('../views/EmojiRowEndView');
var CallToActionRowView = require('../views/CallToActionRowView');
var BackgroundCoverView = require('../views/BackgroundCoverView');

var ArrivalSelectView = React.createClass({

  propTypes: {
    navigator: React.PropTypes.object.isRequired,
  },

  render: function() {
    return (
      <BackgroundCoverView imageName="brian_tobin">
        <View style={styles.departingContainer}>
          {this.renderDeparting()}
        </View>
        <CallToActionRowView
          label="Arriving to?">
          <EmojiRowEndView>
            {Emoji.LOVE_HOTEL}
            {Emoji.END}
          </EmojiRowEndView>
        </CallToActionRowView>
        <StationSelectView
          omitStation={TripStore.getDepartureStationID()}
          onStationSelect={(stationID) => {
            TripActions.selectArrival(stationID);
            this.props.navigator.push(
              Routes.getRouteForID(Routes.TIMES)
            );
          }}
        />
      </BackgroundCoverView>
    );
  },

  renderDeparting: function() {
    var departureID = TripStore.getDepartureStationID();
    return (
      <Text style={styles.departingText}>
        Sweet, you{"'"}re leaving from
        {' ' + Stations.getStationName(departureID)}
      </Text>
    );
  },

});

var styles = StyleSheet.create({
  departingContainer: {
    backgroundColor: Colors.DEEPER,
    paddingTop: 12,
    paddingLeft: 12,
    paddingRight: 12,
  },
  departingText: {
    fontSize: 12,
    color: '#FFF'
  },
});

module.exports = ArrivalSelectView;
