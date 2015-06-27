var moment = require('moment');
var React = require('react-native');
var {
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} = React;

var formatTimeAmount = require('../util/formatTimeAmount');
var Colors = require('../constants/Colors');
var Emoji = require('../constants/Emoji');
var TrainTypes = require('../constants/TrainTypes');
var TripStore = require('../stores/TripStore');
var TimeTables = require('../time_tables/TimeTables');
var EmojiRowEndView = require('../views/EmojiRowEndView');
var CallToActionRowView = require('../views/CallToActionRowView');
var ListRowView = require('../views/ListRowView');
var Stations = require('../constants/Stations');
var BorderedScrollView = require('../views/BorderedScrollView');
var BackgroundCoverView = require('../views/BackgroundCoverView');

var TimesView = React.createClass({

  propTypes: {
    navigator: React.PropTypes.object.isRequired,
  },

  render: function() {
    var stopOneID = TripStore.getDepartureStationID();
    var stopTwoID = TripStore.getArrivalStationID();
    // Key by stops so this will refresh in case we change.
    // Another thing to keep in mind is if we have departure
    // time offsets.
    var key = stopOneID + stopTwoID;

    return (
      <View style={styles.metaContainer} key={key}>
        <BackgroundCoverView imageName="jun_seita">
          {this.renderImpl()}
        </BackgroundCoverView>
      </View>
    );
  },

  renderImpl: function() {
    var stopOneID = TripStore.getDepartureStationID();
    var stopTwoID = TripStore.getArrivalStationID();
    var routes = TimeTables.getRoutesForTrip(
      new Date(),
      stopOneID,
      stopTwoID
    );

    if (!routes || !routes.length) {
      return (
        <View style={styles.noStopsText}>
          <Text>
            Oh no! 
            {Emoji.FACE_SCARED}
            We didn{"'"}t find any
            routes for the stations you selected.
            This usually doesn{"'"}t happen --
            are you sure CalTrain stops at those
            stations after this time?
          </Text>
        </View>
      );
    }

    var routeTimes = TimeTables.getSortedRouteTimes(routes);
    // TODO -- some kind of: header like
    // Heading FROM xx TO xx
    return (
      <View style={styles.metaContainer}>
        <CallToActionRowView
          label="Have fun on your trip!">
          <EmojiRowEndView>
            {Emoji.HORIZONTAL_TRAFFIC_LIGHT}
            {Emoji.STATION}
          </EmojiRowEndView>
        </CallToActionRowView>
        {this.renderHeader(routeTimes)}
        <BorderedScrollView>
          <View style={styles.scrollContainer}>
            {routes.map(route => this.renderRoute(route, routeTimes))}
          </View>
        </BorderedScrollView>
      </View>
    );
  },

  renderRoute: function(route, routeTimes) {
    var trainType = route.train.type;
    return (
      <ListRowView
        nonText={true}
        style={styles.timeContainer}
        key={route.timeLeaving.getTime()}>
        <View style={[
            styles.rowContainer,
            this.getStyleForTrainDuration(route, routeTimes)
          ]}>
          <Text style={styles.trainHeader}>
            Train
            {' '}
            {route.train.id}
            <Text style={styles.boldText}>
              {this.renderTrainLabel(trainType)}
            </Text>
          </Text>
          <Text style={styles.infoText}>
            Departs
            {' '}
            <Text style={styles.boldText}>
              {moment(route.timeLeaving).format('h:mm a')}
            </Text>
            {' '}
            taking
            {' '}
            <Text style={styles.boldText}>
              {formatTimeAmount.formatMilliseconds(
                route.timeArriving - route.timeLeaving
              )}
            </Text>
          </Text>
          <Text style={styles.subText}>
            Leaves 
            {' '}
            {moment(route.timeLeaving).fromNow()},
            arrives at
            {' '}
            {moment(route.timeArriving).format('h:mm a')}
          </Text>
        </View>
      </ListRowView>
    );
  },

  renderHeader: function(routeTimes) {
    var stopOneID = TripStore.getDepartureStationID();
    var stopTwoID = TripStore.getArrivalStationID();
    return (
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>
          <Text style={styles.boldText}>
            {Stations.getStationName(stopOneID) + ' '}
          </Text>
          to
          <Text style={styles.boldText}>
            {' ' + Stations.getStationName(stopTwoID)}
          </Text>
        </Text>
        {this.renderTimeRange(routeTimes)}
      </View>
    );
  },

  renderTimeRange: function(routeTimes) {
    if (routeTimes.length <= 1) {
      return (
        <Text style={styles.headerText}>
          {formatTimeAmount.formatMinutesAbbrev(routeTimes[0])}
        </Text>
      );
    }
    return (
      <Text style={styles.headerText}>
        {formatTimeAmount.formatMinutesAbbrev(routeTimes[0])}
        {' - '}
        {formatTimeAmount.formatMinutesAbbrev(routeTimes[routeTimes.length - 1])}
      </Text>
    );
  },

  getStyleForTrainDuration: function(route, routeTimes) {
    if (routeTimes.length === 1) {
      // Only one time at all
      return null;
    }

    var routeTime = TimeTables.getMinutesForRoute(route);
    switch (routeTimes.indexOf(routeTime)) {
      case 0:
        // fastest
        return styles.fastestRoute;
      case 1:
        if (routeTimes.length > 2) {
          // second fastest only relevant if theres something
          // slower
          return styles.secondFastestRoute;
        }
    }
    return null;
  },

  renderTrainLabel: function(trainType) {
    switch (trainType) {
      case TrainTypes.LIMITED_STOP:
        return ' Limited Stop';
      case TrainTypes.BABY_BULLET:
        return ' Baby Bullet!';
      case TrainTypes.WEEKEND_BABY_BULLET:
        return ' Weekend Baby Bullet!';
    }
    return '';
  },
  
});

var styles = StyleSheet.create({
  metaContainer: {
    flex: 1,
  },
  noStopsText: {
    backgroundColor: Colors.SHE_DRESSED_ME,
    padding: 12
  },
  fastestRoute: {
    backgroundColor: Colors.SHE_DRESSED_ME,
  },
  secondFastestRoute: {
    backgroundColor: Colors.DEEPER,
  },
  trainHeader: {
    fontSize: 10,
    color: '#CCC'
  },
  infoText: {
    color: '#EEE'
  },
  subText: {
    fontSize: 10,
    color: '#CCC'
  },
  rowContainer: {
    padding: 8,
    flex: 1,
  },
  timeContainer: {
    backgroundColor: Colors.GREY,
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  boldText: {
    fontWeight: 'bold',
  },
  headerContainer: {
    backgroundColor: Colors.DEEPER,
    paddingBottom: 12,
    paddingLeft: 12,
    paddingRight: 12,
  },
  headerText: {
    fontSize: 12,
    color: '#EEE'
  },
});

module.exports = TimesView;
