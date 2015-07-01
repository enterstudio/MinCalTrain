var React = require('react-native');
var {
  ScrollView,
  Text,
  View,
  StyleSheet,
  TouchableHighlight,
} = React;

var Emoji = require('../constants/Emoji');
var Routes = require('../constants/Routes');
var StationSelectView = require('../views/StationSelectView');
var Colors = require('../constants/Colors');
var Stations = require('../constants/Stations');
var TripActions = require('../actions/TripActions');
var TripStore = require('../stores/TripStore');
var EmojiRowEndView = require('../views/EmojiRowEndView');
var CallToActionRowView = require('../views/CallToActionRowView');
var BackgroundCoverView = require('../views/BackgroundCoverView');
var ListRowView = require('../views/ListRowView');
var BorderedScrollView = require('../views/BorderedScrollView');

var DepartureSelectView = React.createClass({

  propTypes: {
    navigator: React.PropTypes.object.isRequired,
  },

  componentDidMount: function() {
    TripStore.subscribe(() => this.forceUpdate());
  },

  componentDidUnmount: function() {
    TripStore.unsubscribe(() => this.forceUpdate());
  },

  render: function() {
    return (
      <BackgroundCoverView
        withAbout={true}
        imageName="smif">
        {this.renderFavoriteTrips()}
        <CallToActionRowView
          label="Departing from?">
          <EmojiRowEndView>
            {Emoji.TRAIN}
            {Emoji.RIGHT_ARROW}
          </EmojiRowEndView>
        </CallToActionRowView>
        <StationSelectView
          withAbout={true}
          onAboutPress={
            () => this.props.navigator.push(
              Routes.getRouteForID(Routes.ABOUT)
            )
          }
          onStationSelect={(stationID) => {
            TripActions.selectDeparture(stationID);
            this.props.navigator.push(
              Routes.getRouteForID(Routes.SELECT_ARRIVAL)
            );
          }}
        />
      </BackgroundCoverView>
    );
  },

  renderFavoriteTrips: function() {
    var favoriteTrips = TripStore.getFavoriteTrips();
    if (!favoriteTrips.length) {
      return;
    }

    return (
      <View>
        <CallToActionRowView
          label="Recent routes:">
          <EmojiRowEndView>
            {Emoji.REVOLVING_HEARTS}
          </EmojiRowEndView>
        </CallToActionRowView>
        <View style={styles.favoritesContainer}>
          {favoriteTrips.map(
            (trip) => this.renderFavoriteTrip(trip)
          )}
        </View>
      </View>
    );
  },

  renderFavoriteTrip: function(trip) {
    var key = trip.departureID + trip.arrivalID;
    return (
      <TouchableHighlight
        onPress={() => {
          TripActions.setFavoritesGuard(true);
          TripActions.selectDeparture(trip.departureID);
          TripActions.selectArrival(trip.arrivalID);
          TripActions.setFavoritesGuard(false);
          this.props.navigator.push(
            Routes.getRouteForID(Routes.TIMES)
          );
        }}
        underlayColor={Colors.LIOHUA}>
        <View>
          <ListRowView key={key}>
            <Text style={styles.favText}>
              <Text style={styles.boldText}>
                {Stations.getStationName(trip.departureID)}
              </Text>
              {' to '}
              <Text style={styles.boldText}>
                {Stations.getStationName(trip.arrivalID)}
              </Text>
            </Text>
          </ListRowView>
        </View>
      </TouchableHighlight>
    );
  }

});

var styles = StyleSheet.create({
  favText: {
    fontSize: 14,
  },
  boldText: {
    fontWeight: 'bold',
  },
  favoritesContainer: {
    backgroundColor: Colors.GREY,
    opacity: 0.9
  }
});

module.exports = DepartureSelectView;
