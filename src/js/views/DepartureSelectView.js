var React = require('react-native');
var {
  ScrollView,
  Text,
  View,
  StyleSheet,
  TouchableHighlight,
  PanResponder,
  Animated,
} = React;

var Analytics = require('../util/Analytics');
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

var FavoriteTrip = React.createClass({
  propTypes: {
    trip: React.PropTypes.object.isRequired,
    navigator: React.PropTypes.object.isRequired,
  },

  getInitialState: function() {
    var pan = new Animated.ValueXY();
    pan.addListener(() => this.forceUpdate());
    return {
      renderHeight: null,
      pan
    };
  },

  componentWillMount() {
    this._panResponder = PanResponder.create({
      onMoveShouldSetResponderCapture: () => true,
      onMoveShouldSetPanResponderCapture: () => true,

      onResponderGrant: () => {
        console.log('overall grant');
      },

      onPanResponderGrant: (e, {dx, dy}) => {
        this.state.pan.setOffset({x: dx, y: dy});
        this.state.pan.setValue({x: 0, y: 0});
      },

      onPanResponderMove: (e, {dx, dy}) => {
        this.state.pan.setValue({
          x: dx,
          y: dy,
        });
      },

      onPanResponderRelease: (e, {dx, vx, vy}) => {
        console.log('released');
        Animated.spring(this.state.pan, {
          toValue: {x: 0, y: 0},
          friction: 3,
        }).start();
      },
    });
  },

  render: function() {
    var pan = this.state.pan;
    let [translateX] = [pan.x.__getValue()];
    /*
                TripActions.removeFavoriteTrip(
                  trip.departureID,
                  trip.arrivalID
                  );*/
    let opacity = pan.x.interpolate(
      {inputRange: [-200, 0, 200], outputRange: [0.5, 1, 0.5]}
    ).__getValue();
    var transforms = [{translateX}];
    var animatedStyle = {opacity};

    if (this.state.renderHeight) {
      var h = this.state.renderHeight;
      let height = pan.x.interpolate(
         {inputRange: [-300, 0, 300], outputRange: [0, h, 0]}
      ).__getValue();
      let scaleY = pan.x.interpolate(
         {inputRange: [-300, 0, 300], outputRange: [0, 1, 0]}
      ).__getValue();

      animatedStyle.height = height;
      transforms.push({scaleY});
    }
    animatedStyle.transform = transforms;

    var trip = this.props.trip;
    return (
      <Animated.View
        onLayout={(data) => {
          if (this.state.renderHeight === null) {
            this.setState({
              renderHeight: data.nativeEvent.layout.height
            });
          }
        }}
        style={[styles.animatedContainer, animatedStyle]}
        {...this._panResponder.panHandlers}>
        <ListRowView nonText={true}>
          <View style={styles.favContainer}>
            <Text style={styles.favText}>
              <Text style={styles.boldText}>
                {Stations.getStationName(trip.departureID)}
              </Text>
              {' to '}
              <Text style={styles.boldText}>
                {Stations.getStationName(trip.arrivalID)}
              </Text>
            </Text>
          </View>
        </ListRowView>
      </Animated.View>
    );
  }

});

var DepartureSelectView = React.createClass({

  propTypes: {
    navigator: React.PropTypes.object.isRequired,
  },

  componentDidMount: function() {
    TripStore.subscribe(() => this.forceUpdate());
    Analytics.logOpen();
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
      <FavoriteTrip
        trip={trip}
        navigator={this.props.navigator}
        key={key}
      />
    );
  }

});

var styles = StyleSheet.create({
  animatedContainer: {
    backgroundColor: 'rgba(0,0,0,0)',
  },
  favContainer: {
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0)',
  },
  favText: {
    color: '#EEE',
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
