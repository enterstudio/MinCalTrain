var React = require('react-native');
var {
  ScrollView,
  Text,
  View,
  StyleSheet,
  PanResponder,
  Animated,
  LayoutAnimation,
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

const DecisionThreshold = 120;
const RightDistanceMax = 20;

var FavoriteTrip = React.createClass({

  propTypes: {
    trip: React.PropTypes.object.isRequired,
    navigator: React.PropTypes.object.isRequired,
  },

  getInitialState() {
    var pan = new Animated.ValueXY();
    pan.addListener(() => {
      this.isMounted() && this.forceUpdate();
    });
    return {
      renderHeight: null,
      highlighted: false,
      pan
    };
  },

  componentWillMount() {
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetResponderCapture: () => true,
      onMoveShouldSetPanResponderCapture: () => true,

      onPanResponderTerminate: (e, {dx, dy, vx, vy}) => {
        Animated.spring(this.state.pan, {
          toValue: {x: 0, y: 0},
          friction: 3,
        }).start();
        this.setState({
          highlighted: false,
        });
      },

      onPanResponderGrant: (e, {dx, dy}) => {
        this.state.pan.setOffset({x: dx, y: dy});
        this.state.pan.setValue({x: 0, y: 0});

        setTimeout(() => {
          // tapping and not moving, so show the progress
          if (this.state.pan.x.__getValue() === 0) {
            this.setState({
              highlighted: true,
            });
          }
        }, 30);
      },

      onPanResponderMove: (e, {dx, dy}) => {
        if (dx < 0 || dx > RightDistanceMax) {
          this.setState({
            highlighted: false,
          });
        }
        this.state.pan.setValue({
          x: Math.min(0, dx),
        });
      },

      onPanResponderRelease: (e, {dx, dy, vx, vy}) => {
        // Highlighted state keeps track of whether we were
        // ever not a tap action.
        var wasHighlighted = this.state.highlighted;

        this.setState({
          highlighted: false,
        });

        var isTapAction = (dx === 0 && dy === 0) ||
          (dx > 0 && dx < RightDistanceMax);

        if (isTapAction && wasHighlighted) {
          // tap action, so go do that
          var trip = this.props.trip;
          TripActions.setFavoritesGuard(true);
          TripActions.selectDeparture(trip.departureID);
          TripActions.selectArrival(trip.arrivalID);
          TripActions.setFavoritesGuard(false);
          this.props.navigator.push(
            Routes.getRouteForID(Routes.TIMES)
          );
          return;
        } else if (dx < -DecisionThreshold && dx < 0) {
          Animated.decay(this.state.pan.x, {
            velocity: vx,
            deceleration: 0.98,
          }).start(() => {
            var trip = this.props.trip;
            TripActions.removeFavoriteTrip(
              trip.departureID,
              trip.arrivalID
            );
            LayoutAnimation.easeInEaseOut();
            this._resetState();
          });
        } else {
          Animated.spring(this.state.pan, {
            toValue: {x: 0, y: 0},
            friction: 3,
          }).start();
        }
      },
    });
  },

  _resetState() {
    this.state.pan.setValue({x: 0, y: 0});
  },

  render: function() {
    var pan = this.state.pan;
    let [translateX] = [pan.x.__getValue()];
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

    var containerStyle = {};
    if (this.state.highlighted) {
      containerStyle.backgroundColor = Colors.LIOHUA;
    }

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
          <View style={[styles.favContainer, containerStyle]}>
            <Text style={styles.favText}>
              {Stations.getStationName(trip.departureID)}
              {' to '}
              {Stations.getStationName(trip.arrivalID)}
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
    this._storeCB = () => {
      this.isMounted() && this.forceUpdate();
    };
    TripStore.subscribe(this._storeCB);
    Analytics.logOpen();
  },

  componentWillUnmount: function() {
    TripStore.unsubscribe(this._storeCB);
  },

  render: function() {
    return (
      <BackgroundCoverView
        withAbout={true}
        imageName="smif">
        <View style={styles.headerSpacer} />
        <View style={styles.topBorder} />
        <ScrollView style={styles.scrollView}>
          {this.renderFavoriteTrips()}
          <CallToActionRowView
            label="Departing from?">
            <EmojiRowEndView>
              {Emoji.TRAIN}
            </EmojiRowEndView>
          </CallToActionRowView>
          <StationSelectView
            withAbout={true}
            justView={true}
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
        </ScrollView>
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
  scrollView: {
    flex: 1,
    backgroundColor: Colors.GREY,
  },
  topBorder: {
    height: 1,
    backgroundColor: Colors.DEEPER,
  },
  headerSpacer: {
    height: 20
  },
  animatedContainer: {
    backgroundColor: 'rgba(0,0,0,0)',
  },
  favContainer: {
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0)',
  },
  favText: {
    color: '#EEE',
    fontSize: 20,
    lineHeight: 20,
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
